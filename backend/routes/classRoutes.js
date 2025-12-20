// routes/classRoutes.js

import express from 'express';
import {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  uploadMaterial,
  deleteMaterial,
  getClassStats,
  bulkDeleteClasses,
  updateClassStatus,
  getAllClassNames
} from '../controllers/classController.js';
import { authenticateToken } from '../middleware/auth.js';
import { uploadMiddleware, handleMulterError } from '../middleware/upload.js';
import multer from 'multer';

const router = express.Router();

// Configure multer for class materials (allow more file types)
const materialStorage = multer.memoryStorage();

const materialFilter = (req, file, cb) => {
  // Allow images, documents, and common file types
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'application/zip',
    'application/x-rar-compressed'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed`), false);
  }
};

const materialUpload = multer({
  storage: materialStorage,
  fileFilter: materialFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1
  }
});

// All routes require authentication
router.use(authenticateToken);

// Statistics route (must be before :id routes)
router.get('/stats/summary', getClassStats);

// Get all class names route
router.get('/names', getAllClassNames);

// Bulk operations
router.post('/bulk-delete', bulkDeleteClasses);

// CRUD routes
router.get('/', getAllClasses);
router.get('/:id', getClassById);
router.post('/', createClass);
router.put('/:id', updateClass);
router.delete('/:id', deleteClass);

// Status update
router.patch('/:id/status', updateClassStatus);

// Material routes
router.post('/:id/materials', materialUpload.single('file'), handleMulterError, uploadMaterial);
router.delete('/:id/materials/:materialId', deleteMaterial);

export default router;