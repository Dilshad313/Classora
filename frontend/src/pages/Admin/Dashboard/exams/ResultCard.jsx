import React, { useState, useRef } from 'react';
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
  GraduationCap
} from 'lucide-react';

const ResultCard = () => {
  const navigate = useNavigate();
  const resultCardRef = useRef(null);

  const [exams] = useState([
    { id: 1, name: 'Mid-Term Examination 2024' },
    { id: 2, name: 'Final Examination 2024' },
    { id: 3, name: 'Unit Test 1' }
  ]);

  const [classes] = useState([
    { id: 1, name: 'Grade 10', section: 'A' },
    { id: 2, name: 'Grade 10', section: 'B' },
    { id: 3, name: 'Grade 11', section: 'A' }
  ]);

  const [students] = useState([
    { 
      id: 1, 
      name: 'Arun P', 
      rollNo: '001', 
      classId: 1,
      fatherName: 'Prakash Kumar',
      motherName: 'Sunita Devi',
      dob: '15-05-2009',
      admissionNo: 'ADM2023001'
    },
    { 
      id: 2, 
      name: 'Priya Sharma', 
      rollNo: '002', 
      classId: 1,
      fatherName: 'Rajesh Sharma',
      motherName: 'Meena Sharma',
      dob: '22-08-2009',
      admissionNo: 'ADM2023002'
    }
  ]);

  const marksData = {
    1: {
      1: {
        Mathematics: { obtained: 85, total: 100 },
        Physics: { obtained: 78, total: 100 },
        Chemistry: { obtained: 92, total: 100 },
        English: { obtained: 88, total: 100 },
        'Computer Science': { obtained: 95, total: 100 }
      }
    },
    2: {
      1: {
        Mathematics: { obtained: 92, total: 100 },
        Physics: { obtained: 88, total: 100 },
        Chemistry: { obtained: 85, total: 100 },
        English: { obtained: 90, total: 100 },
        'Computer Science': { obtained: 87, total: 100 }
      }
    }
  };

  const [resultType, setResultType] = useState('class');
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [generatedResult, setGeneratedResult] = useState(null);

  const filteredStudents = students.filter(student => {
    if (resultType === 'class' && selectedClass) {
      return student.classId === parseInt(selectedClass) &&
             (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              student.rollNo.includes(searchTerm));
    }
    return student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           student.rollNo.includes(searchTerm);
  });

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    setSearchTerm(student.name);
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

  const handleGenerateResult = () => {
    if (!selectedExam) {
      alert('Please select an exam');
      return;
    }

    if (resultType === 'class' && !selectedClass) {
      alert('Please select a class');
      return;
    }

    if (!selectedStudent) {
      alert('Please search and select a student');
      return;
    }

    const studentMarks = marksData[selectedStudent.id]?.[selectedExam];
    
    if (!studentMarks) {
      alert('No marks found for this student in the selected exam');
      return;
    }

    let totalObtained = 0;
    let totalMax = 0;
    const subjects = [];

    Object.keys(studentMarks).forEach(subject => {
      const marks = studentMarks[subject];
      totalObtained += marks.obtained;
      totalMax += marks.total;
      const percentage = (marks.obtained / marks.total) * 100;
      subjects.push({
        name: subject,
        obtained: marks.obtained,
        total: marks.total,
        percentage: percentage.toFixed(2),
        grade: calculateGrade(percentage).grade
      });
    });

    const overallPercentage = (totalObtained / totalMax) * 100;
    const gradeInfo = calculateGrade(overallPercentage);

    setGeneratedResult({
      student: selectedStudent,
      exam: exams.find(e => e.id === parseInt(selectedExam)),
      class: classes.find(c => c.id === selectedStudent.classId),
      subjects,
      totalObtained,
      totalMax,
      percentage: overallPercentage.toFixed(2),
      grade: gradeInfo.grade,
      remarks: gradeInfo.remarks,
      generatedDate: new Date().toLocaleDateString('en-IN')
    });

    setTimeout(() => {
      resultCardRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert('Download functionality would export the result card as PDF');
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
                  onClick={() => {
                    setResultType('school');
                    setSelectedClass('');
                    setGeneratedResult(null);
                  }}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    resultType === 'school'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      resultType === 'school'
                        ? 'bg-gradient-to-br from-purple-500 to-pink-600'
                        : 'bg-gray-100'
                    }`}>
                      <Building2 className={`w-6 h-6 ${resultType === 'school' ? 'text-white' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">School-wise</p>
                      <p className="text-sm text-gray-600">Generate for any student in school</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setResultType('class');
                    setGeneratedResult(null);
                  }}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    resultType === 'class'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      resultType === 'class'
                        ? 'bg-gradient-to-br from-blue-500 to-cyan-600'
                        : 'bg-gray-100'
                    }`}>
                      <Users className={`w-6 h-6 ${resultType === 'class' ? 'text-white' : 'text-gray-400'}`} />
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
                  value={selectedExam}
                  onChange={(e) => {
                    setSelectedExam(e.target.value);
                    setGeneratedResult(null);
                  }}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                >
                  <option value="">Choose Exam...</option>
                  {exams.map(exam => (
                    <option key={exam.id} value={exam.id}>{exam.name}</option>
                  ))}
                </select>
              </div>

              {/* Select Class (only for class-wise) */}
              {resultType === 'class' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Class <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedClass}
                    onChange={(e) => {
                      setSelectedClass(e.target.value);
                      setSelectedStudent(null);
                      setSearchTerm('');
                      setGeneratedResult(null);
                    }}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  >
                    <option value="">Choose Class...</option>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name} - {cls.section}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Search Student */}
              <div className={resultType === 'school' ? 'md:col-span-2' : ''}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Search Student <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setSelectedStudent(null);
                      setGeneratedResult(null);
                    }}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    placeholder="Search by name or roll number..."
                    disabled={resultType === 'class' && !selectedClass}
                  />
                  
                  {/* Search Results Dropdown */}
                  {searchTerm && !selectedStudent && filteredStudents.length > 0 && (
                    <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                      {filteredStudents.map(student => (
                        <button
                          key={student.id}
                          onClick={() => handleStudentSelect(student)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                        >
                          <p className="font-semibold text-gray-900">{student.name}</p>
                          <p className="text-sm text-gray-600">
                            Roll No: {student.rollNo} | Class: {classes.find(c => c.id === student.classId)?.name} - {classes.find(c => c.id === student.classId)?.section}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {selectedStudent && (
                  <p className="mt-2 text-sm text-green-600 font-semibold">
                    ✓ Selected: {selectedStudent.name} (Roll No: {selectedStudent.rollNo})
                  </p>
                )}
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex justify-center pt-4">
              <button
                onClick={handleGenerateResult}
                className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-700 text-white rounded-xl hover:from-purple-700 hover:to-pink-800 transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
              >
                <GraduationCap className="w-6 h-6" />
                <span>Generate Result Card</span>
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
                    <span className="text-gray-900">{generatedResult.student.name}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-40">Father's Name:</span>
                    <span className="text-gray-900">{generatedResult.student.fatherName}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-40">Mother's Name:</span>
                    <span className="text-gray-900">{generatedResult.student.motherName}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-40">Roll Number:</span>
                    <span className="text-gray-900">{generatedResult.student.rollNo}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-40">Class:</span>
                    <span className="text-gray-900">{generatedResult.class.name} - {generatedResult.class.section}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-40">Admission No:</span>
                    <span className="text-gray-900">{generatedResult.student.admissionNo}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between">
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-40">Examination:</span>
                    <span className="text-gray-900">{generatedResult.exam.name}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-40">Date of Issue:</span>
                    <span className="text-gray-900">{generatedResult.generatedDate}</span>
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
                        <td className="border border-gray-300 px-4 py-3 font-semibold">{subject.name}</td>
                        <td className="border border-gray-300 px-4 py-3 text-center">{subject.obtained}</td>
                        <td className="border border-gray-300 px-4 py-3 text-center">{subject.total}</td>
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
                      <td className="border border-gray-300 px-4 py-3 text-center text-lg">{generatedResult.totalMax}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-lg">{generatedResult.percentage}%</td>
                      <td className="border border-gray-300 px-4 py-3 text-center">
                        <span className="inline-block px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold text-lg">
                          {generatedResult.grade}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Overall Result</p>
                  <p className="text-2xl font-bold text-green-700">PASS</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Remarks</p>
                  <p className="text-2xl font-bold text-blue-700">{generatedResult.remarks}</p>
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t-2 border-gray-300">
                <div className="text-center">
                  <div className="h-16 mb-2"></div>
                  <div className="border-t-2 border-gray-400 pt-2">
                    <p className="font-semibold text-gray-900">Class Teacher</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="h-16 mb-2"></div>
                  <div className="border-t-2 border-gray-400 pt-2">
                    <p className="font-semibold text-gray-900">Principal</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="h-16 mb-2"></div>
                  <div className="border-t-2 border-gray-400 pt-2">
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
