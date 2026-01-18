const { searchImages } = require("./search.utils");

async function buildImagePoolFromUnsplash({ query, tags = [], limit = 40 }) {
  const pool = new Set();

  if (query) {
    const results = await searchImages(query);
    results.forEach((img) => pool.add(img.imageUrl));
  }

  for (const tag of tags.slice(0, 3)) {
    const results = await searchImages(tag);
    results.forEach((img) => pool.add(img.imageUrl));
  }

  return Array.from(pool).slice(0, limit);
}

module.exports = { buildImagePoolFromUnsplash };
