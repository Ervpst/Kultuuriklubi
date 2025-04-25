const { createEvent } = require('../controllers/event.controller');
const Event = require('../models/event.model');

// Mock the Event model
jest.mock('../models/event.model');

describe('createEvent', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        name: 'Test Event',
        description: 'This is a test',
        date: '2025-04-30',
        time: '18:00',
      },
      file: {
        buffer: Buffer.from('fake-image-data'),
        mimetype: 'image/jpeg',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should create an event and return 201', async () => {
    const mockSave = jest.fn().mockResolvedValue({
      ...req.body,
      coverPicture: req.file.buffer,
      coverPictureType: req.file.mimetype,
    });

    Event.mockImplementation(() => ({
      save: mockSave,
    }));

    await createEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Event created successfully!',
        event: expect.any(Object),
      })
    );
  });

  it('should return 400 if no file is uploaded', async () => {
    req.file = null;

    await createEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Cover picture is required.' });
  });

  it('should handle errors and return 500', async () => {
    Event.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(new Error('Save failed')),
    }));

    await createEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Save failed' });
  });


  // tests/getEvents.test.js
const { getEvents } = require('../controllers/event.controller');
const Event = require('../models/event.model');

// Mock the Event model
jest.mock('../models/event.model');

describe('getEvents', () => {
  let req, res;

  beforeEach(() => {
    req = {};

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should fetch and return events with base64 images', async () => {
    const fakeEvent = {
      _doc: {
        name: 'Sample Event',
        description: 'Test description',
        date: '2025-04-30',
        time: '18:00',
        coverPictureType: 'image/jpeg',
        coverPicture: Buffer.from('image-binary'),
      },
    };

    const sortMock = jest.fn().mockResolvedValue([fakeEvent]);
    Event.find.mockReturnValue({ sort: sortMock });

    await getEvents(req, res);

    expect(Event.find).toHaveBeenCalled();
    expect(sortMock).toHaveBeenCalledWith({ date: 1 });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Sample Event',
          coverPicture: expect.stringContaining('data:image/jpeg;base64,'),
        }),
      ])
    );
  });

  it('should handle errors and return 500', async () => {
    const sortMock = jest.fn().mockRejectedValue(new Error('Database failure'));
    Event.find.mockReturnValue({ sort: sortMock });

    await getEvents(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Database failure' });
  });
});

  describe("deleteEvent", () => {
    it("should delete an event", async () => {
      const req = { params: { id: "123" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      Event.findByIdAndDelete.mockResolvedValue({ _id: "123" });

      await deleteEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Event deleted successfully!" });
    });
  });
});