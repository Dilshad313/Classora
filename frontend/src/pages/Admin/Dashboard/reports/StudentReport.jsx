import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ChevronRight, Search, Printer, User, Calendar, BookOpen, Award, TrendingUp, Mail, Phone, MapPin } from 'lucide-react';

const StudentReport = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const students = [
    { id: 1, name: 'Arun P', rollNo: '001', class: 'Grade 10-A', fatherName: 'Prakash Kumar', dob: '2008-05-15', gender: 'Male', email: 'arun@example.com', phone: '+91 9876543210', address: '123 Main Street, Mumbai', profilePic: 'https://ui-avatars.com/api/?name=Arun+P&background=0D8ABC&color=fff&size=200' },
    { id: 2, name: 'Priya Sharma', rollNo: '002', class: 'Grade 10-A', fatherName: 'Rajesh Sharma', dob: '2008-08-22', gender: 'Female', email: 'priya@example.com', phone: '+91 9876543211', address: '456 Park Avenue, Delhi', profilePic: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=6366F1&color=fff&size=200' },
    { id: 3, name: 'Rahul Kumar', rollNo: '003', class: 'Grade 11-A', fatherName: 'Suresh Kumar', dob: '2007-03-10', gender: 'Male', email: 'rahul@example.com', phone: '+91 9876543212', address: '789 Lake View, Bangalore', profilePic: 'https://ui-avatars.com/api/?name=Rahul+Kumar&background=10B981&color=fff&size=200' },
    { id: 4, name: 'Sneha Reddy', rollNo: '004', class: 'Grade 9-A', fatherName: 'Venkat Reddy', dob: '2009-11-05', gender: 'Female', email: 'sneha@example.com', phone: '+91 9876543213', address: '321 Hill Road, Hyderabad', profilePic: 'https://ui-avatars.com/api/?name=Sneha+Reddy&background=F59E0B&color=fff&size=200' },
    { id: 5, name: 'Vikram Singh', rollNo: '005', class: 'Grade 10-B', fatherName: 'Amarjeet Singh', dob: '2008-07-18', gender: 'Male', email: 'vikram@example.com', phone: '+91 9876543214', address: '654 Garden Street, Pune', profilePic: 'https://ui-avatars.com/api/?name=Vikram+Singh&background=EF4444&color=fff&size=200' }
  ];

  const getStudentPerformance = (studentId) => ({
    subjects: [
      { name: 'Mathematics', score: 92, grade: 'A+', attendance: 95 },
      { name: 'Physics', score: 88, grade: 'A', attendance: 92 },
      { name: 'Chemistry', score: 85, grade: 'A', attendance: 90 },
      { name: 'English', score: 90, grade: 'A+', attendance: 96 },
      { name: 'Biology', score: 87, grade: 'A', attendance: 93 }
    ],
    overall: { average: 88.4, rank: 2, attendance: 93.2, totalTests: 25 },
    recentTests: [
      { date: '2024-11-01', subject: 'Mathematics', test: 'Unit Test 3', score: 95, maxScore: 100 },
      { date: '2024-10-28', subject: 'Physics', test: 'Mid Term', score: 88, maxScore: 100 },
      { date: '2024-10-25', subject: 'Chemistry', test: 'Unit Test 2', score: 82, maxScore: 100 }
    ]
  });

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.class.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm print:hidden">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors font-medium">
            <Home className="w-4 h-4" /><span>Dashboard</span>
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-blue-600 font-semibold">Reports</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 dark:text-gray-100 font-semibold">Student Report</span>
        </div>

        {/* Header */}
        <div className="mb-8 print:hidden">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <span>Student Report</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Search and view comprehensive student reports</p>
        </div>

        {/* Search Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8 print:hidden">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by student name, roll number, or class..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-lg"
            />
          </div>

          {/* Search Results */}
          {searchQuery && (
            <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
              {filteredStudents.length > 0 ? (
                filteredStudents.map(student => (
                  <button
                    key={student.id}
                    onClick={() => { setSelectedStudent(student); setSearchQuery(''); }}
                    className="w-full flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-600 transition-all text-left"
                  >
                    <img src={student.profilePic} alt={student.name} className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{student.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Roll No: {student.rollNo} | Class: {student.class}</p>
                    </div>
                  </button>
                ))
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">No students found</p>
              )}
            </div>
          )}
        </div>

        {/* Student Report */}
        {selectedStudent && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            {/* Print Button */}
            <div className="flex justify-end mb-6 print:hidden">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg"
              >
                <Printer className="w-5 h-5" />
                Print Report
              </button>
            </div>

            {/* Student Header */}
            <div className="flex flex-col md:flex-row gap-6 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
              <img src={selectedStudent.profilePic} alt={selectedStudent.name} className="w-32 h-32 rounded-2xl shadow-lg" />
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{selectedStudent.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <User className="w-4 h-4" />
                    <span>Roll No: <strong className="text-gray-900 dark:text-gray-100">{selectedStudent.rollNo}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <BookOpen className="w-4 h-4" />
                    <span>Class: <strong className="text-gray-900 dark:text-gray-100">{selectedStudent.class}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>DOB: <strong className="text-gray-900 dark:text-gray-100">{selectedStudent.dob}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <User className="w-4 h-4" />
                    <span>Gender: <strong className="text-gray-900 dark:text-gray-100">{selectedStudent.gender}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <User className="w-4 h-4" />
                    <span>Father: <strong className="text-gray-900 dark:text-gray-100">{selectedStudent.fatherName}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Phone className="w-4 h-4" />
                    <span><strong className="text-gray-900 dark:text-gray-100">{selectedStudent.phone}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 md:col-span-2">
                    <Mail className="w-4 h-4" />
                    <span><strong className="text-gray-900 dark:text-gray-100">{selectedStudent.email}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 md:col-span-2">
                    <MapPin className="w-4 h-4" />
                    <span><strong className="text-gray-900 dark:text-gray-100">{selectedStudent.address}</strong></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Overview */}
            {(() => {
              const performance = getStudentPerformance(selectedStudent.id);
              return (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 text-center">
                      <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{performance.overall.average}%</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Overall Average</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 text-center">
                      <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">#{performance.overall.rank}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Class Rank</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 text-center">
                      <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{performance.overall.attendance}%</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Attendance</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 text-center">
                      <BookOpen className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{performance.overall.totalTests}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Tests</p>
                    </div>
                  </div>

                  {/* Subject Performance */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Subject-wise Performance</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-100 dark:bg-gray-700">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Subject</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Score</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Grade</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Attendance</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                          {performance.subjects.map((subject, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                              <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">{subject.name}</td>
                              <td className="px-4 py-3 text-sm font-bold text-blue-600">{subject.score}%</td>
                              <td className="px-4 py-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  subject.grade.startsWith('A') ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                  subject.grade.startsWith('B') ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                }`}>
                                  {subject.grade}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{subject.attendance}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Recent Tests */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Recent Test Results</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-100 dark:bg-gray-700">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Date</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Subject</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Test Name</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Score</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                          {performance.recentTests.map((test, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{test.date}</td>
                              <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">{test.subject}</td>
                              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{test.test}</td>
                              <td className="px-4 py-3 text-sm font-bold text-blue-600">{test.score}/{test.maxScore}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* No Selection Message */}
        {!selectedStudent && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No Student Selected</h3>
            <p className="text-gray-600 dark:text-gray-400">Please search and select a student to view their complete report</p>
          </div>
        )}
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print\\:hidden { display: none !important; }
          .bg-white, .dark\\:bg-gray-800 { background: white !important; }
          .text-gray-900, .dark\\:text-gray-100 { color: black !important; }
          .border-gray-200, .dark\\:border-gray-700 { border-color: #e5e7eb !important; }
        }
      `}</style>
    </div>
  );
};

export default StudentReport;
