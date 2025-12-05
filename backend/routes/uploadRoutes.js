import express from 'express';
import {
  getAllUploads,
  uploadFile,
  deleteUpload,
  getStorageStats
} from '../controllers/uploadController.js';
import { authenticateToken } from '../middleware/auth.js';
import { uploadMiddleware, handleMulterError } from '../middleware/upload.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Upload routes
router.get('/stats/summary', getStorageStats);
router.get('/', getAllUploads);
router.post('/', uploadMiddleware, handleMulterError, uploadFile);
router.delete('/:id', deleteUpload);

export default router;