import mongoose from 'mongoose';
import WeekDay from '../models/WeekDay.js';
import { StatusCodes } from 'http-status-codes';

/**
 * Get all week days
 * @route GET /api/timetable/week-days
 */
export const getWeekDays = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const weekDays = await WeekDay.find({ createdBy: userId })
      .sort({ order: 1 });
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Week days retrieved successfully',
      data: weekDays
    });
  } catch (error) {
    console.error('❌ Get week days error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch week days'
    });
  }
};

/**
 * Create new week day
 * @route POST /api/timetable/week-days
 */
export const createWeekDay = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const { name, shortName, isActive, order } = req.body;
    
    // Validation
    if (!name || !shortName || !order) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Name, short name, and order are required'
      });
    }
    
    // Check for duplicate name
    const duplicateName = await WeekDay.findOne({
      name: name.trim(),
      createdBy: userId
    });
    
    if (duplicateName) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: `Day "${name}" already exists`
      });
    }
    
    // Check for duplicate short name
    const duplicateShortName = await WeekDay.findOne({
      shortName: shortName.trim(),
      createdBy: userId
    });
    
    if (duplicateShortName) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: `Short name "${shortName}" already exists`
      });
    }
    
    // Check for duplicate order
    const duplicateOrder = await WeekDay.findOne({
      order: parseInt(order),
      createdBy: userId
    });
    
    if (duplicateOrder) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: `Order ${order} is already assigned to another day`
      });
    }
    
    // Create week day
    const weekDayData = {
      name: name.trim(),
      shortName: shortName.trim(),
      isActive: isActive !== undefined ? isActive : true,
      order: parseInt(order) || 1,
      createdBy: userId
    };
    
    const weekDay = await WeekDay.create(weekDayData);
    
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Week day created successfully',
      data: weekDay
    });
  } catch (error) {
    console.error('❌ Create week day error:', error);
    
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
      message: 'Failed to create week day'
    });
  }
};

/**
 * Update week day
 * @route PUT /api/timetable/week-days/:id
 */
export const updateWeekDay = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid week day ID'
      });
    }
    
    const weekDay = await WeekDay.findOne({ _id: id, createdBy: userId });
    
    if (!weekDay) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Week day not found'
      });
    }
    
    const { name, shortName, isActive, order } = req.body;
    
    // Check for duplicate name if changed
    if (name && name !== weekDay.name) {
      const duplicate = await WeekDay.findOne({
        name: name.trim(),
        createdBy: userId,
        _id: { $ne: id }
      });
      
      if (duplicate) {
        return res.status(StatusCodes.CONFLICT).json({
          success: false,
          message: `Day "${name}" already exists`
        });
      }
    }
    
    // Check for duplicate short name if changed
    if (shortName && shortName !== weekDay.shortName) {
      const duplicate = await WeekDay.findOne({
        shortName: shortName.trim(),
        createdBy: userId,
        _id: { $ne: id }
      });
      
      if (duplicate) {
        return res.status(StatusCodes.CONFLICT).json({
          success: false,
          message: `Short name "${shortName}" already exists`
        });
      }
    }
    
    // Check for duplicate order if changed
    if (order && parseInt(order) !== weekDay.order) {
      const duplicate = await WeekDay.findOne({
        order: parseInt(order),
        createdBy: userId,
        _id: { $ne: id }
      });
      
      if (duplicate) {
        return res.status(StatusCodes.CONFLICT).json({
          success: false,
          message: `Order ${order} is already assigned to another day`
        });
      }
    }
    
    // Update fields
    if (name) weekDay.name = name.trim();
    if (shortName) weekDay.shortName = shortName.trim();
    if (isActive !== undefined) weekDay.isActive = isActive;
    if (order) weekDay.order = parseInt(order);
    
    await weekDay.save();
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Week day updated successfully',
      data: weekDay
    });
  } catch (error) {
    console.error('❌ Update week day error:', error);
    
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
      message: 'Failed to update week day'
    });
  }
};

/**
 * Delete week day
 * @route DELETE /api/timetable/week-days/:id
 */
export const deleteWeekDay = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid week day ID'
      });
    }
    
    const weekDay = await WeekDay.findOneAndDelete({ _id: id, createdBy: userId });
    
    if (!weekDay) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Week day not found'
      });
    }
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Week day deleted successfully',
      data: { id }
    });
  } catch (error) {
    console.error('❌ Delete week day error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete week day'
    });
  }
};

/**
 * Toggle week day active status
 * @route PATCH /api/timetable/week-days/:id/toggle-active
 */
export const toggleWeekDayActive = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid week day ID'
      });
    }
    
    const weekDay = await WeekDay.findOne({ _id: id, createdBy: userId });
    
    if (!weekDay) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Week day not found'
      });
    }
    
    weekDay.isActive = !weekDay.isActive;
    await weekDay.save();
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: `Week day ${weekDay.isActive ? 'activated' : 'deactivated'}`,
      data: weekDay
    });
  } catch (error) {
    console.error('❌ Toggle week day active error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to update week day status'
    });
  }
};

/**
 * Get week day statistics
 * @route GET /api/timetable/week-days/stats/summary
 */
export const getWeekDayStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const stats = await WeekDay.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalDays: { $sum: 1 },
          activeDays: {
            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
          }
        }
      }
    ]);
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Week day statistics retrieved successfully',
      data: stats[0] || { totalDays: 0, activeDays: 0 }
    });
  } catch (error) {
    console.error('❌ Get week day stats error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch week day statistics'
    });
  }
};