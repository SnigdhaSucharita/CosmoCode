const { Photo: photoModel } = require("../models");
const { callMirAI } = require("../lib/miraiClient");

const { validateImageUrl } = require("../validations/index");

const savePhotoToCollection = async (req, res) => {
  const { imageUrl, description } = req.body;
  const userId = req.user.id;

  if (!validateImageUrl(imageUrl))
    return res.status(400).json({ message: "Invaild image URL" });

  try {
    const miraiResponse = await callMirAI("/picstoria/analyze-image", {
      image_url: imageUrl,
    });

    const { colorPalette, suggestedTags } = miraiResponse;

    const newPhoto = await photoModel.create({
      imageUrl,
      description,
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
