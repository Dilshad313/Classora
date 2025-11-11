import { useState } from 'react';
import { School, Calendar, Download, TrendingUp, Users, UserCheck, UserX } from 'lucide-react';

const ClassWiseReport = () => {
  const [selectedClass, setSelectedClass] = useState('10-A');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const classData = [
    { class: '10-A', totalStudents: 35, avgAttendance: 94.5, present: 33, absent: 2 },
    { class: '9-B', totalStudents: 32, avgAttendance: 91.2, present: 29, absent: 3 },
    { class: '10-C', totalStudents: 38, avgAttendance: 96.8, present: 37, absent: 1 },
    { class: '8-A', totalStudents: 30, avgAttendance: 89.5, present: 27, absent: 3 },
  ];

  const monthlyData = [
    { date: '2024-01-01', present: 33, absent: 2, percentage: 94.3 },
    { date: '2024-01-02', present: 32, absent: 3, percentage: 91.4 },
    { date: '2024-01-03', present: 34, absent: 1, percentage: 97.1 },
    { date: '2024-01-04', present: 33, absent: 2, percentage: 94.3 },
    { date: '2024-01-05', present: 35, absent: 0, percentage: 100 },
  ];

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Class Wise Attendance Report</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">View attendance statistics by class</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export Report
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
              <option value="10-A">Class 10-A</option>
              <option value="9-B">Class 9-B</option>
              <option value="10-C">Class 10-C</option>
              <option value="8-A">Class 8-A</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Month
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="input"
            >
              {months.map((month, index) => (
                <option key={index} value={index}>{month}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="input"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-2">
            <School className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Students</p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">35</p>
        </div>
        <div className="card bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between mb-2">
            <UserCheck className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Present</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">33</p>
        </div>
        <div className="card bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800">
          <div className="flex items-center justify-between mb-2">
            <UserX className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Absent</p>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">2</p>
        </div>
        <div className="card bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Attendance Rate</p>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">94.5%</p>
        </div>
      </div>

      {/* All Classes Overview */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">All Classes Overview</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Class</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Total Students</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Present</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Absent</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Attendance %</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
              </tr>
            </thead>
            <tbody>
              {classData.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{item.class}</span>
                  </td>
                  <td className="py-3 px-4 text-center text-sm text-gray-700 dark:text-gray-300">{item.totalStudents}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">{item.present}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-sm font-semibold text-red-600 dark:text-red-400">{item.absent}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{item.avgAttendance}%</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                      item.avgAttendance >= 95 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                      item.avgAttendance >= 90 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                      item.avgAttendance >= 85 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                      'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    }`}>
                      {item.avgAttendance >= 95 ? 'Excellent' :
                       item.avgAttendance >= 90 ? 'Good' :
                       item.avgAttendance >= 85 ? 'Average' : 'Poor'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Daily Attendance Trend */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
          Daily Attendance Trend - {selectedClass}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Date</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Present</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Absent</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Percentage</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Progress</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                    {new Date(item.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">{item.present}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-sm font-semibold text-red-600 dark:text-red-400">{item.absent}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{item.percentage}%</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
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

export default ClassWiseReport;
