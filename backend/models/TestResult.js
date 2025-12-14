import mongoose from 'mongoose';

const testResultSchema = new mongoose.Schema({
  // Test Information
  testName: {
    type: String,
    required: [true, 'Test name is required'],
    trim: true
  },
  testType: {
    type: String,
    enum: ['unit', 'midterm', 'final', 'quiz', 'assignment'],
    default: 'unit'
  },
  testDate: {
    type: Date,
    required: [true, 'Test date is required']
  },
  maxScore: {
    type: Number,
    required: [true, 'Maximum score is required'],
    min: 0
  },

  // Student Information
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  class: {
    type: String,
    required: [true, 'Class is required']
  },
  section: {
    type: String,
    default: 'A'
  },

  // Subject Information
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  subjectCode: {
    type: String,
    trim: true
  },

  // Scores
  score: {
    type: Number,
    required: [true, 'Score is required'],
    min: 0
  },
  percentage: {
    type: Number,
    min: 0,
    max: 100
  },
  grade: {
    type: String,
    trim: true
  },

  // Performance Details
  rank: {
    type: Number,
    min: 1
  },
  totalStudents: {
    type: Number,
    min: 1
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
testResultSchema.index({ student: 1, subject: 1, testDate: 1 });
testResultSchema.index({ testDate: 1, createdBy: 1 });
testResultSchema.index({ class: 1, section: 1, createdBy: 1 });
testResultSchema.index({ grade: 1, createdBy: 1 });

// Pre-save middleware to calculate percentage and grade
testResultSchema.pre('save', function(next) {
  // Calculate percentage
  if (this.maxScore > 0) {
    this.percentage = (this.score / this.maxScore) * 100;
  }

  // Calculate grade based on percentage
  if (this.percentage >= 90) {
    this.grade = 'A+';
  } else if (this.percentage >= 80) {
    this.grade = 'A';
  } else if (this.percentage >= 70) {
    this.grade = 'B+';
  } else if (this.percentage >= 60) {
    this.grade = 'B';
  } else if (this.percentage >= 50) {
    this.grade = 'C';
  } else if (this.percentage >= 40) {
    this.grade = 'D';
  } else {
    this.grade = 'F';
  }

  next();
});

// Static method to get student performance summary
testResultSchema.statics.getStudentPerformance = async function(studentId, createdBy) {
  const results = await this.aggregate([
    {
      $match: {
        student: new mongoose.Types.ObjectId(studentId),
        createdBy: new mongoose.Types.ObjectId(createdBy)
      }
    },
    {
      $group: {
        _id: '$subject',
        totalTests: { $sum: 1 },
        averageScore: { $avg: '$score' },
        averagePercentage: { $avg: '$percentage' },
        bestScore: { $max: '$score' },
        worstScore: { $min: '$score' },
        latestTest: { $max: '$testDate' }
      }
    },
    {
      $project: {
        subject: '$_id',
        totalTests: 1,
        averageScore: { $round: ['$averageScore', 2] },
        averagePercentage: { $round: ['$averagePercentage', 2] },
        bestScore: 1,
        worstScore: 1,
        latestTest: 1
      }
    },
    { $sort: { subject: 1 } }
  ]);

  return results;
};

export default mongoose.model('TestResult', testResultSchema);