import { useEffect, useMemo, useState } from 'react';
import { School, Calendar, Download, TrendingUp, Users, UserCheck, UserX, BarChart3, PieChart } from 'lucide-react';
import { attendanceApi } from '../../../../services/attendanceApi';
import { classApi } from '../../../../services/classApi';
import toast from 'react-hot-toast';

const normalizeClassName = (value = '') => {
  const match = value.toString().match(/\d+/);
  return match ? match[0] : value.toString().trim();
};

const ClassWiseReport = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewType, setViewType] = useState('chart');
  const [classes, setClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingReport, setLoadingReport] = useState(false);
  const [reportSummary, setReportSummary] = useState(null);
  const [reportDaily, setReportDaily] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoadingClasses(true);
        const res = await classApi.getAllClasses({ limit: 100 });
        const list = res?.data || res?.data?.data || res?.classes || [];
        setClasses(list);
        if (list.length > 0) {
          setSelectedClass(list[0].className);
        }
      } catch (error) {
        console.error('Failed to load classes', error);
        toast.error('Failed to load classes');
        setClasses([]);
      } finally {
        setLoadingClasses(false);
      }
    };
    fetchClasses();
  }, []);

  const fetchReport = async () => {
    if (!selectedClass) {
      toast.error('Please select a class');
      return;
    }
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }
    try {
      setLoadingReport(true);
      const data = await attendanceApi.getClassWiseReport({
        date: selectedDate,
        classId: normalizeClassName(selectedClass)
      });
      setReportSummary(data?.summary || null);
      setReportDaily(data?.daily || []);
    } catch (error) {
      console.error('Failed to load report', error);
      toast.error(error.message || 'Failed to load report');
      setReportSummary(null);
      setReportDaily([]);
    } finally {
      setLoadingReport(false);
    }
  };

  const totalStudentsAllClasses = reportSummary?.totalRecords || 0;
  const totalPresentAllClasses = reportSummary?.present || 0;
  const totalAbsentAllClasses = reportSummary?.absent || 0;
  const overallAttendanceRate = totalStudentsAllClasses
    ? ((totalPresentAllClasses / totalStudentsAllClasses) * 100).toFixed(1)
    : '0.0';

  const classesOptions = classes.map(cls => ({
    value: cls.className,
    label: `${cls.className}${cls.section ? ` - ${cls.section}` : ''}`
  }));

  const chartDaily = useMemo(() => {
    if (!reportDaily || reportDaily.length === 0) return [];
    return reportDaily.map(item => {
      const total = item.total || 0;
      const present = item.present || 0;
      const absent = item.absent || 0;
      const leave = item.leave || 0;
      const percentage = total ? Number(((present / total) * 100).toFixed(1)) : 0;
      return {
        date: item._id?.date,
        day: new Date(item._id?.date).toLocaleDateString('en-US', { weekday: 'short' }),
        present,
        absent: absent + leave,
        percentage
      };
    });
  }, [reportDaily]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Class Wise Attendance Report</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Visual analytics and statistics for class attendance</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label">
              <School className="w-4 h-4 inline mr-2" />
              Select Class
            </label>
            {loadingClasses ? (
              <div className="text-sm text-gray-500 dark:text-gray-400">Loading classes...</div>
            ) : classesOptions.length === 0 ? (
              <div className="text-sm text-gray-500 dark:text-gray-400">No classes found</div>
            ) : (
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="input-field"
              >
                {classesOptions.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            )}
          </div>
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
        </div>
        <div className="mt-4 flex justify-end">
          <button
            className="btn-primary"
            onClick={fetchReport}
            disabled={loadingReport || loadingClasses || !selectedClass || !selectedDate}
          >
            {loadingReport ? 'Loading...' : 'Load Report'}
          </button>
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
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">{totalAbsentAllClasses}</p>
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
            {!reportSummary ? (
              <div className="text-sm text-gray-500 dark:text-gray-400">Load a report to see data.</div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                      {selectedClass}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">
                      {reportSummary.present || 0} Present
                    </span>
                    <span className="text-sm font-bold text-red-600 dark:text-red-400">
                      {(reportSummary.absent || 0) + (reportSummary.leave || 0)} Absent/Leave
                    </span>
                    <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
                      {overallAttendanceRate}%
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6">
                    <div
                      className="h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2 bg-emerald-500"
                      style={{ width: `${overallAttendanceRate}%` }}
                    >
                      <span className="text-xs font-semibold text-white">
                        {overallAttendanceRate}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Daily Trend Chart */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">
              Daily Attendance Trend - {selectedClass}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Date</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Day</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Present</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Absent/Leave</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {chartDaily.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-4 px-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        No data for selected range
                      </td>
                    </tr>
                  ) : (
                    chartDaily.map((item, index) => (
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
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
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
                  </tr>
                </thead>
                <tbody>
                  {reportSummary ? (
                    <tr className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-4 px-4 text-sm font-medium text-gray-800 dark:text-gray-100">
                        {selectedClass}
                      </td>
                      <td className="py-4 px-4 text-center text-sm text-gray-700 dark:text-gray-300">
                        {reportSummary.totalRecords || 0}
                      </td>
                      <td className="py-4 px-4 text-center text-sm text-green-600 dark:text-green-400">
                        {reportSummary.present || 0}
                      </td>
                      <td className="py-4 px-4 text-center text-sm text-red-600 dark:text-red-400">
                        {(reportSummary.absent || 0) + (reportSummary.leave || 0)}
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-4 px-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        Load a report to view data
                      </td>
                    </tr>
                  )}
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
                    <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Absent/Leave</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Percentage</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {chartDaily.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-4 px-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        No data for selected range
                      </td>
                    </tr>
                  ) : (
                    chartDaily.map((item, index) => (
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
                    ))
                  )}
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