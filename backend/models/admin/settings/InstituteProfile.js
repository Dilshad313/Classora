const mongoose = require('mongoose');

const instituteProfileSchema = new mongoose.Schema(
  {
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    instituteName: { type: String, required: true, trim: true },
    tagline: { type: String, trim: true },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    country: { type: String, trim: true },
    website: { type: String, trim: true },
    logoUrl: { type: String, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('InstituteProfile', instituteProfileSchema);
