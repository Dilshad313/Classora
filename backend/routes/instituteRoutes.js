import express from 'express';
import {
  getInstituteProfile,
  updateInstituteProfile,
  deleteInstituteLogo,
  getAllProfiles  // Add this
} from '../controllers/instituteController.js';
import { validateInstituteProfile } from '../middleware/validation.js';
import { uploadMiddleware, handleMulterError } from '../middleware/upload.js';

const router = express.Router();

// GET institute profile (first one)
router.get('/profile', getInstituteProfile);

// GET all profiles (for debugging)
router.get('/profiles', getAllProfiles);

// UPDATE institute profile
router.put(
  '/profile',
  uploadMiddleware,
  handleMulterError,
  validateInstituteProfile,
  updateInstituteProfile
);

// DELETE institute logo
router.delete('/profile/logo', deleteInstituteLogo);

export default router;