import mongoose from 'mongoose';

const parentSchema = new mongoose.Schema({
  // Student Information
  studentName: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true
  },
  studentId: {
    type: String,
    required: [true, 'Student ID is required'],
    trim: true,
    unique: true
  },
  class: {
    type: String,
    required: [true, 'Class is required'],
    trim: true
  },
  section: {
    type: String,
    default: 'A'
  },

  // Father Information
  fatherName: {
    type: String,
    required: [true, 'Father name is required'],
    trim: true
  },
  fatherNationalId: {
    type: String,
    trim: true
  },
  fatherEducation: {
    type: String,
    trim: true
  },
  fatherMobile: {
    type: String,
    required: [true, 'Father mobile number is required'],
    trim: true
  },
  fatherOccupation: {
    type: String,
    trim: true
  },
  fatherProfession: {
    type: String,
    trim: true
  },
  fatherIncome: {
    type: Number,
    min: 0
  },

  // Mother Information
  motherName: {
    type: String,
    required: [true, 'Mother name is required'],
    trim: true
  },
  motherEducation: {
    type: String,
    trim: true
  },
  motherMobile: {
    type: String,
    trim: true
  },
  motherOccupation: {
    type: String,
    trim: true
  },
  motherProfession: {
    type: String,
    trim: true
  },
  motherIncome: {
    type: Number,
    min: 0
  },

  // Contact Information
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  address: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  pincode: {
    type: String,
    trim: true
  },

  // Status
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
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
parentSchema.index({ studentId: 1, createdBy: 1 });
parentSchema.index({ fatherName: 1, createdBy: 1 });
parentSchema.index({ studentName: 1, createdBy: 1 });
parentSchema.index({ class: 1, createdBy: 1 });
parentSchema.index({ status: 1, createdBy: 1 });

// Virtual for full class display
parentSchema.virtual('classDisplay').get(function() {
  return `${this.class} - ${this.section}`;
});

// Virtual for total income
parentSchema.virtual('totalIncome').get(function() {
  const fatherIncome = this.fatherIncome || 0;
  const motherIncome = this.motherIncome || 0;
  return fatherIncome + motherIncome;
});

export default mongoose.model('Parent', parentSchema);