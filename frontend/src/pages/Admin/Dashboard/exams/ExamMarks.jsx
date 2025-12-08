import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Award,
  Home,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Save,
  Users,
  BookOpen,
  Loader2,
  Search
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import * as examMarksAPI from '../../../../services/examMarksApi.js';
import * as examAPI from '../../../../services/examsApi.js';
import * as classAPI from '../../../../services/classApi.js';

const ExamMarks = () => {
  const navigate = useNavigate();

  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [marksData, setMarksData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

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

      // Fetch classes
      const classesResult = await classAPI.getAllClasses();
      if (classesResult.success) {
        setClasses(classesResult.data);
      }
    } catch (error) {
      toast.error('Failed to load dropdown data');
      console.error('Fetch dropdown error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExamChange = async (e) => {
    const examId = e.target.value;
    setSelectedExam(examId);
    setSelectedClass('');
    setMarksData(null);
    setErrors({});
  };

  const handleClassChange = async (e) => {
    const classId = e.target.value;
    setSelectedClass(classId);
    setMarksData(null);
    setErrors({});

    if (selectedExam && classId) {
      await fetchMarks(selectedExam, classId);
    }
  };

  const fetchMarks = async (examId, classId) => {
    setLoading(true);
    try {
      const result = await examMarksAPI.getExamMarksByClass(examId, classId);
      if (result.success) {
        setMarksData(result.data);
      } else {
        toast.error(result.message || 'Failed to fetch marks');
      }
    } catch (error) {
      toast.error('An error occurred while fetching marks');
      console.error('Fetch marks error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkChange = (studentId, subjectId, value) => {
    if (!marksData) return;

    const numValue = value === '' ? '' : parseFloat(value);
    
    // Validate marks
    if (numValue !== '') {
      const subject = marksData.subjects.find(s => s._id === subjectId);
      if (numValue < 0 || numValue > (subject?.totalMarks || 100)) {
        return;
      }
    }

    setMarksData(prev => {
      const updatedStudents = prev.students.map(student => {
        if (student.student._id === studentId) {
          const updatedMarks = {
            ...student.marks,
            [subjectId]: {
              ...student.marks[subjectId],
              marksObtained: numValue,
              maxMarks: subject?.totalMarks || 100
            }
          };

          // Calculate total and percentage
          let totalObtained = 0;
          let totalMaxMarks = 0;
          
          prev.subjects.forEach(subject => {
            const mark = updatedMarks[subject._id];
            if (mark && mark.marksObtained !== '') {
              totalObtained += parseFloat(mark.marksObtained);
              totalMaxMarks += parseFloat(mark.maxMarks);
            } else {
              totalMaxMarks += (subject.totalMarks || 100);
            }
          });

          const percentage = totalMaxMarks > 0 ? (totalObtained / totalMaxMarks * 100).toFixed(2) : 0;

          return {
            ...student,
            marks: updatedMarks,
            total: totalObtained,
            percentage: parseFloat(percentage)
          };
        }
        return student;
      });

      return {
        ...prev,
        students: updatedStudents
      };
    });
  };

  const handleSaveMarks = async () => {
    if (!marksData || !selectedExam || !selectedClass) {
      toast.error('Please select exam and class first');
      return;
    }

    // Prepare marks data for API
    const marksToSave = [];
    marksData.students.forEach(student => {
      marksData.subjects.forEach(subject => {
        const mark = student.marks[subject._id];
        if (mark && mark.marksObtained !== '') {
          marksToSave.push({
            studentId: student.student._id,
            subjectId: subject._id,
            marksObtained: mark.marksObtained,
            maxMarks: mark.maxMarks || subject.totalMarks || 100
          });
        }
      });
    });

    if (marksToSave.length === 0) {
      toast.error('Please enter at least some marks before saving');
      return;
    }

    setSaving(true);
    try {
      const result = await examMarksAPI.saveBulkMarks(selectedExam, selectedClass, marksToSave);
      if (result.success) {
        toast.success('Marks saved successfully!');
        // Refresh marks data
        await fetchMarks(selectedExam, selectedClass);
      } else {
        toast.error(result.message || 'Failed to save marks');
      }
    } catch (error) {
      toast.error('An error occurred while saving marks');
      console.error('Save marks error:', error);
    } finally {
      setSaving(false);
    }
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
                  disabled={loading}
                >
                  <option value="">Choose Exam...</option>
                  {exams.map(exam => (
                    <option key={exam._id} value={exam._id}>{exam.label}</option>
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
                  disabled={!selectedExam || loading}
                >
                  <option value="">Choose Class...</option>
                  {classes.map(cls => (
                    <option key={cls._id} value={cls._id}>
                      {cls.className} - {cls.section}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
            <p className="mt-4 text-gray-600">Loading marks data...</p>
          </div>
        )}

        {/* Marks Entry Table */}
        {marksData && !loading && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                    <Users className="w-6 h-6 text-blue-600" />
                    <span>Add Obtained Marks</span>
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Enter marks for {marksData.class.name} - {marksData.exam.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-blue-600">{marksData.students.length}</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 sticky left-0 bg-gray-50 z-10">Roll No</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 sticky left-24 bg-gray-50 z-10">Name</th>
                    {marksData.subjects.map(subject => (
                      <th key={subject._id} className="px-6 py-4 text-center text-sm font-bold text-gray-900">
                        <div>
                          <div>{subject.name}</div>
                          <div className="text-xs font-normal text-gray-500 mt-1">(Max: {subject.totalMarks})</div>
                        </div>
                      </th>
                    ))}
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-900 bg-blue-50">Total</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-900 bg-blue-50">%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {marksData.students.map((student, index) => (
                    <tr key={student.student._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 sticky left-0 bg-white">
                        <span className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-700 rounded-lg font-bold">
                          {student.student.rollNumber || index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4 sticky left-24 bg-white">
                        <div>
                          <p className="font-semibold text-gray-900">{student.student.name}</p>
                          <p className="text-sm text-gray-500">{student.student.registrationNo}</p>
                        </div>
                      </td>
                      {marksData.subjects.map(subject => (
                        <td key={subject._id} className="px-6 py-4">
                          <input
                            type="number"
                            value={student.marks[subject._id]?.marksObtained || ''}
                            onChange={(e) => handleMarkChange(student.student._id, subject._id, e.target.value)}
                            className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
                            placeholder="0"
                            min="0"
                            max={subject.totalMarks || 100}
                            step="0.5"
                          />
                        </td>
                      ))}
                      <td className="px-6 py-4 bg-blue-50">
                        <div className="text-center">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-700">
                            {student.total || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 bg-blue-50">
                        <div className="text-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                            student.percentage >= 40 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {student.percentage || 0}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Save Button */}
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
                  disabled={saving}
                  className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-700 text-white rounded-xl hover:from-blue-700 hover:to-cyan-800 transition-all shadow-lg hover:shadow-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  <span>{saving ? 'Saving...' : 'Save Marks'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!selectedExam && !selectedClass && !loading && (
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