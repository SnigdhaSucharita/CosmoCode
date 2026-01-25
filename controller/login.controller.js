const { user: userModel } = require("../models/user");
const { session: sessionModel } = require("../models/session");
const { comparePassword } = require("../utils/password.utils");
const { signAccessToken, signRefreshToken } = require("../utils/jwt.utils");
const {
  setRefreshTokenCookie,
  setAccessTokenCookie,
} = require("../utils/cookie.utils");
const { hashToken } = require("../utils/token.utils");
const {
  MAX_LOGIN_ATTEMPTS,
  ACCOUNT_LOCK_TIME_MS,
} = require("../config/auth.config");

async function login(req, res) {
  const { identifier, password } = req.body;
  // identifier = username OR email

  if (!identifier || !password) {
    return res.status(400).json({ error: "Missing credentials" });
  }

  const user = await userModel.findOne({
    where: {
      [require("sequelize").Op.or]: [
        { email: identifier },
        { username: identifier },
      ],
    },
  });

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Account lock check
  if (user.lockUntil && user.lockUntil > new Date()) {
    return res.status(423).json({
      error: "Account temporarily locked. Try later.",
    });
  }

  const passwordValid = await comparePassword(password, user.passwordHash);

  if (!passwordValid) {
    const attempts = user.failedLoginAttempts + 1;
    const updates = { failedLoginAttempts: attempts };

    if (attempts >= MAX_LOGIN_ATTEMPTS) {
      updates.lockUntil = new Date(Date.now() + ACCOUNT_LOCK_TIME_MS);
    }

    await user.update(updates);

    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Email verification check
  if (!user.isVerified) {
    return res.status(403).json({
      success: false,
      message: "Please verify your email before logging in",
    });
  }

  // Successful login → reset lock counters
  await user.update({
    failedLoginAttempts: 0,
    lockUntil: null,
  });

  const refreshToken = signRefreshToken({
    userId: user.id,
    tokenVersion: user.tokenVersion,
  });

  // Create session
  const session = await sessionModel.create({
    userId: user.id,
    refreshTokenHash: hashToken(refreshToken),
    userAgent: req.headers["user-agent"],
    ipAddress: req.ip,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  // Access token (short-lived)
  const accessToken = signAccessToken({
    userId: user.id,
    sessionId: session.id,
    tokenVersion: user.tokenVersion,
  });

  setRefreshTokenCookie(res, refreshToken);
  setAccessTokenCookie(res, accessToken);

  return res.json({
    message: "Login successful.",
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  });
}

module.exports = { login };
