import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getTeacherClasses,
  getClassStudentsWithRatings,
  saveSkillRatings
} from '../controllers/skillController.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/classes', getTeacherClasses);
router.get('/class/:classId/students', getClassStudentsWithRatings);
router.post('/save', saveSkillRatings);

export default router;
