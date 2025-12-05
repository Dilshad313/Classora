import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Class name is required'],
    trim: true,
    minlength: [2, 'Class name must be at least 2 characters long'],
    maxlength: [100, 'Class name cannot exceed 100 characters']
  },
  section: {
    type: String,
    required: [true, 'Section is required'],
    trim: true,
    maxlength: [50, 'Section cannot exceed 50 characters']
  },
  teacher: {
    type: String,
    default: 'Unassigned',
    trim: true
  },
  studentCount: {
    type: Number,
    default: 0,
    min: [0, 'Student count cannot be negative']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: [true, 'Created by admin is required']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full class name
classSchema.virtual('fullName').get(function() {
  return `${this.name} - Section ${this.section}`;
});

// Index for better query performance
classSchema.index({ name: 1, section: 1, createdBy: 1 });
classSchema.index({ createdBy: 1 });

// Prevent duplicate class-section combination per admin
classSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('name') || this.isModified('section')) {
    const duplicate = await this.constructor.findOne({
      name: this.name,
      section: this.section,
      createdBy: this.createdBy,
      _id: { $ne: this._id }
    });
    
    if (duplicate) {
      const error = new Error(`Class ${this.name} - Section ${this.section} already exists`);
      error.name = 'ValidationError';
      return next(error);
    }
  }
  next();
});

export default mongoose.model('ClassSub', classSchema);