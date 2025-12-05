import express from 'express';
import {
  collectFees,
  getFeePayments,
  getFeesDefaulters,
  getFeesPaidSlip,
  getFeesReport,
  deleteFeePayment,
  bulkDeleteFeePayments
} from '../controllers/feesControllers.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Collect fees
router.post('/collect', collectFees);

// Get fee payments with filters
router.get('/payments', getFeePayments);

// Get fees defaulters
router.get('/defaulters', getFeesDefaulters);

// Get fees paid slip
router.get('/paid-slip', getFeesPaidSlip);

// Get fees report
router.get('/report', getFeesReport);

// Delete single fee payment
router.delete('/payments/:id', deleteFeePayment);

// Bulk delete fee payments
router.delete('/payments', bulkDeleteFeePayments);

export default router;