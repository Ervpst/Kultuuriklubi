const { Schema, model } = require("mongoose");

//creating event schema for database
const eventSchema = new Schema(
  {
    name: { type: String, required: true }, 
    description: { type: String, required: true }, 
    date: { type: Date, required: true }, 
    time: { type: String, required: true },
    coverPicture: { type: Buffer, required: true }, // Store image as binary data
    coverPictureType: { type: String, required: true }, // Store the MIME type (e.g., 'image/jpeg')
  },
  { timestamps: true } 
);

const Event = model("Event", eventSchema);

module.exports = Event;