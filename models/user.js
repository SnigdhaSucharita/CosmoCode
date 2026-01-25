module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define("User", {
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
    googleId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
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
    user.hasMany(models.Session, {
      foreignKey: "userId",
      as: "Sessions",
    });
    user.hasMany(models.Photo, {
      foreignKey: "userId",
      as: "Photos",
    });
    user.hasMany(models.SearchHistory, {
      foreignKey: "userId",
      as: "SearchHistories",
    });
  };

  return user;
};
