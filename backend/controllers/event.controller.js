const Event = require("../models/event.model");

// Create a new event 
exports.createEvent = async (req, res) => {
  try {
    const { name, description, date, time } = req.body;

    // file upload check
    if (!req.file) {
      return res.status(400).json({ error: "Cover picture is required." });
    }

    // Create a new event
    const newEvent = new Event({
      name,
      description,
      date,
      time,
      coverPicture: req.file.buffer, 
      coverPictureType: req.file.mimetype, 
    });

    await newEvent.save();
    res.status(201).json({ message: "Event created successfully!", event: newEvent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get all events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 }); 

    
    const eventsWithImages = events.map((event) => {
      return {
        ...event._doc,
        coverPicture: `data:${event.coverPictureType};base64,${event.coverPicture.toString("base64")}`,
      };
    });

    res.status(200).json(eventsWithImages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedEvent = await Event.findByIdAndDelete(id);
  
      if (!deletedEvent) {
        return res.status(404).json({ error: "Event not found" });
      }
  
      res.status(200).json({ message: "Event deleted successfully!" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };