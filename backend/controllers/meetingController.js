import mongoose from 'mongoose';
import Meeting from '../models/Meeting.js';
import Class from '../models/Class.js';
import Student from '../models/Student.js';
import Employee from '../models/Employee.js';
import { StatusCodes } from 'http-status-codes';

/**
 * Get all meetings for current admin
 * @route GET /api/meetings
 */
export const getMeetings = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role; // Get user role from token
    const { status, meetingType, search, page = 1, limit = 10 } = req.query;
    
    console.log(`📥 GET /api/meetings for user: ${userId}, role: ${userRole}`);
    
    // Build query - different logic for admin vs teacher
    let query;
    
    if (userRole === 'admin') {
      // Admin can see all meetings in the system
      query = {};
    } else if (userRole === 'teacher') {
      // Teacher can see:
      // 1. Meetings they created
      // 2. Meetings assigned to them (specificTeacher)
      // 3. Meetings for their classes (specificClass)
      query = {
        $or: [
          { createdBy: userId }, // Meetings they created
          { specificTeacher: userId }, // Meetings assigned to them
          // Meetings for classes they teach (need to get their classes first)
        ]
      };
      
      // Get classes taught by this teacher and add them to the query
      try {
        const teacherClasses = await Class.find({ teacherId: userId }).select('_id');
        const classIds = teacherClasses.map(cls => cls._id);
        
        if (classIds.length > 0) {
          query.$or.push({ specificClass: { $in: classIds } });
        }
      } catch (error) {
        console.warn('Could not fetch teacher classes:', error.message);
      }
    } else {
      // For other roles, only show their own meetings
      query = { 
        createdBy: userId
      };
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (meetingType && meetingType !== 'all') {
      query.meetingType = meetingType;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { meetingLink: { $regex: search, $options: 'i' } },
        { meetingWith: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [meetings, total] = await Promise.all([
      Meeting.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('specificClass', 'className section subject')
        .populate('specificStudent', 'studentName registrationNo')
        .populate('specificTeacher', 'employeeName employeeRole'),
      Meeting.countDocuments(query)
    ]);
    
    console.log(`✅ Found ${meetings.length} meetings for ${userRole}`);
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Meetings retrieved successfully',
      count: meetings.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: meetings
    });
  } catch (error) {
    console.error('❌ Get meetings error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch meetings'
    });
  }
};

/**
 * Get single meeting by ID
 * @route GET /api/meetings/:id
 */
export const getMeetingById = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const { id } = req.params;
    
    console.log(`📥 GET /api/meetings/${id}`);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid meeting ID'
      });
    }
    
    const meeting = await Meeting.findOne({ 
      _id: id, 
      createdBy: userId
    })
      .populate('specificClass', 'className section subject')
      .populate('specificStudent', 'studentName registrationNo selectClass')
      .populate('specificTeacher', 'employeeName employeeRole department');
    
    if (!meeting) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Meeting not found'
      });
    }
    
    console.log('✅ Meeting found:', meeting.title);
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Meeting retrieved successfully',
      data: meeting
    });
  } catch (error) {
    console.error('❌ Get meeting error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch meeting'
    });
  }
};

/**
 * Create new meeting
 * @route POST /api/meetings
 */
