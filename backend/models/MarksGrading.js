import mongoose from 'mongoose';

const marksGradingSchema = new mongoose.Schema({
  grade: {
    type: String,
    required: [true, 'Grade is required'],
    trim: true,
    uppercase: true,
    minlength: [1, 'Grade must be at least 1 character long'],
    maxlength: [10, 'Grade cannot exceed 10 characters']
  },
  minMarks: {
    type: Number,
    required: [true, 'Minimum marks is required'],
    min: [0, 'Minimum marks cannot be less than 0'],
    max: [100, 'Minimum marks cannot exceed 100']
  },
  maxMarks: {
    type: Number,
    required: [true, 'Maximum marks is required'],
    min: [0, 'Maximum marks cannot be less than 0'],
    max: [100, 'Maximum marks cannot exceed 100']
  },
  status: {
    type: String,
    enum: {
      values: ['PASS', 'FAIL'],
      message: 'Status must be either PASS or FAIL'
    },
    required: [true, 'Status is required'],
    default: 'PASS'
  },
  order: {
    type: Number,
    default: 0
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

// Virtual for grade range display
marksGradingSchema.virtual('rangeDisplay').get(function() {
  return `${this.minMarks}-${this.maxMarks}`;
});

// Virtual for marks difference
marksGradingSchema.virtual('marksDifference').get(function() {
  return this.maxMarks - this.minMarks + 1;
});

// Index for better query performance
marksGradingSchema.index({ minMarks: 1, maxMarks: 1, createdBy: 1 });
marksGradingSchema.index({ order: 1 });
marksGradingSchema.index({ status: 1 });
marksGradingSchema.index({ createdBy: 1 });

// Pre-save validation
marksGradingSchema.pre('save', function(next) {
  // Ensure minMarks is less than or equal to maxMarks
  if (this.minMarks > this.maxMarks) {
    return next(new Error('Minimum marks cannot be greater than maximum marks'));
  }
  
  // Convert grade to uppercase
  if (this.grade) {
    this.grade = this.grade.toUpperCase();
  }
  
  next();
});

// Static method to check for overlapping ranges within same admin
marksGradingSchema.statics.checkOverlap = async function(minMarks, maxMarks, createdBy, excludeId = null) {
  const query = {
    createdBy,
    $or: [
      // New range starts within existing range
      { minMarks: { $lte: minMarks }, maxMarks: { $gte: minMarks } },
      // New range ends within existing range
      { minMarks: { $lte: maxMarks }, maxMarks: { $gte: maxMarks } },
      // New range completely contains existing range
      { minMarks: { $gte: minMarks }, maxMarks: { $lte: maxMarks } }
    ]
  };
  
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  
  const overlapping = await this.findOne(query);
  return overlapping;
};

// Static method to validate complete grading system for specific admin
marksGradingSchema.statics.validateGradingSystem = async function(createdBy) {
  const grades = await this.find({ createdBy }).sort({ minMarks: 1 });
  
  if (grades.length === 0) {
    return { valid: false, errors: ['No grading system defined'] };
  }
  
  const errors = [];
  
  // Check if starts from 0
  if (grades[0].minMarks !== 0) {
    errors.push('Grading system should start from 0');
  }
  
  // Check if ends at 100
  if (grades[grades.length - 1].maxMarks !== 100) {
    errors.push('Grading system should end at 100');
  }
  
  // Check for gaps
  for (let i = 0; i < grades.length - 1; i++) {
    const current = grades[i];
    const next = grades[i + 1];
    
    if (current.maxMarks + 1 !== next.minMarks) {
      errors.push(
        `Gap between ${current.grade} (${current.maxMarks}) and ${next.grade} (${next.minMarks})`
      );
    }
  }
  
  return {
    valid: errors.length === 0,
    errors: errors
  };
};

// Static method to get grade for marks for specific admin
marksGradingSchema.statics.getGradeForMarks = async function(marks, createdBy) {
  if (marks < 0 || marks > 100) {
    throw new Error('Marks must be between 0 and 100');
  }
  
  const grade = await this.findOne({
    createdBy,
    minMarks: { $lte: marks },
    maxMarks: { $gte: marks }
  });
  
  return grade;
};

// Static method to initialize default grading system for specific admin
marksGradingSchema.statics.initializeDefault = async function(createdBy) {
  const count = await this.countDocuments({ createdBy });
  
  if (count === 0) {
    const defaultGrades = [
      { grade: 'A+', minMarks: 80, maxMarks: 100, status: 'PASS', order: 1, createdBy },
      { grade: 'A', minMarks: 70, maxMarks: 79, status: 'PASS', order: 2, createdBy },
      { grade: 'B+', minMarks: 60, maxMarks: 69, status: 'PASS', order: 3, createdBy },
      { grade: 'B', minMarks: 50, maxMarks: 59, status: 'PASS', order: 4, createdBy },
      { grade: 'C', minMarks: 40, maxMarks: 49, status: 'PASS', order: 5, createdBy },
      { grade: 'D', minMarks: 33, maxMarks: 39, status: 'PASS', order: 6, createdBy },
      { grade: 'F', minMarks: 0, maxMarks: 32, status: 'FAIL', order: 7, createdBy }
    ];
    
    await this.insertMany(defaultGrades);
    console.log('✅ Default grading system initialized for admin:', createdBy);
  }
};

export default mongoose.model('MarksGrading', marksGradingSchema);