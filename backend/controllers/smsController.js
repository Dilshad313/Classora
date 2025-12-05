import mongoose from 'mongoose';
import SMS from '../models/SMS.js';
import Student from '../models/Student.js';
import Employee from '../models/Employee.js';
import Class from '../models/Class.js';
import { StatusCodes } from 'http-status-codes';

/**
 * Get SMS statistics
 * @route GET /api/sms/stats
 */
export const getSMSStats = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(`📊 GET /api/sms/stats for user: ${userId}`);
    
    const stats = await SMS.getStatsByAdmin(userId);
    
    // Get recent SMS history
    const recentHistory = await SMS.getRecentHistory(userId, 5);
    
    // Get counts for quick stats
    const [totalStudents, totalEmployees] = await Promise.all([
      Student.countDocuments(),
      Employee.countDocuments()
    ]);
    
    console.log('✅ SMS stats retrieved');
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'SMS statistics retrieved successfully',
      data: {
        ...stats,
        recentHistory,
        totalStudents,
        totalEmployees
      }
    });
  } catch (error) {
    console.error('❌ Get SMS stats error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch SMS statistics'
    });
  }
};

/**
 * Get SMS history with pagination
 * @route GET /api/sms/history
 */
export const getSMSHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      page = 1, 
      limit = 10,
      recipientType,
      startDate,
      endDate,
      status
    } = req.query;
    
    console.log(`📜 GET /api/sms/history for user: ${userId}`);
    
    // Build query
    const query = { createdBy: userId };
    
    if (recipientType && recipientType !== 'all') {
      query.recipientType = recipientType;
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (startDate || endDate) {
      query.sentAt = {};
      if (startDate) query.sentAt.$gte = new Date(startDate);
      if (endDate) query.sentAt.$lte = new Date(endDate);
    }
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [history, total] = await Promise.all([
      SMS.find(query)
        .sort({ sentAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      SMS.countDocuments(query)
    ]);
    
    console.log(`✅ Found ${history.length} SMS records`);
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'SMS history retrieved successfully',
      count: history.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: history
    });
  } catch (error) {
    console.error('❌ Get SMS history error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch SMS history'
    });
  }
};

/**
 * Get classes for SMS selection
 * @route GET /api/sms/classes
 */
export const getClassesForSMS = async (req, res) => {
  try {
    const userId = req.user.id;
    
    console.log(`🏫 GET /api/sms/classes for user: ${userId}`);
    
    const classes = await Class.find({ createdBy: userId })
      .select('className section studentCount')
      .sort({ className: 1, section: 1 });
    
    // Format classes for dropdown
    const formattedClasses = classes.map(cls => ({
      id: cls._id,
      name: `${cls.className} - ${cls.section}`,
      studentCount: cls.studentCount || 0
    }));
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Classes retrieved successfully',
      data: formattedClasses
    });
  } catch (error) {
    console.error('❌ Get classes for SMS error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch classes'
    });
  }
};

/**
 * Get students for SMS selection
 * @route GET /api/sms/students
 */
export const getStudentsForSMS = async (req, res) => {
  try {
    const { search, classId } = req.query;
    
    console.log(`👨‍🎓 GET /api/sms/students`);
    
    // Build query
    const query = { status: 'active' };
    
    if (search) {
      query.$or = [
        { studentName: { $regex: search, $options: 'i' } },
        { registrationNo: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (classId && classId !== 'all') {
      query.selectClass = classId;
    }
    
    const students = await Student.find(query)
      .select('studentName selectClass section mobileNo')
      .sort({ studentName: 1 });
    
    // Format students for dropdown
    const formattedStudents = students.map(student => ({
      id: student._id,
      name: student.studentName,
      class: `Grade ${student.selectClass} - ${student.section}`,
      phone: student.mobileNo || 'Not available'
    }));
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Students retrieved successfully',
      data: formattedStudents
    });
  } catch (error) {
    console.error('❌ Get students for SMS error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch students'
    });
  }
};

/**
 * Get employees for SMS selection
 * @route GET /api/sms/employees
 */
export const getEmployeesForSMS = async (req, res) => {
  try {
    const { search, role } = req.query;
    
    console.log(`👩‍🏫 GET /api/sms/employees`);
    
    // Build query
    const query = { status: 'active' };
    
    if (search) {
      query.$or = [
        { employeeName: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role && role !== 'all') {
      query.employeeRole = role;
    }
    
    const employees = await Employee.find(query)
      .select('employeeName employeeRole mobileNo')
      .sort({ employeeName: 1 });
    
    // Format employees for dropdown
    const formattedEmployees = employees.map(employee => ({
      id: employee._id,
      name: employee.employeeName,
      role: employee.employeeRole,
      phone: employee.mobileNo || 'Not available'
    }));
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Employees retrieved successfully',
      data: formattedEmployees
    });
  } catch (error) {
    console.error('❌ Get employees for SMS error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch employees'
    });
  }
};

/**
 * Send SMS to recipients
 * @route POST /api/sms/send
 */
