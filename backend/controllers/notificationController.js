import mongoose from 'mongoose';
import Notification from '../models/Notification.js';
import Student from '../models/Student.js';
import Employee from '../models/Employee.js';
import Class from '../models/Class.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js';
import { StatusCodes } from 'http-status-codes';
import { 
  getAvailableTemplates, 
  getTemplate, 
  createNotificationFromTemplate,
  validateTemplateVariables 
} from '../utils/notificationTemplates.js';

/**
 * Get all notifications with filtering and pagination
 * @route GET /api/notifications
 */
export const getAllNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      page = 1,
      limit = 20,
      status,
      category,
      priority,
      targetType,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    console.log(`📥 GET /api/notifications for user: ${userId}`);

    // Build query
    const query = { createdBy: userId };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    if (targetType && targetType !== 'all') {
      query.targetType = targetType;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
        { senderName: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Add secondary sort by isPinned and createdAt
    if (sortBy !== 'isPinned') {
      sort.isPinned = -1;
    }
    if (sortBy !== 'createdAt') {
      sort.createdAt = -1;
    }

    // Execute query with pagination
    const [notifications, total] = await Promise.all([
      Notification.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('sender', 'name email')
        .lean(),
      Notification.countDocuments(query)
    ]);

    // Add computed fields
    const notificationsWithExtras = notifications.map(notification => ({
      ...notification,
      readPercentage: notification.totalRecipients > 0 
        ? Math.round((notification.readCount / notification.totalRecipients) * 100) 
        : 0,
      deliveryPercentage: notification.totalRecipients > 0 
        ? Math.round((notification.deliveredCount / notification.totalRecipients) * 100) 
        : 0,
      timeAgo: getTimeAgo(notification.createdAt)
    }));

    console.log(`✅ Found ${notifications.length} notifications`);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Notifications retrieved successfully',
      data: {
        notifications: notificationsWithExtras,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('❌ Get notifications error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch notifications'
    });
  }
};

/**
 * Get single notification by ID
 * @route GET /api/notifications/:id
 */
export const getNotificationById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    console.log(`📥 GET /api/notifications/${id}`);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid notification ID'
      });
    }

    const notification = await Notification.findOne({
      _id: id,
      createdBy: userId
    })
    .populate('sender', 'name email')
    .populate('specificUsers.user', 'studentName employeeName')
    .populate({
      path: 'readBy.user',
      select: 'studentName employeeName name'
    })
    .populate({
      path: 'comments.user',
      select: 'studentName employeeName name'
    });

    if (!notification) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Notification not found'
      });
    }

    console.log('✅ Notification retrieved successfully');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Notification retrieved successfully',
      data: notification
    });
  } catch (error) {
    console.error('❌ Get notification error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch notification'
    });
  }
};

/**
 * Create new notification
 * @route POST /api/notifications
 */
