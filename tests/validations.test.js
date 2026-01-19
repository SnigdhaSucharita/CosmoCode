const {
  isValidEmailFormat,
  validateImageUrl,
  validateTagsLength,
  validateTagLength,
  containsNonEmptyStrings,
} = require("../validations/index");

describe("Validation Tests", () => {
  describe("isValidEmailFormat", () => {
    it("should validate correct email formats", () => {
      expect(isValidEmailFormat("test@example.com")).toBe(true);
      expect(isValidEmailFormat("user.name@domain.co.uk")).toBe(true);
      expect(isValidEmailFormat("user+tag@example.com")).toBe(true);
    });

    it("should reject invalid email formats", () => {
      expect(isValidEmailFormat("invalid")).toBe(false);
      expect(isValidEmailFormat("@example.com")).toBe(false);
      expect(isValidEmailFormat("user@")).toBe(false);
      expect(isValidEmailFormat("user @example.com")).toBe(false);
    });
  });

  describe("validateImageUrl", () => {
    it("should validate correct Unsplash URLs", () => {
      expect(
        validateImageUrl("https://images.unsplash.com/photo-123")
      ).toBe(true);
    });

    it("should reject invalid URLs", () => {
      expect(validateImageUrl("http://example.com/image.jpg")).toBe(false);
      expect(validateImageUrl("not-a-url")).toBe(false);
      expect(validateImageUrl("")).toBe(false);
      expect(validateImageUrl(null)).toBe(false);
    });
  });

  describe("validateTagsLength", () => {
    it("should allow up to 5 tags", () => {
      expect(validateTagsLength(["tag1"])).toBe(true);
      expect(validateTagsLength(["tag1", "tag2", "tag3"])).toBe(true);
      expect(validateTagsLength(["tag1", "tag2", "tag3", "tag4", "tag5"])).toBe(
        true
      );
    });

    it("should reject more than 5 tags", () => {
      expect(
        validateTagsLength(["tag1", "tag2", "tag3", "tag4", "tag5", "tag6"])
      ).toBe(false);
    });
  });

  describe("validateTagLength", () => {
    it("should allow tags under 20 characters", () => {
      expect(validateTagLength(["short"])).toBe(true);
      expect(validateTagLength(["exactlytwentychars!"])).toBe(true);
    });

    it("should reject tags over 20 characters", () => {
      expect(validateTagLength(["thistagiswaytoolongandexceedsthecharacterlimit"])).toBe(
        false
      );
    });
  });

  describe("containsNonEmptyStrings", () => {
    it("should validate non-empty string arrays", () => {
      expect(containsNonEmptyStrings(["tag1", "tag2"])).toBe(true);
    });

    it("should reject empty or invalid arrays", () => {
      expect(containsNonEmptyStrings([])).toBe(false);
      expect(containsNonEmptyStrings([""])).toBe(false);
      expect(containsNonEmptyStrings(["  "])).toBe(false);
      expect(containsNonEmptyStrings([123])).toBe(false);
      expect(containsNonEmptyStrings(null)).toBe(false);
    });
  });
});
