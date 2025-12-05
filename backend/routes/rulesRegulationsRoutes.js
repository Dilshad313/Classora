import express from 'express';
import {
  getAllRules,
  getRuleById,
  createRule,
  updateRule,
  deleteRule,
  reorderRules,
  getRulesStats,
  bulkDeleteRules
} from '../controllers/rulesRegulationsController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Statistics route (must be before /:id route)
router.get('/stats/summary', getRulesStats);

// Reorder route (must be before /:id route)
router.put('/reorder', reorderRules);

// Bulk operations
router.post('/bulk-delete', bulkDeleteRules);

// CRUD routes
router.get('/', getAllRules);
router.get('/:id', getRuleById);
router.post('/', createRule);
router.put('/:id', updateRule);
router.delete('/:id', deleteRule);

export default router;