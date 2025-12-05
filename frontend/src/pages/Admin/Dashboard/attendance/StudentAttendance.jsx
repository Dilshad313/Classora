import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, ChevronRight, UserCheck, Calendar, Search, CheckCircle, XCircle, 
  Clock, Users, Save, AlertCircle, Filter, GraduationCap,
  Loader2
} from 'lucide-react';
import { attendanceApi } from '../../../../services/attendanceApi';
import { getStudents } from '../../../../services/studentApi';

const StudentAttendance = () => {
  const navigate = useNavigate();
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [showStudents, setShowStudents] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [selectAll, setSelectAll] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);

  // Load classes on component mount
  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const studentsData = await getStudents();
      
      // Extract unique classes from students
      const classSet = new Set();
      studentsData.forEach(student => {
        if (student.selectClass && student.section) {
          classSet.add(`${student.selectClass}-${student.section}`);
        }
      });
      
      const classList = Array.from(classSet).map(cls => {
        const [classNum, section] = cls.split('-');
        const classSize = studentsData.filter(s => 
          s.selectClass === classNum && s.section === section
        ).length;
        
        return {
          id: cls,
          name: `Class ${classNum}-${section}`,
          class: classNum,
          section: section,
          students: classSize
        };
      }).sort((a, b) => {
        // Sort by class number then section
        if (a.class !== b.class) return a.class - b.class;
        return a.section.localeCompare(b.section);
      });
      
      setClasses(classList);
    } catch (error) {
      console.error('Failed to load classes:', error);
    }
  };

  const handleSearchClass = async () => {
    if (!selectedClass || !attendanceDate) {
      alert('Please select both date and class');
      return;
    }

    setIsLoading(true);
    try {
      const [classNum, section] = selectedClass.split('-');
      
      // Get students for attendance
      const studentsData = await attendanceApi.getStudentsForAttendance(classNum, section, attendanceDate);
      setStudents(studentsData);
      setShowStudents(true);
      
      // Initialize attendance records
      const initialRecords = {};
      studentsData.forEach(student => {
        initialRecords[student._id] = student.attendanceStatus || 'present';
      });
      setAttendanceRecords(initialRecords);
    } catch (error) {
      alert(`Failed to load students: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSelectAll = (status) => {
    setSelectAll(status);
    const newRecords = {};
    students.forEach(student => {
      newRecords[student._id] = status;
    });
    setAttendanceRecords(newRecords);
  };

  const handleSubmitAttendance = async () => {
    const [classNum, section] = selectedClass.split('-');
    const attendanceArray = students.map(student => ({
      studentId: student._id,
      status: attendanceRecords[student._id] || 'present'
    }));

    try {
      await attendanceApi.markStudentAttendance({
        date: attendanceDate,
        class: classNum,
        section: section,
        attendance: attendanceArray
      });
      
      alert('Attendance Saved Successfully!');
      
      // Reset form
      setShowStudents(false);
      setSelectedClass('');
      setAttendanceRecords({});
      setSelectAll('');
      setStudents([]);
    } catch (error) {
      alert(`Failed to save attendance: ${error.message}`);
    }
  };

  const getAttendanceStats = () => {
    const present = students.filter(s => attendanceRecords[s._id] === 'present').length;
    const leave = students.filter(s => attendanceRecords[s._id] === 'leave').length;
    const absent = students.filter(s => attendanceRecords[s._id] === 'absent').length;
    return { present, leave, absent, total: students.length };
  };

  const stats = showStudents ? getAttendanceStats() : { present: 0, leave: 0, absent: 0, total: 0 };

  // Get avatar URL
  const getAvatarUrl = (name, regNo) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${getColorFromId(regNo)}&color=fff`;
  };

  const getColorFromId = (id) => {
    const colors = [
      '4F46E5', '7C3AED', 'EC4899', 'F59E0B', '10B981',
      '3B82F6', 'EF4444', '8B5CF6', '06B6D4', 'F97316',
      '14B8A6', 'A855F7', 'EC4899', 'F59E0B', '10B981'
    ];
    const index = parseInt(id.replace(/\D/g, '')) % colors.length;
    return colors[index];
  };

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
              disabled={!selectedClass || !attendanceDate || isLoading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading Students...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Search & Load Students
                </>
              )}
            </button>
          </div>
        </div>

        {/* Students List */}
        {showStudents && !isLoading && (
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
                  {classes.find(c => c.id === selectedClass)?.name || selectedClass} - Attendance Sheet
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
                    {students.map((student) => (
                      <tr key={student._id} className="hover:bg-blue-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-bold text-gray-900">{student.rollNumber || 'N/A'}</span>
                        </td>
                        <td className="px-6 py-4">
                          <img
                            src={student.picture?.url || getAvatarUrl(student.studentName, student.registrationNo)}
                            alt={student.studentName}
                            className="w-12 h-12 rounded-full border-2 border-blue-200 object-cover"
                            onError={(e) => {
                              e.target.src = getAvatarUrl(student.studentName, student.registrationNo);
                            }}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-700">{student.registrationNo}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-900">{student.studentName}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              onClick={() => handleAttendanceChange(student._id, 'present')}
                              className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                                attendanceRecords[student._id] === 'present'
                                  ? 'bg-green-600 text-white shadow-lg scale-105'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                            >
                              <CheckCircle className="w-4 h-4" />
                              Present
                            </button>
                            <button
                              onClick={() => handleAttendanceChange(student._id, 'leave')}
                              className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                                attendanceRecords[student._id] === 'leave'
                                  ? 'bg-yellow-600 text-white shadow-lg scale-105'
                                  : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                              }`}
                            >
                              <Clock className="w-4 h-4" />
                              On Leave
                            </button>
                            <button
                              onClick={() => handleAttendanceChange(student._id, 'absent')}
                              className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                                attendanceRecords[student._id] === 'absent'
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
                  setStudents([]);
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
        {!showStudents && !isLoading && (
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