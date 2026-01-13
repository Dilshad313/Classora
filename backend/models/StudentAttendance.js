import mongoose from 'mongoose';

const studentAttendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'leave'],
    required: true,
    default: 'present'
  },
  class: {
    type: String,
    required: true
  },
  section: {
    type: String,
    required: true
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  remark: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Compound index for unique attendance per student per day
studentAttendanceSchema.index({ student: 1, date: 1 }, { unique: true });

// Index for efficient queries
studentAttendanceSchema.index({ date: 1 });
studentAttendanceSchema.index({ class: 1, section: 1 });
studentAttendanceSchema.index({ status: 1 });

// Virtual for formatted date
studentAttendanceSchema.virtual('formattedDate').get(function() {
  return this.date.toISOString().split('T')[0];
});

// Static method to get attendance summary by class
studentAttendanceSchema.statics.getClassWiseReport = async function({
  startDate,
  endDate,
  classFilter,
  sectionFilter
}) {
  const matchStage = {
    date: { $gte: new Date(startDate), $lte: new Date(endDate) }
  };

  if (classFilter) {
    matchStage.class = Array.isArray(classFilter) ? { $in: classFilter } : classFilter;
  }

  if (sectionFilter) {
    matchStage.section = Array.isArray(sectionFilter) ? { $in: sectionFilter } : sectionFilter;
  }

  const [result] = await this.aggregate([
    { $match: matchStage },
    {
      $facet: {
        summary: [
          {
            $group: {
              _id: null,
              totalRecords: { $sum: 1 },
              present: { $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] } },
              absent: { $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] } },
              leave: { $sum: { $cond: [{ $eq: ['$status', 'leave'] }, 1, 0] } },
              classes: { $addToSet: '$class' },
              sections: { $addToSet: '$section' }
            }
          }
        ],
        daily: [
          {
            $group: {
              _id: {
                date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
                class: '$class',
                section: '$section'
              },
              total: { $sum: 1 },
              present: { $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] } },
              absent: { $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] } },
              leave: { $sum: { $cond: [{ $eq: ['$status', 'leave'] }, 1, 0] } }
            }
          },
          { $sort: { '_id.date': 1 } }
        ]
      }
    }
  ]);

  return {
    summary: result?.summary?.[0] || {
      totalRecords: 0,
      present: 0,
      absent: 0,
      leave: 0,
      classes: [],
      sections: []
    },
    daily: result?.daily || []
  };
};

// Static method to get student attendance records
studentAttendanceSchema.statics.getStudentReport = async function(startDate, endDate, filters = {}) {
  const matchStage = { date: { $gte: new Date(startDate), $lte: new Date(endDate) } };
  
  if (filters.search) {
    matchStage['$or'] = [
      { 'studentData.studentName': { $regex: filters.search, $options: 'i' } },
      { 'studentData.registrationNo': { $regex: filters.search, $options: 'i' } }
    ];
  }

  if (filters.class && filters.class !== 'all') {
    matchStage.class = filters.class;
  }

  if (filters.status && filters.status !== 'all') {
    matchStage.status = filters.status;
  }

  return await this.aggregate([
    {
      $match: { date: { $gte: new Date(startDate), $lte: new Date(endDate) } }
    },
    {
      $lookup: {
        from: 'students',
        localField: 'student',
        foreignField: '_id',
        as: 'studentData'
      }
    },
    { $unwind: '$studentData' },
    { $match: matchStage },
    {
      $project: {
        date: 1,
        day: { $dayOfWeek: '$date' },
        studentId: '$studentData.registrationNo',
        name: '$studentData.studentName',
        class: { $concat: ['Class ', '$class', '-', '$section'] },
        status: {
          $switch: {
            branches: [
              { case: { $eq: ['$status', 'present'] }, then: 'P' },
              { case: { $eq: ['$status', 'absent'] }, then: 'A' },
              { case: { $eq: ['$status', 'leave'] }, then: 'L' }
            ],
            default: 'P'
          }
        }
      }
    },
    { $sort: { date: -1 } }
  ]);
};

export default mongoose.model('StudentAttendance', studentAttendanceSchema);