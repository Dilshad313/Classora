import mongoose from 'mongoose';

const timePeriodSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Period name is required'],
    trim: true
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter valid time format (HH:MM)']
  },
  endTime: {
    type: String,
    required: [true, 'End time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter valid time format (HH:MM)']
  },
  duration: {
    type: Number,
    min: [1, 'Duration must be at least 1 minute']
  },
  type: {
    type: String,
    enum: ['class', 'break'],
    default: 'class'
  },
  order: {
    type: Number,
    required: [true, 'Order is required'],
    min: [1, 'Order must be at least 1']
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

// Virtual for formatted time range
timePeriodSchema.virtual('timeRange').get(function() {
  return `${this.startTime} - ${this.endTime}`;
});

// Calculate duration before saving
timePeriodSchema.pre('save', function(next) {
  if (this.startTime && this.endTime) {
    const [startHour, startMin] = this.startTime.split(':').map(Number);
    const [endHour, endMin] = this.endTime.split(':').map(Number);
    
    const startTotalMinutes = startHour * 60 + startMin;
    const endTotalMinutes = endHour * 60 + endMin;
    
    this.duration = endTotalMinutes - startTotalMinutes;
    
    if (this.duration <= 0) {
      const error = new Error('End time must be after start time');
      error.name = 'ValidationError';
      return next(error);
    }
  }
  next();
});

// Indexes
timePeriodSchema.index({ createdBy: 1, order: 1 });
timePeriodSchema.index({ type: 1, createdBy: 1 });

// Prevent duplicate period names for same user
timePeriodSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('name')) {
    const duplicate = await this.constructor.findOne({
      name: this.name,
      createdBy: this.createdBy,
      _id: { $ne: this._id }
    });
    
    if (duplicate) {
      const error = new Error(`Period ${this.name} already exists`);
      error.name = 'ValidationError';
      return next(error);
    }
  }
  next();
});

export default mongoose.model('TimePeriod', timePeriodSchema);