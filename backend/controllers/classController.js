// controllers/classController.js

import mongoose from 'mongoose';
import Class from '../models/Class.js';
import Employee from '../models/Employee.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js';
import { StatusCodes } from 'http-status-codes';

/**
 * Get all classes for current user
 * @route GET /api/classes
 */
export const getAllClasses = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, subject, teacher, search, page = 1, limit = 10 } = req.query;
    
    console.log(`📥 GET /api/classes for user: ${userId}`);
    
    // Build query
    const query = { createdBy: userId };
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (subject) {
      query.subject = { $regex: subject, $options: 'i' };
    }
    
    if (teacher) {
      query.teacher = { $regex: teacher, $options: 'i' };
    }
    
    if (search) {
      query.$or = [
        { className: { $regex: search, $options: 'i' } },
        { section: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { teacher: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [classes, total] = await Promise.all([
      Class.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Class.countDocuments(query)
    ]);
    
    console.log(`✅ Found ${classes.length} classes`);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Classes retrieved successfully',
      count: classes.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: classes
    });
  } catch (error) {
    console.error('❌ Get classes error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch classes'
    });
  }
};

/**
 * Get single class by ID
 * @route GET /api/classes/:id
 */
export const getClassById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    console.log(`📥 GET /api/classes/${id}`);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid class ID'
      });
    }
    
    const classData = await Class.findOne({ _id: id, createdBy: userId });
    
    if (!classData) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Class not found'
      });
    }
    
    console.log('✅ Class found:', classData.className);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Class retrieved successfully',
      data: classData
    });
  } catch (error) {
    console.error('❌ Get class error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch class'
    });
  }
};

/**
 * Create new class
 * @route POST /api/classes
 */
export const createClass = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('📥 POST /api/classes');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    const {
      className,
      section,
      subject,
      teacher,
      teacherId,
      room,
      schedule,
      maxStudents,
      fees,
      description
    } = req.body;

    // Validation
    if (!className) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Class name is required'
      });
    }

    const normalizedSection = section?.trim() || 'N/A';

    // Check for duplicate class (same name + section for this user)
    const existingClass = await Class.findOne({
      createdBy: userId,
      className: className.trim(),
      section: normalizedSection,
      status: { $ne: 'cancelled' }
    });

    if (existingClass) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: `Class "${className}" with section "${normalizedSection}" already exists`
      });
    }

    // Create class object
    const classData = {
      className: className.trim(),
      section: normalizedSection,
      subject: subject?.trim() || 'N/A',
      teacher: teacher?.trim() || 'Not assigned',
      teacherId: teacherId || null,
      room: room?.trim() || 'TBA',
      schedule: {
        type: schedule?.type || 'regular',
        startDate: schedule?.startDate || null,
        endDate: schedule?.endDate || null,
        days: schedule?.days || [],
        startTime: schedule?.startTime || '',
        endTime: schedule?.endTime || ''
      },
      maxStudents: parseInt(maxStudents) || 0,
      fees: {
        type: fees?.type || 'free',
        amount: parseFloat(fees?.amount) || 0,
        currency: fees?.currency || 'USD'
      },
      description: description?.trim() || '',
      createdBy: userId
    };

    if (teacherId) {
      if (!mongoose.Types.ObjectId.isValid(teacherId)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Invalid teacher ID'
        });
      }

      const teacherDoc = await Employee.findById(teacherId).select('employeeName');
      if (!teacherDoc) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Teacher not found'
        });
      }

      classData.teacherId = teacherDoc._id;
      classData.teacher = teacherDoc.employeeName;
    }

    const newClass = await Class.create(classData);
    
    console.log('✅ Class created:', newClass._id);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Class created successfully',
      data: newClass
    });
  } catch (error) {
    console.error('❌ Create class error:', error);
    
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
      message: 'Failed to create class'
    });
  }
};

/**
 * Update class
 * @route PUT /api/classes/:id
 */
