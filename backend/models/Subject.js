import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Subject name is required'],
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Subject code is required'],
    trim: true,
    uppercase: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  department: {
    type: String,
    trim: true
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
subjectSchema.index({ name: 1, createdBy: 1 });
subjectSchema.index({ code: 1, createdBy: 1 });

// Prevent duplicate subject codes per user
subjectSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('code')) {
    const duplicate = await this.constructor.findOne({
      code: this.code,
      createdBy: this.createdBy,
      _id: { $ne: this._id }
    });
    
    if (duplicate) {
      const error = new Error(`Subject code ${this.code} already exists`);
      error.name = 'ValidationError';
      return next(error);
    }
  }
  next();
});

export default mongoose.model('Subject', subjectSchema);