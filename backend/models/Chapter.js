// models/Chapter.js
import mongoose from 'mongoose';

const chapterSchema = new mongoose.Schema({
  // Chapter Details
  chapterNumber: {
    type: Number,
    required: [true, 'Chapter number is required'],
    min: [1, 'Chapter number must be at least 1']
  },
  title: {
    type: String,
    required: [true, 'Chapter title is required'],
    trim: true
  },
  topics: {
    type: [String],
    required: [true, 'At least one topic is required'],
    validate: {
      validator: function(topics) {
        return topics && topics.length > 0 && topics.every(topic => topic.trim().length > 0);
      },
      message: 'At least one non-empty topic is required'
    }
  },
  description: {
    type: String,
    trim: true
  },
  
  // Relationships
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: [true, 'Subject is required']
  },
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  
  // Statistics
  questionCount: {
    type: Number,
    default: 0
  },
  totalMarks: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full chapter name
chapterSchema.virtual('fullName').get(function() {
  return `Chapter ${this.chapterNumber}: ${this.title}`;
});

// Virtual for subject details
chapterSchema.virtual('subjectDetails', {
  ref: 'Subject',
  localField: 'subject',
  foreignField: '_id',
  justOne: true
});

// Indexes
chapterSchema.index({ subject: 1, chapterNumber: 1 });
chapterSchema.index({ createdBy: 1 });
chapterSchema.index({ title: 'text' });

// Pre-save to prevent duplicate chapter numbers per subject
chapterSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('chapterNumber') || this.isModified('subject')) {
    const duplicate = await this.constructor.findOne({
      subject: this.subject,
      chapterNumber: this.chapterNumber,
      createdBy: this.createdBy,
      _id: { $ne: this._id }
    });
    
    if (duplicate) {
      return next(new Error(`Chapter ${this.chapterNumber} already exists for this subject`));
    }
  }
  next();
});

export default mongoose.model('Chapter', chapterSchema);