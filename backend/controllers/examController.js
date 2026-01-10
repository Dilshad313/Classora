import mongoose from 'mongoose';
import Exam from '../models/Exam.js';
import ExamMark from '../models/ExamMark.js';
import ResultCard from '../models/ResultCard.js';
import Class from '../models/Class.js';
import Student from '../models/Student.js';
import Subject from '../models/Subject.js';
import SubjectAssignment from '../models/SubjectAssignment.js';
import InstituteProfile from '../models/InstituteProfile.js';
import { StatusCodes } from 'http-status-codes';

/**
 * Get all exams
 * @route GET /api/exams
 */
export const getAllExams = async (req, res) => {
  try {
    const userId = req.user.id;
    const { search, status, isPublished, academicYear, page = 1, limit = 10 } = req.query;
    
    console.log(`📥 GET /api/exams for user: ${userId}`);
    
    // Build query
    const query = { createdBy: userId };
    
    if (search) {
      query.$or = [
        { examinationName: { $regex: search, $options: 'i' } },
        { examName: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (isPublished && isPublished !== 'all') {
      query.isPublished = isPublished === 'true';
    }
    
    if (academicYear && academicYear !== 'all') {
      query.academicYear = academicYear;
    }
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [exams, total] = await Promise.all([
      Exam.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Exam.countDocuments(query)
    ]);
    
    // Format dates for frontend
    const formattedExams = exams.map(exam => ({
      ...exam.toObject(),
      className: exam.className,
      formattedStartDate: exam.formattedStartDate,
      formattedEndDate: exam.formattedEndDate
    }));
    
    console.log(`✅ Found ${exams.length} exams`);
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Exams retrieved successfully',
      count: exams.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: formattedExams
    });
  } catch (error) {
    console.error('❌ Get exams error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch exams'
    });
  }
};

/**
 * Get single exam by ID
 * @route GET /api/exams/:id
 */
export const getExamById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    console.log(`📥 GET /api/exams/${id}`);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid exam ID'
      });
    }
    
    const exam = await Exam.findOne({ _id: id, createdBy: userId });
    
    if (!exam) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Exam not found'
      });
    }
    
    console.log('✅ Exam found:', exam.examName);
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Exam retrieved successfully',
      data: {
        ...exam.toObject(),
        className: exam.className,
        formattedStartDate: exam.formattedStartDate,
        formattedEndDate: exam.formattedEndDate
      }
    });
  } catch (error) {
    console.error('❌ Get exam error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch exam'
    });
  }
};

/**
 * Create new exam
 * @route POST /api/exams
 */
export const createExam = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('📥 POST /api/exams');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    const { examinationName, examName, className, startDate, endDate, isPublished = false } = req.body;
    
    // Validation
    if (!examinationName || !examName || !className || !startDate || !endDate) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'All fields are required'
      });
    }
    
    // Generate academic year
    const currentYear = new Date().getFullYear();
    const academicYear = `${currentYear}-${currentYear + 1}`;
    
    // Check for duplicate exam name for this academic year
    const existingExam = await Exam.findOne({
      createdBy: userId,
      examName: examName.trim(),
      academicYear,
      status: { $ne: 'inactive' }
    });
    
    if (existingExam) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: `Exam "${examName}" already exists for this academic year`
      });
    }
    
    // Create exam object
    const examData = {
      examinationName: examinationName.trim(),
      examName: examName.trim(),
      className: className.trim(),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      isPublished: isPublished === true || isPublished === 'true',
      academicYear,
      createdBy: userId
    };
    
    const newExam = await Exam.create(examData);
    
    console.log('✅ Exam created:', newExam._id);
    
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Exam created successfully',
      data: {
        ...newExam.toObject(),
        formattedStartDate: newExam.formattedStartDate,
        formattedEndDate: newExam.formattedEndDate
      }
    });
  } catch (error) {
    console.error('❌ Create exam error:', error);
    
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
      message: 'Failed to create exam'
    });
  }
};

/**
 * Update exam
 * @route PUT /api/exams/:id
 */
