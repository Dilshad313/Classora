import express from 'express';
import {
  getBilling,
  updateBilling,
  updateSubscription,
  cancelSubscription,
  getInvoices,
  addInvoice
} from '../controllers/billingController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Billing routes
router.get('/', getBilling);
router.put('/', updateBilling);

// Subscription routes
router.put('/subscription', updateSubscription);
router.post('/subscription/cancel', cancelSubscription);

// Invoice routes
router.get('/invoices', getInvoices);
router.post('/invoices', addInvoice);

export default router;