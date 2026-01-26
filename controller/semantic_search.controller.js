const { searchImages } = require("../utils/search.utils");
const { callMirAI } = require("../lib/miraiClient");
const { SearchHistory: searchHistoryModel } = require("../models");
const { sanitizeImages } = require("../utils/sanitization.utils");

const getPhotosByQuery = async (req, res) => {
  const { query } = req.query;
  const userId = req.user?.id || null;

  if (!query)
    return res.status(400).json({ error: "A search term is required." });

  if (userId) {
    await searchHistoryModel.create({
      query: query,
      type: "semantic-search",
      userId: userId,
    });
  }

  try {
    const unsplashResults = await searchImages(query);

    const sanitizedImages = sanitizeImages(unsplashResults.photos);

    const result = await callMirAI("/picstoria/semantic-search", {
      query: query,
      images: sanitizedImages,
    });
    res.json({ result });
  } catch (error) {
    console.error("Semantic search error:", error);
    const status = error.response?.status || 500;
    res.status(status).json({
      message: error.response?.data || error.message,
    });
  }
};

module.exports = { getPhotosByQuery };
