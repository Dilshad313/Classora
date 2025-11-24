import express from 'express';
const router = express.Router();

import {
  getInstituteProfile,
  updateInstituteProfile,
  deleteInstituteLogo,
} from '../controllers/instituteController.js';

import authenticateUser from '../middleware/auth.js';
import { uploadMiddleware, handleMulterError } from '../middleware/upload.js';

router.route('/profile').get(authenticateUser, getInstituteProfile);
router.route('/profile').put(authenticateUser, uploadMiddleware, handleMulterError, updateInstituteProfile);
router.route('/profile/logo').delete(authenticateUser, deleteInstituteLogo);

export default router;