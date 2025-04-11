const { createNewUser } = require("../controller/controller");
const { user: userModel } = require("../models");
const {
  validatePresenceOfUsernameAndEmail,
  validateEmailFormat,
} = require("../validations/index");
const { doesUserExist } = require("../utils/utils");

jest.mock("../validations/index.js");
jest.mock("../utils/utils.js");
jest.mock("../models");

describe("Controller - unit tests", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, query: {} };
    res = { json: jest.fn(), status: jest.fn(() => res) };
  });

  test("should return 400 if username or email is missing", async () => {
    validatePresenceOfUsernameAndEmail.mockReturnValue([
      "Username is required",
      "Email is required",
    ]);

    req.body = { username: "", email: "" };
    await createNewUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      emptyFieldError: ["Username is required", "Email is required"],
    });
  });
});
