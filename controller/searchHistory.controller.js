const {
  searchHistory: searchHistoryModel,
} = require("../models/searchHistory");

const getSearchHistory = async (req, res) => {
  const { userId } = req.query;

  if (!userId || isNaN(userId)) {
    return res
      .status(400)
      .json({ message: "Invalid or missing userId parameter." });
  }

  try {
    const searchHistory = await searchHistoryModel.findAll({
      where: { userId },
      attributes: ["query", "timestamp"],
      order: [["timestamp", "DESC"]],
    });

    res.json({ searchHistory });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = { getSearchHistory };
