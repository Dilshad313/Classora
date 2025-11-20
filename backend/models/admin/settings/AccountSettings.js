const mongoose = require('mongoose');

const accountSettingsSchema = new mongoose.Schema(
  {
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    username: { type: String, trim: true },
    name: { type: String, trim: true },
    currency: { type: String, trim: true },
    subscription: { type: String, trim: true },
    expiry: { type: String, trim: true },
    preferences: { type: mongoose.Schema.Types.Mixed }
  },
  { timestamps: true }
);

module.exports = mongoose.model('AccountSettings', accountSettingsSchema);
