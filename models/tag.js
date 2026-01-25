module.exports = (sequelize, DataTypes) => {
  const tag = sequelize.define("Tag", {
    name: DataTypes.STRING,
    type: {
      type: DataTypes.ENUM("ai", "custom"),
      allowNull: false,
      defaultValue: "custom",
    },
    photoId: {
      type: DataTypes.INTEGER,
      references: { model: "Photo", key: "id" },
    },
  });

  tag.associate = (models) => {
    tag.belongsTo(models.Photo, { foreignKey: "photoId" });
  };

  return tag;
};
