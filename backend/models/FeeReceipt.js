const mongoose = require('mongoose');

const feeItemSchema = new mongoose.Schema(
  {
    item: { type: String, required: true },
    amount: { type: Number, required: true },
  },
  { _id: false }
);

const feeReceiptSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    receiptNumber: { type: String, required: true, unique: true },
    paymentDate: { type: Date },
    academicYear: { type: String, required: true },
    term: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, required: true },
    status: { type: String, enum: ['paid', 'pending', 'overdue'], required: true },
    paymentMethod: { type: String },
    transactionId: { type: String },
    dueDate: { type: Date },
    feeBreakdown: [feeItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('FeeReceipt', feeReceiptSchema);