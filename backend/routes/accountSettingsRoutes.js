import express from 'express';
import {
  getAccountSettings,
  updateAccountSettings,
  deleteAccount,
  changePassword
} from '../controllers/accountSettingsController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Account settings routes
router.get('/', getAccountSettings);
router.put('/', updateAccountSettings);
router.delete('/', deleteAccount);
router.put('/change-password', changePassword);

export default router;
