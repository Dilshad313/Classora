import mongoose from 'mongoose';
import Timetable from '../models/Timetable.js';
import Class from '../models/Class.js';
import Employee from '../models/Employee.js';
import Classroom from '../models/Classroom.js';
import WeekDay from '../models/WeekDay.js';
import TimePeriod from '../models/TimePeriod.js';
import Subject from '../models/Subject.js';
import { StatusCodes } from 'http-status-codes';

/**
 * Create or update timetable
 * @route POST /api/timetable
 */
export const createOrUpdateTimetable = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const {
      classId,
      academicYear,
      term,
      periods,
      teacherId
    } = req.body;
    
    // Validation - Only classId is mandatory, academicYear and term are optional
    if (!classId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Class is required'
      });
    }
    
    // Validate periods array exists and has data
    if (!periods || !Array.isArray(periods) || periods.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'At least one period is required'
      });
    }
    
    // Check if class exists
    const classExists = await Class.findOne({ _id: classId, createdBy: userId });
    if (!classExists) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Class not found'
      });
    }
    
    // Check if teacher exists (if provided)
    if (teacherId) {
      const teacherExists = await Employee.findOne({ _id: teacherId });
      if (!teacherExists) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Teacher not found'
        });
      }
    }
    
    // Validate periods
    if (periods && Array.isArray(periods)) {
      for (const period of periods) {
        // Validate day
        if (period.dayId) {
          const dayExists = await WeekDay.findOne({ _id: period.dayId, createdBy: userId });
          if (!dayExists) {
            return res.status(StatusCodes.BAD_REQUEST).json({
              success: false,
              message: `Invalid day ID: ${period.dayId}`
            });
          }
        }
        
        // Validate period
        if (period.periodId) {
          const periodExists = await TimePeriod.findOne({ _id: period.periodId, createdBy: userId });
          if (!periodExists) {
            return res.status(StatusCodes.BAD_REQUEST).json({
              success: false,
              message: `Invalid period ID: ${period.periodId}`
            });
          }
        }
        
        // Validate subject (if not a break)
        if (!period.isBreak && period.subjectId) {
          const subjectExists = await Subject.findOne({ _id: period.subjectId, createdBy: userId });
          if (!subjectExists) {
            return res.status(StatusCodes.BAD_REQUEST).json({
              success: false,
              message: `Invalid subject ID: ${period.subjectId}`
            });
          }
          period.subjectName = subjectExists.name;
        }
        
        // Validate teacher (if not a break)
        if (!period.isBreak && period.teacherId) {
          const teacherExists = await Employee.findOne({ _id: period.teacherId });
          if (!teacherExists) {
            return res.status(StatusCodes.BAD_REQUEST).json({
              success: false,
              message: `Invalid teacher ID: ${period.teacherId}`
            });
          }
          period.teacherName = teacherExists.employeeName;
        }
        
        // Validate room (if not a break)
        if (!period.isBreak && period.roomId) {
          const roomExists = await Classroom.findOne({ _id: period.roomId, createdBy: userId });
          if (!roomExists) {
            return res.status(StatusCodes.BAD_REQUEST).json({
              success: false,
              message: `Invalid room ID: ${period.roomId}`
            });
          }
          period.roomName = roomExists.name;
        }
      }
    }
    
    // Build query for existing timetable
    const query = {
      classId,
      createdBy: userId
    };
    
    // Add optional fields to query if provided
    if (academicYear) query.academicYear = academicYear;
    if (term) query.term = term;
    
    // Check for existing timetable
    let timetable = await Timetable.findOne(query);
    
    if (timetable) {
      // Update existing timetable
      timetable.periods = periods;
      if (academicYear) timetable.academicYear = academicYear;
      if (term) timetable.term = term;
      if (teacherId) timetable.teacherId = teacherId;
      await timetable.save();
      
      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Timetable updated successfully',
        data: timetable
      });
    } else {
      // Create new timetable with default values for optional fields
      const timetableData = {
        classId,
        academicYear: academicYear || new Date().getFullYear().toString(),
        term: term || '1st Term',
        periods: periods,
        teacherId,
        createdBy: userId
      };
      
      timetable = await Timetable.create(timetableData);
      
      res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Timetable created successfully',
        data: timetable
      });
    }
  } catch (error) {
    console.error('❌ Create/update timetable error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: errors[0] || 'Validation failed',
        errors
      });
    }
    
    if (error.code === 11000) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: 'Timetable already exists for this class and academic period'
      });
    }
    
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to save timetable'
    });
  }
};

