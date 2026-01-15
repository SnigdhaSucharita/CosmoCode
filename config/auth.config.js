require("dotenv").config();
module.exports = {
  ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || "30d",
  BCRYPT_SALT_ROUNDS: Number(process.env.BCRYPT_SALT_ROUNDS || 12),

  EMAIL_TOKEN_EXPIRY_MS: 24 * 60 * 60 * 1000, // 24 hours
  RESET_TOKEN_EXPIRY_MS: 60 * 60 * 1000, // 1 hour

  MAX_LOGIN_ATTEMPTS: 5,
  ACCOUNT_LOCK_TIME_MS: 60 * 60 * 1000, // 1 hour
};
