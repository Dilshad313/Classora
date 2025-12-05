import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const salarySchema = new mongoose.Schema({
  // Employee reference
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: [true, 'Employee is required']
  },
  
  // Salary details
  month: {
    type: String,
    required: [true, 'Salary month is required'],
    match: [/^\d{4}-\d{2}$/, 'Please provide month in YYYY-MM format']
  },
  
  salaryDate: {
    type: Date,
    required: [true, 'Salary date is required']
  },
  
  fixedSalary: {
    type: Number,
    required: [true, 'Fixed salary is required'],
    min: [0, 'Fixed salary cannot be negative']
  },
  
  bonus: {
    type: Number,
    default: 0,
    min: [0, 'Bonus cannot be negative']
  },
  
  deduction: {
    type: Number,
    default: 0,
    min: [0, 'Deduction cannot be negative']
  },
  
  netSalary: {
    type: Number,
    required: true
  },
  
  // Payment details
  receiptNo: {
    type: String,
    unique: true,
    required: true
  },
  
  status: {
    type: String,
    enum: ['paid', 'pending', 'cancelled'],
    default: 'paid'
  },
  
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank_transfer', 'cheque', 'online'],
    default: 'bank_transfer'
  },
  
  bankTransactionId: {
    type: String,
    sparse: true
  },
  
  // Audit fields
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  
  remarks: String,
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for year
salarySchema.virtual('year').get(function() {
  return this.month ? this.month.split('-')[0] : null;
});

// Pre-save middleware to calculate net salary
salarySchema.pre('save', function(next) {
  this.netSalary = this.fixedSalary + this.bonus - this.deduction;
  this.updatedAt = new Date();
  next();
});

// Generate receipt number
salarySchema.statics.generateReceiptNo = function() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `SAL${year}${month}${day}${random}`;
};

// Index for performance
salarySchema.index({ employee: 1, month: 1 }, { unique: true });
salarySchema.index({ month: 1 });
salarySchema.index({ status: 1 });
salarySchema.index({ receiptNo: 1 });

// Add pagination plugin
salarySchema.plugin(mongoosePaginate);

export default mongoose.model('Salary', salarySchema);