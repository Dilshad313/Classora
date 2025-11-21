const express = require('express');
const attendanceController = require('../controllers/attendanceController');

const router = express.Router();

// Students
router.get('/students', attendanceController.getStudentAttendance);
router.post('/students', attendanceController.setStudentAttendance);

// Employees
router.get('/employees', attendanceController.getEmployeeAttendance);
router.post('/employees', attendanceController.setEmployeeAttendance);

module.exports = router;