import express from 'express';
import {
  getClassTests,
  getClassTestById,
  createClassTest,
  updateClassTest,
  deleteClassTest,
  publishTest,
  getTestStats,
  getDropdownData,
  getClassWiseResults,
  getClassSubjectResults,
  getStudentSubjectResults,
  getDateRangeResults,
  getPerformanceReport
} from '../controllers/classTestController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Test management routes
router.get('/', getClassTests);
router.get('/stats/summary', getTestStats);
router.get('/dropdown-data', getDropdownData);
router.get('/:id', getClassTestById);
router.post('/', createClassTest);
router.put('/:id', updateClassTest);
router.delete('/:id', deleteClassTest);
router.patch('/:id/publish', publishTest);

// Results and analytics routes
router.get('/results/class-wise', getClassWiseResults);
router.get('/results/class-subject', getClassSubjectResults);
router.get('/results/student-subject', getStudentSubjectResults);
router.get('/results/date-range', getDateRangeResults);
router.get('/results/performance-report', getPerformanceReport);

export default router;