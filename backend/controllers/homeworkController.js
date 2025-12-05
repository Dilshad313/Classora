import mongoose from 'mongoose';
import Homework from '../models/Homework.js';
import Class from '../models/Class.js';
import Employee from '../models/Employee.js';
import Subject from '../models/Subject.js';
import SubjectAssignment from '../models/SubjectAssignment.js';
import { StatusCodes } from 'http-status-codes';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js';

/**
 * Get all homeworks with filtering
 * @route GET /api/homework
 */
export const getHomeworks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      date, 
      class: classId, 
      teacher, 
      subject,
      status,
      search,
      page = 1, 
      limit = 10 
    } = req.query;

    console.log(`📥 GET /api/homework for user: ${userId}`);

    // Build query
    const query = { createdBy: userId };

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }

    if (classId && mongoose.Types.ObjectId.isValid(classId)) {
      query.class = classId;
    }

    if (teacher && mongoose.Types.ObjectId.isValid(teacher)) {
      query.teacher = teacher;
    }

    if (subject && mongoose.Types.ObjectId.isValid(subject)) {
      query.subject = subject;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { details: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [homeworks, total] = await Promise.all([
      Homework.find(query)
        .populate('class', 'className section')
        .populate('teacher', 'employeeName')
        .populate('subject', 'name code')
        .sort({ date: -1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Homework.countDocuments(query)
    ]);

    console.log(`✅ Found ${homeworks.length} homeworks`);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Homeworks retrieved successfully',
      count: homeworks.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: homeworks
    });
  } catch (error) {
    console.error('❌ Get homeworks error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch homeworks'
    });
  }
};

/**
 * Get single homework by ID
 * @route GET /api/homework/:id
 */
export const getHomeworkById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    console.log(`📥 GET /api/homework/${id}`);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid homework ID'
      });
    }

    const homework = await Homework.findOne({ _id: id, createdBy: userId })
      .populate('class', 'className section')
      .populate('teacher', 'employeeName emailAddress mobileNo')
      .populate('subject', 'name code');

    if (!homework) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Homework not found'
      });
    }

    console.log('✅ Homework found:', homework._id);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Homework retrieved successfully',
      data: homework
    });
  } catch (error) {
    console.error('❌ Get homework error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch homework'
    });
  }
};

/**
 * Create new homework
 * @route POST /api/homework
 */
export const createHomework = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('📥 POST /api/homework');
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    const {
      title,
      date,
      dueDate,
      class: classId,
      section = 'A',
      subject,
      teacher,
      details,
      priority = 'medium',
      status = 'active'
    } = req.body;

    // Validation
    if (!date || !classId || !subject || !teacher || !details) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Date, class, subject, teacher, and details are required'
      });
    }

    // Verify class exists
    const classExists = await Class.findOne({ _id: classId, createdBy: userId });
    if (!classExists) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Class not found'
      });
    }

    // Verify teacher exists
    const teacherExists = await Employee.findOne({ _id: teacher });
    if (!teacherExists) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    // Verify subject exists in the class assignment
    const assignment = await SubjectAssignment.findOne({ 
      classId, 
      createdBy: userId 
    });
    
    if (!assignment) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'No subjects assigned to this class yet. Please assign subjects first.'
      });
    }
    
    const subjectExists = assignment.subjects.some(s => s._id.toString() === subject);
    if (!subjectExists) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Subject not found in this class'
      });
    }

    // Create homework
    const homeworkData = {
      title: title?.trim() || `Homework - ${new Date(date).toLocaleDateString()}`,
      date: new Date(date),
      dueDate: dueDate ? new Date(dueDate) : null,
      class: classId,
      section: section,
      subject: subject,
      teacher: teacher,
      details: details.trim(),
      priority: priority,
      status: status,
      createdBy: userId
    };

    const homework = await Homework.create(homeworkData);

    console.log('✅ Homework created:', homework._id);

    // Populate the response
    const populatedHomework = await Homework.findById(homework._id)
      .populate('class', 'className section')
      .populate('teacher', 'employeeName')
      .populate('subject', 'name');

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Homework created successfully',
      data: populatedHomework
    });
  } catch (error) {
    console.error('❌ Create homework error:', error);
    
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
      message: 'Failed to create homework'
    });
  }
};

/**
 * Update homework
 * @route PUT /api/homework/:id
 */
