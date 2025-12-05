import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  // Basic Information
  date: {
    type: Date,
    required: [true, 'Transaction date is required'],
    default: Date.now
  },
  description: {
    type: String,
    required: [true, 'Transaction description is required'],
    trim: true
  },
  reference: {
    type: String,
    unique: true,
    sparse: true
  },
  amount: {
    type: Number,
    required: [true, 'Transaction amount is required'],
    min: 0
  },
  type: {
    type: String,
    enum: ['debit', 'credit'],
    required: [true, 'Transaction type is required']
  },
  category: {
    type: String,
    enum: [
      'student_fee',
      'salary',
      'office_supplies',
      'utility_bill',
      'maintenance',
      'book_sales',
      'event_registration',
      'other'
    ],
    default: 'other'
  },

  // Additional Details
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank_transfer', 'cheque', 'online', 'other'],
    default: 'cash'
  },
  status: {
    type: String,
    enum: ['completed', 'pending', 'cancelled'],
    default: 'completed'
  },

  // System Fields
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Make optional temporarily
  },
  institute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institute',
    required: false, // Make optional temporarily
    default: '65d8f1a1e4b0a0a0a0a0a0a0' // Default institute ID
  }

}, {
  timestamps: true
});

// Generate reference number before saving
transactionSchema.pre('save', async function(next) {
  try {
    if (!this.reference) {
      const year = new Date().getFullYear();
      const random = Math.floor(1000 + Math.random() * 9000);
      const prefix = this.type === 'debit' ? 'EXP' : 'INC';
      this.reference = `${prefix}${year}${random}`;
      
      // Ensure uniqueness
      let isUnique = false;
      let attempts = 0;
      while (!isUnique && attempts < 5) {
        const existingTransaction = await mongoose.model('Transaction').findOne({ reference: this.reference });
        if (!existingTransaction) {
          isUnique = true;
        } else {
          const newRandom = Math.floor(1000 + Math.random() * 9000);
          this.reference = `${prefix}${year}${newRandom}`;
          attempts++;
        }
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Virtual for formatted amount
transactionSchema.virtual('formattedAmount').get(function() {
  return this.amount.toFixed(2);
});

// Virtual for debit/credit fields for frontend compatibility
transactionSchema.virtual('debit').get(function() {
  return this.type === 'debit' ? this.amount : 0;
});

transactionSchema.virtual('credit').get(function() {
  return this.type === 'credit' ? this.amount : 0;
});

// Index for better query performance
transactionSchema.index({ date: -1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ category: 1 });
transactionSchema.index({ reference: 1 });
transactionSchema.index({ description: 'text' });

// Static method to get account summary
transactionSchema.statics.getAccountSummary = async function(instituteId, startDate, endDate) {
  const matchStage = {};
  
  // Only filter by institute if provided
  if (instituteId) {
    matchStage.institute = instituteId;
  }
  
  if (startDate && endDate) {
    matchStage.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  const summary = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);

  const debitSummary = summary.find(s => s._id === 'debit') || { total: 0, count: 0 };
  const creditSummary = summary.find(s => s._id === 'credit') || { total: 0, count: 0 };

  return {
    totalDebit: debitSummary.total,
    totalCredit: creditSummary.total,
    netBalance: creditSummary.total - debitSummary.total,
    transactionCount: debitSummary.count + creditSummary.count
  };
};

export default mongoose.model('Transaction', transactionSchema);