const passport = require("passport");
const { Session: sessionModel } = require("../models");
const { signAccessToken, signRefreshToken } = require("../utils/jwt.utils");
const {
  setRefreshTokenCookie,
  setAccessTokenCookie,
} = require("../utils/cookie.utils");
const { hashToken } = require("../utils/token.utils");

/**
 * GET /api/auth/google
 * Redirects user to Google OAuth
 */
const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

/**
 * GET /api/auth/google/callback
 * Handles Google OAuth callback
 */
async function googleCallback(req, res, next) {
  passport.authenticate("google", { session: false }, async (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login`);
    }
    // Reset security state
    await user.update({
      isVerified: true,
      failedLoginAttempts: 0,
      lockUntil: null,
    });

    // Refresh token
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

    // Access token
    const accessToken = signAccessToken({
      userId: user.id,
      tokenVersion: user.tokenVersion,
    });

    // Set cookies
    setRefreshTokenCookie(res, refreshToken);
    setAccessTokenCookie(res, accessToken);

    // Redirect to frontend page
    return res.redirect(`${process.env.FRONTEND_URL}/collection`);
  })(req, res, next);
}

module.exports = {
  googleAuth,
  googleCallback,
};
