import express from 'express';
import {
  getAllGradingSystems,
  getGradingSystemById,
  createGradingSystem,
  updateGradingSystem,
  deleteGradingSystem,
  getActiveGradingSystem,
  setActiveGradingSystem,
  bulkUpdateGrades,
  resetToDefault,
  validateGradingSystem,
  getGradeForMarks,
  getGradingStats
} from '../controllers/marksGradingController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Statistics route (must be before /:id routes)
router.get('/stats/summary', getGradingStats);

// Validation route
router.get('/validate', validateGradingSystem);

// Get grade for marks
router.get('/get-grade/:marks', getGradeForMarks);

// Get active grading system
router.get('/active', getActiveGradingSystem);

// Bulk operations
router.put('/bulk-update', bulkUpdateGrades);
router.post('/reset-default', resetToDefault);

// Set active grading system
router.put('/:id/activate', setActiveGradingSystem);

// CRUD routes
router.get('/', getAllGradingSystems);
router.get('/:id', getGradingSystemById);
router.post('/', createGradingSystem);
router.put('/:id', updateGradingSystem);
router.delete('/:id', deleteGradingSystem);

export default router;