export const createNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const userName = req.user.name || 'Admin';

    console.log('📥 POST /api/notifications');

    const {
      title,
      message,
      type = 'info',
      priority = 'medium',
      category = 'general',
      targetType,
      targetClass,
      targetSection = 'A',
      specificUsers = [],
      scheduleType = 'immediate',
      scheduledAt,
      expiresAt,
      actionButton,
      isPinned = false,
      allowComments = false
    } = req.body;

    // Validation
    if (!title || !message || !targetType) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Title, message, and target type are required'
      });
    }

    // Validate scheduled notification
    if (scheduleType === 'scheduled') {
      if (!scheduledAt) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Scheduled time is required for scheduled notifications'
        });
      }
      
      if (new Date(scheduledAt) <= new Date()) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Scheduled time must be in the future'
        });
      }
    }

    // Handle file attachments
    let attachments = [];
    if (req.files && req.files.attachments) {
      const files = Array.isArray(req.files.attachments) 
        ? req.files.attachments 
        : [req.files.attachments];

      for (const file of files) {
        try {
          const uploadResult = await uploadToCloudinary(
            file.buffer,
            'notification-attachments'
          );

          attachments.push({
            name: file.originalname,
            url: uploadResult.url,
            publicId: uploadResult.publicId,
            fileType: file.mimetype,
            fileSize: file.size
          });
        } catch (uploadError) {
          console.error('Attachment upload error:', uploadError);
        }
      }
    }

    // Calculate recipients count
    let totalRecipients = 0;
    let recipients = [];

    if (targetType === 'all') {
      const [studentCount, employeeCount] = await Promise.all([
        Student.countDocuments({ status: 'active' }),
        Employee.countDocuments({ status: 'active' })
      ]);
      totalRecipients = studentCount + employeeCount;
    } else if (targetType === 'students') {
      totalRecipients = await Student.countDocuments({ status: 'active' });
    } else if (targetType === 'employees') {
      totalRecipients = await Employee.countDocuments({ status: 'active' });
    } else if (targetType === 'teachers') {
      totalRecipients = await Employee.countDocuments({ 
        status: 'active',
        employeeRole: { $regex: 'teacher', $options: 'i' }
      });
    } else if (targetType === 'staff') {
      totalRecipients = await Employee.countDocuments({ 
        status: 'active',
        employeeRole: { $not: { $regex: 'teacher', $options: 'i' } }
      });
    } else if (targetType === 'specific_class') {
      if (!targetClass) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Target class is required for class-specific notifications'
        });
      }
      
      totalRecipients = await Student.countDocuments({
        selectClass: targetClass,
        section: targetSection,
        status: 'active'
      });
    } else if (targetType === 'specific_users') {
      totalRecipients = specificUsers.length;
    }

    // Create notification
    const notificationData = {
      title: title.trim(),
      message: message.trim(),
      type,
      priority,
      category,
      sender: userId,
      senderName: userName,
      targetType,
      targetClass,
      targetSection,
      specificUsers,
      scheduleType,
      scheduledAt: scheduleType === 'scheduled' ? new Date(scheduledAt) : null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      attachments,
      actionButton,
      isPinned,
      allowComments,
      totalRecipients,
      status: scheduleType === 'immediate' ? 'sent' : 'scheduled',
      createdBy: userId
    };

    const notification = await Notification.create(notificationData);

    // If immediate, mark as delivered (in real implementation, you'd send actual notifications)
    if (scheduleType === 'immediate') {
      notification.deliveredCount = totalRecipients;
      await notification.save();
    }

    console.log('✅ Notification created successfully');

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Notification created successfully',
      data: notification
    });
  } catch (error) {
    console.error('❌ Create notification error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to create notification'
    });
  }
};

/**
 * Update notification
 * @route PUT /api/notifications/:id
 */
export const updateNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    console.log(`📥 PUT /api/notifications/${id}`);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid notification ID'
      });
    }

    const notification = await Notification.findOne({
      _id: id,
      createdBy: userId
    });

    if (!notification) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Check if notification can be updated
    if (notification.status === 'sent') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Cannot update sent notifications'
      });
    }

    const {
      title,
      message,
      type,
      priority,
      category,
      targetType,
      targetClass,
      targetSection,
      specificUsers,
      scheduleType,
      scheduledAt,
      expiresAt,
      actionButton,
      isPinned,
      allowComments
    } = req.body;

    // Handle new attachments
    let newAttachments = [];
    if (req.files && req.files.attachments) {
      const files = Array.isArray(req.files.attachments) 
        ? req.files.attachments 
        : [req.files.attachments];

      for (const file of files) {
        try {
          const uploadResult = await uploadToCloudinary(
            file.buffer,
            'notification-attachments'
          );

          newAttachments.push({
            name: file.originalname,
            url: uploadResult.url,
            publicId: uploadResult.publicId,
            fileType: file.mimetype,
            fileSize: file.size
          });
        } catch (uploadError) {
          console.error('Attachment upload error:', uploadError);
        }
      }
    }

    // Update fields
    if (title) notification.title = title.trim();
    if (message) notification.message = message.trim();
    if (type) notification.type = type;
    if (priority) notification.priority = priority;
    if (category) notification.category = category;
    if (targetType) notification.targetType = targetType;
    if (targetClass) notification.targetClass = targetClass;
    if (targetSection) notification.targetSection = targetSection;
    if (specificUsers) notification.specificUsers = specificUsers;
    if (scheduleType) notification.scheduleType = scheduleType;
    if (scheduledAt) notification.scheduledAt = new Date(scheduledAt);
    if (expiresAt) notification.expiresAt = new Date(expiresAt);
    if (actionButton) notification.actionButton = actionButton;
    if (typeof isPinned === 'boolean') notification.isPinned = isPinned;
    if (typeof allowComments === 'boolean') notification.allowComments = allowComments;

    // Add new attachments
    if (newAttachments.length > 0) {
      notification.attachments.push(...newAttachments);
    }

    // Recalculate recipients if target changed
    if (targetType || targetClass || targetSection || specificUsers) {
      let totalRecipients = 0;

      if (notification.targetType === 'all') {
        const [studentCount, employeeCount] = await Promise.all([
          Student.countDocuments({ status: 'active' }),
          Employee.countDocuments({ status: 'active' })
        ]);
        totalRecipients = studentCount + employeeCount;
      } else if (notification.targetType === 'students') {
        totalRecipients = await Student.countDocuments({ status: 'active' });
      } else if (notification.targetType === 'employees') {
        totalRecipients = await Employee.countDocuments({ status: 'active' });
      } else if (notification.targetType === 'specific_class') {
        totalRecipients = await Student.countDocuments({
          selectClass: notification.targetClass,
          section: notification.targetSection,
          status: 'active'
        });
      } else if (notification.targetType === 'specific_users') {
        totalRecipients = notification.specificUsers.length;
      }

      notification.totalRecipients = totalRecipients;
    }

    await notification.save();

    console.log('✅ Notification updated successfully');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Notification updated successfully',
      data: notification
    });
  } catch (error) {
    console.error('❌ Update notification error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to update notification'
    });
  }
};

