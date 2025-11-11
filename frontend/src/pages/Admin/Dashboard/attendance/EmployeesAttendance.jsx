import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, ChevronRight, UserCheck, Calendar, CheckCircle, XCircle, 
  Clock, Users, Save, AlertCircle, Filter, Briefcase, User
} from 'lucide-react';

const EmployeesAttendance = () => {
  const navigate = useNavigate();
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [showEmployees, setShowEmployees] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [selectAll, setSelectAll] = useState('');

  // Sample employees data
  const employees = [
    { id: 1, employeeId: 'EMP001', name: 'Dr. Rajesh Kumar', fatherName: 'Mr. Suresh Kumar', role: 'Principal', department: 'Administration', photo: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=4F46E5&color=fff' },
    { id: 2, employeeId: 'EMP002', name: 'Mrs. Priya Sharma', fatherName: 'Mr. Ramesh Sharma', role: 'Mathematics Teacher', department: 'Teaching', photo: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=7C3AED&color=fff' },
    { id: 3, employeeId: 'EMP003', name: 'Mr. Amit Patel', fatherName: 'Mr. Vijay Patel', role: 'Science Teacher', department: 'Teaching', photo: 'https://ui-avatars.com/api/?name=Amit+Patel&background=EC4899&color=fff' },
    { id: 4, employeeId: 'EMP004', name: 'Ms. Sneha Reddy', fatherName: 'Mr. Krishna Reddy', role: 'English Teacher', department: 'Teaching', photo: 'https://ui-avatars.com/api/?name=Sneha+Reddy&background=F59E0B&color=fff' },
    { id: 5, employeeId: 'EMP005', name: 'Mr. Vikram Singh', fatherName: 'Mr. Rajendra Singh', role: 'Sports Instructor', department: 'Sports', photo: 'https://ui-avatars.com/api/?name=Vikram+Singh&background=10B981&color=fff' },
    { id: 6, employeeId: 'EMP006', name: 'Mrs. Anita Desai', fatherName: 'Mr. Mohan Desai', role: 'Librarian', department: 'Library', photo: 'https://ui-avatars.com/api/?name=Anita+Desai&background=3B82F6&color=fff' },
    { id: 7, employeeId: 'EMP007', name: 'Mr. Suresh Nair', fatherName: 'Mr. Gopal Nair', role: 'Lab Assistant', department: 'Laboratory', photo: 'https://ui-avatars.com/api/?name=Suresh+Nair&background=EF4444&color=fff' },
    { id: 8, employeeId: 'EMP008', name: 'Ms. Kavita Joshi', fatherName: 'Mr. Prakash Joshi', role: 'Computer Teacher', department: 'Teaching', photo: 'https://ui-avatars.com/api/?name=Kavita+Joshi&background=8B5CF6&color=fff' },
    { id: 9, employeeId: 'EMP009', name: 'Mr. Ravi Verma', fatherName: 'Mr. Ashok Verma', role: 'Accountant', department: 'Administration', photo: 'https://ui-avatars.com/api/?name=Ravi+Verma&background=06B6D4&color=fff' },
    { id: 10, employeeId: 'EMP010', name: 'Mrs. Meera Iyer', fatherName: 'Mr. Venkat Iyer', role: 'HR Manager', department: 'Administration', photo: 'https://ui-avatars.com/api/?name=Meera+Iyer&background=F97316&color=fff' },
    { id: 11, employeeId: 'EMP011', name: 'Mr. Arjun Menon', fatherName: 'Mr. Sanjay Menon', role: 'Physics Teacher', department: 'Teaching', photo: 'https://ui-avatars.com/api/?name=Arjun+Menon&background=14B8A6&color=fff' },
    { id: 12, employeeId: 'EMP012', name: 'Ms. Divya Kapoor', fatherName: 'Mr. Anil Kapoor', role: 'Chemistry Teacher', department: 'Teaching', photo: 'https://ui-avatars.com/api/?name=Divya+Kapoor&background=A855F7&color=fff' },
    { id: 13, employeeId: 'EMP013', name: 'Mr. Karan Malhotra', fatherName: 'Mr. Rohit Malhotra', role: 'Biology Teacher', department: 'Teaching', photo: 'https://ui-avatars.com/api/?name=Karan+Malhotra&background=EC4899&color=fff' },
    { id: 14, employeeId: 'EMP014', name: 'Mrs. Pooja Chopra', fatherName: 'Mr. Deepak Chopra', role: 'Hindi Teacher', department: 'Teaching', photo: 'https://ui-avatars.com/api/?name=Pooja+Chopra&background=F59E0B&color=fff' },
    { id: 15, employeeId: 'EMP015', name: 'Mr. Nikhil Bhatia', fatherName: 'Mr. Manoj Bhatia', role: 'Art Teacher', department: 'Teaching', photo: 'https://ui-avatars.com/api/?name=Nikhil+Bhatia&background=10B981&color=fff' }
  ];

  const handleLoadEmployees = () => {
    if (!attendanceDate) {
      alert('Please select a date');
      return;
    }
    setShowEmployees(true);
    // Initialize attendance records for all employees as present by default
    const initialRecords = {};
    employees.forEach(employee => {
      initialRecords[employee.id] = 'present';
    });
    setAttendanceRecords(initialRecords);
  };

  const handleAttendanceChange = (employeeId, status) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [employeeId]: status
    }));
  };

  const handleSelectAll = (status) => {
    setSelectAll(status);
    const newRecords = {};
    employees.forEach(employee => {
      newRecords[employee.id] = status;
    });
    setAttendanceRecords(newRecords);
  };

  const handleSubmitAttendance = () => {
    const presentCount = employees.filter(e => attendanceRecords[e.id] === 'present').length;
    const leaveCount = employees.filter(e => attendanceRecords[e.id] === 'leave').length;
    const absentCount = employees.filter(e => attendanceRecords[e.id] === 'absent').length;

    alert(`Attendance Saved Successfully!\n\nDate: ${attendanceDate}\n\nPresent: ${presentCount}\nOn Leave: ${leaveCount}\nAbsent: ${absentCount}`);
    
    // Reset form
    setShowEmployees(false);
    setAttendanceRecords({});
    setSelectAll('');
  };

  const getAttendanceStats = () => {
    const present = employees.filter(e => attendanceRecords[e.id] === 'present').length;
    const leave = employees.filter(e => attendanceRecords[e.id] === 'leave').length;
    const absent = employees.filter(e => attendanceRecords[e.id] === 'absent').length;
    return { present, leave, absent, total: employees.length };
  };

  const stats = showEmployees ? getAttendanceStats() : { present: 0, leave: 0, absent: 0, total: 0 };

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
          <span className="text-gray-900 font-semibold">Employees Attendance</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add/Update Attendance</h1>
              <p className="text-gray-600 mt-1">Mark employee attendance for the selected date</p>
            </div>
          </div>
        </div>

        {/* Date Selection */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-6">
          <div className="max-w-md">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 mb-6"
            />

            <button
              onClick={handleLoadEmployees}
              disabled={!attendanceDate}
              className="w-full px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Users className="w-5 h-5" />
              Load All Employees
            </button>
          </div>
        </div>

        {/* Employees List */}
        {showEmployees && (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                    <div className="text-sm text-gray-600">Total Employees</div>
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

            {/* Employees Attendance Table */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-6">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-purple-600" />
                  Employees Attendance Sheet
                </h2>
                <p className="text-sm text-gray-600 mt-1">Date: {new Date(attendanceDate).toLocaleDateString('en-GB')}</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left font-bold">S.No</th>
                      <th className="px-6 py-4 text-left font-bold">Photo</th>
                      <th className="px-6 py-4 text-left font-bold">Employee ID</th>
                      <th className="px-6 py-4 text-left font-bold">Name</th>
                      <th className="px-6 py-4 text-left font-bold">Father's Name</th>
                      <th className="px-6 py-4 text-left font-bold">Employee Role</th>
                      <th className="px-6 py-4 text-center font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {employees.map((employee, index) => (
                      <tr key={employee.id} className="hover:bg-purple-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-bold text-gray-900">{index + 1}</span>
                        </td>
                        <td className="px-6 py-4">
                          <img
                            src={employee.photo}
                            alt={employee.name}
                            className="w-12 h-12 rounded-full border-2 border-purple-200"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-700">{employee.employeeId}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">{employee.name}</div>
                          <div className="text-xs text-gray-500">{employee.department}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-700">{employee.fatherName}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                            {employee.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleAttendanceChange(employee.id, 'present')}
                              className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                                attendanceRecords[employee.id] === 'present'
                                  ? 'bg-green-600 text-white shadow-lg scale-105'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                            >
                              <CheckCircle className="w-4 h-4" />
                              Present
                            </button>
                            <button
                              onClick={() => handleAttendanceChange(employee.id, 'leave')}
                              className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                                attendanceRecords[employee.id] === 'leave'
                                  ? 'bg-yellow-600 text-white shadow-lg scale-105'
                                  : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                              }`}
                            >
                              <Clock className="w-4 h-4" />
                              On Leave
                            </button>
                            <button
                              onClick={() => handleAttendanceChange(employee.id, 'absent')}
                              className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                                attendanceRecords[employee.id] === 'absent'
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
                  setShowEmployees(false);
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
        {!showEmployees && (
          <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-8 text-center">
            <AlertCircle className="w-16 h-16 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Select Date</h3>
            <p className="text-gray-600">
              Please select a date from the options above, then click "Load All Employees" to mark attendance.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeesAttendance;
