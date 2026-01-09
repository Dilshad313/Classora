import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award,
  Home,
  ChevronRight,
  FileText,
  Download,
  Printer,
  Search,
  Users,
  Building2,
  GraduationCap,
  Loader2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import * as resultCardsAPI from '../../../../services/resultCardsApi.js';
import * as examAPI from '../../../../services/examsApi.js';
import * as studentAPI from '../../../../services/studentApi.js';
import * as classAPI from '../../../../services/classApi.js'; // Import class API

const ResultCard = () => {
  const navigate = useNavigate();
  const resultCardRef = useRef(null);

  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);
  const [allClasses, setAllClasses] = useState([]); // Store all classes
  const [classFilteredStudents, setClassFilteredStudents] = useState([]); // Store students filtered by class
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [generatedResult, setGeneratedResult] = useState(null);

  // State for filters
  const [filters, setFilters] = useState({
    resultType: 'school',
    selectedExam: '',
    selectedClass: '',
    selectedStudentId: ''
  });

  // Fetch dropdown data on component mount
  useEffect(() => {
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    setLoading(true);
    try {
      // Fetch exams
      const examsResult = await examAPI.getExamDropdown();
      if (examsResult.success) {
        setExams(examsResult.data);
      }

      // Fetch all students
      const studentsResult = await studentAPI.getStudents({ limit: 1000 }); // Use large number instead of 0
      const students = Array.isArray(studentsResult) ? studentsResult : studentsResult?.data?.students || studentsResult?.data || [];
      setStudents(students);

      // Fetch all classes
      const classesResult = await classAPI.getAllClasses();
      if (classesResult.success) {
        setAllClasses(classesResult.data);
      }
    } catch (error) {
      toast.error('Failed to load data');
      console.error('Fetch dropdown error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      selectedStudentId: (key === 'selectedClass' || key === 'resultType') ? '' : prev.selectedStudentId
    }));

    setSelectedStudent(null);
    setGeneratedResult(null);
  };

  // Handler for class selection change (class-wise mode)
  const handleClassChange = (e) => {
    const selectedClassValue = e.target.value;
    setFilters(prev => ({
      ...prev,
      selectedClass: selectedClassValue,
      selectedStudentId: '' // Clear selected student when class changes
    }));

    setSelectedStudent(null);
    setGeneratedResult(null);

    // Filter students by the selected class
    if (selectedClassValue) {
      // Fetch students for the selected class
      fetchStudentsByClass(selectedClassValue);
    } else {
      setClassFilteredStudents([]);
    }
  };

  // Update classFilteredStudents when filters change
  useEffect(() => {
    if (filters.resultType === 'class' && filters.selectedClass) {
      if (!classFilteredStudents.length) { // Avoid re-fetching if already populated
        fetchStudentsByClass(filters.selectedClass);
      }
    } else {
      setClassFilteredStudents([]);
    }
  }, [filters.resultType, filters.selectedClass, students]);

  const handleStudentChange = (e) => {
    const selectedStudentId = e.target.value;
    setFilters(prev => ({
      ...prev,
      selectedStudentId: selectedStudentId
    }));

    if (selectedStudentId) {
      let student;
      if (filters.resultType === 'class' && filters.selectedClass) {
        student = classFilteredStudents.find(s => s._id === selectedStudentId);
      } else {
        student = students.find(s => s._id === selectedStudentId);
      }
      
      console.log('👤 Selected student:', student);
      setSelectedStudent(student);
      setGeneratedResult(null);
    } else {
      setSelectedStudent(null);
      setGeneratedResult(null);
    }
  };

  const handleGenerateResult = async () => {
    if (!filters.selectedExam) {
      toast.error('Please select an exam');
      return;
    }

    if (!filters.selectedStudentId) {
      toast.error('Please select a student');
      return;
    }

    if (!selectedStudent) {
      toast.error('Student data not available');
      return;
    }

    setGenerating(true);
    try {
      console.log('🎯 Generating result card:', {
        studentId: filters.selectedStudentId,
        examId: filters.selectedExam,
        studentName: selectedStudent.studentName
      });
      
      const result = await resultCardsAPI.generateResultCard(filters.selectedStudentId, filters.selectedExam);
      console.log('📊 Result card response:', result);
      
      if (result.success) {
        setGeneratedResult(result.data);
        toast.success('Result card generated successfully!');

        // Scroll to result card
        setTimeout(() => {
          resultCardRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        toast.error(result.message || 'Failed to generate result card');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred while generating result card';
      toast.error(errorMessage, {
        style: {
          background: '#1f2937',
          color: '#f87171',
          border: '1px solid #991b1b'
        }
      });
      console.error('Generate result error:', error);
    } finally {
      setGenerating(false);
    }
  };

  const fetchStudentsByClass = async (className) => {
    if (!className) {
      setClassFilteredStudents([]);
      return;
    }
    setLoading(true);
    try {
      // Extract grade number from class name (e.g., "Grade 1" -> "1")
      const gradeMatch = className.match(/\d+/);
      const gradeNumber = gradeMatch ? gradeMatch[0] : className;
      
      console.log(`📥 Fetching students for class: ${className} (grade: ${gradeNumber})`);
      
      const result = await studentAPI.getStudents({ class: gradeNumber, limit: 1000 });
      const students = Array.isArray(result) ? result : result?.data?.students || result?.data || [];
      
      console.log(`✅ Found ${students.length} students for class ${className}`);
      
      setClassFilteredStudents(students);
      
      if (students.length === 0) {
        toast.warning(`No students found in ${className}. Please check if students are assigned to this class.`);
      }
    } catch (error) {
      toast.error('An error occurred while fetching students');
      console.error('Fetch students by class error:', error);
      setClassFilteredStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real app, you would generate and download a PDF
    toast.success('PDF download would be initiated here');
  };

  const calculateGrade = (percentage) => {
    if (percentage >= 90) return { grade: 'A+', remarks: 'Outstanding' };
    if (percentage >= 80) return { grade: 'A', remarks: 'Excellent' };
    if (percentage >= 70) return { grade: 'B+', remarks: 'Very Good' };
    if (percentage >= 60) return { grade: 'B', remarks: 'Good' };
    if (percentage >= 50) return { grade: 'C', remarks: 'Average' };
    if (percentage >= 40) return { grade: 'D', remarks: 'Pass' };
    return { grade: 'F', remarks: 'Fail' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm print:hidden">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span className="text-blue-600 dark:text-blue-400 font-semibold">Exams</span>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span className="text-gray-900 dark:text-gray-100 font-semibold">Result Card</span>
        </div>

        {/* Header */}
        <div className="mb-8 print:hidden">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
            <span>Generate Result Card</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Generate and download student result cards</p>
        </div>

        {/* Selection Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-8 print:hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
              <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <span>Result Generation Options</span>
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Select the type and details for result generation</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Result Type Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Select Result Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => handleFilterChange('resultType', 'school')}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    filters.resultType === 'school'
                      ? 'border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-gray-800'
                      : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      filters.resultType === 'school'
                        ? 'bg-gradient-to-br from-purple-500 to-pink-600'
                        : 'bg-gray-100 dark:bg-gray-700'
                    }`}>
                      <Building2 className={`w-6 h-6 ${filters.resultType === 'school' ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-gray-100">School-wise</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Generate for any student in school</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleFilterChange('resultType', 'class')}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    filters.resultType === 'class'
                      ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-gray-800'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      filters.resultType === 'class'
                        ? 'bg-gradient-to-br from-blue-500 to-cyan-600'
                        : 'bg-gray-100 dark:bg-gray-700'
                    }`}>
                      <Users className={`w-6 h-6 ${filters.resultType === 'class' ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-gray-100">Class-wise</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Generate for students in a class</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Selection Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Select Exam */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Select Exam <span className="text-red-500">*</span>
                </label>
                <select
                  value={filters.selectedExam}
                  onChange={(e) => handleFilterChange('selectedExam', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all"
                  disabled={loading}
                >
                  <option value="">Choose Exam...</option>
                  {exams.map(exam => (
                    <option key={exam._id} value={exam._id}>{exam.label}</option>
                  ))}
                </select>
              </div>

              {/* Select Class (only for class-wise) */}
              {filters.resultType === 'class' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Select Class <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={filters.selectedClass}
                    onChange={handleClassChange}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all"
                    disabled={loading}
                  >
                    <option value="">Choose Class...</option>
                    {allClasses.map(cls => (
                      <option key={cls._id} value={cls.className}>
                        {cls.className}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Select Student */}
              <div className={filters.resultType === 'school' ? 'md:col-span-2' : ''}>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Select Student <span className="text-red-500">*</span>
                </label>
                <select
                  value={filters.selectedStudentId}
                  onChange={handleStudentChange}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all"
                  disabled={loading || (!filters.selectedClass && filters.resultType === 'class')}
                >
                  <option value="">Choose Student...</option>
                  {(filters.resultType === 'class' && filters.selectedClass ? classFilteredStudents : students).map(student => (
                    <option key={student._id} value={student._id}>
                      {student.studentName} (Reg: {student.registrationNo})
                    </option>
                  ))}
                </select>
                {selectedStudent && (
                  <p className="mt-2 text-sm text-green-600 dark:text-green-400 font-semibold">
                    ✓ Selected: {selectedStudent.studentName} (Reg No: {selectedStudent.registrationNo})
                  </p>
                )}
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex justify-center pt-4">
              <button
                onClick={handleGenerateResult}
                disabled={generating || !filters.selectedExam || !selectedStudent}
                className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-700 hover:from-purple-700 hover:to-pink-800 dark:from-purple-700 dark:to-pink-800 dark:hover:from-purple-600 dark:hover:to-pink-700 text-white rounded-xl transition-all shadow-lg hover:shadow-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generating ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <GraduationCap className="w-6 h-6" />
                )}
                <span>{generating ? 'Generating...' : 'Generate Result Card'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Generated Result Card */}
        {generatedResult && (
          <div ref={resultCardRef} className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-300 dark:border-gray-700 overflow-hidden">
            {/* Action Buttons */}
            <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex justify-end space-x-3 print:hidden">
              <button
                onClick={handlePrint}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-semibold"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all font-semibold"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>

            {/* Result Card Content */}
            <div className="p-8">
              {/* School Header */}
              <div className="text-center mb-8 border-b-2 border-gray-300 dark:border-gray-600 pb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Classora School</h1>
                <p className="text-gray-600 dark:text-gray-400">123 Education Street, Knowledge City - 123456</p>
                <p className="text-gray-600 dark:text-gray-400">Phone: +91 1234567890 | Email: info@classora.edu</p>
                <div className="mt-4 inline-block px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold text-lg">
                  STUDENT RESULT CARD
                </div>
              </div>

              {/* Student Information */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="space-y-3">
                  <div className="flex">
                    <span className="font-semibold text-gray-700 dark:text-gray-300 w-40">Student Name:</span>
                    <span className="text-gray-900 dark:text-gray-100">{generatedResult.studentInfo?.studentName || generatedResult.student?.studentName}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 dark:text-gray-300 w-40">Father's Name:</span>
                    <span className="text-gray-900 dark:text-gray-100">{generatedResult.studentInfo?.fatherName || generatedResult.student?.fatherName}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 dark:text-gray-700 w-40">Registration No:</span>
                    <span className="text-gray-900 dark:text-gray-900">{generatedResult.studentInfo?.registrationNo || generatedResult.student?.registrationNo}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex">
                    <span className="font-semibold text-gray-700 dark:text-gray-300 w-40">Roll Number:</span>
                    <span className="text-gray-900 dark:text-gray-100">{generatedResult.studentInfo?.rollNumber || generatedResult.student?.rollNumber}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 dark:text-gray-300 w-40">Class:</span>
                    <span className="text-gray-900 dark:text-gray-100">
                      {generatedResult.classInfo?.className || generatedResult.class?.className}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 dark:text-gray-300 w-40">Date of Birth:</span>
                    <span className="text-gray-900 dark:text-gray-100">
                      {new Date(generatedResult.studentInfo?.dateOfBirth || generatedResult.student?.dateOfBirth).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between">
                  <div className="flex">
                    <span className="font-semibold text-gray-700 dark:text-gray-300 w-40">Examination:</span>
                    <span className="text-gray-900 dark:text-gray-100">{generatedResult.examInfo?.examName || generatedResult.exam?.examName}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 dark:text-gray-300 w-40">Date of Issue:</span>
                    <span className="text-gray-900 dark:text-gray-100">
                      {new Date(generatedResult.generatedDate).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Marks Table */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 p-3 rounded-lg">
                  Academic Performance
                </h3>
                <table className="w-full border-2 border-gray-300 dark:border-gray-600">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left">Subject</th>
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-center">Marks Obtained</th>
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-center">Total Marks</th>
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-center">Percentage</th>
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-center">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {generatedResult.subjects.map((subject, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">{subject.subjectName}</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-center text-gray-900 dark:text-gray-100">{subject.marksObtained}</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-center text-gray-900 dark:text-gray-100">{subject.maxMarks}</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-center text-gray-900 dark:text-gray-100">{subject.percentage}%</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-center">
                          <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full font-bold">
                            {subject.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 font-bold">
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-900 dark:text-gray-100">TOTAL</td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-center text-lg text-gray-900 dark:text-gray-100">{generatedResult.totalObtained}</td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-center text-lg text-gray-900 dark:text-gray-100">{generatedResult.totalMaxMarks}</td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-center text-lg text-gray-900 dark:text-gray-100">{generatedResult.overallPercentage}%</td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-center">
                        <span className="inline-block px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold text-lg">
                          {generatedResult.overallGrade}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Grade Scale */}
              <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-3">Grading Scale:</h4>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-sm">
                  <div className="text-center p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                    <span className="font-bold">A+</span>: 90-100%
                  </div>
                  <div className="text-center p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                    <span className="font-bold">A</span>: 80-89%
                  </div>
                  <div className="text-center p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                    <span className="font-bold">B+</span>: 70-79%
                  </div>
                  <div className="text-center p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                    <span className="font-bold">B</span>: 60-69%
                  </div>
                  <div className="text-center p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                    <span className="font-bold">C</span>: 50-59%
                  </div>
                  <div className="text-center p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                    <span className="font-bold">D</span>: 40-49%
                  </div>
                </div>
              </div>

              {/* Result Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900 rounded-lg border-2 border-green-200 dark:border-green-700">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Overall Result</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-400">{generatedResult.resultStatus}</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900 dark:to-cyan-900 rounded-lg border-2 border-blue-200 dark:border-blue-700">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Remarks</p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{generatedResult.overallRemarks}</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 rounded-lg border-2 border-purple-200 dark:border-purple-700">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Overall Percentage</p>
                  <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">{generatedResult.overallPercentage}%</p>
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t-2 border-gray-300 dark:border-gray-600">
                <div className="text-center">
                  <div className="h-16 mb-2 border-b-2 border-gray-400 dark:border-gray-500"></div>
                  <div className="pt-2">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">Class Teacher</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="h-16 mb-2 border-b-2 border-gray-400 dark:border-gray-500"></div>
                  <div className="pt-2">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">Principal</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="h-16 mb-2 border-b-2 border-gray-400 dark:border-gray-500"></div>
                  <div className="pt-2">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">Parent's Signature</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!generatedResult && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 text-center print:hidden">
            <Award className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No Result Generated Yet</h3>
            <p className="text-gray-500 dark:text-gray-400">Select the options above and click "Generate Result Card" to view the result</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultCard;