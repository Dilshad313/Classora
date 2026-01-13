import mongoose from 'mongoose';

const skillRatingSchema = new mongoose.Schema({
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  ratings: {
    type: Map,
    of: Number,
    default: {}
  },
  lastRatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

skillRatingSchema.index({ class: 1, student: 1, teacher: 1 }, { unique: true });

export default mongoose.model('SkillRating', skillRatingSchema);
