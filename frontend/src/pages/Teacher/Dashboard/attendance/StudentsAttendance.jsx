import { useState, useEffect } from 'react';
import { Calendar, Users, Check, X, Save, UserCheck } from 'lucide-react';
import { attendanceApi } from '../../../../services/attendanceApi';
import { classApi } from '../../../../services/classApi';
import toast from 'react-hot-toast';

const StudentsAttendance = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAttendanceSection, setShowAttendanceSection] = useState(false);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [attendance, setAttendance] = useState({});
  const [classLoadError, setClassLoadError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoadingClasses(true);
        setClassLoadError(null);
        const data = await classApi.getAllClasses();
        if (data?.success) {
          setClasses(data.data || []);
        } else {
          setClasses([]);
          setClassLoadError('Unable to load classes');
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
        setClassLoadError('Failed to load classes');
        toast.error('Failed to load classes');
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchClasses();
  }, []);

  const handleSubmit = async () => {
    if (!selectedClass || !selectedDate) {
      toast.error('Please select both class and date');
      return;
    }
    const [className, rawSection] = selectedClass.split('::');
    const section = rawSection || 'A';
    try {
      setLoadingStudents(true);
      setShowAttendanceSection(false);
      setStudents([]);
      setAttendance({});
      const data = await attendanceApi.getStudentsForAttendance(className, section, selectedDate);
      setStudents(data);
      const initialAttendance = data.reduce((acc, student) => {
        acc[student._id] = student.attendanceStatus || 'present';
        return acc;
      }, {});
      setAttendance(initialAttendance);
      setShowAttendanceSection(true);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to fetch students');
    } finally {
      setLoadingStudents(false);
    }
  };

  const toggleAttendance = (studentId) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'present' ? 'absent' : 'present'
    }));
  };

  const handleSaveAttendance = async () => {
    if (!selectedClass || !selectedDate) {
      toast.error('Please select both class and date');
      return;
    }
    const [className, section] = selectedClass.split('::');
    const payload = {
      date: selectedDate,
      class: className,
      section,
      attendance: students.map((s) => ({
        studentId: s._id,
        status: attendance[s._id] || 'present',
        remark: ''
      }))
    };
    try {
      setSaving(true);
      await attendanceApi.markStudentAttendance(payload);
      toast.success('Attendance saved successfully');
    } catch (error) {
      console.error('Error saving attendance:', error);
      toast.error(error.message || 'Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  const presentCount = Object.values(attendance).filter(status => status === 'present').length;
  const absentCount = Object.values(attendance).filter(status => status === 'absent').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Add / Update Attendance</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Select date and class to mark attendance</p>
        </div>
      </div>

      {/* Date and Class Selection */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="label">
              <Calendar className="w-4 h-4 inline mr-2" />
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="label">
              <Users className="w-4 h-4 inline mr-2" />
              Search / Select Class
            </label>
            {loadingClasses ? (
              <div className="text-sm text-gray-500 dark:text-gray-400">Loading classes...</div>
            ) : classes.length === 0 ? (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {classLoadError || 'No classes assigned to you yet.'}
              </div>
            ) : (
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="input-field"
              >
                <option value="">Select a class</option>
                {classes.map((cls) => (
                  <option
                    key={`${cls._id}`}
                    value={`${cls.className}::${cls.section || 'A'}`}
                  >
                    {cls.className}{cls.section ? ` - ${cls.section}` : ''}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="flex items-end">
            <button
              onClick={handleSubmit}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-70"
              disabled={loadingStudents}
            >
              <UserCheck className="w-5 h-5" />
              {loadingStudents ? 'Loading...' : 'Submit'}
            </button>
          </div>
        </div>
      </div>

      {/* Mark Attendance Section */}
      {showAttendanceSection && (
        <div className="space-y-6 animate-slideIn">
          {/* Mark Attendance Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Mark Attendance</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {selectedClass} - {new Date(selectedDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
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

          {/* Students Attendance Table */}
          <div className="card">
            {loadingStudents ? (
              <div className="text-center py-10 text-gray-500 dark:text-gray-400">Loading students...</div>
            ) : students.length === 0 ? (
              <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                No students found for this class.
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Reg. No</th>
                        <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Photo</th>
                        <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Student Name</th>
                        <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Section</th>
                        <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student._id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="py-4 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">{student.registrationNo || student.rollNumber}</td>
                          <td className="py-4 px-4">
                            <img
                              src={student.picture || student.photo}
                              alt={student.studentName}
                              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                            <div 
                              className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full hidden items-center justify-center text-white font-semibold text-lg"
                            >
                              {student.studentName?.charAt(0)}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{student.studentName}</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">Roll: {student.rollNumber || student.registrationNo}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">{student.section}</td>
                          <td className="py-4 px-4 text-center">
                            <div className="flex items-center justify-center gap-3">
                              <button
                                onClick={() => setAttendance(prev => ({ ...prev, [student._id]: 'present' }))}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                  attendance[student._id] === 'present'
                                    ? 'bg-green-500 text-white shadow-lg'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-green-100 dark:hover:bg-green-900/30'
                                }`}
                              >
                                Present
                              </button>
                              <button
                                onClick={() => setAttendance(prev => ({ ...prev, [student._id]: 'absent' }))}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                  attendance[student._id] === 'absent'
                                    ? 'bg-red-500 text-white shadow-lg'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/30'
                                }`}
                              >
                                Absent
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Submit Button */}
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={handleSaveAttendance}
                    className="btn-primary flex items-center gap-2 disabled:opacity-70"
                    disabled={saving}
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Attendance'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentsAttendance;
