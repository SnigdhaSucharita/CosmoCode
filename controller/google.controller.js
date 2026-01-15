const { session: sessionModel } = require("../models");
const { signAccessToken, signRefreshToken } = require("../utils/jwt.utils");
const {
  setRefreshTokenCookie,
  setAccessTokenCookie,
} = require("../utils/cookie.utils");
const { hashToken } = require("../utils/token.utils");

async function googleCallback(req, res) {
  const user = req.user;

  await user.update({
    isVerified: true,
    failedLoginAttempts: 0,
    lockUntil: null,
  });

  const refreshToken = signRefreshToken({
    userId: user.id,
    tokenVersion: user.tokenVersion,
  });

  await sessionModel.create({
    userId: user.id,
    refreshTokenHash: hashToken(refreshToken),
    userAgent: req.headers["user-agent"],
    ipAddress: req.ip,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  const accessToken = signAccessToken({
    userId: user.id,
    tokenVersion: user.tokenVersion,
  });

  // Set BOTH cookies
  setRefreshTokenCookie(res, refreshToken);
  setAccessTokenCookie(res, accessToken);

  // Redirect to rendered frontend page
  return res.redirect("/dashboard");
}

module.exports = { googleCallback };
