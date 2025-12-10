import mongoose from 'mongoose';
import ClassTest from '../models/ClassTest.js';
import Class from '../models/Class.js';
import Student from '../models/Student.js';
import { StatusCodes } from 'http-status-codes';

/**
 * Get all tests with filtering
 * @route GET /api/class-tests
 */
export const getClassTests = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      classId, 
      subject, 
      testType, 
      status, 
      startDate, 
      endDate,
      page = 1, 
      limit = 10 
    } = req.query;
    
    console.log(`📥 GET /api/class-tests for user: ${userId}`);
    
    // Build query
    const query = { createdBy: userId };
    
    if (classId && mongoose.Types.ObjectId.isValid(classId)) {
      query.classId = classId;
    }
    
    if (subject) {
      query.subjectName = { $regex: subject, $options: 'i' };
    }
    
    if (testType && testType !== 'all') {
      query.testType = testType;
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (startDate || endDate) {
      query.testDate = {};
      if (startDate) {
        query.testDate.$gte = new Date(startDate);
      }
      if (endDate) {
        query.testDate.$lte = new Date(endDate);
      }
    }
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [tests, total] = await Promise.all([
      ClassTest.find(query)
        .populate('classId', 'className section')
        .sort({ testDate: -1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      ClassTest.countDocuments(query)
    ]);
    
    console.log(`✅ Found ${tests.length} tests`);
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Tests retrieved successfully',
      count: tests.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: tests
    });
  } catch (error) {
    console.error('❌ Get tests error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch tests'
    });
  }
};

/**
 * Get single test by ID
 * @route GET /api/class-tests/:id
 */
export const getClassTestById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    console.log(`📥 GET /api/class-tests/${id}`);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid test ID'
      });
    }
    
    const test = await ClassTest.findOne({ _id: id, createdBy: userId })
      .populate('classId', 'className section teacher')
      .populate('studentMarks.studentId', 'studentName rollNo');
    
    if (!test) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Test not found'
      });
    }
    
    console.log('✅ Test found:', test.testName);
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Test retrieved successfully',
      data: test
    });
  } catch (error) {
    console.error('❌ Get test error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch test'
    });
  }
};

/**
 * Create new test with marks
 * @route POST /api/class-tests
 */
export const createClassTest = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('📥 POST /api/class-tests');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    const {
      testName,
      testType,
      testDate,
      totalMarks,
      classId,
      subjectName,
      subjectId,
      studentMarks,
      isPublished = false
    } = req.body;
    
    // Validation
    if (!testName || !testDate || !totalMarks || !classId || !subjectName) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Test name, date, total marks, class, and subject are required'
      });
    }
    
    if (!studentMarks || !Array.isArray(studentMarks) || studentMarks.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Student marks are required'
      });
    }
    
    // Verify class exists
    const classData = await Class.findOne({ _id: classId, createdBy: userId });
    if (!classData) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Class not found'
      });
    }
    
    // Check for duplicate test (same class, subject, and date)
    const existingTest = await ClassTest.findOne({
      classId,
      subjectName,
      testDate: new Date(testDate),
      createdBy: userId
    });
    
    if (existingTest) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: 'Test for this class, subject, and date already exists'
      });
    }
    
    // Validate student marks
    const validatedMarks = [];
    for (const mark of studentMarks) {
      if (mark.obtainedMarks > totalMarks) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: `Obtained marks (${mark.obtainedMarks}) cannot exceed total marks (${totalMarks})`
        });
      }
      
      // Get student details if only studentId is provided
      if (mark.studentId && !mark.studentName) {
        const student = await Student.findById(mark.studentId);
        if (student) {
          mark.studentName = student.studentName;
          mark.rollNo = student.rollNumber || '';
        }
      }
      
      validatedMarks.push({
        studentId: mark.studentId,
        obtainedMarks: parseFloat(mark.obtainedMarks),
        studentName: mark.studentName,
        rollNo: mark.rollNo
      });
    }
    
    // Create test
    const testData = {
      testName: testName.trim(),
      testType: testType || 'unit',
      testDate: new Date(testDate),
      totalMarks: parseFloat(totalMarks),
      classId,
      className: `${classData.className} - ${classData.section}`,
      section: classData.section,
      subjectId: subjectId || null,
      subjectName: subjectName.trim(),
      studentMarks: validatedMarks,
      isPublished,
      createdBy: userId
    };
    
    const newTest = await ClassTest.create(testData);
    
    console.log('✅ Test created:', newTest._id);
    
    // Populate the response
    const populatedTest = await ClassTest.findById(newTest._id)
      .populate('classId', 'className section')
      .populate('studentMarks.studentId', 'studentName rollNo');
    
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Test created successfully',
      data: populatedTest
    });
  } catch (error) {
    console.error('❌ Create test error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: errors[0] || 'Validation failed',
        errors
      });
    }
    
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to create test'
    });
  }
};