export const updateHomework = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    console.log(`📥 PUT /api/homework/${id}`);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid homework ID'
      });
    }

    const homework = await Homework.findOne({ _id: id, createdBy: userId });
    
    if (!homework) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Homework not found'
      });
    }

    const {
      title,
      date,
      dueDate,
      class: classId,
      section,
      subject,
      teacher,
      details,
      priority,
      status
    } = req.body;

    // Update fields
    if (title !== undefined) homework.title = title.trim();
    if (date) homework.date = new Date(date);
    if (dueDate !== undefined) homework.dueDate = dueDate ? new Date(dueDate) : null;
    if (section) homework.section = section;
    if (details) homework.details = details.trim();
    if (priority) homework.priority = priority;
    if (status) homework.status = status;

    // Update references if provided
    if (classId) {
      const classExists = await Class.findOne({ _id: classId, createdBy: userId });
      if (!classExists) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Class not found'
        });
      }
      homework.class = classId;
    }

    if (subject) {
      const currentClassId = classId || homework.class;
      const assignment = await SubjectAssignment.findOne({ 
        classId: currentClassId, 
        createdBy: userId 
      });
      
      if (assignment) {
        const subjectExists = assignment.subjects.some(s => s._id.toString() === subject);
        if (!subjectExists) {
          return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: 'Subject not found in this class'
          });
        }
        homework.subject = subject;
      }
    }

    if (teacher) {
      const teacherExists = await Employee.findOne({ _id: teacher });
      if (!teacherExists) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Teacher not found'
        });
      }
      homework.teacher = teacher;
    }

    await homework.save();

    console.log('✅ Homework updated:', homework._id);

    // Populate the response
    const populatedHomework = await Homework.findById(homework._id)
      .populate('class', 'className section')
      .populate('teacher', 'employeeName')
      .populate('subject', 'name');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Homework updated successfully',
      data: populatedHomework
    });
  } catch (error) {
    console.error('❌ Update homework error:', error);
    
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
      message: 'Failed to update homework'
    });
  }
};

/**
 * Delete homework
 * @route DELETE /api/homework/:id
 */
export const deleteHomework = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    console.log(`📥 DELETE /api/homework/${id}`);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid homework ID'
      });
    }

    const homework = await Homework.findOne({ _id: id, createdBy: userId });
    
    if (!homework) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Homework not found'
      });
    }

    // Delete attachments from Cloudinary if exists
    if (homework.attachments && homework.attachments.length > 0) {
      for (const attachment of homework.attachments) {
        if (attachment.publicId) {
          await deleteFromCloudinary(attachment.publicId);
        }
      }
    }

    await Homework.findByIdAndDelete(id);

    console.log('✅ Homework deleted:', id);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Homework deleted successfully',
      data: { id }
    });
  } catch (error) {
    console.error('❌ Delete homework error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete homework'
    });
  }
};

/**
 * Bulk delete homeworks
 * @route POST /api/homework/bulk-delete
 */
