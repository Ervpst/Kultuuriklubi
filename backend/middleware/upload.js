const multer = require("multer");

// File uploads
const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, //  5MB
});

module.exports = upload;