import mongoose from 'mongoose';

const feeStructureSchema = new mongoose.Schema({
  className: {
    type: String,
    required: [true, 'Class name is required'],
    trim: true,
    minlength: [2, 'Class name must be at least 2 characters long'],
    maxlength: [100, 'Class name cannot exceed 100 characters']
  },
  academicYear: {
    type: String,
    required: [true, 'Academic year is required'],
    trim: true,
    validate: {
      validator: function(v) {
        return /^\d{4}-\d{4}$/.test(v);
      },
      message: 'Academic year must be in format YYYY-YYYY (e.g., 2024-2025)'
    }
  },
  tuitionFee: {
    type: Number,
    required: [true, 'Tuition fee is required'],
    min: [0, 'Tuition fee cannot be negative'],
    get: v => Math.round(v * 100) / 100
  },
  admissionFee: {
    type: Number,
    default: 0,
    min: [0, 'Admission fee cannot be negative'],
    get: v => Math.round(v * 100) / 100
  },
  examFee: {
    type: Number,
    default: 0,
    min: [0, 'Exam fee cannot be negative'],
    get: v => Math.round(v * 100) / 100
  },
  labFee: {
    type: Number,
    default: 0,
    min: [0, 'Lab fee cannot be negative'],
    get: v => Math.round(v * 100) / 100
  },
  libraryFee: {
    type: Number,
    default: 0,
    min: [0, 'Library fee cannot be negative'],
    get: v => Math.round(v * 100) / 100
  },
  sportsFee: {
    type: Number,
    default: 0,
    min: [0, 'Sports fee cannot be negative'],
    get: v => Math.round(v * 100) / 100
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: [true, 'Created by admin is required']
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true
  },
  toObject: {
    virtuals: true,
    getters: true
  }
});

// Virtual for total fee calculation
feeStructureSchema.virtual('totalFee').get(function() {
  return this.tuitionFee +
         this.admissionFee +
         this.examFee +
         this.labFee +
         this.libraryFee +
         this.sportsFee;
});

// Virtual for other fees (excluding tuition)
feeStructureSchema.virtual('otherFees').get(function() {
  return this.admissionFee +
         this.examFee +
         this.labFee +
         this.libraryFee +
         this.sportsFee;
});

// Index for better query performance
feeStructureSchema.index({ className: 1, academicYear: 1, createdBy: 1 });
feeStructureSchema.index({ status: 1 });
feeStructureSchema.index({ createdBy: 1 });

// Check for duplicate class and academic year combination within same admin
feeStructureSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('className') || this.isModified('academicYear')) {
    const duplicate = await this.constructor.findOne({
      className: this.className,
      academicYear: this.academicYear,
      createdBy: this.createdBy,
      _id: { $ne: this._id }
    });
    
    if (duplicate) {
      const error = new Error(`Fee structure for ${this.className} in ${this.academicYear} already exists`);
      error.name = 'ValidationError';
      return next(error);
    }
  }
  next();
});

export default mongoose.model('FeeStructure', feeStructureSchema);