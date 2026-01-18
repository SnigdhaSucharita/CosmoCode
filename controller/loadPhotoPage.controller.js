const { photo: photoModel } = require("../models/photo");
const { tag: tagModel } = require("../models/tag");
const { callMirAI } = require("../lib/miraiClient");
const {} = require("../utils/imagePool.utils");

const loadPhotoPage = async (req, res) => {
  const { photoId } = req.params;

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

    const tags = photo.tags.map((t) => t.name);

    const imagePoolUrls = await buildImagePoolFromUnsplash({
      query: photo.description || photo.altDescription,
      tags,
    });

    const recommendations = await callMirAI("/picstoria/recommend-images", {
      image_url: photo.imageUrl,
      image_pool_urls: imagePoolUrls,
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
        dateSaved: photo.dateSaved,
        tags: tags,
      },

      recommendedImages: recommendations.images,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = { loadPhotoPage };
