const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    isRequired: { type: Boolean, default: true },
    priority: { type: Number, default: 1 },
    fontSize: { type: Number, default: 14 },
    textAlign: { type: String, default: 'left' },
    formatting: {
      bold: { type: Boolean, default: false },
      italic: { type: Boolean, default: false },
      underline: { type: Boolean, default: false }
    },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const rulesRegulationsSchema = new mongoose.Schema(
  {
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    rules: [ruleSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('RulesRegulations', rulesRegulationsSchema);
