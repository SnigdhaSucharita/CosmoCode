const express = require("express");
const cors = require("cors");
const { createNewUser, getPhotosByQuery, savePhotosToCollection, addTag, searchPhotosByTag, getSearchHistory } = require("./controller/controller");
const { sequelize } = require("./models");

const app = express();

app.use(express.json());
app.use(cors());

app.post("/api/users", createNewUser);
app.post("/api/photos", savePhotosToCollection);
app.post("/api/photos/:photoId/tags", addTag);
app.get("/api/photos/search", getPhotosByQuery);
app.get("/api/photos/tag/search", searchPhotosByTag);
app.get("/api/search-history", getSearchHistory);


sequelize
    .authenticate()
    .then(() => {
        console.log("Database connected.");
    })
    .catch((error) => {
        console.error("Unable to connect to database.", error)
    });

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});


module.exports = { app };