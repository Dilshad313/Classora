const mongoose = require('mongoose');

const studentAttendanceSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    records: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
        status: { type: String, enum: ['present', 'absent', 'leave'], required: true },
      }
    ],
  },
  { timestamps: true }
);

studentAttendanceSchema.index({ date: 1, class: 1 }, { unique: true });

module.exports = mongoose.model('AttendanceStudent', studentAttendanceSchema);