import express from 'express';
import {
  getInstituteProfile,
  updateInstituteProfile,
  deleteInstituteLogo,
  getAllProfiles,
  getFeesParticulars,
  updateFeesParticulars
} from '../controllers/instituteController.js';
import { validateInstituteProfile } from '../middleware/validation.js';
import { uploadMiddleware, handleMulterError } from '../middleware/upload.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Profile routes
router.get('/profile', getInstituteProfile);
router.put(
  '/profile',
  uploadMiddleware,
  handleMulterError,
  validateInstituteProfile,
  updateInstituteProfile
);
router.delete('/profile/logo', deleteInstituteLogo);

// Fees particulars routes
router.get('/fees-particulars', getFeesParticulars);
router.put('/fees-particulars', updateFeesParticulars);

// All profiles route
router.get('/profiles', getAllProfiles);

export default router;