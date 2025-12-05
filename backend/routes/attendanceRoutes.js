import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  markStudentAttendance,
  getStudentsForAttendance,
  markEmployeeAttendance,
  getEmployeesForAttendance,
  getClassWiseReport,
  getStudentAttendanceReport,
  getEmployeeAttendanceReport,
  exportStudentAttendanceReport,
  exportEmployeeAttendanceReport
} from '../controllers/attendanceController.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Student attendance routes
router.get('/students/class', getStudentsForAttendance);
router.post('/students', markStudentAttendance);

// Employee attendance routes
router.get('/employees', getEmployeesForAttendance);
router.post('/employees', markEmployeeAttendance);

// Report routes
router.get('/reports/class-wise', getClassWiseReport);
router.get('/reports/students', getStudentAttendanceReport);
router.get('/reports/employees', getEmployeeAttendanceReport);
router.post('/reports/students/export', exportStudentAttendanceReport);
router.post('/reports/employees/export', exportEmployeeAttendanceReport);

export default router;