import { useState, useEffect } from 'react';
import { 
  IdCard, Download, Search, User, Calendar, MapPin, Phone, Mail, 
  GraduationCap, Award, TrendingUp, BookOpen, Clock, Star,
  FileText, Printer, Eye, Filter, ChevronDown, Users, CheckCircle, XCircle
} from 'lucide-react';
import * as reportApi from '../../../../services/reportApi';
import { classApi } from '../../../../services/classApi';
import toast from 'react-hot-toast';

const StudentReportCard = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoadingStudents(true);
        const [studentsData, classesData] = await Promise.all([
          reportApi.getStudentInfo(),
          classApi.getAllClasses()
        ]);
        if (studentsData.success) {
          setStudents(studentsData.data);
        }
        if (classesData.success) {
          setClasses(classesData.data);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
        toast.error('Failed to load necessary data');
      } finally {
        setLoadingStudents(false);
      }
    };
    fetchInitialData();
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesSearch = searchTerm === '' || 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.includes(searchTerm) ||
      student.admissionNo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = selectedClass === '' || student.class === selectedClass;
    
    return matchesSearch && matchesClass;
  });

  const getGradeColor = (grade) => {
    switch(grade) {
      case 'A+': return 'text-green-600 dark:text-green-400';
      case 'A': return 'text-blue-600 dark:text-blue-400';
      case 'B+': return 'text-yellow-600 dark:text-yellow-400';
      case 'B': return 'text-orange-600 dark:text-orange-400';
      default: return 'text-red-600 dark:text-red-400';
    }
  };

  const calculateOverallGrade = (subjects) => {
    const totalMarks = subjects.reduce((sum, subject) => sum + subject.marks, 0);
    const maxTotalMarks = subjects.reduce((sum, subject) => sum + subject.maxMarks, 0);
    const percentage = (totalMarks / maxTotalMarks) * 100;
    
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    return 'C';
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDownloadPDF = async (student) => {
    setIsLoading(true);
    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a simple PDF-like content
      const reportContent = `
STUDENT REPORT CARD
==================

Student Name: ${student.name}
Roll Number: ${student.rollNo}
Class: ${student.class}
Admission Number: ${student.admissionNo}

ACADEMIC PERFORMANCE:
${student.subjects.map(subject => 
  `${subject.name}: ${subject.marks}/${subject.maxMarks} (${subject.grade})`
).join('\n')}

Total: ${student.subjects.reduce((sum, s) => sum + s.marks, 0)}/${student.subjects.reduce((sum, s) => sum + s.maxMarks, 0)}
Overall Grade: ${calculateOverallGrade(student.subjects)}

ATTENDANCE: ${student.attendance.percentage}%
BEHAVIOR RATING: ${student.behavior.rating}/5

EXTRACURRICULAR ACTIVITIES:
${student.extracurricular.join('\n')}

ACHIEVEMENTS:
${student.achievements.join('\n')}
      `;
      
      // Create and download file
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${student.name}_Report_Card.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showNotification(`Report card for ${student.name} downloaded successfully!`);
    } catch (error) {
      showNotification('Failed to download report card', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = (student) => {
    const printContent = `
      <html>
        <head>
          <title>Report Card - ${student.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .student-info { margin-bottom: 20px; }
            .subjects-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .subjects-table th, .subjects-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .subjects-table th { background-color: #f2f2f2; }
            .section { margin: 20px 0; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>STUDENT REPORT CARD</h1>
            <p>Academic Session 2023-2024</p>
          </div>
          
          <div class="student-info">
            <h2>${student.name}</h2>
            <p><strong>Roll Number:</strong> ${student.rollNo}</p>
            <p><strong>Class:</strong> ${student.class}</p>
            <p><strong>Admission Number:</strong> ${student.admissionNo}</p>
          </div>
          
          <div class="section">
            <h3>Academic Performance</h3>
            <table class="subjects-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Marks Obtained</th>
                  <th>Max Marks</th>
                  <th>Percentage</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                ${student.subjects.map(subject => `
                  <tr>
                    <td>${subject.name}</td>
                    <td>${subject.marks}</td>
                    <td>${subject.maxMarks}</td>
                    <td>${((subject.marks / subject.maxMarks) * 100).toFixed(1)}%</td>
                    <td>${subject.grade}</td>
                  </tr>
                `).join('')}
                <tr style="background-color: #f9f9f9; font-weight: bold;">
                  <td>TOTAL</td>
                  <td>${student.subjects.reduce((sum, s) => sum + s.marks, 0)}</td>
                  <td>${student.subjects.reduce((sum, s) => sum + s.maxMarks, 0)}</td>
                  <td>${((student.subjects.reduce((sum, s) => sum + s.marks, 0) / student.subjects.reduce((sum, s) => sum + s.maxMarks, 0)) * 100).toFixed(1)}%</td>
                  <td>${calculateOverallGrade(student.subjects)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="section">
            <h3>Attendance Record</h3>
            <p><strong>Present:</strong> ${student.attendance.present} days</p>
            <p><strong>Total:</strong> ${student.attendance.total} days</p>
            <p><strong>Percentage:</strong> ${student.attendance.percentage}%</p>
          </div>
          
          <div class="section">
            <h3>Extracurricular Activities</h3>
            <ul>
              ${student.extracurricular.map(activity => `<li>${activity}</li>`).join('')}
            </ul>
          </div>
          
          <div class="section">
            <h3>Achievements</h3>
            <ul>
              ${student.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
            </ul>
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
    
    showNotification(`Report card for ${student.name} sent to printer!`);
  };

  const handleDownloadAll = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const allReportsContent = filteredStudents.map(student => `
=== REPORT CARD: ${student.name} ===
Roll: ${student.rollNo} | Class: ${student.class}
Overall Grade: ${calculateOverallGrade(student.subjects)}
Attendance: ${student.attendance.percentage}%
${'='.repeat(50)}
      `).join('\n');
      
      const blob = new Blob([allReportsContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `All_Report_Cards_${selectedClass || 'All_Classes'}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showNotification(`All report cards downloaded successfully! (${filteredStudents.length} students)`);
    } catch (error) {
      showNotification('Failed to download all report cards', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedClass('');
    setSelectedTerm('');
    showNotification('Filters cleared successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Students Report Card</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Generate comprehensive student report cards</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center gap-2"
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>
          <button 
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleDownloadAll}
            disabled={isLoading || filteredStudents.length === 0}
          >
            <Download className="w-5 h-5" />
            {isLoading ? 'Downloading...' : `Download All (${filteredStudents.length})`}
          </button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name, roll number, or admission number..." 
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
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
          >
            <option value="">Select Term</option>
            <option value="first">First Term</option>
            <option value="second">Second Term</option>
            <option value="final">Final Term</option>
          </select>
        </div>
        
        {/* Filter Actions */}
        {(searchTerm || selectedClass || selectedTerm) && (
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

      {/* Student List */}
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
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{student.attendance.percentage}%</p>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Overall Grade</p>
                  <p className={`text-lg font-bold ${getGradeColor(calculateOverallGrade(student.subjects))}`}>
                    {calculateOverallGrade(student.subjects)}
                  </p>
                </div>
              </div>
              
              <button className="w-full btn-primary flex items-center justify-center gap-2">
                <Eye className="w-4 h-4" />
                View Report Card
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* Detailed Report Card View */
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
                onClick={() => handlePrint(selectedStudent)}
                disabled={isLoading}
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button 
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handleDownloadPDF(selectedStudent)}
                disabled={isLoading}
              >
                <Download className="w-4 h-4" />
                {isLoading ? 'Generating...' : 'Download PDF'}
              </button>
            </div>
          </div>

          {/* Report Card Header */}
          <div className="card bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-2 border-primary-200 dark:border-primary-800">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">STUDENT REPORT CARD</h2>
              <p className="text-gray-600 dark:text-gray-400">Academic Session 2023-2024</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Personal Details */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Full Name</p>
                      <p className="font-semibold text-gray-800 dark:text-gray-100">{selectedStudent.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Roll Number</p>
                      <p className="font-semibold text-gray-800 dark:text-gray-100">{selectedStudent.rollNo}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Admission Number</p>
                      <p className="font-semibold text-gray-800 dark:text-gray-100">{selectedStudent.admissionNo}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Date of Birth</p>
                      <p className="font-semibold text-gray-800 dark:text-gray-100">{selectedStudent.dateOfBirth}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Gender</p>
                      <p className="font-semibold text-gray-800 dark:text-gray-100">{selectedStudent.gender}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Blood Group</p>
                      <p className="font-semibold text-gray-800 dark:text-gray-100">{selectedStudent.bloodGroup}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Details */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Address</p>
                      <p className="font-semibold text-gray-800 dark:text-gray-100">{selectedStudent.address}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Student Phone</p>
                        <p className="font-semibold text-gray-800 dark:text-gray-100">{selectedStudent.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                        <p className="font-semibold text-gray-800 dark:text-gray-100">{selectedStudent.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Parent/Guardian</p>
                        <p className="font-semibold text-gray-800 dark:text-gray-100">{selectedStudent.parentName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Parent Phone</p>
                        <p className="font-semibold text-gray-800 dark:text-gray-100">{selectedStudent.parentPhone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Student Photo & Class Details */}
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-4xl mx-auto mb-4">
                    {selectedStudent.name.charAt(0)}
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 dark:text-gray-100">{selectedStudent.name}</h4>
                  <p className="text-gray-600 dark:text-gray-400">Class {selectedStudent.class}</p>
                </div>

                <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                  <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    Class Details
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Class</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-100">{selectedStudent.class}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Section</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-100">{selectedStudent.section}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Academic Year</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-100">2023-2024</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Performance */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              Academic Performance
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold text-gray-800 dark:text-gray-100">Subject</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-800 dark:text-gray-100">Teacher</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-800 dark:text-gray-100">Marks Obtained</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-800 dark:text-gray-100">Max Marks</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-800 dark:text-gray-100">Percentage</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-800 dark:text-gray-100">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedStudent.subjects.map((subject, index) => (
                    <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-4 px-4 font-medium text-gray-800 dark:text-gray-100">{subject.name}</td>
                      <td className="py-4 px-4 text-center text-gray-600 dark:text-gray-400">{subject.teacher}</td>
                      <td className="py-4 px-4 text-center font-semibold text-gray-800 dark:text-gray-100">{subject.marks}</td>
                      <td className="py-4 px-4 text-center text-gray-600 dark:text-gray-400">{subject.maxMarks}</td>
                      <td className="py-4 px-4 text-center font-semibold text-primary-600 dark:text-primary-400">
                        {((subject.marks / subject.maxMarks) * 100).toFixed(1)}%
                      </td>
                      <td className={`py-4 px-4 text-center font-bold ${getGradeColor(subject.grade)}`}>
                        {subject.grade}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 dark:bg-gray-700/50 border-t-2 border-gray-200 dark:border-gray-600">
                    <td className="py-4 px-4 font-bold text-gray-800 dark:text-gray-100">TOTAL</td>
                    <td className="py-4 px-4"></td>
                    <td className="py-4 px-4 text-center font-bold text-gray-800 dark:text-gray-100">
                      {selectedStudent.subjects.reduce((sum, subject) => sum + subject.marks, 0)}
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-gray-800 dark:text-gray-100">
                      {selectedStudent.subjects.reduce((sum, subject) => sum + subject.maxMarks, 0)}
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-primary-600 dark:text-primary-400">
                      {(
                        (selectedStudent.subjects.reduce((sum, subject) => sum + subject.marks, 0) /
                        selectedStudent.subjects.reduce((sum, subject) => sum + subject.maxMarks, 0)) * 100
                      ).toFixed(1)}%
                    </td>
                    <td className={`py-4 px-4 text-center font-bold ${getGradeColor(calculateOverallGrade(selectedStudent.subjects))}`}>
                      {calculateOverallGrade(selectedStudent.subjects)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Attendance */}
            <div className="card">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Attendance Record
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Days Present</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{selectedStudent.attendance.present}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Days</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{selectedStudent.attendance.total}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Percentage</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{selectedStudent.attendance.percentage}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Behavior & Skills */}
            <div className="card">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Behavior & Skills
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Overall Rating:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star 
                        key={star} 
                        className={`w-5 h-5 ${star <= selectedStudent.behavior.rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`} 
                      />
                    ))}
                    <span className="ml-2 font-bold text-gray-800 dark:text-gray-100">{selectedStudent.behavior.rating}/5</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Teacher's Remarks:</p>
                  <p className="text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    {selectedStudent.behavior.remarks}
                  </p>
                </div>
              </div>
            </div>

            {/* Extracurricular Activities */}
            <div className="card">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5" />
                Extracurricular Activities
              </h3>
              <div className="space-y-2">
                {selectedStudent.extracurricular.map((activity, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <span className="text-gray-800 dark:text-gray-100">{activity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="card">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Achievements & Awards
              </h3>
              <div className="space-y-2">
                {selectedStudent.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <Award className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-gray-800 dark:text-gray-100">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentReportCard;
