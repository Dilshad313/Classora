import multer from 'multer';
import path from 'path';

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter function for general uploads
const fileFilter = (req, file, cb) => {
  // Check if file is an image or document
  if (file.mimetype.startsWith('image/') || 
      file.mimetype.startsWith('application/') ||
      file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only image and document files are allowed!'), false);
  }
};

// Configure multer for single file upload (for institute logo)
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Only one file
  }
});

// Configure multer for multiple files (for student uploads)
const studentUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 10 // Maximum 10 files
  }
});

// Create the upload middlewares
const uploadMiddleware = upload.single('logo');
const pictureUploadMiddleware = upload.single('picture');
const studentUploadMiddleware = studentUpload.fields([
  { name: 'picture', maxCount: 1 },
  { name: 'documents', maxCount: 9 }
]);

// Error handling middleware for multer
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files.'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: `Unexpected file field: ${error.field}`
      });
    }
  }
  
  if (error.message.includes('Only image and document files are allowed')) {
    return res.status(400).json({
      success: false,
      message: 'Only image and document files are allowed'
    });
  }
  
  next(error);
};

export {
  upload,
  uploadMiddleware,
  pictureUploadMiddleware,
  studentUploadMiddleware,
  handleMulterError
};