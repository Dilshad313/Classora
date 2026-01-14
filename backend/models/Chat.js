import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['group', 'individual', 'broadcast'],
    required: true
  },
  
  // Chat Type Configuration
  targetType: {
    type: String,
    enum: ['allStudents', 'allEmployees', 'specificClass', 'specificStudent', 'specificEmployee'],
    required: function() {
      return this.type === 'broadcast';
    }
  },
  
  // Participants
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'participants.model'
    },
    model: {
      type: String,
      enum: ['Admin', 'Student', 'Employee', 'Class']
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    lastRead: {
      type: Date,
      default: Date.now
    }
  }],
  
  // For group chats
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  },
  
  // For individual chats
  individualRecipient: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'individualRecipient.model'
    },
    model: {
      type: String,
      enum: ['Student', 'Employee']
    }
  },
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'createdByModel',
    required: true
  },
  createdByModel: {
    type: String,
    enum: ['Admin', 'Student', 'Employee'],
    default: 'Admin'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  
  // Statistics
  messageCount: {
    type: Number,
    default: 0
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  
  // Unread tracking
  unreadCounts: {
    type: Map,
    of: Number,
    default: {}
  },
  
  // Settings
  settings: {
    allowAttachments: {
      type: Boolean,
      default: true
    },
    notifyOnMessage: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for last message details
chatSchema.virtual('lastMessageData', {
  ref: 'Message',
  localField: 'lastMessage',
  foreignField: '_id',
  justOne: true
});

// Virtual for participants count
chatSchema.virtual('participantCount').get(function() {
  return this.participants.length;
});

// Indexes
chatSchema.index({ createdBy: 1, type: 1 });
chatSchema.index({ participants: 1 });
chatSchema.index({ class: 1 });
chatSchema.index({ 'individualRecipient.user': 1, 'individualRecipient.model': 1 });
chatSchema.index({ lastActivity: -1 });
chatSchema.index({ type: 1, targetType: 1 });

// Pre-save middleware to update lastActivity
chatSchema.pre('save', function(next) {
  if (this.isModified('lastMessage') || this.isModified('messageCount')) {
    this.lastActivity = new Date();
  }
  next();
});

// Static method to create broadcast chat
chatSchema.statics.createBroadcastChat = async function(type, userId, name, userModel = 'Admin') {
  const chatName = name || (type === 'allStudents' ? 'All Students' : 'All Employees');
  
  const existingChat = await this.findOne({
    type: 'broadcast',
    targetType: type,
    createdBy: userId,
    isActive: true,
    isArchived: false
  });
  
  if (existingChat) {
    return existingChat;
  }
  
  return this.create({
    name: chatName,
    type: 'broadcast',
    targetType: type,
    participants: [{
      user: userId,
      model: userModel
    }],
    createdBy: userId,
    createdByModel: userModel
  });
};

// Static method to find or create individual chat
chatSchema.statics.findOrCreateIndividualChat = async function(userId, userModel, recipientId, recipientModel, recipientName) {
  const existingChat = await this.findOne({
    type: 'individual',
    'individualRecipient.user': recipientId,
    'individualRecipient.model': recipientModel,
    createdBy: userId,
    createdByModel: userModel,
    isActive: true,
    isArchived: false
  });
  
  if (existingChat) {
    return existingChat;
  }
  
  return this.create({
    name: recipientName,
    type: 'individual',
    individualRecipient: {
      user: recipientId,
      model: recipientModel
    },
    participants: [
      { user: userId, model: userModel },
      { user: recipientId, model: recipientModel }
    ],
    createdBy: userId,
    createdByModel: userModel
  });
};

// Static method to find or create group chat for class
chatSchema.statics.findOrCreateClassChat = async function(userId, userModel, classId, className) {
  const existingChat = await this.findOne({
    type: 'group',
    class: classId,
    createdBy: userId,
    createdByModel: userModel,
    isActive: true,
    isArchived: false
  });
  
  if (existingChat) {
    return existingChat;
  }
  
  return this.create({
    name: className,
    type: 'group',
    class: classId,
    participants: [{
      user: userId,
      model: userModel
    }],
    createdBy: userId,
    createdByModel: userModel
  });
};

export default mongoose.model('Chat', chatSchema);