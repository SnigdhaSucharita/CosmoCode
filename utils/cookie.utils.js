require("dotenv").config();
const isProd = process.env.NODE_ENV === "production";
function setRefreshTokenCookie(res, token) {
  res.cookie("jid", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/api/auth/refresh",
    domain: ".onrender.com",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
}

function clearAuthCookie(res) {
  res.clearCookie("jid", { path: "/api/auth/refresh" });
}

module.exports = {
  setRefreshTokenCookie,
  clearAuthCookie,
};