/**
 * Delete notification
 * @route DELETE /api/notifications/:id
 */
export const deleteNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    console.log(`📥 DELETE /api/notifications/${id}`);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid notification ID'
      });
    }

    const notification = await Notification.findOne({
      _id: id,
      createdBy: userId
    });

    if (!notification) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Delete attachments from cloudinary
    if (notification.attachments && notification.attachments.length > 0) {
      for (const attachment of notification.attachments) {
        if (attachment.publicId) {
          try {
            await deleteFromCloudinary(attachment.publicId);
          } catch (deleteError) {
            console.error('Error deleting attachment:', deleteError);
          }
        }
      }
    }

    // Delete notification
    await Notification.findByIdAndDelete(id);

    console.log('✅ Notification deleted successfully');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete notification error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete notification'
    });
  }
};

/**
 * Send scheduled notification immediately
 * @route POST /api/notifications/:id/send
 */
export const sendNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    console.log(`📥 POST /api/notifications/${id}/send`);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid notification ID'
      });
    }

    const notification = await Notification.findOne({
      _id: id,
      createdBy: userId
    });

    if (!notification) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Notification not found'
      });
    }

    if (notification.status === 'sent') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Notification already sent'
      });
    }

    // Update status to sent
    notification.status = 'sent';
    notification.deliveredCount = notification.totalRecipients;
    await notification.save();

    console.log('✅ Notification sent successfully');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Notification sent successfully',
      data: notification
    });
  } catch (error) {
    console.error('❌ Send notification error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to send notification'
    });
  }
};

/**
 * Cancel scheduled notification
 * @route POST /api/notifications/:id/cancel
 */
export const cancelNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    console.log(`📥 POST /api/notifications/${id}/cancel`);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid notification ID'
      });
    }

    const notification = await Notification.findOne({
      _id: id,
      createdBy: userId
    });

    if (!notification) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Notification not found'
      });
    }

    if (notification.status !== 'scheduled') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Only scheduled notifications can be cancelled'
      });
    }

    // Update status to cancelled
    notification.status = 'cancelled';
    await notification.save();

    console.log('✅ Notification cancelled successfully');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Notification cancelled successfully',
      data: notification
    });
  } catch (error) {
    console.error('❌ Cancel notification error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to cancel notification'
    });
  }
};

/**
 * Toggle pin status
 * @route POST /api/notifications/:id/pin
 */
