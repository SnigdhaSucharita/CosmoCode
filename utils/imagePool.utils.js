const { searchImages } = require("./search.utils");

async function buildImagePoolFromUnsplash({ query, tags = [], limit = 40 }) {
  /**
   * Map structure:
   * key   → imageUrl
   * value → { imageUrl, description, altDescription }
   */
  const poolMap = new Map();

  const addImagesToPool = (results = []) => {
    for (const img of results) {
      const imageUrl = img.imageUrl;

      if (!poolMap.has(imageUrl)) {
        poolMap.set(imageUrl, {
          imageUrl,
          description: img.description ?? null,
          altDescription: img.altDescription ?? null,
        });
      }
    }
  };

  // Search by main query
  if (query) {
    const results = await searchImages(query);
    addImagesToPool(results);
  }

  // Search by top tags (max 3)
  for (const tag of tags.slice(0, 3)) {
    const results = await searchImages(tag);
    addImagesToPool(results);
  }

  // Convert Map → Array and apply limit
  return Array.from(poolMap.values()).slice(0, limit);
}

module.exports = { buildImagePoolFromUnsplash };
