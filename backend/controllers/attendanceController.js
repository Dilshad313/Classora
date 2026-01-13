import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import Student from '../models/Student.js';
import Employee from '../models/Employee.js';
import StudentAttendance from '../models/StudentAttendance.js';
import EmployeeAttendance from '../models/EmployeeAttendance.js';

const normalizeClassName = (value = '') => {
  const match = value.toString().match(/\d+/);
  return match ? match[0] : value.toString().trim();
};

const normalizeSection = (value = '') => {
  const trimmed = value?.toString().trim() || 'A';
  if (trimmed.toUpperCase() === 'N/A' || trimmed === '') return 'A';
  return trimmed;
};

/**
 * Mark student attendance
 * @route POST /api/attendance/students
 */
export const markStudentAttendance = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date, class: classData, section, attendance } = req.body;
    const className = normalizeClassName(classData);
    const normalizedSection = normalizeSection(section);

    console.log('📥 POST /api/attendance/students');

    if (!date || !classData || !section || !attendance || !Array.isArray(attendance)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Date, class, section, and attendance array are required'
      });
    }

    // Process attendance records
    const attendanceRecords = attendance.map(record => ({
      updateOne: {
        filter: {
          student: record.studentId,
          date: new Date(date)
        },
        update: {
          $set: {
            student: record.studentId,
            date: new Date(date),
            status: record.status,
            class: className,
            section: normalizedSection,
            markedBy: userId,
            remark: record.remark || ''
          }
        },
        upsert: true
      }
    }));

    // Bulk write attendance records
    const result = await StudentAttendance.bulkWrite(attendanceRecords);

    console.log(`✅ Student attendance marked: ${result.upsertedCount + result.modifiedCount} records`);

    // Get updated statistics
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(attendanceDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const stats = await StudentAttendance.aggregate([
      {
        $match: {
          date: { $gte: attendanceDate, $lt: nextDay },
          class: className,
          section: normalizedSection
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          present: { $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] } },
          leave: { $sum: { $cond: [{ $eq: ['$status', 'leave'] }, 1, 0] } },
          absent: { $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] } }
        }
      }
    ]);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Attendance marked successfully',
      data: {
        markedCount: result.upsertedCount + result.modifiedCount,
        stats: stats[0] || { total: 0, present: 0, leave: 0, absent: 0 }
      }
    });
  } catch (error) {
    console.error('❌ Mark student attendance error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to mark attendance'
    });
  }
};

/**
 * Get students for attendance marking
 * @route GET /api/attendance/students/class
 */
export const getStudentsForAttendance = async (req, res) => {
  try {
    const { class: classData, section, date } = req.query;
    const className = normalizeClassName(classData);
    const normalizedSection = normalizeSection(section);

    console.log(`📥 GET /api/attendance/students/class`);

    if (!classData || !section) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Class and section are required'
      });
    }

    // Get students in the class (normalize to match stored value) and include legacy/inactive-null statuses
    const students = await Student.find({
      selectClass: { $in: [className, classData] },
      section: { $in: [normalizedSection, section] },
      status: { $in: ['active', null, undefined] }
    })
    .select('studentName registrationNo rollNumber section picture')
    .sort({ rollNumber: 1 });

    // Get existing attendance for the date if provided
    let existingAttendance = {};
    if (date) {
      const attendanceDate = new Date(date);
      attendanceDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(attendanceDate);
      nextDay.setDate(nextDay.getDate() + 1);

      const attendanceRecords = await StudentAttendance.find({
        student: { $in: students.map(s => s._id) },
        date: { $gte: attendanceDate, $lt: nextDay }
      });

      attendanceRecords.forEach(record => {
        existingAttendance[record.student.toString()] = record.status;
      });
    }

    // Combine student data with attendance status
    const studentsWithAttendance = students.map(student => ({
      ...student.toObject(),
      attendanceStatus: existingAttendance[student._id.toString()] || 'present'
    }));

    console.log(`✅ Found ${students.length} students for attendance`);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Students retrieved successfully',
      data: studentsWithAttendance
    });
  } catch (error) {
    console.error('❌ Get students for attendance error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch students'
    });
  }
};

/**
 * Mark employee attendance
 * @route POST /api/attendance/employees
 */
