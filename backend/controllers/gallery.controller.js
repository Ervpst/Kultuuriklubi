const Gallery = require("../models/gallery.model");

// Create new gallery picture
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

    res.status(201).json({
      message: "Gallery picture created successfully!",
      gallery: {
      _id: newGalleryPic._id,
      name: newGalleryPic.name,
      imageUrl: `/gallery/pic/${newGalleryPic._id}`,
      createdAt: newGalleryPic.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all pictures
exports.getGalleryPics = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      Gallery.find({}, { galleryPicture: 0 }) 
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Gallery.countDocuments(),
    ]);

    const mapped = items.map((pic) => ({
      ...pic.toObject(),
      imageUrl: `/gallery/pic/${pic._id}`, // url
    }));

    res.status(200).json({ items: mapped, total, page: pageNum, limit: limitNum });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getGalleryPicImage = async (req, res) => {
  try {
    const pic = await Gallery.findById(req.params.id).select(
      "galleryPicture galleryPictureType"
    );

    if (!pic) return res.status(404).send("Not found");

    res.set("Content-Type", pic.galleryPictureType);
    res.set("Cache-Control", "public, max-age=3600"); 
    return res.send(pic.galleryPicture);
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