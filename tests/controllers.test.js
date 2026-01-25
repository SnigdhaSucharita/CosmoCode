jest.mock("../models", () => ({
  user: {
    findOne: jest.fn(),
    create: jest.fn(),
  },

  session: {
    create: jest.fn(),
  },

  photo: {
    create: jest.fn(),
  },

}));


jest.mock("../validations", () => ({
  isValidEmailFormat: jest.fn(),
  validateImageUrl: jest.fn(),
  validateTagsLength: jest.fn(),
  validateTagLength: jest.fn(),
}));

jest.mock("../utils/password.utils", () => ({
  comparePassword: jest.fn(),
  hashPassword: jest.fn(),
}));

jest.mock("../utils/email.utils", () => ({
  sendEmail: jest.fn(),
}));

jest.mock("../lib/miraiClient", () => ({
  callMirAI: jest.fn(),
}));

jest.mock("../utils/search.utils", () => ({
  searchImages: jest.fn(),
}));


const { login } = require("../controller/login.controller");
const { signup } = require("../controller/signup.controller");
const { savePhotoToCollection } = require("../controller/savePhoto.controller");
const { getPhotosByQuery } = require("../controller/semantic_search.controller");
const { user: userModel } = require("../models/user");
const { session: sessionModel } = require("../models/session");
const { photo: photoModel } = require("../models/photo");
const { comparePassword, hashPassword } = require("../utils/password.utils");
const { callMirAI } = require("../lib/miraiClient");
const { searchImages } = require("../utils/search.utils");
const { sendEmail } = require("../utils/email.utils");
const validations = require("../validations");


const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  return res;
};


describe("Login Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, headers: {}, ip: "127.0.0.1" };
    res = mockResponse();
    jest.clearAllMocks();
  });

  test("should return 400 if credentials are missing", async () => {
    req.body = {};
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Missing credentials" });
  });

  test("should return 401 if user does not exist", async () => {
    req.body = { identifier: "test@example.com", password: "password123" };
    userModel.findOne.mockResolvedValue(null);

    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid credentials" });
  });

  test("should return 423 if account is locked", async () => {
    req.body = { identifier: "test@example.com", password: "password123" };
    const mockUser = {
      id: 1,
      lockUntil: new Date(Date.now() + 10000),
    };
    userModel.findOne.mockResolvedValue(mockUser);

    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(423);
    expect(res.json).toHaveBeenCalledWith({
      error: "Account temporarily locked. Try later.",
    });
  });

  test("should return 401 if password is invalid", async () => {
    req.body = { identifier: "test@example.com", password: "wrongpassword" };
    const mockUser = {
      id: 1,
      email: "test@example.com",
      passwordHash: "hashedpassword",
      failedLoginAttempts: 0,
      update: jest.fn(),
    };
    userModel.findOne.mockResolvedValue(mockUser);
    comparePassword.mockResolvedValue(false);

    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(mockUser.update).toHaveBeenCalledWith({ failedLoginAttempts: 1 });
  });

  test("should return 403 if email is not verified", async () => {
    req.body = { identifier: "test@example.com", password: "password123" };
    const mockUser = {
      id: 1,
      email: "test@example.com",
      passwordHash: "hashedpassword",
      isVerified: false,
      failedLoginAttempts: 0,
      update: jest.fn(),
    };
    userModel.findOne.mockResolvedValue(mockUser);
    comparePassword.mockResolvedValue(true);

    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: "Please verify your email first",
    });
  });

  test("should login successfully with valid credentials", async () => {
    req.body = { identifier: "test@example.com", password: "password123" };
    const mockUser = {
      id: 1,
      username: "testuser",
      email: "test@example.com",
      passwordHash: "hashedpassword",
      isVerified: true,
      tokenVersion: 1,
      failedLoginAttempts: 0,
      lockUntil: null,
      update: jest.fn(),
    };
    const mockSession = {
      id: 1,
      userId: 1,
    };

    userModel.findOne.mockResolvedValue(mockUser);
    comparePassword.mockResolvedValue(true);
    sessionModel.create.mockResolvedValue(mockSession);

    await login(req, res);
    expect(mockUser.update).toHaveBeenCalledWith({
      failedLoginAttempts: 0,
      lockUntil: null,
    });
    expect(res.json).toHaveBeenCalledWith({
      user: {
        id: 1,
        username: "testuser",
        email: "test@example.com",
      },
    });
  });
});

