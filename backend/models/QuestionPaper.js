// models/QuestionPaper.js
import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  // Question Details
  question: {
    type: String,
    required: [true, 'Question is required'],
    trim: true
  },
  questionType: {
    type: String,
    enum: ['Very Short Answer', 'Short Answer', 'Long Answer', 'MCQ', 'True/False'],
    required: [true, 'Question type is required']
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: [true, 'Difficulty level is required']
  },
  marks: {
    type: Number,
    required: [true, 'Marks are required'],
    min: [1, 'Marks must be at least 1'],
    max: [100, 'Marks cannot exceed 100']
  },
  
  // MCQ Options (only for MCQ type)
  options: {
    option1: String,
    option2: String,
    option3: String,
    option4: String
  },
  correctAnswer: {
    type: String,
    required: function() {
      return this.questionType === 'MCQ';
    }
  },
  
  // Additional Content
  solution: {
    type: String,
    trim: true
  },
  hint: {
    type: String,
    trim: true
  },
  
  // Relationships
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: [true, 'Subject is required']
  },
  chapter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter',
    required: [true, 'Chapter is required']
  },
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'archived'],
    default: 'active'
  },
  
  // Usage Tracking
  usedInExams: [{
    examId: mongoose.Schema.Types.ObjectId,
    examName: String,
    dateUsed: Date
  }],
  timesUsed: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for formatted question
questionSchema.virtual('questionPreview').get(function() {
  const preview = this.question.length > 100 
    ? this.question.substring(0, 100) + '...' 
    : this.question;
  return preview;
});

// Virtual for subject name
questionSchema.virtual('subjectName', {
  ref: 'Subject',
  localField: 'subject',
  foreignField: '_id',
  justOne: true,
  options: { select: 'name' }
});

// Virtual for chapter name
questionSchema.virtual('chapterName', {
  ref: 'Chapter',
  localField: 'chapter',
  foreignField: '_id',
  justOne: true,
  options: { select: 'title' }
});

// Indexes for better query performance
questionSchema.index({ subject: 1, chapter: 1 });
questionSchema.index({ questionType: 1 });
questionSchema.index({ difficulty: 1 });
questionSchema.index({ createdBy: 1, status: 1 });
questionSchema.index({ question: 'text', solution: 'text' });

// Static method to get question statistics
questionSchema.statics.getQuestionStats = async function(adminId) {
  const stats = await this.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(adminId) } },
    {
      $group: {
        _id: null,
        totalQuestions: { $sum: 1 },
        totalMarks: { $sum: '$marks' },
        byType: {
          $push: {
            type: '$questionType',
            count: 1,
            marks: '$marks'
          }
        },
        byDifficulty: {
          $push: {
            difficulty: '$difficulty',
            count: 1
          }
        }
      }
    },
    {
      $project: {
        totalQuestions: 1,
        totalMarks: 1,
        typeDistribution: {
          $arrayToObject: {
            $map: {
              input: '$byType',
              as: 'item',
              in: {
                k: '$$item.type',
                v: {
                  count: {
                    $sum: {
                      $cond: [{ $eq: ['$$item.type', '$questionType'] }, 1, 0]
                    }
                  },
                  totalMarks: {
                    $sum: {
                      $cond: [{ $eq: ['$$item.type', '$questionType'] }, '$$item.marks', 0]
                    }
                  }
                }
              }
            }
          }
        },
        difficultyDistribution: {
          $arrayToObject: {
            $map: {
              input: '$byDifficulty',
              as: 'item',
              in: {
                k: '$$item.difficulty',
                v: {
                  count: {
                    $sum: {
                      $cond: [{ $eq: ['$$item.difficulty', '$difficulty'] }, 1, 0]
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  ]);
  
  return stats[0] || {
    totalQuestions: 0,
    totalMarks: 0,
    typeDistribution: {},
    difficultyDistribution: {}
  };
};

// Pre-save validation
questionSchema.pre('save', function(next) {
  // Validate MCQ questions have all required fields
  if (this.questionType === 'MCQ') {
    if (!this.options.option1 || !this.options.option2 || !this.options.option3 || !this.options.option4) {
      return next(new Error('All 4 options are required for MCQ questions'));
    }
    if (!this.correctAnswer || !['1', '2', '3', '4'].includes(this.correctAnswer)) {
      return next(new Error('Valid correct answer (1-4) is required for MCQ questions'));
    }
  }
  next();
});

export default mongoose.model('Question', questionSchema);