export const createMeeting = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    console.log('📥 POST /api/meetings');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('User info:', { userId, userRole, user: req.user });
    
    const {
      title,
      meetingLink,
      meetingType,
      meetingWith,
      specificClass,
      specificStudent,
      specificTeacher,
      duration,
      message,
      isScheduled,
      scheduledDate,
      scheduledTime
    } = req.body;
    
    // Validation
    if (!title || !meetingLink || !meetingType || !duration) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Title, meeting link, meeting type, and duration are required'
      });
    }
    
    // Validate Google Meet link
    if (!meetingLink.includes('meet.google.com')) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Please provide a valid Google Meet link'
      });
    }
    
    // Prepare meeting data
    const meetingData = {
      title: title.trim(),
      meetingLink: meetingLink.trim(),
      meetingType,
      meetingWith: meetingWith?.trim() || '',
      duration: parseInt(duration) || 60,
      message: message?.trim() || '',
      isScheduled: Boolean(isScheduled),
      creatorRole: userRole === 'admin' ? 'Admin' : userRole === 'teacher' ? 'Employee' : 'Admin',
      createdBy: userId
    };
    
    // Handle specific references based on meeting type
    if (meetingType === 'specificClass' && specificClass) {
      if (mongoose.Types.ObjectId.isValid(specificClass)) {
        meetingData.specificClass = specificClass;
        
        // Get class details for meetingWith
        const classData = await Class.findById(specificClass);
        if (classData) {
          meetingData.meetingWith = classData.className || classData.name;
        }
      }
    } else if (meetingType === 'specificStudent' && specificStudent) {
      if (mongoose.Types.ObjectId.isValid(specificStudent)) {
        meetingData.specificStudent = specificStudent;
        
        // Get student details for meetingWith
        const studentData = await Student.findById(specificStudent);
        if (studentData) {
          meetingData.meetingWith = `${studentData.studentName} - ${studentData.registrationNo}`;
        }
      }
    } else if (meetingType === 'specificTeacher' && specificTeacher) {
      if (mongoose.Types.ObjectId.isValid(specificTeacher)) {
        meetingData.specificTeacher = specificTeacher;
        
        // Get teacher details for meetingWith
        const teacherData = await Employee.findById(specificTeacher);
        if (teacherData) {
          meetingData.meetingWith = `${teacherData.employeeName} - ${teacherData.employeeRole}`;
        }
      }
    }
    
    // Handle scheduled meeting
    if (isScheduled) {
      if (!scheduledDate || !scheduledTime) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Scheduled date and time are required for scheduled meetings'
        });
      }
      
      meetingData.scheduledDate = new Date(scheduledDate);
      meetingData.scheduledTime = scheduledTime;
      meetingData.status = 'scheduled';
    } else {
      meetingData.status = 'live';
    }
    
    // Create meeting
    console.log('📝 Creating meeting with data:', JSON.stringify(meetingData, null, 2));
    
    try {
      const newMeeting = await Meeting.create(meetingData);
      
      console.log('✅ Meeting created successfully:', newMeeting._id);
      
      res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Meeting created successfully',
        data: newMeeting
      });
    } catch (createError) {
      console.error('❌ Database creation error:', createError);
      console.error('Error details:', {
        name: createError.name,
        message: createError.message,
        stack: createError.stack
      });
      
      // Handle specific database errors
      if (createError.name === 'ValidationError') {
        const errors = Object.values(createError.errors).map(err => err.message);
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: errors[0] || 'Validation failed',
          errors
        });
      }
      
      // Handle duplicate key error specifically
      if (createError.name === 'MongoServerError' && createError.code === 11000) {
        console.log('Duplicate key error detected:', createError.keyValue);
        
        // If it's a meetingId duplicate, try again with a new ID
        if (createError.keyValue && createError.keyValue.meetingId === null) {
          console.log('Attempting to fix null meetingId issue...');
          
          // Add a generated meetingId and retry
          meetingData.meetingId = 'MTG-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
          
          try {
            const retryMeeting = await Meeting.create(meetingData);
            console.log('✅ Meeting created on retry:', retryMeeting._id);
            
            return res.status(StatusCodes.CREATED).json({
              success: true,
              message: 'Meeting created successfully',
              data: retryMeeting
            });
          } catch (retryError) {
            console.error('❌ Retry failed:', retryError);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
              success: false,
              message: 'Failed to create meeting after retry: ' + retryError.message
            });
          }
        }
        
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Duplicate entry detected: ' + JSON.stringify(createError.keyValue)
        });
      }
      
      if (createError.name === 'MongoServerError' || createError.name === 'MongoError') {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: 'Database error: ' + createError.message
        });
      }
      
      // Generic error
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to create meeting: ' + createError.message
      });
    }
  } catch (error) {
    console.error('❌ Create meeting error:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      body: req.body
    });
    
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to process meeting: ' + error.message
    });
  }
};

/**
 * Update meeting
 * @route PUT /api/meetings/:id
 */
