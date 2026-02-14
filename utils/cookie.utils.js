require("dotenv").config();
const isProd = process.env.NODE_ENV === "production";

function setRefreshTokenCookie(res, token) {
  res.cookie("jid", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/api/auth/refresh",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
}

function setAccessTokenCookie(res, token) {
  res.cookie("access", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
    maxAge: 15 * 60 * 1000, // 15 mins
  });
}

function clearAuthCookies(res) {
  res.clearCookie("jid", { path: "/api/auth/refresh" });
  res.clearCookie("access");
}

module.exports = {
  setRefreshTokenCookie,
  setAccessTokenCookie,
  clearAuthCookies,
};
