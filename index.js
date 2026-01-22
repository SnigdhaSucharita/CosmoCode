const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

/* ------------------ Controllers ------------------ */

const { signup } = require("./controller/signup.controller");
const { verifyEmail } = require("./controller/verifyEmail.controller");
const { login } = require("./controller/login.controller");
const { logout } = require("./controller/logout.controller");
const { refresh } = require("./controller/refresh.controller");
const { forgotPassword } = require("./controller/forgotPassword.controller");
const { resetPassword } = require("./controller/resetPassword.controller");
const { getPhotosByQuery } = require("./controller/semantic_search.controller");
const { savePhotoToCollection } = require("./controller/savePhoto.controller");
const { addTag } = require("./controller/addTag.controller");
const {
  searchPhotosByTag,
} = require("./controller/searchSavedPhotos.controller");
const { getSearchHistory } = require("./controller/searchHistory.controller");
const { loadPhotoPage } = require("./controller/loadPhotoPage.controller");
const { getAllSavedPhotos } = require("./controller/getCollection.controller");
const { getCsrfToken } = require("./controller/csrf.controller");

/* ------------------ Middleware ------------------ */

const { requireAuthApi } = require("./middleware/requireAuthApi");
const { csrfProtection } = require("./middleware/csurf.middleware");

/* ------------------ DB ------------------ */

const { sequelize } = require("./models");

const app = express();

/* ------------------ GLOBAL MIDDLEWARES ------------------ */

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

/* ------------------ RATE LIMITER ------------------ */

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

/* ------------------ AUTH ROUTES ------------------ */

app.get("/api/auth/csrf", csrfProtection, getCsrfToken);
app.post("/api/auth/signup", csrfProtection, signup);
app.get("/api/auth/verify-email", verifyEmail);
app.post("/api/auth/login", loginLimiter, csrfProtection, login);
app.post("/api/auth/logout", requireAuthApi, csrfProtection, logout);
app.post("/api/auth/refresh", refresh);
app.post("/api/auth/forgot-password", csrfProtection, forgotPassword);
app.post("/api/auth/reset-password", csrfProtection, resetPassword);

/* ------------------ PUBLIC ROUTES ------------------ */

app.get("/api/photos/search", getPhotosByQuery);

/* ------------------ PROTECTED API ROUTES ------------------ */

app.get("/api/photos", requireAuthApi, csrfProtection, getAllSavedPhotos);
app.post("/api/photos", requireAuthApi, csrfProtection, savePhotoToCollection);
app.get(
  "/api/photos/tag/search",
  requireAuthApi,
  csrfProtection,
  searchPhotosByTag,
);
app.get("/api/photos/:photoId", requireAuthApi, csrfProtection, loadPhotoPage);
app.post("/api/photos/:photoId/tags", requireAuthApi, csrfProtection, addTag);
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
