const AttendanceStudent = require('../models/AttendanceStudent');
const AttendanceEmployee = require('../models/AttendanceEmployee');

exports.setStudentAttendance = async (req, res) => {
  try {
    const { date, classId, records } = req.body;
    if (!date || !classId || !Array.isArray(records)) {
      return res.status(400).json({ message: 'date, classId, records required' });
    }
    const doc = await AttendanceStudent.findOneAndUpdate(
      { date: new Date(date), class: classId },
      {
        date: new Date(date),
        class: classId,
        records: records.map(r => ({ student: r.studentId, status: r.status }))
      },
      { upsert: true, new: true }
    ).lean();
    res.json(doc);
  } catch (err) {
    console.error('Set student attendance error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStudentAttendance = async (req, res) => {
  try {
    const { date, classId } = req.query;
    if (!date || !classId) return res.status(400).json({ message: 'date and classId required' });
    const doc = await AttendanceStudent.findOne({ date: new Date(date), class: classId })
      .populate('records.student', 'name regNo rollNo photoUrl')
      .lean();
    const result = doc || { date, class: classId, records: [] };
    const present = result.records.filter(r => r.status === 'present').length;
    const leave = result.records.filter(r => r.status === 'leave').length;
    const absent = result.records.filter(r => r.status === 'absent').length;
    res.json({ ...result, stats: { present, leave, absent, total: result.records.length } });
  } catch (err) {
    console.error('Get student attendance error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.setEmployeeAttendance = async (req, res) => {
  try {
    const { date, records } = req.body;
    if (!date || !Array.isArray(records)) {
      return res.status(400).json({ message: 'date and records required' });
    }
    const doc = await AttendanceEmployee.findOneAndUpdate(
      { date: new Date(date) },
      {
        date: new Date(date),
        records: records.map(r => ({ employee: r.employeeId, status: r.status }))
      },
      { upsert: true, new: true }
    ).lean();
    res.json(doc);
  } catch (err) {
    console.error('Set employee attendance error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getEmployeeAttendance = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: 'date required' });
    const doc = await AttendanceEmployee.findOne({ date: new Date(date) })
      .populate('records.employee', 'name employeeId role department photoUrl')
      .lean();
    const result = doc || { date, records: [] };
    const present = result.records.filter(r => r.status === 'present').length;
    const leave = result.records.filter(r => r.status === 'leave').length;
    const absent = result.records.filter(r => r.status === 'absent').length;
    res.json({ ...result, stats: { present, leave, absent, total: result.records.length } });
  } catch (err) {
    console.error('Get employee attendance error', err);
    res.status(500).json({ message: 'Server error' });
  }
};