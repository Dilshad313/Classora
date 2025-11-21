// middleware/upload.js
const multer = require('multer');
const { storage } = require('../config/cloudinary');

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|svg|webp/.test(file.mimetype);
    cb(null, allowed);
  },
});

module.exports = upload;