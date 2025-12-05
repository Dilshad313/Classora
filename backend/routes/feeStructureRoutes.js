import express from 'express';
import {
  getAllFeeStructures,
  getFeeStructureById,
  createFeeStructure,
  updateFeeStructure,
  deleteFeeStructure,
  getFeeStructureStats
} from '../controllers/feeStructureController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Statistics route (must be before /:id route)
router.get('/stats/summary', getFeeStructureStats);

// CRUD routes
router.get('/', getAllFeeStructures);
router.get('/:id', getFeeStructureById);
router.post('/', createFeeStructure);
router.put('/:id', updateFeeStructure);
router.delete('/:id', deleteFeeStructure);

export default router;