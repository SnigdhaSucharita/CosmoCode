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
      images: unsplashResults,
    });
    res.json(results);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = { getPhotosByQuery };