export const markEmployeeAttendance = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date, attendance } = req.body;

    console.log('📥 POST /api/attendance/employees');

    if (!date || !attendance || !Array.isArray(attendance)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Date and attendance array are required'
      });
    }

    // Process attendance records
    const attendanceRecords = attendance.map(record => ({
      updateOne: {
        filter: {
          employee: record.employeeId,
          date: new Date(date)
        },
        update: {
          $set: {
            employee: record.employeeId,
            date: new Date(date),
            status: record.status,
            markedBy: userId,
            remark: record.remark || ''
          }
        },
        upsert: true
      }
    }));

    // Bulk write attendance records
    const result = await EmployeeAttendance.bulkWrite(attendanceRecords);

    console.log(`✅ Employee attendance marked: ${result.upsertedCount + result.modifiedCount} records`);

    // Get updated statistics
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(attendanceDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const stats = await EmployeeAttendance.aggregate([
      {
        $match: {
          date: { $gte: attendanceDate, $lt: nextDay }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          present: { $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] } },
          leave: { $sum: { $cond: [{ $eq: ['$status', 'leave'] }, 1, 0] } },
          absent: { $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] } }
        }
      }
    ]);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Attendance marked successfully',
      data: {
        markedCount: result.upsertedCount + result.modifiedCount,
        stats: stats[0] || { total: 0, present: 0, leave: 0, absent: 0 }
      }
    });
  } catch (error) {
    console.error('❌ Mark employee attendance error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to mark attendance'
    });
  }
};

/**
 * Get employees for attendance marking
 * @route GET /api/attendance/employees
 */
export const getEmployeesForAttendance = async (req, res) => {
  try {
    const { date } = req.query;

    console.log(`📥 GET /api/attendance/employees`);

    // Get all active employees
    const employees = await Employee.find({ status: 'active' })
      .select('employeeName employeeId employeeRole department picture')
      .sort({ employeeName: 1 });

    // Get existing attendance for the date if provided
    let existingAttendance = {};
    if (date) {
      const attendanceDate = new Date(date);
      attendanceDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(attendanceDate);
      nextDay.setDate(nextDay.getDate() + 1);

      const attendanceRecords = await EmployeeAttendance.find({
        employee: { $in: employees.map(e => e._id) },
        date: { $gte: attendanceDate, $lt: nextDay }
      });

      attendanceRecords.forEach(record => {
        existingAttendance[record.employee.toString()] = record.status;
      });
    }

    // Combine employee data with attendance status
    const employeesWithAttendance = employees.map(employee => ({
      ...employee.toObject(),
      attendanceStatus: existingAttendance[employee._id.toString()] || 'present'
    }));

    console.log(`✅ Found ${employees.length} employees for attendance`);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Employees retrieved successfully',
      data: employeesWithAttendance
    });
  } catch (error) {
    console.error('❌ Get employees for attendance error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch employees'
    });
  }
};

/**
 * Get class-wise attendance report
 * @route GET /api/attendance/reports/class-wise
 */
export const getClassWiseReport = async (req, res) => {
  try {
    const { date, class: classFilter, classRaw, section: sectionFilter, month, year } = req.query;

    console.log(`📥 GET /api/attendance/reports/class-wise`);

    // Determine date range
    let startDate;
    let endDate;

    if (month && year) {
      // Month is 0-indexed on frontend; ensure number
      const m = parseInt(month, 10);
      const y = parseInt(year, 10);
      if (Number.isNaN(m) || Number.isNaN(y)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Invalid month or year'
        });
      }
      startDate = new Date(Date.UTC(y, m, 1));
      endDate = new Date(Date.UTC(y, m + 1, 0, 23, 59, 59, 999));
    } else if (date) {
      startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
    } else {
      const today = new Date();
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
    }

    // Build flexible class filter (normalized + raw)
    let classValues;
    if (classFilter || classRaw) {
      classValues = Array.from(new Set(
        [
          classFilter ? normalizeClassName(classFilter) : null,
          classFilter || null,
          classRaw ? normalizeClassName(classRaw) : null,
          classRaw || null
        ].filter(Boolean)
      ));
    }

    const report = await StudentAttendance.getClassWiseReport({
      startDate,
      endDate,
      classFilter: classValues,
      sectionFilter: sectionFilter ? normalizeSection(sectionFilter) : undefined
    });

    const summary = report.summary || {};

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Class-wise report generated successfully',
      data: {
        summary,
        daily: report.daily || [],
        range: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      }
    });
  } catch (error) {
    console.error('❌ Get class-wise report error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to generate report'
    });
  }
};

