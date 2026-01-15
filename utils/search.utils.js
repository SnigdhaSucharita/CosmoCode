require("dotenv").config();
const axios = require("axios");

async function searchImages(query) {
  if (!process.env.UNSPLASH_ACCESS_KEY) {
    throw new Error("Unsplash API access key is not configured in .env file.");
  }

  try {
    const response = await axios.get(process.env.UNSPLASH_BASE_URL, {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
      params: {
        query,
      },
    });

    if (response.data.results.length === 0) {
      return { photos: [], message: "No images found for the given query." };
    }

    const photos = response.data.results.map((photo) => ({
      imageUrl: photo.urls.full,
      description: photo.description,
      altDescription: photo.alt_description,
    }));

    return { photos };
  } catch (error) {
    throw new Error(`Failed to fetch images: ${error.message}`);
  }
}

module.exports = { searchImages };
