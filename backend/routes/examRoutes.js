import express from 'express';
import {
  getAllExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
  togglePublishStatus,
  bulkDeleteExams,
  getExamStats,
  getExamDropdown,
  getExamMarksByClass,
  saveBulkMarks,
  generateResultCard,
  getResultCards,
  getResultCardById,
  getExamMarksDropdownData
} from '../controllers/examController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// ========== Exam CRUD Routes ==========
router.get('/', getAllExams);
router.get('/stats/summary', getExamStats);
router.get('/dropdown', getExamDropdown);
router.post('/bulk-delete', bulkDeleteExams);
router.get('/:id', getExamById);
router.post('/', createExam);
router.put('/:id', updateExam);
router.delete('/:id', deleteExam);
router.patch('/:id/toggle-publish', togglePublishStatus);

// ========== Exam Marks Routes ==========
router.get('/:examId/marks/class/:classId', getExamMarksByClass);
router.post('/:examId/marks/bulk', saveBulkMarks);
router.get('/marks/dropdown-data', getExamMarksDropdownData);

// ========== Result Card Routes ==========
router.get('/result-cards/all', getResultCards);
router.post('/result-cards/generate', generateResultCard);
router.get('/result-cards/:id', getResultCardById);

export default router;