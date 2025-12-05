import mongoose from 'mongoose';

const homeworkSchema = new mongoose.Schema({
  // Homework Details
  title: {
    type: String,
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  date: {
    type: Date,
    required: [true, 'Homework date is required']
  },
  dueDate: {
    type: Date
  },
  details: {
    type: String,
    required: [true, 'Homework details are required'],
    trim: true
  },
  attachments: [{
    fileName: String,
    fileUrl: String,
    publicId: String,
    fileType: String,
    fileSize: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // References
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: [true, 'Class is required']
  },
  section: {
    type: String,
    default: 'A'
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: [true, 'Subject is required']
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: [true, 'Teacher is required']
  },
  
  // Status and Tracking
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
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

// Virtuals
homeworkSchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
});

homeworkSchema.virtual('formattedDueDate').get(function() {
  if (!this.dueDate) return null;
  return this.dueDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
});

// Indexes for better query performance
homeworkSchema.index({ date: 1 });
homeworkSchema.index({ class: 1, subject: 1 });
homeworkSchema.index({ teacher: 1 });
homeworkSchema.index({ createdBy: 1, status: 1 });
homeworkSchema.index({ createdAt: -1 });

// Middleware to validate date
homeworkSchema.pre('save', function(next) {
  if (this.dueDate && this.dueDate < this.date) {
    next(new Error('Due date cannot be before homework date'));
  }
  next();
});

export default mongoose.model('Homework', homeworkSchema);