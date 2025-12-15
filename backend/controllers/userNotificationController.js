import mongoose from 'mongoose';
import Notification from '../models/Notification.js';
import NotificationRecipient from '../models/NotificationRecipient.js';
import Student from '../models/Student.js';
import Employee from '../models/Employee.js';
import { StatusCodes } from 'http-status-codes';

/**
 * Get notifications for current user (Student/Employee)
 * @route GET /api/user-notifications
 */
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const userModel = req.user.constructor.modelName; // 'Student' or 'Employee'
    
    const {
      page = 1,
      limit = 20,
      category,
      priority,
      unreadOnly = false,
      search
    } = req.query;

    console.log(`📥 GET /api/user-notifications for ${userModel}: ${userId}`);

    // Build match query for notifications
    const matchQuery = {
      status: 'sent',
      isActive: true,
      $or: [
        { targetType: 'all' },
        { targetType: userModel.toLowerCase() + 's' }
      ]
    };

    // Add class-specific targeting for students
    if (userModel === 'Student') {
      const student = await Student.findById(userId).select('selectClass section');
      if (student) {
        matchQuery.$or.push({
          targetType: 'specific_class',
          targetClass: student.selectClass,
          targetSection: student.section
        });
      }
    }

    // Add role-specific targeting for employees
    if (userModel === 'Employee') {
      const employee = await Employee.findById(userId).select('employeeRole');
      if (employee) {
        const isTeacher = employee.employeeRole.toLowerCase().includes('teacher');
        matchQuery.$or.push({
          targetType: isTeacher ? 'teachers' : 'staff'
        });
      }
    }

    // Add specific user targeting
    matchQuery.$or.push({
      targetType: 'specific_users',
      'specificUsers.user': new mongoose.Types.ObjectId(userId)
    });

    // Add expiry filter
    matchQuery.$and = [
      {
        $or: [
          { expiresAt: { $exists: false } },
          { expiresAt: null },
          { expiresAt: { $gt: new Date() } }
        ]
      }
    ];

    if (category && category !== 'all') {
      matchQuery.category = category;
    }

    if (priority && priority !== 'all') {
      matchQuery.priority = priority;
    }

    if (search) {
      matchQuery.$or = [
        { title: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build aggregation pipeline
    const pipeline = [
      { $match: matchQuery },
      {
        $addFields: {
          isRead: {
            $in: [
              { user: new mongoose.Types.ObjectId(userId), userModel: userModel },
              '$readBy'
            ]
          }
        }
      }
    ];

    if (unreadOnly === 'true') {
      pipeline.push({ $match: { isRead: false } });
    }

    pipeline.push(
      { $sort: { isPinned: -1, createdAt: -1 } },
      { $skip: skip },
      { $limit: parseInt(limit) }
    );

    // Execute query
    const [notifications, totalCount] = await Promise.all([
      Notification.aggregate(pipeline),
      Notification.countDocuments(matchQuery)
    ]);

    // Add time ago and other computed fields
    const notificationsWithExtras = notifications.map(notification => ({
      ...notification,
      timeAgo: getTimeAgo(notification.createdAt),
      canComment: notification.allowComments,
      hasAttachments: notification.attachments && notification.attachments.length > 0
    }));

    console.log(`✅ Found ${notifications.length} notifications for user`);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Notifications retrieved successfully',
      data: {
        notifications: notificationsWithExtras,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalCount,
          totalPages: Math.ceil(totalCount / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('❌ Get user notifications error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch notifications'
    });
  }
};

/**
 * Get single notification for user
 * @route GET /api/user-notifications/:id
 */
export const getUserNotificationById = async (req, res) => {
  try {
    const userId = req.user.id;
    const userModel = req.user.constructor.modelName;
    const { id } = req.params;

    console.log(`📥 GET /api/user-notifications/${id} for ${userModel}: ${userId}`);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid notification ID'
      });
    }

    // Find notification and check if user has access
    const notification = await Notification.findOne({
      _id: id,
      status: 'sent',
      isActive: true,
      $or: [
        { targetType: 'all' },
        { targetType: userModel.toLowerCase() + 's' },
        { 'specificUsers.user': userId }
      ]
    })
    .populate('sender', 'name')
    .populate({
      path: 'comments.user',
      select: 'studentName employeeName name'
    });

    if (!notification) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Notification not found or access denied'
      });
    }

    // Check expiry
    if (notification.expiresAt && new Date(notification.expiresAt) < new Date()) {
      return res.status(StatusCodes.GONE).json({
        success: false,
        message: 'Notification has expired'
      });
    }

    // Mark as read if not already read
    const isAlreadyRead = notification.readBy.some(
      read => read.user.toString() === userId.toString() && read.userModel === userModel
    );

    if (!isAlreadyRead) {
      await notification.markAsRead(userId, userModel);
    }

    console.log('✅ Notification retrieved and marked as read');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Notification retrieved successfully',
      data: {
        ...notification.toObject(),
        isRead: true,
        timeAgo: getTimeAgo(notification.createdAt)
      }
    });
  } catch (error) {
    console.error('❌ Get user notification error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch notification'
    });
  }
};

