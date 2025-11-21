const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    regNo: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    rollNo: { type: Number, required: true },
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    photoUrl: { type: String, trim: true },
    photoPublicId: { type: String, trim: true },
  },
  { timestamps: true }
);

studentSchema.index({ class: 1, rollNo: 1 }, { unique: true });

module.exports = mongoose.model('Student', studentSchema);