import express from 'express';
import { 
  getAvailableClasses,
  assignSubjects, 
  getClassesWithSubjects, 
  deleteAssignment,
  getSubjectStats,
  getAllSubjects,
  createSubject,
  updateSubject,
  deleteSubjectById,
  getSubjectsByClass
} from '../controllers/subjectController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get available classes (for dropdown) - This should come before :id routes
router.get('/list-classes', getAvailableClasses);

// Get all subjects
router.get('/all', getAllSubjects);

// Get classes with assigned subjects
router.get('/classes', getClassesWithSubjects);

// Get subjects by class ID
router.get('/by-class/:classId', getSubjectsByClass);

// Get statistics
router.get('/stats', getSubjectStats);

// Create subject
router.post('/create', createSubject);

// Update subject
router.put('/update/:id', updateSubject);

// Delete subject by ID
router.delete('/delete/:id', deleteSubjectById);

// Assign subjects to a class
router.post('/assign', assignSubjects);

// Delete subject assignment
router.delete('/:id', deleteAssignment);

export default router;