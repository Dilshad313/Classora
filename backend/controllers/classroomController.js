import mongoose from 'mongoose';
import Classroom from '../models/Classroom.js';
import { StatusCodes } from 'http-status-codes';

/**
 * Get all classrooms
 * @route GET /api/timetable/classrooms
 */
export const getClassrooms = async (req, res) => {
  try {
    const userId = req.user.id;
    const { search, type, building, isAvailable } = req.query;
    
    // Build query
    const query = { createdBy: userId };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { building: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (type && type !== 'all') {
      query.type = type;
    }
    
    if (building && building !== 'all') {
      query.building = building;
    }
    
    if (isAvailable && isAvailable !== 'all') {
      query.isAvailable = isAvailable === 'true';
    }
    
    const classrooms = await Classroom.find(query)
      .sort({ building: 1, floor: 1, name: 1 });
    
    // Get statistics
    const total = await Classroom.countDocuments(query);
    const available = await Classroom.countDocuments({ ...query, isAvailable: true });
    const totalCapacity = await Classroom.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: '$capacity' } } }
    ]);
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Classrooms retrieved successfully',
      data: classrooms,
      stats: {
        total,
        available,
        totalCapacity: totalCapacity[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('❌ Get classrooms error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch classrooms'
    });
  }
};

/**
 * Get single classroom by ID
 * @route GET /api/timetable/classrooms/:id
 */
export const getClassroomById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid classroom ID'
      });
    }
    
    const classroom = await Classroom.findOne({ _id: id, createdBy: userId });
    
    if (!classroom) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Classroom not found'
      });
    }
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Classroom retrieved successfully',
      data: classroom
    });
  } catch (error) {
    console.error('❌ Get classroom error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch classroom'
    });
  }
};

/**
 * Create new classroom
 * @route POST /api/timetable/classrooms
 */
export const createClassroom = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const { name, capacity, floor, building, type, isAvailable } = req.body;
    
    // Validation
    if (!name || !capacity || !floor || !building) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Name, capacity, floor, and building are required'
      });
    }
    
    // Check for duplicate
    const existing = await Classroom.findOne({
      name: name.trim(),
      createdBy: userId
    });
    
    if (existing) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: `Classroom "${name}" already exists`
      });
    }
    
    // Create classroom
    const classroomData = {
      name: name.trim(),
      capacity: parseInt(capacity) || 0,
      floor: parseInt(floor) || 0,
      building: building.trim(),
      type: type || 'Standard',
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      createdBy: userId
    };
    
    const classroom = await Classroom.create(classroomData);
    
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Classroom created successfully',
      data: classroom
    });
  } catch (error) {
    console.error('❌ Create classroom error:', error);
    
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
      message: 'Failed to create classroom'
    });
  }
};

/**
 * Update classroom
 * @route PUT /api/timetable/classrooms/:id
 */
export const updateClassroom = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid classroom ID'
      });
    }
    
    const classroom = await Classroom.findOne({ _id: id, createdBy: userId });
    
    if (!classroom) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Classroom not found'
      });
    }
    
    const { name, capacity, floor, building, type, isAvailable } = req.body;
    
    // Check for duplicate if name changed
    if (name && name !== classroom.name) {
      const duplicate = await Classroom.findOne({
        name: name.trim(),
        createdBy: userId,
        _id: { $ne: id }
      });
      
      if (duplicate) {
        return res.status(StatusCodes.CONFLICT).json({
          success: false,
          message: `Classroom "${name}" already exists`
        });
      }
    }
    
    // Update fields
    if (name) classroom.name = name.trim();
    if (capacity !== undefined) classroom.capacity = parseInt(capacity) || 0;
    if (floor !== undefined) classroom.floor = parseInt(floor) || 0;
    if (building !== undefined) classroom.building = building.trim();
    if (type !== undefined) classroom.type = type;
    if (isAvailable !== undefined) classroom.isAvailable = isAvailable;
    
    await classroom.save();
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Classroom updated successfully',
      data: classroom
    });
  } catch (error) {
    console.error('❌ Update classroom error:', error);
    
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
      message: 'Failed to update classroom'
    });
  }
};

/**
 * Delete classroom
 * @route DELETE /api/timetable/classrooms/:id
 */
export const deleteClassroom = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid classroom ID'
      });
    }
    
    const classroom = await Classroom.findOneAndDelete({ _id: id, createdBy: userId });
    
    if (!classroom) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Classroom not found'
      });
    }
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Classroom deleted successfully',
      data: { id }
    });
  } catch (error) {
    console.error('❌ Delete classroom error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete classroom'
    });
  }
};

/**
 * Bulk delete classrooms
 * @route POST /api/timetable/classrooms/bulk-delete
 */
export const bulkDeleteClassrooms = async (req, res) => {
  try {
    const userId = req.user.id;
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Please provide classroom IDs to delete'
      });
    }
    
    const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));
    
    if (validIds.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'No valid classroom IDs provided'
      });
    }
    
    const result = await Classroom.deleteMany({
      _id: { $in: validIds },
      createdBy: userId
    });
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} classrooms`,
      data: { deletedCount: result.deletedCount }
    });
  } catch (error) {
    console.error('❌ Bulk delete classrooms error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete classrooms'
    });
  }
};

/**
 * Toggle classroom availability
 * @route PATCH /api/timetable/classrooms/:id/toggle-availability
 */
export const toggleClassroomAvailability = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid classroom ID'
      });
    }
    
    const classroom = await Classroom.findOne({ _id: id, createdBy: userId });
    
    if (!classroom) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Classroom not found'
      });
    }
    
    classroom.isAvailable = !classroom.isAvailable;
    await classroom.save();
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: `Classroom ${classroom.isAvailable ? 'marked as available' : 'marked as unavailable'}`,
      data: classroom
    });
  } catch (error) {
    console.error('❌ Toggle availability error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to update classroom availability'
    });
  }
};

/**
 * Get classroom statistics
 * @route GET /api/timetable/classrooms/stats/summary
 */
export const getClassroomStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const stats = await Classroom.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalRooms: { $sum: 1 },
          totalCapacity: { $sum: '$capacity' },
          availableRooms: {
            $sum: { $cond: [{ $eq: ['$isAvailable', true] }, 1, 0] }
          }
        }
      }
    ]);
    
    // Get type distribution
    const typeDistribution = await Classroom.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get building distribution
    const buildingDistribution = await Classroom.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$building',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Classroom statistics retrieved successfully',
      data: {
        ...stats[0] || { totalRooms: 0, totalCapacity: 0, availableRooms: 0 },
        typeDistribution,
        buildingDistribution
      }
    });
  } catch (error) {
    console.error('❌ Get classroom stats error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch classroom statistics'
    });
  }
};