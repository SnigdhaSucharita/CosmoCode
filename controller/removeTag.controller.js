const { tag: tagModel } = require("../models/tag");
const { photo: photoModel } = require("../models/photo");

async function deleteTag(req, res) {
  const { photoId } = req.params;
  const { tag } = req.body;
  const userId = req.user.id;

  const photo = await photoModel.findOne({
    where: { id: photoId, userId },
  });

  if (!photo) {
    return res.status(404).json({ message: "Photo not found" });
  }

  const deleted = await tagModel.destroy({
    where: {
      name: tag,
      type: "custom",
      photoId,
    },
  });

  if (!deleted) {
    return res.status(404).json({ message: "Tag not found" });
  }

  return res.json({ success: true });
}

module.exports = { deleteTag };