export const updateExam = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    console.log(`📥 PUT /api/exams/${id}`);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid exam ID'
      });
    }
    
    const exam = await Exam.findOne({ _id: id, createdBy: userId });
    
    if (!exam) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Exam not found'
      });
    }
    
    const { examinationName, examName, className, startDate, endDate, status } = req.body;
    
    // Check for duplicate if exam name changed
    if (examName && examName !== exam.examName) {
      const duplicate = await Exam.findOne({
        createdBy: userId,
        examName: examName.trim(),
        academicYear: exam.academicYear,
        _id: { $ne: id },
        status: { $ne: 'inactive' }
      });
      
      if (duplicate) {
        return res.status(StatusCodes.CONFLICT).json({
          success: false,
          message: `Exam "${examName}" already exists for this academic year`
        });
      }
    }
    
    // Update fields
    if (examinationName) exam.examinationName = examinationName.trim();
    if (examName) exam.examName = examName.trim();
    if (className) exam.className = className.trim();
    if (startDate) exam.startDate = new Date(startDate);
    if (endDate) exam.endDate = new Date(endDate);
    if (status) exam.status = status;
    
    await exam.save();
    
    console.log('✅ Exam updated:', exam._id);
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Exam updated successfully',
      data: {
        ...exam.toObject(),
        className: exam.className,
        formattedStartDate: exam.formattedStartDate,
        formattedEndDate: exam.formattedEndDate
      }
    });
  } catch (error) {
    console.error('❌ Update exam error:', error);
    
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
      message: 'Failed to update exam'
    });
  }
};

/**
 * Delete exam
 * @route DELETE /api/exams/:id
 */
export const deleteExam = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    console.log(`📥 DELETE /api/exams/${id}`);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid exam ID'
      });
    }
    
    const exam = await Exam.findOne({ _id: id, createdBy: userId });
    
    if (!exam) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Exam not found'
      });
    }
    
    // Check if exam has marks associated
    const marksCount = await ExamMark.countDocuments({ exam: id, createdBy: userId });
    
    if (marksCount > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Cannot delete exam that has marks assigned. Archive it instead.'
      });
    }
    
    await Exam.findByIdAndDelete(id);
    
    console.log('✅ Exam deleted:', id);
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Exam deleted successfully',
      data: { id }
    });
  } catch (error) {
    console.error('❌ Delete exam error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete exam'
    });
  }
};

/**
 * Toggle exam publish status
 * @route PATCH /api/exams/:id/toggle-publish
 */
export const togglePublishStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    console.log(`📥 PATCH /api/exams/${id}/toggle-publish`);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid exam ID'
      });
    }
    
    const exam = await Exam.findOne({ _id: id, createdBy: userId });
    
    if (!exam) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Exam not found'
      });
    }
    
    exam.isPublished = !exam.isPublished;
    await exam.save();
    
    console.log('✅ Exam publish status toggled:', exam.isPublished);
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: `Exam ${exam.isPublished ? 'published' : 'unpublished'} successfully`,
      data: exam
    });
  } catch (error) {
    console.error('❌ Toggle publish status error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to toggle publish status'
    });
  }
};

/**
 * Bulk delete exams
 * @route POST /api/exams/bulk-delete
 */
