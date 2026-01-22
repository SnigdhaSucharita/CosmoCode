const { photo: photoModel } = require("../models/photo");

const getAllSavedPhotos = async (req, res) => {
  const { userId } = req.query;
  try {
    const result = await photoModel.findAll({ where: { userId } });
    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch photo collection.",
      error: error.message,
    });
  }
};

module.exports = { getAllSavedPhotos };
