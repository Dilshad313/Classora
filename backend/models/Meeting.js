import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Meeting title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  meetingLink: {
    type: String,
    required: [true, 'Meeting link is required'],
    trim: true,
    lowercase: true
  },
  meetingType: {
    type: String,
    enum: ['allStudents', 'allTeachers', 'specificClass', 'specificStudent', 'specificTeacher'],
    required: [true, 'Meeting type is required']
  },
  meetingWith: {
    type: String,
    required: [true, 'Meeting with is required'],
    trim: true
  },
  
  // References (optional based on meeting type)
  specificClass: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    default: null
  },
  specificStudent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    default: null
  },
  specificTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    default: null
  },
  
  // Schedule Details
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [15, 'Minimum duration is 15 minutes'],
    max: [300, 'Maximum duration is 300 minutes']
  },
  message: {
    type: String,
    trim: true,
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  
  // Schedule Settings
  isScheduled: {
    type: Boolean,
    default: false
  },
  scheduledDate: {
    type: Date,
    default: null
  },
  scheduledTime: {
    type: String,
    default: ''
  },
  startTime: {
    type: Date,
    default: null
  },
  endTime: {
    type: Date,
    default: null
  },
  
  // Status Tracking
  status: {
    type: String,
    enum: ['scheduled', 'live', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  participantCount: {
    type: Number,
    default: 0
  },
  
  // Meeting Room Details
  roomUrl: {
    type: String,
    default: ''
  },
  meetingPassword: {
    type: String,
    default: ''
  },
  
  // Metadata
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

// Virtual for formatted schedule
meetingSchema.virtual('formattedSchedule').get(function() {
  if (this.isScheduled && this.scheduledDate && this.scheduledTime) {
    const date = new Date(this.scheduledDate);
    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    return `${formattedDate} at ${this.scheduledTime}`;
  }
  return 'Immediate';
});

// Virtual for meeting status
meetingSchema.virtual('isUpcoming').get(function() {
  if (!this.isScheduled) return false;
  
  const scheduledDateTime = new Date(
    `${this.scheduledDate.toISOString().split('T')[0]}T${this.scheduledTime}`
  );
  return scheduledDateTime > new Date();
});

// Pre-save middleware to set startTime and endTime
meetingSchema.pre('save', function(next) {
  if (this.isScheduled && this.scheduledDate && this.scheduledTime && this.duration) {
    const scheduledDateTime = new Date(
      `${this.scheduledDate.toISOString().split('T')[0]}T${this.scheduledTime}`
    );
    this.startTime = scheduledDateTime;
    
    const endTime = new Date(scheduledDateTime);
    endTime.setMinutes(endTime.getMinutes() + this.duration);
    this.endTime = endTime;
  }
  
  // Set roomUrl to be the same as meetingLink for Google Meet
  if (this.meetingLink) {
    this.roomUrl = this.meetingLink;
  }
  
  next();
});

// Indexes for better query performance
meetingSchema.index({ createdBy: 1, status: 1 });
meetingSchema.index({ meetingLink: 1 });
meetingSchema.index({ scheduledDate: 1 });
meetingSchema.index({ isScheduled: 1, startTime: 1 });
meetingSchema.index({ specificClass: 1 });
meetingSchema.index({ specificStudent: 1 });
meetingSchema.index({ specificTeacher: 1 });

// Static method to get meeting statistics
meetingSchema.statics.getStatsByAdmin = async function(adminId) {
  const stats = await this.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(adminId) } },
    {
      $group: {
        _id: null,
        totalMeetings: { $sum: 1 },
        scheduledMeetings: {
          $sum: { $cond: [{ $eq: ['$status', 'scheduled'] }, 1, 0] }
        },
        liveMeetings: {
          $sum: { $cond: [{ $eq: ['$status', 'live'] }, 1, 0] }
        },
        completedMeetings: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        totalParticipants: { $sum: '$participantCount' },
        totalDuration: { $sum: '$duration' }
      }
    }
  ]);
  
  return stats[0] || {
    totalMeetings: 0,
    scheduledMeetings: 0,
    liveMeetings: 0,
    completedMeetings: 0,
    totalParticipants: 0,
    totalDuration: 0
  };
};

export default mongoose.model('Meeting', meetingSchema);