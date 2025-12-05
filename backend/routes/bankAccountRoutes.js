import express from 'express';
import {
  getAllBankAccounts,
  getBankAccountById,
  createBankAccount,
  updateBankAccount,
  deleteBankAccount,
  deleteBankAccountLogo,
  getBankAccountStats
} from '../controllers/bankAccountController.js';
import { uploadMiddleware, handleMulterError } from '../middleware/upload.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Statistics route (must be before /:id route)
router.get('/stats/summary', getBankAccountStats);

// CRUD routes
router.get('/', getAllBankAccounts);
router.get('/:id', getBankAccountById);
router.post('/', uploadMiddleware, handleMulterError, createBankAccount);
router.put('/:id', uploadMiddleware, handleMulterError, updateBankAccount);
router.delete('/:id', deleteBankAccount);

// Logo deletion route
router.delete('/:id/logo', deleteBankAccountLogo);

export default router;