import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getTeacherClasses,
  getClassStudentsWithRatings,
  saveBehaviourRatings
} from '../controllers/behaviourController.js';

const router = express.Router();

router.use(authenticateToken);

// Get classes assigned to logged-in teacher
router.get('/classes', getTeacherClasses);

// Get students for a class with existing ratings
router.get('/class/:classId/students', getClassStudentsWithRatings);

// Save ratings
router.post('/save', saveBehaviourRatings);

export default router;
