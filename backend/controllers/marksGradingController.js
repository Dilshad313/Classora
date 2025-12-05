import MarksGrading from '../models/MarksGrading.js';
import { StatusCodes } from 'http-status-codes';

/**
 * Get all grades
 * @route GET /api/marks-grading
 */
export const getAllGradingSystems = async (req, res) => {
  try {
    console.log('📥 GET /api/marks-grading');
    const userId = req.user.id;
    
    let grades = await MarksGrading.find({ createdBy: userId })
      .sort({ minMarks: 1 });
    
    // Check if default system exists, if not create it
    if (grades.length === 0) {
      console.log('🌱 Creating default grading system...');
      await MarksGrading.initializeDefault(userId);
      grades = await MarksGrading.find({ createdBy: userId }).sort({ minMarks: 1 });
    }

    console.log(`✅ Found ${grades.length} grades`);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Grades retrieved successfully',
      count: grades.length,
      data: grades
    });
  } catch (error) {
    console.error('❌ Get grades error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch grades'
    });
  }
};

/**
 * Get single grade by ID
 * @route GET /api/marks-grading/:id
 */
export const getGradingSystemById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    console.log(`📥 GET /api/marks-grading/${id}`);
    
    const grade = await MarksGrading.findOne({ _id: id, createdBy: userId });
    
    if (!grade) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Grade not found'
      });
    }
    
    console.log('✅ Grade found');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Grade retrieved successfully',
      data: grade
    });
  } catch (error) {
    console.error('❌ Get grade error:', error);
    
    if (error.name === 'CastError') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid grade ID'
      });
    }
    
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch grade'
    });
  }
};

/**
 * Create new grade
 * @route POST /api/marks-grading
 */
export const createGradingSystem = async (req, res) => {
  try {
    console.log('📥 POST /api/marks-grading');
    console.log('Request body:', req.body);
    
    const userId = req.user.id;
    const { grade, minMarks, maxMarks, status } = req.body;

    // Validate required fields
    if (!grade?.trim()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Grade is required'
      });
    }

    if (minMarks === undefined || minMarks === null) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Minimum marks is required'
      });
    }

    if (maxMarks === undefined || maxMarks === null) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Maximum marks is required'
      });
    }

    // Check for overlapping ranges
    const overlap = await MarksGrading.checkOverlap(minMarks, maxMarks, userId);
    if (overlap) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: `Grade range overlaps with existing grade: ${overlap.grade} (${overlap.minMarks}-${overlap.maxMarks})`
      });
    }

    // Create new grade
    const newGrade = await MarksGrading.create({
      grade: grade.trim().toUpperCase(),
      minMarks: parseFloat(minMarks),
      maxMarks: parseFloat(maxMarks),
      status: status || 'PASS',
      createdBy: userId
    });
    
    console.log('✅ Grade created:', newGrade._id);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Grade created successfully',
      data: newGrade
    });
  } catch (error) {
    console.error('❌ Create grade error:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: errors[0] || 'Validation failed',
        errors: errors
      });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || 'Failed to create grade'
    });
  }
};

/**
 * Update grade
 * @route PUT /api/marks-grading/:id
 */
export const updateGradingSystem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    console.log(`📥 PUT /api/marks-grading/${id}`);
    console.log('Request body:', req.body);
    
    const { grade, minMarks, maxMarks, status } = req.body;

    // Find existing grade
    const existingGrade = await MarksGrading.findOne({ _id: id, createdBy: userId });
    
    if (!existingGrade) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Grade not found'
      });
    }

    // Validate required fields
    if (!grade?.trim()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Grade is required'
      });
    }

    if (minMarks === undefined || minMarks === null) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Minimum marks is required'
      });
    }

    if (maxMarks === undefined || maxMarks === null) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Maximum marks is required'
      });
    }

    // Check for overlapping ranges (excluding current grade)
    const overlap = await MarksGrading.checkOverlap(minMarks, maxMarks, userId, id);
    if (overlap) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: `Grade range overlaps with existing grade: ${overlap.grade} (${overlap.minMarks}-${overlap.maxMarks})`
      });
    }

    // Update grade
    const updatedGrade = await MarksGrading.findOneAndUpdate(
      { _id: id, createdBy: userId },
      {
        grade: grade.trim().toUpperCase(),
        minMarks: parseFloat(minMarks),
        maxMarks: parseFloat(maxMarks),
        status: status || existingGrade.status
      },
      {
        new: true,
        runValidators: true
      }
    );

    console.log('✅ Grade updated');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Grade updated successfully',
      data: updatedGrade
    });
  } catch (error) {
    console.error('❌ Update grade error:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: errors[0] || 'Validation failed',
        errors: errors
      });
    }

    if (error.name === 'CastError') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid grade ID'
      });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || 'Failed to update grade'
    });
  }
};

/**
 * Delete grade
 * @route DELETE /api/marks-grading/:id
 */
export const deleteGradingSystem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    console.log(`📥 DELETE /api/marks-grading/${id}`);
    
    const grade = await MarksGrading.findOneAndDelete({ _id: id, createdBy: userId });
    
    if (!grade) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Grade not found'
      });
    }
    
    console.log('✅ Grade deleted');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Grade deleted successfully',
      data: grade
    });
  } catch (error) {
    console.error('❌ Delete grade error:', error);
    
    if (error.name === 'CastError') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid grade ID'
      });
    }
    
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete grade'
    });
  }
};

/**
 * Bulk update grades (Save entire grading system)
 * @route PUT /api/marks-grading/bulk-update
 */
