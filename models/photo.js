module.exports = (sequelize, DataTypes) => {
  const photo = sequelize.define("Photo", {
    imageUrl: DataTypes.STRING,
    description: DataTypes.STRING,
    altDescription: DataTypes.STRING,
    colorPalette: DataTypes.JSONB,
    suggestedTags: DataTypes.ARRAY(DataTypes.STRING),
    dateSaved: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    userId: {
      type: DataTypes.UUID,
      references: { model: "User", key: "id" },
    },
  });

  photo.associate = (models) => {
    photo.belongsTo(models.User, { foreignKey: "userId" });
    photo.hasMany(models.Tag, { foreignKey: "photoId" });
  };

  return photo;
};
