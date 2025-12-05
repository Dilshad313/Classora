import mongoose from 'mongoose';

const rulesRegulationsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Rule title is required'],
    trim: true,
    minlength: [3, 'Rule title must be at least 3 characters long'],
    maxlength: [500, 'Rule title cannot exceed 500 characters']
  },
  content: {
    type: String,
    required: [true, 'Rule content is required'],
    trim: true,
    minlength: [10, 'Rule content must be at least 10 characters long'],
    maxlength: [10000, 'Rule content cannot exceed 10000 characters']
  },
  isRequired: {
    type: Boolean,
    default: true
  },
  priority: {
    type: Number,
    default: 1,
    min: [1, 'Priority must be at least 1']
  },
  fontSize: {
    type: Number,
    default: 14,
    min: [8, 'Font size must be at least 8px'],
    max: [72, 'Font size cannot exceed 72px']
  },
  textAlign: {
    type: String,
    enum: ['left', 'center', 'right', 'justify'],
    default: 'left'
  },
  formatting: {
    bold: {
      type: Boolean,
      default: false
    },
    italic: {
      type: Boolean,
      default: false
    },
    underline: {
      type: Boolean,
      default: false
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'archived'],
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
rulesRegulationsSchema.index({ priority: 1, createdAt: -1, createdBy: 1 });
rulesRegulationsSchema.index({ status: 1 });
rulesRegulationsSchema.index({ isRequired: 1 });
rulesRegulationsSchema.index({ createdBy: 1 });

// Virtual for character count
rulesRegulationsSchema.virtual('contentLength').get(function() {
  return this.content ? this.content.length : 0;
});

// Pre-save middleware to ensure unique priorities within same admin
rulesRegulationsSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('priority')) {
    const duplicate = await this.constructor.findOne({
      priority: this.priority,
      status: 'active',
      createdBy: this.createdBy,
      _id: { $ne: this._id }
    });
    
    if (duplicate) {
      // Auto-increment priority if duplicate found
      const maxPriority = await this.constructor.findOne({ 
        status: 'active',
        createdBy: this.createdBy
      })
        .sort({ priority: -1 })
        .select('priority');
      
      this.priority = maxPriority ? maxPriority.priority + 1 : 1;
    }
  }
  next();
});

// Static method to reorder priorities
rulesRegulationsSchema.statics.reorderPriorities = async function(rules) {
  const bulkOps = rules.map((rule, index) => ({
    updateOne: {
      filter: { _id: rule.id },
      update: { priority: index + 1 }
    }
  }));
  
  return await this.bulkWrite(bulkOps);
};

export default mongoose.model('RulesRegulations', rulesRegulationsSchema);