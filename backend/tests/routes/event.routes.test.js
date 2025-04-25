const request = require("supertest");
const app = require("../../index");
const Event = require("../../models/event.model");

jest.mock("../../models/event.model");

describe("Event Routes", () => {
  it("should create a new event", async () => {
    Event.prototype.save = jest.fn().mockResolvedValue({
      name: "Test Event",
      description: "Test Description",
      date: "2025-05-01",
      time: "18:00",
    });

    const response = await request(app)
      .post("/event/createEvent")
      .field("name", "Test Event")
      .field("description", "Test Description")
      .field("date", "2025-05-01")
      .field("time", "18:00")
      .attach("coverPicture", Buffer.from("test image"), "test.jpg");

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Event created successfully!");
  });

  it("should fetch all events", async () => {
    Event.find.mockResolvedValue([
      { name: "Event 1", date: "2025-05-01", coverPicture: Buffer.from("image1"), coverPictureType: "image/jpeg" },
    ]);

    const response = await request(app).get("/event/getEvents");

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });
});