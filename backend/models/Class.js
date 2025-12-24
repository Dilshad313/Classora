// models/Class.js

import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  // Basic Information
  className: {
    type: String,
    required: [true, 'Class name is required'],
    trim: true,
    maxlength: [100, 'Class name cannot exceed 100 characters']
  },
  section: {
    type: String,
    required: [true, 'Section is required'],
    trim: true,
    maxlength: [20, 'Section cannot exceed 20 characters']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [100, 'Subject cannot exceed 100 characters']
  },
  teacher: {
    type: String,
    trim: true,
    default: 'Not assigned'
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    default: null
  },
  room: {
    type: String,
    trim: true,
    default: 'TBA'
  },
  
  // Schedule
  schedule: {
    type: {
      type: String,
      enum: ['regular', 'intensive', 'weekend', 'custom'],
      default: 'regular'
    },
    startDate: {
      type: Date,
      default: null
    },
    endDate: {
      type: Date,
      default: null
    },
    days: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }],
    startTime: {
      type: String,
      default: ''
    },
    endTime: {
      type: String,
      default: ''
    }
  },
  
  // Students
  maxStudents: {
    type: Number,
    default: 0,
    min: [0, 'Maximum students cannot be negative']
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  studentCount: {
    type: Number,
    default: 0
  },
  
  // Fees
  fees: {
    type: {
      type: String,
      enum: ['free', 'one-time', 'monthly', 'quarterly', 'yearly'],
      default: 'free'
    },
    amount: {
      type: Number,
      default: 0,
      min: [0, 'Amount cannot be negative']
    },
    currency: {
      type: String,
      enum: ['USD', 'EUR', 'GBP', 'JPY', 'INR', 'CAD', 'AUD'],
      default: 'USD'
    }
  },
  
  // Resources
  description: {
    type: String,
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
    default: ''
  },
  materials: [{
    fileName: {
      type: String,
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    fileType: {
      type: String,
      required: true
    },
    fileSize: {
      type: Number,
      required: true
    },
    fileUrl: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      default: null
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Statistics
  attendancePercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'completed', 'cancelled'],
    default: 'active'
  },
  
  // Created by (Admin who created the class)
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
classSchema.virtual('formattedSchedule').get(function() {
  if (!this.schedule.days || this.schedule.days.length === 0) {
    return 'No schedule set';
  }
  
  const days = this.schedule.days.map(d => d.charAt(0).toUpperCase() + d.slice(1, 3)).join(', ');
  const time = this.schedule.startTime && this.schedule.endTime 
    ? `${this.schedule.startTime} - ${this.schedule.endTime}` 
    : '';
  
  return time ? `${days} | ${time}` : days;
});

// Virtual for enrollment status
classSchema.virtual('enrollmentStatus').get(function() {
  if (this.maxStudents === 0) return 'Open';
  if (this.studentCount >= this.maxStudents) return 'Full';
  if (this.studentCount >= this.maxStudents * 0.9) return 'Almost Full';
  return 'Available';
});

// Indexes
classSchema.index({ createdBy: 1, status: 1 });
classSchema.index({ className: 1, section: 1 });
classSchema.index({ subject: 1 });
classSchema.index({ teacher: 1 });
classSchema.index({ teacherId: 1 });
classSchema.index({ status: 1 });

// Pre-save middleware to update student count
classSchema.pre('save', function(next) {
  if (this.students) {
    this.studentCount = this.students.length;
  }
  next();
});

// Static method to get class statistics
classSchema.statics.getStatsByAdmin = async function(adminId) {
  const stats = await this.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(adminId) } },
    {
      $group: {
        _id: null,
        totalClasses: { $sum: 1 },
        activeClasses: {
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
        },
        totalStudents: { $sum: '$studentCount' },
        avgAttendance: { $avg: '$attendancePercentage' }
      }
    }
  ]);
  
  return stats[0] || {
    totalClasses: 0,
    activeClasses: 0,
    totalStudents: 0,
    avgAttendance: 0
  };
};

export default mongoose.model('Class', classSchema);