/**
 * Update test
 * @route PUT /api/class-tests/:id
 */
export const updateClassTest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    console.log(`📥 PUT /api/class-tests/${id}`);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid test ID'
      });
    }
    
    const test = await ClassTest.findOne({ _id: id, createdBy: userId });
    
    if (!test) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Test not found'
      });
    }
    
    const {
      testName,
      testType,
      testDate,
      totalMarks,
      subjectName,
      subjectId,
      studentMarks,
      isPublished
    } = req.body;
    
    // Update basic fields
    if (testName) test.testName = testName.trim();
    if (testType) test.testType = testType;
    if (testDate) test.testDate = new Date(testDate);
    if (totalMarks !== undefined) test.totalMarks = parseFloat(totalMarks);
    if (subjectName) test.subjectName = subjectName.trim();
    if (subjectId !== undefined) test.subjectId = subjectId;
    if (isPublished !== undefined) test.isPublished = isPublished;
    
    // Update student marks if provided
    if (studentMarks && Array.isArray(studentMarks)) {
      // Validate marks
      const validatedMarks = [];
      for (const mark of studentMarks) {
        if (mark.obtainedMarks > test.totalMarks) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: `Obtained marks (${mark.obtainedMarks}) cannot exceed total marks (${test.totalMarks})`
          });
        }
        
        // Get student details if only studentId is provided
        if (mark.studentId && !mark.studentName) {
          const student = await Student.findById(mark.studentId);
          if (student) {
            mark.studentName = student.studentName;
            mark.rollNo = student.rollNumber || '';
          }
        }
        
        validatedMarks.push({
          studentId: mark.studentId,
          obtainedMarks: parseFloat(mark.obtainedMarks),
          studentName: mark.studentName,
          rollNo: mark.rollNo
        });
      }
      
      test.studentMarks = validatedMarks;
    }
    
    await test.save();
    
    console.log('✅ Test updated:', test._id);
    
    // Populate the response
    const populatedTest = await ClassTest.findById(test._id)
      .populate('classId', 'className section')
      .populate('studentMarks.studentId', 'studentName rollNo');
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Test updated successfully',
      data: populatedTest
    });
  } catch (error) {
    console.error('❌ Update test error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: errors[0] || 'Validation failed',
        errors
      });
    }
    
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to update test'
    });
  }
};

/**
 * Delete test
 * @route DELETE /api/class-tests/:id
 */
export const deleteClassTest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    console.log(`📥 DELETE /api/class-tests/${id}`);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid test ID'
      });
    }
    
    const test = await ClassTest.findOneAndDelete({ _id: id, createdBy: userId });
    
    if (!test) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Test not found'
      });
    }
    
    console.log('✅ Test deleted:', id);
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Test deleted successfully',
      data: { id }
    });
  } catch (error) {
    console.error('❌ Delete test error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete test'
    });
  }
};

/**
 * Publish test
 * @route PATCH /api/class-tests/:id/publish
 */
export const publishTest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    console.log(`📥 PATCH /api/class-tests/${id}/publish`);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid test ID'
      });
    }
    
    const test = await ClassTest.findOneAndUpdate(
      { _id: id, createdBy: userId },
      { 
        isPublished: true,
        status: 'published',
        publishedAt: new Date()
      },
      { new: true }
    ).populate('classId', 'className section');
    
    if (!test) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Test not found'
      });
    }
    
    console.log('✅ Test published:', test._id);
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Test published successfully',
      data: test
    });
  } catch (error) {
    console.error('❌ Publish test error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to publish test'
    });
  }
};

/**
 * Get test statistics
 * @route GET /api/class-tests/stats/summary
 */
