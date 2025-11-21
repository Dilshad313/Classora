const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    employeeId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    fatherName: { type: String, trim: true },
    role: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    photoUrl: { type: String, trim: true },
    photoPublicId: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Employee', employeeSchema);