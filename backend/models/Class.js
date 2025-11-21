const mongoose = require('mongoose');

const classSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    section: { type: String, required: true, trim: true },
    grade: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

classSchema.index({ grade: 1, section: 1 }, { unique: true });

module.exports = mongoose.model('Class', classSchema);