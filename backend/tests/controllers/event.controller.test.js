jest.mock('../../models/event.model', () => {
  const EventMock = jest.fn().mockImplementation(function(data) {
    this._id = 'testEventId';
    this.name = data.name;
    this.description = data.description;
    this.date = data.date;
    this.time = data.time;
    this.coverPicture = data.coverPicture;
    this.coverPictureType = data.coverPictureType;
    this.save = jest.fn().mockResolvedValue(this);
  });
  EventMock.find = jest.fn();
  EventMock.findByIdAndDelete = jest.fn();
  return EventMock;
});

const { createEvent, getEvents, deleteEvent } = require('../../controllers/event.controller');

describe('Event Controllers', () => {
  describe('createEvent', () => {
    it('should return 400 if no cover image file is provided', async () => {
      const req = { body: { name: 'Sample Event', description: 'Desc', date: '2024-01-01', time: '10:00' }, file: undefined };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await createEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Cover picture is required." });
    });

    it('should save the event and return 201 with event data if file is provided', async () => {
      const fakeCover = Buffer.from('cover-image');
      const req = { 
        body: { name: 'Test Event', description: 'Event Desc', date: '2025-12-31', time: '18:00' }, 
        file: { buffer: fakeCover, mimetype: 'image/jpeg' } 
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await createEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
      const result = res.json.mock.calls[0][0];
      expect(result.message).toBe("Event created successfully!");
      expect(result.event).toBeDefined();
      expect(result.event._id).toBe('testEventId');
      expect(result.event.name).toBe('Test Event');
      expect(result.event.description).toBe('Event Desc');
      expect(result.event.coverPictureType).toBe('image/jpeg');
    });
  });

  describe('getEvents', () => {
    it('should return events with coverPicture as data URL string', async () => {
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const dummyEvents = [
        { _doc: { _id: 'e1', name: 'Ev1', coverPictureType: 'image/png', coverPicture: Buffer.from('abc') } },
        { _doc: { _id: 'e2', name: 'Ev2', coverPictureType: 'image/jpeg', coverPicture: Buffer.from('def') } }
      ];
      const Event = require('../../models/event.model');
      Event.find.mockResolvedValue(dummyEvents);

      await getEvents(req, res);

      expect(Event.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
      const eventsArray = res.json.mock.calls[0][0];
      expect(Array.isArray(eventsArray)).toBe(true);
      expect(eventsArray).toHaveLength(2);
      const expectedDataUrl1 = `data:image/png;base64,${dummyEvents[0]._doc.coverPicture.toString('base64')}`;
      const expectedDataUrl2 = `data:image/jpeg;base64,${dummyEvents[1]._doc.coverPicture.toString('base64')}`;
      expect(eventsArray[0]._id).toBe('e1');
      expect(eventsArray[0].coverPicture).toBe(expectedDataUrl1);
      expect(eventsArray[1]._id).toBe('e2');
      expect(eventsArray[1].coverPicture).toBe(expectedDataUrl2);
    });
  });

  describe('deleteEvent', () => {
    it('should delete the event and return success message if found', async () => {
      const req = { params: { id: 'event123' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const Event = require('../../models/event.model');
      Event.findByIdAndDelete.mockResolvedValue({ _id: 'event123', name: 'My Event' });

      await deleteEvent(req, res);

      expect(Event.findByIdAndDelete).toHaveBeenCalledWith('event123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Event deleted successfully!" });
    });

    it('should respond 404 if event ID not found', async () => {
      const req = { params: { id: 'missingEvent' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const Event = require('../../models/event.model');
      Event.findByIdAndDelete.mockResolvedValue(null);

      await deleteEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Event not found" });
    });
  });
});
