const { Session: sessionModel } = require("../models");
const { clearAuthCookies } = require("../utils/cookie.utils");
const { hashToken } = require("../utils/token.utils");

async function logout(req, res) {
  const token = req.cookies?.jid;

  if (token) {
    await sessionModel.destroy({
      where: { refreshTokenHash: hashToken(token) },
    });
  }

  clearAuthCookies(res);
  return res.set("Cache-Control", "no-store").json({ message: "Logged out successfully" });
}

module.exports = { logout };