export const bulkDeleteHomeworks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { ids } = req.body;

    console.log(`📥 POST /api/homework/bulk-delete`);

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Please provide homework IDs to delete'
      });
    }

    // Validate all IDs
    const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));
    
    if (validIds.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'No valid homework IDs provided'
      });
    }

    // Get homeworks to delete attachments
    const homeworksToDelete = await Homework.find({
      _id: { $in: validIds },
      createdBy: userId
    });

    // Delete attachments from Cloudinary
    for (const homework of homeworksToDelete) {
      if (homework.attachments && homework.attachments.length > 0) {
        for (const attachment of homework.attachments) {
          if (attachment.publicId) {
            await deleteFromCloudinary(attachment.publicId);
          }
        }
      }
    }

    // Delete homeworks
    const result = await Homework.deleteMany({
      _id: { $in: validIds },
      createdBy: userId
    });

    console.log(`✅ Deleted ${result.deletedCount} homeworks`);

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} homeworks`,
      data: { deletedCount: result.deletedCount }
    });
  } catch (error) {
    console.error('❌ Bulk delete homeworks error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete homeworks'
    });
  }
};

/**
 * Upload homework attachment
 * @route POST /api/homework/:id/attachments
 */
export const uploadAttachment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    console.log(`📥 POST /api/homework/${id}/attachments`);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid homework ID'
      });
    }

    if (!req.file) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const homework = await Homework.findOne({ _id: id, createdBy: userId });
    
    if (!homework) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Homework not found'
      });
    }

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(
      req.file.buffer, 
      `homework-attachments/${id}`
    );

    // Add attachment to homework
    const attachment = {
      fileName: req.file.originalname,
      fileUrl: uploadResult.url,
      publicId: uploadResult.publicId,
      fileType: req.file.mimetype,
      fileSize: req.file.size
    };

    homework.attachments.push(attachment);
    await homework.save();

    console.log('✅ Attachment uploaded:', attachment.fileName);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Attachment uploaded successfully',
      data: attachment
    });
  } catch (error) {
    console.error('❌ Upload attachment error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || 'Failed to upload attachment'
    });
  }
};

/**
 * Delete homework attachment
 * @route DELETE /api/homework/:id/attachments/:attachmentId
 */
export const deleteAttachment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id, attachmentId } = req.params;

    console.log(`📥 DELETE /api/homework/${id}/attachments/${attachmentId}`);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid homework ID'
      });
    }

    const homework = await Homework.findOne({ _id: id, createdBy: userId });
    
    if (!homework) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Homework not found'
      });
    }

    const attachmentIndex = homework.attachments.findIndex(
      a => a._id.toString() === attachmentId
    );

    if (attachmentIndex === -1) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Attachment not found'
      });
    }

    const attachment = homework.attachments[attachmentIndex];

    // Delete from Cloudinary
    if (attachment.publicId) {
      await deleteFromCloudinary(attachment.publicId);
    }

    // Remove from array
    homework.attachments.splice(attachmentIndex, 1);
    await homework.save();

    console.log('✅ Attachment deleted:', attachmentId);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Attachment deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete attachment error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete attachment'
    });
  }
};

/**
 * Get homework statistics
 * @route GET /api/homework/stats/summary
 */
export const getHomeworkStats = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(`📥 GET /api/homework/stats/summary for user: ${userId}`);

    // Total homeworks
    const totalHomeworks = await Homework.countDocuments({ createdBy: userId });

    // Active homeworks
    const activeHomeworks = await Homework.countDocuments({ 
      createdBy: userId, 
      status: 'active' 
    });

    // Homeworks by priority
    const priorityStats = await Homework.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    // Recent homeworks (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentHomeworks = await Homework.countDocuments({
      createdBy: userId,
      createdAt: { $gte: sevenDaysAgo }
    });

    console.log('✅ Homework stats retrieved');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Homework statistics retrieved successfully',
      data: {
        total: totalHomeworks,
        active: activeHomeworks,
        completed: totalHomeworks - activeHomeworks,
        priorityStats,
        recentHomeworks
      }
    });
  } catch (error) {
    console.error('❌ Get homework stats error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch homework statistics'
    });
  }
};

/**
 * Get available dropdown data
 * @route GET /api/homework/dropdown-data
 */
export const getDropdownData = async (req, res) => {
  try {
    const userId = req.user.id;
    const { classId } = req.query;
    console.log(`📥 GET /api/homework/dropdown-data for user: ${userId}, classId: ${classId}`);

    // Get classes
    const classes = await Class.find({ createdBy: userId })
      .select('className section')
      .sort({ className: 1, section: 1 });

    // Get teachers (employees with teacher role)
    const teachers = await Employee.find({ 
      employeeRole: { $regex: /teacher/i },
      status: 'active'
    }).select('employeeName emailAddress mobileNo')
      .sort({ employeeName: 1 });

    // Get subjects based on class if classId is provided
    let subjects = [];
    if (classId && mongoose.Types.ObjectId.isValid(classId)) {
      // Get subjects assigned to this specific class
      const SubjectAssignment = mongoose.model('SubjectAssignment');
      const assignment = await SubjectAssignment.findOne({ 
        classId, 
        createdBy: userId 
      });
      
      if (assignment && assignment.subjects) {
        subjects = assignment.subjects.map(sub => ({
          _id: sub._id,
          name: sub.subjectName,
          code: sub.subjectName.toUpperCase().replace(/\s+/g, ''),
          totalMarks: sub.totalMarks
        }));
      }
    } else {
      // Get all unique subjects from all assignments
      const SubjectAssignment = mongoose.model('SubjectAssignment');
      const assignments = await SubjectAssignment.find({ createdBy: userId });
      
      const subjectsSet = new Set();
      const subjectsArray = [];
      
      assignments.forEach(assignment => {
        assignment.subjects.forEach(subject => {
          const subjectKey = subject.subjectName.toLowerCase();
          if (!subjectsSet.has(subjectKey)) {
            subjectsSet.add(subjectKey);
            subjectsArray.push({
              _id: subject._id,
              name: subject.subjectName,
              code: subject.subjectName.toUpperCase().replace(/\s+/g, ''),
              totalMarks: subject.totalMarks
            });
          }
        });
      });
      
      subjects = subjectsArray;
    }

    console.log(`✅ Dropdown data retrieved: ${classes.length} classes, ${teachers.length} teachers, ${subjects.length} subjects`);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Dropdown data retrieved successfully',
      data: {
        classes,
        teachers,
        subjects
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