// controllers/authController.js

import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { StatusCodes } from 'http-status-codes';

const ADMIN_KEY = process.env.ADMIN_KEY || "CLASSORA2025";

// REGISTER
export const registerAdmin = async (req, res) => {
  try {
    const { fullName, email, password, adminKey } = req.body;

    // Validate required fields
    if (!fullName || !email || !password || !adminKey) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "All fields are required: fullName, email, password, adminKey"
      });
    }

    // Validate admin key
    if (adminKey !== ADMIN_KEY) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Invalid admin key"
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Please provide a valid email address"
      });
    }

    // Check if admin already exists
    const existing = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: "Email already exists"
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Password must be at least 6 characters long"
      });
    }

    // DON'T hash password here - let the model's pre-save hook handle it
    // Create admin with plain password (model will hash it)
    const admin = await Admin.create({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      password: password  // Plain password - will be hashed by model
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return success response (exclude password)
    const adminResponse = {
      _id: admin._id,
      fullName: admin.fullName,
      email: admin.email,
      role: 'admin',
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt
    };

    console.log('✅ Admin registered successfully:', admin.email);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Admin registered successfully",
      user: adminResponse,
      token
    });
  } catch (error) {
    console.error("❌ Register error:", error);

    // Handle duplicate key error (email already exists)
    if (error.code === 11000) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: "Email already exists"
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: messages[0] || 'Validation error'
      });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Server error during registration"
    });
  }
};

// LOGIN
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('📥 Login attempt for:', email);

    // Validate required fields
    if (!email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Find admin by email (include password for comparison)
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    
    if (!admin) {
      console.log('❌ Admin not found:', email);
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Compare password using the model method
    const isMatch = await admin.comparePassword(password);
    
    console.log('🔐 Password match:', isMatch);

    if (!isMatch) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return success response (exclude password)
    const adminResponse = {
      _id: admin._id,
      fullName: admin.fullName,
      email: admin.email,
      role: 'admin',
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt
    };

    console.log('✅ Login successful:', admin.email);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Login successful",
      user: adminResponse,
      token
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Server error during login"
    });
  }
};

// GET CURRENT USER
export const getCurrentUser = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select('-password');
    
    if (!admin) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      user: {
        ...admin.toObject(),
        role: 'admin'
      }
    });
  } catch (error) {
    console.error("❌ Get current user error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Server error"
    });
  }
};