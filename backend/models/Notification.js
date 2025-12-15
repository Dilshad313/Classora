import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    trim: true,
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  type: {
    type: String,
    required: [true, 'Notification type is required'],
    enum: ['announcement', 'reminder', 'alert', 'info', 'warning', 'success', 'error'],
    default: 'info'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['general', 'academic', 'fees', 'attendance', 'exam', 'event', 'holiday', 'meeting', 'maintenance'],
    default: 'general'
  },

  // Sender Information
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  senderRole: {
    type: String,
    default: 'Admin'
  },

  // Target Audience
  targetType: {
    type: String,
    required: [true, 'Target type is required'],
    enum: ['all', 'students', 'employees', 'parents', 'specific_class', 'specific_users', 'teachers', 'staff']
  },
  targetClass: {
    type: String,
    validate: {
      validator: function(v) {
        return this.targetType !== 'specific_class' || (v && v.trim().length > 0);
      },
      message: 'Target class is required when target type is specific_class'
    }
  },
  targetSection: {
    type: String,
    default: 'A'
  },
  specificUsers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'specificUsers.userModel'
    },
    userModel: {
      type: String,
      enum: ['Student', 'Employee', 'Parent']
    },
    userName: String
  }],

  // Scheduling
  scheduleType: {
    type: String,
    enum: ['immediate', 'scheduled'],
    default: 'immediate'
  },
  scheduledAt: {
    type: Date,
    validate: {
      validator: function(v) {
        return this.scheduleType !== 'scheduled' || (v && v > new Date());
      },
      message: 'Scheduled time must be in the future'
    }
  },
  expiresAt: {
    type: Date,
    validate: {
      validator: function(v) {
        return !v || v > new Date();
      },
      message: 'Expiry time must be in the future'
    }
  },

  // Content and Media
  attachments: [{
    name: String,
    url: String,
    publicId: String,
    fileType: String,
    fileSize: Number
  }],
  actionButton: {
    text: String,
    url: String,
    action: {
      type: String,
      enum: ['link', 'download', 'redirect', 'none'],
      default: 'none'
    }
  },

  // Status and Tracking
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'sent', 'failed', 'cancelled'],
    default: 'draft'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  allowComments: {
    type: Boolean,
    default: false
  },

  // Delivery Tracking
  totalRecipients: {
    type: Number,
    default: 0
  },
  deliveredCount: {
    type: Number,
    default: 0
  },
  readCount: {
    type: Number,
    default: 0
  },
  failedDeliveries: [{
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'failedDeliveries.recipientModel'
    },
    recipientModel: {
      type: String,
      enum: ['Student', 'Employee', 'Parent']
    },
    reason: String,
    attemptedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Read Receipts
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'readBy.userModel'
    },
    userModel: {
      type: String,
      enum: ['Student', 'Employee', 'Parent', 'Admin']
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Comments (if enabled)
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'comments.userModel'
    },
    userModel: {
      type: String,
      enum: ['Student', 'Employee', 'Parent', 'Admin']
    },
    userName: String,
    comment: {
      type: String,
      required: true,
      maxlength: [500, 'Comment cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Analytics
  clickCount: {
    type: Number,
    default: 0
  },
  lastClickedAt: Date,

  // Institute Reference
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for read percentage
notificationSchema.virtual('readPercentage').get(function() {
  if (this.totalRecipients === 0) return 0;
  return Math.round((this.readCount / this.totalRecipients) * 100);
});

// Virtual for delivery percentage
notificationSchema.virtual('deliveryPercentage').get(function() {
  if (this.totalRecipients === 0) return 0;
  return Math.round((this.deliveredCount / this.totalRecipients) * 100);
});

// Virtual for status display
notificationSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    'draft': 'Draft',
    'scheduled': 'Scheduled',
    'sent': 'Sent',
    'failed': 'Failed',
    'cancelled': 'Cancelled'
  };
  return statusMap[this.status] || this.status;
});

// Virtual for priority display
notificationSchema.virtual('priorityDisplay').get(function() {
  const priorityMap = {
    'low': 'Low',
    'medium': 'Medium',
    'high': 'High',
    'urgent': 'Urgent'
  };
  return priorityMap[this.priority] || this.priority;
});

// Virtual for time ago
notificationSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const created = new Date(this.createdAt);
  const diffMs = now - created;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return created.toLocaleDateString();
});

// Method to mark as read by user
notificationSchema.methods.markAsRead = function(userId, userModel) {
  const existingRead = this.readBy.find(
    read => read.user.toString() === userId.toString() && read.userModel === userModel
  );
  
  if (!existingRead) {
    this.readBy.push({
      user: userId,
      userModel: userModel,
      readAt: new Date()
    });
    this.readCount = this.readBy.length;
  }
  
  return this.save();
};

// Method to add comment
notificationSchema.methods.addComment = function(userId, userModel, userName, comment) {
  if (!this.allowComments) {
    throw new Error('Comments are not allowed for this notification');
  }
  
  this.comments.push({
    user: userId,
    userModel: userModel,
    userName: userName,
    comment: comment
  });
  
  return this.save();
};

// Method to increment click count
notificationSchema.methods.incrementClick = function() {
  this.clickCount += 1;
  this.lastClickedAt = new Date();
  return this.save();
};

// Static method to get notifications for user
notificationSchema.statics.getForUser = function(userId, userModel, options = {}) {
  const {
    page = 1,
    limit = 20,
    category,
    priority,
    unreadOnly = false,
    search
  } = options;

  const skip = (page - 1) * limit;
  
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

  if (unreadOnly) {
    pipeline.push({ $match: { isRead: false } });
  }

  pipeline.push(
    { $sort: { isPinned: -1, createdAt: -1 } },
    { $skip: skip },
    { $limit: parseInt(limit) }
  );

  return this.aggregate(pipeline);
};

// Static method to get notification statistics
notificationSchema.statics.getStats = function(createdBy) {
  return this.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(createdBy) } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        sent: { $sum: { $cond: [{ $eq: ['$status', 'sent'] }, 1, 0] } },
        scheduled: { $sum: { $cond: [{ $eq: ['$status', 'scheduled'] }, 1, 0] } },
        draft: { $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] } },
        totalRecipients: { $sum: '$totalRecipients' },
        totalReads: { $sum: '$readCount' }
      }
    }
  ]);
};

// Indexes for better performance
notificationSchema.index({ createdBy: 1, status: 1 });
notificationSchema.index({ targetType: 1, status: 1 });
notificationSchema.index({ scheduledAt: 1, status: 1 });
notificationSchema.index({ expiresAt: 1 });
notificationSchema.index({ 'specificUsers.user': 1 });
notificationSchema.index({ category: 1, priority: 1 });
notificationSchema.index({ title: 'text', message: 'text' });

export default mongoose.model('Notification', notificationSchema);