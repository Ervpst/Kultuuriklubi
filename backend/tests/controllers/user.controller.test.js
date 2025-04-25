const User = require("../../models/user.model");
const { signup, login } = require("../../controllers/user.controller");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

jest.mock("../../models/user.model");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("User Controller", () => {
  describe("signup", () => {
    it("should create a new user successfully", async () => {
      const req = {
        body: { name: "Test User", email: "test@example.com", password: "password123" },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      User.findOne.mockResolvedValue(null); 
      bcrypt.genSalt.mockResolvedValue("salt");
      bcrypt.hash.mockResolvedValue("hashedPassword");
      User.prototype.save = jest.fn().mockResolvedValue({ name: "Test User", email: "test@example.com" });

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "User created successfully" });
    });

    it("should return 422 if email already exists", async () => {
      const req = { body: { email: "test@example.com" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      User.findOne.mockResolvedValue({ email: "test@example.com" });

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({ errors: [{ msg: "Email already exists", param: "email" }] });
    });

    it("should return 400 if an error occurs during signup", async () => {
      const req = { body: { name: "Test User", email: "test@example.com", password: "password123" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      User.findOne.mockRejectedValue(new Error("Database error"));

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });


describe('login', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        name: 'John',
        email: 'john@example.com',
        password: 'password123',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should login successfully and return a token', async () => {
    const mockUser = {
      _id: '123',
      id: '123',
      name: 'John',
      email: 'john@example.com',
      password: 'hashedpassword',
    };

    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true); // password matches
    jwt.sign.mockReturnValue('fake-jwt-token');

    await login(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
    expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password, mockUser.password);
    expect(jwt.sign).toHaveBeenCalledWith({ _id: mockUser._id }, process.env.JWT_SECRET, { expiresIn: '30m' });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      token: 'fake-jwt-token',
      id: mockUser.id,
      name: mockUser.name,
      email: mockUser.email,
      message: 'Auth Succesful',
    });
  });

  it('should return 400 if user not found', async () => {
    User.findOne.mockResolvedValue(null);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'User with this e-mail does not exist',
    });
  });

  it('should return 400 if password does not match', async () => {
    User.findOne.mockResolvedValue({ password: 'hashedpassword' });
    bcrypt.compare.mockResolvedValue(false);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Password is not correct',
    });
  });

  it('should return 400 if token creation fails', async () => {
    const mockUser = {
      _id: '123',
      id: '123',
      name: 'John',
      email: 'john@example.com',
      password: 'hashedpassword',
    };

    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue(null); // token creation failed

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Token not found',
    });
  });
});
});