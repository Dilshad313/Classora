import { useState } from 'react';
import { Calendar, Save, Users, CheckCircle, XCircle } from 'lucide-react';

const MarkAttendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('Grade 6');
  const [selectedSection, setSelectedSection] = useState('A');

  const [students, setStudents] = useState([
    { id: 1, rollNo: '001', name: 'Emma Johnson', status: 'present' },
    { id: 2, rollNo: '002', name: 'Liam Smith', status: 'present' },
    { id: 3, rollNo: '003', name: 'Ava Martinez', status: 'present' },
    { id: 4, rollNo: '004', name: 'Noah Wilson', status: 'absent' },
    { id: 5, rollNo: '005', name: 'Sophia Davis', status: 'present' },
    { id: 6, rollNo: '006', name: 'Mason Taylor', status: 'present' },
  ]);

  const toggleAttendance = (id) => {
    setStudents(students.map(student =>
      student.id === id
        ? { ...student, status: student.status === 'present' ? 'absent' : 'present' }
        : student
    ));
  };

  const markAllPresent = () => {
    setStudents(students.map(student => ({ ...student, status: 'present' })));
  };

  const markAllAbsent = () => {
    setStudents(students.map(student => ({ ...student, status: 'absent' })));
  };

  const handleSubmit = () => {
    const presentCount = students.filter(s => s.status === 'present').length;
    const absentCount = students.filter(s => s.status === 'absent').length;
    alert(`Attendance saved!\nPresent: ${presentCount}\nAbsent: ${absentCount}`);
  };

  const presentCount = students.filter(s => s.status === 'present').length;
  const absentCount = students.filter(s => s.status === 'absent').length;
  const attendancePercentage = ((presentCount / students.length) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Mark Attendance</h1>
        <p className="text-gray-600 mt-1">Record daily student attendance</p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="label">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="input-field pl-11"
              />
            </div>
          </div>

          <div>
            <label className="label">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="input-field"
            >
              <option value="Grade 6">Grade 6</option>
              <option value="Grade 7">Grade 7</option>
              <option value="Grade 8">Grade 8</option>
            </select>
          </div>

          <div>
            <label className="label">Section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="input-field"
            >
              <option value="A">Section A</option>
              <option value="B">Section B</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className="btn-primary w-full">
              Load Students
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Students</p>
              <p className="text-3xl font-bold text-blue-700 mt-1">{students.length}</p>
            </div>
            <Users className="w-12 h-12 text-blue-400" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Present</p>
              <p className="text-3xl font-bold text-green-700 mt-1">{presentCount}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Absent</p>
              <p className="text-3xl font-bold text-red-700 mt-1">{absentCount}</p>
            </div>
            <XCircle className="w-12 h-12 text-red-400" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Attendance %</p>
              <p className="text-3xl font-bold text-purple-700 mt-1">{attendancePercentage}%</p>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-purple-400 flex items-center justify-center">
              <span className="text-purple-600 font-bold text-sm">{attendancePercentage}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance List */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            {selectedClass} - Section {selectedSection}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={markAllPresent}
              className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
            >
              Mark All Present
            </button>
            <button
              onClick={markAllAbsent}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
            >
              Mark All Absent
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {students.map((student) => (
            <div
              key={student.id}
              className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                student.status === 'present'
                  ? 'border-green-200 bg-green-50'
                  : 'border-red-200 bg-red-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
                  student.status === 'present' ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {student.rollNo}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{student.name}</h3>
                  <p className="text-sm text-gray-600">Roll No: {student.rollNo}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                  student.status === 'present'
                    ? 'bg-green-200 text-green-800'
                    : 'bg-red-200 text-red-800'
                }`}>
                  {student.status === 'present' ? 'Present' : 'Absent'}
                </span>
                <button
                  onClick={() => toggleAttendance(student.id)}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                    student.status === 'present'
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  Mark {student.status === 'present' ? 'Absent' : 'Present'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-gray-200">
          <button className="btn-secondary">
            Cancel
          </button>
          <button onClick={handleSubmit} className="btn-primary flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Attendance
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarkAttendance;
