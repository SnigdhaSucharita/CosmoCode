const { Op } = require("sequelize");
const {
  SearchHistory: searchHistoryModel,
  Tag: tagModel
} = require("../models");

const searchPhotosByTag = async (req, res) => {
  const { tag, sort = "ASC" } = req.query;
  const userId = req.user.id;

  if (!tag || typeof tag !== "string") {
    return res.status(400).json({ message: "A valid tag must be provided." });
  }

  if (!["ASC", "DESC"].includes(sort.toUpperCase())) {
    return res
      .status(400)
      .json({ message: "sort order must be either ASC or DESC." });
  }

  try {
    if (userId) {
      await searchHistoryModel.create({
        query: tag,
        type: "tag-search",
        userId: parseInt(userId),
      });
    }

    const tagRecords = await tagModel.findAll({
      where: { name: tag },
    });

    if (tagRecords.length === 0) {
      return res
        .status(404)
        .json({ message: `No photos found for the tag: ${tag}` });
    }

    const photoIds = tagRecords.map((record) => record.photoId);
    const photos = await photoModel.findAll({
      where: { id: { [Op.in]: photoIds }, userId: userId },
      order: [["dateSaved", sort.toUpperCase()]],
      include: {
        model: tagModel,
        attributes: ["name"],
      },
    });

    const response = photos.map((photo) => ({
      id: photo.id,
      imageUrl: photo.imageUrl,
      description: photo.description,
      altDescription: photo.altDescription,
      dateSaved: photo.dateSaved,
      customTags: photo.tags.map((tag) => tag.name),
    }));

    res.json({ photos: response });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = { searchPhotosByTag };
