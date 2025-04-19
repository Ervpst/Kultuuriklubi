const { Schema, model } = require("mongoose");

//creating gallery schema for database
const gallerySchema = new Schema(
  {
    name: { type: String, required: true },  
    galleryPicture: { type: Buffer, required: true }, 
    galleryPictureType: { type: String, required: true },
  },
  { timestamps: true } 
);

const Gallery = model("Gallery", gallerySchema);

module.exports = Gallery;