const mongoose = require('mongoose');

const employeeAttendanceSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    records: [
      {
        employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
        status: { type: String, enum: ['present', 'absent', 'leave'], required: true },
      }
    ],
  },
  { timestamps: true }
);

employeeAttendanceSchema.index({ date: 1 }, { unique: true });

module.exports = mongoose.model('AttendanceEmployee', employeeAttendanceSchema);