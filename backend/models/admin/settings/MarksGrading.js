const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema(
  {
    grade: { type: String, required: true },
    minMarks: { type: Number, required: true },
    maxMarks: { type: Number, required: true },
    status: { type: String, enum: ['PASS', 'FAIL'], default: 'PASS' }
  },
  { _id: false }
);

const marksGradingSchema = new mongoose.Schema(
  {
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    grades: [gradeSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('MarksGrading', marksGradingSchema);
