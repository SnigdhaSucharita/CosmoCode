module.exports = (sequelize, DataTypes) => {
  const searchHistory = sequelize.define("searchHistory", {
    query: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("semantic-search", "tag-search"),
      allowNull: false,
      defaultValue: "semantic-search",
    },
    userId: {
      type: DataTypes.UUID,
      references: { model: "user", key: "id" },
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  searchHistory.associate = (models) => {
    searchHistory.belongsTo(models.user, { foreignKey: "userId" });
  };

  return searchHistory;
};