export const togglePin = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    console.log(`📥 POST /api/notifications/${id}/pin`);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid notification ID'
      });
    }

    const notification = await Notification.findOne({
      _id: id,
      createdBy: userId
    });

    if (!notification) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Toggle pin status
    notification.isPinned = !notification.isPinned;
    await notification.save();

    console.log(`✅ Notification ${notification.isPinned ? 'pinned' : 'unpinned'} successfully`);

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Notification ${notification.isPinned ? 'pinned' : 'unpinned'} successfully`,
      data: { isPinned: notification.isPinned }
    });
  } catch (error) {
    console.error('❌ Toggle pin error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to toggle pin status'
    });
  }
};

/**
 * Remove attachment from notification
 * @route DELETE /api/notifications/:id/attachments/:attachmentId
 */
export const removeAttachment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id, attachmentId } = req.params;

    console.log(`📥 DELETE /api/notifications/${id}/attachments/${attachmentId}`);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid notification ID'
      });
    }

    const notification = await Notification.findOne({
      _id: id,
      createdBy: userId
    });

    if (!notification) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Find attachment
    const attachmentIndex = notification.attachments.findIndex(
      att => att._id.toString() === attachmentId
    );

    if (attachmentIndex === -1) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Attachment not found'
      });
    }

    const attachment = notification.attachments[attachmentIndex];

    // Delete from cloudinary
    if (attachment.publicId) {
      try {
        await deleteFromCloudinary(attachment.publicId);
      } catch (deleteError) {
        console.error('Error deleting from cloudinary:', deleteError);
      }
    }

    // Remove from array
    notification.attachments.splice(attachmentIndex, 1);
    await notification.save();

    console.log('✅ Attachment removed successfully');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Attachment removed successfully'
    });
  } catch (error) {
    console.error('❌ Remove attachment error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to remove attachment'
    });
  }
};

/**
 * Get notification statistics
 * @route GET /api/notifications/stats
 */
export const getNotificationStats = async (req, res) => {
  try {
    const userId = req.user.id;

    console.log(`📥 GET /api/notifications/stats`);

    const [stats, recentActivity] = await Promise.all([
      Notification.getStats(userId),
      Notification.find({ createdBy: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title status createdAt readCount totalRecipients')
        .lean()
    ]);

    const statsData = stats[0] || {
      total: 0,
      sent: 0,
      scheduled: 0,
      draft: 0,
      totalRecipients: 0,
      totalReads: 0
    };

    // Calculate additional metrics
    const readRate = statsData.totalRecipients > 0 
      ? Math.round((statsData.totalReads / statsData.totalRecipients) * 100) 
      : 0;

    const categoryStats = await Notification.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const priorityStats = await Notification.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    console.log('✅ Notification stats retrieved');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Notification statistics retrieved successfully',
      data: {
        overview: {
          ...statsData,
          readRate
        },
        categoryStats,
        priorityStats,
        recentActivity: recentActivity.map(notification => ({
          ...notification,
          timeAgo: getTimeAgo(notification.createdAt)
        }))
      }
    });
  } catch (error) {
    console.error('❌ Get notification stats error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch notification statistics'
    });
  }
};

/**
 * Get recipients for notification targeting
 * @route GET /api/notifications/recipients
 */
export const getRecipients = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, search, classFilter } = req.query;

    console.log(`📥 GET /api/notifications/recipients`);

    let data = {};

    if (!type || type === 'students') {
      const studentFilter = {
        status: 'active',
        ...(classFilter && { selectClass: classFilter })
      };

      if (search) {
        studentFilter.$or = [
          { studentName: { $regex: search, $options: 'i' } },
          { registrationNo: { $regex: search, $options: 'i' } }
        ];
      }

      const students = await Student.find(studentFilter)
        .select('studentName selectClass section registrationNo picture')
        .limit(50)
        .lean();

      data.students = students;
    }

    if (!type || type === 'employees') {
      const employeeFilter = { status: 'active' };

      if (search) {
        employeeFilter.$or = [
          { employeeName: { $regex: search, $options: 'i' } },
          { employeeRole: { $regex: search, $options: 'i' } }
        ];
      }

      const employees = await Employee.find(employeeFilter)
        .select('employeeName employeeRole department picture')
        .limit(50)
        .lean();

      data.employees = employees;
    }

    if (!type || type === 'classes') {
      const classFilter = { createdBy: userId, status: 'active' };

      if (search) {
        classFilter.className = { $regex: search, $options: 'i' };
      }

      const classes = await Class.find(classFilter)
        .select('className section subject teacher studentCount')
        .limit(20)
        .lean();

      data.classes = classes;
    }

    console.log('✅ Recipients retrieved successfully');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Recipients retrieved successfully',
      data
    });
  } catch (error) {
    console.error('❌ Get recipients error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch recipients'
    });
  }
};

/**
 * Add comment to notification
 * @route POST /api/notifications/:id/comments
 */
export const addComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const userName = req.user.name || 'Admin';
    const { id } = req.params;
    const { comment } = req.body;

    console.log(`📥 POST /api/notifications/${id}/comments`);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid notification ID'
      });
    }

    if (!comment || !comment.trim()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Comment is required'
      });
    }

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Notification not found'
      });
    }

    if (!notification.allowComments) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Comments are not allowed for this notification'
      });
    }

    // Add comment
    await notification.addComment(userId, 'Admin', userName, comment.trim());

    console.log('✅ Comment added successfully');

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Comment added successfully'
    });
  } catch (error) {
    console.error('❌ Add comment error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to add comment'
    });
  }
};

// Helper function to calculate time ago
function getTimeAgo(date) {
  const now = new Date();
  const created = new Date(date);
  const diffMs = now - created;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return created.toLocaleDateString();
}
/**
 *
 Get available notification templates
 * @route GET /api/notifications/templates
 */
export const getNotificationTemplates = async (req, res) => {
  try {
    console.log('📥 GET /api/notifications/templates');

    const templates = getAvailableTemplates().map(templateName => ({
      name: templateName,
      ...getTemplate(templateName)
    }));

    console.log(`✅ Retrieved ${templates.length} notification templates`);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Notification templates retrieved successfully',
      data: templates
    });
  } catch (error) {
    console.error('❌ Get notification templates error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch notification templates'
    });
  }
};

/**
 * Get single notification template
 * @route GET /api/notifications/templates/:templateName
 */
export const getNotificationTemplate = async (req, res) => {
  try {
    const { templateName } = req.params;

    console.log(`📥 GET /api/notifications/templates/${templateName}`);

    const template = getTemplate(templateName);

    if (!template) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Template not found'
      });
    }

    console.log('✅ Template retrieved successfully');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Template retrieved successfully',
      data: {
        name: templateName,
        ...template
      }
    });
  } catch (error) {
    console.error('❌ Get notification template error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch notification template'
    });
  }
};

/**
 * Create notification from template
 * @route POST /api/notifications/from-template
 */
export const createNotificationFromTemplateController = async (req, res) => {
  try {
    const userId = req.user.id;
    const userName = req.user.name || 'Admin';

    console.log('📥 POST /api/notifications/from-template');

    const {
      templateName,
      variables = {},
      targetType,
      targetClass,
      targetSection = 'A',
      specificUsers = [],
      scheduleType = 'immediate',
      scheduledAt,
      expiresAt,
      overrides = {}
    } = req.body;

    // Validation
    if (!templateName || !targetType) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Template name and target type are required'
      });
    }

    // Validate template variables
    const validation = validateTemplateVariables(templateName, variables);
    if (!validation.isValid) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: validation.error,
        missingVariables: validation.missingVariables
      });
    }

    // Create notification from template
    const templateData = createNotificationFromTemplate(templateName, variables, overrides);

    // Calculate recipients count
    let totalRecipients = 0;

    if (targetType === 'all') {
      const [studentCount, employeeCount] = await Promise.all([
        Student.countDocuments({ status: 'active' }),
        Employee.countDocuments({ status: 'active' })
      ]);
      totalRecipients = studentCount + employeeCount;
    } else if (targetType === 'students') {
      totalRecipients = await Student.countDocuments({ status: 'active' });
    } else if (targetType === 'employees') {
      totalRecipients = await Employee.countDocuments({ status: 'active' });
    } else if (targetType === 'teachers') {
      totalRecipients = await Employee.countDocuments({ 
        status: 'active',
        employeeRole: { $regex: 'teacher', $options: 'i' }
      });
    } else if (targetType === 'staff') {
      totalRecipients = await Employee.countDocuments({ 
        status: 'active',
        employeeRole: { $not: { $regex: 'teacher', $options: 'i' } }
      });
    } else if (targetType === 'specific_class') {
      if (!targetClass) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Target class is required for class-specific notifications'
        });
      }
      
      totalRecipients = await Student.countDocuments({
        selectClass: targetClass,
        section: targetSection,
        status: 'active'
      });
    } else if (targetType === 'specific_users') {
      totalRecipients = specificUsers.length;
    }

    // Create notification
    const notificationData = {
      ...templateData,
      sender: userId,
      senderName: userName,
      targetType,
      targetClass,
      targetSection,
      specificUsers,
      scheduleType,
      scheduledAt: scheduleType === 'scheduled' ? new Date(scheduledAt) : null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      totalRecipients,
      status: scheduleType === 'immediate' ? 'sent' : 'scheduled',
      createdBy: userId
    };

    const notification = await Notification.create(notificationData);

    // If immediate, mark as delivered
    if (scheduleType === 'immediate') {
      notification.deliveredCount = totalRecipients;
      await notification.save();
    }

    console.log('✅ Notification created from template successfully');

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Notification created from template successfully',
      data: notification
    });
  } catch (error) {
    console.error('❌ Create notification from template error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to create notification from template'
    });
  }
};