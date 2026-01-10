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
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
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
        // Filter out null/undefined exams and ensure each exam has required properties
        const filteredExams = Array.isArray(examsResult.data)
          ? examsResult.data.filter(exam => exam && exam._id && typeof exam._id === 'string' && exam.label)
          : [];
        setExams(filteredExams);
      }

      // Fetch all students
      const studentsResult = await studentAPI.getStudents({ limit: 1000 }); // Use large number instead of 0
      const students = Array.isArray(studentsResult) ? studentsResult : studentsResult?.data?.students || studentsResult?.data || [];
      const filteredStudents = Array.isArray(students) ? students.filter(student => student && student._id && typeof student._id === 'string' && student.studentName) : [];
      setStudents(filteredStudents);

      // Fetch all classes
      const classesResult = await classAPI.getAllClasses();
      if (classesResult.success) {
        const filteredClasses = Array.isArray(classesResult.data)
          ? classesResult.data.filter(cls => cls && cls._id && typeof cls._id === 'string' && cls.className)
          : [];
        setAllClasses(filteredClasses);
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
      if (!(classFilteredStudents && classFilteredStudents.length > 0)) { // Avoid re-fetching if already populated
        fetchStudentsByClass(filters.selectedClass);
      }
    } else {
      setClassFilteredStudents([]);
    }
  }, [filters.resultType, filters.selectedClass]);

  const handleStudentChange = (e) => {
    const selectedStudentId = e.target.value;
    setFilters(prev => ({
      ...prev,
      selectedStudentId: selectedStudentId
    }));

    if (selectedStudentId) {
      let student;
      if (filters.resultType === 'class' && filters.selectedClass) {
        student = (classFilteredStudents || []).find(s => s && s._id && typeof s._id === 'string' && s._id === selectedStudentId);
      } else {
        student = (students || []).find(s => s && s._id && typeof s._id === 'string' && s._id === selectedStudentId);
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

    // Validate that the IDs are valid strings before making the API call
    if (!filters.selectedStudentId || typeof filters.selectedStudentId !== 'string' || !filters.selectedStudentId.trim()) {
      toast.error('Invalid student ID');
      return;
    }

    if (!filters.selectedExam || typeof filters.selectedExam !== 'string' || !filters.selectedExam.trim()) {
      toast.error('Invalid exam ID');
      return;
    }

    setGenerating(true);
    try {
      console.log('🎯 Generating result card:', {
        studentId: filters.selectedStudentId,
        examId: filters.selectedExam,
        studentName: selectedStudent.studentName,
        resultType: filters.resultType,
        selectedClass: filters.selectedClass
      });

      const result = await resultCardsAPI.generateResultCard(filters.selectedStudentId, filters.selectedExam);
      console.log('📊 Result card response:', result);
      
      if (result.success) {
        // Handle the populated result card data
        const resultData = result.data;

        // Validate that required populated fields exist
        if (!resultData) {
          toast.error('Invalid result data received');
          return;
        }

        // Check for null populated references and handle gracefully
        if (!resultData.student && !resultData.studentInfo) {
          toast.error('Student data is missing from result card');
          return;
        }

        if (!resultData.exam && !resultData.examInfo) {
          toast.error('Exam data is missing from result card');
          return;
        }

        if (!resultData.class && !resultData.classInfo) {
          toast.error('Class data is missing from result card');
          return;
        }

        if (!resultData.institute && !resultData.instituteInfo) {
          toast.error('Institute data is missing from result card');
          return;
        }

        // Format the data for display
        const formattedResult = {
          ...resultData,
          studentInfo: resultData.student || resultData.studentInfo,
          examInfo: resultData.exam || resultData.examInfo,
          classInfo: resultData.class || resultData.classInfo,
          instituteInfo: resultData.institute || resultData.instituteInfo || {},
          generatedDate: resultData.generatedDate || new Date(),
          // Ensure subjects array has the correct structure
          subjects: resultData.subjects || [],
          totalObtained: resultData.totalObtained || 0,
          totalMaxMarks: resultData.totalMaxMarks || 0,
          overallPercentage: resultData.overallPercentage || 0,
          overallGrade: resultData.overallGrade || 'N/A',
          overallRemarks: resultData.overallRemarks || 'N/A',
          resultStatus: resultData.resultStatus || 'N/A'
        };

        setGeneratedResult(formattedResult);
        toast.success('Result card generated successfully!');

        // Scroll to result card
        setTimeout(() => {
          resultCardRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        toast.error(result.message || 'Failed to generate result card');
      }
    } catch (error) {
      console.error('❌ Generate result error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred while generating result card';
      toast.error(errorMessage, {
        style: {
          background: '#1f2937',
          color: '#f87171',
          border: '1px solid #991b1b'
        }
      });
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
      const filteredStudents = Array.isArray(students) ? students.filter(student => student && student._id && typeof student._id === 'string' && student.studentName) : [];

      console.log(`✅ Found ${filteredStudents.length} students for class ${className}`);

      setClassFilteredStudents(filteredStudents);
      
      if (filteredStudents.length === 0) {
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
    if (!generatedResult) {
      toast.error('Generate a result card first');
      return;
    }

    const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const left = 40;
    let cursorY = 50;

    const institute = generatedResult.instituteInfo || generatedResult.institute || {};
    const student = generatedResult.studentInfo || generatedResult.student || {};
    const exam = generatedResult.examInfo || generatedResult.exam || {};
    const classInfo = generatedResult.classInfo || generatedResult.class || {};

    doc.setFontSize(20);
    doc.setTextColor('#1f2937');
    doc.text(institute.instituteName || 'Result Card', left, cursorY);
    cursorY += 22;

    doc.setFontSize(11);
    doc.setTextColor('#4b5563');
    if (institute.tagline) {
      doc.text(institute.tagline, left, cursorY);
      cursorY += 16;
    }
    if (institute.address) {
      doc.text(institute.address, left, cursorY);
      cursorY += 14;
    }
    const contactParts = [];
    if (institute.phone) contactParts.push(`Phone: ${institute.phone}`);
    if (institute.website) contactParts.push(`Website: ${institute.website}`);
    if (contactParts.length) {
      doc.text(contactParts.join('  |  '), left, cursorY);
      cursorY += 18;
    }

    cursorY += 6;
    doc.setDrawColor('#2563eb');
    doc.setLineWidth(1.5);
    doc.line(left, cursorY, left + 520, cursorY);
    cursorY += 24;

    doc.setFontSize(16);
    doc.setTextColor('#111827');
    doc.text('Student Information', left, cursorY);
    cursorY += 16;

    doc.setFontSize(11);
    doc.setTextColor('#1f2937');
    const infoRows = [
      ['Name', student.studentName || 'N/A'],
      ['Father\'s Name', student.fatherName || 'N/A'],
      ['Mother\'s Name', student.motherName || 'N/A'],
      ['Registration No.', student.registrationNo || 'N/A'],
      ['Roll No.', student.rollNumber || 'N/A'],
      ['Class & Section', `${classInfo.className || 'N/A'}${classInfo.section ? ` - ${classInfo.section}` : ''}`],
      ['Exam', exam.examName || 'N/A'],
      ['Exam Type', exam.examinationName || 'N/A'],
      ['Academic Year', exam.academicYear || 'N/A'],
    ];

    infoRows.forEach(row => {
      doc.text(`${row[0]}:`, left, cursorY);
      doc.text(String(row[1]), left + 140, cursorY);
      cursorY += 16;
    });

    cursorY += 10;
    doc.setDrawColor('#9333ea');
    doc.setLineWidth(1);
    doc.line(left, cursorY, left + 520, cursorY);
    cursorY += 18;

    doc.setFontSize(16);
    doc.setTextColor('#111827');
    doc.text('Subject-wise Performance', left, cursorY);
    cursorY += 12;

    const subjectRows = (generatedResult.subjects || []).map((subject, idx) => ([
      idx + 1,
      subject.subjectName || subject.subject?.subjectName || 'Unknown Subject',
      subject.maxMarks ?? 0,
      subject.marksObtained ?? 0,
      subject.percentage != null ? `${Number(subject.percentage).toFixed(2)}%` : '0%',
      subject.grade || 'N/A',
      getGradeRemarks(subject.grade)
    ]));

    autoTable(doc, {
      startY: cursorY + 10,
      head: [['#', 'Subject', 'Max', 'Obtained', '%', 'Grade', 'Remarks']],
      body: subjectRows,
      styles: { fontSize: 10, halign: 'center' },
      columnStyles: {
        1: { halign: 'left' },
        6: { halign: 'left' },
      },
      headStyles: { fillColor: [37, 99, 235] },
      theme: 'grid',
      margin: { left },
    });

    const finalY = doc.lastAutoTable.finalY || cursorY + 40;
    const summaryY = finalY + 28;
    doc.setFontSize(14);
    doc.setTextColor('#111827');
    doc.text('Summary', left, summaryY);

    doc.setFontSize(11);
    doc.setTextColor('#1f2937');
    const summaryRows = [
      ['Total Marks', `${generatedResult.totalObtained || 0} / ${generatedResult.totalMaxMarks || 0}`],
      ['Percentage', generatedResult.overallPercentage != null ? `${Number(generatedResult.overallPercentage).toFixed(2)}%` : '0%'],
      ['Grade', generatedResult.overallGrade || 'N/A'],
      ['Result', generatedResult.resultStatus || 'N/A'],
      ['Remarks', generatedResult.overallRemarks || 'N/A'],
    ];
    let summaryCursor = summaryY + 18;
    summaryRows.forEach(row => {
      doc.text(`${row[0]}:`, left, summaryCursor);
      doc.text(String(row[1]), left + 140, summaryCursor);
      summaryCursor += 16;
    });

    const fileName = `${student.studentName || 'ResultCard'}-${exam.examName || 'Exam'}.pdf`;
    doc.save(fileName.replace(/\s+/g, '_'));
    toast.success('Result card PDF downloaded');
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

  const getGradeRemarks = (grade) => {
    switch (grade) {
      case 'A+': return 'Outstanding';
      case 'A': return 'Excellent';
      case 'B+': return 'Very Good';
      case 'B': return 'Good';
      case 'C': return 'Average';
      case 'D': return 'Pass';
      case 'F': return 'Fail';
      default: return 'N/A';
    }
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
                  {exams?.filter(exam => exam && exam._id && typeof exam._id === 'string' && exam.label).map(exam => (
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
                    {allClasses?.filter(cls => cls && cls._id && typeof cls._id === 'string' && cls.className).map(cls => (
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
                  {((filters.resultType === 'class' && filters.selectedClass ? classFilteredStudents : students) || [])?.filter(student => student && student._id && typeof student._id === 'string' && student.studentName).map(student => (
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
                disabled={generating || !filters.selectedExam || !filters.selectedStudentId}
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
            <div className="p-8 bg-white dark:bg-gray-900">
              {/* School Header */}
              <div className="text-center mb-8 border-b-4 border-blue-600 pb-6">
                {/* School Logo and Name */}
                <div className="flex justify-center items-start mb-4">
                  {/* Left: Institute Logo */}
                  <div className="flex-shrink-0 mr-4">
                    {(generatedResult.instituteInfo?.logoUrl || generatedResult.institute?.logoUrl) ? (
                      <img 
                        src={generatedResult.instituteInfo?.logoUrl || generatedResult.institute?.logoUrl} 
                        alt="Institute Logo" 
                        className="w-20 h-20 object-contain rounded-full shadow-lg border-2 border-blue-600" 
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg border-2 border-blue-600 flex items-center justify-center">
                        <Building2 className="w-10 h-10 text-white" />
                      </div>
                    )}
                  </div>
                  
                  {/* Center: Institute Details */}
                  <div className="flex-1">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                      {generatedResult.instituteInfo?.instituteName || generatedResult.institute?.instituteName || 'CLASSORA SCHOOL'}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                      {generatedResult.instituteInfo?.tagline || generatedResult.institute?.tagline || 'Affiliated to Central Board of Secondary Education'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                      {generatedResult.instituteInfo?.address || generatedResult.institute?.address || '123 Education Street, Knowledge City - 123456'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                      Phone: {generatedResult.instituteInfo?.phone || generatedResult.institute?.phone || 'N/A'}
                      {(generatedResult.instituteInfo?.website || generatedResult.institute?.website) && 
                        ` | Website: ${generatedResult.instituteInfo?.website || generatedResult.institute?.website}`
                      }
                    </p>
                  </div>
                  
                  {/* Right: Student Photo Placeholder */}
                  <div className="flex-shrink-0 ml-4">
                    {(generatedResult.studentInfo?.photoUrl || generatedResult.student?.photoUrl || generatedResult.studentInfo?.picture?.url || generatedResult.student?.picture?.url) ? (
                      <img 
                        src={generatedResult.studentInfo?.photoUrl || generatedResult.student?.photoUrl || generatedResult.studentInfo?.picture?.url || generatedResult.student?.picture?.url} 
                        alt="Student Photo" 
                        className="w-24 h-28 object-cover rounded-lg shadow-lg border-2 border-gray-300" 
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-24 h-28 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-lg border-2 border-gray-300 flex items-center justify-center">
                        <GraduationCap className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                      </div>
                    )}
                    <p className="text-xs text-center text-gray-500 mt-1">Student Photo</p>
                  </div>
                </div>
                
                {/* Result Card Title */}
                <div className="mt-6 inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold text-xl shadow-lg">
                  ACADEMIC RESULT CARD
                </div>
                
                {/* Academic Year */}
                <div className="mt-4 text-gray-700 dark:text-gray-300 font-semibold text-lg">
                  Academic Year: {generatedResult.examInfo?.academicYear || generatedResult.exam?.academicYear || '2025-2026'}
                </div>
              </div>

              {/* Student Information Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-lg border-2 border-gray-300 dark:border-gray-700 shadow-md">
                {/* Left Column - Basic Info */}
                <div className="space-y-3">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-3 border-b-2 border-blue-500 pb-2">Student Information</h3>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 dark:text-gray-300 w-36 text-sm">Name:</span>
                    <span className="text-gray-900 dark:text-gray-100 font-medium text-sm">
                      {generatedResult.studentInfo?.studentName || generatedResult.student?.studentName || 'N/A'}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 dark:text-gray-300 w-36 text-sm">Father's Name:</span>
                    <span className="text-gray-900 dark:text-gray-100 font-medium text-sm">
                      {generatedResult.studentInfo?.fatherName || generatedResult.student?.fatherName || 'N/A'}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 dark:text-gray-300 w-36 text-sm">Mother's Name:</span>
                    <span className="text-gray-900 dark:text-gray-100 font-medium text-sm">
                      {generatedResult.studentInfo?.motherName || generatedResult.student?.motherName || 'N/A'}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 dark:text-gray-300 w-36 text-sm">Date of Birth:</span>
                    <span className="text-gray-900 dark:text-gray-100 font-medium text-sm">
                      {generatedResult.studentInfo?.dateOfBirth || generatedResult.student?.dateOfBirth 
                        ? new Date(generatedResult.studentInfo?.dateOfBirth || generatedResult.student?.dateOfBirth).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })
                        : 'N/A'
                      }
                    </span>
                  </div>
                  {(generatedResult.studentInfo?.address || generatedResult.student?.address) && (
                    <div className="flex">
                      <span className="font-semibold text-gray-700 dark:text-gray-300 w-36 text-sm">Address:</span>
                      <span className="text-gray-900 dark:text-gray-100 font-medium text-sm flex-1">
                        {generatedResult.studentInfo?.address || generatedResult.student?.address}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Middle Column - Academic Info */}
                <div className="space-y-3">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-3 border-b-2 border-purple-500 pb-2">Academic Details</h3>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 dark:text-gray-300 w-36 text-sm">Class & Section:</span>
                    <span className="text-gray-900 dark:text-gray-100 font-medium text-sm">
                      {generatedResult.classInfo?.className || generatedResult.class?.className || 'N/A'}
                      {(generatedResult.classInfo?.section || generatedResult.class?.section) && 
                        ` - ${generatedResult.classInfo?.section || generatedResult.class?.section}`
                      }
                    </span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 dark:text-gray-300 w-36 text-sm">Roll No:</span>
                    <span className="text-gray-900 dark:text-gray-100 font-medium text-sm">
                      {generatedResult.studentInfo?.rollNumber || generatedResult.student?.rollNumber || 'N/A'}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 dark:text-gray-300 w-36 text-sm">Registration No:</span>
                    <span className="text-gray-900 dark:text-gray-100 font-medium text-sm">
                      {generatedResult.studentInfo?.registrationNo || generatedResult.student?.registrationNo || 'N/A'}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 dark:text-gray-300 w-36 text-sm">Exam:</span>
                    <span className="text-gray-900 dark:text-gray-100 font-medium text-sm">
                      {generatedResult.examInfo?.examName || generatedResult.exam?.examName || 'N/A'}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 dark:text-gray-300 w-36 text-sm">Exam Type:</span>
                    <span className="text-gray-900 dark:text-gray-100 font-medium text-sm">
                      {generatedResult.examInfo?.examinationName || generatedResult.exam?.examinationName || 'N/A'}
                    </span>
                  </div>
                </div>
                
                {/* Right Column - Performance Summary */}
                <div className="space-y-3">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-3 border-b-2 border-green-500 pb-2">Performance Summary</h3>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 dark:text-gray-300 w-36 text-sm">Total Marks:</span>
                    <span className="text-gray-900 dark:text-gray-100 font-bold text-sm">
                      {generatedResult.totalObtained || 0} / {generatedResult.totalMaxMarks || 0}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 dark:text-gray-300 w-36 text-sm">Percentage:</span>
                    <span className="text-gray-900 dark:text-gray-100 font-bold text-sm">
                      {generatedResult.overallPercentage ? `${generatedResult.overallPercentage}%` : '0%'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-700 dark:text-gray-300 w-36 text-sm">Grade:</span>
                    <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold text-sm shadow-md">
                      {generatedResult.overallGrade || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-700 dark:text-gray-300 w-36 text-sm">Remarks:</span>
                    <span className="text-gray-900 dark:text-gray-100 font-medium text-sm">
                      {generatedResult.overallRemarks || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-700 dark:text-gray-300 w-36 text-sm">Result:</span>
                    <span className={`font-bold text-sm px-3 py-1 rounded-full ${
                      (generatedResult.resultStatus || 'N/A') === 'PASS' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {generatedResult.resultStatus || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Subject-wise Performance Table */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-lg shadow-lg">
                  SUBJECT-WISE PERFORMANCE
                </h3>
                
                {generatedResult.subjects && Array.isArray(generatedResult.subjects) && generatedResult.subjects.length > 0 ? (
                  <div className="overflow-x-auto shadow-xl rounded-lg">
                    <table className="w-full border-collapse border-2 border-gray-800 dark:border-gray-600">
                      <thead>
                        <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                          <th className="border-2 border-gray-800 dark:border-gray-600 px-4 py-4 text-center font-bold text-sm">S.No</th>
                          <th className="border-2 border-gray-800 dark:border-gray-600 px-4 py-4 text-left font-bold text-sm">Subject Name</th>
                          <th className="border-2 border-gray-800 dark:border-gray-600 px-4 py-4 text-center font-bold text-sm">Maximum Marks</th>
                          <th className="border-2 border-gray-800 dark:border-gray-600 px-4 py-4 text-center font-bold text-sm">Marks Obtained</th>
                          <th className="border-2 border-gray-800 dark:border-gray-600 px-4 py-4 text-center font-bold text-sm">Percentage</th>
                          <th className="border-2 border-gray-800 dark:border-gray-600 px-4 py-4 text-center font-bold text-sm">Grade</th>
                          <th className="border-2 border-gray-800 dark:border-gray-600 px-4 py-4 text-center font-bold text-sm">Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(generatedResult.subjects || []).map((subject, index) => (
                          <tr key={index} className={`${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'} hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors`}>
                            <td className="border-2 border-gray-800 dark:border-gray-600 px-4 py-3 text-center font-bold text-gray-900 dark:text-gray-100">
                              {index + 1}
                            </td>
                            <td className="border-2 border-gray-800 dark:border-gray-600 px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">
                              {subject.subjectName || subject.subject?.subjectName || 'Unknown Subject'}
                            </td>
                            <td className="border-2 border-gray-800 dark:border-gray-600 px-4 py-3 text-center text-gray-900 dark:text-gray-100 font-medium">
                              {subject.maxMarks || 0}
                            </td>
                            <td className="border-2 border-gray-800 dark:border-gray-600 px-4 py-3 text-center text-gray-900 dark:text-gray-100 font-bold text-lg">
                              {subject.marksObtained || 0}
                            </td>
                            <td className="border-2 border-gray-800 dark:border-gray-600 px-4 py-3 text-center text-gray-900 dark:text-gray-100 font-semibold">
                              {subject.percentage ? `${subject.percentage.toFixed(2)}%` : '0%'}
                            </td>
                            <td className="border-2 border-gray-800 dark:border-gray-600 px-4 py-3 text-center">
                              <span className={`inline-block px-3 py-1 rounded-full font-bold text-sm shadow-md ${
                                subject.grade === 'A+' ? 'bg-green-500 text-white' :
                                subject.grade === 'A' ? 'bg-blue-500 text-white' :
                                subject.grade === 'B+' ? 'bg-cyan-500 text-white' :
                                subject.grade === 'B' ? 'bg-yellow-500 text-white' :
                                subject.grade === 'C' ? 'bg-orange-500 text-white' :
                                subject.grade === 'D' ? 'bg-red-400 text-white' :
                                'bg-red-600 text-white'
                              }`}>
                                {subject.grade || 'N/A'}
                              </span>
                            </td>
                            <td className="border-2 border-gray-800 dark:border-gray-600 px-4 py-3 text-center text-gray-900 dark:text-gray-100 font-medium">
                              {getGradeRemarks(subject.grade)}
                            </td>
                          </tr>
                        ))}
                        
                        {/* Total Row */}
                        <tr className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900 dark:to-orange-900 font-bold border-t-4 border-blue-600">
                          <td className="border-2 border-gray-800 dark:border-gray-600 px-4 py-4 text-center text-gray-900 dark:text-gray-100 text-lg" colSpan="2">
                            GRAND TOTAL
                          </td>
                          <td className="border-2 border-gray-800 dark:border-gray-600 px-4 py-4 text-center text-xl text-gray-900 dark:text-gray-100 font-bold">
                            {generatedResult.totalMaxMarks || 0}
                          </td>
                          <td className="border-2 border-gray-800 dark:border-gray-600 px-4 py-4 text-center text-xl text-blue-700 dark:text-blue-300 font-bold">
                            {generatedResult.totalObtained || 0}
                          </td>
                          <td className="border-2 border-gray-800 dark:border-gray-600 px-4 py-4 text-center text-xl text-purple-700 dark:text-purple-300 font-bold">
                            {generatedResult.overallPercentage ? `${generatedResult.overallPercentage.toFixed(2)}%` : '0%'}
                          </td>
                          <td className="border-2 border-gray-800 dark:border-gray-600 px-4 py-4 text-center">
                            <span className="inline-block px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold text-lg shadow-lg">
                              {generatedResult.overallGrade || 'N/A'}
                            </span>
                          </td>
                          <td className="border-2 border-gray-800 dark:border-gray-600 px-4 py-4 text-center text-gray-900 dark:text-gray-100 font-bold text-lg">
                            {generatedResult.overallRemarks || 'N/A'}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400 font-semibold">No subject marks available</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Marks data will be populated when available</p>
                  </div>
                )}
              </div>

              {/* Attendance and Behavior Section Placeholder */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Attendance Summary */}
                <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900 dark:to-cyan-900 rounded-lg border-2 border-blue-300 dark:border-blue-600 shadow-md">
                  <h4 className="font-bold text-lg text-blue-800 dark:text-blue-200 mb-3 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Attendance Summary
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Total Working Days:</span>
                      <span className="font-bold text-gray-900 dark:text-gray-100">---</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Days Present:</span>
                      <span className="font-bold text-green-600 dark:text-green-400">---</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Days Absent:</span>
                      <span className="font-bold text-red-600 dark:text-red-400">---</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-blue-200 dark:border-blue-700">
                      <span className="text-gray-700 dark:text-gray-300">Attendance %:</span>
                      <span className="font-bold text-blue-700 dark:text-blue-300">---</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 italic">Feature coming soon</p>
                </div>

                {/* Behavior & Conduct */}
                <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 rounded-lg border-2 border-purple-300 dark:border-purple-600 shadow-md">
                  <h4 className="font-bold text-lg text-purple-800 dark:text-purple-200 mb-3 flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    Behavior & Conduct
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Discipline:</span>
                      <span className="font-bold text-gray-900 dark:text-gray-100">---</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Punctuality:</span>
                      <span className="font-bold text-gray-900 dark:text-gray-100">---</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Co-curricular:</span>
                      <span className="font-bold text-gray-900 dark:text-gray-100">---</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Overall Conduct:</span>
                      <span className="font-bold text-gray-900 dark:text-gray-100">---</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 italic">Feature coming soon</p>
                </div>
              </div>

              {/* Teacher's Remarks */}
              <div className="mb-8 p-6 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900 dark:to-amber-900 rounded-lg border-2 border-yellow-300 dark:border-yellow-600 shadow-md">
                <h4 className="font-bold text-lg text-yellow-800 dark:text-yellow-200 mb-3">Class Teacher's Remarks</h4>
                <div className="min-h-[80px] p-4 bg-white dark:bg-gray-800 rounded border border-yellow-200 dark:border-yellow-700">
                  <p className="text-gray-600 dark:text-gray-400 italic">
                    {generatedResult.teacherRemarks || 'The student has shown consistent effort and dedication throughout the academic year. Keep up the good work!'}
                  </p>
                </div>
              </div>

              {/* Grading Scale */}
              <div className="mb-8 p-5 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900 dark:to-blue-900 rounded-lg border-2 border-indigo-300 dark:border-indigo-600 shadow-md">
                <h4 className="font-bold text-xl text-indigo-800 dark:text-indigo-200 mb-4 text-center">Grading Scale & Interpretation</h4>
                <div className="grid grid-cols-2 md:grid-cols-7 gap-3 text-sm">
                  <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border-2 border-green-400 shadow-sm">
                    <span className="font-bold text-xl text-green-600 block mb-1">A+</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">90-100%</span>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Outstanding</p>
                  </div>
                  <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border-2 border-blue-400 shadow-sm">
                    <span className="font-bold text-xl text-blue-600 block mb-1">A</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">80-89%</span>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Excellent</p>
                  </div>
                  <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border-2 border-cyan-400 shadow-sm">
                    <span className="font-bold text-xl text-cyan-600 block mb-1">B+</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">70-79%</span>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Very Good</p>
                  </div>
                  <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border-2 border-yellow-400 shadow-sm">
                    <span className="font-bold text-xl text-yellow-600 block mb-1">B</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">60-69%</span>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Good</p>
                  </div>
                  <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border-2 border-orange-400 shadow-sm">
                    <span className="font-bold text-xl text-orange-600 block mb-1">C</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">50-59%</span>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Average</p>
                  </div>
                  <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border-2 border-red-400 shadow-sm">
                    <span className="font-bold text-xl text-red-600 block mb-1">D</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">40-49%</span>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Pass</p>
                  </div>
                  <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border-2 border-red-600 shadow-sm">
                    <span className="font-bold text-xl text-red-700 block mb-1">F</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Below 40%</span>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Fail</p>
                  </div>
                </div>
              </div>

              {/* Promoted/Detained Section */}
              <div className="mb-8 p-6 rounded-lg border-4 shadow-lg text-center" style={{
                backgroundColor: (generatedResult.resultStatus || 'N/A') === 'PASS' ? '#dcfce7' : '#fee2e2',
                borderColor: (generatedResult.resultStatus || 'N/A') === 'PASS' ? '#16a34a' : '#dc2626'
              }}>
                <div className={`text-3xl font-bold mb-2 ${
                  (generatedResult.resultStatus || 'N/A') === 'PASS' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {(generatedResult.resultStatus || 'N/A') === 'PASS' ? (
                    <span className="flex items-center justify-center">
                      <Award className="w-8 h-8 mr-2" />
                      ✓ PROMOTED TO NEXT CLASS
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      ✗ DETAINED IN CURRENT CLASS
                    </span>
                  )}
                </div>
                <div className={`text-sm font-medium ${
                  (generatedResult.resultStatus || 'N/A') === 'PASS' ? 'text-green-600' : 'text-red-600'
                }`}>
                  Based on academic performance as per school policy
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t-4 border-blue-600">
                <div className="text-center">
                  <div className="h-20 mb-3 flex items-end justify-center">
                    <div className="w-full border-b-2 border-gray-800 dark:border-gray-500"></div>
                  </div>
                  <div className="pt-2">
                    <p className="font-bold text-gray-900 dark:text-gray-100 text-lg">Class Teacher</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Signature & Date</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="h-20 mb-3 flex items-end justify-center">
                    <div className="w-full border-b-2 border-gray-800 dark:border-gray-500"></div>
                  </div>
                  <div className="pt-2">
                    <p className="font-bold text-gray-900 dark:text-gray-100 text-lg">Principal</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Signature, Seal & Date</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="h-20 mb-3 flex items-end justify-center">
                    <div className="w-full border-b-2 border-gray-800 dark:border-gray-500"></div>
                  </div>
                  <div className="pt-2">
                    <p className="font-bold text-gray-900 dark:text-gray-100 text-lg">Parent/Guardian</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Signature & Date</p>
                  </div>
                </div>
              </div>

              {/* Date of Issue and Important Note */}
              <div className="mt-8 space-y-4">
                <div className="text-center">
                  <p className="font-bold text-gray-900 dark:text-gray-100 text-lg">
                    Date of Issue: {new Date(generatedResult.generatedDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-700">
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                    <strong>Note:</strong> This is a computer-generated result card. Please verify all details carefully. 
                    For any discrepancies, contact the school office within 7 days of issue.
                  </p>
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