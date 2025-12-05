import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Filter, 
  Search, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Award, 
  Calendar,
  BookOpen,
  Target,
  CheckCircle2,
  AlertTriangle,
  Star,
  Trophy,
  Eye,
  Printer
} from 'lucide-react';

const ResultSheet = () => {
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [sortBy, setSortBy] = useState('rank');
  const [filterGrade, setFilterGrade] = useState('');
  const [showAnalytics, setShowAnalytics] = useState(false);

  const handleExportExcel = () => {
    const filteredStudents = getFilteredStudents();
    
    // Create CSV content
    const headers = ['Roll No', 'Student Name', 'Mathematics', 'English', 'Science', 'History', 'Geography', 'Total', 'Percentage', 'Grade', 'Rank', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredStudents.map(student => [
        student.rollNo,
        `"${student.name}"`,
        student.subjects.mathematics,
        student.subjects.english,
        student.subjects.science,
        student.subjects.history,
        student.subjects.geography,
        student.total,
        student.percentage.toFixed(2),
        student.grade,
        student.rank,
        student.status
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `result-sheet-${selectedExam}-${selectedClass}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exams = [
    { id: 'mid-term', name: 'Mid-term Examination', date: '2024-11-15' },
    { id: 'final', name: 'Final Examination', date: '2024-12-20' },
    { id: 'unit-test-1', name: 'Unit Test 1', date: '2024-10-10' }
  ];

  const classes = [
    { id: '10-A', name: 'Class 10-A', students: 35 },
    { id: '10-B', name: 'Class 10-B', students: 32 },
    { id: '9-A', name: 'Class 9-A', students: 30 }
  ];

  const students = [
    { 
      id: 1, 
      name: 'Arun Kumar', 
      rollNo: '001', 
      class: '10-A',
      subjects: {
        mathematics: 92,
        english: 85,
        science: 88,
        'social-studies': 90,
        hindi: 87
      },
      total: 442, 
      maxTotal: 500,
      percentage: 88.4, 
      grade: 'A+',
      rank: 1,
      status: 'Pass'
    },
    { 
      id: 2, 
      name: 'Priya Sharma', 
      rollNo: '002', 
      class: '10-A',
      subjects: {
        mathematics: 88,
        english: 92,
        science: 85,
        'social-studies': 89,
        hindi: 91
      },
      total: 445, 
      maxTotal: 500,
      percentage: 89.0, 
      grade: 'A+',
      rank: 2,
      status: 'Pass'
    },
    { 
      id: 3, 
      name: 'Rahul Singh', 
      rollNo: '003', 
      class: '10-A',
      subjects: {
        mathematics: 78,
        english: 82,
        science: 80,
        'social-studies': 85,
        hindi: 79
      },
      total: 404, 
      maxTotal: 500,
      percentage: 80.8, 
      grade: 'A',
      rank: 3,
      status: 'Pass'
    },
    { 
      id: 4, 
      name: 'Sneha Patel', 
      rollNo: '004', 
      class: '10-A',
      subjects: {
        mathematics: 65,
        english: 70,
        science: 68,
        'social-studies': 72,
        hindi: 69
      },
      total: 344, 
      maxTotal: 500,
      percentage: 68.8, 
      grade: 'B+',
      rank: 4,
      status: 'Pass'
    },
    { 
      id: 5, 
      name: 'Vikram Gupta', 
      rollNo: '005', 
      class: '10-A',
      subjects: {
        mathematics: 45,
        english: 52,
        science: 48,
        'social-studies': 55,
        hindi: 50
      },
      total: 250, 
      maxTotal: 500,
      percentage: 50.0, 
      grade: 'C',
      rank: 5,
      status: 'Pass'
    },
    { 
      id: 6, 
      name: 'Anita Verma', 
      rollNo: '006', 
      class: '10-A',
      subjects: {
        mathematics: 35,
        english: 42,
        science: 38,
        'social-studies': 45,
        hindi: 40
      },
      total: 200, 
      maxTotal: 500,
      percentage: 40.0, 
      grade: 'D',
      rank: 6,
      status: 'Fail'
    }
  ];

  const getFilteredStudents = () => {
    return students.filter(student => {
      if (selectedClass && student.class !== selectedClass) return false;
      if (filterGrade && student.grade !== filterGrade) return false;
      return true;
    });
  };

  const filteredStudents = getFilteredStudents();

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    switch(sortBy) {
      case 'rank': return a.rank - b.rank;
      case 'name': return a.name.localeCompare(b.name);
      case 'percentage': return b.percentage - a.percentage;
      default: return a.rank - b.rank;
    }
  });

  const getGradeColor = (grade) => {
    switch(grade) {
      case 'A+': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'A': return 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-300';
      case 'B+': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      case 'B': return 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300';
      case 'C': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
      case 'D': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400';
      default: return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
    }
  };

  const getStatusColor = (status) => {
    return status === 'Pass' 
      ? 'text-green-600 dark:text-green-400' 
      : 'text-red-600 dark:text-red-400';
  };

  const calculateClassStats = () => {
    const totalStudents = filteredStudents.length;
    const passedStudents = filteredStudents.filter(s => s.status === 'Pass').length;
    const averagePercentage = (filteredStudents.reduce((sum, s) => sum + s.percentage, 0) / totalStudents).toFixed(1);
    const highestScore = Math.max(...filteredStudents.map(s => s.percentage));
    
    return { totalStudents, passedStudents, averagePercentage, highestScore };
  };

  const stats = calculateClassStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-800 dark:to-cyan-800 rounded-2xl shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative px-8 py-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <FileSpreadsheet className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Comprehensive Result Sheet</h1>
                <p className="text-teal-100 text-lg">Detailed academic performance analysis and reporting</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-teal-100">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                <span>Analytics Dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span>Performance Tracking</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                  <Filter className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Result Controls</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Filter and export result data</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAnalytics(!showAnalytics)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  {showAnalytics ? 'Hide' : 'Show'} Analytics
                </button>
                <button 
                  onClick={handleExportExcel}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export Excel
                </button>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-teal-500 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 dark:focus:ring-teal-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
              >
                <option value="">Select Exam</option>
                {exams.map(exam => (
                  <option key={exam.id} value={exam.id}>{exam.name}</option>
                ))}
              </select>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-teal-500 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 dark:focus:ring-teal-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
              >
                <option value="">All Classes</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-teal-500 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 dark:focus:ring-teal-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
              >
                <option value="rank">Sort by Rank</option>
                <option value="name">Sort by Name</option>
                <option value="percentage">Sort by Percentage</option>
              </select>
              <select
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-teal-500 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 dark:focus:ring-teal-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
              >
                <option value="">All Grades</option>
                <option value="A+">A+ Grade</option>
                <option value="A">A Grade</option>
                <option value="B+">B+ Grade</option>
                <option value="B">B Grade</option>
                <option value="C">C Grade</option>
                <option value="D">D Grade</option>
              </select>
            </div>
          </div>
        </div>

        {/* Analytics Panel */}
        {showAnalytics && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                Class Performance Analytics
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalStudents}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Students</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.passedStudents}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Passed</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.averagePercentage}%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Class Average</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.highestScore}%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Highest Score</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Result Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              Student Results ({sortedStudents.length} students)
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Rank</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Roll No</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Student Name</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Math</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">English</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Science</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Social</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Hindi</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Total</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">%</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Grade</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {sortedStudents.map(student => (
                  <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {student.rank <= 3 && <Trophy className="w-4 h-4 text-yellow-500" />}
                        <span className="font-semibold text-gray-900 dark:text-gray-100">#{student.rank}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm font-medium text-gray-900 dark:text-gray-100">{student.rollNo}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {student.name.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-800 dark:text-gray-100">{student.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center text-sm text-gray-700 dark:text-gray-300">{student.subjects.mathematics}</td>
                    <td className="py-4 px-6 text-center text-sm text-gray-700 dark:text-gray-300">{student.subjects.english}</td>
                    <td className="py-4 px-6 text-center text-sm text-gray-700 dark:text-gray-300">{student.subjects.science}</td>
                    <td className="py-4 px-6 text-center text-sm text-gray-700 dark:text-gray-300">{student.subjects['social-studies']}</td>
                    <td className="py-4 px-6 text-center text-sm text-gray-700 dark:text-gray-300">{student.subjects.hindi}</td>
                    <td className="py-4 px-6 text-center text-sm font-semibold text-gray-800 dark:text-gray-100">{student.total}/{student.maxTotal}</td>
                    <td className="py-4 px-6 text-center text-sm font-bold text-teal-600 dark:text-teal-400">{student.percentage}%</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getGradeColor(student.grade)}`}>
                        {student.grade}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`text-sm font-semibold ${getStatusColor(student.status)}`}>
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultSheet;
