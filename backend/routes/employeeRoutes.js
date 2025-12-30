import express from 'express';
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeStats,
  bulkDeleteEmployees,
  updateEmployeeStatus
} from '../controllers/employeeController.js';
import { authenticateToken } from '../middleware/auth.js';
import { uploadMiddleware, pictureUploadMiddleware, handleMulterError } from '../middleware/upload.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Statistics route (must be before :id routes)
router.get('/stats/summary', getEmployeeStats);

// Bulk operations
router.post('/bulk-delete', bulkDeleteEmployees);

// CRUD routes
router.get('/', getAllEmployees);
router.get('/:id', getEmployeeById);
router.post('/', pictureUploadMiddleware, handleMulterError, createEmployee);
router.put('/:id', pictureUploadMiddleware, handleMulterError, updateEmployee);
router.delete('/:id', deleteEmployee);

// Status update
router.patch('/:id/status', updateEmployeeStatus);

export default router;
