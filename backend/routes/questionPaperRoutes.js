// routes/questionPaperRoutes.js
import express from 'express';
import {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  bulkDeleteQuestions,
  getQuestionStats,
  getDropdownData
} from '../controllers/questionController.js';

import {
  getChapters,
  getChapterById,
  createChapter,
  updateChapter,
  deleteChapter,
  getChapterStats,
  bulkUpdateChapters
} from '../controllers/chapterController.js';

import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// ==================== QUESTION ROUTES ====================

// Question statistics
router.get('/questions/stats/summary', getQuestionStats);

// Dropdown data
router.get('/dropdown-data', getDropdownData);

// Bulk operations
router.post('/questions/bulk-delete', bulkDeleteQuestions);

// CRUD operations for questions
router.get('/questions', getQuestions);
router.get('/questions/:id', getQuestionById);
router.post('/questions', createQuestion);
router.put('/questions/:id', updateQuestion);
router.delete('/questions/:id', deleteQuestion);

// ==================== CHAPTER ROUTES ====================

// Chapter statistics
router.get('/chapters/stats/summary', getChapterStats);

// Bulk operations for chapters
router.put('/chapters/bulk-update', bulkUpdateChapters);

// CRUD operations for chapters
router.get('/chapters', getChapters);
router.get('/chapters/:id', getChapterById);
router.post('/chapters', createChapter);
router.put('/chapters/:id', updateChapter);
router.delete('/chapters/:id', deleteChapter);

export default router;