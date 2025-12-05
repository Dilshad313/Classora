import FeeStructure from '../models/FeeStructure.js';
import { StatusCodes } from 'http-status-codes';

/**
 * Get all fee structures
 * @route GET /api/fee-structure
 */
export const getAllFeeStructures = async (req, res) => {
  try {
    console.log('📥 GET /api/fee-structure');
    
    const { status, academicYear } = req.query;
    const userId = req.user.id;
    
    // Build query
    const query = { createdBy: userId };
    if (status) query.status = status;
    if (academicYear) query.academicYear = academicYear;
    
    const feeStructures = await FeeStructure.find(query)
      .sort({ className: 1, academicYear: -1 });
    
    console.log(`✅ Found ${feeStructures.length} fee structures`);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Fee structures retrieved successfully',
      count: feeStructures.length,
      data: feeStructures
    });
  } catch (error) {
    console.error('❌ Get fee structures error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch fee structures'
    });
  }
};

/**
 * Get single fee structure by ID
 * @route GET /api/fee-structure/:id
 */
export const getFeeStructureById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    console.log(`📥 GET /api/fee-structure/${id}`);
    
    const feeStructure = await FeeStructure.findOne({ _id: id, createdBy: userId });
    
    if (!feeStructure) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Fee structure not found'
      });
    }
    
    console.log('✅ Fee structure found');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Fee structure retrieved successfully',
      data: feeStructure
    });
  } catch (error) {
    console.error('❌ Get fee structure error:', error);
    
    if (error.name === 'CastError') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid fee structure ID'
      });
    }
    
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch fee structure'
    });
  }
};

/**
 * Create new fee structure
 * @route POST /api/fee-structure
 */
export const createFeeStructure = async (req, res) => {
  try {
    console.log('📥 POST /api/fee-structure');
    console.log('Request body:', req.body);
    
    const userId = req.user.id;
    const {
      className,
      academicYear,
      tuitionFee,
      admissionFee,
      examFee,
      labFee,
      libraryFee,
      sportsFee,
      status
    } = req.body;

    // Validate required fields
    if (!className?.trim()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Class name is required'
      });
    }

    if (!academicYear?.trim()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Academic year is required'
      });
    }

    if (tuitionFee === undefined || tuitionFee === null || tuitionFee === '') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Tuition fee is required'
      });
    }

    // Create fee structure data
    const feeStructureData = {
      className: className.trim(),
      academicYear: academicYear.trim(),
      tuitionFee: parseFloat(tuitionFee) || 0,
      admissionFee: parseFloat(admissionFee) || 0,
      examFee: parseFloat(examFee) || 0,
      labFee: parseFloat(labFee) || 0,
      libraryFee: parseFloat(libraryFee) || 0,
      sportsFee: parseFloat(sportsFee) || 0,
      status: status || 'active',
      createdBy: userId
    };

    // Create new fee structure
    const feeStructure = await FeeStructure.create(feeStructureData);
    
    console.log('✅ Fee structure created:', feeStructure._id);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Fee structure created successfully',
      data: feeStructure
    });
  } catch (error) {
    console.error('❌ Create fee structure error:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: errors[0] || 'Validation failed',
        errors: errors
      });
    }

    if (error.code === 11000) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: 'Fee structure for this class and academic year already exists'
      });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || 'Failed to create fee structure'
    });
  }
};

/**
 * Update fee structure
 * @route PUT /api/fee-structure/:id
 */
export const updateFeeStructure = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    console.log(`📥 PUT /api/fee-structure/${id}`);
    console.log('Request body:', req.body);
    
    const {
      className,
      academicYear,
      tuitionFee,
      admissionFee,
      examFee,
      labFee,
      libraryFee,
      sportsFee,
      status
    } = req.body;

    // Find existing fee structure
    const existingFeeStructure = await FeeStructure.findOne({ _id: id, createdBy: userId });
    
    if (!existingFeeStructure) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Fee structure not found'
      });
    }

    // Validate required fields
    if (!className?.trim()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Class name is required'
      });
    }

    if (!academicYear?.trim()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Academic year is required'
      });
    }

    if (tuitionFee === undefined || tuitionFee === null || tuitionFee === '') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Tuition fee is required'
      });
    }

    // Prepare update data
    const updateData = {
      className: className.trim(),
      academicYear: academicYear.trim(),
      tuitionFee: parseFloat(tuitionFee) || 0,
      admissionFee: parseFloat(admissionFee) || 0,
      examFee: parseFloat(examFee) || 0,
      labFee: parseFloat(labFee) || 0,
      libraryFee: parseFloat(libraryFee) || 0,
      sportsFee: parseFloat(sportsFee) || 0,
      status: status || 'active'
    };

    // Update fee structure
    const feeStructure = await FeeStructure.findOneAndUpdate(
      { _id: id, createdBy: userId },
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    console.log('✅ Fee structure updated');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Fee structure updated successfully',
      data: feeStructure
    });
  } catch (error) {
    console.error('❌ Update fee structure error:', error);

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
        message: 'Invalid fee structure ID'
      });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || 'Failed to update fee structure'
    });
  }
};

/**
 * Delete fee structure
 * @route DELETE /api/fee-structure/:id
 */
export const deleteFeeStructure = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    console.log(`📥 DELETE /api/fee-structure/${id}`);
    
    const feeStructure = await FeeStructure.findOneAndDelete({ _id: id, createdBy: userId });
    
    if (!feeStructure) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Fee structure not found'
      });
    }
    
    console.log('✅ Fee structure deleted');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Fee structure deleted successfully',
      data: feeStructure
    });
  } catch (error) {
    console.error('❌ Delete fee structure error:', error);
    
    if (error.name === 'CastError') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid fee structure ID'
      });
    }
    
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete fee structure'
    });
  }
};

/**
 * Get fee structures statistics
 * @route GET /api/fee-structure/stats/summary
 */
export const getFeeStructureStats = async (req, res) => {
  try {
    console.log('📥 GET /api/fee-structure/stats/summary');
    const userId = req.user.id;
    
    const totalStructures = await FeeStructure.countDocuments({ createdBy: userId });
    const activeStructures = await FeeStructure.countDocuments({ status: 'active', createdBy: userId });
    
    // Get all fee structures to calculate total revenue
    const allStructures = await FeeStructure.find({ createdBy: userId });
    const totalRevenue = allStructures.reduce((sum, structure) => {
      return sum + (
        structure.tuitionFee +
        structure.admissionFee +
        structure.examFee +
        structure.labFee +
        structure.libraryFee +
        structure.sportsFee
      );
    }, 0);
    
    // Get unique academic years
    const academicYears = await FeeStructure.distinct('academicYear', { createdBy: userId });
    
    console.log('✅ Statistics calculated');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Statistics retrieved successfully',
      data: {
        totalStructures,
        activeStructures,
        totalRevenue,
        academicYears: academicYears.sort().reverse()
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