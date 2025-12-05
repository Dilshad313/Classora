import mongoose from 'mongoose';
import TimePeriod from '../models/TimePeriod.js';
import { StatusCodes } from 'http-status-codes';

/**
 * Get all time periods
 * @route GET /api/timetable/time-periods
 */
export const getTimePeriods = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const timePeriods = await TimePeriod.find({ createdBy: userId })
      .sort({ order: 1 });
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Time periods retrieved successfully',
      data: timePeriods
    });
  } catch (error) {
    console.error('❌ Get time periods error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch time periods'
    });
  }
};

/**
 * Create new time period
 * @route POST /api/timetable/time-periods
 */
export const createTimePeriod = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const { name, startTime, endTime, type, order } = req.body;
    
    // Validation
    if (!name || !startTime || !endTime || !order) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Name, start time, end time, and order are required'
      });
    }
    
    // Check for duplicate name
    const duplicateName = await TimePeriod.findOne({
      name: name.trim(),
      createdBy: userId
    });
    
    if (duplicateName) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: `Time period "${name}" already exists`
      });
    }
    
    // Check for duplicate order
    const duplicateOrder = await TimePeriod.findOne({
      order: parseInt(order),
      createdBy: userId
    });
    
    if (duplicateOrder) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: `Order ${order} is already assigned to another period`
      });
    }
    
    // Create time period
    const timePeriodData = {
      name: name.trim(),
      startTime,
      endTime,
      type: type || 'class',
      order: parseInt(order) || 1,
      createdBy: userId
    };
    
    const timePeriod = await TimePeriod.create(timePeriodData);
    
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Time period created successfully',
      data: timePeriod
    });
  } catch (error) {
    console.error('❌ Create time period error:', error);
    
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
      message: 'Failed to create time period'
    });
  }
};

/**
 * Update time period
 * @route PUT /api/timetable/time-periods/:id
 */
export const updateTimePeriod = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid time period ID'
      });
    }
    
    const timePeriod = await TimePeriod.findOne({ _id: id, createdBy: userId });
    
    if (!timePeriod) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Time period not found'
      });
    }
    
    const { name, startTime, endTime, type, order } = req.body;
    
    // Check for duplicate name if changed
    if (name && name !== timePeriod.name) {
      const duplicate = await TimePeriod.findOne({
        name: name.trim(),
        createdBy: userId,
        _id: { $ne: id }
      });
      
      if (duplicate) {
        return res.status(StatusCodes.CONFLICT).json({
          success: false,
          message: `Time period "${name}" already exists`
        });
      }
    }
    
    // Check for duplicate order if changed
    if (order && parseInt(order) !== timePeriod.order) {
      const duplicate = await TimePeriod.findOne({
        order: parseInt(order),
        createdBy: userId,
        _id: { $ne: id }
      });
      
      if (duplicate) {
        return res.status(StatusCodes.CONFLICT).json({
          success: false,
          message: `Order ${order} is already assigned to another period`
        });
      }
    }
    
    // Update fields
    if (name) timePeriod.name = name.trim();
    if (startTime) timePeriod.startTime = startTime;
    if (endTime) timePeriod.endTime = endTime;
    if (type) timePeriod.type = type;
    if (order) timePeriod.order = parseInt(order);
    
    await timePeriod.save();
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Time period updated successfully',
      data: timePeriod
    });
  } catch (error) {
    console.error('❌ Update time period error:', error);
    
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
      message: 'Failed to update time period'
    });
  }
};

/**
 * Delete time period
 * @route DELETE /api/timetable/time-periods/:id
 */
export const deleteTimePeriod = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid time period ID'
      });
    }
    
    const timePeriod = await TimePeriod.findOneAndDelete({ _id: id, createdBy: userId });
    
    if (!timePeriod) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Time period not found'
      });
    }
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Time period deleted successfully',
      data: { id }
    });
  } catch (error) {
    console.error('❌ Delete time period error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete time period'
    });
  }
};

/**
 * Get time period statistics
 * @route GET /api/timetable/time-periods/stats/summary
 */
export const getTimePeriodStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const stats = await TimePeriod.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalPeriods: { $sum: 1 },
          classPeriods: {
            $sum: { $cond: [{ $eq: ['$type', 'class'] }, 1, 0] }
          },
          breakPeriods: {
            $sum: { $cond: [{ $eq: ['$type', 'break'] }, 1, 0] }
          },
          totalDuration: { $sum: '$duration' }
        }
      }
    ]);
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Time period statistics retrieved successfully',
      data: stats[0] || {
        totalPeriods: 0,
        classPeriods: 0,
        breakPeriods: 0,
        totalDuration: 0
      }
    });
  } catch (error) {
    console.error('❌ Get time period stats error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch time period statistics'
    });
  }
};