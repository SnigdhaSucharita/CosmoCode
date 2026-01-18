const { photo: photoModel } = require("../models/photo");
const { callMirAI } = require("../lib/miraiClient");

const {
  validateImageUrl,
  validateTagsLength,
  validateTagLength,
} = require("../validations/index");

const savePhotoToCollection = async (req, res) => {
  const { imageUrl, description, altDescription, tags, userId } = req.body;

  if (!validateImageUrl(imageUrl))
    return res.status(400).json({ message: "Invaild image URL" });

  if (!validateTagsLength(tags))
    return res.status(400).json({ message: "No more than 5 tags allowed." });

  if (!validateTagLength(tags))
    return res
      .status(400)
      .json({ message: "Each tag must not exceed 20 characters." });

  try {
    const miraiResponse = await callMirAI("/picstoria/analyze-image", {
      image_url: imageUrl,
    });

    const { colorPalette, suggestedTags } = miraiResponse;

    const newPhoto = await photoModel.create({
      imageUrl,
      description,
      altDescription,
      colorPalette,
      suggestedTags,
      userId,
    });

    res
      .status(201)
      .json({ id: newPhoto.id, message: "Photo saved successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = { savePhotoToCollection };
