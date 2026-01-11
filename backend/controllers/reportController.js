import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import Parent from '../models/Parent.js';
import Student from '../models/Student.js';
import Employee from '../models/Employee.js';
import Class from '../models/Class.js';
import TestResult from '../models/TestResult.js';
import StudentAttendance from '../models/StudentAttendance.js';

import { Parser } from 'json2csv';
import ExcelJS from 'exceljs';

/**
 * Get parent information report
 * @route GET /api/reports/parent-info
 */
export const getParentInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      search,
      class: studentClass,
      fatherOccupation,
      fatherProfession,
      page = 1,
      limit = 10
    } = req.query;

    console.log(`📥 GET /api/reports/parent-info for user: ${userId}`);

    // Build query
    const query = { createdBy: userId };

    if (search) {
      query.$or = [
        { studentName: { $regex: search, $options: 'i' } },
        { fatherName: { $regex: search, $options: 'i' } },
        { motherName: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } }
      ];
    }

    if (studentClass && studentClass !== 'all') {
      query.class = studentClass;
    }

    if (fatherOccupation && fatherOccupation !== 'all') {
      query.fatherOccupation = fatherOccupation;
    }

    if (fatherProfession && fatherProfession !== 'all') {
      query.fatherProfession = fatherProfession;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [parents, total] = await Promise.all([
      Parent.find(query)
        .sort({ studentName: 1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Parent.countDocuments(query)
    ]);

    // Get statistics
    const classDistribution = await Parent.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$class',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const occupationDistribution = await Parent.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$fatherOccupation',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    console.log(`✅ Found ${parents.length} parent records`);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Parent information retrieved successfully',
      count: parents.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: parents,
      stats: {
        classDistribution,
        occupationDistribution
      }
    });
  } catch (error) {
    console.error('❌ Get parent info error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch parent information'
    });
  }
};

/**
 * Export parent information to CSV
 * @route GET /api/reports/parent-info/export/csv
 */
export const exportParentInfoCSV = async (req, res) => {
  try {
    const userId = req.user.id;
    const { search, class: studentClass } = req.query;

    console.log(`📥 GET /api/reports/parent-info/export/csv`);

    // Build query
    const query = { createdBy: userId };

    if (search) {
      query.$or = [
        { studentName: { $regex: search, $options: 'i' } },
        { fatherName: { $regex: search, $options: 'i' } }
      ];
    }

    if (studentClass && studentClass !== 'all') {
      query.class = studentClass;
    }

    const parents = await Parent.find(query)
      .sort({ studentName: 1 });

    // Prepare CSV data
    const csvData = parents.map((parent, index) => ({
      Sr: index + 1,
      ID: parent.studentId,
      Name: parent.studentName,
      Class: parent.classDisplay,
      'Father Name': parent.fatherName,
      'Father National ID': parent.fatherNationalId || '',
      Education: parent.fatherEducation || '',
      'Mobile No': parent.fatherMobile,
      Occupation: parent.fatherOccupation || '',
      Profession: parent.fatherProfession || '',
      Income: parent.fatherIncome ? `₹${parent.fatherIncome.toLocaleString()}` : '₹0',
      'Mother Name': parent.motherName
    }));

    const fields = [
      'Sr', 'ID', 'Name', 'Class', 'Father Name', 'Father National ID',
      'Education', 'Mobile No', 'Occupation', 'Profession', 'Income', 'Mother Name'
    ];

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(csvData);

    // Set headers
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=parent_info.csv');

    res.status(StatusCodes.OK).send(csv);
  } catch (error) {
    console.error('❌ Export parent info CSV error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to export parent information'
    });
  }
};

/**
 * Export parent information to Excel
 * @route GET /api/reports/parent-info/export/excel
 */