export const bulkDeleteExams = async (req, res) => {
  try {
    const userId = req.user.id;
    const { ids } = req.body;
    
    console.log(`📥 POST /api/exams/bulk-delete`);
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Please provide exam IDs to delete'
      });
    }
    
    // Validate all IDs
    const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));
    
    if (validIds.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'No valid exam IDs provided'
      });
    }
    
    // Check if any exam has marks
    const examsWithMarks = await ExamMark.find({
      exam: { $in: validIds },
      createdBy: userId
    }).distinct('exam');
    
    if (examsWithMarks.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Some exams have marks assigned and cannot be deleted'
      });
    }
    
    // Delete exams
    const result = await Exam.deleteMany({
      _id: { $in: validIds },
      createdBy: userId
    });
    
    console.log(`✅ Deleted ${result.deletedCount} exams`);
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} exams`,
      data: { deletedCount: result.deletedCount }
    });
  } catch (error) {
    console.error('❌ Bulk delete exams error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete exams'
    });
  }
};

/**
 * Get exam statistics
 * @route GET /api/exams/stats/summary
 */
export const getExamStats = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(`📥 GET /api/exams/stats/summary for user: ${userId}`);
    
    const totalExams = await Exam.countDocuments({ createdBy: userId });
    const publishedExams = await Exam.countDocuments({ 
      createdBy: userId, 
      isPublished: true 
    });
    const activeExams = await Exam.countDocuments({ 
      createdBy: userId, 
      status: 'active' 
    });
    
    // Get exams by month for current year
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);
    
    const monthlyStats = await Exam.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: startOfYear, $lte: endOfYear }
        }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);
    
    // Get upcoming exams (next 30 days)
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setDate(today.getDate() + 30);
    
    const upcomingExams = await Exam.countDocuments({
      createdBy: userId,
      startDate: { $gte: today, $lte: nextMonth },
      status: 'active'
    });
    
    console.log('✅ Exam stats retrieved');
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Exam statistics retrieved successfully',
      data: {
        total: totalExams,
        published: publishedExams,
        active: activeExams,
        upcoming: upcomingExams,
        monthlyStats
      }
    });
  } catch (error) {
    console.error('❌ Get exam stats error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch exam statistics'
    });
  }
};
/**
 * Get dropdown data (exams for dropdown)
 * @route GET /api/exams/dropdown
 */
export const getExamDropdown = async (req, res) => {
  try {
    const userId = req.user.id;
    const { activeOnly = 'true', isPublished } = req.query;
    
    console.log(`📥 GET /api/exams/dropdown`);
    
    const query = { createdBy: userId };
    
    if (activeOnly === 'true') {
      query.status = 'active';
    }

    // Filter by publish status if specified
    if (isPublished !== undefined && isPublished !== 'all') {
      query.isPublished = isPublished === 'true';
    }
    
    const exams = await Exam.find(query)
      .select('examName examinationName startDate endDate isPublished')
      .sort({ createdAt: -1 });
    
    const formattedExams = exams.map(exam => ({
      _id: exam._id,
      name: exam.examName,
      examinationName: exam.examinationName,
      startDate: exam.formattedStartDate,
      endDate: exam.formattedEndDate,
      isPublished: exam.isPublished,
      label: `${exam.examName} (${exam.formattedStartDate} - ${exam.formattedEndDate})${exam.isPublished ? ' ✓' : ''}`
    }));
    
    console.log(`✅ Found ${formattedExams.length} exams for dropdown`);
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Exam dropdown data retrieved successfully',
      data: formattedExams
    });
  } catch (error) {
    console.error('❌ Get exam dropdown error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch exam dropdown data'
    });
  }
};
/**
 * Get exam marks for specific exam and class
 * @route GET /api/exams/:examId/marks/class/:classId
 */
export const getExamMarksByClass = async (req, res) => {
  try {
    const userId = req.user.id;
    const { examId, classId } = req.params;
    
    console.log(`📥 GET /api/exams/${examId}/marks/class/${classId}`);
    
    if (!mongoose.Types.ObjectId.isValid(examId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid exam ID'
      });
    }
    
    // Verify exam exists
    const exam = await Exam.findOne({ _id: examId, createdBy: userId });
    if (!exam) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Exam not found'
      });
    }
    
    // Find class by className (classId parameter contains the className)
    const classData = await Class.findOne({ className: classId, createdBy: userId });
    if (!classData) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Class not found'
      });
    }
    
    // Get all students in the class (matching selectClass with className)
    const students = await Student.find({ 
      selectClass: classData.className,
      status: 'active'
    }).select('studentName registrationNo rollNumber');
    
    // Get subjects assigned to this class
    const assignment = await SubjectAssignment.findOne({ 
      classId: classData._id, 
      createdBy: userId 
    });
    
    if (!assignment || !assignment.subjects || assignment.subjects.length === 0) {
      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'No subjects assigned to this class',
        data: {
          exam: {
            _id: exam._id,
            name: exam.examName,
            examinationName: exam.examinationName
          },
          class: {
            _id: classData._id,
            name: classData.className
          },
          subjects: [],
          students: []
        }
      });
    }
    
    // Get existing marks for this exam and class
    const existingMarks = await ExamMark.find({
      exam: examId,
      class: classData._id,
      createdBy: userId
    });
    
    // Create marks matrix
    const marksMatrix = students.map(student => {
      const studentMarks = {};
      
      assignment.subjects.forEach(subject => {
        const existingMark = existingMarks.find(
          mark => mark.student.toString() === student._id.toString() && 
                 mark.subject.toString() === subject._id.toString()
        );
        
        studentMarks[subject._id] = existingMark ? {
          marksObtained: existingMark.marksObtained,
          maxMarks: existingMark.maxMarks,
          percentage: existingMark.percentage,
          grade: existingMark.grade
        } : null;
      });
      
      // Calculate totals
      let totalObtained = 0;
      let totalMaxMarks = 0;
      const subjects = [];
      
      Object.keys(studentMarks).forEach(subjectId => {
        const mark = studentMarks[subjectId];
        if (mark) {
          totalObtained += mark.marksObtained;
          totalMaxMarks += mark.maxMarks;
          
          subjects.push({
            subject: subjectId,
            subjectName: assignment.subjects.find(s => s._id.toString() === subjectId).subjectName,
            marksObtained: mark.marksObtained,
            maxMarks: mark.maxMarks,
            percentage: mark.percentage,
            grade: mark.grade
          });
        } else {
          // Handle case where subject is null or missing
          console.warn('⚠️ Mark has missing subject data:', mark);
          // Still add to totals even if subject is missing
          totalObtained += 0;
          totalMaxMarks += (assignment.subjects.find(s => s._id.toString() === subjectId).totalMarks || 100);
          
          subjects.push({
            subject: subjectId,
            subjectName: assignment.subjects.find(s => s._id.toString() === subjectId).subjectName,
            marksObtained: 0,
            maxMarks: assignment.subjects.find(s => s._id.toString() === subjectId).totalMarks || 100,
            percentage: 0,
            grade: 'F'
          });
        }
      });
      
      const overallPercentage = totalMaxMarks > 0 ? (totalObtained / totalMaxMarks) * 100 : 0;
      
      return {
        student: {
          _id: student._id,
          name: student.studentName,
          registrationNo: student.registrationNo,
          rollNumber: student.rollNumber
        },
        marks: studentMarks,
        total: totalObtained,
        percentage: parseFloat(percentage)
      };
    });
    
    console.log(`✅ Marks matrix prepared for ${students.length} students`);
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Marks retrieved successfully',
      data: {
        exam: {
          _id: exam._id,
          name: exam.examName,
          examinationName: exam.examinationName
        },
        class: {
          _id: classData._id,
          name: classData.className
        },
        subjects: assignment.subjects.map(sub => ({
          _id: sub._id,
          name: sub.subjectName,
          totalMarks: sub.totalMarks || 100
        })),
        students: marksMatrix
      }
    });
  } catch (error) {
    console.error('❌ Get exam marks by class error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch marks'
    });
  }
};
/**
 * Save/update marks in bulk
 * @route POST /api/exams/:examId/marks/bulk
 */
export const saveBulkMarks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { examId } = req.params;
    console.log('📥 POST /api/exams/:examId/marks/bulk');
    
    const { className, marksData } = req.body;
    
    if (!className || !marksData || !Array.isArray(marksData)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Class name and marks data are required'
      });
    }
    
    // Verify exam exists
    const exam = await Exam.findOne({ _id: examId, createdBy: userId });
    if (!exam) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Exam not found'
      });
    }
    
    // Find class by className
    const classData = await Class.findOne({ className, createdBy: userId });
    if (!classData) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Class not found'
      });
    }
    
    const operations = [];
    const results = {
      created: 0,
      updated: 0,
      errors: []
    };
    
    for (const markData of marksData) {
      try {
        const { studentId, subjectId, marksObtained, maxMarks = 100 } = markData;
        
        // Validate student exists
        const student = await Student.findById(studentId);
        if (!student) {
          results.errors.push(`Student ${studentId} not found`);
          continue;
        }
        
        // Validate subject exists in class assignment
        const assignment = await SubjectAssignment.findOne({ 
          classId: classData._id, 
          createdBy: userId 
        });
        
        if (!assignment || !assignment.subjects.some(s => s._id.toString() === subjectId)) {
          results.errors.push(`Subject ${subjectId} not assigned to this class`);
          continue;
        }
        
        // Prepare mark data
        const markRecord = {
          exam: examId,
          class: classData._id,
          student: studentId,
          subject: subjectId,
          marksObtained: parseFloat(marksObtained),
          maxMarks: parseFloat(maxMarks),
          createdBy: userId,
          lastUpdatedBy: userId
        };
        
        // Check if mark already exists
        const existingMark = await ExamMark.findOne({
          exam: examId,
          class: classData._id,
          student: studentId,
          subject: subjectId,
          createdBy: userId
        });
        
        if (existingMark) {
          // Update existing mark
          operations.push({
            updateOne: {
              filter: { _id: existingMark._id },
              update: { 
                $set: { 
                  marksObtained: parseFloat(marksObtained),
                  maxMarks: parseFloat(maxMarks),
                  lastUpdatedBy: userId
                } 
              }
            }
          });
          results.updated++;
        } else {
          // Create new mark
          operations.push({
            insertOne: {
              document: markRecord
            }
          });
          results.created++;
        }
      } catch (error) {
        results.errors.push(`Error processing mark: ${error.message}`);
      }
    }
    
    // Execute bulk operations
    if (operations.length > 0) {
      await ExamMark.bulkWrite(operations, { ordered: false });
    }
    
    console.log(`✅ Bulk marks saved: ${results.created} created, ${results.updated} updated`);
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Marks saved successfully',
      data: results
    });
  } catch (error) {
    console.error('❌ Save bulk marks error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to save marks'
    });
  }
};

/**
 * Generate result card
 * @route POST /api/exams/result-cards/generate
 */
export const generateResultCard = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('📥 POST /api/exams/result-cards/generate');
    
    const { studentId, examId } = req.body;
    
    if (!studentId || !examId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Student ID and Exam ID are required'
      });
    }
    
    if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(examId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid student or exam ID'
      });
    }
    
    // Verify student exists
    const student = await Student.findById(studentId)
      .select('studentName registrationNo selectClass section rollNumber fatherName motherName dateOfBirth address');
    
    if (!student) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    // Verify exam exists
    const exam = await Exam.findOne({ _id: examId, createdBy: userId });
    if (!exam) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Exam not found'
      });
    }
    
    // Get class for student - handle data mismatch between student.selectClass and class.className
    let classData = null;
    
    // First try exact match with both className and section
    classData = await Class.findOne({
      className: student.selectClass,
      section: student.section,
      createdBy: userId
    });
    
    // If not found, try matching by extracting grade number from className
    if (!classData) {
      const allClasses = await Class.find({ createdBy: userId });
      classData = allClasses.find(cls => {
        // Extract grade number from class name (e.g., "Grade 1" -> "1")
        const gradeMatch = cls.className.match(/\d+/);
        const gradeNumber = gradeMatch ? gradeMatch[0] : cls.className;
        return gradeNumber === student.selectClass;
      });
    }
    
    // If still not found, try just by className without section
    if (!classData) {
      classData = await Class.findOne({
        className: student.selectClass,
        createdBy: userId
      });
    }
    
    if (!classData) {
      console.log(`❌ Class lookup failed for student ${student.studentName}:`, {
        studentSelectClass: student.selectClass,
        studentSection: student.section,
        userId
      });
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Class not found for student'
      });
    }
    
    const instituteProfile = await InstituteProfile.findOne({ createdBy: userId });
    if (!instituteProfile) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Institute profile not found. Please set up your institute profile first.'
      });
    }

    // Get all marks for this student in this exam
    const marks = await ExamMark.find({
      student: studentId,
      exam: examId,
      createdBy: userId,
    }).populate('subject', 'subjectName totalMarks');

    if (marks.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'No marks found for this student in the selected exam. Please enter marks first.'
      });
    }

    // Calculate totals and prepare subjects
    let totalObtained = 0;
    let totalMaxMarks = 0;
    const subjects = marks.map((mark, idx) => {
      const subjectName = mark.subject?.subjectName || mark.subjectName || 'N/A';
      const maxMarks = mark.maxMarks ?? mark.subject?.totalMarks ?? 0;
      totalObtained += mark.marksObtained;
      totalMaxMarks += maxMarks;
      return {
        subject: mark.subject?._id || mark.subject || undefined,
        subjectName,
        marksObtained: mark.marksObtained,
        maxMarks,
        percentage: mark.percentage,
        grade: mark.grade,
      };
    });

    const overallPercentage = totalMaxMarks > 0 ? (totalObtained / totalMaxMarks) * 100 : 0;

    // Determine overall grade and remarks
    let overallGrade, overallRemarks, resultStatus;

    if (overallPercentage >= 90) {
      overallGrade = 'A+';
      overallRemarks = 'Outstanding';
    } else if (overallPercentage >= 80) {
      overallGrade = 'A';
      overallRemarks = 'Excellent';
    } else if (overallPercentage >= 70) {
      overallGrade = 'B+';
      overallRemarks = 'Very Good';
    } else if (overallPercentage >= 60) {
      overallGrade = 'B';
      overallRemarks = 'Good';
    } else if (overallPercentage >= 50) {
      overallGrade = 'C';
      overallRemarks = 'Average';
    } else if (overallPercentage >= 40) {
      overallGrade = 'D';
      overallRemarks = 'Pass';
    } else {
      overallGrade = 'F';
      overallRemarks = 'Fail';
    }

    resultStatus = overallPercentage >= 40 ? 'PASS' : 'FAIL';

    // Create or update result card
    const resultCard = await ResultCard.findOneAndUpdate(
      { student: studentId, exam: examId, createdBy: userId },
      {
        student: studentId,
        exam: examId,
        class: classData._id,
        institute: instituteProfile._id, // Add institute ID
        subjects,
        totalObtained,
        totalMaxMarks,
        overallPercentage: parseFloat(overallPercentage.toFixed(2)),
        overallGrade,
        overallRemarks,
        resultStatus,
        generatedDate: new Date(),
        createdBy: userId,
      },
      { new: true, upsert: true, runValidators: true }
    );

    // Manually populate the fields to handle potential null references
    const populatedResultCard = {
      ...resultCard.toObject(), // Convert to plain object to avoid mongoose quirks
      student: await Student.findById(resultCard.student)
        .select('studentName registrationNo rollNumber fatherName motherName dateOfBirth address photoUrl picture')
        .lean(), // Use lean() to get plain JS object
      exam: await Exam.findById(resultCard.exam)
        .select('examName examinationName startDate endDate academicYear')
        .lean(), // Use lean() to get plain JS object
      class: await Class.findById(resultCard.class)
        .select('className section')
        .lean(), // Use lean() to get plain JS object
      institute: await InstituteProfile.findById(resultCard.institute)
        .select('instituteName tagline phone address country website logoUrl')
        .lean() // Use lean() to get plain JS object
    };

    // Check if any of the populated fields are null
    if (!populatedResultCard.student || !populatedResultCard.exam || !populatedResultCard.class || !populatedResultCard.institute) {
      console.error('❌ One or more populated fields are null:', {
        student: populatedResultCard.student,
        exam: populatedResultCard.exam,
        class: populatedResultCard.class,
        institute: populatedResultCard.institute
      });

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to generate result card: Missing required reference data'
      });
    }


    console.log(`✅ Result card generated for student: ${student.studentName}`);

    // Log the result card data to check for null values
    console.log('📊 Result card data:', JSON.stringify({
      studentName: populatedResultCard.student?.studentName,
      examName: populatedResultCard.exam?.examName,
      className: populatedResultCard.class?.className,
      instituteName: populatedResultCard.institute?.instituteName,
      totalSubjects: populatedResultCard.subjects?.length,
      overallPercentage: populatedResultCard.overallPercentage,
      overallGrade: populatedResultCard.overallGrade,
      resultStatus: populatedResultCard.resultStatus
    }, null, 2));

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Result card generated successfully',
      data: populatedResultCard
    });
  } catch (error) {
    console.error('❌ Generate result card error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || 'Failed to generate result card'
    });
  }
};

/**
 * Get result cards with filters
 * @route GET /api/exams/result-cards
 */
export const getResultCards = async (req, res) => {
  try {
    const userId = req.user.id;
    const { exam, class: classId, student, resultStatus, page = 1, limit = 10 } = req.query;
    
    console.log(`📥 GET /api/exams/result-cards for user: ${userId}`);
    
    // Build query
    const query = { createdBy: userId };
    
    if (exam && mongoose.Types.ObjectId.isValid(exam)) {
      query.exam = exam;
    }
    
    if (classId && mongoose.Types.ObjectId.isValid(classId)) {
      query.class = classId;
    }
    
    if (student && mongoose.Types.ObjectId.isValid(student)) {
      query.student = student;
    }
    
    if (resultStatus && resultStatus !== 'all') {
      query.resultStatus = resultStatus;
    }
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [resultCards, total] = await Promise.all([
      ResultCard.find(query)
        .populate('student', 'studentName registrationNo rollNumber')
        .populate('exam', 'examName examinationName')
        .populate('class', 'className section')
        .sort({ generatedDate: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      ResultCard.countDocuments(query)
    ]);
    
    console.log(`✅ Found ${resultCards.length} result cards`);
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Result cards retrieved successfully',
      count: resultCards.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: resultCards
    });
  } catch (error) {
    console.error('❌ Get result cards error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch result cards'
    });
  }
};

/**
 * Get result card by ID
 * @route GET /api/exams/result-cards/:id
 */
export const getResultCardById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    console.log(`📥 GET /api/exams/result-cards/${id}`);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid result card ID'
      });
    }
    
    const resultCard = await ResultCard.findOne({ _id: id, createdBy: userId })
      .populate('student', 'studentName registrationNo rollNumber fatherName motherName dateOfBirth address')
      .populate('exam', 'examName examinationName startDate endDate')
      .populate('class', 'className section teacher');
    
    if (!resultCard) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Result card not found'
      });
    }
    
    console.log('✅ Result card found:', resultCard._id);
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Result card retrieved successfully',
      data: resultCard
    });
  } catch (error) {
    console.error('❌ Get result card error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch result card'
    });
  }
};

/**
 * Get dropdown data for exam marks
 * @route GET /api/exams/marks/dropdown-data
 */
export const getExamMarksDropdownData = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(`📥 GET /api/exams/marks/dropdown-data for user: ${userId}`);
    
    // Get exams
    const exams = await Exam.find({ createdBy: userId, status: 'active' })
      .select('examName examinationName')
      .sort({ examName: 1 });
    
    // Get classes
    const classes = await Class.find({ createdBy: userId, status: 'active' })
      .select('className section')
      .sort({ className: 1, section: 1 });
    
    // Get teachers
    const Employee = mongoose.model('Employee');
    const teachers = await Employee.find({ 
      employeeRole: { $regex: /teacher/i },
      status: 'active'
    }).select('employeeName emailAddress mobileNo')
      .sort({ employeeName: 1 });
    
    console.log(`✅ Dropdown data retrieved: ${exams.length} exams, ${classes.length} classes, ${teachers.length} teachers`);
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Dropdown data retrieved successfully',
      data: {
        exams,
        classes,
        teachers
      }
    });
  } catch (error) {
    console.error('❌ Get exam marks dropdown data error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch dropdown data'
    });
  }
};