export const getTestStats = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(`📥 GET /api/class-tests/stats/summary for user: ${userId}`);
    
    const stats = await ClassTest.getStatsByAdmin(userId);
    
    // Get test type distribution
    const typeDistribution = await ClassTest.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$testType',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get subject distribution
    const subjectDistribution = await ClassTest.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$subjectName',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    // Get recent tests (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentTests = await ClassTest.countDocuments({
      createdBy: userId,
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    console.log('✅ Test stats retrieved');
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Test statistics retrieved successfully',
      data: {
        ...stats,
        typeDistribution,
        subjectDistribution,
        recentTests
      }
    });
  } catch (error) {
    console.error('❌ Get test stats error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch test statistics'
    });
  }
};

/**
 * Get dropdown data for test creation
 * @route GET /api/class-tests/dropdown-data
 */
export const getDropdownData = async (req, res) => {
  try {
    const userId = req.user.id;
    const { classId } = req.query;
    
    console.log(`📥 GET /api/class-tests/dropdown-data for user: ${userId}, classId: ${classId}`);
    
    // Get classes
    const classes = await Class.find({ createdBy: userId })
      .select('className section')
      .sort({ className: 1, section: 1 });
    
    let subjects = [];
    let students = [];
    
    // Get subjects based on class if classId is provided
    if (classId && mongoose.Types.ObjectId.isValid(classId)) {
      // Get subjects assigned to this class
      const SubjectAssignment = mongoose.model('SubjectAssignment');
      const assignment = await SubjectAssignment.findOne({ 
        classId, 
        createdBy: userId 
      });
      
      if (assignment && assignment.subjects) {
        subjects = assignment.subjects.map(sub => ({
          _id: sub._id,
          name: sub.subjectName,
          totalMarks: sub.totalMarks
        }));
      }
      
      // Get students in this class
      students = await Student.find({ 
        selectClass: classId.toString(),
        status: 'active'
      })
      .select('studentName registrationNo rollNumber')
      .sort({ studentName: 1 });
    }
    
    console.log(`✅ Dropdown data retrieved: ${classes.length} classes, ${subjects.length} subjects, ${students.length} students`);
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Dropdown data retrieved successfully',
      data: {
        classes,
        subjects,
        students
      }
    });
  } catch (error) {
    console.error('❌ Get dropdown data error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch dropdown data'
    });
  }
};

/**
 * Get class-wise test results
 * @route GET /api/class-tests/results/class-wise
 */
export const getClassWiseResults = async (req, res) => {
  try {
    const userId = req.user.id;
    const { classId } = req.query;
    
    console.log(`📥 GET /api/class-tests/results/class-wise for user: ${userId}, classId: ${classId}`);
    
    if (!classId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Class ID is required'
      });
    }
    
    // Get all published tests for this class
    const tests = await ClassTest.find({
      classId,
      createdBy: userId,
      isPublished: true
    })
    .select('testName testDate subjectName totalMarks averageMarks passCount failCount studentMarks')
    .sort({ testDate: -1 });
    
    // Calculate overall statistics
    let totalTests = tests.length;
    let overallAverage = 0;
    let totalPassCount = 0;
    let totalStudents = 0;
    
    if (tests.length > 0) {
      overallAverage = tests.reduce((sum, test) => sum + test.averageMarks, 0) / tests.length;
      totalPassCount = tests.reduce((sum, test) => sum + test.passCount, 0);
      totalStudents = tests[0].studentMarks.length; // Assuming same students in all tests
    }
    
    // Get subject-wise performance
    const subjectPerformance = await ClassTest.getSubjectPerformance(classId, userId);
    
    console.log('✅ Class-wise results retrieved');
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Class-wise results retrieved successfully',
      data: {
        tests,
        summary: {
          totalTests,
          overallAverage: Math.round(overallAverage * 100) / 100,
          totalPassCount,
          totalStudents,
          passPercentage: totalStudents > 0 ? Math.round((totalPassCount / (totalTests * totalStudents)) * 100) : 0
        },
        subjectPerformance
      }
    });
  } catch (error) {
    console.error('❌ Get class-wise results error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch class-wise results'
    });
  }
};

/**
 * Get class and subject results
 * @route GET /api/class-tests/results/class-subject
 */
