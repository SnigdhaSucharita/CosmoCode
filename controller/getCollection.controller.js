const { photo: photoModel } = require("../models/photo");
const { tag: tagModel } = require("../models/tag");

const getAllSavedPhotos = async (req, res) => {
  const userId = req.user.id;
  try {
    const response = await photoModel.findAll({
      where: { userId },
      include: {
        model: tagModel,
        attributes: ["name"],
      },
      order: [["dateSaved", "DESC"]],
    });

    const photos = response.map((photo) => ({
      id: photo.id,
      imageUrl: photo.imageUrl,
      description: photo.description,
      altDescription: photo.altDescription,
      colorPalette: photo.colorPalette,
      suggestedTags: photo.suggestedTags,
      customTags: photo.tags?.map((tag) => tag.name) || [],
      dateSaved: photo.dateSaved.toISOString(),
    }));

    res.json({ photos });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch photo collection.",
      error: error.message,
    });
  }
};

module.exports = { getAllSavedPhotos };
