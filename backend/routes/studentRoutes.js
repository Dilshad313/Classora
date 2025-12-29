import express from 'express';
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  updateStudentStatus,
  getAdmissionLetter,
  getLoginCredentials,
  updateLoginCredentials,
  promoteStudents,
  getBasicList,
  getStudentStats,
  bulkUpdateStudentStatus
} from '../controllers/studentController.js';
import { authenticateToken } from '../middleware/auth.js';
import { uploadMiddleware, handleMulterError } from '../middleware/upload.js';

const router = express.Router();

// Configure multer for student uploads (photo and documents)
import multer from 'multer';

const studentUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('application/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and document files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 10 // Maximum 10 files
  }
});

// Apply authentication to all routes
router.use(authenticateToken);

// Student routes
router.get('/', getStudents);
router.get('/stats', getStudentStats);
router.get('/print/basic-list', getBasicList);
router.get('/login-credentials', getLoginCredentials);
router.get('/:id', getStudentById);
router.get('/:id/admission-letter', getAdmissionLetter);

router.post(
  '/',
  studentUpload.fields([
    { name: 'picture', maxCount: 1 },
    { name: 'documents', maxCount: 9 }
  ]),
  handleMulterError,
  createStudent
);

router.put(
  '/:id',
  studentUpload.fields([
    { name: 'picture', maxCount: 1 },
    { name: 'documents', maxCount: 9 }
  ]),
  handleMulterError,
  updateStudent
);

router.patch('/bulk-status', bulkUpdateStudentStatus);
router.patch('/:id/status', updateStudentStatus);
router.put('/:id/login-credentials', updateLoginCredentials);
router.post('/promote', promoteStudents);
router.delete('/:id', deleteStudent);

export default router;