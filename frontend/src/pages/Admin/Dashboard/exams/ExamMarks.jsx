import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Award,
  Home,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Save,
  Users,
  BookOpen
} from 'lucide-react';

const ExamMarks = () => {
  const navigate = useNavigate();

  const [exams] = useState([
    { id: 1, name: 'Mid-Term Examination' },
    { id: 2, name: 'Final Examination' },
    { id: 3, name: 'Unit Test 1' }
  ]);

  const [classes] = useState([
    { id: 1, name: 'Grade 10', section: 'A' },
    { id: 2, name: 'Grade 10', section: 'B' },
    { id: 3, name: 'Grade 11', section: 'A' },
    { id: 4, name: 'Grade 9', section: 'A' }
  ]);

  const [subjects] = useState([
    { id: 1, name: 'Mathematics', maxMarks: 100 },
    { id: 2, name: 'Physics', maxMarks: 100 },
    { id: 3, name: 'Chemistry', maxMarks: 100 },
    { id: 4, name: 'English', maxMarks: 100 }
  ]);

  const [students] = useState([
    { id: 1, name: 'Arun P', rollNo: '001', classId: 1 },
    { id: 2, name: 'Priya Sharma', rollNo: '002', classId: 1 },
    { id: 3, name: 'Rahul Kumar', rollNo: '003', classId: 1 },
    { id: 4, name: 'Sneha Patel', rollNo: '004', classId: 1 },
    { id: 5, name: 'Vikram Singh', rollNo: '005', classId: 1 }
  ]);

  const [selectedExam, setSelectedExam] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [marks, setMarks] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [marksAdded, setMarksAdded] = useState(false);

  const filteredStudents = selectedClass 
    ? students.filter(s => s.classId === parseInt(selectedClass))
    : [];

  const getClassName = (classId) => {
    const cls = classes.find(c => c.id === parseInt(classId));
    return cls ? `${cls.name} - ${cls.section}` : '';
  };

  const handleExamChange = (e) => {
    setSelectedExam(e.target.value);
    setSelectedClass('');
    setMarks({});
    setMarksAdded(false);
  };

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    setMarks({});
    setMarksAdded(false);
  };

  const handleMarkChange = (studentId, subjectId, value) => {
    const subject = subjects.find(s => s.id === subjectId);
    const numValue = value === '' ? '' : parseFloat(value);
    
    // Validate marks
    if (numValue !== '' && (numValue < 0 || numValue > subject.maxMarks)) {
      return;
    }

    setMarks(prev => ({
      ...prev,
      [`${studentId}-${subjectId}`]: value
    }));
  };

  const handleSaveMarks = () => {
    // Validate that at least some marks are entered
    const hasMarks = Object.values(marks).some(mark => mark !== '' && mark !== undefined);
    
    if (!hasMarks) {
      alert('Please enter at least some marks before saving');
      return;
    }

    // Show success message
    setShowSuccess(true);
    setMarksAdded(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const calculateTotal = (studentId) => {
    let total = 0;
    subjects.forEach(subject => {
      const mark = marks[`${studentId}-${subject.id}`];
      if (mark && mark !== '') {
        total += parseFloat(mark);
      }
    });
    return total;
  };

  const calculatePercentage = (studentId) => {
    const total = calculateTotal(studentId);
    const maxTotal = subjects.length * 100;
    return maxTotal > 0 ? ((total / maxTotal) * 100).toFixed(2) : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm">
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
          <span className="text-gray-900 font-semibold">Add/Update Marks</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
            <span>Add/Update Exam Marks</span>
          </h1>
          <p className="text-gray-600 mt-2">Enter or update marks for students</p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3 animate-fade-in">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-green-900">Marks Saved Successfully!</p>
              <p className="text-sm text-green-700">All marks have been updated in the system.</p>
            </div>
          </div>
        )}

        {/* Selection Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <span>Select Exam & Class</span>
            </h2>
            <p className="text-sm text-gray-600 mt-1">Choose the exam and class to enter marks</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Select Exam */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Exam <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedExam}
                  onChange={handleExamChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="">Choose Exam...</option>
                  {exams.map(exam => (
                    <option key={exam.id} value={exam.id}>{exam.name}</option>
                  ))}
                </select>
              </div>

              {/* Select Class */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Class <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedClass}
                  onChange={handleClassChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  disabled={!selectedExam}
                >
                  <option value="">Choose Class...</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} - {cls.section}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Status Message */}
        {selectedExam && selectedClass && !marksAdded && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start space-x-3 mb-8">
            <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-orange-900">
                Marks for {exams.find(e => e.id === parseInt(selectedExam))?.name} not added yet for {getClassName(selectedClass)}
              </p>
              <p className="text-sm text-orange-700 mt-1">
                Please enter the marks below and click "Save Marks" to save them.
              </p>
            </div>
          </div>
        )}

        {/* Marks Entry Table */}
        {selectedExam && selectedClass && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                    <Users className="w-6 h-6 text-blue-600" />
                    <span>Add Obtained Marks</span>
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Enter marks for {getClassName(selectedClass)} - {exams.find(e => e.id === parseInt(selectedExam))?.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-blue-600">{filteredStudents.length}</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 sticky left-0 bg-gray-50 z-10">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 sticky left-16 bg-gray-50 z-10">Name</th>
                    {subjects.map(subject => (
                      <th key={subject.id} className="px-6 py-4 text-center text-sm font-bold text-gray-900">
                        <div>
                          <div>{subject.name}</div>
                          <div className="text-xs font-normal text-gray-500 mt-1">(Max: {subject.maxMarks})</div>
                        </div>
                      </th>
                    ))}
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-900 bg-blue-50">Total</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-900 bg-blue-50">%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student, index) => (
                      <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 sticky left-0 bg-white">
                          <span className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-700 rounded-lg font-bold">
                            {index + 1}
                          </span>
                        </td>
                        <td className="px-6 py-4 sticky left-16 bg-white">
                          <div>
                            <p className="font-semibold text-gray-900">{student.name}</p>
                            <p className="text-sm text-gray-500">Roll No: {student.rollNo}</p>
                          </div>
                        </td>
                        {subjects.map(subject => (
                          <td key={subject.id} className="px-6 py-4">
                            <input
                              type="number"
                              value={marks[`${student.id}-${subject.id}`] || ''}
                              onChange={(e) => handleMarkChange(student.id, subject.id, e.target.value)}
                              className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
                              placeholder="0"
                              min="0"
                              max={subject.maxMarks}
                              step="0.5"
                            />
                          </td>
                        ))}
                        <td className="px-6 py-4 bg-blue-50">
                          <div className="text-center">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-700">
                              {calculateTotal(student.id)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 bg-blue-50">
                          <div className="text-center">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-700">
                              {calculatePercentage(student.id)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={subjects.length + 4} className="px-6 py-12 text-center">
                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No students found in this class</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Save Button */}
            {filteredStudents.length > 0 && (
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <p className="font-semibold">Note:</p>
                    <p>• Enter marks between 0 and maximum marks for each subject</p>
                    <p>• Leave blank if marks are not available</p>
                    <p>• Total and percentage will be calculated automatically</p>
                  </div>
                  <button
                    onClick={handleSaveMarks}
                    className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-700 text-white rounded-xl hover:from-blue-700 hover:to-cyan-800 transition-all shadow-lg hover:shadow-xl font-semibold"
                  >
                    <Save className="w-5 h-5" />
                    <span>Save Marks</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!selectedExam && !selectedClass && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Select Exam and Class</h3>
            <p className="text-gray-500">Please select an exam and class from the dropdowns above to start entering marks</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamMarks;
