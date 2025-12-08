import mongoose from 'mongoose';

const examMarkSchema = new mongoose.Schema({
  // References
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
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student is required']
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: [true, 'Subject is required']
  },
  
  // Marks Information
  marksObtained: {
    type: Number,
    required: [true, 'Marks obtained is required'],
    min: [0, 'Marks cannot be negative'],
    max: [100, 'Marks cannot exceed 100']
  },
  maxMarks: {
    type: Number,
    default: 100,
    min: [0, 'Max marks cannot be negative'],
    max: [200, 'Max marks cannot exceed 200']
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
  remarks: {
    type: String,
    trim: true,
    maxlength: [500, 'Remarks cannot exceed 500 characters']
  },
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
examMarkSchema.index({ exam: 1, class: 1, student: 1, subject: 1 }, { unique: true });
examMarkSchema.index({ student: 1 });
examMarkSchema.index({ class: 1 });
examMarkSchema.index({ exam: 1 });
examMarkSchema.index({ createdBy: 1 });

// Pre-save middleware to calculate percentage and grade
examMarkSchema.pre('save', function(next) {
  if (this.marksObtained && this.maxMarks) {
    this.percentage = (this.marksObtained / this.maxMarks) * 100;
    
    // Calculate grade based on percentage
    if (this.percentage >= 90) {
      this.grade = 'A+';
      this.remarks = 'Outstanding';
    } else if (this.percentage >= 80) {
      this.grade = 'A';
      this.remarks = 'Excellent';
    } else if (this.percentage >= 70) {
      this.grade = 'B+';
      this.remarks = 'Very Good';
    } else if (this.percentage >= 60) {
      this.grade = 'B';
      this.remarks = 'Good';
    } else if (this.percentage >= 50) {
      this.grade = 'C';
      this.remarks = 'Average';
    } else if (this.percentage >= 40) {
      this.grade = 'D';
      this.remarks = 'Pass';
    } else {
      this.grade = 'F';
      this.remarks = 'Fail';
    }
  }
  next();
});

export default mongoose.model('ExamMark', examMarkSchema);