export const updateClass = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    console.log(`📥 PUT /api/classes/${id}`);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid class ID'
      });
    }

    const existingClass = await Class.findOne({ _id: id, createdBy: userId });
    
    if (!existingClass) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Class not found'
      });
    }

    const {
      className,
      section,
      subject,
      teacher,
      teacherId,
      room,
      schedule,
      maxStudents,
      fees,
      description,
      status
    } = req.body;

    // Check for duplicate if name or section changed
    if (className || section) {
      const newClassName = className?.trim() || existingClass.className;
      const newSection = section?.trim() || existingClass.section;
      
      const duplicate = await Class.findOne({
        createdBy: userId,
        className: newClassName,
        section: newSection,
        _id: { $ne: id },
        status: { $ne: 'cancelled' }
      });

      if (duplicate) {
        return res.status(StatusCodes.CONFLICT).json({
          success: false,
          message: `Class "${newClassName}" with section "${newSection}" already exists`
        });
      }
    }

    // Update fields
    if (className) existingClass.className = className.trim();
    if (section) existingClass.section = section.trim();
    if (subject) existingClass.subject = subject.trim();
    if (teacher !== undefined) existingClass.teacher = teacher.trim() || 'Not assigned';
    if (teacherId !== undefined) {
      if (teacherId === null || teacherId === '') {
        existingClass.teacherId = null;
      } else {
        if (!mongoose.Types.ObjectId.isValid(teacherId)) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Invalid teacher ID'
          });
        }

        const teacherDoc = await Employee.findById(teacherId).select('employeeName');
        if (!teacherDoc) {
          return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: 'Teacher not found'
          });
        }

        existingClass.teacherId = teacherDoc._id;
        existingClass.teacher = teacherDoc.employeeName;
      }
    }
    if (room !== undefined) existingClass.room = room.trim() || 'TBA';
    if (maxStudents !== undefined) existingClass.maxStudents = parseInt(maxStudents) || 0;
    if (description !== undefined) existingClass.description = description.trim();
    if (status) existingClass.status = status;
    
    if (schedule) {
      existingClass.schedule = {
        type: schedule.type || existingClass.schedule.type,
        startDate: schedule.startDate || existingClass.schedule.startDate,
        endDate: schedule.endDate || existingClass.schedule.endDate,
        days: schedule.days || existingClass.schedule.days,
        startTime: schedule.startTime || existingClass.schedule.startTime,
        endTime: schedule.endTime || existingClass.schedule.endTime
      };
    }
    
    if (fees) {
      existingClass.fees = {
        type: fees.type || existingClass.fees.type,
        amount: parseFloat(fees.amount) || existingClass.fees.amount,
        currency: fees.currency || existingClass.fees.currency
      };
    }

    await existingClass.save();
    
    console.log('✅ Class updated:', existingClass._id);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Class updated successfully',
      data: existingClass
    });
  } catch (error) {
    console.error('❌ Update class error:', error);
    
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
      message: 'Failed to update class'
    });
  }
};

/**
 * Delete class
 * @route DELETE /api/classes/:id
 */
export const deleteClass = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    console.log(`📥 DELETE /api/classes/${id}`);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid class ID'
      });
    }

    const classData = await Class.findOne({ _id: id, createdBy: userId });
    
    if (!classData) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Class not found'
      });
    }

    // Delete all materials from Cloudinary
    if (classData.materials && classData.materials.length > 0) {
      for (const material of classData.materials) {
        if (material.publicId) {
          await deleteFromCloudinary(material.publicId);
        }
      }
    }

    await Class.findByIdAndDelete(id);
    
    console.log('✅ Class deleted:', id);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Class deleted successfully',
      data: { id }
    });
  } catch (error) {
    console.error('❌ Delete class error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete class'
    });
  }
};

/**
 * Upload class material
 * @route POST /api/classes/:id/materials
 */
export const uploadMaterial = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    console.log(`📥 POST /api/classes/${id}/materials`);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid class ID'
      });
    }

    if (!req.file) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const classData = await Class.findOne({ _id: id, createdBy: userId });
    
    if (!classData) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Class not found'
      });
    }

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(req.file.buffer, `class-materials/${id}`);

    // Add material to class
    const material = {
      fileName: req.file.originalname,
      originalName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      fileUrl: uploadResult.url,
      publicId: uploadResult.publicId,
      uploadedAt: new Date()
    };

    classData.materials.push(material);
    await classData.save();
    
    console.log('✅ Material uploaded:', material.fileName);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Material uploaded successfully',
      data: material
    });
  } catch (error) {
    console.error('❌ Upload material error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || 'Failed to upload material'
    });
  }
};

