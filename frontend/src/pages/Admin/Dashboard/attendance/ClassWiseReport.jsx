import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, ChevronRight, PieChart, Calendar, CheckCircle, XCircle, 
  Clock, Users, Download, Printer, BarChart3, TrendingUp, Loader2
} from 'lucide-react';
import { attendanceApi } from '../../../../services/attendanceApi';

const ClassWiseReport = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showReport, setShowReport] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState({
    report: [],
    overallStats: { totalStudents: 0, present: 0, leave: 0, absent: 0 },
    date: ''
  });

  const handleGenerateReport = async () => {
    if (!selectedDate) {
      alert('Please select a date');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await attendanceApi.getClassWiseReport(selectedDate);
      setReportData(data);
      setShowReport(true);
    } catch (error) {
      setError(error.message);
      alert(`Failed to generate report: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getPercentages = (data) => {
    const presentPercent = ((data.present / data.totalStudents) * 100).toFixed(1);
    const leavePercent = ((data.leave / data.totalStudents) * 100).toFixed(1);
    const absentPercent = ((data.absent / data.totalStudents) * 100).toFixed(1);
    return { presentPercent, leavePercent, absentPercent };
  };

  // SVG Pie Chart Component
  const PieChartSVG = ({ present, onLeave, absent, total }) => {
    const presentPercent = (present / total) * 100;
    const leavePercent = (onLeave / total) * 100;
    const absentPercent = (absent / total) * 100;

    // Calculate angles
    const presentAngle = (presentPercent / 100) * 360;
    const leaveAngle = (leavePercent / 100) * 360;
    const absentAngle = (absentPercent / 100) * 360;

    const getSlicePath = (startAngle, endAngle, radius = 80, cx = 100, cy = 100) => {
      const start = polarToCartesian(cx, cy, radius, endAngle);
      const end = polarToCartesian(cx, cy, radius, startAngle);
      const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
      return [
        'M', cx, cy,
        'L', start.x, start.y,
        'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
        'Z'
      ].join(' ');
    };

    const polarToCartesian = (cx, cy, radius, angle) => {
      const radians = ((angle - 90) * Math.PI) / 180;
      return {
        x: cx + radius * Math.cos(radians),
        y: cy + radius * Math.sin(radians)
      };
    };

    let currentAngle = 0;

    return (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {present > 0 && (
          <path
            d={getSlicePath(currentAngle, currentAngle + presentAngle)}
            fill="#3B82F6"
            stroke="white"
            strokeWidth="2"
          />
        )}
        {onLeave > 0 && (
          <path
            d={getSlicePath(currentAngle + presentAngle, currentAngle + presentAngle + leaveAngle)}
            fill="#9CA3AF"
            stroke="white"
            strokeWidth="2"
          />
        )}
        {absent > 0 && (
          <path
            d={getSlicePath(currentAngle + presentAngle + leaveAngle, 360)}
            fill="#EF4444"
            stroke="white"
            strokeWidth="2"
          />
        )}
        <circle cx="100" cy="100" r="45" fill="white" className="dark:fill-gray-800" />
        <text x="100" y="95" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#1F2937" className="dark:fill-gray-100">{total}</text>
        <text x="100" y="115" textAnchor="middle" fontSize="12" fill="#6B7280" className="dark:fill-gray-400">Students</text>
      </svg>
    );
  };

  const handleExport = async () => {
    try {
      const exportData = {
        startDate: selectedDate,
        endDate: selectedDate,
        format: 'csv'
      };
      
      const data = await attendanceApi.exportStudentReport(exportData);
      
      // Convert to CSV
      const headers = ['Date', 'Class', 'Total Students', 'Present', 'On Leave', 'Absent', 'Attendance %'];
      const rows = reportData.report.map(cls => [
        selectedDate,
        cls.className,
        cls.totalStudents,
        cls.present,
        cls.leave,
        cls.absent,
        ((cls.present / cls.totalStudents) * 100).toFixed(1) + '%'
      ]);
      
      const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `class_attendance_report_${selectedDate}.csv`;
      a.click();
      
      alert('Report exported successfully!');
    } catch (error) {
      alert(`Export failed: ${error.message}`);
    }
  };

  const { overallStats } = reportData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors font-medium">
            <Home className="w-4 h-4" /><span>Dashboard</span>
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span className="text-blue-600 dark:text-blue-400 font-semibold">Attendance</span>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span className="text-gray-900 dark:text-gray-100 font-semibold">Class Wise Report</span>
        </div>

        {/* Header */}
        <div className="mb-8 no-print">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <PieChart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Class Wise Attendance Report</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">Visual attendance overview for all classes</p>
              </div>
            </div>
            {showReport && (
              <div className="flex gap-3">
                <button onClick={handleExport} className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                  <Download className="w-5 h-5" />Export
                </button>
                <button onClick={() => window.print()} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                  <Printer className="w-5 h-5" />Print
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Date Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-600 p-8 mb-6 no-print">
          <div className="max-w-md">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Select Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-500 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 mb-6"
            />

            <button
              onClick={handleGenerateReport}
              disabled={!selectedDate || isLoading}
              className="w-full px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <BarChart3 className="w-5 h-5" />
                  Generate Report
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900 border-2 border-red-200 dark:border-red-700 rounded-2xl p-4 mb-6">
            <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
          </div>
        )}

        {/* Report Display */}
        {showReport && !isLoading && (
          <>
            {/* Overall Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-600 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{overallStats.totalStudents}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Total Students</div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-600 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{overallStats.present}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Present ({((overallStats.present / overallStats.totalStudents) * 100).toFixed(1)}%)</div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-600 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{overallStats.leave}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">On Leave ({((overallStats.leave / overallStats.totalStudents) * 100).toFixed(1)}%)</div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-600 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-xl flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{overallStats.absent}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Absent ({((overallStats.absent / overallStats.totalStudents) * 100).toFixed(1)}%)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-600 p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Legend</h3>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Present</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-400 rounded"></div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">On Leave</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Absent</span>
                </div>
              </div>
            </div>

            {/* Report Info */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 rounded-2xl border-2 border-blue-200 dark:border-blue-800 p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">Attendance Report</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Date: {new Date(selectedDate).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-700">
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Overall Attendance: {overallStats.totalStudents > 0 ? ((overallStats.present / overallStats.totalStudents) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>
            </div>

            {/* Class Cards with Pie Charts */}
            {reportData.report.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reportData.report.map((classData) => {
                  const { presentPercent, leavePercent, absentPercent } = getPercentages(classData);
                  return (
                    <div key={classData.className} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-600 p-6 hover:shadow-xl transition-shadow">
                      {/* Class Header */}
                      <div className="text-center mb-4">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{classData.className}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Total: {classData.totalStudents} Students</p>
                      </div>

                      {/* Pie Chart */}
                      <div className="w-48 h-48 mx-auto mb-6">
                        <PieChartSVG
                          present={classData.present}
                          onLeave={classData.leave}
                          absent={classData.absent}
                          total={classData.totalStudents}
                        />
                      </div>

                      {/* Statistics */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded"></div>
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Present</span>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{classData.present}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-300">{presentPercent}%</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-gray-400 rounded"></div>
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">On Leave</span>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{classData.leave}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-300">{leavePercent}%</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded"></div>
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Absent</span>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{classData.absent}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-300">{absentPercent}%</div>
                          </div>
                        </div>
                      </div>

                      {/* Attendance Rate Badge */}
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 text-center">
                        <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                          parseFloat(presentPercent) >= 90 ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                          parseFloat(presentPercent) >= 75 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                          'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                        }`}>
                          Attendance: {presentPercent}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-yellow-50 dark:bg-yellow-900 border-2 border-yellow-200 dark:border-yellow-700 rounded-2xl p-8 text-center">
                <p className="text-yellow-700 dark:text-yellow-300 font-medium">No attendance data found for the selected date.</p>
              </div>
            )}
          </>
        )}

        {/* Info Message */}
        {!showReport && !isLoading && (
          <div className="bg-blue-50 dark:bg-blue-900 border-2 border-blue-200 dark:border-blue-700 rounded-2xl p-8 text-center">
            <PieChart className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Select Date to View Report</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Please select a date from the options above, then click "Generate Report" to view class-wise attendance charts.
            </p>
          </div>
        )}
      </div>

      <style jsx>{`@media print { .no-print { display: none !important; } body { background: white !important; } }`}</style>
    </div>
  );
};

export default ClassWiseReport;