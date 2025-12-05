import mongoose from 'mongoose';

const billingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: [true, 'User ID is required'],
    unique: true
  },
  subscription: {
    plan: {
      type: String,
      enum: ['FREE', 'BASIC', 'PREMIUM', 'ENTERPRISE'],
      default: 'FREE'
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'expired', 'cancelled'],
      default: 'active'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    expiryDate: {
      type: Date,
      default: null
    },
    autoRenew: {
      type: Boolean,
      default: false
    }
  },
  currency: {
    type: String,
    enum: ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD'],
    default: 'USD'
  },
  paymentMethod: {
    type: {
      type: String,
      enum: ['card', 'bank', 'paypal', 'other', 'none'],
      default: 'none'
    },
    last4: String,
    brand: String
  },
  billingAddress: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String
  },
  invoices: [{
    invoiceNumber: String,
    amount: Number,
    currency: String,
    status: {
      type: String,
      enum: ['paid', 'pending', 'failed', 'refunded'],
      default: 'pending'
    },
    date: {
      type: Date,
      default: Date.now
    },
    pdfUrl: String
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for subscription active status
billingSchema.virtual('isSubscriptionActive').get(function() {
  if (this.subscription.plan === 'FREE') return true;
  if (!this.subscription.expiryDate) return false;
  return new Date() < this.subscription.expiryDate && this.subscription.status === 'active';
});

// Virtual for days until expiry
billingSchema.virtual('daysUntilExpiry').get(function() {
  if (!this.subscription.expiryDate) return null;
  const now = new Date();
  const expiry = new Date(this.subscription.expiryDate);
  const diffTime = expiry - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Index for better query performance
billingSchema.index({ userId: 1 });
billingSchema.index({ 'subscription.status': 1 });
billingSchema.index({ 'subscription.expiryDate': 1 });

// Static method to get or create billing for user
billingSchema.statics.getOrCreate = async function(userId) {
  let billing = await this.findOne({ userId });
  
  if (!billing) {
    billing = await this.create({
      userId,
      subscription: {
        plan: 'FREE',
        status: 'active',
        startDate: new Date()
      },
      currency: 'USD'
    });
  }
  
  return billing;
};

export default mongoose.model('Billing', billingSchema);