export const getClassSubjectResults = async (req, res) => {
  try {
    const userId = req.user.id;
    const { classId, subjectName } = req.query;
    
    console.log(`📥 GET /api/class-tests/results/class-subject for user: ${userId}`);
    
    if (!classId || !subjectName) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Class ID and subject name are required'
      });
    }
    
    // Get tests for this class and subject
    const tests = await ClassTest.find({
      classId,
      subjectName,
      createdBy: userId,
      isPublished: true
    })
    .select('testName testDate testType totalMarks averageMarks highestMarks lowestMarks studentMarks')
    .sort({ testDate: 1 });
    
    if (tests.length === 0) {
      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'No tests found for this class and subject',
        data: {
          tests: [],
          studentPerformance: [],
          summary: {
            totalTests: 0,
            averageScore: 0,
            highestScore: 0,
            lowestScore: 0,
            passRate: 0
          }
        }
      });
    }
    
    // Calculate student performance across all tests
    const studentPerformanceMap = new Map();
    
    tests.forEach(test => {
      test.studentMarks.forEach(mark => {
        if (!studentPerformanceMap.has(mark.studentId.toString())) {
          studentPerformanceMap.set(mark.studentId.toString(), {
            studentId: mark.studentId,
            studentName: mark.studentName,
            rollNo: mark.rollNo,
            testsTaken: 0,
            totalMarks: 0,
            testScores: []
          });
        }
        
        const student = studentPerformanceMap.get(mark.studentId.toString());
        student.testsTaken++;
        student.totalMarks += mark.obtainedMarks;
        student.testScores.push({
          testName: test.testName,
          testDate: test.testDate,
          obtainedMarks: mark.obtainedMarks,
          totalMarks: test.totalMarks,
          percentage: (mark.obtainedMarks / test.totalMarks) * 100
        });
      });
    });
    
    const studentPerformance = Array.from(studentPerformanceMap.values()).map(student => ({
      ...student,
      averageScore: student.totalMarks / student.testsTaken,
      overallPercentage: (student.totalMarks / (student.testsTaken * tests[0].totalMarks)) * 100
    }));
    
    // Sort by average score
    studentPerformance.sort((a, b) => b.averageScore - a.averageScore);
    
    // Add rank
    studentPerformance.forEach((student, index) => {
      student.rank = index + 1;
      // Assign grade based on percentage
      const percentage = student.overallPercentage;
      if (percentage >= 90) student.grade = 'A+';
      else if (percentage >= 80) student.grade = 'A';
      else if (percentage >= 70) student.grade = 'B+';
      else if (percentage >= 60) student.grade = 'B';
      else if (percentage >= 50) student.grade = 'C';
      else if (percentage >= 33) student.grade = 'D';
      else student.grade = 'F';
    });
    
    // Calculate summary
    const summary = {
      totalTests: tests.length,
      averageScore: tests.reduce((sum, test) => sum + test.averageMarks, 0) / tests.length,
      highestScore: Math.max(...tests.map(t => t.highestMarks)),
      lowestScore: Math.min(...tests.map(t => t.lowestMarks)),
      passRate: (tests.reduce((sum, test) => sum + test.passCount, 0) / 
                (tests.length * tests[0].studentMarks.length)) * 100
    };
    
    console.log('✅ Class-subject results retrieved');
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Class and subject results retrieved successfully',
      data: {
        tests,
        studentPerformance,
        summary
      }
    });
  } catch (error) {
    console.error('❌ Get class-subject results error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch class and subject results'
    });
  }
};

/**
 * Get student and subject results
 * @route GET /api/class-tests/results/student-subject
 */
