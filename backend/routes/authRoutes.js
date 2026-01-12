// routes/authRoutes.js

import express from "express";
import { registerAdmin, loginAdmin, loginStudent, loginEmployee, getCurrentUser } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/login/student", loginStudent);
router.post("/login/employee", loginEmployee);

// Protected routes
router.get("/me", authenticateToken, getCurrentUser);

export default router;