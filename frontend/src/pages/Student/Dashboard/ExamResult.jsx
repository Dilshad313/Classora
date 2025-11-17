import { useState, useEffect } from 'react';
import { 
  Trophy, TrendingUp, Calendar, Download, Printer, 
  Star, BarChart3, Target, Award, Eye, Filter
} from 'lucide-react';

const ExamResult = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState('midterm2024');
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    setLoading(false);
  }, []);

  // Mock exam results data
  const examResults = {
    midterm2024: {
      examName: 'Mid-term Examination 2024',
      examType: 'Mid-term',
      period: 'October 2024',
      totalMarks: 800,
      obtainedMarks: 742,
      percentage: 92.75,
      grade: 'A+',
      rank: 2,
      totalStudents: 45,
      cgpa: 9.4,
      subjects: [
        { name: 'Mathematics', marks: 95, totalMarks: 100, grade: 'A+', rank: 1 },
        { name: 'Physics', marks: 88, totalMarks: 100, grade: 'A', rank: 3 },
        { name: 'Chemistry', marks: 92, totalMarks: 100, grade: 'A+', rank: 2 },
        { name: 'Biology', marks: 89, totalMarks: 100, grade: 'A', rank: 4 },
        { name: 'English', marks: 94, totalMarks: 100, grade: 'A+', rank: 1 },
        { name: 'Hindi', marks: 86, totalMarks: 100, grade: 'A', rank: 5 },
        { name: 'Computer Science', marks: 98, totalMarks: 100, grade: 'A+', rank: 1 },
        { name: 'Social Studies', marks: 90, totalMarks: 100, grade: 'A+', rank: 2 }
      ]
    },
    annual2024: {
      examName: 'Annual Examination 2024',
      examType: 'Annual',
      period: 'March 2024',
      totalMarks: 800,
      obtainedMarks: 720,
      percentage: 90.0,
      grade: 'A+',
      rank: 3,
      totalStudents: 45,
      cgpa: 9.1,
      subjects: [
        { name: 'Mathematics', marks: 92, totalMarks: 100, grade: 'A+', rank: 2 },
        { name: 'Physics', marks: 85, totalMarks: 100, grade: 'A', rank: 4 },
        { name: 'Chemistry', marks: 90, totalMarks: 100, grade: 'A+', rank: 3 },
        { name: 'Biology', marks: 87, totalMarks: 100, grade: 'A', rank: 5 },
        { name: 'English', marks: 91, totalMarks: 100, grade: 'A+', rank: 2 },
        { name: 'Hindi', marks: 83, totalMarks: 100, grade: 'A', rank: 6 },
        { name: 'Computer Science', marks: 95, totalMarks: 100, grade: 'A+', rank: 1 },
        { name: 'Social Studies', marks: 87, totalMarks: 100, grade: 'A', rank: 4 }
      ]
    }
  };

  const currentExam = examResults[selectedExam];
  
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
    const file = new Blob(['Exam Result Content'], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `exam-result-${selectedExam}-${user.name || 'student'}.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
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
            <Trophy className="w-7 h-7 text-yellow-600" />
            Exam Results
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View your examination results and performance analysis
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            className="input-field"
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
          >
            <option value="midterm2024">Mid-term 2024</option>
            <option value="annual2024">Annual 2024</option>
          </select>
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="btn-secondary flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            Compare
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

      {/* Result Summary */}
      <div className="card bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-200 dark:border-yellow-800">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
              {currentExam.examName}
            </h2>
            <p className="text-yellow-600 dark:text-yellow-400 text-lg">
              Rank #{currentExam.rank} out of {currentExam.totalStudents} students
            </p>
            <div className="flex items-center gap-6 mt-3 text-sm text-yellow-600 dark:text-yellow-400">
              <span>📅 {currentExam.period}</span>
              <span>📊 {currentExam.percentage}%</span>
              <span>🎯 CGPA: {currentExam.cgpa}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getGradeColor(currentExam.grade)}`}>
                Grade {currentExam.grade}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Marks</p>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {currentExam.obtainedMarks}/{currentExam.totalMarks}
              </p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Percentage</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">{currentExam.percentage}%</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-2 border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">CGPA</p>
              <p className="text-xl font-bold text-purple-600 dark:text-purple-400">{currentExam.cgpa}</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Grade</p>
              <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{currentExam.grade}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Subject-wise Results */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Subject-wise Performance
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {currentExam.examType} Examination
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-800 dark:text-gray-100">Subject</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-800 dark:text-gray-100">Marks</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-800 dark:text-gray-100">Percentage</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-800 dark:text-gray-100">Grade</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-800 dark:text-gray-100">Rank</th>
              </tr>
            </thead>
            <tbody>
              {currentExam.subjects.map((subject, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{subject.name.charAt(0)}</span>
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
                    <span className="font-semibold text-gray-800 dark:text-gray-100">
                      {((subject.marks / subject.totalMarks) * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getGradeColor(subject.grade)}`}>
                      {subject.grade}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="font-semibold text-purple-600 dark:text-purple-400">
                      #{subject.rank}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Subjects */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-600" />
            Top Performing Subjects
          </h3>
          <div className="space-y-3">
            {currentExam.subjects
              .sort((a, b) => b.marks - a.marks)
              .slice(0, 5)
              .map((subject, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 dark:text-gray-100">{subject.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {subject.marks}/{subject.totalMarks} • Rank #{subject.rank}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-sm font-semibold ${getGradeColor(subject.grade)}`}>
                    {subject.grade}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Grade Distribution
          </h3>
          <div className="space-y-3">
            {['A+', 'A', 'B+', 'B'].map(grade => {
              const count = currentExam.subjects.filter(s => s.grade === grade).length;
              const percentage = ((count / currentExam.subjects.length) * 100).toFixed(1);
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
      </div>

      {/* Comparison View */}
      {showComparison && (
        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-600" />
            Performance Comparison
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-800 dark:text-gray-100">Subject</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-800 dark:text-gray-100">Mid-term 2024</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-800 dark:text-gray-100">Annual 2024</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-800 dark:text-gray-100">Improvement</th>
                </tr>
              </thead>
              <tbody>
                {examResults.midterm2024.subjects.map((subject, index) => {
                  const annualSubject = examResults.annual2024.subjects.find(s => s.name === subject.name);
                  const improvement = subject.marks - (annualSubject?.marks || 0);
                  return (
                    <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-4 font-medium text-gray-800 dark:text-gray-100">{subject.name}</td>
                      <td className="py-3 px-4 text-center">{subject.marks}%</td>
                      <td className="py-3 px-4 text-center">{annualSubject?.marks || 'N/A'}%</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`font-semibold ${improvement > 0 ? 'text-green-600 dark:text-green-400' : improvement < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
                          {improvement > 0 ? '+' : ''}{improvement}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

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

export default ExamResult;
