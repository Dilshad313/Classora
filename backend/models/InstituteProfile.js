import mongoose from 'mongoose';

const instituteProfileSchema = new mongoose.Schema({
  instituteName: {
    type: String,
    required: [true, 'Institute name is required'],
    trim: true,
    maxlength: [200, 'Institute name cannot exceed 200 characters']
  },
  tagline: {
    type: String,
    required: [true, 'Tagline is required'],
    trim: true,
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
    maxlength: [1000, 'Address cannot exceed 1000 characters']
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true
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
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
instituteProfileSchema.index({ instituteName: 1 });

// Static method to get the first profile (for backward compatibility)
instituteProfileSchema.statics.getProfile = async function () {
  let profile = await this.findOne();
  
  if (!profile) {
    // Create default profile if none exists
    profile = await this.create({
      instituteName: 'Your Institute Name',
      tagline: 'Excellence in Education',
      phone: '+1 (555) 123-4567',
      address: 'Enter your institute address here',
      country: 'United States',
      website: 'https://www.example.com'
    });
  }
  
  return profile;
};

// New method to get profile by ID
instituteProfileSchema.statics.getProfileById = async function (id) {
  return await this.findById(id);
};

export default mongoose.model('InstituteProfile', instituteProfileSchema);