export const bulkUpdateGrades = async (req, res) => {
  try {
    console.log('📥 PUT /api/marks-grading/bulk-update');
    const userId = req.user.id;
    const { grades } = req.body;

    if (!Array.isArray(grades) || grades.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Grades array is required'
      });
    }

    // Validate all grades
    const errors = [];
    for (let i = 0; i < grades.length; i++) {
      const g = grades[i];
      if (!g.grade) errors.push(`Grade ${i + 1}: Grade name is required`);
      if (g.minMarks === undefined) errors.push(`Grade ${i + 1}: Min marks is required`);
      if (g.maxMarks === undefined) errors.push(`Grade ${i + 1}: Max marks is required`);
      if (g.minMarks > g.maxMarks) errors.push(`Grade ${i + 1}: Min marks cannot be greater than max marks`);
    }

    if (errors.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: errors[0],
        errors
      });
    }

    // Delete existing grades and create new ones
    await MarksGrading.deleteMany({ createdBy: userId });
    
    const newGrades = grades.map((g, index) => ({
      grade: g.grade.toUpperCase(),
      minMarks: parseFloat(g.minMarks),
      maxMarks: parseFloat(g.maxMarks),
      status: g.status || 'PASS',
      order: index + 1,
      createdBy: userId
    }));

    const savedGrades = await MarksGrading.insertMany(newGrades);

    console.log('✅ Grades bulk updated');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Grades updated successfully',
      data: savedGrades
    });
  } catch (error) {
    console.error('❌ Bulk update error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to update grades'
    });
  }
};

/**
 * Reset to default grading system
 * @route POST /api/marks-grading/reset-default
 */
export const resetToDefault = async (req, res) => {
  try {
    console.log('📥 POST /api/marks-grading/reset-default');
    const userId = req.user.id;

    // Delete all existing grades
    await MarksGrading.deleteMany({ createdBy: userId });

    // Initialize default
    await MarksGrading.initializeDefault(userId);

    const grades = await MarksGrading.find({ createdBy: userId }).sort({ minMarks: 1 });

    console.log('✅ Reset to default successful');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Grading system reset to default successfully',
      data: grades
    });
  } catch (error) {
    console.error('❌ Reset to default error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to reset grading system'
    });
  }
};

/**
 * Validate grading system
 * @route GET /api/marks-grading/validate
 */
export const validateGradingSystem = async (req, res) => {
  try {
    console.log('📥 GET /api/marks-grading/validate');
    const userId = req.user.id;

    const validation = await MarksGrading.validateGradingSystem(userId);

    res.status(StatusCodes.OK).json({
      success: true,
      message: validation.valid ? 'Grading system is valid' : 'Grading system has errors',
      data: validation
    });
  } catch (error) {
    console.error('❌ Validation error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to validate grading system'
    });
  }
};

/**
 * Get grade for specific marks
 * @route GET /api/marks-grading/get-grade/:marks
 */
export const getGradeForMarks = async (req, res) => {
  try {
    const { marks } = req.params;
    const userId = req.user.id;
    console.log(`📥 GET /api/marks-grading/get-grade/${marks}`);

    const grade = await MarksGrading.getGradeForMarks(parseFloat(marks), userId);

    if (!grade) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'No grade found for the given marks'
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Grade retrieved successfully',
      data: grade
    });
  } catch (error) {
    console.error('❌ Get grade for marks error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || 'Failed to get grade'
    });
  }
};

/**
 * Get grading statistics
 * @route GET /api/marks-grading/stats/summary
 */
export const getGradingStats = async (req, res) => {
  try {
    console.log('📥 GET /api/marks-grading/stats/summary');
    const userId = req.user.id;

    const totalGrades = await MarksGrading.countDocuments({ createdBy: userId });
    const passGrades = await MarksGrading.countDocuments({ status: 'PASS', createdBy: userId });
    const failGrades = await MarksGrading.countDocuments({ status: 'FAIL', createdBy: userId });

    const validation = await MarksGrading.validateGradingSystem(userId);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Statistics retrieved successfully',
      data: {
        totalGrades,
        passGrades,
        failGrades,
        isValid: validation.valid,
        errors: validation.errors
      }
    });
  } catch (error) {
    console.error('❌ Get statistics error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
};

/**
 * Get active grading system (legacy support)
 * @route GET /api/marks-grading/active
 */
export const getActiveGradingSystem = async (req, res) => {
  try {
    console.log('📥 GET /api/marks-grading/active');
    const userId = req.user.id;
    
    let grades = await MarksGrading.find({ createdBy: userId }).sort({ minMarks: 1 });
    
    if (grades.length === 0) {
      console.log('🌱 Creating default grading system...');
      await MarksGrading.initializeDefault(userId);
      grades = await MarksGrading.find({ createdBy: userId }).sort({ minMarks: 1 });
    }
    
    console.log('✅ Active grading system found');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Active grading system retrieved successfully',
      data: grades
    });
  } catch (error) {
    console.error('❌ Get active system error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch active grading system'
    });
  }
};

/**
 * Set active grading system (legacy support)
 * @route PUT /api/marks-grading/:id/activate
 */
export const setActiveGradingSystem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    console.log(`📥 PUT /api/marks-grading/${id}/activate`);
    
    const grade = await MarksGrading.findOne({ _id: id, createdBy: userId });
    
    if (!grade) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Grade not found'
      });
    }
    
    console.log('✅ Grade activated (no-op for current system)');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Grade activated successfully',
      data: grade
    });
  } catch (error) {
    console.error('❌ Activate grade error:', error);
    
    if (error.name === 'CastError') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid grade ID'
      });
    }
    
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to activate grade'
    });
  }
};