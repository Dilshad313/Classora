import express from 'express';
import {
  getUserNotifications,
  getUserNotificationById,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  addCommentToNotification,
  trackNotificationClick,
  getUserNotificationStats
} from '../controllers/userNotificationController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Statistics route (should be before /:id routes)
router.get('/stats', getUserNotificationStats);

// Bulk actions
router.post('/read-all', markAllNotificationsAsRead);

// Main routes
router.get('/', getUserNotifications);
router.get('/:id', getUserNotificationById);

// Individual notification actions
router.post('/:id/read', markNotificationAsRead);
router.post('/:id/comments', addCommentToNotification);
router.post('/:id/click', trackNotificationClick);

export default router;