/**
 * Get timetable by class
 * @route GET /api/timetable/class/:classId
 */
export const getTimetableByClass = async (req, res) => {
  try {
    const userId = req.user.id;
    const { classId } = req.params;
    const { academicYear, term } = req.query;
    
    if (!mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid class ID'
      });
    }
    
    // Build query
    const query = {
      classId,
      createdBy: userId
    };
    
    if (academicYear) query.academicYear = academicYear;
    if (term) query.term = term;
    
    const timetable = await Timetable.findOne(query)
      .populate('classId', 'className section')
      .populate('periods.dayId', 'name shortName')
      .populate('periods.periodId', 'name startTime endTime type')
      .populate('periods.subjectId', 'name code')
      .populate('periods.teacherId', 'employeeName employeeRole')
      .populate('periods.roomId', 'name building');
    
    if (!timetable) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Timetable not found'
      });
    }
    
    // Format timetable by day
    const formattedTimetable = {
      ...timetable.toObject(),
      timetableByDay: timetable.getTimetableByDay()
    };
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Timetable retrieved successfully',
      data: formattedTimetable
    });
  } catch (error) {
    console.error('❌ Get timetable by class error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch timetable'
    });
  }
};

/**
 * Get timetable by teacher
 * @route GET /api/timetable/teacher/:teacherId
 */
export const getTimetableByTeacher = async (req, res) => {
  try {
    const userId = req.user.id;
    const { teacherId } = req.params;
    const { academicYear, term } = req.query;
    
    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid teacher ID'
      });
    }
    
    // Build query
    const query = {
      'periods.teacherId': teacherId,
      createdBy: userId
    };
    
    if (academicYear) query.academicYear = academicYear;
    if (term) query.term = term;
    
    const timetables = await Timetable.find(query)
      .populate('classId', 'className section')
      .populate('periods.dayId', 'name shortName')
      .populate('periods.periodId', 'name startTime endTime')
      .populate('periods.subjectId', 'name code')
      .populate('periods.roomId', 'name building');
    
    // Filter periods for this teacher only
    const teacherTimetable = {
      teacherId,
      academicYear: academicYear || 'All',
      term: term || 'All',
      periods: []
    };
    
    timetables.forEach(timetable => {
      timetable.periods.forEach(period => {
        if (period.teacherId && period.teacherId.toString() === teacherId) {
          teacherTimetable.periods.push({
            ...period.toObject(),
            className: timetable.classId?.className || 'Unknown',
            section: timetable.classId?.section || ''
          });
        }
      });
    });
    
    // Group by day
    const groupedByDay = {};
    teacherTimetable.periods.forEach(period => {
      const dayId = period.dayId._id.toString();
      if (!groupedByDay[dayId]) {
        groupedByDay[dayId] = {
          day: period.dayId,
          periods: []
        };
      }
      groupedByDay[dayId].periods.push(period);
    });
    
    // Calculate statistics
    const totalPeriods = teacherTimetable.periods.length;
    const classPeriods = teacherTimetable.periods.filter(p => !p.isBreak).length;
    const freePeriods = timetables.reduce((acc, timetable) => {
      const totalSlots = timetable.periods.length;
      const teacherSlots = timetable.periods.filter(p => 
        p.teacherId && p.teacherId.toString() === teacherId
      ).length;
      return acc + (totalSlots - teacherSlots);
    }, 0);
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Teacher timetable retrieved successfully',
      data: {
        ...teacherTimetable,
        groupedByDay: Object.values(groupedByDay),
        stats: {
          totalPeriods,
          classPeriods,
          freePeriods
        }
      }
    });
  } catch (error) {
    console.error('❌ Get timetable by teacher error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch teacher timetable'
    });
  }
};

/**
 * Get all timetables
 * @route GET /api/timetable
 */
