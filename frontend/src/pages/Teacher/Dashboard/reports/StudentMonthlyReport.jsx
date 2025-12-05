import { useState, useEffect } from 'react';
import { 
  FileText, Download, Calendar, TrendingUp, BarChart3, PieChart, 
  Clock, CheckCircle, XCircle, AlertCircle, User, BookOpen, 
  Award, Target, Activity, Filter, Search, Eye, Printer, Save, RotateCcw
} from 'lucide-react';

const StudentMonthlyReport = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('2024-01');
  const [selectedClass, setSelectedClass] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [savedRemarks, setSavedRemarks] = useState({});

  // Mock student data with monthly details
  const students = [
    {
      id: 1,
      name: 'John Doe',
      rollNo: '001',
      class: '10-A',
      admissionNo: 'ADM2023001',
      monthlyData: {
        attendance: {
          totalDays: 22,
          present: 20,
          absent: 2,
          late: 1,
          percentage: 90.9,
          dailyRecord: [
            { date: '2024-01-01', status: 'present' },
            { date: '2024-01-02', status: 'present' },
            { date: '2024-01-03', status: 'absent' },
            { date: '2024-01-04', status: 'present' },
            { date: '2024-01-05', status: 'late' },
            // ... more daily records
          ]
        },
        academics: {
          tests: { completed: 4, total: 5, average: 85 },
          homework: { submitted: 18, total: 20, percentage: 90 },
          projects: { completed: 2, total: 2, average: 92 },
          classParticipation: 4.2
        },
        behavior: {
          discipline: 4.5,
          punctuality: 4.0,
          cooperation: 4.8,
          leadership: 4.2
        },
        extracurricular: [
          { activity: 'Basketball Practice', sessions: 8, performance: 'Excellent' },
          { activity: 'Science Club', sessions: 4, performance: 'Good' }
        ],
        achievements: [
          'Student of the Week (Week 2)',
          'Best Performance in Mathematics Test'
        ]
      }
    },
    {
      id: 2,
      name: 'Jane Smith',
      rollNo: '002',
      class: '10-A',
      admissionNo: 'ADM2023002',
      monthlyData: {
        attendance: {
          totalDays: 22,
          present: 21,
          absent: 1,
          late: 0,
          percentage: 95.5,
          dailyRecord: [
            { date: '2024-01-01', status: 'present' },
            { date: '2024-01-02', status: 'present' },
            { date: '2024-01-03', status: 'present' },
            { date: '2024-01-04', status: 'absent' },
            { date: '2024-01-05', status: 'present' },
            // ... more daily records
          ]
        },
        academics: {
          tests: { completed: 5, total: 5, average: 92 },
          homework: { submitted: 20, total: 20, percentage: 100 },
          projects: { completed: 2, total: 2, average: 95 },
          classParticipation: 4.8
        },
        behavior: {
          discipline: 5.0,
          punctuality: 4.8,
          cooperation: 4.9,
          leadership: 4.7
        },
        extracurricular: [
          { activity: 'Student Council', sessions: 6, performance: 'Outstanding' },
          { activity: 'Math Olympiad', sessions: 8, performance: 'Excellent' }
        ],
        achievements: [
          'Class Monitor',
          'Perfect Attendance Award',
          'Top Scorer in Science'
        ]
      }
    }
  ];

  const filteredStudents = students.filter(student => {
    const matchesSearch = searchTerm === '' || 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.includes(searchTerm) ||
      student.admissionNo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = selectedClass === '' || student.class === selectedClass;
    
    return matchesSearch && matchesClass;
  });

  const getAttendanceColor = (percentage) => {
    if (percentage >= 95) return 'text-green-600 dark:text-green-400';
    if (percentage >= 85) return 'text-blue-600 dark:text-blue-400';
    if (percentage >= 75) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getPerformanceColor = (score) => {
    if (score >= 4.5) return 'text-green-600 dark:text-green-400';
    if (score >= 4.0) return 'text-blue-600 dark:text-blue-400';
    if (score >= 3.5) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDownloadReport = async (student) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const monthName = new Date(selectedMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      const reportContent = `
MONTHLY REPORT - ${monthName.toUpperCase()}
${'='.repeat(50)}

Student: ${student.name}
Roll Number: ${student.rollNo}
Class: ${student.class}
Admission Number: ${student.admissionNo}

ATTENDANCE SUMMARY:
- Total Days: ${student.monthlyData.attendance.totalDays}
- Present: ${student.monthlyData.attendance.present} days
- Absent: ${student.monthlyData.attendance.absent} days
- Late: ${student.monthlyData.attendance.late} days
- Percentage: ${student.monthlyData.attendance.percentage}%

ACADEMIC PERFORMANCE:
- Tests Completed: ${student.monthlyData.academics.tests.completed}/${student.monthlyData.academics.tests.total}
- Test Average: ${student.monthlyData.academics.tests.average}%
- Homework Submitted: ${student.monthlyData.academics.homework.submitted}/${student.monthlyData.academics.homework.total} (${student.monthlyData.academics.homework.percentage}%)
- Projects Completed: ${student.monthlyData.academics.projects.completed}/${student.monthlyData.academics.projects.total}
- Class Participation: ${student.monthlyData.academics.classParticipation}/5

BEHAVIOR ASSESSMENT:
- Discipline: ${student.monthlyData.behavior.discipline}/5
- Punctuality: ${student.monthlyData.behavior.punctuality}/5
- Cooperation: ${student.monthlyData.behavior.cooperation}/5
- Leadership: ${student.monthlyData.behavior.leadership}/5

EXTRACURRICULAR ACTIVITIES:
${student.monthlyData.extracurricular.map(activity => 
  `- ${activity.activity}: ${activity.sessions} sessions (${activity.performance})`
).join('\n')}

MONTHLY ACHIEVEMENTS:
${student.monthlyData.achievements.map(achievement => `- ${achievement}`).join('\n')}

TEACHER'S REMARKS:
${savedRemarks[student.id] || 'No remarks added yet.'}
      `;
      
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${student.name}_Monthly_Report_${selectedMonth}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showNotification(`Monthly report for ${student.name} downloaded successfully!`);
    } catch (error) {
      showNotification('Failed to download monthly report', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrintReport = (student) => {
    const monthName = new Date(selectedMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const printContent = `
      <html>
        <head>
          <title>Monthly Report - ${student.name} - ${monthName}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .student-info { background: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px; }
            .section { margin: 25px 0; }
            .section h3 { color: #333; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
            .metrics { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 15px 0; }
            .metric-card { border: 1px solid #ddd; padding: 10px; border-radius: 5px; text-align: center; }
            .calendar { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; margin: 10px 0; }
            .calendar-day { padding: 5px; text-align: center; border: 1px solid #eee; font-size: 12px; }
            .present { background-color: #d4edda; }
            .absent { background-color: #f8d7da; }
            .late { background-color: #fff3cd; }
            .behavior-item { display: flex; justify-content: space-between; margin: 5px 0; }
            @media print { body { margin: 0; } .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>STUDENT MONTHLY REPORT</h1>
            <h2>${monthName}</h2>
          </div>
          
          <div class="student-info">
            <h2>${student.name}</h2>
            <p><strong>Roll Number:</strong> ${student.rollNo} | <strong>Class:</strong> ${student.class}</p>
            <p><strong>Admission Number:</strong> ${student.admissionNo}</p>
          </div>
          
          <div class="section">
            <h3>Key Performance Metrics</h3>
            <div class="metrics">
              <div class="metric-card">
                <h4>Attendance</h4>
                <p style="font-size: 24px; color: #007bff;">${student.monthlyData.attendance.percentage}%</p>
                <p>${student.monthlyData.attendance.present}/${student.monthlyData.attendance.totalDays} days</p>
              </div>
              <div class="metric-card">
                <h4>Test Average</h4>
                <p style="font-size: 24px; color: #28a745;">${student.monthlyData.academics.tests.average}%</p>
                <p>${student.monthlyData.academics.tests.completed}/${student.monthlyData.academics.tests.total} completed</p>
              </div>
              <div class="metric-card">
                <h4>Homework</h4>
                <p style="font-size: 24px; color: #17a2b8;">${student.monthlyData.academics.homework.percentage}%</p>
                <p>${student.monthlyData.academics.homework.submitted}/${student.monthlyData.academics.homework.total} submitted</p>
              </div>
              <div class="metric-card">
                <h4>Participation</h4>
                <p style="font-size: 24px; color: #fd7e14;">${student.monthlyData.academics.classParticipation}/5</p>
                <p>Class participation rating</p>
              </div>
            </div>
          </div>
          
          <div class="section">
            <h3>Attendance Summary</h3>
            <p><strong>Present:</strong> ${student.monthlyData.attendance.present} days | 
               <strong>Absent:</strong> ${student.monthlyData.attendance.absent} days | 
               <strong>Late:</strong> ${student.monthlyData.attendance.late} days</p>
          </div>
          
          <div class="section">
            <h3>Behavior Assessment</h3>
            ${Object.entries(student.monthlyData.behavior).map(([key, value]) => `
              <div class="behavior-item">
                <span>${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:</span>
                <strong>${value}/5</strong>
              </div>
            `).join('')}
          </div>
          
          <div class="section">
            <h3>Extracurricular Activities</h3>
            <ul>
              ${student.monthlyData.extracurricular.map(activity => `
                <li><strong>${activity.activity}:</strong> ${activity.sessions} sessions - ${activity.performance}</li>
              `).join('')}
            </ul>
          </div>
          
          <div class="section">
            <h3>Monthly Achievements</h3>
            <ul>
              ${student.monthlyData.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
            </ul>
          </div>
          
          <div class="section">
            <h3>Teacher's Remarks</h3>
            <p style="background: #f8f9fa; padding: 15px; border-left: 4px solid #007bff;">
              ${savedRemarks[student.id] || 'No remarks added yet.'}
            </p>
          </div>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
    
    showNotification(`Monthly report for ${student.name} sent to printer!`);
  };

  const handleExportAll = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const monthName = new Date(selectedMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      const allReportsContent = filteredStudents.map(student => `
=== MONTHLY REPORT: ${student.name} ===
Month: ${monthName}
Roll: ${student.rollNo} | Class: ${student.class}
Attendance: ${student.monthlyData.attendance.percentage}%
Test Average: ${student.monthlyData.academics.tests.average}%
Homework: ${student.monthlyData.academics.homework.percentage}%
${'='.repeat(60)}
      `).join('\n');
      
      const blob = new Blob([allReportsContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Monthly_Reports_${selectedMonth}_${selectedClass || 'All_Classes'}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showNotification(`All monthly reports exported successfully! (${filteredStudents.length} students)`);
    } catch (error) {
      showNotification('Failed to export monthly reports', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRemarks = () => {
    if (!selectedStudent || !remarks.trim()) {
      showNotification('Please enter remarks before saving', 'error');
      return;
    }
    
    setSavedRemarks(prev => ({
      ...prev,
      [selectedStudent.id]: remarks
    }));
    
    showNotification(`Remarks saved for ${selectedStudent.name}`);
  };

  const handleClearRemarks = () => {
    setRemarks('');
    showNotification('Remarks cleared');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedClass('');
    showNotification('Filters cleared successfully!');
  };

  // Load saved remarks when student is selected
  useEffect(() => {
    if (selectedStudent) {
      setRemarks(savedRemarks[selectedStudent.id] || `${selectedStudent.name} has shown excellent progress this month. Strong attendance record and consistent academic performance. Actively participates in class discussions and extracurricular activities.`);
    }
  }, [selectedStudent, savedRemarks]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Student Monthly Report</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">View monthly performance reports</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button 
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleExportAll}
            disabled={isLoading || filteredStudents.length === 0}
          >
            <Download className="w-5 h-5" />
            {isLoading ? 'Exporting...' : `Export All (${filteredStudents.length})`}
          </button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search students..." 
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="input-field"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">All Classes</option>
            <option value="10-A">Class 10-A</option>
            <option value="10-B">Class 10-B</option>
            <option value="9-A">Class 9-A</option>
          </select>
          <select 
            className="input-field"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="2024-01">January 2024</option>
            <option value="2023-12">December 2023</option>
            <option value="2023-11">November 2023</option>
            <option value="2023-10">October 2023</option>
          </select>
          <button className="btn-secondary flex items-center justify-center gap-2">
            <BarChart3 className="w-4 h-4" />
            View Analytics
          </button>
        </div>
        
        {/* Filter Actions */}
        {(searchTerm || selectedClass) && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredStudents.length} of {students.length} students
            </span>
            <button 
              onClick={clearFilters}
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg animate-slideIn ${
          notification.type === 'success' 
            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800' 
            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
        }`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Student List or Detailed Report */}
      {!selectedStudent ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map(student => (
            <div key={student.id} className="card hover:shadow-lg transition-all cursor-pointer group" onClick={() => setSelectedStudent(student)}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {student.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {student.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Roll: {student.rollNo} | Class: {student.class}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Admission: {student.admissionNo}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Attendance</p>
                  <p className={`text-lg font-bold ${getAttendanceColor(student.monthlyData.attendance.percentage)}`}>
                    {student.monthlyData.attendance.percentage}%
                  </p>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Test Average</p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">{student.monthlyData.academics.tests.average}%</p>
                </div>
              </div>
              
              <button className="w-full btn-primary flex items-center justify-center gap-2">
                <Eye className="w-4 h-4" />
                View Monthly Report
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* Detailed Monthly Report View */
        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => setSelectedStudent(null)}
              className="btn-secondary"
            >
              ← Back to List
            </button>
            <div className="flex gap-3">
              <button 
                className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handlePrintReport(selectedStudent)}
                disabled={isLoading}
              >
                <Printer className="w-4 h-4" />
                Print Report
              </button>
              <button 
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handleDownloadReport(selectedStudent)}
                disabled={isLoading}
              >
                <Download className="w-4 h-4" />
                {isLoading ? 'Generating...' : 'Download PDF'}
              </button>
            </div>
          </div>

          {/* Report Header */}
          <div className="card bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-2 border-primary-200 dark:border-primary-800">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {selectedStudent.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{selectedStudent.name}</h2>
                <p className="text-gray-600 dark:text-gray-400">Monthly Report - {new Date(selectedMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">Roll: {selectedStudent.rollNo} | Class: {selectedStudent.class}</p>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Attendance</p>
                  <p className={`text-2xl font-bold ${getAttendanceColor(selectedStudent.monthlyData.attendance.percentage)}`}>
                    {selectedStudent.monthlyData.attendance.percentage}%
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {selectedStudent.monthlyData.attendance.present}/{selectedStudent.monthlyData.attendance.totalDays} days present
              </p>
            </div>

            <div className="card bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3 mb-3">
                <BookOpen className="w-8 h-8 text-green-600 dark:text-green-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Homework</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {selectedStudent.monthlyData.academics.homework.percentage}%
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {selectedStudent.monthlyData.academics.homework.submitted}/{selectedStudent.monthlyData.academics.homework.total} submitted
              </p>
            </div>

            <div className="card bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-3 mb-3">
                <Target className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Test Average</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {selectedStudent.monthlyData.academics.tests.average}%
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {selectedStudent.monthlyData.academics.tests.completed}/{selectedStudent.monthlyData.academics.tests.total} tests completed
              </p>
            </div>

            <div className="card bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-3 mb-3">
                <Activity className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Participation</p>
                  <p className={`text-2xl font-bold ${getPerformanceColor(selectedStudent.monthlyData.academics.classParticipation)}`}>
                    {selectedStudent.monthlyData.academics.classParticipation}/5
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500">Class participation rating</p>
            </div>
          </div>

          {/* Detailed Attendance Chart */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              Daily Attendance Record
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {/* Attendance Calendar View */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Monthly Calendar</h4>
                  <div className="grid grid-cols-7 gap-2 text-center">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-xs font-semibold text-gray-600 dark:text-gray-400 p-2">
                        {day}
                      </div>
                    ))}
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                      const status = day <= 22 ? (day === 3 ? 'absent' : day === 5 ? 'late' : 'present') : 'future';
                      return (
                        <div key={day} className={`p-2 text-xs rounded ${
                          status === 'present' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                          status === 'absent' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' :
                          status === 'late' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                          'bg-gray-100 dark:bg-gray-600 text-gray-400 dark:text-gray-500'
                        }`}>
                          {day}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Attendance Summary</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Present</span>
                      </div>
                      <span className="font-semibold text-gray-800 dark:text-gray-100">
                        {selectedStudent.monthlyData.attendance.present} days
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Absent</span>
                      </div>
                      <span className="font-semibold text-gray-800 dark:text-gray-100">
                        {selectedStudent.monthlyData.attendance.absent} days
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Late</span>
                      </div>
                      <span className="font-semibold text-gray-800 dark:text-gray-100">
                        {selectedStudent.monthlyData.attendance.late} days
                      </span>
                    </div>
                  </div>
                </div>

                {/* Attendance Trend Chart Placeholder */}
                <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Weekly Trend</h4>
                  <div className="space-y-2">
                    {['Week 1', 'Week 2', 'Week 3', 'Week 4'].map((week, index) => (
                      <div key={week} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{week}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full" 
                              style={{ width: `${90 + index * 2}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-semibold text-gray-800 dark:text-gray-100">
                            {90 + index * 2}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Performance */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Academic Performance
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Test Performance</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Tests Completed</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-100">
                        {selectedStudent.monthlyData.academics.tests.completed}/{selectedStudent.monthlyData.academics.tests.total}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Average Score</span>
                      <span className="font-semibold text-primary-600 dark:text-primary-400">
                        {selectedStudent.monthlyData.academics.tests.average}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Project Work</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Projects Completed</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-100">
                        {selectedStudent.monthlyData.academics.projects.completed}/{selectedStudent.monthlyData.academics.projects.total}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Average Score</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {selectedStudent.monthlyData.academics.projects.average}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Behavior Assessment</h4>
                <div className="space-y-4">
                  {Object.entries(selectedStudent.monthlyData.behavior).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className={`font-semibold ${getPerformanceColor(value)}`}>
                          {value}/5
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full" 
                          style={{ width: `${(value / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Extracurricular Activities & Achievements */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Extracurricular Activities
              </h3>
              <div className="space-y-3">
                {selectedStudent.monthlyData.extracurricular.map((activity, index) => (
                  <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-100">{activity.activity}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        activity.performance === 'Outstanding' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                        activity.performance === 'Excellent' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
                        'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                      }`}>
                        {activity.performance}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {activity.sessions} sessions attended
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5" />
                Monthly Achievements
              </h3>
              <div className="space-y-2">
                {selectedStudent.monthlyData.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <Award className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-gray-800 dark:text-gray-100">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Teacher's Monthly Remarks */}
          <div className="card">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Teacher's Monthly Remarks
            </h3>
            <textarea
              className="input-field"
              rows="4"
              placeholder="Enter monthly remarks for the student..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            ></textarea>
            <div className="flex gap-3 mt-4">
              <button 
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSaveRemarks}
                disabled={!remarks.trim()}
              >
                <Save className="w-4 h-4" />
                Save Remarks
              </button>
              <button 
                className="btn-secondary flex items-center gap-2"
                onClick={handleClearRemarks}
              >
                <RotateCcw className="w-4 h-4" />
                Clear
              </button>
            </div>
            
            {/* Saved Remarks Indicator */}
            {savedRemarks[selectedStudent.id] && (
              <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-2 text-green-800 dark:text-green-300">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Remarks saved successfully!</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentMonthlyReport;
