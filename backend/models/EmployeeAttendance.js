import mongoose from 'mongoose';

const employeeAttendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
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

// Compound index for unique attendance per employee per day
employeeAttendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

// Index for efficient queries
employeeAttendanceSchema.index({ date: 1 });
employeeAttendanceSchema.index({ status: 1 });

// Virtual for formatted date
employeeAttendanceSchema.virtual('formattedDate').get(function() {
  return this.date.toISOString().split('T')[0];
});

// Static method to get employee attendance records
employeeAttendanceSchema.statics.getEmployeeReport = async function(startDate, endDate, filters = {}) {
  const matchStage = { date: { $gte: new Date(startDate), $lte: new Date(endDate) } };
  
  if (filters.search) {
    matchStage['$or'] = [
      { 'employeeData.employeeName': { $regex: filters.search, $options: 'i' } },
      { 'employeeData.employeeId': { $regex: filters.search, $options: 'i' } },
      { 'employeeData.employeeRole': { $regex: filters.search, $options: 'i' } },
      { 'employeeData.department': { $regex: filters.search, $options: 'i' } }
    ];
  }

  if (filters.department && filters.department !== 'all') {
    matchStage['employeeData.department'] = filters.department;
  }

  if (filters.role && filters.role !== 'all') {
    matchStage['employeeData.employeeRole'] = filters.role;
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
        from: 'employees',
        localField: 'employee',
        foreignField: '_id',
        as: 'employeeData'
      }
    },
    { $unwind: '$employeeData' },
    { $match: matchStage },
    {
      $project: {
        date: 1,
        day: { $dayOfWeek: '$date' },
        employeeId: '$employeeData.employeeId',
        name: '$employeeData.employeeName',
        role: '$employeeData.employeeRole',
        department: '$employeeData.department',
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

export default mongoose.model('EmployeeAttendance', employeeAttendanceSchema);