export const exportParentInfoExcel = async (req, res) => {
  try {
    const userId = req.user.id;
    const { search, class: studentClass } = req.query;

    console.log(`📥 GET /api/reports/parent-info/export/excel`);

    // Build query
    const query = { createdBy: userId };

    if (search) {
      query.$or = [
        { studentName: { $regex: search, $options: 'i' } },
        { fatherName: { $regex: search, $options: 'i' } }
      ];
    }

    if (studentClass && studentClass !== 'all') {
      query.class = studentClass;
    }

    const parents = await Parent.find(query)
      .sort({ studentName: 1 });

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Parent Information');

    // Add headers
    worksheet.columns = [
      { header: 'Sr', key: 'sr', width: 5 },
      { header: 'ID', key: 'id', width: 15 },
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Class', key: 'class', width: 15 },
      { header: 'Father Name', key: 'fatherName', width: 25 },
      { header: 'Father National ID', key: 'fatherNationalId', width: 20 },
      { header: 'Education', key: 'education', width: 20 },
      { header: 'Mobile No', key: 'mobileNo', width: 15 },
      { header: 'Occupation', key: 'occupation', width: 20 },
      { header: 'Profession', key: 'profession', width: 20 },
      { header: 'Income', key: 'income', width: 15 },
      { header: 'Mother Name', key: 'motherName', width: 25 }
    ];

    // Style headers
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4F81BD' }
    };
    worksheet.getRow(1).alignment = { horizontal: 'center' };

    // Add data
    parents.forEach((parent, index) => {
      worksheet.addRow({
        sr: index + 1,
        id: parent.studentId,
        name: parent.studentName,
        class: parent.classDisplay,
        fatherName: parent.fatherName,
        fatherNationalId: parent.fatherNationalId || '',
        education: parent.fatherEducation || '',
        mobileNo: parent.fatherMobile,
        occupation: parent.fatherOccupation || '',
        profession: parent.fatherProfession || '',
        income: parent.fatherIncome ? `₹${parent.fatherIncome.toLocaleString()}` : '₹0',
        motherName: parent.motherName
      });
    });

    // Format cells
    worksheet.getColumn('sr').alignment = { horizontal: 'center' };
    worksheet.getColumn('income').numFmt = '"₹"#,##0';

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=parent_info.xlsx');

    // Write to response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('❌ Export parent info Excel error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to export parent information'
    });
  }
};

/**
 * Get student information report
 * @route GET /api/reports/student-info
 */
export const getStudentInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      search,
      class: studentClass,
      gender,
      status,
      page = 1,
      limit = 10
    } = req.query;

    console.log(`📥 GET /api/reports/student-info for user: ${userId}`);

    // Build query
    const query = {};

    if (search) {
      query.$or = [
        { studentName: { $regex: search, $options: 'i' } },
        { registrationNo: { $regex: search, $options: 'i' } },
        { admissionNumber: { $regex: search, $options: 'i' } },
        { fatherName: { $regex: search, $options: 'i' } }
      ];
    }

    if (studentClass && studentClass !== 'all') {
      query.selectClass = studentClass;
    }

    if (gender && gender !== 'all') {
      query.gender = gender;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [students, total] = await Promise.all([
      Student.find(query)
        .select('-password -documents')
        .sort({ selectClass: 1, studentName: 1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Student.countDocuments(query)
    ]);

    // Transform data for report
    const studentData = students.map(student => ({
      _id: student._id,
      id: student.registrationNo,
      name: student.studentName,
      fatherName: student.fatherName || '',
      class: `Grade ${student.selectClass} - ${student.section}`,
      discount: student.discountInFee ? `${student.discountInFee}%` : '0%',
      admissionDate: student.dateOfAdmission?.toISOString().split('T')[0] || '',
      dob: student.dateOfBirth?.toISOString().split('T')[0] || '',
      age: student.age || 0,
      gender: student.gender || '',
      birthFormId: student.registrationNo // Using registration no as birth form ID for now
    }));

    // Get statistics
    const classDistribution = await Student.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$selectClass',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const genderDistribution = await Student.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$gender',
          count: { $sum: 1 }
        }
      }
    ]);

    const statusDistribution = await Student.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    console.log(`✅ Found ${students.length} students`);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Student information retrieved successfully',
      count: students.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: studentData,
      stats: {
        classDistribution,
        genderDistribution,
        statusDistribution
      }
    });
  } catch (error) {
    console.error('❌ Get student info error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch student information'
    });
  }
};

