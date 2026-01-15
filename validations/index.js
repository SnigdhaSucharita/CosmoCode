function isValidEmailFormat(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validateImageUrl(imageUrl) {
  if (!imageUrl || !imageUrl.startsWith("https://images.unsplash.com/")) {
    return false;
  }

  return true;
}

function validateTagsLength(tags) {
  if (tags.length > 5) {
    return false;
  }

  return true;
}

function validateTagLength(tags) {
  for (const tag of tags) {
    if (tag.length > 20) {
      return false;
    }
  }

  return true;
}

function containsNonEmptyStrings(tags) {
  if (
    !Array.isArray(tags) ||
    tags.length === 0 ||
    !tags.every((tag) => typeof tag === "string" && tag.trim() !== "")
  ) {
    return false;
  }

  return true;
}

module.exports = {
  isValidEmailFormat,
  validateImageUrl,
  validateTagsLength,
  validateTagLength,
  containsNonEmptyStrings,
};
