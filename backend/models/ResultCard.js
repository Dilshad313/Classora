import mongoose from 'mongoose';

const resultCardSchema = new mongoose.Schema({
  // Basic Information
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student is required']
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: [true, 'Exam is required']
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: [true, 'Class is required']
  },
  
  // Marks Summary
  subjects: [{
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject'
    },
    subjectName: {
      type: String,
      required: true
    },
    marksObtained: {
      type: Number,
      required: true
    },
    maxMarks: {
      type: Number,
      required: true
    },
    percentage: {
      type: Number,
      required: true
    },
    grade: {
      type: String,
      required: true
    }
  }],
  
  // Overall Results
  totalObtained: {
    type: Number,
    required: true,
    min: 0
  },
  totalMaxMarks: {
    type: Number,
    required: true,
    min: 0
  },
  overallPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  overallGrade: {
    type: String,
    required: true
  },
  overallRemarks: {
    type: String,
    required: true
  },
  resultStatus: {
    type: String,
    enum: ['PASS', 'FAIL'],
    required: true
  },
  
  // Metadata
  generatedDate: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  isArchived: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtuals
resultCardSchema.virtual('studentInfo', {
  ref: 'Student',
  localField: 'student',
  foreignField: '_id',
  justOne: true
});

resultCardSchema.virtual('examInfo', {
  ref: 'Exam',
  localField: 'exam',
  foreignField: '_id',
  justOne: true
});

resultCardSchema.virtual('classInfo', {
  ref: 'Class',
  localField: 'class',
  foreignField: '_id',
  justOne: true
});

// Indexes
resultCardSchema.index({ student: 1, exam: 1 }, { unique: true });
resultCardSchema.index({ class: 1 });
resultCardSchema.index({ createdBy: 1 });
resultCardSchema.index({ generatedDate: -1 });

export default mongoose.model('ResultCard', resultCardSchema);