module.exports = (sequelize, DataTypes) => {
  const tag = sequelize.define("tag", {
    name: DataTypes.STRING,
    type: {
      type: DataTypes.ENUM("ai", "custom"),
      allowNull: false,
      defaultValue: "custom",
    },
    photoId: {
      type: DataTypes.INTEGER,
      references: { model: "photo", key: "id" },
    },
  });

  tag.associate = (models) => {
    tag.belongsTo(models.photo, { foreignKey: "photoId" });
  };

  return tag;
};
