const mongoose = require('mongoose');

const feeItemSchema = new mongoose.Schema(
  {
    className: { type: String, required: true },
    academicYear: { type: String, required: true },
    tuitionFee: { type: String, default: '' },
    admissionFee: { type: String, default: '' },
    examFee: { type: String, default: '' },
    labFee: { type: String, default: '' },
    libraryFee: { type: String, default: '' },
    sportsFee: { type: String, default: '' },
    status: { type: String, default: 'active' }
  },
  { _id: false }
);

const feeStructureSchema = new mongoose.Schema(
  {
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    items: [feeItemSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('FeeStructure', feeStructureSchema);