export const getStudentSubjectResults = async (req, res) => {
  try {
    const userId = req.user.id;
    const { studentId } = req.query;
    
    console.log(`📥 GET /api/class-tests/results/student-subject for user: ${userId}, studentId: ${studentId}`);
    
    if (!studentId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Student ID is required'
      });
    }
    
    // Get student details
    const student = await Student.findById(studentId)
      .select('studentName registrationNo rollNumber selectClass section');
    
    if (!student) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    // Get all tests for this student
    const tests = await ClassTest.find({
      'studentMarks.studentId': studentId,
      createdBy: userId,
      isPublished: true
    })
    .select('testName testDate subjectName testType totalMarks studentMarks')
    .sort({ testDate: -1 });
    
    // Extract student's marks from each test
    const studentTests = tests.map(test => {
      const studentMark = test.studentMarks.find(mark => 
        mark.studentId.toString() === studentId
      );
      
      return {
        testId: test._id,
        testName: test.testName,
        testDate: test.testDate,
        subjectName: test.subjectName,
        testType: test.testType,
        totalMarks: test.totalMarks,
        obtainedMarks: studentMark ? studentMark.obtainedMarks : 0,
        percentage: studentMark ? (studentMark.obtainedMarks / test.totalMarks) * 100 : 0
      };
    });
    
    // Group by subject
    const subjectGroups = {};
    studentTests.forEach(test => {
      if (!subjectGroups[test.subjectName]) {
        subjectGroups[test.subjectName] = [];
      }
      subjectGroups[test.subjectName].push(test);
    });
    
    // Calculate subject-wise averages
    const subjectPerformance = Object.keys(subjectGroups).map(subjectName => {
      const subjectTests = subjectGroups[subjectName];
      const totalMarks = subjectTests.reduce((sum, test) => sum + test.obtainedMarks, 0);
      const averageScore = totalMarks / subjectTests.length;
      
      return {
        subjectName,
        testsTaken: subjectTests.length,
        averageScore,
        averagePercentage: (averageScore / subjectTests[0].totalMarks) * 100,
        highestScore: Math.max(...subjectTests.map(t => t.obtainedMarks)),
        lowestScore: Math.min(...subjectTests.map(t => t.obtainedMarks))
      };
    });
    
    // Calculate overall statistics
    const overallStats = {
      totalTests: studentTests.length,
      overallAverage: studentTests.reduce((sum, test) => sum + test.percentage, 0) / studentTests.length,
      subjectsTaken: Object.keys(subjectGroups).length,
      testHistory: studentTests
    };
    
    console.log('✅ Student-subject results retrieved');
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Student and subject results retrieved successfully',
      data: {
        student: {
          name: student.studentName,
          registrationNo: student.registrationNo,
          rollNo: student.rollNumber,
          class: student.selectClass,
          section: student.section
        },
        subjectPerformance,
        overallStats
      }
    });
  } catch (error) {
    console.error('❌ Get student-subject results error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch student and subject results'
    });
  }
};

/**
 * Get date range results
 * @route GET /api/class-tests/results/date-range
 */
export const getDateRangeResults = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate, classId, subjectName } = req.query;
    
    console.log(`📥 GET /api/class-tests/results/date-range for user: ${userId}`);
    
    if (!startDate || !endDate) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }
    
    const query = {
      createdBy: userId,
      isPublished: true,
      testDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };
    
    if (classId && classId !== 'all') {
      query.classId = classId;
    }
    
    if (subjectName && subjectName !== 'all') {
      query.subjectName = subjectName;
    }
    
    // Get tests in date range
    const tests = await ClassTest.find(query)
      .select('testName testDate className subjectName totalMarks averageMarks passCount studentMarks')
      .sort({ testDate: 1 })
      .populate('classId', 'className section');
    
    // Calculate statistics
    const totalTests = tests.length;
    let totalStudents = 0;
    let totalAverage = 0;
    let totalPassCount = 0;
    
    if (tests.length > 0) {
      totalStudents = tests[0].studentMarks.length;
      totalAverage = tests.reduce((sum, test) => sum + test.averageMarks, 0) / tests.length;
      totalPassCount = tests.reduce((sum, test) => sum + test.passCount, 0);
    }
    
    // Group by week for trend analysis
    const weeklyTrend = {};
    tests.forEach(test => {
      const weekStart = new Date(test.testDate);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of week (Sunday)
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weeklyTrend[weekKey]) {
        weeklyTrend[weekKey] = {
          weekStart,
          tests: 0,
          averageScore: 0,
          totalAverage: 0
        };
      }
      
      weeklyTrend[weekKey].tests++;
      weeklyTrend[weekKey].totalAverage += test.averageMarks;
      weeklyTrend[weekKey].averageScore = weeklyTrend[weekKey].totalAverage / weeklyTrend[weekKey].tests;
    });
    
    const weeklyTrendArray = Object.values(weeklyTrend).map(week => ({
      week: week.weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      averageScore: Math.round(week.averageScore * 100) / 100
    }));
    
    console.log('✅ Date range results retrieved');
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Date range results retrieved successfully',
      data: {
        tests,
        summary: {
          totalTests,
          totalStudents,
          overallAverage: Math.round(totalAverage * 100) / 100,
          totalPassCount,
          passRate: totalStudents > 0 ? Math.round((totalPassCount / (totalTests * totalStudents)) * 100) : 0
        },
        weeklyTrend: weeklyTrendArray
      }
    });
  } catch (error) {
    console.error('❌ Get date range results error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch date range results'
    });
  }
};

/**
 * Get performance report
 * @route GET /api/class-tests/results/performance-report
 */