/**
 * Export student information to CSV
 * @route GET /api/reports/student-info/export/csv
 */
export const exportStudentInfoCSV = async (req, res) => {
  try {
    const { search, class: studentClass, gender, status } = req.query;

    console.log(`📥 GET /api/reports/student-info/export/csv`);

    // Build query
    const query = {};

    if (search) {
      query.$or = [
        { studentName: { $regex: search, $options: 'i' } },
        { registrationNo: { $regex: search, $options: 'i' } }
      ];
    }

    if (studentClass && studentClass !== 'all') {
      query.selectClass = studentClass;
    }

    if (gender && gender !== 'all') {
      query.gender = gender;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    const students = await Student.find(query)
      .select('studentName registrationNo fatherName selectClass section discountInFee dateOfAdmission dateOfBirth gender')
      .sort({ selectClass: 1, studentName: 1 });

    // Prepare CSV data
    const csvData = students.map((student, index) => {
      // Calculate age
      let age = 0;
      if (student.dateOfBirth) {
        const today = new Date();
        const birthDate = new Date(student.dateOfBirth);
        age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
      }

      return {
        Sr: index + 1,
        ID: student.registrationNo,
        'Student Name': student.studentName,
        'Father Name': student.fatherName || '',
        Class: `Grade ${student.selectClass} - ${student.section}`,
        'Discount in Fee': student.discountInFee ? `${student.discountInFee}%` : '0%',
        'Admission Date': student.dateOfAdmission?.toISOString().split('T')[0] || '',
        'Date of Birth': student.dateOfBirth?.toISOString().split('T')[0] || '',
        Age: age,
        Gender: student.gender || '',
        'Birth Form ID': student.registrationNo
      };
    });

    const fields = [
      'Sr', 'ID', 'Student Name', 'Father Name', 'Class',
      'Discount in Fee', 'Admission Date', 'Date of Birth',
      'Age', 'Gender', 'Birth Form ID'
    ];

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(csvData);

    // Set headers
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=student_info.csv');

    res.status(StatusCodes.OK).send(csv);
  } catch (error) {
    console.error('❌ Export student info CSV error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to export student information'
    });
  }
};

/**
 * Export student information to Excel
 * @route GET /api/reports/student-info/export/excel
 */
export const exportStudentInfoExcel = async (req, res) => {
  try {
    const { search, class: studentClass, gender, status } = req.query;

    console.log(`📥 GET /api/reports/student-info/export/excel`);

    // Build query
    const query = {};

    if (search) {
      query.$or = [
        { studentName: { $regex: search, $options: 'i' } },
        { registrationNo: { $regex: search, $options: 'i' } }
      ];
    }

    if (studentClass && studentClass !== 'all') {
      query.selectClass = studentClass;
    }

    if (gender && gender !== 'all') {
      query.gender = gender;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    const students = await Student.find(query)
      .select('studentName registrationNo fatherName selectClass section discountInFee dateOfAdmission dateOfBirth gender')
      .sort({ selectClass: 1, studentName: 1 });

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Student Information');

    // Add headers
    worksheet.columns = [
      { header: 'Sr', key: 'sr', width: 5 },
      { header: 'ID', key: 'id', width: 15 },
      { header: 'Student Name', key: 'name', width: 25 },
      { header: 'Father Name', key: 'fatherName', width: 25 },
      { header: 'Class', key: 'class', width: 20 },
      { header: 'Discount in Fee', key: 'discount', width: 15 },
      { header: 'Admission Date', key: 'admissionDate', width: 15 },
      { header: 'Date of Birth', key: 'dob', width: 15 },
      { header: 'Age', key: 'age', width: 5 },
      { header: 'Gender', key: 'gender', width: 10 },
      { header: 'Birth Form ID', key: 'birthFormId', width: 15 }
    ];

    // Style headers
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4F81BD' }
    };
    worksheet.getRow(1).alignment = { horizontal: 'center' };

    // Add data
    students.forEach((student, index) => {
      // Calculate age
      let age = 0;
      if (student.dateOfBirth) {
        const today = new Date();
        const birthDate = new Date(student.dateOfBirth);
        age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
      }

      worksheet.addRow({
        sr: index + 1,
        id: student.registrationNo,
        name: student.studentName,
        fatherName: student.fatherName || '',
        class: `Grade ${student.selectClass} - ${student.section}`,
        discount: student.discountInFee ? `${student.discountInFee}%` : '0%',
        admissionDate: student.dateOfAdmission?.toISOString().split('T')[0] || '',
        dob: student.dateOfBirth?.toISOString().split('T')[0] || '',
        age: age,
        gender: student.gender || '',
        birthFormId: student.registrationNo
      });
    });

    // Format cells
    worksheet.getColumn('sr').alignment = { horizontal: 'center' };
    worksheet.getColumn('age').alignment = { horizontal: 'center' };

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=student_info.xlsx');

    // Write to response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('❌ Export student info Excel error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to export student information'
    });
  }
};

