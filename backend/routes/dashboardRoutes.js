import express from 'express';
import { getDashboardStats, getTeacherDashboardStats } from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', protect, getDashboardStats);
router.get('/teacher/stats', authenticateToken, getTeacherDashboardStats);

export default router;
