import mongoose from 'mongoose';

const timetableSchema = new mongoose.Schema({
  // Reference Information
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: [true, 'Class is required']
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: false
  },
  
  // Timetable Structure
  periods: [{
    dayId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WeekDay',
      required: true
    },
    periodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TimePeriod',
      required: true
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: false
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: false
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Classroom',
      required: false
    },
    subjectName: {
      type: String,
      trim: true
    },
    teacherName: {
      type: String,
      trim: true
    },
    roomName: {
      type: String,
      trim: true
    },
    isBreak: {
      type: Boolean,
      default: false
    },
    breakType: {
      type: String,
      enum: ['short', 'lunch', null],
      default: null
    }
  }],
  
  // Schedule Info
  academicYear: {
    type: String,
    required: true
  },
  term: {
    type: String,
    enum: ['1st Term', '2nd Term', '3rd Term', 'Annual'],
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for timetable name
timetableSchema.virtual('timetableName').get(function() {
  const classRef = this.classId?.name || 'Unknown Class';
  return `${classRef} - ${this.academicYear} ${this.term}`;
});

// Indexes for better query performance
timetableSchema.index({ classId: 1, academicYear: 1, term: 1 });
timetableSchema.index({ teacherId: 1 });
timetableSchema.index({ createdBy: 1, isActive: 1 });

// Ensure unique timetable per class per academic period
timetableSchema.pre('save', async function(next) {
  if (this.isNew) {
    const existing = await this.constructor.findOne({
      classId: this.classId,
      academicYear: this.academicYear,
      term: this.term,
      createdBy: this.createdBy
    });
    
    if (existing) {
      const error = new Error('Timetable already exists for this class and academic period');
      error.name = 'ValidationError';
      return next(error);
    }
  }
  next();
});

// Method to get formatted timetable by day
timetableSchema.methods.getTimetableByDay = function() {
  const timetableByDay = {};
  
  this.periods.forEach(period => {
    const dayId = period.dayId.toString();
    if (!timetableByDay[dayId]) {
      timetableByDay[dayId] = [];
    }
    timetableByDay[dayId].push(period);
  });
  
  return timetableByDay;
};

export default mongoose.model('Timetable', timetableSchema);