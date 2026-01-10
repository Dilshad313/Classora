import React, { useState, useEffect } from 'react';
import { BarChart3, Home, ChevronRight, Users, BookOpen, Calendar, TrendingUp, User, School, Download, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  getClassWiseResults,
  getClassSubjectResults,
  getStudentSubjectResults,
  getDateRangeResults,
  getPerformanceReport,
  getDropdownData
} from '../../../../services/classTestApi';

const TestResult = () => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [activeSection, setActiveSection] = useState('class-wise');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);

  const sections = [
    { id: 'class-wise', label: 'Class-Wise', icon: School },
    { id: 'class-subject', label: 'Class & Subject', icon: BookOpen },
    { id: 'student-subject', label: 'Student & Subject', icon: User },
    { id: 'date-range', label: 'Date Range', icon: Calendar },
    { id: 'performance-report', label: 'Performance Report', icon: TrendingUp }
  ];

  // Load classes on component mount
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const data = await getDropdownData();
      setClasses(data.classes || []);
      setSubjects(data.subjects || []);
      setStudents(data.students || []);
    } catch (err) {
      setError('Failed to load classes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch subjects/students when class is selected
  useEffect(() => {
    if (selectedClass) {
      fetchClassData(selectedClass);
    } else {
      setSubjects([]);
      setStudents([]);
    }
  }, [selectedClass]);

  const fetchClassData = async (classId) => {
    try {
      const data = await getDropdownData(classId);
      setStudents(data.students || []);
      setSubjects(data.subjects || []);
    } catch (err) {
      console.error('Failed to load class data:', err);
    }
  };

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    setResults(null);
    if (sectionId === 'date-range') {
      setSelectedClass('all');
      setSelectedSubject('all');
    } else {
      setSelectedClass('');
      setSelectedSubject('');
    }
    setSelectedStudent('');
    setStartDate('');
    setEndDate('');
    setError('');
    setSubjects([]);
    setStudents([]);
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError('');
      setResults(null);

      switch (activeSection) {
        case 'class-wise':
          if (!selectedClass) {
            throw new Error('Please select a class');
          }
          const classResults = await getClassWiseResults(selectedClass);
          setResults(classResults);
          break;

        case 'class-subject':
          if (!selectedClass || !selectedSubject) {
            throw new Error('Please select both class and subject');
          }
          const classSubjectResults = await getClassSubjectResults(selectedClass, selectedSubject);
          setResults(classSubjectResults);
          break;

        case 'student-subject':
          if (!selectedStudent) {
            throw new Error('Please select a student');
          }
          const studentResults = await getStudentSubjectResults(selectedStudent);
          setResults(studentResults);
          break;

        case 'date-range':
          if (!startDate || !endDate) {
            throw new Error('Please select start and end dates');
          }
          const dateResults = await getDateRangeResults(startDate, endDate, selectedClass || 'all', selectedSubject || 'all');
          setResults(dateResults);
          break;

        case 'performance-report':
          if (!selectedClass) {
            throw new Error('Please select a class');
          }
          const performanceResults = await getPerformanceReport(selectedClass);
          setResults(performanceResults);
          break;

        default:
          break;
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch results');
      console.error('Search error:', err);
      toast.error(err.message || 'Failed to fetch results');
    } finally {
      setLoading(false);
    }
  };

  const BarChart = ({ data, color = 'blue', maxValue = 100 }) => {
    return (
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-300 truncate mr-2">{item.label}</span>
              <span className="font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap">{item.value}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className={`h-full bg-gradient-to-r ${
                  color === 'blue' ? 'from-blue-500 to-blue-600' :
                  color === 'purple' ? 'from-purple-500 to-purple-600' :
                  color === 'green' ? 'from-green-500 to-green-600' :
                  'from-orange-500 to-orange-600'
                } rounded-full transition-all duration-500`}
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const CircularProgress = ({ percentage, label, color = 'blue' }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    
    const colorClasses = {
      blue: 'text-blue-500',
      green: 'text-green-500',
      purple: 'text-purple-500',
      orange: 'text-orange-500',
      red: 'text-red-500'
    };
    
    return (
      <div className="flex flex-col items-center">
        <div className="relative w-28 h-28">
          <svg className="transform -rotate-90 w-28 h-28">
            <circle cx="56" cy="56" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-200 dark:text-gray-700" />
            <circle
              cx="56"
              cy="56"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className={`${colorClasses[color]} transition-all duration-1000`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{percentage}%</span>
          </div>
        </div>
        <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
      </div>
    );
  };

  const renderClassWiseResults = () => {
    if (!results) return null;
    
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Subject-wise Performance</h3>
            <BarChart
              data={results.subjectPerformance?.map(subject => ({
                label: subject._id || subject.subjectName,
                value: Math.round(subject.averageScore || 0)
              })) || []}
              color="blue"
            />
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Class Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-green-600">{results.summary?.totalStudents || 0}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Students</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-blue-600">{Math.round(results.summary?.overallAverage || 0)}%</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Avg Score</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-purple-600">{results.summary?.totalPassCount || 0}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Passed</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-red-600">{results.summary?.totalStudents - (results.summary?.totalPassCount || 0)}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Failed</p>
              </div>
            </div>
          </div>
        </div>
        
        {results.tests && results.tests.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Test Details</h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-200 dark:bg-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Test Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Subject</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Total Marks</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Avg Score</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {results.tests.map((test, idx) => (
                    <tr key={idx} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">{test.testName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(test.testDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{test.subjectName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{test.totalMarks}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{Math.round(test.averageMarks || 0)}%</td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          (test.averageMarks || 0) >= 80 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          (test.averageMarks || 0) >= 60 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {(test.averageMarks || 0) >= 80 ? 'Excellent' : (test.averageMarks || 0) >= 60 ? 'Good' : 'Needs Improvement'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderClassSubjectResults = () => {
    if (!results) return null;
    
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Test-wise Performance</h3>
            <BarChart
              data={results.tests?.map((test, index) => ({
                label: test.testName || `Test ${index + 1}`,
                value: Math.round(test.averageMarks || 0)
              })) || []}
              color="purple"
            />
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Performance Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Highest Score</span>
                <span className="text-lg font-bold text-green-600">{Math.round(results.summary?.highestScore || 0)}%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Lowest Score</span>
                <span className="text-lg font-bold text-red-600">{Math.round(results.summary?.lowestScore || 0)}%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Average Score</span>
                <span className="text-lg font-bold text-blue-600">{Math.round(results.summary?.averageScore || 0)}%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Pass Percentage</span>
                <span className="text-lg font-bold text-purple-600">{Math.round(results.summary?.passRate || 0)}%</span>
              </div>
            </div>
          </div>
        </div>
        
        {results.studentPerformance && results.studentPerformance.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Student Performance Details</h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-200 dark:bg-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Rank</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Roll No</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Student Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Avg Score</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {results.studentPerformance.map((student, idx) => (
                    <tr key={idx} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750">
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                          student.rank === 1 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          student.rank === 2 ? 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200' :
                          student.rank === 3 ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                          'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}>
                          {student.rank}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">{student.rollNo}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{student.studentName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{Math.round(student.averageScore || 0)}%</td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          student.grade?.startsWith('A') ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          student.grade?.startsWith('B') ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {student.grade || 'N/A'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderStudentSubjectResults = () => {
    if (!results) return null;
    
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">Subject-wise Performance</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarChart
              data={results.subjectPerformance?.map(subject => ({
                label: subject.subjectName,
                value: Math.round(subject.averagePercentage || 0)
              })) || []}
              color="purple"
            />
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Overall Average</p>
                <p className="text-3xl font-bold text-purple-600">
                  {Math.round(results.overallStats?.overallAverage || 0)}%
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Tests</p>
                <p className="text-3xl font-bold text-blue-600">{results.overallStats?.totalTests || 0}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Subjects Taken</p>
                <p className="text-3xl font-bold text-green-600">{results.subjectPerformance?.length || 0}</p>
              </div>
            </div>
          </div>
        </div>
        
        {results.overallStats?.testHistory && results.overallStats.testHistory.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Detailed Test History</h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-200 dark:bg-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Subject</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Test Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Score</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Percentage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {results.overallStats.testHistory.map((test, idx) => (
                    <tr key={idx} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">{test.subjectName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{test.testName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(test.testDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {test.obtainedMarks}/{test.totalMarks}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{Math.round(test.percentage || 0)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderDateRangeResults = () => {
    if (!results) return null;
    
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Tests in Period</h3>
            <div className="text-center">
              <p className="text-5xl font-bold text-blue-600 mb-2">{results.summary?.totalTests || 0}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Tests Conducted</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Average Performance</h3>
            <div className="text-center">
              <p className="text-5xl font-bold text-green-600 mb-2">{Math.round(results.summary?.overallAverage || 0)}%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Overall Average Score</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Pass Rate</h3>
            <div className="text-center">
              <p className="text-5xl font-bold text-purple-600 mb-2">{Math.round(results.summary?.passRate || 0)}%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Students Passed</p>
            </div>
          </div>
        </div>
        
        {results.weeklyTrend && results.weeklyTrend.length > 0 && (
          <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Performance Trend</h3>
            <BarChart
              data={results.weeklyTrend.map(week => ({
                label: week.week,
                value: week.averageScore
              }))}
              color="orange"
            />
          </div>
        )}
        
        {results.tests && results.tests.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Detailed Test Results</h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-200 dark:bg-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Test Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Class</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Subject</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Avg Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {results.tests.map((test, idx) => (
                    <tr key={idx} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750">
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(test.testDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">{test.testName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{test.className}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{test.subjectName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{Math.round(test.averageMarks || 0)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderPerformanceReport = () => {
    if (!results) return null;
    
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-8">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">Overall Performance Metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <CircularProgress percentage={Math.round(results.summary?.averageScore || 0)} label="Average Score" color="blue" />
            <CircularProgress percentage={Math.round(results.summary?.passRate || 0)} label="Pass Rate" color="green" />
            <CircularProgress percentage={Math.round(results.summary?.attendanceRate || 0)} label="Attendance" color="purple" />
            <CircularProgress percentage={Math.round(results.summary?.completionRate || 0)} label="Completion" color="orange" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Subject Performance</h3>
            <BarChart
              data={results.subjectPerformance?.map(subject => ({
                label: subject.subjectName,
                value: Math.round(subject.averageScore || 0)
              })) || []}
              color="blue"
            />
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Grade Distribution</h3>
            <div className="space-y-4">
              {results.gradeDistribution && Object.entries(results.gradeDistribution).map(([grade, count]) => {
                const percentage = results.totalStudents > 0 ? (count / results.totalStudents) * 100 : 0;
                return (
                  <div key={grade} className="flex items-center justify-between">
                    <span className="font-medium text-gray-700 dark:text-gray-300">{grade}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div
                          className={`h-full rounded-full ${
                            grade === 'A+' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                            grade === 'A' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                            grade === 'B' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                            grade === 'C' ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                            'bg-gradient-to-r from-red-500 to-red-600'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-gray-100 w-12">
                        {Math.round(percentage)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {results.topPerformers && results.topPerformers.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Top Performers</h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Download className="w-4 h-4" />
                Export Report
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-200 dark:bg-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Rank</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Roll No</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Student Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Overall Avg</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Tests Taken</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Grade</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {results.topPerformers.map((student, idx) => (
                    <tr key={idx} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750">
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                          student.rank === 1 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          student.rank === 2 ? 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200' :
                          student.rank === 3 ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                          'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}>
                          {student.rank}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">{student.rollNo}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">{student.studentName}</td>
                      <td className="px-4 py-3 text-sm font-bold text-green-600">{Math.round(student.averagePercentage || 0)}%</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{student.testsTaken}</td>
                      <td className="px-4 py-3">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          {student.grade}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{student.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'class-wise':
        return (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Select Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full md:w-64 px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
              disabled={loading}
            >
              <option value="">Choose a class...</option>
              {classes.map(cls => (
                <option key={cls._id} value={cls._id}>
                  {cls.className}
                </option>
              ))}
            </select>
          </div>
        );

      case 'class-subject':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Select Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                disabled={loading}
              >
                <option value="">Choose a class...</option>
                {classes.map(cls => (
                  <option key={cls._id} value={cls._id}>
                    {cls.className}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Select Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                disabled={!selectedClass || loading}
              >
                <option value="">Choose a subject...</option>
                {subjects.map(sub => (
                  <option key={sub._id || sub.name} value={sub.name}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      case 'student-subject':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Select Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                disabled={loading}
              >
                <option value="">Choose a class...</option>
                {classes.map(cls => (
                  <option key={cls._id} value={cls._id}>
                    {cls.className}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Select Student</label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full md:w-96 px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                disabled={loading || !selectedClass}
              >
                <option value="">Choose a student...</option>
                {students.map(student => (
                  <option key={student._id} value={student._id}>
                    {student.rollNumber || student.registrationNo} - {student.studentName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      case 'date-range':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Class (Optional)</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                disabled={loading}
              >
                <option value="all">All Classes</option>
                {classes.map(cls => (
                  <option key={cls._id} value={cls._id}>
                    {cls.className}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Subject (Optional)</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                disabled={loading}
              >
                <option value="all">All Subjects</option>
                {subjects.map(sub => (
                  <option key={sub._id || sub.name} value={sub.name}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      case 'performance-report':
        return (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Select Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full md:w-64 px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
              disabled={loading}
            >
              <option value="">Choose a class...</option>
              {classes.map(cls => (
                <option key={cls._id} value={cls._id}>
                  {cls.className}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Select a class to generate the performance report.</p>
          </div>
        );

      default:
        return null;
    }
  };

  const renderResults = () => {
    switch (activeSection) {
      case 'class-wise':
        return renderClassWiseResults();
      case 'class-subject':
        return renderClassSubjectResults();
      case 'student-subject':
        return renderStudentSubjectResults();
      case 'date-range':
        return renderDateRangeResults();
      case 'performance-report':
        return renderPerformanceReport();
      default:
        return null;
    }
  };

  const handleExport = (filename, payload) => {
    if (!payload) return;
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-6 text-sm">
          <button onClick={() => window.history.back()} className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors font-medium">
            <Home className="w-4 h-4" /><span>Dashboard</span>
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-blue-600 font-semibold">Class Tests</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 dark:text-gray-100 font-semibold">Test Result</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <span>Test Results & Analytics</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">View comprehensive test results and performance analytics</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center space-x-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => handleSectionChange(section.id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                    activeSection === section.id
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg scale-105'
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                  disabled={loading}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-sm font-semibold text-center">{section.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            {(() => {
              const Icon = sections.find(s => s.id === activeSection)?.icon || School;
              return <Icon className="w-6 h-6 text-green-600" />;
            })()}
            <span>
              {activeSection === 'class-wise' && 'Class-Wise Test Results'}
              {activeSection === 'class-subject' && 'Class & Subject Performance'}
              {activeSection === 'student-subject' && 'Student & Subject Performance'}
              {activeSection === 'date-range' && 'Date Range Analysis'}
              {activeSection === 'performance-report' && 'Performance Report'}
            </span>
          </h2>

          {renderSectionContent()}

          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p className="font-semibold">Note:</p>
              <p>• Select the required parameters to view test results</p>
              <p>• All data is fetched from the database in real-time</p>
            </div>
            <button
              onClick={handleSearch}
              disabled={loading || (
                (activeSection === 'class-wise' && !selectedClass) ||
                (activeSection === 'class-subject' && (!selectedClass || !selectedSubject)) ||
                (activeSection === 'student-subject' && !selectedStudent) ||
                (activeSection === 'date-range' && (!startDate || !endDate)) ||
                (activeSection === 'performance-report' && !selectedClass)
              )}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all shadow-lg hover:shadow-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <BarChart3 className="w-5 h-5" />
                  <span>Generate Report</span>
                </>
              )}
            </button>
          </div>

          {loading && !results && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
            </div>
          )}

          {renderResults()}

          {!results && !loading && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-12 text-center">
              <BarChart3 className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No Results Yet</h3>
              <p className="text-gray-500 dark:text-gray-400">Select your criteria and click "Generate Report" to view test results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestResult;