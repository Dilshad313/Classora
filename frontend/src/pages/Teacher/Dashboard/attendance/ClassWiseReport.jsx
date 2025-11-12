import { useState } from 'react';
import { School, Calendar, Download, TrendingUp, Users, UserCheck, UserX, BarChart3, PieChart } from 'lucide-react';

const ClassWiseReport = () => {
  const [selectedClass, setSelectedClass] = useState('10-A');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [viewType, setViewType] = useState('chart');

  const classData = [
    { class: '10-A', totalStudents: 35, avgAttendance: 94.5, present: 33, absent: 2, color: '#10B981' },
    { class: '9-B', totalStudents: 32, avgAttendance: 91.2, present: 29, absent: 3, color: '#3B82F6' },
    { class: '10-C', totalStudents: 38, avgAttendance: 96.8, present: 37, absent: 1, color: '#8B5CF6' },
    { class: '8-A', totalStudents: 30, avgAttendance: 89.5, present: 27, absent: 3, color: '#F59E0B' },
    { class: '9-A', totalStudents: 33, avgAttendance: 92.8, present: 31, absent: 2, color: '#EF4444' },
    { class: '8-B', totalStudents: 29, avgAttendance: 88.2, present: 26, absent: 3, color: '#06B6D4' },
  ];

  const monthlyData = [
    { date: '2024-01-01', present: 33, absent: 2, percentage: 94.3, day: 'Mon' },
    { date: '2024-01-02', present: 32, absent: 3, percentage: 91.4, day: 'Tue' },
    { date: '2024-01-03', present: 34, absent: 1, percentage: 97.1, day: 'Wed' },
    { date: '2024-01-04', present: 33, absent: 2, percentage: 94.3, day: 'Thu' },
    { date: '2024-01-05', present: 35, absent: 0, percentage: 100, day: 'Fri' },
    { date: '2024-01-08', present: 31, absent: 4, percentage: 88.6, day: 'Mon' },
    { date: '2024-01-09', present: 33, absent: 2, percentage: 94.3, day: 'Tue' },
  ];

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const maxAttendance = Math.max(...classData.map(item => item.avgAttendance));
  const totalStudentsAllClasses = classData.reduce((sum, item) => sum + item.totalStudents, 0);
  const totalPresentAllClasses = classData.reduce((sum, item) => sum + item.present, 0);
  const overallAttendanceRate = ((totalPresentAllClasses / totalStudentsAllClasses) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Class Wise Attendance Report</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Visual analytics and statistics for class attendance</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewType('chart')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewType === 'chart'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <BarChart3 className="w-4 h-4 mr-2 inline" />
              Chart View
            </button>
            <button
              onClick={() => setViewType('table')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewType === 'table'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <PieChart className="w-4 h-4 mr-2 inline" />
              Table View
            </button>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Report
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="label">
              <School className="w-4 h-4 inline mr-2" />
              Select Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="input-field"
            >
              {classData.map((item) => (
                <option key={item.class} value={item.class}>Class {item.class}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">
              <Calendar className="w-4 h-4 inline mr-2" />
              Select Month
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="input-field"
            >
              {months.map((month, index) => (
                <option key={index} value={index}>{month}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">
              Select Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="input-field"
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
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalStudentsAllClasses}</p>
        </div>
        <div className="card bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between mb-2">
            <UserCheck className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Present</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{totalPresentAllClasses}</p>
        </div>
        <div className="card bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800">
          <div className="flex items-center justify-between mb-2">
            <UserX className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Absent</p>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">{totalStudentsAllClasses - totalPresentAllClasses}</p>
        </div>
        <div className="card bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Overall Rate</p>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{overallAttendanceRate}%</p>
        </div>
      </div>

      {/* Chart/Table View */}
      {viewType === 'chart' ? (
        <div className="space-y-6">
          {/* Class Attendance Chart */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Class Attendance Overview</h3>
            <div className="space-y-6">
              {classData.map((item, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        Class {item.class}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        ({item.totalStudents} students)
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">
                        {item.present} Present
                      </span>
                      <span className="text-sm font-bold text-red-600 dark:text-red-400">
                        {item.absent} Absent
                      </span>
                      <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
                        {item.avgAttendance}%
                      </span>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6">
                      <div 
                        className="h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                        style={{ 
                          width: `${item.avgAttendance}%`,
                          background: `linear-gradient(90deg, ${item.color}CC, ${item.color})`
                        }}
                      >
                        <span className="text-xs font-semibold text-white">
                          {item.avgAttendance}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Trend Chart */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">
              Daily Attendance Trend - {selectedClass}
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-7 gap-2">
                {monthlyData.map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                      {item.day}
                    </div>
                    <div 
                      className="w-full bg-gray-200 dark:bg-gray-700 rounded-lg flex flex-col justify-end relative overflow-hidden"
                      style={{ height: '120px' }}
                    >
                      <div 
                        className="bg-gradient-to-t from-green-500 to-green-400 rounded-lg transition-all duration-700 flex items-end justify-center pb-1"
                        style={{ height: `${item.percentage}%` }}
                      >
                        <span className="text-xs font-bold text-white">
                          {item.percentage}%
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {new Date(item.date).getDate()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* All Classes Table */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">All Classes Overview</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Class</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Total Students</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Present</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Absent</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Attendance %</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {classData.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-100">Class {item.class}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center text-sm text-gray-700 dark:text-gray-300">{item.totalStudents}</td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">{item.present}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-sm font-semibold text-red-600 dark:text-red-400">{item.absent}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-lg font-bold text-gray-800 dark:text-gray-100">{item.avgAttendance}%</span>
                      </td>
                      <td className="py-4 px-4 text-center">
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

          {/* Daily Attendance Table */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">
              Daily Attendance Details - {selectedClass}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Date</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Day</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Present</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Absent</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Percentage</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyData.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">
                        {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="py-4 px-4 text-center text-sm text-gray-600 dark:text-gray-400">{item.day}</td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">{item.present}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-sm font-semibold text-red-600 dark:text-red-400">{item.absent}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-lg font-bold text-gray-800 dark:text-gray-100">{item.percentage}%</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                            <div
                              className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-300"
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600 dark:text-gray-400 min-w-[40px]">
                            {item.percentage}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassWiseReport;
