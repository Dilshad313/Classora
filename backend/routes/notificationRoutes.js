import express from 'express';
import multer from 'multer';
import {
  getAllNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
  sendNotification,
  cancelNotification,
  togglePin,
  removeAttachment,
  getNotificationStats,
  getRecipients,
  addComment,
  getNotificationTemplates,
  getNotificationTemplate,
  createNotificationFromTemplateController
} from '../controllers/notificationController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Maximum 5 files
  },
  fileFilter: (req, file, cb) => {
    // Allow common file types
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'text/csv'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, PDFs, and office documents are allowed.'), false);
    }
  }
});

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Statistics route (should be before /:id routes)
router.get('/stats', getNotificationStats);

// Recipients route
router.get('/recipients', getRecipients);

// Template routes
router.get('/templates', getNotificationTemplates);
router.get('/templates/:templateName', getNotificationTemplate);
router.post('/from-template', createNotificationFromTemplateController);

// Main CRUD routes
router.get('/', getAllNotifications);
router.post('/', upload.fields([{ name: 'attachments', maxCount: 5 }]), createNotification);

router.get('/:id', getNotificationById);
router.put('/:id', upload.fields([{ name: 'attachments', maxCount: 5 }]), updateNotification);
router.delete('/:id', deleteNotification);

// Action routes
router.post('/:id/send', sendNotification);
router.post('/:id/cancel', cancelNotification);
router.post('/:id/pin', togglePin);

// Attachment management
router.delete('/:id/attachments/:attachmentId', removeAttachment);

// Comments
router.post('/:id/comments', addComment);

export default router;