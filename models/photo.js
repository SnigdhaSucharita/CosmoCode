module.exports = (sequelize, DataTypes) => {
  const photo = sequelize.define("photo", {
    imageUrl: DataTypes.STRING,
    description: DataTypes.STRING,
    altDescription: DataTypes.STRING,
    aiCaption: DataTypes.TEXT,
    embedding: DataTypes.ARRAY(DataTypes.FLOAT),
    colorPalette: DataTypes.JSONB,
    aiProcessed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    dateSaved: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: { model: "user", key: "id" },
    },
  });

  photo.associate = (models) => {
    photo.belongsTo(models.user, { foreignKey: "userId" });
    photo.hasMany(models.tag, { foreignKey: "photoId" });
  };

  return photo;
};
