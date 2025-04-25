const request = require("supertest");
const app = require("../../index");
const User = require("../../models/user.model");

jest.mock("../../models/user.model");

describe("User Routes", () => {
  it("should register a new user", async () => {
    User.findOne.mockResolvedValue(null);
    User.prototype.save = jest.fn().mockResolvedValue({ name: "Test User", email: "test@example.com" });

    const response = await request(app).post("/user/signup").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User created successfully");
  });

  it("should log in a user", async () => {
    User.findOne.mockResolvedValue({
      email: "test@example.com",
      password: "hashedPassword",
    });

    const response = await request(app).post("/user/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });
});