import mongoose from 'mongoose';

const feePaymentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  studentName: {
    type: String,
    required: true,
    trim: true
  },
  registrationNo: {
    type: String,
    required: true,
    trim: true
  },
  class: {
    type: String,
    required: true
  },
  guardianName: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  feeMonth: {
    type: Date,
    required: true
  },
  depositType: {
    type: String,
    enum: ['cash', 'cheque', 'online', 'card', 'upi'],
    required: true
  },
  particulars: [{
    particular: String,
    amount: Number
  }],
  receiptNo: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['completed', 'pending', 'cancelled'],
    default: 'completed'
  },
  collectedBy: {
    type: String,
    default: 'Admin'
  }
}, {
  timestamps: true
});

// Generate receipt number before saving
feePaymentSchema.pre('save', async function(next) {
  if (!this.receiptNo) {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const count = await this.constructor.countDocuments();
    this.receiptNo = `REC${year}${month}${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Virtual for formatted fee month
feePaymentSchema.virtual('formattedFeeMonth').get(function() {
  return this.feeMonth.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });
});

// Virtual for formatted payment date
feePaymentSchema.virtual('formattedPaymentDate').get(function() {
  return this.paymentDate.toLocaleDateString();
});

// Indexes for better query performance
feePaymentSchema.index({ studentId: 1 });
feePaymentSchema.index({ registrationNo: 1 });
feePaymentSchema.index({ feeMonth: 1 });
feePaymentSchema.index({ class: 1 });
feePaymentSchema.index({ depositType: 1 });
feePaymentSchema.index({ receiptNo: 1 });

const FeePayment = mongoose.model('FeePayment', feePaymentSchema);

export default FeePayment;