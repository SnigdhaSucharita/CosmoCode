const MAX_IMAGES = 6;
const MAX_DESCRIPTION_LENGTH = 300;

function sanitizeImages(photos = []) {
  if (!Array.isArray(photos)) return [];

  return photos
    .slice(0, MAX_IMAGES)
    .map((img) => {
      const imageUrl = img.imageUrl || img.urls?.regular || img.urls?.full;

      if (!imageUrl) return null;

      const description = [img.description, img.altDescription]
        .filter(Boolean)
        .join(" ")
        .trim()
        .slice(0, MAX_DESCRIPTION_LENGTH);

      return {
        imageUrl,
        ...(description ? { description } : {}),
      };
    })
    .filter(Boolean);
}

module.exports = { sanitizeImages };
