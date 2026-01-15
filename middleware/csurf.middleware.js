const csrf = require("csurf");

const csrfProtection = csrf({
  cookie: {
    key: "csrf",
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  },
});

module.exports = { csrfProtection };
