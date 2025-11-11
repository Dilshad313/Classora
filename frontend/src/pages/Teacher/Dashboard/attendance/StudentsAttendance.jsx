import { useState } from 'react';
import { Calendar, Users, Check, X, Save, Download, Search, Filter } from 'lucide-react';

const StudentsAttendance = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');

  // Sample student data
  const students = [
    { id: 1, name: 'John Doe', rollNo: '001', class: '10-A', status: 'present' },
    { id: 2, name: 'Jane Smith', rollNo: '002', class: '10-A', status: 'present' },
    { id: 3, name: 'Mike Johnson', rollNo: '003', class: '10-A', status: 'absent' },
    { id: 4, name: 'Sarah Williams', rollNo: '004', class: '10-A', status: 'present' },
    { id: 5, name: 'Tom Brown', rollNo: '005', class: '10-A', status: 'present' },
  ];

  const [attendance, setAttendance] = useState(
    students.reduce((acc, student) => {
      acc[student.id] = student.status;
      return acc;
    }, {})
  );

  const toggleAttendance = (studentId) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'present' ? 'absent' : 'present'
    }));
  };

  const handleSaveAttendance = () => {
    alert('Attendance saved successfully!');
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.includes(searchTerm)
  );

  const presentCount = Object.values(attendance).filter(status => status === 'present').length;
  const absentCount = Object.values(attendance).filter(status => status === 'absent').length;
  const attendancePercentage = ((presentCount / students.length) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Students Attendance</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Mark and manage student attendance</p>
        </div>
        <button
          onClick={handleSaveAttendance}
          className="btn-primary flex items-center gap-2"
        >
          <Save className="w-5 h-5" />
          Save Attendance
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="input"
            >
              <option value="">Select a class</option>
              <option value="10-A">Class 10-A</option>
              <option value="10-B">Class 10-B</option>
              <option value="9-A">Class 9-A</option>
              <option value="9-B">Class 9-B</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Student
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or roll no..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Students</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{students.length}</p>
            </div>
            <Users className="w-12 h-12 text-blue-600 dark:text-blue-400 opacity-20" />
          </div>
        </div>
        <div className="card bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Present</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{presentCount}</p>
            </div>
            <Check className="w-12 h-12 text-green-600 dark:text-green-400 opacity-20" />
          </div>
        </div>
        <div className="card bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Absent</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">{absentCount}</p>
            </div>
            <X className="w-12 h-12 text-red-600 dark:text-red-400 opacity-20" />
          </div>
        </div>
      </div>

      {/* Attendance Percentage */}
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Attendance Rate</span>
          <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{attendancePercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${attendancePercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Students List */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Roll No</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Student Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Class</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">{student.rollNo}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {student.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{student.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">{student.class}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      attendance[student.id] === 'present'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    }`}>
                      {attendance[student.id] === 'present' ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      {attendance[student.id] === 'present' ? 'Present' : 'Absent'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => toggleAttendance(student.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        attendance[student.id] === 'present'
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'
                          : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                      }`}
                    >
                      Mark {attendance[student.id] === 'present' ? 'Absent' : 'Present'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentsAttendance;
