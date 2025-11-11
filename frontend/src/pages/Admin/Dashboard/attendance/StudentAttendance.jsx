import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, ChevronRight, UserCheck, Calendar, Search, CheckCircle, XCircle, 
  Clock, Users, Save, AlertCircle, Filter, GraduationCap
} from 'lucide-react';

const StudentAttendance = () => {
  const navigate = useNavigate();
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [showStudents, setShowStudents] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [selectAll, setSelectAll] = useState('');

  // Sample classes data
  const classes = [
    { id: 1, name: 'Class 1-A', section: 'A', grade: '1', students: 30 },
    { id: 2, name: 'Class 1-B', section: 'B', grade: '1', students: 28 },
    { id: 3, name: 'Class 2-A', section: 'A', grade: '2', students: 32 },
    { id: 4, name: 'Class 2-B', section: 'B', grade: '2', students: 30 },
    { id: 5, name: 'Class 3-A', section: 'A', grade: '3', students: 35 },
    { id: 6, name: 'Class 3-B', section: 'B', grade: '3', students: 33 },
    { id: 7, name: 'Class 4-A', section: 'A', grade: '4', students: 30 },
    { id: 8, name: 'Class 4-B', section: 'B', grade: '4', students: 32 },
    { id: 9, name: 'Class 5-A', section: 'A', grade: '5', students: 28 },
    { id: 10, name: 'Class 5-B', section: 'B', grade: '5', students: 30 }
  ];

  // Sample students data
  const studentsData = {
    1: [
      { id: 1, regNo: 'STU001', name: 'Aarav Kumar', rollNo: 1, photo: 'https://ui-avatars.com/api/?name=Aarav+Kumar&background=4F46E5&color=fff' },
      { id: 2, regNo: 'STU002', name: 'Diya Sharma', rollNo: 2, photo: 'https://ui-avatars.com/api/?name=Diya+Sharma&background=7C3AED&color=fff' },
      { id: 3, regNo: 'STU003', name: 'Arjun Patel', rollNo: 3, photo: 'https://ui-avatars.com/api/?name=Arjun+Patel&background=EC4899&color=fff' },
      { id: 4, regNo: 'STU004', name: 'Ananya Reddy', rollNo: 4, photo: 'https://ui-avatars.com/api/?name=Ananya+Reddy&background=F59E0B&color=fff' },
      { id: 5, regNo: 'STU005', name: 'Vihaan Singh', rollNo: 5, photo: 'https://ui-avatars.com/api/?name=Vihaan+Singh&background=10B981&color=fff' },
      { id: 6, regNo: 'STU006', name: 'Isha Gupta', rollNo: 6, photo: 'https://ui-avatars.com/api/?name=Isha+Gupta&background=3B82F6&color=fff' },
      { id: 7, regNo: 'STU007', name: 'Aditya Verma', rollNo: 7, photo: 'https://ui-avatars.com/api/?name=Aditya+Verma&background=EF4444&color=fff' },
      { id: 8, regNo: 'STU008', name: 'Saanvi Joshi', rollNo: 8, photo: 'https://ui-avatars.com/api/?name=Saanvi+Joshi&background=8B5CF6&color=fff' },
      { id: 9, regNo: 'STU009', name: 'Reyansh Nair', rollNo: 9, photo: 'https://ui-avatars.com/api/?name=Reyansh+Nair&background=06B6D4&color=fff' },
      { id: 10, regNo: 'STU010', name: 'Myra Iyer', rollNo: 10, photo: 'https://ui-avatars.com/api/?name=Myra+Iyer&background=F97316&color=fff' },
      { id: 11, regNo: 'STU011', name: 'Kabir Desai', rollNo: 11, photo: 'https://ui-avatars.com/api/?name=Kabir+Desai&background=14B8A6&color=fff' },
      { id: 12, regNo: 'STU012', name: 'Aanya Mehta', rollNo: 12, photo: 'https://ui-avatars.com/api/?name=Aanya+Mehta&background=A855F7&color=fff' },
      { id: 13, regNo: 'STU013', name: 'Vivaan Roy', rollNo: 13, photo: 'https://ui-avatars.com/api/?name=Vivaan+Roy&background=EC4899&color=fff' },
      { id: 14, regNo: 'STU014', name: 'Kiara Bose', rollNo: 14, photo: 'https://ui-avatars.com/api/?name=Kiara+Bose&background=F59E0B&color=fff' },
      { id: 15, regNo: 'STU015', name: 'Ayaan Khan', rollNo: 15, photo: 'https://ui-avatars.com/api/?name=Ayaan+Khan&background=10B981&color=fff' }
    ],
    2: [
      { id: 16, regNo: 'STU016', name: 'Riya Kapoor', rollNo: 1, photo: 'https://ui-avatars.com/api/?name=Riya+Kapoor&background=4F46E5&color=fff' },
      { id: 17, regNo: 'STU017', name: 'Shaurya Malhotra', rollNo: 2, photo: 'https://ui-avatars.com/api/?name=Shaurya+Malhotra&background=7C3AED&color=fff' },
      { id: 18, regNo: 'STU018', name: 'Navya Chopra', rollNo: 3, photo: 'https://ui-avatars.com/api/?name=Navya+Chopra&background=EC4899&color=fff' }
    ]
  };

  // Get students for selected class (default to class 1 students for all classes in demo)
  const getStudentsForClass = (classId) => {
    return studentsData[1] || []; // Using class 1 data as default for demo
  };

  const handleSearchClass = () => {
    if (!selectedClass || !attendanceDate) {
      alert('Please select both date and class');
      return;
    }
    setShowStudents(true);
    // Initialize attendance records for all students as present by default
    const students = getStudentsForClass(selectedClass);
    const initialRecords = {};
    students.forEach(student => {
      initialRecords[student.id] = 'present';
    });
    setAttendanceRecords(initialRecords);
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSelectAll = (status) => {
    setSelectAll(status);
    const students = getStudentsForClass(selectedClass);
    const newRecords = {};
    students.forEach(student => {
      newRecords[student.id] = status;
    });
    setAttendanceRecords(newRecords);
  };

  const handleSubmitAttendance = () => {
    const students = getStudentsForClass(selectedClass);
    const presentCount = students.filter(s => attendanceRecords[s.id] === 'present').length;
    const leaveCount = students.filter(s => attendanceRecords[s.id] === 'leave').length;
    const absentCount = students.filter(s => attendanceRecords[s.id] === 'absent').length;

    alert(`Attendance Saved Successfully!\n\nDate: ${attendanceDate}\nClass: ${classes.find(c => c.id === parseInt(selectedClass))?.name}\n\nPresent: ${presentCount}\nOn Leave: ${leaveCount}\nAbsent: ${absentCount}`);
    
    // Reset form
    setShowStudents(false);
    setSelectedClass('');
    setAttendanceRecords({});
    setSelectAll('');
  };

  const getAttendanceStats = () => {
    const students = getStudentsForClass(selectedClass);
    const present = students.filter(s => attendanceRecords[s.id] === 'present').length;
    const leave = students.filter(s => attendanceRecords[s.id] === 'leave').length;
    const absent = students.filter(s => attendanceRecords[s.id] === 'absent').length;
    return { present, leave, absent, total: students.length };
  };

  const stats = showStudents ? getAttendanceStats() : { present: 0, leave: 0, absent: 0, total: 0 };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-colors font-medium">
            <Home className="w-4 h-4" /><span>Dashboard</span>
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-blue-600 font-semibold">Attendance</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-semibold">Student Attendance</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add/Update Attendance</h1>
              <p className="text-gray-600 mt-1">Mark student attendance for the selected class</p>
            </div>
          </div>
        </div>

        {/* Date and Class Selection */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Search className="w-4 h-4 inline mr-2" />
                Search Class <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a class...</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} - {cls.students} Students
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSearchClass}
              disabled={!selectedClass || !attendanceDate}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              Search & Load Students
            </button>
          </div>
        </div>

        {/* Students List */}
        {showStudents && (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                    <div className="text-sm text-gray-600">Total Students</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stats.present}</div>
                    <div className="text-sm text-gray-600">Present</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stats.leave}</div>
                    <div className="text-sm text-gray-600">On Leave</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stats.absent}</div>
                    <div className="text-sm text-gray-600">Absent</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-semibold text-gray-700">Quick Mark All:</span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleSelectAll('present')}
                    className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg font-semibold transition-all flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    All Present
                  </button>
                  <button
                    onClick={() => handleSelectAll('leave')}
                    className="px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg font-semibold transition-all flex items-center gap-2"
                  >
                    <Clock className="w-4 h-4" />
                    All Leave
                  </button>
                  <button
                    onClick={() => handleSelectAll('absent')}
                    className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-semibold transition-all flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    All Absent
                  </button>
                </div>
              </div>
            </div>

            {/* Students Attendance Table */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-6">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                  {classes.find(c => c.id === parseInt(selectedClass))?.name} - Attendance Sheet
                </h2>
                <p className="text-sm text-gray-600 mt-1">Date: {new Date(attendanceDate).toLocaleDateString('en-GB')}</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left font-bold">Roll No</th>
                      <th className="px-6 py-4 text-left font-bold">Photo</th>
                      <th className="px-6 py-4 text-left font-bold">Registration No</th>
                      <th className="px-6 py-4 text-left font-bold">Student Name</th>
                      <th className="px-6 py-4 text-center font-bold">Attendance Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {getStudentsForClass(selectedClass).map((student) => (
                      <tr key={student.id} className="hover:bg-blue-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-bold text-gray-900">{student.rollNo}</span>
                        </td>
                        <td className="px-6 py-4">
                          <img
                            src={student.photo}
                            alt={student.name}
                            className="w-12 h-12 rounded-full border-2 border-blue-200"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-700">{student.regNo}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-900">{student.name}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              onClick={() => handleAttendanceChange(student.id, 'present')}
                              className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                                attendanceRecords[student.id] === 'present'
                                  ? 'bg-green-600 text-white shadow-lg scale-105'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                            >
                              <CheckCircle className="w-4 h-4" />
                              Present
                            </button>
                            <button
                              onClick={() => handleAttendanceChange(student.id, 'leave')}
                              className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                                attendanceRecords[student.id] === 'leave'
                                  ? 'bg-yellow-600 text-white shadow-lg scale-105'
                                  : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                              }`}
                            >
                              <Clock className="w-4 h-4" />
                              On Leave
                            </button>
                            <button
                              onClick={() => handleAttendanceChange(student.id, 'absent')}
                              className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                                attendanceRecords[student.id] === 'absent'
                                  ? 'bg-red-600 text-white shadow-lg scale-105'
                                  : 'bg-red-100 text-red-700 hover:bg-red-200'
                              }`}
                            >
                              <XCircle className="w-4 h-4" />
                              Absent
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowStudents(false);
                  setAttendanceRecords({});
                  setSelectAll('');
                }}
                className="px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <XCircle className="w-5 h-5" />
                Cancel
              </button>
              <button
                onClick={handleSubmitAttendance}
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                Submit Attendance
              </button>
            </div>
          </>
        )}

        {/* Info Message */}
        {!showStudents && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8 text-center">
            <AlertCircle className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Select Date and Class</h3>
            <p className="text-gray-600">
              Please select a date and class from the options above, then click "Search & Load Students" to mark attendance.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAttendance;
