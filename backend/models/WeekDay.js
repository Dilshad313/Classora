import mongoose from 'mongoose';

const weekDaySchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Day name is required'],
    trim: true
  },
  shortName: {
    type: String,
    required: [true, 'Short name is required'],
    trim: true,
    maxlength: [3, 'Short name cannot exceed 3 characters']
  },
  isActive: {
    type: Boolean,
    default: true
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

// Indexes
weekDaySchema.index({ createdBy: 1, order: 1 });
weekDaySchema.index({ isActive: 1, createdBy: 1 });

// Prevent duplicate day names for same user
weekDaySchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('name')) {
    const duplicate = await this.constructor.findOne({
      name: this.name,
      createdBy: this.createdBy,
      _id: { $ne: this._id }
    });
    
    if (duplicate) {
      const error = new Error(`Day ${this.name} already exists`);
      error.name = 'ValidationError';
      return next(error);
    }
  }
  
  if (this.isNew || this.isModified('shortName')) {
    const duplicate = await this.constructor.findOne({
      shortName: this.shortName,
      createdBy: this.createdBy,
      _id: { $ne: this._id }
    });
    
    if (duplicate) {
      const error = new Error(`Short name ${this.shortName} already exists`);
      error.name = 'ValidationError';
      return next(error);
    }
  }
  next();
});

export default mongoose.model('WeekDay', weekDaySchema);