export const getAllTimetables = async (req, res) => {
  try {
    const userId = req.user.id;
    const { classId, academicYear, term, isActive } = req.query;
    
    // Build query
    const query = { createdBy: userId };
    
    if (classId && mongoose.Types.ObjectId.isValid(classId)) {
      query.classId = classId;
    }
    
    if (academicYear && academicYear !== 'all') {
      query.academicYear = academicYear;
    }
    
    if (term && term !== 'all') {
      query.term = term;
    }
    
    if (isActive && isActive !== 'all') {
      query.isActive = isActive === 'true';
    }
    
    const timetables = await Timetable.find(query)
      .populate('classId', 'className section')
      .sort({ academicYear: -1, term: 1 });
    
    // Get available academic years and terms for filters
    const academicYears = await Timetable.distinct('academicYear', { createdBy: userId });
    const terms = await Timetable.distinct('term', { createdBy: userId });
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Timetables retrieved successfully',
      data: timetables,
      filters: {
        academicYears,
        terms
      }
    });
  } catch (error) {
    console.error('❌ Get all timetables error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch timetables'
    });
  }
};

/**
 * Delete timetable
 * @route DELETE /api/timetable/:id
 */
export const deleteTimetable = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid timetable ID'
      });
    }
    
    const timetable = await Timetable.findOneAndDelete({ _id: id, createdBy: userId });
    
    if (!timetable) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Timetable not found'
      });
    }
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Timetable deleted successfully',
      data: { id }
    });
  } catch (error) {
    console.error('❌ Delete timetable error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete timetable'
    });
  }
};

/**
 * Toggle timetable active status
 * @route PATCH /api/timetable/:id/toggle-active
 */
export const toggleTimetableActive = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid timetable ID'
      });
    }
    
    const timetable = await Timetable.findOne({ _id: id, createdBy: userId });
    
    if (!timetable) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Timetable not found'
      });
    }
    
    timetable.isActive = !timetable.isActive;
    await timetable.save();
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: `Timetable ${timetable.isActive ? 'activated' : 'deactivated'}`,
      data: timetable
    });
  } catch (error) {
    console.error('❌ Toggle timetable active error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to update timetable status'
    });
  }
};

/**
 * Get timetable statistics
 * @route GET /api/timetable/stats/summary
 */
export const getTimetableStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const stats = await Timetable.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalTimetables: { $sum: 1 },
          activeTimetables: {
            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
          }
        }
      }
    ]);
    
    // Get distribution by academic year
    const yearDistribution = await Timetable.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$academicYear',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);
    
    // Get distribution by term
    const termDistribution = await Timetable.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$term',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Timetable statistics retrieved successfully',
      data: {
        ...stats[0] || { totalTimetables: 0, activeTimetables: 0 },
        yearDistribution,
        termDistribution
      }
    });
  } catch (error) {
    console.error('❌ Get timetable stats error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch timetable statistics'
    });
  }
};

/**
 * Get available resources for timetable creation
 * @route GET /api/timetable/resources/available
 */
export const getAvailableResources = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get active days
    const days = await WeekDay.find({ createdBy: userId, isActive: true })
      .sort({ order: 1 })
      .select('name shortName order');
    
    // Get time periods
    const periods = await TimePeriod.find({ createdBy: userId })
      .sort({ order: 1 })
      .select('name startTime endTime type order');
    
    // Get available classrooms
    const classrooms = await Classroom.find({ createdBy: userId, isAvailable: true })
      .sort({ building: 1, floor: 1, name: 1 })
      .select('name capacity building floor type');
    
    // Get classes
    const classes = await Class.find({ createdBy: userId, status: 'active' })
      .sort({ className: 1, section: 1 })
      .select('className section subject teacher');
    
    // Get teachers
    const teachers = await Employee.find({ 
      employeeRole: { $regex: /teacher|professor|lecturer/i },
      status: 'active'
    }).select('employeeName employeeRole department');
    
    // Get subjects
    const subjects = await Subject.find({ createdBy: userId })
      .select('name code');
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Available resources retrieved successfully',
      data: {
        days,
        periods,
        classrooms,
        classes,
        teachers,
        subjects
      }
    });
  } catch (error) {
    console.error('❌ Get available resources error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch available resources'
    });
  }
};