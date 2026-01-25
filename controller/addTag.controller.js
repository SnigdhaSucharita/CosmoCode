const { tag: tagModel } = require("../models/tag");

const addTag = async (req, res) => {
  const { photoId } = req.params;
  const { tag, type } = req.body;

  if (!tag) {
    return res.status(400).json({ message: "Tag must be a non-empty string." });
  }

  try {
    const existingTagObjects = await tagModel.findAll({ where: { photoId } });
    const existingTags = existingTagObjects.map((tag) => tag.name);
    const totalTags = [...new Set([...existingTags, tag])];

    if (totalTags.length > 5) {
      return res
        .status(400)
        .json({ message: "A photo can have a maximum of 5 tags." });
    }

    if (!existingTags.includes(tag)) {
      await tagModel.create({
        name: tag,
        type: type,
        photoId: photoId,
      });
    }

    res.status(201).json({ message: "Tag added successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = { addTag };
