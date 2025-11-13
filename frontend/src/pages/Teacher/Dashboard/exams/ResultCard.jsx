import React, { useState } from 'react';
import { 
  IdCard, 
  Download, 
  Search, 
  Award, 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  User, 
  Users, 
  Calendar, 
  BookOpen,
  Printer,
  Eye,
  Star,
  Trophy,
  Target,
  CheckCircle2
} from 'lucide-react';

const ResultCard = () => {
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [searchStudent, setSearchStudent] = useState('');
  const [resultType, setResultType] = useState('student'); // 'student' or 'class'
  const [showResults, setShowResults] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

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
        mathematics: { marks: 92, maxMarks: 100 },
        english: { marks: 85, maxMarks: 100 },
        science: { marks: 88, maxMarks: 100 },
        'social-studies': { marks: 90, maxMarks: 100 },
        hindi: { marks: 87, maxMarks: 100 }
      },
      totalMarks: 442,
      maxTotalMarks: 500,
      percentage: 88.4,
      grade: 'A+',
      rank: 1,
      attendance: 95
    },
    {
      id: 2,
      name: 'Priya Sharma',
      rollNo: '002',
      class: '10-A',
      subjects: {
        mathematics: { marks: 88, maxMarks: 100 },
        english: { marks: 92, maxMarks: 100 },
        science: { marks: 85, maxMarks: 100 },
        'social-studies': { marks: 89, maxMarks: 100 },
        hindi: { marks: 91, maxMarks: 100 }
      },
      totalMarks: 445,
      maxTotalMarks: 500,
      percentage: 89.0,
      grade: 'A+',
      rank: 2,
      attendance: 98
    }
  ];

  const filteredStudents = students.filter(student => {
    // For student-wise search, filter by name and optionally by class
    if (resultType === 'student') {
      const matchesName = student.name.toLowerCase().includes(searchStudent.toLowerCase());
      const matchesClass = !selectedClass || student.class === selectedClass;
      return matchesName && matchesClass;
    }
    // For class-wise results, filter by class only
    return student.class === selectedClass;
  });

  const handleGenerateResults = () => {
    if (!selectedExam || (resultType === 'student' && !searchStudent) || (resultType === 'class' && !selectedClass)) {
      alert('Please fill in all required fields');
      return;
    }
    setShowResults(true);
  };

  const handleDownloadStudent = (student) => {
    const studentData = {
      examName: exams.find(e => e.id === selectedExam)?.name,
      studentName: student.name,
      rollNo: student.rollNo,
      class: student.class,
      subjects: student.subjects,
      totalMarks: student.totalMarks,
      maxTotalMarks: student.maxTotalMarks,
      percentage: student.percentage,
      grade: student.grade,
      rank: student.rank,
      attendance: student.attendance,
      generatedAt: new Date().toISOString()
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(studentData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `result-card-${student.name.replace(/\s+/g, '-')}-${Date.now()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleDownloadAllClass = () => {
    const classStudents = students.filter(s => s.class === selectedClass);
    const classData = {
      examName: exams.find(e => e.id === selectedExam)?.name,
      className: classes.find(c => c.id === selectedClass)?.name,
      totalStudents: classStudents.length,
      students: classStudents.map(student => ({
        name: student.name,
        rollNo: student.rollNo,
        subjects: student.subjects,
        totalMarks: student.totalMarks,
        maxTotalMarks: student.maxTotalMarks,
        percentage: student.percentage,
        grade: student.grade,
        rank: student.rank,
        attendance: student.attendance
      })),
      classStatistics: {
        averagePercentage: (classStudents.reduce((sum, s) => sum + s.percentage, 0) / classStudents.length).toFixed(2),
        highestScore: Math.max(...classStudents.map(s => s.percentage)),
        lowestScore: Math.min(...classStudents.map(s => s.percentage)),
        passCount: classStudents.filter(s => s.percentage >= 40).length,
        failCount: classStudents.filter(s => s.percentage < 40).length
      },
      generatedAt: new Date().toISOString()
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(classData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `class-results-${selectedClass}-${Date.now()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const getSubjectChart = (subjects) => {
    const subjectNames = Object.keys(subjects);
    const percentages = subjectNames.map(subject => 
      ((subjects[subject].marks / subjects[subject].maxMarks) * 100).toFixed(1)
    );
    
    return { subjectNames, percentages };
  };

  const getGradeColor = (grade) => {
    switch(grade) {
      case 'A+': return 'text-green-600 dark:text-green-400';
      case 'A': return 'text-green-500 dark:text-green-300';
      case 'B+': return 'text-blue-600 dark:text-blue-400';
      case 'B': return 'text-blue-500 dark:text-blue-300';
      case 'C': return 'text-yellow-600 dark:text-yellow-400';
      case 'D': return 'text-orange-600 dark:text-orange-400';
      default: return 'text-red-600 dark:text-red-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-800 dark:to-blue-800 rounded-2xl shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative px-8 py-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <IdCard className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Generate Result Card</h1>
                <p className="text-purple-100 text-lg">Create detailed result cards with charts and analytics</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-purple-100">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                <span>Visual Analytics</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                <span>Performance Tracking</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selection Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Search className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Result Generation</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Configure result card parameters</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {/* Result Type Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Result Type
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setResultType('student')}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                      resultType === 'student' 
                        ? 'bg-purple-600 text-white shadow-lg' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <User className="w-5 h-5" />
                    Student-wise
                  </button>
                  <button
                    onClick={() => setResultType('class')}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                      resultType === 'class' 
                        ? 'bg-purple-600 text-white shadow-lg' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Users className="w-5 h-5" />
                    Class-wise
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Select Exam <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedExam}
                    onChange={(e) => setSelectedExam(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                  >
                    <option value="">Select an exam</option>
                    {exams.map(exam => (
                      <option key={exam.id} value={exam.id}>{exam.name}</option>
                    ))}
                  </select>
                </div>

                {resultType === 'class' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Select Class <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                    >
                      <option value="">Select a class</option>
                      {classes.map(cls => (
                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {resultType === 'student' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Search Student <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={searchStudent}
                        onChange={(e) => {
                          setSearchStudent(e.target.value);
                          setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 300)}
                        placeholder="Search by student name or roll number..."
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                      />
                      
                      {/* Student Suggestions Dropdown */}
                      {showSuggestions && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-2xl z-[9999] max-h-80 overflow-y-auto"
                             style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                          {(() => {
                            const matchingStudents = searchStudent 
                              ? students.filter(student => 
                                  student.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
                                  student.rollNo.toLowerCase().includes(searchStudent.toLowerCase())
                                )
                              : students;
                            
                            if (matchingStudents.length === 0) {
                              return (
                                <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-center">
                                  <div className="flex flex-col items-center gap-2">
                                    <Search className="w-5 h-5" />
                                    <span>No students found matching "{searchStudent}"</span>
                                  </div>
                                </div>
                              );
                            }
                            
                            return (
                              <>
                                <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600">
                                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                    {searchStudent 
                                      ? `${matchingStudents.length} Student${matchingStudents.length !== 1 ? 's' : ''} Found`
                                      : `All Students (${matchingStudents.length})`
                                    }
                                  </span>
                                </div>
                                {matchingStudents.map(student => (
                                  <button
                                    key={student.id}
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      setSearchStudent(student.name);
                                      setShowSuggestions(false);
                                    }}
                                    className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center justify-between border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors cursor-pointer"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                        {student.name.charAt(0)}
                                      </div>
                                      <div>
                                        <div className="text-gray-900 dark:text-gray-100 font-medium">
                                          {student.name}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                          Class {student.class} • Roll No: {student.rollNo}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-xs text-gray-400 dark:text-gray-500">
                                      Click to select
                                    </div>
                                  </button>
                                ))}
                              </>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-end">
                  <button
                    onClick={handleGenerateResults}
                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Eye className="w-5 h-5" />
                    Generate Results
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Display */}
        {showResults && (
          <div className="space-y-8">
            {resultType === 'student' ? (
              // Student-wise Results
              filteredStudents.length > 0 ? (
                <div className="space-y-6">
                  {/* Results Header */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                          <Search className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                            Search Results
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Found {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''} 
                            {searchStudent && ` matching "${searchStudent}"`}
                            {selectedClass && ` in ${classes.find(c => c.id === selectedClass)?.name}`}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSearchStudent('');
                          setSelectedClass('');
                          setShowResults(false);
                        }}
                        className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {filteredStudents.map(student => {
                  const chartData = getSubjectChart(student.subjects);
                  return (
                    <div key={student.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                      {/* Student Header */}
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 px-6 py-6 border-b border-gray-200 dark:border-gray-600">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                              {student.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{student.name}</h3>
                              <p className="text-gray-600 dark:text-gray-400">Roll No: {student.rollNo} | Class: {student.class}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <span className="flex items-center gap-1 text-sm">
                                  <Trophy className="w-4 h-4 text-yellow-500" />
                                  Rank: {student.rank}
                                </span>
                                <span className="flex items-center gap-1 text-sm">
                                  <Target className="w-4 h-4 text-green-500" />
                                  {student.attendance}% Attendance
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleDownloadStudent(student)}
                              className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                              title="Download result"
                            >
                              <Download className="w-5 h-5" />
                            </button>
                            <button className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                              <Printer className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Performance Overview */}
                      <div className="p-6">
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{student.totalMarks}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Total Marks</div>
                          </div>
                          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{student.percentage}%</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Percentage</div>
                          </div>
                          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                            <div className={`text-2xl font-bold ${getGradeColor(student.grade)}`}>{student.grade}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Grade</div>
                          </div>
                        </div>

                        {/* Subject-wise Performance */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5" />
                            Subject-wise Performance
                          </h4>
                          <div className="space-y-3">
                            {Object.entries(student.subjects).map(([subject, data]) => {
                              const percentage = ((data.marks / data.maxMarks) * 100).toFixed(1);
                              return (
                                <div key={subject} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                  <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="font-medium text-gray-800 dark:text-gray-100 capitalize">
                                        {subject.replace('-', ' ')}
                                      </span>
                                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                        {data.marks}/{data.maxMarks}
                                      </span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                      <div 
                                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${percentage}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                  <div className="ml-4 text-right">
                                    <div className="text-sm font-bold text-purple-600 dark:text-purple-400">{percentage}%</div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                  })}
                  </div>
                </div>
              ) : (
                // No students found message
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">No Students Found</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    No students match your search criteria "{searchStudent}"
                    {selectedClass && ` in ${classes.find(c => c.id === selectedClass)?.name}`}
                  </p>
                  <button
                    onClick={() => {
                      setSearchStudent('');
                      setSelectedClass('');
                    }}
                    className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                  >
                    Clear Search
                  </button>
                </div>
              )
            ) : (
              // Class-wise Results
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Class Results - {selectedClass}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{exams.find(e => e.id === selectedExam)?.name}</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleDownloadAllClass}
                      className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download All
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {students.filter(s => s.class === selectedClass).map(student => (
                      <div key={student.id} className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {student.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 dark:text-gray-100">{student.name}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Roll: {student.rollNo}</p>
                          </div>
                          <button 
                            onClick={() => handleDownloadStudent(student)}
                            className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                            title="Download student result"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Total:</span>
                            <span className="font-semibold">{student.totalMarks}/{student.maxTotalMarks}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Percentage:</span>
                            <span className="font-semibold text-purple-600 dark:text-purple-400">{student.percentage}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Grade:</span>
                            <span className={`font-semibold ${getGradeColor(student.grade)}`}>{student.grade}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Rank:</span>
                            <span className="font-semibold text-yellow-600 dark:text-yellow-400">#{student.rank}</span>
                          </div>
                        </div>
                      </div>
                    ))}
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

export default ResultCard;
