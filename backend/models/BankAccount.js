import mongoose from 'mongoose';

const bankAccountSchema = new mongoose.Schema({
  bankName: {
    type: String,
    required: [true, 'Bank name is required'],
    trim: true,
    minlength: [2, 'Bank name must be at least 2 characters long'],
    maxlength: [200, 'Bank name cannot exceed 200 characters']
  },
  emailManager: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        if (!v) return true; // Optional field
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Please enter a valid email address'
    }
  },
  bankAddress: {
    type: String,
    trim: true,
    maxlength: [1000, 'Bank address cannot exceed 1000 characters']
  },
  accountNumber: {
    type: String,
    required: [true, 'Account number is required'],
    trim: true,
    minlength: [5, 'Account number must be at least 5 characters long'],
    maxlength: [50, 'Account number cannot exceed 50 characters']
  },
  instructions: {
    type: String,
    trim: true,
    maxlength: [2000, 'Instructions cannot exceed 2000 characters']
  },
  logoUrl: {
    type: String,
    default: null
  },
  logoPublicId: {
    type: String,
    default: null
  },
  loginRequired: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: [true, 'Created by admin is required']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
bankAccountSchema.index({ bankName: 1 });
bankAccountSchema.index({ accountNumber: 1, createdBy: 1 });
bankAccountSchema.index({ status: 1 });
bankAccountSchema.index({ createdBy: 1 });

// Check for duplicate account number within same admin
bankAccountSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('accountNumber')) {
    const duplicate = await this.constructor.findOne({
      accountNumber: this.accountNumber,
      createdBy: this.createdBy,
      _id: { $ne: this._id }
    });
    
    if (duplicate) {
      const error = new Error(`Bank account with account number ${this.accountNumber} already exists`);
      error.name = 'ValidationError';
      return next(error);
    }
  }
  next();
});

export default mongoose.model('BankAccount', bankAccountSchema);