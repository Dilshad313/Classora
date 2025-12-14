import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, ChevronRight, Search, Printer, User, Calendar, BookOpen, 
  Award, TrendingUp, Mail, Phone, MapPin, Loader2, Download,
  FileText, FileSpreadsheet
} from 'lucide-react';
import { 
  searchStudentsForReport, 
  getStudentReport,
  exportStudentInfoCSV,
  exportStudentInfoExcel 
} from '../../../../services/reportApi';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const StudentReport = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    if (searchQuery.trim()) {
      const delaySearch = setTimeout(() => {
        performSearch();
      }, 300);
      return () => clearTimeout(delaySearch);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const performSearch = async () => {
    try {
      setSearchLoading(true);
      const results = await searchStudentsForReport(searchQuery);
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Error searching students:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSelectStudent = async (student) => {
    try {
      setLoading(true);
      const report = await getStudentReport(student.id);
      setReportData(report);
      setSelectedStudent(student);
      setSearchQuery('');
      setSearchResults([]);
      setShowSearchResults(false);
    } catch (error) {
      console.error('Error fetching student report:', error);
      alert(error.message || 'Failed to load student report');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    if (!selectedStudent) return;
    try {
      await exportStudentInfoCSV({
        search: selectedStudent.name,
        class: selectedStudent.class
      });
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert(error.message || 'Failed to export CSV');
    }
  };

  const handleExportExcel = async () => {
    if (!selectedStudent) return;
    try {
      await exportStudentInfoExcel({
        search: selectedStudent.name,
        class: selectedStudent.class
      });
    } catch (error) {
      console.error('Error exporting Excel:', error);
      alert(error.message || 'Failed to export Excel');
    }
  };

  const exportToPDF = () => {
    if (!reportData) return;

    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(18);
    doc.text('Student Detailed Report', 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Student Information
    doc.setFontSize(14);
    doc.text('Student Information', 14, 45);
    doc.setFontSize(10);
    doc.text(`Name: ${reportData.student.name}`, 14, 55);
    doc.text(`Roll No: ${reportData.student.rollNo}`, 14, 60);
    doc.text(`Class: ${reportData.student.class}`, 14, 65);
    doc.text(`Father: ${reportData.student.fatherName}`, 14, 70);
    doc.text(`DOB: ${reportData.student.dob}`, 14, 75);
    doc.text(`Gender: ${reportData.student.gender}`, 14, 80);
    doc.text(`Phone: ${reportData.student.phone}`, 14, 85);
    
    // Performance Overview
    doc.setFontSize(14);
    doc.text('Performance Overview', 14, 100);
    doc.setFontSize(10);
    doc.text(`Overall Average: ${reportData.performance.overall.average}%`, 14, 110);
    doc.text(`Class Rank: #${reportData.performance.overall.rank}`, 14, 115);
    doc.text(`Attendance: ${reportData.performance.overall.attendance}%`, 14, 120);
    doc.text(`Total Tests: ${reportData.performance.overall.totalTests}`, 14, 125);
    
    // Subject-wise Performance
    doc.setFontSize(14);
    doc.text('Subject-wise Performance', 14, 140);
    
    const subjectHeaders = [['Subject', 'Score (%)', 'Grade', 'Attendance (%)']];
    const subjectData = reportData.performance.subjects.map(subject => [
      subject.name,
      subject.score.toFixed(1),
      subject.grade,
      subject.attendance.toFixed(1)
    ]);
    
    doc.autoTable({
      head: subjectHeaders,
      body: subjectData,
      startY: 145,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [59, 130, 246] },
      alternateRowStyles: { fillColor: [240, 240, 240] }
    });
    
    // Recent Tests
    if (reportData.performance.recentTests && reportData.performance.recentTests.length > 0) {
      const testY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(14);
      doc.text('Recent Test Results', 14, testY);
      
      const testHeaders = [['Date', 'Subject', 'Test', 'Score']];
      const testData = reportData.performance.recentTests.map(test => [
        test.date,
        test.subject,
        test.test,
        `${test.score}/${test.maxScore}`
      ]);
      
      doc.autoTable({
        head: testHeaders,
        body: testData,
        startY: testY + 5,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [16, 185, 129] },
        alternateRowStyles: { fillColor: [240, 240, 240] }
      });
    }
    
    // Save PDF
    doc.save(`${reportData.student.name}_report.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  const calculateGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    if (grade.startsWith('D')) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  const clearSelection = () => {
    setSelectedStudent(null);
    setReportData(null);
    setSearchQuery('');
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
              onFocus={() => setShowSearchResults(true)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-lg"
            />
            {searchLoading && (
              <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
            )}
          </div>

          {/* Search Results */}
          {showSearchResults && searchQuery && searchResults.length > 0 && (
            <div className="mt-4 space-y-2 max-h-64 overflow-y-auto bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
              {searchResults.map(student => (
                <button
                  key={student.id}
                  onClick={() => handleSelectStudent(student)}
                  className="w-full flex items-center gap-4 p-3 bg-white dark:bg-gray-600 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-500 transition-all text-left"
                >
                  <img 
                    src={student.profilePic} 
                    alt={student.name} 
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=0D8ABC&color=fff&size=100`;
                    }}
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{student.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Roll No: {student.rollNo} | Class: {student.class}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
          
          {showSearchResults && searchQuery && searchResults.length === 0 && !searchLoading && (
            <div className="mt-4 text-center text-gray-500 dark:text-gray-400 py-4">
              No students found
            </div>
          )}
        </div>

        {/* Student Report */}
        {selectedStudent && reportData ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            {/* Print Button */}
            <div className="flex flex-wrap justify-between items-center mb-6 print:hidden">
              <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg"
                >
                  <FileText className="w-5 h-5" />
                  CSV
                </button>
                <button
                  onClick={handleExportExcel}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all shadow-lg"
                >
                  <FileSpreadsheet className="w-5 h-5" />
                  Excel
                </button>
                <button
                  onClick={exportToPDF}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all shadow-lg"
                >
                  <Download className="w-5 h-5" />
                  PDF
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all shadow-lg"
                >
                  <Printer className="w-5 h-5" />
                  Print Report
                </button>
              </div>
              <button
                onClick={clearSelection}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              >
                Clear Selection
              </button>
            </div>

            {/* Student Header */}
            <div className="flex flex-col md:flex-row gap-6 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
              <div className="flex-shrink-0">
                <img 
                  src={reportData.student.profilePic} 
                  alt={reportData.student.name} 
                  className="w-32 h-32 rounded-2xl shadow-lg object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(reportData.student.name)}&background=0D8ABC&color=fff&size=256`;
                  }}
                />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{reportData.student.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <User className="w-4 h-4" />
                    <span>Roll No: <strong className="text-gray-900 dark:text-gray-100">{reportData.student.rollNo}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <BookOpen className="w-4 h-4" />
                    <span>Class: <strong className="text-gray-900 dark:text-gray-100">{reportData.student.class}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>DOB: <strong className="text-gray-900 dark:text-gray-100">{reportData.student.dob}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <User className="w-4 h-4" />
                    <span>Gender: <strong className="text-gray-900 dark:text-gray-100">{reportData.student.gender}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <User className="w-4 h-4" />
                    <span>Father: <strong className="text-gray-900 dark:text-gray-100">{reportData.student.fatherName}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Phone className="w-4 h-4" />
                    <span><strong className="text-gray-900 dark:text-gray-100">{reportData.student.phone}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 md:col-span-2">
                    <Mail className="w-4 h-4" />
                    <span><strong className="text-gray-900 dark:text-gray-100">{reportData.student.email}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 md:col-span-2">
                    <MapPin className="w-4 h-4" />
                    <span><strong className="text-gray-900 dark:text-gray-100">{reportData.student.address}</strong></span>
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                {/* Performance Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 text-center">
                    <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{reportData.performance.overall.average}%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Overall Average</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 text-center">
                    <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">#{reportData.performance.overall.rank}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Class Rank</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 text-center">
                    <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{reportData.performance.overall.attendance}%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Attendance</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 text-center">
                    <BookOpen className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{reportData.performance.overall.totalTests}</p>
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
                        {reportData.performance.subjects.map((subject, idx) => (
                          <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">{subject.name}</td>
                            <td className="px-4 py-3 text-sm font-bold text-blue-600">{subject.score.toFixed(1)}%</td>
                            <td className="px-4 py-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${calculateGradeColor(subject.grade)}`}>
                                {subject.grade}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{subject.attendance.toFixed(1)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Recent Tests */}
                {reportData.performance.recentTests && reportData.performance.recentTests.length > 0 && (
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
                          {reportData.performance.recentTests.map((test, idx) => (
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
                )}
              </>
            )}
          </div>
        ) : selectedStudent && loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          /* No Selection Message */
          !selectedStudent && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No Student Selected</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Please search and select a student to view their complete report</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">Tip: Try searching by name, roll number, or class</p>
            </div>
          )
        )}
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print\\:hidden { display: none !important; }
          .bg-white, .dark\\:bg-gray-800 { background: white !important; }
          .text-gray-900, .dark\\:text-gray-100 { color: black !important; }
          .text-gray-600, .dark\\:text-gray-400 { color: #4b5563 !important; }
          .border-gray-200, .dark\\:border-gray-700 { border-color: #e5e7eb !important; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 8px; text-align: left; border-bottom: 1px solid #e5e7eb; }
          thead { background-color: #f3f4f6 !important; }
          tr:nth-child(even) { background-color: #f9fafb !important; }
        }
      `}</style>
    </div>
  );
};

export default StudentReport;