export const sendSMS = async (req, res) => {
  try {
    const userId = req.user.id;
    const { recipientType, recipientId, message } = req.body;
    
    console.log(`📱 POST /api/sms/send`);
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    // Validate required fields
    if (!recipientType || !message) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Recipient type and message are required'
      });
    }
    
    // Validate message length
    if (message.length > 160) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Message cannot exceed 160 characters'
      });
    }
    
    let recipients = [];
    let recipientName = '';
    let recipientCount = 0;
    let studentIds = [];
    let employeeIds = [];
    
    // Get recipients based on type
    switch (recipientType) {
      case 'allStudents':
        const allStudents = await Student.find({ status: 'active' }).select('_id mobileNo');
        recipients = allStudents.filter(s => s.mobileNo).map(s => s.mobileNo);
        studentIds = allStudents.map(s => s._id);
        recipientName = 'All Students';
        recipientCount = recipients.length;
        break;
        
      case 'allEmployees':
        const allEmployees = await Employee.find({ status: 'active' }).select('_id mobileNo');
        recipients = allEmployees.filter(e => e.mobileNo).map(e => e.mobileNo);
        employeeIds = allEmployees.map(e => e._id);
        recipientName = 'All Employees';
        recipientCount = recipients.length;
        break;
        
      case 'specificClass':
        if (!recipientId) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Class ID is required for specific class'
          });
        }
        
        if (!mongoose.Types.ObjectId.isValid(recipientId)) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Invalid class ID'
          });
        }
        
        const classData = await Class.findById(recipientId);
        if (!classData) {
          return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: 'Class not found'
          });
        }
        
        // Get students in this class
        const classStudents = await Student.find({
          selectClass: classData.className.slice(-2).trim(), // Extract class number from "Grade X"
          status: 'active'
        }).select('_id mobileNo');
        
        recipients = classStudents.filter(s => s.mobileNo).map(s => s.mobileNo);
        studentIds = classStudents.map(s => s._id);
        recipientName = `${classData.className} - ${classData.section}`;
        recipientCount = recipients.length;
        break;
        
      case 'specificStudent':
        if (!recipientId) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Student ID is required for specific student'
          });
        }
        
        if (!mongoose.Types.ObjectId.isValid(recipientId)) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Invalid student ID'
          });
        }
        
        const student = await Student.findById(recipientId);
        if (!student) {
          return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: 'Student not found'
          });
        }
        
        if (!student.mobileNo) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Student does not have a mobile number'
          });
        }
        
        recipients = [student.mobileNo];
        studentIds = [student._id];
        recipientName = student.studentName;
        recipientCount = 1;
        break;
        
      case 'specificEmployee':
        if (!recipientId) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Employee ID is required for specific employee'
          });
        }
        
        if (!mongoose.Types.ObjectId.isValid(recipientId)) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Invalid employee ID'
          });
        }
        
        const employee = await Employee.findById(recipientId);
        if (!employee) {
          return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: 'Employee not found'
          });
        }
        
        if (!employee.mobileNo) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Employee does not have a mobile number'
          });
        }
        
        recipients = [employee.mobileNo];
        employeeIds = [employee._id];
        recipientName = employee.employeeName;
        recipientCount = 1;
        break;
        
      default:
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Invalid recipient type'
        });
    }
    
    // Check if there are recipients with phone numbers
    if (recipients.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'No recipients with valid phone numbers found'
      });
    }
    
    // For demo purposes - In production, you would integrate with an SMS gateway here
    // Example: Twilio, Nexmo, etc.
    console.log(`📤 SMS to be sent to ${recipients.length} recipients:`);
    console.log(`📝 Message: ${message}`);
    console.log(`📱 Recipients: ${recipients.slice(0, 5).join(', ')}${recipients.length > 5 ? '...' : ''}`);
    
    // Simulate SMS sending
    const smsSent = true; // In production, this would be the result from SMS gateway
    
    // Save SMS record to database
    const smsRecord = await SMS.create({
      recipientType,
      recipientId: recipientId || null,
      recipientName,
      message,
      characterCount: message.length,
      recipientCount: recipients.length,
      status: smsSent ? 'sent' : 'failed',
      createdBy: userId,
      studentIds: studentIds.length > 0 ? studentIds : undefined,
      employeeIds: employeeIds.length > 0 ? employeeIds : undefined
    });
    
    console.log('✅ SMS record saved:', smsRecord._id);
    
    // Return response
    res.status(StatusCodes.OK).json({
      success: true,
      message: `SMS sent successfully to ${recipients.length} recipient(s)`,
      data: {
        smsId: smsRecord._id,
        recipientCount: recipients.length,
        characterCount: message.length,
        recipientName,
        status: smsSent ? 'sent' : 'failed',
        sentAt: smsRecord.sentAt
      }
    });
    
  } catch (error) {
    console.error('❌ Send SMS error:', error);
    
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
      message: 'Failed to send SMS'
    });
  }
};

/**
 * Get SMS details by ID
 * @route GET /api/sms/:id
 */
export const getSMSById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    console.log(`📄 GET /api/sms/${id}`);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid SMS ID'
      });
    }
    
    const sms = await SMS.findOne({ _id: id, createdBy: userId });
    
    if (!sms) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'SMS record not found'
      });
    }
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'SMS details retrieved successfully',
      data: sms
    });
  } catch (error) {
    console.error('❌ Get SMS by ID error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch SMS details'
    });
  }
};

/**
 * Bulk delete SMS records
 * @route POST /api/sms/bulk-delete
 */
export const bulkDeleteSMS = async (req, res) => {
  try {
    const userId = req.user.id;
    const { ids } = req.body;
    
    console.log(`🗑️ POST /api/sms/bulk-delete`);
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Please provide SMS IDs to delete'
      });
    }
    
    // Validate all IDs
    const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));
    
    if (validIds.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'No valid SMS IDs provided'
      });
    }
    
    // Delete SMS records
    const result = await SMS.deleteMany({
      _id: { $in: validIds },
      createdBy: userId
    });
    
    console.log(`✅ Deleted ${result.deletedCount} SMS records`);
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} SMS records`,
      data: { deletedCount: result.deletedCount }
    });
  } catch (error) {
    console.error('❌ Bulk delete SMS error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete SMS records'
    });
  }
};