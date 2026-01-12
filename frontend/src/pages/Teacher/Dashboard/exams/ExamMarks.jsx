import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Save, 
  Search, 
  BookOpen, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Edit3, 
  Calculator,
  TrendingUp,
  User,
  Hash
} from 'lucide-react';
import { examsApi, examMarksApi } from '../../../../services/examsApi';
import { classApi } from '../../../../services/classApi';
import toast from 'react-hot-toast';

const ExamMarks = () => {
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [marksData, setMarksData] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        setLoadingDropdowns(true);
        const [examsData, classesData] = await Promise.all([
          examsApi.getExamDropdown(),
          classApi.getAllClasses()
        ]);
        if (examsData.success) {
          setExams(examsData.data);
        }
        if (classesData.success) {
          setClasses(classesData.data);
        }
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
        toast.error('Failed to load necessary data');
      } finally {
        setLoadingDropdowns(false);
      }
    };

    fetchDropdownData();
  }, []);

  const filteredStudents = students.filter(student => student.class === selectedClass);
  const selectedSubjectData = subjects.find(sub => sub.id === selectedSubject);

  const handleMarksChange = (studentId, marks) => {
    setMarksData(prev => ({
      ...prev,
      [`${selectedExam}-${selectedClass}-${selectedSubject}-${studentId}`]: parseInt(marks) || 0
    }));
  };

  const getStudentMarks = (studentId) => {
    return marksData[`${selectedExam}-${selectedClass}-${selectedSubject}-${studentId}`] || 0;
  };

  useEffect(() => {
    const fetchMarks = async () => {
      if (selectedExam && selectedClass && selectedSubject) {
        try {
          setLoading(true);
          const { data } = await examMarksApi.getExamMarksByClass(selectedExam, selectedClass);
          setStudents(data.students);
          setSubjects(data.subjects);
          const initialMarks = {};
          data.students.forEach(student => {
            initialMarks[`${selectedExam}-${selectedClass}-${selectedSubject}-${student.student._id}`] = student.marks[selectedSubject]?.marksObtained || '';
          });
          setMarksData(initialMarks);
          setIsEditing(true); // Since we are fetching existing marks
        } catch (error) {
          console.error('Error fetching marks:', error);
          toast.error('Failed to fetch marks');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchMarks();
  }, [selectedExam, selectedClass, selectedSubject]);

  const handleSaveMarks = async () => {
    if (!selectedExam || !selectedClass || !selectedSubject) {
      toast.error('Please select exam, class, and subject first');
      return;
    }
    
    const marksToSave = students.map(student => ({
      studentId: student.student._id,
      subjectId: selectedSubject,
      marksObtained: getStudentMarks(student.student._id)
    }));

    try {
      setLoading(true);
      await examMarksApi.saveBulkMarks(selectedExam, selectedClass, marksToSave);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      toast.success('Marks saved successfully!');
    } catch (error) {
      console.error('Error saving marks:', error);
      toast.error('Failed to save marks');
    } finally {
      setLoading(false);
    }
  };

  const calculatePercentage = (marks) => {
    if (!selectedSubjectData) return 0;
    return ((marks / selectedSubjectData.maxMarks) * 100).toFixed(1);
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return { grade: 'A+', color: 'text-green-600 dark:text-green-400' };
    if (percentage >= 80) return { grade: 'A', color: 'text-green-500 dark:text-green-300' };
    if (percentage >= 70) return { grade: 'B+', color: 'text-blue-600 dark:text-blue-400' };
    if (percentage >= 60) return { grade: 'B', color: 'text-blue-500 dark:text-blue-300' };
    if (percentage >= 50) return { grade: 'C', color: 'text-yellow-600 dark:text-yellow-400' };
    if (percentage >= 40) return { grade: 'D', color: 'text-orange-600 dark:text-orange-400' };
    return { grade: 'F', color: 'text-red-600 dark:text-red-400' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-800 dark:to-red-800 rounded-2xl shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative px-8 py-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Calculator className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {isEditing ? 'Update Exam Marks' : 'Add Exam Marks'}
                </h1>
                <p className="text-orange-100 text-lg">Enter and manage student examination marks</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-orange-100">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span>Subject-wise Entry</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span>Auto Calculation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selection Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Search className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Exam Selection</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Choose exam, class, and subject</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Select Exam <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedExam}
                  onChange={(e) => setSelectedExam(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-orange-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                >
                  <option value="">Select an exam</option>
                  {exams.map(exam => (
                    <option key={exam.id} value={exam.id}>{exam.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Select Class <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  disabled={!selectedExam}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-orange-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select a class</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.name} ({cls.students} students)</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Select Subject <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  disabled={!selectedClass}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-orange-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select a subject</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>{subject.name} (Max: {subject.maxMarks})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Marks Entry Section */}
        {selectedExam && selectedClass && selectedSubject && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <Edit3 className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                      {isEditing ? 'Update Obtained Marks' : 'Add Obtained Marks'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedSubjectData?.name} - {exams.find(e => e.id === selectedExam)?.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleSaveMarks}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Save Marks
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <div className="flex items-center gap-2">
                          <Hash className="w-4 h-4" />
                          ID
                        </div>
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Student Name
                        </div>
                      </th>
                      <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Subject ({selectedSubjectData?.name})
                      </th>
                      <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Total Marks ({selectedSubjectData?.maxMarks})
                      </th>
                      <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Percentage
                      </th>
                      <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Grade
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {filteredStudents.map(student => {
                      const marks = getStudentMarks(student.id);
                      const percentage = calculatePercentage(marks);
                      const gradeInfo = getGrade(percentage);
                      
                      return (
                        <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <td className="py-4 px-6 text-sm font-medium text-gray-900 dark:text-gray-100">
                            {student.rollNo}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-semibold">
                                {student.name.charAt(0)}
                              </div>
                              <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{student.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <input
                              type="number"
                              min="0"
                              max={selectedSubjectData?.maxMarks}
                              value={marks}
                              onChange={(e) => handleMarksChange(student.id, e.target.value)}
                              className="w-20 px-3 py-2 text-center border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-orange-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                              placeholder="0"
                            />
                          </td>
                          <td className="py-4 px-6 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {selectedSubjectData?.maxMarks}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                              {percentage}%
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span className={`text-sm font-bold ${gradeInfo.color}`}>
                              {gradeInfo.grade}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {showSuccess && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 flex items-center space-x-3">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
            <div>
              <p className="font-semibold text-green-900 dark:text-green-100">Marks Saved Successfully!</p>
              <p className="text-sm text-green-700 dark:text-green-300">All student marks have been updated in the system.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamMarks;
