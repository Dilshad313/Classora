import mongoose from 'mongoose';

const notificationRecipientSchema = new mongoose.Schema({
  // Notification reference
  notification: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notification',
    required: true
  },

  // Recipient information
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'recipientModel',
    required: true
  },
  recipientModel: {
    type: String,
    required: true,
    enum: ['Student', 'Employee', 'Parent', 'Admin']
  },
  recipientName: {
    type: String,
    required: true
  },
  recipientEmail: String,
  recipientPhone: String,

  // Delivery status
  deliveryStatus: {
    type: String,
    enum: ['pending', 'delivered', 'failed', 'bounced'],
    default: 'pending'
  },
  deliveredAt: Date,
  deliveryAttempts: {
    type: Number,
    default: 0
  },
  lastAttemptAt: Date,
  failureReason: String,

  // Read status
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  readFromDevice: {
    type: String,
    enum: ['web', 'mobile', 'email', 'sms'],
    default: 'web'
  },

  // Interaction tracking
  clicked: {
    type: Boolean,
    default: false
  },
  clickedAt: Date,
  clickCount: {
    type: Number,
    default: 0
  },

  // Response tracking (for notifications that allow responses)
  responded: {
    type: Boolean,
    default: false
  },
  response: String,
  respondedAt: Date,

  // Preferences
  notificationPreferences: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    push: { type: Boolean, default: true },
    inApp: { type: Boolean, default: true }
  },

  // Metadata
  metadata: {
    userAgent: String,
    ipAddress: String,
    location: String
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for delivery time
notificationRecipientSchema.virtual('deliveryTime').get(function() {
  if (!this.deliveredAt) return null;
  
  const deliveryTime = new Date(this.deliveredAt) - new Date(this.createdAt);
  return Math.round(deliveryTime / 1000); // Return in seconds
});

// Virtual for read time after delivery
notificationRecipientSchema.virtual('readTime').get(function() {
  if (!this.readAt || !this.deliveredAt) return null;
  
  const readTime = new Date(this.readAt) - new Date(this.deliveredAt);
  return Math.round(readTime / 1000); // Return in seconds
});

// Method to mark as delivered
notificationRecipientSchema.methods.markAsDelivered = function() {
  this.deliveryStatus = 'delivered';
  this.deliveredAt = new Date();
  return this.save();
};

// Method to mark as read
notificationRecipientSchema.methods.markAsRead = function(device = 'web', metadata = {}) {
  if (!this.isRead) {
    this.isRead = true;
    this.readAt = new Date();
    this.readFromDevice = device;
    this.metadata = { ...this.metadata, ...metadata };
  }
  return this.save();
};

// Method to track click
notificationRecipientSchema.methods.trackClick = function() {
  this.clicked = true;
  this.clickedAt = new Date();
  this.clickCount += 1;
  return this.save();
};

// Method to record response
notificationRecipientSchema.methods.recordResponse = function(response) {
  this.responded = true;
  this.response = response;
  this.respondedAt = new Date();
  return this.save();
};

// Method to mark delivery as failed
notificationRecipientSchema.methods.markAsFailed = function(reason) {
  this.deliveryStatus = 'failed';
  this.failureReason = reason;
  this.deliveryAttempts += 1;
  this.lastAttemptAt = new Date();
  return this.save();
};

// Static method to get recipient statistics for a notification
notificationRecipientSchema.statics.getNotificationStats = function(notificationId) {
  return this.aggregate([
    { $match: { notification: new mongoose.Types.ObjectId(notificationId) } },
    {
      $group: {
        _id: null,
        totalRecipients: { $sum: 1 },
        delivered: { $sum: { $cond: [{ $eq: ['$deliveryStatus', 'delivered'] }, 1, 0] } },
        failed: { $sum: { $cond: [{ $eq: ['$deliveryStatus', 'failed'] }, 1, 0] } },
        read: { $sum: { $cond: ['$isRead', 1, 0] } },
        clicked: { $sum: { $cond: ['$clicked', 1, 0] } },
        responded: { $sum: { $cond: ['$responded', 1, 0] } },
        avgDeliveryTime: { $avg: '$deliveryTime' },
        avgReadTime: { $avg: '$readTime' }
      }
    }
  ]);
};

// Static method to get user's notifications
notificationRecipientSchema.statics.getUserNotifications = function(userId, userModel, options = {}) {
  const {
    page = 1,
    limit = 20,
    unreadOnly = false,
    category,
    priority
  } = options;

  const skip = (page - 1) * limit;
  
  const matchQuery = {
    recipient: new mongoose.Types.ObjectId(userId),
    recipientModel: userModel,
    deliveryStatus: 'delivered'
  };

  if (unreadOnly) {
    matchQuery.isRead = false;
  }

  const pipeline = [
    { $match: matchQuery },
    {
      $lookup: {
        from: 'notifications',
        localField: 'notification',
        foreignField: '_id',
        as: 'notificationData'
      }
    },
    { $unwind: '$notificationData' },
    {
      $match: {
        'notificationData.isActive': true,
        $or: [
          { 'notificationData.expiresAt': { $exists: false } },
          { 'notificationData.expiresAt': null },
          { 'notificationData.expiresAt': { $gt: new Date() } }
        ]
      }
    }
  ];

  if (category && category !== 'all') {
    pipeline.push({ $match: { 'notificationData.category': category } });
  }

  if (priority && priority !== 'all') {
    pipeline.push({ $match: { 'notificationData.priority': priority } });
  }

  pipeline.push(
    { $sort: { 'notificationData.isPinned': -1, createdAt: -1 } },
    { $skip: skip },
    { $limit: parseInt(limit) }
  );

  return this.aggregate(pipeline);
};

// Indexes for better performance
notificationRecipientSchema.index({ notification: 1, recipient: 1, recipientModel: 1 });
notificationRecipientSchema.index({ recipient: 1, recipientModel: 1, deliveryStatus: 1 });
notificationRecipientSchema.index({ notification: 1, deliveryStatus: 1 });
notificationRecipientSchema.index({ notification: 1, isRead: 1 });
notificationRecipientSchema.index({ deliveredAt: 1 });
notificationRecipientSchema.index({ readAt: 1 });

export default mongoose.model('NotificationRecipient', notificationRecipientSchema);