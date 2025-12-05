import mongoose from 'mongoose';

const classroomSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Classroom name is required'],
    trim: true,
    unique: true
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: [1, 'Capacity must be at least 1']
  },
  floor: {
    type: Number,
    required: [true, 'Floor is required'],
    min: [0, 'Floor cannot be negative']
  },
  building: {
    type: String,
    required: [true, 'Building is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['Standard', 'Laboratory', 'Computer Lab', 'Auditorium'],
    default: 'Standard'
  },
  isAvailable: {
    type: Boolean,
    default: true
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

// Index for better query performance
classroomSchema.index({ name: 1, building: 1, createdBy: 1 });
classroomSchema.index({ isAvailable: 1 });
classroomSchema.index({ type: 1 });

// Prevent duplicate classroom names
classroomSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('name')) {
    const duplicate = await this.constructor.findOne({
      name: this.name,
      createdBy: this.createdBy,
      _id: { $ne: this._id }
    });
    
    if (duplicate) {
      const error = new Error(`Classroom ${this.name} already exists`);
      error.name = 'ValidationError';
      return next(error);
    }
  }
  next();
});

export default mongoose.model('Classroom', classroomSchema);