import mongoose from 'mongoose';

const feesParticularsSchema = new mongoose.Schema({
  monthlyTutorFee: {
    type: Number,
    default: 0,
    min: [0, 'Fee cannot be negative'],
    get: v => Math.round(v * 100) / 100 // Round to 2 decimal places
  },
  admissionFee: {
    type: Number,
    default: 0,
    min: [0, 'Fee cannot be negative'],
    get: v => Math.round(v * 100) / 100
  },
  registrationFee: {
    type: Number,
    default: 0,
    min: [0, 'Fee cannot be negative'],
    get: v => Math.round(v * 100) / 100
  },
  artMaterial: {
    type: Number,
    default: 0,
    min: [0, 'Fee cannot be negative'],
    get: v => Math.round(v * 100) / 100
  },
  transport: {
    type: Number,
    default: 0,
    min: [0, 'Fee cannot be negative'],
    get: v => Math.round(v * 100) / 100
  },
  books: {
    type: Number,
    default: 0,
    min: [0, 'Fee cannot be negative'],
    get: v => Math.round(v * 100) / 100
  },
  uniform: {
    type: Number,
    default: 0,
    min: [0, 'Fee cannot be negative'],
    get: v => Math.round(v * 100) / 100
  },
  free: {
    type: Number,
    default: 0,
    min: [0, 'Fee cannot be negative'],
    get: v => Math.round(v * 100) / 100
  },
  others: {
    type: Number,
    default: 0,
    min: [0, 'Fee cannot be negative'],
    get: v => Math.round(v * 100) / 100
  },
  previousBalance: {
    type: Number,
    default: 0,
    min: [0, 'Fee cannot be negative'],
    get: v => Math.round(v * 100) / 100
  },
  becomingFee: {
    type: Number,
    default: 0,
    min: [0, 'Fee cannot be negative'],
    get: v => Math.round(v * 100) / 100
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true // Apply getters when converting to JSON
  },
  toObject: {
    virtuals: true,
    getters: true // Apply getters when converting to object
  }
});

// Virtual for total fees calculation
feesParticularsSchema.virtual('totalFees').get(function() {
  return this.monthlyTutorFee +
         this.admissionFee +
         this.registrationFee +
         this.artMaterial +
         this.transport +
         this.books +
         this.uniform +
         this.others +
         this.previousBalance +
         this.becomingFee -
         this.free;
});

// Index for better query performance
feesParticularsSchema.index({ createdAt: 1 });

// Static method to get the first fees particulars (create default if none exists)
feesParticularsSchema.statics.getFeesParticulars = async function () {
  let feesParticulars = await this.findOne();

  if (!feesParticulars) {
    // Create default fees particulars if none exists
    feesParticulars = await this.create({
      monthlyTutorFee: 0,
      admissionFee: 0,
      registrationFee: 0,
      artMaterial: 0,
      transport: 0,
      books: 0,
      uniform: 0,
      free: 0,
      others: 0,
      previousBalance: 0,
      becomingFee: 0
    });
  }

  return feesParticulars;
};

// Method to update fees by ID
feesParticularsSchema.statics.updateFeesById = async function (id, updateData) {
  return await this.findByIdAndUpdate(
    id,
    updateData,
    {
      new: true,
      runValidators: true
    }
  );
};

export default mongoose.model('FeesParticulars', feesParticularsSchema);
