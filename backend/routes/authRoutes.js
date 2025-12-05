// routes/authRoutes.js

import express from "express";
import { registerAdmin, loginAdmin, getCurrentUser } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// Protected routes
router.get("/me", authenticateToken, getCurrentUser);

export default router;