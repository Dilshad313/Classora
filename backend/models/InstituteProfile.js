import mongoose from 'mongoose';

const instituteProfileSchema = new mongoose.Schema({
  instituteName: {
    type: String,
    required: [true, 'Institute name is required'],
    trim: true,
    minlength: [2, 'Institute name must be at least 2 characters long'],
    maxlength: [200, 'Institute name cannot exceed 200 characters']
  },
  tagline: {
    type: String,
    required: [true, 'Tagline is required'],
    trim: true,
    minlength: [5, 'Tagline must be at least 5 characters long'],
    maxlength: [500, 'Tagline cannot exceed 500 characters']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    validate: {
      validator: function(v) {
        return /^[\+]?[0-9\s\-\(\)]{5,20}$/.test(v);
      },
      message: 'Please enter a valid phone number'
    }
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
    minlength: [10, 'Address must be at least 10 characters long'],
    maxlength: [1000, 'Address cannot exceed 1000 characters']
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true,
    minlength: [2, 'Country name must be at least 2 characters long']
  },
  website: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true;
        return /^https?:\/\/.+\..+/.test(v);
      },
      message: 'Please enter a valid website URL'
    }
  },
  logoUrl: {
    type: String,
    default: null
  },
  logoPublicId: {
    type: String,
    default: null
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
instituteProfileSchema.index({ instituteName: 1 });
instituteProfileSchema.index({ createdBy: 1 }, { unique: true });

// Static method to get profile for specific admin
instituteProfileSchema.statics.getProfile = async function (adminId) {
  let profile = await this.findOne({ createdBy: adminId });

  if (!profile) {
    // Create default profile for this admin if none exists
    profile = await this.create({
      instituteName: 'Your Institute Name',
      tagline: 'Excellence in Education',
      phone: '+1 (555) 123-4567',
      address: 'Enter your institute address here',
      country: 'United States',
      website: null,
      createdBy: adminId
    });
  }

  return profile;
};

// Method to update profile by admin ID
instituteProfileSchema.statics.updateProfileByAdmin = async function (adminId, updateData) {
  return await this.findOneAndUpdate(
    { createdBy: adminId },
    updateData,
    {
      new: true,
      runValidators: true,
      upsert: true
    }
  );
};

export default mongoose.model('InstituteProfile', instituteProfileSchema);