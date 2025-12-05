import { useState, useEffect } from 'react';
import { 
  BookOpen, TrendingUp, Award, Target, Download, Printer, 
  Star, BarChart3, PieChart, Calendar, User, Trophy,
  ChevronDown, Filter, Eye
} from 'lucide-react';

const ReportCard = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedTerm, setSelectedTerm] = useState('term1');
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    setLoading(false);
  }, []);

  // Mock report card data
  const reportData = {
    term1: {
      term: 'Term 1',
      period: 'April 2024 - September 2024',
      subjects: [
        { name: 'Mathematics', marks: 95, totalMarks: 100, grade: 'A+', remarks: 'Excellent performance in all areas' },
        { name: 'Physics', marks: 88, totalMarks: 100, grade: 'A', remarks: 'Good understanding of concepts' },
        { name: 'Chemistry', marks: 92, totalMarks: 100, grade: 'A+', remarks: 'Outstanding practical work' },
        { name: 'Biology', marks: 85, totalMarks: 100, grade: 'A', remarks: 'Good analytical skills' },
        { name: 'English', marks: 90, totalMarks: 100, grade: 'A+', remarks: 'Excellent communication skills' },
        { name: 'Hindi', marks: 82, totalMarks: 100, grade: 'A', remarks: 'Good progress in literature' },
        { name: 'Computer Science', marks: 96, totalMarks: 100, grade: 'A+', remarks: 'Exceptional programming skills' },
        { name: 'Physical Education', marks: 94, totalMarks: 100, grade: 'A+', remarks: 'Active participation' }
      ],
      attendance: 95,
      rank: 3,
      totalStudents: 45,
      cgpa: 9.2,
      teacherRemarks: 'Excellent student with consistent performance across all subjects. Shows great potential in STEM subjects.',
      principalRemarks: 'Keep up the excellent work. Continue to maintain this level of dedication.'
    },
    term2: {
      term: 'Term 2',
      period: 'October 2024 - March 2025',
      subjects: [
        { name: 'Mathematics', marks: 92, totalMarks: 100, grade: 'A+', remarks: 'Consistent excellent performance' },
        { name: 'Physics', marks: 90, totalMarks: 100, grade: 'A+', remarks: 'Improved understanding of complex topics' },
        { name: 'Chemistry', marks: 89, totalMarks: 100, grade: 'A', remarks: 'Good practical and theoretical knowledge' },
        { name: 'Biology', marks: 87, totalMarks: 100, grade: 'A', remarks: 'Strong grasp of biological concepts' },
        { name: 'English', marks: 93, totalMarks: 100, grade: 'A+', remarks: 'Excellent writing and speaking skills' },
        { name: 'Hindi', marks: 85, totalMarks: 100, grade: 'A', remarks: 'Improved performance in literature' },
        { name: 'Computer Science', marks: 98, totalMarks: 100, grade: 'A+', remarks: 'Outstanding programming projects' },
        { name: 'Physical Education', marks: 96, totalMarks: 100, grade: 'A+', remarks: 'Excellent sportsmanship' }
      ],
      attendance: 97,
      rank: 2,
      totalStudents: 45,
      cgpa: 9.4,
      teacherRemarks: 'Remarkable improvement in all subjects. Excellent leadership qualities and peer collaboration.',
      principalRemarks: 'Outstanding academic performance. A role model for other students.'
    }
  };

  const currentReport = reportData[selectedTerm];
  const totalMarks = currentReport.subjects.reduce((sum, subject) => sum + subject.marks, 0);
  const maxMarks = currentReport.subjects.reduce((sum, subject) => sum + subject.totalMarks, 0);
  const percentage = ((totalMarks / maxMarks) * 100).toFixed(2);

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A+': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'A': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
      case 'B+': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'B': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob(['Report Card Content'], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `report-card-${selectedTerm}-${user.name || 'student'}.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-blue-600" />
            My Report Card
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Academic performance and progress report
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            className="input-field"
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
          >
            <option value="term1">Term 1 (Apr-Sep 2024)</option>
            <option value="term2">Term 2 (Oct-Mar 2025)</option>
          </select>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="btn-secondary flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            {showDetails ? 'Hide' : 'Show'} Details
          </button>
          <button
            onClick={() => window.print()}
            className="btn-secondary flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button
            onClick={handleDownload}
            className="btn-primary flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Overall %</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{percentage}%</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">CGPA</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{currentReport.cgpa}</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-2 border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Class Rank</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">#{currentReport.rank}</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-2 border-orange-200 dark:border-orange-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Attendance</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{currentReport.attendance}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Subject-wise Performance */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Subject-wise Performance - {currentReport.term}
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {currentReport.period}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-800 dark:text-gray-100">Subject</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-800 dark:text-gray-100">Marks</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-800 dark:text-gray-100">Grade</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-800 dark:text-gray-100">%</th>
                {showDetails && (
                  <th className="text-left py-3 px-4 font-semibold text-gray-800 dark:text-gray-100">Remarks</th>
                )}
              </tr>
            </thead>
            <tbody>
              {currentReport.subjects.map((subject, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-medium text-gray-800 dark:text-gray-100">{subject.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="font-semibold text-gray-800 dark:text-gray-100">
                      {subject.marks}/{subject.totalMarks}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getGradeColor(subject.grade)}`}>
                      {subject.grade}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="font-semibold text-gray-800 dark:text-gray-100">
                      {((subject.marks / subject.totalMarks) * 100).toFixed(1)}%
                    </span>
                  </td>
                  {showDetails && (
                    <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                      {subject.remarks}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 dark:bg-gray-700/50 font-semibold">
                <td className="py-4 px-4 text-gray-800 dark:text-gray-100">Total</td>
                <td className="py-4 px-4 text-center text-gray-800 dark:text-gray-100">
                  {totalMarks}/{maxMarks}
                </td>
                <td className="py-4 px-4 text-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getGradeColor('A+')}`}>
                    A+
                  </span>
                </td>
                <td className="py-4 px-4 text-center text-gray-800 dark:text-gray-100">
                  {percentage}%
                </td>
                {showDetails && <td className="py-4 px-4"></td>}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Performance Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade Distribution */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-blue-600" />
            Grade Distribution
          </h3>
          <div className="space-y-3">
            {['A+', 'A', 'B+', 'B'].map(grade => {
              const count = currentReport.subjects.filter(s => s.grade === grade).length;
              const percentage = ((count / currentReport.subjects.length) * 100).toFixed(1);
              return (
                <div key={grade} className="flex items-center gap-3">
                  <span className={`inline-block px-2 py-1 rounded text-sm font-semibold ${getGradeColor(grade)}`}>
                    {grade}
                  </span>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getGradeColor(grade).split(' ')[1]}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {count} ({percentage}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Performance Trends */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-600" />
            Top Performing Subjects
          </h3>
          <div className="space-y-3">
            {currentReport.subjects
              .sort((a, b) => b.marks - a.marks)
              .slice(0, 5)
              .map((subject, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 dark:text-gray-100">{subject.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{subject.marks}/{subject.totalMarks}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-sm font-semibold ${getGradeColor(subject.grade)}`}>
                    {subject.grade}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Teacher and Principal Remarks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Class Teacher's Remarks
          </h3>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
            <p className="text-gray-700 dark:text-gray-300 italic">
              "{currentReport.teacherRemarks}"
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-2 font-medium">
              - Class Teacher
            </p>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-600" />
            Principal's Remarks
          </h3>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-500">
            <p className="text-gray-700 dark:text-gray-300 italic">
              "{currentReport.principalRemarks}"
            </p>
            <p className="text-sm text-purple-600 dark:text-purple-400 mt-2 font-medium">
              - Principal
            </p>
          </div>
        </div>
      </div>

      {/* Student Information */}
      <div className="card print:block">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Student Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Name</p>
            <p className="font-semibold text-gray-800 dark:text-gray-100">{user.name || 'Student Name'}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Class</p>
            <p className="font-semibold text-gray-800 dark:text-gray-100">{user.class || '10-A'}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Roll Number</p>
            <p className="font-semibold text-gray-800 dark:text-gray-100">{user.rollNumber || '15'}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Academic Year</p>
            <p className="font-semibold text-gray-800 dark:text-gray-100">2024-2025</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
