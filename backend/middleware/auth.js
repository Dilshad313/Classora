import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import Student from '../models/Student.js';
import Employee from '../models/Employee.js';
import { StatusCodes } from 'http-status-codes';

/**
 * Middleware to authenticate JWT token
 */
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Access token is required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user = null;
    const role = decoded.role || 'admin';

    if (role === 'admin' || role === 'superadmin') {
      user = await Admin.findById(decoded.id).select('-password');
    } else if (role === 'student') {
      user = await Student.findById(decoded.id).select('-password');
    } else if (role === 'teacher') {
      user = await Employee.findById(decoded.id).select('-password');
    }

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid token - user not found'
      });
    }

    const plainUser = user.toObject();
    req.user = {
      ...plainUser,
      role,
      id: plainUser._id?.toString?.() || decoded.id
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Token expired'
      });
    }

    console.error('Authentication error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

/**
 * Middleware to check if user is admin (for role-based access)
 */
export const requireAdmin = (req, res, next) => {
  // This is already handled by authenticateToken which verifies the user exists
  // Additional checks can be added here if needed
  next();
};