const bankSchema = new mongoose.Schema(
  {
    bankName: { type: String, required: true },
    emailManager: { type: String, trim: true },
    bankAddress: { type: String, trim: true },
    accountNumber: { type: String, required: true },
    instructions: { type: String, trim: true },
    logoUrl: { type: String, trim: true },
    logoPublicId: { type: String, trim: true },
    loginRequired: { type: Boolean, default: false },
  },
  { _id: false }
);

const accountInvoiceSchema = new mongoose.Schema(
  {
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    banks: [bankSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('AccountInvoice', accountInvoiceSchema);