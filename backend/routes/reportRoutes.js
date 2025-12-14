import express from 'express';
import {
  getParentInfo,
  exportParentInfoCSV,
  exportParentInfoExcel,
  getStudentInfo,
  exportStudentInfoCSV,
  exportStudentInfoExcel,
  getStudentReport,
  searchStudentsForReport,
  generateStudentReportPDF,
  getReportStats
} from '../controllers/reportController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Report statistics
router.get('/stats', getReportStats);

// Parent Information Routes
router.get('/parent-info', getParentInfo);
router.get('/parent-info/export/csv', exportParentInfoCSV);
router.get('/parent-info/export/excel', exportParentInfoExcel);

// Student Information Routes
router.get('/student-info', getStudentInfo);
router.get('/student-info/export/csv', exportStudentInfoCSV);
router.get('/student-info/export/excel', exportStudentInfoExcel);

// Student Report Routes
router.get('/student-report/search', searchStudentsForReport);
router.get('/student-report/:studentId', getStudentReport);
router.get('/student-report/:studentId/pdf', generateStudentReportPDF);

export default router;