const router = require("express").Router();
const galleryController = require("../controllers/gallery.controller");
const upload = require("../middleware/upload");
const reqAuth = require("../middleware/reqAuth.js");

// Picture upload route
router.post("/createGalleryPic", reqAuth, upload.single("galleryPicture"), galleryController.createGalleryPic);
// All pictures route
router.get("/getGalleryPics", galleryController.getGalleryPics);
// Delete picture route
router.delete("/deleteGalleryPic/:id", reqAuth, galleryController.deleteGalleryPic);

module.exports = router;