/**
 * Delete class material
 * @route DELETE /api/classes/:id/materials/:materialId
 */
export const deleteMaterial = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id, materialId } = req.params;
    
    console.log(`📥 DELETE /api/classes/${id}/materials/${materialId}`);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid class ID'
      });
    }

    const classData = await Class.findOne({ _id: id, createdBy: userId });
    
    if (!classData) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Class not found'
      });
    }

    const materialIndex = classData.materials.findIndex(
      m => m._id.toString() === materialId
    );

    if (materialIndex === -1) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Material not found'
      });
    }

    const material = classData.materials[materialIndex];

    // Delete from Cloudinary
    if (material.publicId) {
      await deleteFromCloudinary(material.publicId);
    }

    // Remove from array
    classData.materials.splice(materialIndex, 1);
    await classData.save();
    
    console.log('✅ Material deleted:', materialId);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Material deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete material error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete material'
    });
  }
};

/**
 * Get class statistics
 * @route GET /api/classes/stats/summary
 */
export const getClassStats = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(`📥 GET /api/classes/stats/summary for user: ${userId}`);
    
    const stats = await Class.getStatsByAdmin(userId);
    
    // Get subject distribution
    const subjectDistribution = await Class.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$subject',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Get schedule type distribution
    const scheduleDistribution = await Class.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$schedule.type',
          count: { $sum: 1 }
        }
      }
    ]);

    console.log('✅ Class stats retrieved');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Class statistics retrieved successfully',
      data: {
        ...stats,
        subjectDistribution,
        scheduleDistribution
      }
    });
  } catch (error) {
    console.error('❌ Get class stats error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch class statistics'
    });
  }
};

/**
 * Bulk delete classes
 * @route POST /api/classes/bulk-delete
 */
export const bulkDeleteClasses = async (req, res) => {
  try {
    const userId = req.user.id;
    const { ids } = req.body;
    
    console.log(`📥 POST /api/classes/bulk-delete`);
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Please provide class IDs to delete'
      });
    }

    // Validate all IDs
    const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));
    
    if (validIds.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'No valid class IDs provided'
      });
    }

    // Get classes to delete materials
    const classesToDelete = await Class.find({
      _id: { $in: validIds },
      createdBy: userId
    });

    // Delete materials from Cloudinary
    for (const classData of classesToDelete) {
      if (classData.materials && classData.materials.length > 0) {
        for (const material of classData.materials) {
          if (material.publicId) {
            await deleteFromCloudinary(material.publicId);
          }
        }
      }
    }

    // Delete classes
    const result = await Class.deleteMany({
      _id: { $in: validIds },
      createdBy: userId
    });
    
    console.log(`✅ Deleted ${result.deletedCount} classes`);

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} classes`,
      data: { deletedCount: result.deletedCount }
    });
  } catch (error) {
    console.error('❌ Bulk delete error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete classes'
    });
  }
};

/**
 * Get all class names for current user
 * @route GET /api/classes/names
 */
export const getAllClassNames = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(`📥 GET /api/classes/names for user: ${userId}`);

    // Get all classes for the user
    const classes = await Class.find({ createdBy: userId }, 'className').sort({ className: 1 });

    // Extract unique class names (combining className and section if needed)
    const classNames = classes.map(classObj => classObj.className);

    // Remove duplicates if any
    const uniqueClassNames = [...new Set(classNames)];

    console.log(`✅ Found ${uniqueClassNames.length} unique class names`);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Class names retrieved successfully',
      data: uniqueClassNames
    });
  } catch (error) {
    console.error('❌ Get class names error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch class names'
    });
  }
};

/**
 * Update class status
 * @route PATCH /api/classes/:id/status
 */
export const updateClassStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { status } = req.body;

    console.log(`📥 PATCH /api/classes/${id}/status`);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid class ID'
      });
    }

    const validStatuses = ['active', 'inactive', 'completed', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const classData = await Class.findOneAndUpdate(
      { _id: id, createdBy: userId },
      { status },
      { new: true }
    );

    if (!classData) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Class not found'
      });
    }

    console.log('✅ Class status updated:', status);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Class status updated successfully',
      data: classData
    });
  } catch (error) {
    console.error('❌ Update status error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to update class status'
    });
  }
};