import express from 'express';
import {
  getSMSStats,
  getSMSHistory,
  getClassesForSMS,
  getStudentsForSMS,
  getEmployeesForSMS,
  sendSMS,
  getSMSById,
  bulkDeleteSMS
} from '../controllers/smsController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// SMS statistics
router.get('/stats', getSMSStats);

// SMS history with pagination
router.get('/history', getSMSHistory);

// Get data for dropdowns
router.get('/classes', getClassesForSMS);
router.get('/students', getStudentsForSMS);
router.get('/employees', getEmployeesForSMS);

// Send SMS
router.post('/send', sendSMS);

// Get specific SMS
router.get('/:id', getSMSById);

// Bulk delete
router.post('/bulk-delete', bulkDeleteSMS);

export default router;