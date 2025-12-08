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

const ResultCard = () => {
  const navigate = useNavigate();
  const resultCardRef = useRef(null);

  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [generatedResult, setGeneratedResult] = useState(null);

  // State for filters
  const [filters, setFilters] = useState({
    resultType: 'school',
    selectedExam: '',
    selectedClass: '',
    searchTerm: ''
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

      // Fetch students (for school-wide search)
      const studentsResult = await studentAPI.getStudents();
      if (studentsResult.success) {
        setStudents(studentsResult.data);
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
      [key]: value
    }));

    // Reset student selection when filters change
    if (key !== 'searchTerm') {
      setSelectedStudent(null);
      setGeneratedResult(null);
    }
  };

  const filteredStudents = students.filter(student => {
    if (filters.resultType === 'class' && filters.selectedClass) {
      return student.selectClass === filters.selectedClass &&
             (student.studentName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
              student.registrationNo.includes(filters.searchTerm));
    }
    return student.studentName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
           student.registrationNo.includes(filters.searchTerm);
  });

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    setGeneratedResult(null);
  };

  const handleGenerateResult = async () => {
    if (!filters.selectedExam) {
      toast.error('Please select an exam');
      return;
    }

    if (!selectedStudent) {
      toast.error('Please search and select a student');
      return;
    }

    setGenerating(true);
    try {
      const result = await resultCardsAPI.generateResultCard(selectedStudent._id, filters.selectedExam);
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
      toast.error('An error occurred while generating result card');
      console.error('Generate result error:', error);
    } finally {
      setGenerating(false);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm print:hidden">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-blue-600 font-semibold">Exams</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-semibold">Result Card</span>
        </div>

        {/* Header */}
        <div className="mb-8 print:hidden">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
            <span>Generate Result Card</span>
          </h1>
          <p className="text-gray-600 mt-2">Generate and download student result cards</p>
        </div>

        {/* Selection Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-8 print:hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <FileText className="w-6 h-6 text-purple-600" />
              <span>Result Generation Options</span>
            </h2>
            <p className="text-sm text-gray-600 mt-1">Select the type and details for result generation</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Result Type Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select Result Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => handleFilterChange('resultType', 'school')}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    filters.resultType === 'school'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      filters.resultType === 'school'
                        ? 'bg-gradient-to-br from-purple-500 to-pink-600'
                        : 'bg-gray-100'
                    }`}>
                      <Building2 className={`w-6 h-6 ${filters.resultType === 'school' ? 'text-white' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">School-wise</p>
                      <p className="text-sm text-gray-600">Generate for any student in school</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleFilterChange('resultType', 'class')}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    filters.resultType === 'class'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      filters.resultType === 'class'
                        ? 'bg-gradient-to-br from-blue-500 to-cyan-600'
                        : 'bg-gray-100'
                    }`}>
                      <Users className={`w-6 h-6 ${filters.resultType === 'class' ? 'text-white' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Class-wise</p>
                      <p className="text-sm text-gray-600">Generate for students in a class</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Selection Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Select Exam */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Exam <span className="text-red-500">*</span>
                </label>
                <select
                  value={filters.selectedExam}
                  onChange={(e) => handleFilterChange('selectedExam', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Class <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={filters.selectedClass}
                    onChange={(e) => handleFilterChange('selectedClass', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    placeholder="Enter class name..."
                  />
                </div>
              )}

              {/* Search Student */}
              <div className={filters.resultType === 'school' ? 'md:col-span-2' : ''}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Search Student <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={filters.searchTerm}
                    onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    placeholder="Search by name or registration number..."
                    disabled={loading}
                  />
                  
                  {/* Search Results Dropdown */}
                  {filters.searchTerm && !selectedStudent && filteredStudents.length > 0 && (
                    <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                      {filteredStudents.map(student => (
                        <button
                          key={student._id}
                          onClick={() => handleStudentSelect(student)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                        >
                          <p className="font-semibold text-gray-900">{student.studentName}</p>
                          <p className="text-sm text-gray-600">
                            Reg No: {student.registrationNo} | Class: {student.selectClass} - {student.section}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {selectedStudent && (
                  <p className="mt-2 text-sm text-green-600 font-semibold">
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
                className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-700 text-white rounded-xl hover:from-purple-700 hover:to-pink-800 transition-all shadow-lg hover:shadow-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div ref={resultCardRef} className="bg-white rounded-2xl shadow-2xl border-2 border-gray-300 overflow-hidden">
            {/* Action Buttons */}
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-end space-x-3 print:hidden">
              <button
                onClick={handlePrint}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-semibold"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>

            {/* Result Card Content */}
            <div className="p-8">
              {/* School Header */}
              <div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Classora School</h1>
                <p className="text-gray-600">123 Education Street, Knowledge City - 123456</p>
                <p className="text-gray-600">Phone: +91 1234567890 | Email: info@classora.edu</p>
                <div className="mt-4 inline-block px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold text-lg">
                  STUDENT RESULT CARD
                </div>
              </div>

              {/* Student Information */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="space-y-3">
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-40">Student Name:</span>
                    <span className="text-gray-900">{generatedResult.studentInfo?.studentName || generatedResult.student?.studentName}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-40">Father's Name:</span>
                    <span className="text-gray-900">{generatedResult.studentInfo?.fatherName || generatedResult.student?.fatherName}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-40">Registration No:</span>
                    <span className="text-gray-900">{generatedResult.studentInfo?.registrationNo || generatedResult.student?.registrationNo}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-40">Roll Number:</span>
                    <span className="text-gray-900">{generatedResult.studentInfo?.rollNumber || generatedResult.student?.rollNumber}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-40">Class:</span>
                    <span className="text-gray-900">
                      {generatedResult.classInfo?.className || generatedResult.class?.className} - 
                      {generatedResult.classInfo?.section || generatedResult.class?.section}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-40">Date of Birth:</span>
                    <span className="text-gray-900">
                      {new Date(generatedResult.studentInfo?.dateOfBirth || generatedResult.student?.dateOfBirth).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between">
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-40">Examination:</span>
                    <span className="text-gray-900">{generatedResult.examInfo?.examName || generatedResult.exam?.examName}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-40">Date of Issue:</span>
                    <span className="text-gray-900">
                      {new Date(generatedResult.generatedDate).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Marks Table */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg">
                  Academic Performance
                </h3>
                <table className="w-full border-2 border-gray-300">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                      <th className="border border-gray-300 px-4 py-3 text-left">Subject</th>
                      <th className="border border-gray-300 px-4 py-3 text-center">Marks Obtained</th>
                      <th className="border border-gray-300 px-4 py-3 text-center">Total Marks</th>
                      <th className="border border-gray-300 px-4 py-3 text-center">Percentage</th>
                      <th className="border border-gray-300 px-4 py-3 text-center">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {generatedResult.subjects.map((subject, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-3 font-semibold">{subject.subjectName}</td>
                        <td className="border border-gray-300 px-4 py-3 text-center">{subject.marksObtained}</td>
                        <td className="border border-gray-300 px-4 py-3 text-center">{subject.maxMarks}</td>
                        <td className="border border-gray-300 px-4 py-3 text-center">{subject.percentage}%</td>
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-bold">
                            {subject.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gradient-to-r from-purple-50 to-pink-50 font-bold">
                      <td className="border border-gray-300 px-4 py-3">TOTAL</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-lg">{generatedResult.totalObtained}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-lg">{generatedResult.totalMaxMarks}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-lg">{generatedResult.overallPercentage}%</td>
                      <td className="border border-gray-300 px-4 py-3 text-center">
                        <span className="inline-block px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold text-lg">
                          {generatedResult.overallGrade}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Grade Scale */}
              <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-3">Grading Scale:</h4>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-sm">
                  <div className="text-center p-2 bg-white rounded border border-gray-200">
                    <span className="font-bold">A+</span>: 90-100%
                  </div>
                  <div className="text-center p-2 bg-white rounded border border-gray-200">
                    <span className="font-bold">A</span>: 80-89%
                  </div>
                  <div className="text-center p-2 bg-white rounded border border-gray-200">
                    <span className="font-bold">B+</span>: 70-79%
                  </div>
                  <div className="text-center p-2 bg-white rounded border border-gray-200">
                    <span className="font-bold">B</span>: 60-69%
                  </div>
                  <div className="text-center p-2 bg-white rounded border border-gray-200">
                    <span className="font-bold">C</span>: 50-59%
                  </div>
                  <div className="text-center p-2 bg-white rounded border border-gray-200">
                    <span className="font-bold">D</span>: 40-49%
                  </div>
                </div>
              </div>

              {/* Result Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Overall Result</p>
                  <p className="text-2xl font-bold text-green-700">{generatedResult.resultStatus}</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Remarks</p>
                  <p className="text-2xl font-bold text-blue-700">{generatedResult.overallRemarks}</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Overall Percentage</p>
                  <p className="text-2xl font-bold text-purple-700">{generatedResult.overallPercentage}%</p>
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t-2 border-gray-300">
                <div className="text-center">
                  <div className="h-16 mb-2 border-b-2 border-gray-400"></div>
                  <div className="pt-2">
                    <p className="font-semibold text-gray-900">Class Teacher</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="h-16 mb-2 border-b-2 border-gray-400"></div>
                  <div className="pt-2">
                    <p className="font-semibold text-gray-900">Principal</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="h-16 mb-2 border-b-2 border-gray-400"></div>
                  <div className="pt-2">
                    <p className="font-semibold text-gray-900">Parent's Signature</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!generatedResult && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center print:hidden">
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Result Generated Yet</h3>
            <p className="text-gray-500">Select the options above and click "Generate Result Card" to view the result</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultCard;