const { tag: tagModel } = require("../models/tag");

const { containsNonEmptyStrings } = require("../validations/index");

const addTag = async (req, res) => {
  const { photoId } = req.params;
  const { tags } = req.body;

  if (!containsNonEmptyStrings(tags)) {
    return res.status(400).json({ message: "Tags must be non-empty strings." });
  }

  try {
    const existingTagObjects = await tagModel.findAll({ where: { photoId } });
    const existingTags = existingTagObjects.map((tag) => tag.name);
    const totalTags = [...new Set([...existingTags, ...tags])];

    if (totalTags.length > 5) {
      return res
        .status(400)
        .json({ message: "A photo can have a maximum of 5 tags." });
    }

    const tagsToAdd = tags.filter((tag) => !existingTags.includes(tag));
    await tagModel.bulkCreate(tagsToAdd.map((tag) => ({ name: tag, photoId })));

    res
      .status(201)
      .json({ message: "Tags added successfully.", tags: totalTags });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = { addTag };
