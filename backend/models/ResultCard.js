import mongoose from 'mongoose';

const resultCardSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
      required: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    institute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InstituteProfile',
      required: true,
    },
    subjects: [
      {
        subject: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Subject',
        },
        subjectName: {
          type: String,
          required: true,
        },
        marksObtained: {
          type: Number,
          required: true,
        },
        maxMarks: {
          type: Number,
          required: true,
        },
        percentage: {
          type: Number,
        },
        grade: {
          type: String,
        },
      },
    ],
    totalObtained: {
      type: Number,
      required: true,
    },
    totalMaxMarks: {
      type: Number,
      required: true,
    },
    overallPercentage: {
      type: Number,
      required: true,
    },
    overallGrade: {
      type: String,
      required: true,
    },
    overallRemarks: {
      type: String,
    },
    resultStatus: {
      type: String,
      enum: ['PASS', 'FAIL'],
      required: true,
    },
    generatedDate: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const ResultCard = mongoose.model('ResultCard', resultCardSchema);

export default ResultCard;