describe("Signup Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, headers: {}, ip: "127.0.0.1" };
    res = mockResponse();
    jest.clearAllMocks();
  });

  test("should return 400 if required fields are missing", async () => {
    req.body = { username: "testuser" };
    await signup(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "All fields are required" });
  });

  test("should return 400 if email format is invalid", async () => {
    req.body = {
      username: "testuser",
      email: "invalidemail",
      password: "password123",
    };

    validations.isValidEmailFormat.mockReturnValue(false);

    await signup(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid email format." });
  });

  test("should return 400 if username or email is already taken", async () => {
    req.body = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    };

    validations.isValidEmailFormat.mockReturnValue(true);
    userModel.findOne.mockResolvedValue({ id: 1 });

    await signup(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "username or email taken" });
  });

  test("should create user successfully", async () => {
    req.body = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    };

    validations.isValidEmailFormat.mockReturnValue(true);
    userModel.findOne.mockResolvedValue(null);
    userModel.create.mockResolvedValue({
      id: 1,
      username: "testuser",
      email: "test@example.com",
    });
    hashPassword.mockResolvedValue("hashedpassword");
    sendEmail.mockResolvedValue(true);

    await signup(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Signup successful. Please verify your email.",
    });
    expect(sendEmail).toHaveBeenCalled();
  });
});

describe("Save Photo Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, headers: {}, ip: "127.0.0.1" };
    res = mockResponse();
    jest.clearAllMocks();
  });

  test("should return 400 if image URL is invalid", async () => {
    req.body = { imageUrl: "invalid-url", userId: 1 };

    validations.validateImageUrl.mockReturnValue(false);

    await savePhotoToCollection(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invaild image URL" });
  });

  test("should return 400 if too many tags", async () => {
    req.body = {
      imageUrl: "https://example.com/image.jpg",
      tags: ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6"],
      userId: 1,
    };

    validations.validateImageUrl.mockReturnValue(true);
    validations.validateTagsLength.mockReturnValue(false);

    await savePhotoToCollection(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "No more than 5 tags allowed." });
  });

  test("should save photo successfully", async () => {
    req.body = {
      imageUrl: "https://example.com/image.jpg",
      tags: ["tag1", "tag2"],
      userId: 1,
    };

    validations.validateImageUrl.mockReturnValue(true);
    validations.validateTagsLength.mockReturnValue(true);
    validations.validateTagLength.mockReturnValue(true);

    photoModel.create.mockResolvedValue({
      id: 1,
      imageUrl: "https://example.com/image.jpg",
    });

    callMirAI.mockResolvedValue({
      colorPalette: ["#FF5733", "#33FF57"],
      suggestedTags: ["nature", "landscape"],
    });

    await savePhotoToCollection(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      id: 1,
      message: "Photo saved successfully",
    });
  });

  test("should handle errors gracefully", async () => {
    req.body = {
      imageUrl: "https://example.com/image.jpg",
      tags: [],
      userId: 1,
    };

    validations.validateImageUrl.mockReturnValue(true);
    validations.validateTagsLength.mockReturnValue(true);
    validations.validateTagLength.mockReturnValue(true);

    callMirAI.mockRejectedValue(new Error("API error"));

    await savePhotoToCollection(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal Server Error",
      error: "API error",
    });
  });
});

describe("Semantic Search Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, headers: {}, ip: "127.0.0.1" };
    res = mockResponse();
    jest.clearAllMocks();
  });

  test("should return 400 if query is missing", async () => {
    req.query = {};
    await getPhotosByQuery(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "A search term is required." });
  });

  test("should return search results successfully", async () => {
    req.query = { query: "sunset" };

    const mockUnsplashResults = [
      { imageUrl: "https://example.com/image1.jpg" },
      { imageUrl: "https://example.com/image2.jpg" },
    ];

    const mockAIResults = {
      results: [
        { imageUrl: "https://example.com/image1.jpg", score: 0.95 },
        { imageUrl: "https://example.com/image2.jpg", score: 0.85 },
      ],
    };

    searchImages.mockResolvedValue(mockUnsplashResults);
    callMirAI.mockResolvedValue(mockAIResults);

    await getPhotosByQuery(req, res);
    expect(searchImages).toHaveBeenCalledWith("sunset");
    expect(callMirAI).toHaveBeenCalledWith("/picstoria/semantic-search", {
      query: "sunset",
      images: mockUnsplashResults,
    });
    expect(res.json).toHaveBeenCalledWith(mockAIResults);
  });

  test("should handle errors gracefully", async () => {
    req.query = { query: "sunset" };
    searchImages.mockRejectedValue(new Error("Search failed"));

    await getPhotosByQuery(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal Server Error",
      error: "Search failed",
    });
  });
}); 
