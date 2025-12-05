import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  subjectName: {
    type: String,
    required: [true, 'Subject name is required'],
    trim: true
  },
  totalMarks: {
    type: Number,
    required: [true, 'Total marks is required'],
    min: [0, 'Total marks cannot be negative']
  },
  isRequired: {
    type: Boolean,
    default: true
  }
}, { _id: true });

const subjectAssignmentSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: [true, 'Class ID is required']
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: [true, 'Created by admin is required']
  },
  subjects: {
    type: [subjectSchema],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one subject is required'
    }
  },
  totalExamMarks: {
    type: Number,
    default: 0
  },
  academicYear: {
    type: String,
    default: () => {
      const year = new Date().getFullYear();
      return `${year}-${year + 1}`;
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Calculate total marks before saving
subjectAssignmentSchema.pre('save', function(next) {
  if (this.subjects && this.subjects.length > 0) {
    this.totalExamMarks = this.subjects.reduce((acc, curr) => {
      return acc + (curr.totalMarks || 0);
    }, 0);
  }
  next();
});

// Index for better query performance
subjectAssignmentSchema.index({ classId: 1, createdBy: 1 });
subjectAssignmentSchema.index({ createdBy: 1 });
subjectAssignmentSchema.index({ teacher: 1 });

export default mongoose.model('SubjectAssignment', subjectAssignmentSchema);