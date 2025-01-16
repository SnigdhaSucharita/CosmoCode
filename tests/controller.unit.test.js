const {
  createNewUser
} = require("../controller/controller");
const { user: userModel } = require("../models");
const { doesUserExist } = require("../utils/utils");

jest.mock("../models");
jest.mock("../utils/utils");

describe("Controller unit tests", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("createNewUser", () => {
    it("should return 400 if username or email is missing", async() => {
      req.body = { username: "", email: "" };
      await createNewUser(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ emptyFieldError: [ "Username is required", "Email is required" ] });
    });
  });
});