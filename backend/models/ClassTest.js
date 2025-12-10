import mongoose from 'mongoose';

const studentMarkSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  obtainedMarks: {
    type: Number,
    required: true,
    min: 0
  },
  rollNo: {
    type: String
  },
  studentName: {
    type: String
  }
}, { _id: false });

const classTestSchema = new mongoose.Schema({
  // Test Information
  testName: {
    type: String,
    required: [true, 'Test name is required'],
    trim: true,
    maxlength: [200, 'Test name cannot exceed 200 characters']
  },
  testType: {
    type: String,
    enum: ['unit', 'mid-term', 'final', 'quiz', 'assignment'],
    default: 'unit'
  },
  testDate: {
    type: Date,
    required: [true, 'Test date is required']
  },
  totalMarks: {
    type: Number,
    required: [true, 'Total marks are required'],
    min: [1, 'Total marks must be at least 1']
  },
  
  // Class and Subject Information
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  className: {
    type: String,
    required: true
  },
  section: {
    type: String,
    required: true
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  },
  subjectName: {
    type: String,
    required: true
  },
  
  // Student Marks
  studentMarks: [studentMarkSchema],
  
  // Statistics
  averageMarks: {
    type: Number,
    default: 0
  },
  highestMarks: {
    type: Number,
    default: 0
  },
  lowestMarks: {
    type: Number,
    default: 0
  },
  passCount: {
    type: Number,
    default: 0
  },
  failCount: {
    type: Number,
    default: 0
  },
  
  // Status
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  publishedAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for formatted date
classTestSchema.virtual('formattedDate').get(function() {
  return this.testDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Virtual for pass percentage
classTestSchema.virtual('passPercentage').get(function() {
  if (this.studentMarks.length === 0) return 0;
  return Math.round((this.passCount / this.studentMarks.length) * 100);
});

// Pre-save middleware to calculate statistics
classTestSchema.pre('save', function(next) {
  if (this.studentMarks && this.studentMarks.length > 0) {
    const marks = this.studentMarks.map(s => s.obtainedMarks);
    this.averageMarks = marks.reduce((a, b) => a + b, 0) / marks.length;
    this.highestMarks = Math.max(...marks);
    this.lowestMarks = Math.min(...marks);
    
    // Assuming pass mark is 33%
    const passThreshold = this.totalMarks * 0.33;
    this.passCount = marks.filter(m => m >= passThreshold).length;
    this.failCount = marks.length - this.passCount;
  }
  
  if (this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
    this.status = 'published';
  }
  
  next();
});

// Indexes
classTestSchema.index({ classId: 1, testDate: 1 });
classTestSchema.index({ subjectId: 1, testDate: 1 });
classTestSchema.index({ createdBy: 1, status: 1 });
classTestSchema.index({ testDate: -1 });

// Static method to get class test statistics
classTestSchema.statics.getStatsByAdmin = async function(adminId) {
  const stats = await this.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(adminId) } },
    {
      $group: {
        _id: null,
        totalTests: { $sum: 1 },
        publishedTests: { $sum: { $cond: [{ $eq: ['$isPublished', true] }, 1, 0] } },
        totalMarksEntered: { $sum: { $size: '$studentMarks' } },
        avgClassAverage: { $avg: '$averageMarks' }
      }
    }
  ]);
  
  return stats[0] || {
    totalTests: 0,
    publishedTests: 0,
    totalMarksEntered: 0,
    avgClassAverage: 0
  };
};

// Static method to get subject-wise performance
classTestSchema.statics.getSubjectPerformance = async function(classId, adminId) {
  return this.aggregate([
    { 
      $match: { 
        classId: new mongoose.Types.ObjectId(classId),
        createdBy: new mongoose.Types.ObjectId(adminId),
        isPublished: true 
      } 
    },
    {
      $group: {
        _id: '$subjectName',
        subjectId: { $first: '$subjectId' },
        totalTests: { $sum: 1 },
        averageScore: { $avg: '$averageMarks' },
        highestAverage: { $max: '$averageMarks' },
        lowestAverage: { $min: '$averageMarks' }
      }
    },
    { $sort: { averageScore: -1 } }
  ]);
};

export default mongoose.model('ClassTest', classTestSchema);