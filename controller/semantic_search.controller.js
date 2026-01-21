const { searchImages } = require("../utils/search.utils");
const { callMirAI } = require("../lib/miraiClient");

const getPhotosByQuery = async (req, res) => {
  const { query } = req.query;

  if (!query)
    return res.status(400).json({ error: "A search term is required." });

  try {
    const unsplashResults = await searchImages(query);
    const results = await callMirAI("/picstoria/semantic-search", {
      query: query,
      images: unsplashResults.photos,
    });
    res.json(results);
  } catch (error) {
    const status = error.response?.status || 500;
    res.status(status).json({
      message: error.response?.data || error.message
    });
  }
};

module.exports = { getPhotosByQuery };
