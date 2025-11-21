const mongoose = require('mongoose');

const accountStatementSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    description: { type: String, required: true },
    reference: { type: String },
    debit: { type: Number, default: 0 },
    credit: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AccountStatement', accountStatementSchema);