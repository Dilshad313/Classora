import React, { useState } from 'react';
import { BarChart3, Home, ChevronRight, Users, BookOpen, Calendar, TrendingUp, User, School, Download } from 'lucide-react';

const TestResult = () => {
  const [classes] = useState([
    { id: 1, name: 'Grade 10', section: 'A' }, { id: 2, name: 'Grade 10', section: 'B' },
    { id: 3, name: 'Grade 11', section: 'A' }, { id: 4, name: 'Grade 9', section: 'A' }
  ]);
  const [subjects] = useState([
    { id: 1, name: 'Mathematics' }, { id: 2, name: 'Physics' }, { id: 3, name: 'Chemistry' }, { id: 4, name: 'English' }
  ]);
  const [students] = useState([
    { id: 1, name: 'Arun P', rollNo: '001' }, { id: 2, name: 'Priya Sharma', rollNo: '002' }, { id: 3, name: 'Rahul Kumar', rollNo: '003' }
  ]);
  const [activeSection, setActiveSection] = useState('class-wise');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showResults, setShowResults] = useState(false);

  const sections = [
    { id: 'class-wise', label: 'Class-Wise', icon: School },
    { id: 'class-subject', label: 'Class & Subject', icon: BookOpen },
    { id: 'student-subject', label: 'Student & Subject', icon: User },
    { id: 'date-range', label: 'Date Range', icon: Calendar },
    { id: 'performance-report', label: 'Performance Report', icon: TrendingUp }
  ];

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    setShowResults(false);
    setSelectedClass('');
    setSelectedSubject('');
    setSelectedStudent('');
    setStartDate('');
    setEndDate('');
  };

  const BarChart = ({ data, color = 'blue' }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    return (
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
              <span className="font-bold text-gray-900 dark:text-gray-100">{item.value}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div className={`h-full bg-gradient-to-r ${
                color === 'blue' ? 'from-blue-500 to-blue-600' :
                color === 'purple' ? 'from-purple-500 to-purple-600' :
                color === 'green' ? 'from-green-500 to-green-600' :
                'from-orange-500 to-orange-600'
              } rounded-full transition-all duration-500`}
                style={{ width: `${(item.value / maxValue) * 100}%` }}></div>
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
            <circle cx="56" cy="56" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent"
              strokeDasharray={circumference} strokeDashoffset={offset}
              className={`${colorClasses[color]} transition-all duration-1000`} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{percentage}%</span>
          </div>
        </div>
        <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
      </div>
    );
  };

  const ClassWiseTable = () => (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Detailed Results</h3>
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
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Tests Conducted</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Avg Score</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Pass Rate</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {[
              { subject: 'Mathematics', tests: 5, avg: 85, pass: 87 },
              { subject: 'Physics', tests: 4, avg: 78, pass: 75 },
              { subject: 'Chemistry', tests: 5, avg: 82, pass: 81 },
              { subject: 'English', tests: 3, avg: 88, pass: 93 },
              { subject: 'Biology', tests: 4, avg: 76, pass: 71 }
            ].map((row, idx) => (
              <tr key={idx} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750">
                <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">{row.subject}</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{row.tests}</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{row.avg}%</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{row.pass}%</td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    row.avg >= 80 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    row.avg >= 60 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {row.avg >= 80 ? 'Excellent' : row.avg >= 60 ? 'Good' : 'Needs Improvement'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Test Results Analysis</h1>
                <p className="text-green-100 mt-1">Comprehensive test performance analytics and insights</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => handleSectionChange(section.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-3 ${
                      activeSection === section.id
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                        : 'border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-500 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-sm font-semibold text-center">{section.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Sections */}
        {activeSection === 'class-wise' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
              <School className="w-6 h-6 text-green-600" />
              Class-Wise Performance
            </h2>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Select Class</label>
              <select 
                value={selectedClass} 
                onChange={(e) => { setSelectedClass(e.target.value); setShowResults(true); }}
                className="w-full md:w-64 px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
              >
                <option value="">Choose a class...</option>
                {classes.map(cls => (
                  <option key={cls.id} value={`${cls.name}-${cls.section}`}>{cls.name} - Section {cls.section}</option>
                ))}
              </select>
            </div>
            {showResults && selectedClass && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Overall Performance</h3>
                    <div className="text-center">
                      <p className="text-5xl font-bold text-blue-600 mb-2">82%</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Class Average</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Pass Rate</h3>
                    <div className="text-center">
                      <p className="text-5xl font-bold text-green-600 mb-2">87%</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Students Passed</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Total Tests</h3>
                    <div className="text-center">
                      <p className="text-5xl font-bold text-purple-600 mb-2">21</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Tests Conducted</p>
                    </div>
                  </div>
                </div>
                <ClassWiseTable />
              </div>
            )}
          </div>
        )}

        {/* Class & Subject Section */}
        {activeSection === 'class-subject' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-green-600" />
              Class & Subject Performance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Select Class</label>
                <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all">
                  <option value="">Choose a class...</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={`${cls.name}-${cls.section}`}>{cls.name} - Section {cls.section}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Select Subject</label>
                <select value={selectedSubject} onChange={(e) => { setSelectedSubject(e.target.value); if(selectedClass) setShowResults(true); }}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all">
                  <option value="">Choose a subject...</option>
                  {subjects.map(subj => (
                    <option key={subj.id} value={subj.name}>{subj.name}</option>
                  ))}
                </select>
              </div>
            </div>
            {showResults && selectedClass && selectedSubject && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Test-wise Performance</h3>
                    <BarChart data={[
                      { label: 'Unit Test 1', value: 82 },
                      { label: 'Unit Test 2', value: 85 },
                      { label: 'Mid Term', value: 78 },
                      { label: 'Unit Test 3', value: 88 },
                      { label: 'Final Term', value: 84 }
                    ]} color="purple" />
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Performance Metrics</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Highest Score</span>
                        <span className="text-lg font-bold text-green-600">95%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Lowest Score</span>
                        <span className="text-lg font-bold text-red-600">45%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Average Score</span>
                        <span className="text-lg font-bold text-blue-600">83%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Pass Percentage</span>
                        <span className="text-lg font-bold text-purple-600">87%</span>
                      </div>
                    </div>
                  </div>
                </div>
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
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Roll No</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Student Name</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Tests Taken</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Avg Score</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Grade</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Rank</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                        {[
                          { roll: '001', name: 'Arun P', tests: 5, avg: 92, grade: 'A+', rank: 1 },
                          { roll: '002', name: 'Priya Sharma', tests: 5, avg: 88, grade: 'A', rank: 2 },
                          { roll: '003', name: 'Rahul Kumar', tests: 5, avg: 85, grade: 'A', rank: 3 },
                          { roll: '004', name: 'Sneha Reddy', tests: 4, avg: 78, grade: 'B+', rank: 4 },
                          { roll: '005', name: 'Vikram Singh', tests: 5, avg: 72, grade: 'B', rank: 5 }
                        ].map((row, idx) => (
                          <tr key={idx} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">{row.roll}</td>
                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{row.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{row.tests}</td>
                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{row.avg}%</td>
                            <td className="px-4 py-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                row.grade.startsWith('A') ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                row.grade.startsWith('B') ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              }`}>
                                {row.grade}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm font-bold text-gray-900 dark:text-gray-100">#{row.rank}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Student & Subject Section */}
        {activeSection === 'student-subject' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
              <User className="w-6 h-6 text-green-600" />
              Student & Subject Performance
            </h2>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Select Student</label>
              <select value={selectedStudent} onChange={(e) => { setSelectedStudent(e.target.value); setShowResults(true); }}
                className="w-full md:w-96 px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all">
                <option value="">Choose a student...</option>
                {students.map(student => (
                  <option key={student.id} value={student.name}>{student.rollNo} - {student.name}</option>
                ))}
              </select>
            </div>
            {showResults && selectedStudent && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">Subject-wise Performance</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <BarChart data={[
                      { label: 'Mathematics', value: 92 },
                      { label: 'Physics', value: 85 },
                      { label: 'Chemistry', value: 88 },
                      { label: 'English', value: 90 },
                      { label: 'Biology', value: 87 }
                    ]} color="purple" />
                    <div className="space-y-4">
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Overall Average</p>
                        <p className="text-3xl font-bold text-purple-600">88.4%</p>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Class Rank</p>
                        <p className="text-3xl font-bold text-green-600">#2</p>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Tests</p>
                        <p className="text-3xl font-bold text-blue-600">25</p>
                      </div>
                    </div>
                  </div>
                </div>
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
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Grade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                        {[
                          { subject: 'Mathematics', test: 'Unit Test 1', date: '2024-10-15', score: 92, grade: 'A+' },
                          { subject: 'Physics', test: 'Mid Term', date: '2024-10-20', score: 85, grade: 'A' },
                          { subject: 'Chemistry', test: 'Unit Test 2', date: '2024-10-25', score: 88, grade: 'A' },
                          { subject: 'English', test: 'Final Term', date: '2024-11-01', score: 90, grade: 'A+' },
                          { subject: 'Biology', test: 'Unit Test 3', date: '2024-11-05', score: 87, grade: 'A' }
                        ].map((row, idx) => (
                          <tr key={idx} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">{row.subject}</td>
                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{row.test}</td>
                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{row.date}</td>
                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{row.score}%</td>
                            <td className="px-4 py-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                row.grade.startsWith('A') ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                row.grade.startsWith('B') ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              }`}>
                                {row.grade}
                              </span>
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
        )}

        {/* Date Range Section */}
        {activeSection === 'date-range' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-green-600" />
              Date Range Analysis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">End Date</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Class (Optional)</label>
                <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all">
                  <option value="">All Classes</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={`${cls.name}-${cls.section}`}>{cls.name} - Section {cls.section}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Subject (Optional)</label>
                <select value={selectedSubject} onChange={(e) => { setSelectedSubject(e.target.value); if(startDate && endDate) setShowResults(true); }}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all">
                  <option value="">All Subjects</option>
                  {subjects.map(subj => (
                    <option key={subj.id} value={subj.name}>{subj.name}</option>
                  ))}
                </select>
              </div>
            </div>
            {showResults && startDate && endDate && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Tests in Period</h3>
                    <div className="text-center">
                      <p className="text-5xl font-bold text-blue-600 mb-2">12</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Tests Conducted</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Average Performance</h3>
                    <div className="text-center">
                      <p className="text-5xl font-bold text-green-600 mb-2">84%</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Overall Average Score</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Pass Rate</h3>
                    <div className="text-center">
                      <p className="text-5xl font-bold text-purple-600 mb-2">89%</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Students Passed</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Performance Trend</h3>
                  <BarChart data={[
                    { label: 'Week 1', value: 78 },
                    { label: 'Week 2', value: 82 },
                    { label: 'Week 3', value: 85 },
                    { label: 'Week 4', value: 88 },
                    { label: 'Week 5', value: 84 }
                  ]} color="orange" />
                </div>
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
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Pass Rate</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                        {[
                          { date: '2024-10-15', test: 'Unit Test 1', class: 'Grade 10-A', subject: 'Mathematics', avg: 85, pass: 87 },
                          { date: '2024-10-18', test: 'Mid Term', class: 'Grade 10-A', subject: 'Physics', avg: 78, pass: 75 },
                          { date: '2024-10-22', test: 'Unit Test 2', class: 'Grade 10-B', subject: 'Chemistry', avg: 82, pass: 81 },
                          { date: '2024-10-25', test: 'Final Term', class: 'Grade 11-A', subject: 'English', avg: 88, pass: 93 },
                          { date: '2024-10-28', test: 'Unit Test 3', class: 'Grade 9-A', subject: 'Biology', avg: 76, pass: 71 },
                          { date: '2024-11-01', test: 'Unit Test 1', class: 'Grade 10-A', subject: 'English', avg: 90, pass: 95 }
                        ].map((row, idx) => (
                          <tr key={idx} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750">
                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{row.date}</td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">{row.test}</td>
                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{row.class}</td>
                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{row.subject}</td>
                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{row.avg}%</td>
                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{row.pass}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Performance Report Section */}
        {activeSection === 'performance-report' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
              Performance Report
            </h2>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Select Class</label>
              <select value={selectedClass} onChange={(e) => { setSelectedClass(e.target.value); setShowResults(true); }}
                className="w-full md:w-64 px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all">
                <option value="">Choose a class...</option>
                {classes.map(cls => (
                  <option key={cls.id} value={`${cls.name}-${cls.section}`}>{cls.name} - Section {cls.section}</option>
                ))}
              </select>
            </div>
            {showResults && selectedClass && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-8">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">Overall Performance Metrics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <CircularProgress percentage={82} label="Average Score" color="blue" />
                    <CircularProgress percentage={87} label="Pass Rate" color="green" />
                    <CircularProgress percentage={75} label="Attendance" color="purple" />
                    <CircularProgress percentage={90} label="Completion" color="orange" />
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Subject Performance</h3>
                    <BarChart data={[
                      { label: 'Mathematics', value: 85 },
                      { label: 'Physics', value: 78 },
                      { label: 'Chemistry', value: 82 },
                      { label: 'English', value: 88 },
                      { label: 'Biology', value: 76 }
                    ]} color="blue" />
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Grade Distribution</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700 dark:text-gray-300">A+ Grade</span>
                        <div className="flex items-center gap-3">
                          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                            <div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full" style={{ width: '35%' }}></div>
                          </div>
                          <span className="text-sm font-bold text-gray-900 dark:text-gray-100 w-12">35%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700 dark:text-gray-300">A Grade</span>
                        <div className="flex items-center gap-3">
                          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style={{ width: '30%' }}></div>
                          </div>
                          <span className="text-sm font-bold text-gray-900 dark:text-gray-100 w-12">30%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700 dark:text-gray-300">B Grade</span>
                        <div className="flex items-center gap-3">
                          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                            <div className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full" style={{ width: '20%' }}></div>
                          </div>
                          <span className="text-sm font-bold text-gray-900 dark:text-gray-100 w-12">20%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700 dark:text-gray-300">C Grade</span>
                        <div className="flex items-center gap-3">
                          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                            <div className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full" style={{ width: '10%' }}></div>
                          </div>
                          <span className="text-sm font-bold text-gray-900 dark:text-gray-100 w-12">10%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Failed</span>
                        <div className="flex items-center gap-3">
                          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                            <div className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full" style={{ width: '5%' }}></div>
                          </div>
                          <span className="text-sm font-bold text-gray-900 dark:text-gray-100 w-12">5%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestResult;