export const updateMeeting = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const { id } = req.params;
    
    console.log(`📥 PUT /api/meetings/${id}`);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid meeting ID'
      });
    }
    
    const meeting = await Meeting.findOne({ 
      _id: id, 
      createdBy: userId
    });
    
    if (!meeting) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Meeting not found'
      });
    }
    
    const {
      title,
      meetingLink,
      meetingType,
      meetingWith,
      specificClass,
      specificStudent,
      specificTeacher,
      duration,
      message,
      isScheduled,
      scheduledDate,
      scheduledTime,
      status
    } = req.body;
    
    // Update fields
    if (title) meeting.title = title.trim();
    if (meetingLink) meeting.meetingLink = meetingLink.trim();
    if (meetingType) meeting.meetingType = meetingType;
    if (meetingWith) meeting.meetingWith = meetingWith.trim();
    if (duration !== undefined) meeting.duration = parseInt(duration) || 60;
    if (message !== undefined) meeting.message = message.trim();
    if (status) meeting.status = status;
    
    // Update specific references
    if (meetingType === 'specificClass' && specificClass) {
      if (mongoose.Types.ObjectId.isValid(specificClass)) {
        meeting.specificClass = specificClass;
        meeting.specificStudent = null;
        meeting.specificTeacher = null;
        
        // Get class details for meetingWith
        const classData = await Class.findById(specificClass);
        if (classData) {
          meeting.meetingWith = classData.className || classData.name;
        }
      }
    } else if (meetingType === 'specificStudent' && specificStudent) {
      if (mongoose.Types.ObjectId.isValid(specificStudent)) {
        meeting.specificStudent = specificStudent;
        meeting.specificClass = null;
        meeting.specificTeacher = null;
        
        // Get student details for meetingWith
        const studentData = await Student.findById(specificStudent);
        if (studentData) {
          meeting.meetingWith = `${studentData.studentName} - ${studentData.registrationNo}`;
        }
      }
    } else if (meetingType === 'specificTeacher' && specificTeacher) {
      if (mongoose.Types.ObjectId.isValid(specificTeacher)) {
        meeting.specificTeacher = specificTeacher;
        meeting.specificClass = null;
        meeting.specificStudent = null;
        
        // Get teacher details for meetingWith
        const teacherData = await Employee.findById(specificTeacher);
        if (teacherData) {
          meeting.meetingWith = `${teacherData.employeeName} - ${teacherData.employeeRole}`;
        }
      }
    }
    
    // Handle schedule updates
    if (isScheduled !== undefined) {
      meeting.isScheduled = Boolean(isScheduled);
      
      if (isScheduled) {
        if (!scheduledDate || !scheduledTime) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Scheduled date and time are required'
          });
        }
        
        meeting.scheduledDate = new Date(scheduledDate);
        meeting.scheduledTime = scheduledTime;
      } else {
        meeting.scheduledDate = null;
        meeting.scheduledTime = '';
      }
    }
    
    await meeting.save();
    
    console.log('✅ Meeting updated:', meeting._id);
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Meeting updated successfully',
      data: meeting
    });
  } catch (error) {
    console.error('❌ Update meeting error:', error);
    
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
      message: 'Failed to update meeting'
    });
  }
};

/**
 * Delete meeting
 * @route DELETE /api/meetings/:id
 */
export const deleteMeeting = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const { id } = req.params;
    
    console.log(`📥 DELETE /api/meetings/${id}`);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid meeting ID'
      });
    }
    
    const meeting = await Meeting.findOneAndDelete({ 
      _id: id, 
      createdBy: userId
    });
    
    if (!meeting) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Meeting not found'
      });
    }
    
    console.log('✅ Meeting deleted:', id);
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Meeting deleted successfully',
      data: { id }
    });
  } catch (error) {
    console.error('❌ Delete meeting error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete meeting'
    });
  }
};

/**
 * Join meeting
 * @route POST /api/meetings/:id/join
 */
export const joinMeeting = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    console.log(`📥 POST /api/meetings/${id}/join`);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid meeting ID'
      });
    }
    
    const meeting = await Meeting.findById(id);
    
    if (!meeting) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Meeting not found'
      });
    }
    
    // Check if user has permission to join
    if (meeting.createdBy.toString() !== userId) {
      // For now, allow any authenticated user to join
      // You can add additional permission checks here
    }
    
    // Update participant count
    if (!meeting.participants.includes(userId)) {
      meeting.participants.push(userId);
      meeting.participantCount = meeting.participants.length;
      await meeting.save();
    }
    
    console.log('✅ User joined meeting:', userId);
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Meeting joined successfully',
      data: {
        meetingLink: meeting.meetingLink,
        title: meeting.title,
        roomUrl: meeting.roomUrl,
        meetingPassword: meeting.meetingPassword
      }
    });
  } catch (error) {
    console.error('❌ Join meeting error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to join meeting'
    });
  }
};

/**
 * Get meeting statistics
 * @route GET /api/meetings/stats/summary
 */
export const getMeetingStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const creatorRole = userRole === 'admin' ? 'Admin' : userRole === 'teacher' ? 'Employee' : 'Admin';
    
    console.log(`📥 GET /api/meetings/stats/summary for user: ${userId}, role: ${userRole}`);
    
    const stats = await Meeting.getStatsByUser(userId, creatorRole);
    
    // Get meeting type distribution
    const typeDistribution = await Meeting.aggregate([
      { 
        $match: { 
          createdBy: new mongoose.Types.ObjectId(userId),
          creatorRole: creatorRole
        } 
      },
      {
        $group: {
          _id: '$meetingType',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get upcoming meetings
    const upcomingMeetings = await Meeting.countDocuments({
      createdBy: userId,
      creatorRole: creatorRole,
      isScheduled: true,
      startTime: { $gt: new Date() }
    });
    
    // Get average participants
    const avgParticipants = await Meeting.aggregate([
      { 
        $match: { 
          createdBy: new mongoose.Types.ObjectId(userId),
          creatorRole: creatorRole
        } 
      },
      {
        $group: {
          _id: null,
          average: { $avg: '$participantCount' }
        }
      }
    ]);
    
    console.log('✅ Meeting stats retrieved');
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Meeting statistics retrieved successfully',
      data: {
        ...stats,
        typeDistribution,
        upcomingMeetings: upcomingMeetings || 0,
        avgParticipants: avgParticipants[0]?.average || 0
      }
    });
  } catch (error) {
    console.error('❌ Get meeting stats error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch meeting statistics'
    });
  }
};

