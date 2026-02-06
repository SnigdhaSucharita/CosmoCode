require("dotenv").config();
const isProd = process.env.NODE_ENV === "production";
function setRefreshTokenCookie(res, token) {
  res.cookie("jid", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
    domain: ".onrender.com",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
}

function setAccessTokenCookie(res, token) {
  res.cookie("access", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
    domain: ".onrender.com",
    maxAge: 15 * 60 * 1000, // 15 min
  });
}

function clearAuthCookies(res) {
  res.clearCookie("jid");
  res.clearCookie("access");
}

module.exports = {
  setRefreshTokenCookie,
  setAccessTokenCookie,
  clearAuthCookies,
};
