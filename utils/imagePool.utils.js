const { searchImages } = require("./search.utils");

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

async function buildImagePoolFromUnsplash({ query, tags = [], limit = 40 }) {
  /**
   * key   → imageUrl
   * value → { imageUrl, description, altDescription }
   */
  const poolMap = new Map();

  const addImagesToPool = (results = []) => {
    for (const img of results) {
      const imageUrl = img.imageUrl;
      if (!imageUrl) continue;

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

  // Map → Array
  const pool = Array.from(poolMap.values());

  // 🔀 Shuffle to remove query bias
  shuffleArray(pool);

  // Apply limit after shuffle
  return pool.slice(0, limit);
}

module.exports = { buildImagePoolFromUnsplash };