export const getPerformanceReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const { classId } = req.query;
    
    console.log(`📥 GET /api/class-tests/results/performance-report for user: ${userId}`);
    
    if (!classId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Class ID is required'
      });
    }
    
    // Get class details
    const classData = await Class.findById(classId)
      .select('className section studentCount');
    
    if (!classData) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Class not found'
      });
    }
    
    // Get all published tests for this class
    const tests = await ClassTest.find({
      classId,
      createdBy: userId,
      isPublished: true
    })
    .select('testName testDate subjectName studentMarks totalMarks');
    
    if (tests.length === 0) {
      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'No tests found for this class',
        data: {
          class: classData,
          summary: {
            totalTests: 0,
            averageScore: 0,
            passRate: 0,
            attendanceRate: 0,
            completionRate: 0
          },
          subjectPerformance: [],
          topPerformers: [],
          gradeDistribution: {}
        }
      });
    }
    
    // Calculate student performance across all tests
    const studentPerformanceMap = new Map();
    const subjectPerformanceMap = new Map();
    
    tests.forEach(test => {
      // Update subject performance
      if (!subjectPerformanceMap.has(test.subjectName)) {
        subjectPerformanceMap.set(test.subjectName, {
          subjectName: test.subjectName,
          tests: 0,
          totalAverage: 0
        });
      }
      const subject = subjectPerformanceMap.get(test.subjectName);
      subject.tests++;
      subject.totalAverage += test.averageMarks || 0;
      
      // Update student performance
      test.studentMarks.forEach(mark => {
        const studentId = mark.studentId.toString();
        if (!studentPerformanceMap.has(studentId)) {
          studentPerformanceMap.set(studentId, {
            studentId: mark.studentId,
            studentName: mark.studentName,
            rollNo: mark.rollNo,
            testsTaken: 0,
            totalObtained: 0,
            totalPossible: 0
          });
        }
        
        const student = studentPerformanceMap.get(studentId);
        student.testsTaken++;
        student.totalObtained += mark.obtainedMarks;
        student.totalPossible += test.totalMarks;
      });
    });
    
    // Calculate subject averages
    const subjectPerformance = Array.from(subjectPerformanceMap.values()).map(subject => ({
      ...subject,
      averageScore: subject.totalAverage / subject.tests
    }));
    
    // Calculate student averages and grades
    const studentPerformance = Array.from(studentPerformanceMap.values()).map(student => {
      const averagePercentage = (student.totalObtained / student.totalPossible) * 100;
      
      // Assign grade based on percentage
      let grade = 'F';
      if (averagePercentage >= 90) grade = 'A+';
      else if (averagePercentage >= 80) grade = 'A';
      else if (averagePercentage >= 70) grade = 'B+';
      else if (averagePercentage >= 60) grade = 'B';
      else if (averagePercentage >= 50) grade = 'C';
      else if (averagePercentage >= 33) grade = 'D';
      
      return {
        ...student,
        averagePercentage: Math.round(averagePercentage * 100) / 100,
        grade,
        status: averagePercentage >= 33 ? 'Pass' : 'Fail'
      };
    });
    
    // Sort by average percentage
    studentPerformance.sort((a, b) => b.averagePercentage - a.averagePercentage);
    
    // Add rank
    studentPerformance.forEach((student, index) => {
      student.rank = index + 1;
    });
    
    // Get top performers (top 10)
    const topPerformers = studentPerformance.slice(0, 10);
    
    // Calculate grade distribution
    const gradeDistribution = {
      'A+': 0,
      'A': 0,
      'B+': 0,
      'B': 0,
      'C': 0,
      'D': 0,
      'F': 0
    };
    
    studentPerformance.forEach(student => {
      gradeDistribution[student.grade]++;
    });
    
    // Calculate overall statistics
    const totalStudents = studentPerformance.length;
    const averageScore = studentPerformance.reduce((sum, student) => sum + student.averagePercentage, 0) / totalStudents;
    const passRate = (studentPerformance.filter(s => s.status === 'Pass').length / totalStudents) * 100;
    
    console.log('✅ Performance report retrieved');
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Performance report retrieved successfully',
      data: {
        class: classData,
        summary: {
          totalTests: tests.length,
          averageScore: Math.round(averageScore * 100) / 100,
          passRate: Math.round(passRate * 100) / 100,
          attendanceRate: 75, // This would need actual attendance data
          completionRate: 90 // This would need actual completion data
        },
        subjectPerformance,
        topPerformers,
        gradeDistribution,
        totalStudents
      }
    });
  } catch (error) {
    console.error('❌ Get performance report error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch performance report'
    });
  }
};