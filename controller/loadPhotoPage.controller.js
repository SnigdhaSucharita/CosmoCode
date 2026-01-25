const { photo: photoModel } = require("../models/photo");
const { tag: tagModel } = require("../models/tag");
const { photo: photoModel } = require("../models/photo");
const { callMirAI } = require("../lib/miraiClient");
const {} = require("../utils/imagePool.utils");

const loadPhotoPage = async (req, res) => {
  const { photoId } = req.params;
  const { userId } = req.user.id;

  const saved = await photoModel.findAll({ where: { photoId, userId } });

  if (!saved) {
    return res.status(404).json({ message: "Photo isn't saved by user" });
  }

  try {
    const photo = await photoModel.findByPk(photoId, {
      include: {
        model: tagModel,
        attributes: ["name"],
      },
    });

    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }

    const customTags = photo.tags?.map((tag) => tag.name) || [];

    const tags = [...customTags, ...photo.suggestedTags];

    const imagePool = await buildImagePoolFromUnsplash({
      query: photo.description || photo.altDescription,
      tags,
    });

    const recommendations = await callMirAI("/picstoria/recommend-images", {
      image_url: photo.imageUrl,
      image_pool: imagePool,
      top_k: 6,
      score_threshold: 0.3,
    });

    res.json({
      photo: {
        id: photo.id,
        imageUrl: photo.imageUrl,
        description: photo.description,
        altDescription: photo.altDescription,
        colorPalette: photo.colorPalette,
        suggestedTags: photo.suggestedTags,
        customTags: customTags,
        dateSaved: photo.dateSaved.toISOString(),
      },

      recommendations: recommendations.images,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = { loadPhotoPage };
