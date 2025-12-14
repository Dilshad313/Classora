import express from 'express';
import { globalSearch } from '../controllers/searchController.js';
import { authenticateToken as protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, globalSearch);

export default router;
