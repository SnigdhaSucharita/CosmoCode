const {
  searchHistory: searchHistoryModel,
} = require("../models");

const getSearchHistory = async (req, res) => {
  const userId = req.user.id;

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

    const items = searchHistory.map((item) => ({
      id: item.id,
      query: item.query,
      timestamp: item.timestamp.toISOString(),
    }));

    res.json({ history: items });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = { getSearchHistory };
