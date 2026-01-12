// controllers/authController.js

import Admin from "../models/Admin.js";
import Student from "../models/Student.js";
import Employee from "../models/Employee.js";
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
      { id: admin._id, email: admin.email, role: 'admin' },
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
    const { email, password, adminKey } = req.body;

    console.log('📥 Admin login attempt for:', email);

    // Validate required fields
    if (!email || !password || !adminKey) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Email, password and admin key are required"
      });
    }

    // Validate admin key
    if (adminKey !== ADMIN_KEY) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Invalid admin key"
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
      { id: admin._id, email: admin.email, role: 'admin' },
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

    console.log('✅ Admin login successful:', admin.email);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Login successful",
      user: adminResponse,
      token
    });
  } catch (error) {
    console.error("❌ Admin login error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Server error during login"
    });
  }
};

export const loginStudent = async (req, res) => {
  try {
    const { email, password, adminKey } = req.body;

    console.log('📥 Student login attempt for:', email);

    if (!email || !password || !adminKey) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Email, password and admin key are required"
      });
    }

    if (adminKey !== ADMIN_KEY) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Invalid admin key"
      });
    }

    const student = await Student.findOne({ email: email.toLowerCase().trim() });

    if (!student) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    if (student.status && student.status !== 'active') {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: "Account is inactive. Please contact administrator."
      });
    }

    const isMatch = await student.comparePassword(password);

    if (!isMatch) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      { id: student._id, email: student.email, role: 'student' },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const studentResponse = {
      _id: student._id,
      fullName: student.studentName,
      email: student.email,
      role: 'student',
      class: student.selectClass,
      section: student.section,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt
    };

    console.log('✅ Student login successful:', student.email);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Login successful",
      user: studentResponse,
      token
    });
  } catch (error) {
    console.error("❌ Student login error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Server error during login"
    });
  }
};

export const loginEmployee = async (req, res) => {
  try {
    const { email, password, adminKey } = req.body;

    console.log('📥 Employee login attempt for:', email);

    if (!email || !password || !adminKey) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Email, password and admin key are required"
      });
    }

    if (adminKey !== ADMIN_KEY) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Invalid admin key"
      });
    }

    const employee = await Employee.findOne({ emailAddress: email.trim().toLowerCase() }).select('+password');

    if (!employee) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    if (employee.status && employee.status !== 'active') {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: "Account is inactive. Please contact administrator."
      });
    }

    const isMatch = await employee.comparePassword(password);

    if (!isMatch) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      { id: employee._id, email: employee.emailAddress, role: 'teacher' },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const employeeResponse = {
      _id: employee._id,
      fullName: employee.employeeName,
      email: employee.emailAddress,
      role: 'teacher',
      department: employee.department,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt
    };

    console.log('✅ Employee login successful:', employee.emailAddress);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Login successful",
      user: employeeResponse,
      token
    });
  } catch (error) {
    console.error("❌ Employee login error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Server error during login"
    });
  }
};

// GET CURRENT USER
export const getCurrentUser = async (req, res) => {
  try {
    const role = req.user.role || 'admin';
    let user = null;

    if (role === 'admin' || role === 'superadmin') {
      user = await Admin.findById(req.user.id).select('-password');
    } else if (role === 'student') {
      user = await Student.findById(req.user.id).select('-password');
    } else if (role === 'teacher') {
      user = await Employee.findById(req.user.id).select('-password');
    }

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      user: {
        ...user.toObject(),
        role
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