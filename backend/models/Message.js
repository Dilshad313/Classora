import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  // Reference to chat
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true,
    index: true
  },
  
  // Sender information
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'senderModel',
    required: true
  },
  senderModel: {
    type: String,
    enum: ['Admin', 'Student', 'Employee'],
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  
  // Message content
  text: {
    type: String,
    required: function() {
      // Text is required only if there are no attachments
      return !this.attachments || this.attachments.length === 0;
    },
    trim: true,
    default: ''
  },
  
  // Attachments
  attachments: [{
    name: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      default: null
    },
    fileType: {
      type: String,
      required: true
    },
    fileSize: {
      type: Number,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Message status
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read', 'failed'],
    default: 'sent'
  },
  
  // Read receipts
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'readBy.userModel'
    },
    userModel: {
      type: String,
      enum: ['Admin', 'Student', 'Employee']
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Delivery receipts (for broadcasts)
  deliveredTo: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'deliveredTo.userModel'
    },
    userModel: {
      type: String,
      enum: ['Admin', 'Student', 'Employee']
    },
    deliveredAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Message metadata
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date,
    default: null
  },
  
  // For replying to other messages
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: null
  },
  
  // Message type
  messageType: {
    type: String,
    enum: ['text', 'image', 'document', 'announcement', 'system'],
    default: 'text'
  },
  
  // Additional metadata
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for optimal querying
messageSchema.index({ chat: 1, createdAt: -1 });
messageSchema.index({ sender: 1, createdAt: -1 });
messageSchema.index({ createdAt: -1 });
messageSchema.index({ status: 1 });
messageSchema.index({ 'attachments.fileType': 1 });

// Virtual for formatted time
messageSchema.virtual('formattedTime').get(function() {
  const now = new Date();
  const msgDate = new Date(this.createdAt);
  const diffMs = now - msgDate;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return msgDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Virtual for reply message data
messageSchema.virtual('replyMessage', {
  ref: 'Message',
  localField: 'replyTo',
  foreignField: '_id',
  justOne: true
});

// Pre-save middleware
messageSchema.pre('save', async function(next) {
  // Update chat's last message and message count
  if (this.isNew) {
    await mongoose.model('Chat').findByIdAndUpdate(this.chat, {
      $set: { lastMessage: this._id, lastActivity: new Date() },
      $inc: { messageCount: 1 }
    });
  }
  next();
});

// Static method to mark messages as read
messageSchema.statics.markAsRead = async function(chatId, userId, userModel) {
  return this.updateMany(
    {
      chat: chatId,
      'readBy.user': { $ne: userId }
    },
    {
      $push: {
        readBy: {
          user: userId,
          userModel: userModel,
          readAt: new Date()
        }
      },
      $set: { status: 'read' }
    }
  );
};

// Static method to mark messages as delivered
messageSchema.statics.markAsDelivered = async function(chatId, userId, userModel) {
  return this.updateMany(
    {
      chat: chatId,
      'deliveredTo.user': { $ne: userId },
      status: 'sent'
    },
    {
      $push: {
        deliveredTo: {
          user: userId,
          userModel: userModel,
          deliveredAt: new Date()
        }
      },
      $set: { status: 'delivered' }
    }
  );
};

// Static method to get unread count for a user in a chat
messageSchema.statics.getUnreadCount = async function(chatId, userId, userModel) {
  return this.countDocuments({
    chat: chatId,
    sender: { $ne: userId },
    'readBy.user': { $ne: userId }
  });
};

// Instance method to edit message
messageSchema.methods.edit = async function(newText) {
  this.text = newText;
  this.isEdited = true;
  this.editedAt = new Date();
  return this.save();
};

// Instance method to add attachment
messageSchema.methods.addAttachment = async function(attachmentData) {
  this.attachments.push(attachmentData);
  this.messageType = this.determineMessageType();
  return this.save();
};

// Instance method to determine message type based on content
messageSchema.methods.determineMessageType = function() {
  if (this.attachments && this.attachments.length > 0) {
    const firstAttachment = this.attachments[0];
    if (firstAttachment.fileType.startsWith('image/')) {
      return 'image';
    } else if (firstAttachment.fileType === 'application/pdf' || 
               firstAttachment.fileType.includes('document') ||
               firstAttachment.fileType.includes('sheet')) {
      return 'document';
    }
  }
  return this.text.length > 500 ? 'announcement' : 'text';
};

export default mongoose.model('Message', messageSchema);