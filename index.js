const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const passport = require("./config/passport");

/* ------------------ Controllers ------------------ */

const { signup } = require("./controller/signup.controller");
const { verifyEmail } = require("./controller/verifyEmail.controller");
const {
  resendVerification,
} = require("./controller/resendVerification.controller");
const { login } = require("./controller/login.controller");
const { logout } = require("./controller/logout.controller");
const { refresh } = require("./controller/refresh.controller");
const { forgotPassword } = require("./controller/forgotPassword.controller");
const { resetPassword } = require("./controller/resetPassword.controller");
const { getPhotosByQuery } = require("./controller/semantic_search.controller");
const { savePhotoToCollection } = require("./controller/savePhoto.controller");
const { addTag } = require("./controller/addTag.controller");
const { deleteTag } = require("./controller/removeTag.controller");
const {
  searchPhotosByTag,
} = require("./controller/searchSavedPhotos.controller");
const { getSearchHistory } = require("./controller/searchHistory.controller");
const { loadPhotoPage } = require("./controller/loadPhotoPage.controller");
const { getAllSavedPhotos } = require("./controller/getCollection.controller");
const { getCurrentUser } = require("./controller/auth.controller");
const { getCsrfToken } = require("./controller/csrf.controller");
const {
  googleAuth,
  googleCallback,
} = require("./controller/google.controller");

/* ------------------ Middleware ------------------ */

const { requireAuthApi } = require("./middleware/requireAuthApi");
const { csrfProtection } = require("./middleware/csurf.middleware");
const { extractUser } = require("./middleware/extractUser");

/* ------------------ DB ------------------ */

const { sequelize } = require("./models");

const app = express();

/* ------------------ GLOBAL MIDDLEWARES ------------------ */

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

/* ------------------ RATE LIMITER ------------------ */

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

const signupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
});

/* ------------------ AUTH ROUTES ------------------ */

app.get("/api/auth/csrf", csrfProtection, getCsrfToken);
app.post("/api/auth/signup", signupLimiter, csrfProtection, signup);
app.get("/api/auth/verify-email", verifyEmail);
app.post("/api/auth/resend-verification", resendVerification);
app.post("/api/auth/login", loginLimiter, csrfProtection, login);
app.post("/api/auth/logout", requireAuthApi, csrfProtection, logout);
app.post("/api/auth/refresh", refresh);
app.post("/api/auth/forgot-password", csrfProtection, forgotPassword);
app.post("/api/auth/reset-password", csrfProtection, resetPassword);
app.get("/api/auth/google", googleAuth);
app.get("/api/auth/google/callback", googleCallback);
app.get("/api/auth/me", requireAuthApi, getCurrentUser);

/* ------------------ PUBLIC ROUTES ------------------ */

app.get("/api/photos/search", extractUser, getPhotosByQuery);

/* ------------------ PROTECTED API ROUTES ------------------ */

app.get("/api/photos", requireAuthApi, getAllSavedPhotos);
app.post("/api/photos", requireAuthApi, csrfProtection, savePhotoToCollection);
app.get("/api/photos/tag/search", requireAuthApi, searchPhotosByTag);
app.get("/api/photos/:photoId", requireAuthApi, loadPhotoPage);
app.post("/api/photos/:photoId/tag", requireAuthApi, csrfProtection, addTag);
app.delete(
  "/api/photos/:photoId/tag",
  requireAuthApi,
  csrfProtection,
  deleteTag,
);
app.get("/api/search-history", requireAuthApi, getSearchHistory);

/* ------------------ DB ------------------ */

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected.");
  })
  .catch((error) => {
    console.error("Unable to connect to database.", error);
  });

/* ------------------ SERVER ------------------ */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app };
