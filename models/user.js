"use strict";
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define("user", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    passwordHash: DataTypes.STRING,
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verificationTokenHash: DataTypes.STRING,
    verificationExpiresAt: DataTypes.DATE,
    resetTokenHash: DataTypes.STRING,
    resetExpiresAt: DataTypes.DATE,
    failedLoginAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lockUntil: DataTypes.DATE,
    tokenVersion: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });

  user.associate = (models) => {
    user.hasMany(models.session, {
      foreignKey: "userId",
      as: "sessions",
    });
    user.hasMany(models.photo, {
      foreignKey: "userId",
      as: "photos",
    });
    user.hasMany(models.searchHistory, {
      foreignKey: "userId",
      as: "searchHistories",
    });
  };

  return user;
};
