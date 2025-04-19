const Gallery = require("../models/gallery.model");

// Create new event
exports.createGalleryPic = async (req, res) => {
    try {
      const { name } = req.body;
  
      // File upload check
      if (!req.file) {
        return res.status(400).json({ error: "Picture is required." });
      }
  
      // Create a new gallery picture
      const newGalleryPic = new Gallery({
        name,
        galleryPicture: req.file.buffer, 
        galleryPictureType: req.file.mimetype, 
      });
  
      await newGalleryPic.save();
      res.status(201).json({ message: "Gallery picture created successfully!", gallery: newGalleryPic });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

// Get all pictures
exports.getGalleryPics = async (req, res) => {
    try {
      const galleryPics = await Gallery.find();
  
      // Convert binary data to Base64 
      const galleryPicsWithImages = galleryPics.map((pic) => {
        return {
          ...pic._doc,
          galleryPicture: `data:${pic.galleryPictureType};base64,${pic.galleryPicture.toString("base64")}`,
        };
      });
  
      res.status(200).json(galleryPicsWithImages);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };


// Delete an event
exports.deleteGalleryPic = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedGalleryPic = await Gallery.findByIdAndDelete(id);
  
      if (!deletedGalleryPic) {
        return res.status(404).json({ error: "Picture not found" });
      }
  
      res.status(200).json({ message: "Picture deleted successfully!" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };