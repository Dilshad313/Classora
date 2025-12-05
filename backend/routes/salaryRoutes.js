import express from 'express';
import {
  paySalary,
  getSalarySlip,
  getSalaryReport,
  getSalarySheet,
  getEmployeesForSalary,
  updateSalaryStatus,
  deleteSalary
} from '../controllers/salaryController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Salary payment routes
router.post('/pay', paySalary);
router.get('/employees', getEmployeesForSalary);
router.get('/slip/:id', getSalarySlip);
router.put('/:id/status', updateSalaryStatus);
router.delete('/:id', deleteSalary);

// Report and analytics routes
router.get('/report', getSalaryReport);
router.get('/sheet', getSalarySheet);

export default router;