/**
 * Get student report (detailed)
 * @route GET /api/reports/student-report/:studentId
 */
export const getStudentReport = async (req, res) => {
  try {
    const { studentId } = req.params;
    const userId = req.user.id;

    console.log(`📥 GET /api/reports/student-report/${studentId}`);

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Get student details
    const student = await Student.findById(studentId)
      .select('-password -documents');

    if (!student) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Get test results for this student (do not block on createdBy to ensure all records are considered)
    const testResults = await TestResult.find({
      student: studentId
    })
    .sort({ testDate: -1 })
    .limit(20);

    // Get attendance summary for this student
    const attendanceSummary = await StudentAttendance.aggregate([
      {
        $match: {
          student: new mongoose.Types.ObjectId(studentId)
        }
      },
      {
        $group: {
          _id: '$student',
          totalDays: { $sum: 1 },
          presentDays: { $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] } },
          leaveDays: { $sum: { $cond: [{ $eq: ['$status', 'leave'] }, 1, 0] } },
          absentDays: { $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] } }
        }
      },
      {
        $project: {
          _id: 0,
          totalDays: 1,
          presentDays: 1,
          leaveDays: 1,
          absentDays: 1,
          attendancePercentage: {
            $cond: [
              { $gt: ['$totalDays', 0] },
              {
                $multiply: [
                  { $divide: [{ $add: ['$presentDays', '$leaveDays'] }, '$totalDays'] },
                  100
                ]
              },
              0
            ]
          }
        }
      }
    ]);

    const attendanceData = attendanceSummary[0] || {
      totalDays: 0,
      presentDays: 0,
      leaveDays: 0,
      absentDays: 0,
      attendancePercentage: 0
    };

    // Get subject-wise performance (compute percentage if missing)
    const subjectPerformance = await TestResult.aggregate([
      {
        $match: {
          student: new mongoose.Types.ObjectId(studentId)
        }
      },
      {
        $addFields: {
          percentageValue: {
            $cond: [
              { $ifNull: ['$percentage', false] },
              '$percentage',
              {
                $cond: [
                  { $gt: ['$maxScore', 0] },
                  { $multiply: [{ $divide: ['$score', '$maxScore'] }, 100] },
                  0
                ]
              }
            ]
          }
        }
      },
      {
        $group: {
          _id: '$subject',
          totalTests: { $sum: 1 },
          averageScore: { $avg: '$score' },
          averagePercentage: { $avg: '$percentageValue' },
          bestScore: { $max: '$score' },
          worstScore: { $min: '$score' },
          latestTest: { $max: '$testDate' }
        }
      },
      {
        $project: {
          subject: '$_id',
          totalTests: 1,
          averageScore: { $round: ['$averageScore', 2] },
          averagePercentage: { $round: ['$averagePercentage', 2] },
          bestScore: 1,
          worstScore: 1,
          latestTest: 1
        }
      },
      { $sort: { subject: 1 } }
    ]);

    // Fallback aggregation in JS if Mongo pipeline returns empty (handles legacy records)
    let computedSubjects = subjectPerformance;
    if ((!subjectPerformance || subjectPerformance.length === 0) && testResults.length > 0) {
      const subjectMap = {};
      testResults.forEach(tr => {
        const perc = typeof tr.percentage === 'number' && !Number.isNaN(tr.percentage)
          ? tr.percentage
          : (tr.maxScore > 0 ? (tr.score / tr.maxScore) * 100 : 0);
        const key = tr.subject || 'Unknown';
        if (!subjectMap[key]) {
          subjectMap[key] = {
            subject: key,
            totalTests: 0,
            totalScore: 0,
            totalPercentage: 0,
            bestScore: Number.NEGATIVE_INFINITY,
            worstScore: Number.POSITIVE_INFINITY,
            latestTest: tr.testDate ? new Date(tr.testDate) : null
          };
        }
        const bucket = subjectMap[key];
        bucket.totalTests += 1;
        bucket.totalScore += tr.score || 0;
        bucket.totalPercentage += perc;
        bucket.bestScore = Math.max(bucket.bestScore, tr.score || 0);
        bucket.worstScore = Math.min(bucket.worstScore, tr.score || 0);
        if (tr.testDate && (!bucket.latestTest || new Date(tr.testDate) > bucket.latestTest)) {
          bucket.latestTest = new Date(tr.testDate);
        }
      });

      computedSubjects = Object.values(subjectMap).map(sub => ({
        subject: sub.subject,
        totalTests: sub.totalTests,
        averageScore: Math.round((sub.totalScore / sub.totalTests) * 100) / 100,
        averagePercentage: Math.round((sub.totalPercentage / sub.totalTests) * 100) / 100,
        bestScore: sub.bestScore,
        worstScore: sub.worstScore,
        latestTest: sub.latestTest
      })).sort((a, b) => a.subject.localeCompare(b.subject));
    }

    // Calculate overall statistics
    const statsSource = (computedSubjects && computedSubjects.length > 0) ? computedSubjects : subjectPerformance;
    const overallStats = statsSource.reduce((acc, subject) => {
      acc.totalTests += subject.totalTests;
      acc.totalPercentage += (subject.averagePercentage || 0) * subject.totalTests;
      return acc;
    }, { totalTests: 0, totalPercentage: 0 });

    // Fallback calculations directly from test results to avoid 0% display when aggregation misses data
    const testsFromResults = testResults.length;
    const averageFromTests = testsFromResults > 0
      ? testResults.reduce((acc, tr) => {
          const perc = typeof tr.percentage === 'number' && !Number.isNaN(tr.percentage)
            ? tr.percentage
            : (tr.maxScore > 0 ? (tr.score / tr.maxScore) * 100 : 0);
          return acc + perc;
        }, 0) / testsFromResults
      : 0;

    const totalTestsCount = overallStats.totalTests || testsFromResults;
    const weightedAverage = overallStats.totalTests > 0
      ? overallStats.totalPercentage / overallStats.totalTests
      : null;
    const overallAverage = weightedAverage !== null ? weightedAverage : averageFromTests;

    const overallAttendance = Math.round(attendanceData.attendancePercentage);

    // Get recent tests
    const recentTests = testResults.slice(0, 10).map(test => ({
      date: test.testDate ? test.testDate.toISOString().split('T')[0] : '',
      subject: test.subject,
      test: test.testName,
      score: test.score,
      maxScore: test.maxScore
    }));

    // Prepare response
    const report = {
      student: {
        _id: student._id,
        name: student.studentName,
        rollNo: student.registrationNo,
        class: `Grade ${student.selectClass} - ${student.section}`,
        fatherName: student.fatherName || '',
        dob: student.dateOfBirth?.toISOString().split('T')[0] || '',
        gender: student.gender || '',
        email: student.emailAddress || '',
        phone: student.mobileNo || '',
        address: student.address || '',
        profilePic: student.picture?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.studentName)}&background=0D8ABC&color=fff&size=200`
      },
      performance: {
        subjects: statsSource.map(subject => ({
          name: subject.subject,
          score: subject.averagePercentage ?? 0,
          grade: (subject.averagePercentage ?? 0) >= 90 ? 'A+' :
                 (subject.averagePercentage ?? 0) >= 80 ? 'A' :
                 (subject.averagePercentage ?? 0) >= 70 ? 'B+' :
                 (subject.averagePercentage ?? 0) >= 60 ? 'B' :
                 (subject.averagePercentage ?? 0) >= 50 ? 'C' :
                 (subject.averagePercentage ?? 0) >= 40 ? 'D' : 'F',
          attendance: overallAttendance
        })),
        overall: {
          average: Math.round(overallAverage),
          rank: 2, // You would need to calculate this from all students
          attendance: overallAttendance,
          totalTests: totalTestsCount
        },
        recentTests: recentTests
      }
    };

    console.log('✅ Student report generated');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Student report retrieved successfully',
      data: report
    });
  } catch (error) {
    console.error('❌ Get student report error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to generate student report'
    });
  }
};

/**
 * Search students for report
 * @route GET /api/reports/student-report/search
 */
export const searchStudentsForReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const { search } = req.query;

    console.log(`📥 GET /api/reports/student-report/search`);

    const query = {};

    if (search) {
      query.$or = [
        { studentName: { $regex: search, $options: 'i' } },
        { registrationNo: { $regex: search, $options: 'i' } },
        { selectClass: { $regex: search, $options: 'i' } }
      ];
    }

    // Limit results for search
    const limit = search ? 10 : 5;

    const students = await Student.find(query)
      .select('studentName registrationNo selectClass section picture')
      .limit(limit)
      .sort({ studentName: 1 });

    const result = students.map(student => ({
      id: student._id,
      name: student.studentName,
      rollNo: student.registrationNo,
      class: `Grade ${student.selectClass} - ${student.section}`,
      profilePic: student.picture?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.studentName)}&background=0D8ABC&color=fff&size=100`
    }));

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Students retrieved successfully',
      data: result
    });
  } catch (error) {
    console.error('❌ Search students error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to search students'
    });
  }
};

