import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const studentSchema = new mongoose.Schema({
  // Personal Information
  studentName: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true,
    minlength: [2, 'Student name must be at least 2 characters long'],
    maxlength: [100, 'Student name cannot exceed 100 characters']
  },
  registrationNo: {
  type: String,
  required: [true, 'Registration number is required'],
  unique: false,
  trim: true,
  uppercase: true,
  validate: {
    validator: function(v) {
      return /^[A-Z0-9]+$/.test(v);
    },
    message: 'Registration number should contain only letters and numbers'
  }
},
  picture: {
    url: String,
    publicId: String
  },
  dateOfAdmission: {
    type: Date,
    required: [true, 'Date of admission is required']
  },
  selectClass: {
    type: String,
    required: [true, 'Class is required']
  },
  section: {
    type: String,
    default: 'A'
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: false,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Please enter a valid email address'
    }
  },
  discountInFee: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%']
  },
  mobileNo: {
    type: String,
    trim: true
  },
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other', '']
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', '']
  },
  address: {
    type: String,
    trim: true
  },

  // Parent/Guardian Information
  fatherName: {
    type: String,
    trim: true
  },
  fatherMobile: {
    type: String,
    trim: true
  },
  fatherOccupation: {
    type: String,
    trim: true
  },
  motherName: {
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

  // Additional Information
  orphanStudent: {
    type: String,
    enum: ['yes', 'no', '']
  },
  caste: {
    type: String,
    trim: true
  },
  osc: {
    type: String,
    enum: ['yes', 'no', '']
  },
  identificationMark: {
    type: String,
    trim: true
  },
  previousSchool: {
    type: String,
    trim: true
  },
  religion: {
    type: String,
    trim: true
  },
  previousIdBoardRollNo: {
    type: String,
    trim: true
  },
  selectFamily: {
    type: String,
    trim: true
  },
  disease: {
    type: String,
    trim: true
  },
  additionalNote: {
    type: String,
    trim: true
  },
  totalSiblings: {
    type: Number,
    default: 0,
    min: 0
  },

  // Documents
  documents: [{
    name: String,
    url: String,
    publicId: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Login Credentials
  username: {
  type: String,
  unique: false,
  sparse: true,
  trim: true,
  lowercase: true,
  minlength: [3, 'Username must be at least 3 characters long']
},
  password: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters long']
  },
  plainPassword: {
    type: String
  },

  // Status and Tracking
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  attendance: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  feeRemaining: {
    type: Number,
    default: 0,
    min: 0
  },
  rollNumber: String,

  // Admission Details
  admissionNumber: {
    type: String,
    unique: false,
    sparse: true
  },

  // Ownership (Admin who created the student)
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

// Indexes to enforce per-admin uniqueness and query performance
studentSchema.index({ createdBy: 1 });
studentSchema.index({ registrationNo: 1, createdBy: 1 }, { unique: true });
studentSchema.index({ admissionNumber: 1, createdBy: 1 }, { unique: true, sparse: true });
studentSchema.index({ email: 1, createdBy: 1 }, { unique: true });
studentSchema.index({ username: 1, createdBy: 1 }, { unique: true, sparse: true });

// Virtual for full class display
studentSchema.virtual('classDisplay').get(function() {
  return `Grade ${this.selectClass} - ${this.section}`;
});

// Virtual for age calculation
studentSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Hash password before saving
studentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
studentSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate username if not provided
studentSchema.pre('save', function(next) {
  if (!this.username && this.studentName) {
    const nameParts = this.studentName.toLowerCase().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1].charAt(0) : '';
    this.username = `${firstName}${lastName}${this.registrationNo.toLowerCase()}`.replace(/\s+/g, '');
  }
  next();
});

// Static method to generate admission number
studentSchema.statics.generateAdmissionNumber = async function() {
  const currentYear = new Date().getFullYear();
  const prefix = `ADM${currentYear}`;
  
  // Find the highest admission number for this year
  const lastStudent = await this.findOne({
    admissionNumber: { $regex: `^${prefix}` }
  }).sort({ admissionNumber: -1 });
  
  let nextNumber = 1;
  
  if (lastStudent && lastStudent.admissionNumber) {
    // Extract the number part from the last admission number
    const match = lastStudent.admissionNumber.match(new RegExp(`^${prefix}(\\d+)$`));
    if (match && match[1]) {
      nextNumber = parseInt(match[1], 10) + 1;
    }
  }
  
  // Ensure we generate a unique admission number
  let attempts = 0;
  const maxAttempts = 1000;
  
  while (attempts < maxAttempts) {
    const admissionNumber = `${prefix}${String(nextNumber).padStart(4, '0')}`;
    
    // Check if this admission number already exists
    const existing = await this.findOne({ admissionNumber: admissionNumber });
    
    if (!existing) {
      return admissionNumber;
    }
    
    // If it exists, try next number
    nextNumber++;
    attempts++;
  }
  
  // Fallback: use timestamp if we can't generate a unique number
  return `${prefix}${Date.now().toString().slice(-6)}`;
};

// Index for better query performance
studentSchema.index({ registrationNo: 1 });
studentSchema.index({ admissionNumber: 1 });
studentSchema.index({ selectClass: 1, section: 1 });
studentSchema.index({ status: 1 });
studentSchema.index({ studentName: 'text', registrationNo: 'text' });

export default mongoose.model('Student', studentSchema);