/**
 * Get student attendance report
 * @route GET /api/attendance/reports/students
 */
export const getStudentAttendanceReport = async (req, res) => {
  try {
    const { 
      startDate, 
      endDate, 
      search, 
      class: classFilter, 
      status,
      page = 1, 
      limit = 10 
    } = req.query;

    console.log(`📥 GET /api/attendance/reports/students`);

    if (!startDate || !endDate) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build filters
    const filters = {};
    if (search) filters.search = search;
    if (classFilter && classFilter !== 'all') filters.class = classFilter;
    if (status && status !== 'all') filters.status = status;

    // Get student attendance report
    const records = await StudentAttendance.getStudentReport(startDate, endDate, filters);
    
    // Apply pagination
    const total = records.length;
    const paginatedRecords = records.slice(skip, skip + parseInt(limit));

    console.log(`✅ Generated student report: ${total} records found`);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Student attendance report generated successfully',
      data: paginatedRecords,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('❌ Get student attendance report error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to generate report'
    });
  }
};

/**
 * Get employee attendance report
 * @route GET /api/attendance/reports/employees
 */
export const getEmployeeAttendanceReport = async (req, res) => {
  try {
    const { 
      startDate, 
      endDate, 
      search, 
      department, 
      role,
      status,
      page = 1, 
      limit = 10 
    } = req.query;

    console.log(`📥 GET /api/attendance/reports/employees`);

    if (!startDate || !endDate) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build filters
    const filters = {};
    if (search) filters.search = search;
    if (department && department !== 'all') filters.department = department;
    if (role && role !== 'all') filters.role = role;
    if (status && status !== 'all') filters.status = status;

    // Get employee attendance report
    const records = await EmployeeAttendance.getEmployeeReport(startDate, endDate, filters);
    
    // Apply pagination
    const total = records.length;
    const paginatedRecords = records.slice(skip, skip + parseInt(limit));

    console.log(`✅ Generated employee report: ${total} records found`);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Employee attendance report generated successfully',
      data: paginatedRecords,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('❌ Get employee attendance report error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to generate report'
    });
  }
};

/**
 * Export student attendance report
 * @route POST /api/attendance/reports/students/export
 */
export const exportStudentAttendanceReport = async (req, res) => {
  try {
    const { startDate, endDate, format = 'csv' } = req.body;

    console.log(`📥 POST /api/attendance/reports/students/export`);

    if (!startDate || !endDate) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }

    // Get student attendance report
    const records = await StudentAttendance.getStudentReport(startDate, endDate);

    // Format data for export
    const exportData = records.map(record => ({
      date: record.date.toISOString().split('T')[0],
      day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(record.date).getDay()],
      studentId: record.studentId,
      name: record.name,
      class: record.class,
      status: record.status
    }));

    console.log(`✅ Exported student report: ${exportData.length} records`);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Report exported successfully',
      data: exportData,
      format
    });
  } catch (error) {
    console.error('❌ Export student report error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to export report'
    });
  }
};

/**
 * Export employee attendance report
 * @route POST /api/attendance/reports/employees/export
 */
export const exportEmployeeAttendanceReport = async (req, res) => {
  try {
    const { startDate, endDate, format = 'csv' } = req.body;

    console.log(`📥 POST /api/attendance/reports/employees/export`);

    if (!startDate || !endDate) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }

    // Get employee attendance report
    const records = await EmployeeAttendance.getEmployeeReport(startDate, endDate);

    // Format data for export
    const exportData = records.map(record => ({
      date: record.date.toISOString().split('T')[0],
      day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(record.date).getDay()],
      employeeId: record.employeeId,
      name: record.name,
      role: record.role,
      department: record.department,
      status: record.status
    }));

    console.log(`✅ Exported employee report: ${exportData.length} records`);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Report exported successfully',
      data: exportData,
      format
    });
  } catch (error) {
    console.error('❌ Export employee report error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to export report'
    });
  }
};