/**
 * Generate student report PDF (placeholder)
 * @route GET /api/reports/student-report/:studentId/pdf
 */
export const generateStudentReportPDF = async (req, res) => {
  try {
    const { studentId } = req.params;

    console.log(`📥 GET /api/reports/student-report/${studentId}/pdf`);

    // This is a placeholder for PDF generation
    // You would typically use a library like pdfkit or puppeteer here

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'PDF generation endpoint (placeholder)',
      data: {
        studentId,
        pdfUrl: `/reports/${studentId}/report.pdf`
      }
    });
  } catch (error) {
    console.error('❌ Generate PDF error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to generate PDF report'
    });
  }
};

/**
 * Get report statistics
 * @route GET /api/reports/stats
 */
export const getReportStats = async (req, res) => {
  try {
    const userId = req.user.id;

    console.log(`📥 GET /api/reports/stats for user: ${userId}`);

    // Get counts
    const totalStudents = await Student.countDocuments();
    const totalParents = await Parent.countDocuments({ createdBy: userId });
    const totalClasses = await Class.countDocuments({ createdBy: userId });

    // Get recent activity
    const recentStudents = await Student.find()
      .select('studentName registrationNo dateOfAdmission')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get class-wise distribution
    const classDistribution = await Student.aggregate([
      {
        $group: {
          _id: '$selectClass',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Report statistics retrieved successfully',
      data: {
        counts: {
          students: totalStudents,
          parents: totalParents,
          classes: totalClasses
        },
        recentStudents: recentStudents.map(student => ({
          name: student.studentName,
          id: student.registrationNo,
          admissionDate: student.dateOfAdmission?.toISOString().split('T')[0] || ''
        })),
        classDistribution
      }
    });
  } catch (error) {
    console.error('❌ Get report stats error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch report statistics'
    });
  }
};