/**
 * Bulk delete meetings
 * @route POST /api/meetings/bulk-delete
 */
export const bulkDeleteMeetings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { ids } = req.body;
    
    console.log(`📥 POST /api/meetings/bulk-delete`);
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Please provide meeting IDs to delete'
      });
    }
    
    // Validate all IDs
    const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));
    
    if (validIds.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'No valid meeting IDs provided'
      });
    }
    
    // Delete meetings
    const result = await Meeting.deleteMany({
      _id: { $in: validIds },
      createdBy: userId
    });
    
    console.log(`✅ Deleted ${result.deletedCount} meetings`);
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} meetings`,
      data: { deletedCount: result.deletedCount }
    });
  } catch (error) {
    console.error('❌ Bulk delete error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete meetings'
    });
  }
};

/**
 * Update meeting status
 * @route PATCH /api/meetings/:id/status
 */
export const updateMeetingStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { status } = req.body;
    
    console.log(`📥 PATCH /api/meetings/${id}/status`);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid meeting ID'
      });
    }
    
    const validStatuses = ['scheduled', 'live', 'completed', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }
    
    const meeting = await Meeting.findOneAndUpdate(
      { 
        _id: id, 
        createdBy: userId
      },
      { status },
      { new: true }
    );
    
    if (!meeting) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Meeting not found'
      });
    }
    
    console.log('✅ Meeting status updated:', status);
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Meeting status updated successfully',
      data: meeting
    });
  } catch (error) {
    console.error('❌ Update status error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to update meeting status'
    });
  }
};

/**
 * Get available classes for meetings
 * @route GET /api/meetings/available-classes
 */
export const getAvailableClasses = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    
    let classes;
    
    if (userRole === 'admin') {
      // Admin can see all classes
      classes = await Class.find({})
        .select('name className section subject studentCount')
        .sort({ name: 1, section: 1 });
    } else if (userRole === 'teacher') {
      // Teacher can see all classes (for creating meetings) or only their assigned classes
      // For now, let teachers see all classes so they can create meetings for any class
      classes = await Class.find({})
        .select('name className section subject studentCount teacherId')
        .sort({ name: 1, section: 1 });
    } else {
      // Other roles see no classes
      classes = [];
    }
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Classes retrieved successfully',
      data: classes
    });
  } catch (error) {
    console.error('❌ Get available classes error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch classes'
    });
  }
};

/**
 * Get available students for meetings
 * @route GET /api/meetings/available-students
 */
export const getAvailableStudents = async (req, res) => {
  try {
    const { search, class: studentClass } = req.query;
    
    const filter = { status: 'active' };
    
    if (studentClass && studentClass !== 'all') {
      filter.selectClass = studentClass;
    }
    
    if (search) {
      filter.$or = [
        { studentName: { $regex: search, $options: 'i' } },
        { registrationNo: { $regex: search, $options: 'i' } }
      ];
    }
    
    const students = await Student.find(filter)
      .select('studentName registrationNo selectClass section')
      .sort({ studentName: 1 });
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Students retrieved successfully',
      data: students
    });
  } catch (error) {
    console.error('❌ Get available students error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch students'
    });
  }
};

/**
 * Get available teachers for meetings
 * @route GET /api/meetings/available-teachers
 */
export const getAvailableTeachers = async (req, res) => {
  try {
    const { search, role } = req.query;
    
    const filter = { status: 'active' };
    
    if (role && role !== 'all') {
      filter.employeeRole = role;
    }
    
    if (search) {
      filter.$or = [
        { employeeName: { $regex: search, $options: 'i' } },
        { employeeRole: { $regex: search, $options: 'i' } }
      ];
    }
    
    const teachers = await Employee.find(filter)
      .select('employeeName employeeRole department')
      .sort({ employeeName: 1 });
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Teachers retrieved successfully',
      data: teachers
    });
  } catch (error) {
    console.error('❌ Get available teachers error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch teachers'
    });
  }
};