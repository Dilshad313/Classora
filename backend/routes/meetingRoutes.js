import express from 'express';
import {
  getMeetings,
  getMeetingById,
  createMeeting,
  updateMeeting,
  deleteMeeting,
  joinMeeting,
  getMeetingStats,
  bulkDeleteMeetings,
  updateMeetingStatus,
  getAvailableClasses,
  getAvailableStudents,
  getAvailableTeachers
} from '../controllers/meetingController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Statistics route
router.get('/stats/summary', getMeetingStats);

// Bulk operations
router.post('/bulk-delete', bulkDeleteMeetings);

// Available data routes
router.get('/available-classes', getAvailableClasses);
router.get('/available-students', getAvailableStudents);
router.get('/available-teachers', getAvailableTeachers);

// CRUD routes
router.get('/', getMeetings);
router.get('/:id', getMeetingById);
router.post('/', createMeeting);
router.put('/:id', updateMeeting);
router.delete('/:id', deleteMeeting);

// Join meeting
router.post('/:id/join', joinMeeting);

// Status update
router.patch('/:id/status', updateMeetingStatus);

export default router;