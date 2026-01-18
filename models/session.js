"use strict";
module.exports = (sequelize, DataTypes) => {
  const session = sequelize.define("session", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    refreshTokenHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userAgent: DataTypes.STRING,
    ipAddress: DataTypes.STRING,
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  session.associate = (models) => {
    session.belongsTo(models.user, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
  };

  return session;
};