/**
 * Mark notification as read
 * @route POST /api/user-notifications/:id/read
 */
export const markNotificationAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const userModel = req.user.constructor.modelName;
    const { id } = req.params;

    console.log(`📥 POST /api/user-notifications/${id}/read for ${userModel}: ${userId}`);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid notification ID'
      });
    }

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Mark as read
    await notification.markAsRead(userId, userModel);

    console.log('✅ Notification marked as read');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('❌ Mark notification as read error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to mark notification as read'
    });
  }
};

/**
 * Mark all notifications as read for user
 * @route POST /api/user-notifications/read-all
 */
export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const userModel = req.user.constructor.modelName;

    console.log(`📥 POST /api/user-notifications/read-all for ${userModel}: ${userId}`);

    // Find all unread notifications for user
    const notifications = await Notification.find({
      status: 'sent',
      isActive: true,
      'readBy.user': { $ne: userId },
      $or: [
        { targetType: 'all' },
        { targetType: userModel.toLowerCase() + 's' },
        { 'specificUsers.user': userId }
      ]
    });

    // Mark each as read
    const updatePromises = notifications.map(notification => 
      notification.markAsRead(userId, userModel)
    );

    await Promise.all(updatePromises);

    console.log(`✅ Marked ${notifications.length} notifications as read`);

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Marked ${notifications.length} notifications as read`
    });
  } catch (error) {
    console.error('❌ Mark all notifications as read error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to mark notifications as read'
    });
  }
};

/**
 * Add comment to notification
 * @route POST /api/user-notifications/:id/comments
 */
export const addCommentToNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const userModel = req.user.constructor.modelName;
    const { id } = req.params;
    const { comment } = req.body;

    console.log(`📥 POST /api/user-notifications/${id}/comments for ${userModel}: ${userId}`);

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

    // Get user name
    let userName = 'User';
    if (userModel === 'Student') {
      const student = await Student.findById(userId).select('studentName');
      userName = student?.studentName || 'Student';
    } else if (userModel === 'Employee') {
      const employee = await Employee.findById(userId).select('employeeName');
      userName = employee?.employeeName || 'Employee';
    }

    // Add comment
    await notification.addComment(userId, userModel, userName, comment.trim());

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

/**
 * Track notification click/action
 * @route POST /api/user-notifications/:id/click
 */
export const trackNotificationClick = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    console.log(`📥 POST /api/user-notifications/${id}/click`);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid notification ID'
      });
    }

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Increment click count
    await notification.incrementClick();

    console.log('✅ Notification click tracked');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Click tracked successfully'
    });
  } catch (error) {
    console.error('❌ Track click error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to track click'
    });
  }
};

/**
 * Get notification statistics for user
 * @route GET /api/user-notifications/stats
 */
export const getUserNotificationStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const userModel = req.user.constructor.modelName;

    console.log(`📥 GET /api/user-notifications/stats for ${userModel}: ${userId}`);

    // Build match query
    const matchQuery = {
      status: 'sent',
      isActive: true,
      $or: [
        { targetType: 'all' },
        { targetType: userModel.toLowerCase() + 's' },
        { 'specificUsers.user': new mongoose.Types.ObjectId(userId) }
      ]
    };

    // Add class-specific targeting for students
    if (userModel === 'Student') {
      const student = await Student.findById(userId).select('selectClass section');
      if (student) {
        matchQuery.$or.push({
          targetType: 'specific_class',
          targetClass: student.selectClass,
          targetSection: student.section
        });
      }
    }

    const [stats] = await Notification.aggregate([
      { $match: matchQuery },
      {
        $addFields: {
          isRead: {
            $in: [
              { user: new mongoose.Types.ObjectId(userId), userModel: userModel },
              '$readBy'
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          unread: { $sum: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] } },
          read: { $sum: { $cond: [{ $eq: ['$isRead', true] }, 1, 0] } },
          urgent: { $sum: { $cond: [{ $eq: ['$priority', 'urgent'] }, 1, 0] } },
          high: { $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] } },
          todayCount: {
            $sum: {
              $cond: [
                {
                  $gte: ['$createdAt', new Date(new Date().setHours(0, 0, 0, 0))]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    const result = stats || {
      total: 0,
      unread: 0,
      read: 0,
      urgent: 0,
      high: 0,
      todayCount: 0
    };

    console.log('✅ User notification stats retrieved');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Notification statistics retrieved successfully',
      data: result
    });
  } catch (error) {
    console.error('❌ Get user notification stats error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch notification statistics'
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