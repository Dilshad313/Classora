import mongoose from 'mongoose';

const smsSchema = new mongoose.Schema({
  // Recipient Information
  recipientType: {
    type: String,
    required: [true, 'Recipient type is required'],
    enum: ['allStudents', 'allEmployees', 'specificClass', 'specificStudent', 'specificEmployee']
  },
  
  // Recipient Details
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  recipientName: {
    type: String,
    required: true
  },
  
  // Message Details
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: [160, 'Message cannot exceed 160 characters']
  },
  characterCount: {
    type: Number,
    required: true
  },
  
  // Recipient Count
  recipientCount: {
    type: Number,
    required: true,
    min: 1
  },
  
  // Status & Tracking
  status: {
    type: String,
    enum: ['sent', 'failed', 'pending'],
    default: 'sent'
  },
  sentAt: {
    type: Date,
    default: Date.now
  },
  
  // System Fields
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  
  // Optional: For tracking specific recipients
  studentIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  employeeIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  }],
  
  // Cost & Billing (if using paid service)
  cost: {
    type: Number,
    default: 0
  },
  isFree: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
smsSchema.index({ createdBy: 1, sentAt: -1 });
smsSchema.index({ recipientType: 1 });
smsSchema.index({ status: 1 });

// Pre-save middleware to update character count
smsSchema.pre('save', function(next) {
  this.characterCount = this.message.length;
  next();
});

// Virtual for formatted date
smsSchema.virtual('formattedDate').get(function() {
  return this.sentAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
});

// Static method to get SMS statistics
smsSchema.statics.getStatsByAdmin = async function(adminId) {
  const stats = await this.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(adminId) } },
    {
      $group: {
        _id: null,
        totalSMS: { $sum: 1 },
        totalRecipients: { $sum: '$recipientCount' },
        totalStudents: {
          $sum: {
            $cond: [
              { $in: ['$recipientType', ['allStudents', 'specificClass', 'specificStudent']] },
              '$recipientCount',
              0
            ]
          }
        },
        totalEmployees: {
          $sum: {
            $cond: [
              { $in: ['$recipientType', ['allEmployees', 'specificEmployee']] },
              '$recipientCount',
              0
            ]
          }
        },
        sentCount: {
          $sum: { $cond: [{ $eq: ['$status', 'sent'] }, 1, 0] }
        },
        failedCount: {
          $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
        }
      }
    }
  ]);
  
  return stats[0] || {
    totalSMS: 0,
    totalRecipients: 0,
    totalStudents: 0,
    totalEmployees: 0,
    sentCount: 0,
    failedCount: 0
  };
};

// Static method to get recent SMS history
smsSchema.statics.getRecentHistory = async function(adminId, limit = 10) {
  return this.find({ createdBy: adminId })
    .sort({ sentAt: -1 })
    .limit(limit)
    .lean();
};

export default mongoose.model('SMS', smsSchema);