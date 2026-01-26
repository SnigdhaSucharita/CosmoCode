const { searchImages } = require("../utils/search.utils");
const { callMirAI } = require("../lib/miraiClient");
const { SearchHistory: searchHistoryModel } = require("../models");

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

    const sanitizedImages = unsplashResults.photos.slice(0, 6).map((img) => ({
      imageUrl: img.imageUrl,
      description: img.description || img.altDescription || "",
    }));

    const results = await callMirAI("/picstoria/semantic-search", {
      query: query,
      images: sanitizedImages,
    });
    res.json(results);
  } catch (error) {
    console.error("Semantic search error:", error);
    const status = error.response?.status || 500;
    res.status(status).json({
      message: error.response?.data || error.message,
    });
  }
};

module.exports = { getPhotosByQuery };
