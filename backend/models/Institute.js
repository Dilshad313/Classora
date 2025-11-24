import mongoose from 'mongoose';

const instituteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Institute name is required'],
    trim: true,
  },
  tagline: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  country: {
    type: String,
    trim: true,
  },
  website: {
    type: String,
    trim: true,
  },
  logoUrl: {
    type: String,
    default: null,
  },
  logoPublicId: {
    type: String,
    default: null,
  },
}, { timestamps: true });

export default mongoose.model('Institute', instituteSchema);