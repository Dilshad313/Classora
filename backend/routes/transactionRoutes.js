import express from 'express';
import {
  getTransactions,
  getAccountStatement,
  addExpense,
  addIncome,
  deleteTransactions,
  getTransactionById,
  updateTransaction,
  getAccountStats
} from '../controllers/transactionController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Account routes
router.get('/', getTransactions);
router.get('/statement', getAccountStatement);
router.get('/stats', getAccountStats);
router.get('/:id', getTransactionById);

// Expense routes
router.post('/expense', addExpense);

// Income routes
router.post('/income', addIncome);

// Update and delete routes
router.put('/:id', updateTransaction);
router.delete('/bulk-delete', deleteTransactions);

export default router;