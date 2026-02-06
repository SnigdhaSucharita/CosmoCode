require("dotenv").config();
const csrf = require("csurf");
const isProd = process.env.NODE_ENV === "production";

const csrfProtection = csrf({
  cookie: {
    key: "csrf",
    httpOnly: false,
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
    domain: isProd ? ".onrender.com" : undefined,
    path: "/",
  },
});

module.exports = { csrfProtection };
