const mongoose = require('mongoose');

const feesParticularsSchema = new mongoose.Schema(
  {
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    data: {
      monthlyTutorFee: { type: String, default: '' },
      admissionFee: { type: String, default: '' },
      registrationFee: { type: String, default: '' },
      artMaterial: { type: String, default: '' },
      transport: { type: String, default: '' },
      books: { type: String, default: '' },
      uniform: { type: String, default: '' },
      free: { type: String, default: '' },
      others: { type: String, default: '' },
      previousBalance: { type: String, default: '' },
      becomingFee: { type: String, default: '' }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('FeesParticulars', feesParticularsSchema);
