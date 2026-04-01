import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Calendar, 
  Users, 
  Save, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle,
  Target,
  Award,
  FileText,
  Plus,
  Search
} from 'lucide-react';
import { classTestApi } from '../../../../services/classTestApi';
import { classApi } from '../../../../services/classApi';
import toast from 'react-hot-toast';

const ManageTestMarks = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTestDate, setSelectedTestDate] = useState('');
  const [totalMarks, setTotalMarks] = useState('');
  const [testMarks, setTestMarks] = useState([]);
  const [showMarksTable, setShowMarksTable] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        setLoadingDropdowns(true);
        const [classesData, dropdownData] = await Promise.all([
          classApi.getAllClasses(),
          classTestApi.getDropdownData()
        ]);
        if (classesData.success) {
          setClasses(classesData.data);
        }
        if (dropdownData.success) {
          setSubjects(dropdownData.data.subjects);
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

  useEffect(() => {
    const fetchStudents = async () => {
      if (selectedClass) {
        try {
          setLoading(true);
          const { data } = await classTestApi.getDropdownData(selectedClass);
          setStudents(data.students);
          const initialMarks = data.students.map(student => ({
            id: student._id,
            studentName: student.studentName,
            rollNo: student.rollNumber,
            obtainedMarks: '',
            isSaved: false
          }));
          setTestMarks(initialMarks);
        } catch (error) {
          console.error('Error fetching students:', error);
          toast.error('Failed to fetch students');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchStudents();
  }, [selectedClass]);

  const handleMarksChange = (studentId, marks) => {
    setTestMarks(prev => prev.map(student => 
      student.id === studentId 
        ? { ...student, obtainedMarks: marks }
        : student
    ));
  };

  const handleSaveAllMarks = () => {
    const updatedMarks = testMarks.map(student => ({
      ...student,
      isSaved: student.obtainedMarks !== ''
    }));
    setTestMarks(updatedMarks);
    alert('Test marks saved successfully!');
  };

  const handleUpdateMarks = (studentId) => {
    setEditingStudentId(studentId);
    setIsEditing(true);
  };

  const handleSaveUpdate = (studentId) => {
    setTestMarks(prev => prev.map(student => 
      student.id === studentId 
        ? { ...student, isSaved: true }
        : student
    ));
    setEditingStudentId(null);
    setIsEditing(false);
    alert('Marks updated successfully!');
  };

  const handleDeleteMarks = (studentId) => {
    if (window.confirm('Are you sure you want to delete these marks?')) {
      setTestMarks(prev => prev.map(student => 
        student.id === studentId 
          ? { ...student, obtainedMarks: '', isSaved: false }
          : student
      ));
      alert('Marks deleted successfully!');
    }
  };

  const getPercentage = (obtained, total) => {
    if (!obtained || !total) return 0;
    return ((parseFloat(obtained) / parseFloat(total)) * 100).toFixed(1);
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return { grade: 'A+', color: 'text-green-600' };
    if (percentage >= 80) return { grade: 'A', color: 'text-green-500' };
    if (percentage >= 70) return { grade: 'B+', color: 'text-blue-600' };
    if (percentage >= 60) return { grade: 'B', color: 'text-blue-500' };
    if (percentage >= 50) return { grade: 'C+', color: 'text-yellow-600' };
    if (percentage >= 40) return { grade: 'C', color: 'text-yellow-500' };
    return { grade: 'F', color: 'text-red-500' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Manage Test Marks</h1>
                <p className="text-blue-100 mt-1">Add, update, and manage student test marks efficiently</p>
              </div>
            </div>
          </div>
        </div>

        {/* Selection Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Test Configuration</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Select class, subject, and test details</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Class Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Select Class <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                  >
                    <option value="">Choose Class</option>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>{cls.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subject Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Select Subject <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    disabled={!selectedClass}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Choose Subject</option>
                    {subjects.map(subject => (
                      <option key={subject.id} value={subject.id}>{subject.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Test Date Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Test Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={selectedTestDate}
                    onChange={(e) => setSelectedTestDate(e.target.value)}
                    disabled={!selectedSubject}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Total Marks */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Total Test Marks <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(e.target.value)}
                    disabled={!selectedTestDate}
                    placeholder="Enter total marks"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Marks Table */}
        {showMarksTable && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Edit3 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Add/Update Test Marks</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {subjects.find(s => s.id === selectedSubject)?.name} - {classes.find(c => c.id === selectedClass)?.name} - {selectedTestDate}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">Total: {totalMarks}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Maximum Marks</div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Student Name</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Roll No</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Obtained Marks</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Percentage</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Grade</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {testMarks.map((student, index) => {
                      const percentage = getPercentage(student.obtainedMarks, totalMarks);
                      const gradeInfo = getGrade(percentage);
                      
                      return (
                        <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                                {student.studentName.charAt(0)}
                              </div>
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {student.studentName}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                            {student.rollNo}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              value={student.obtainedMarks}
                              onChange={(e) => handleMarksChange(student.id, e.target.value)}
                              max={totalMarks}
                              min="0"
                              className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                              placeholder="0"
                            />
                            <span className="ml-2 text-sm text-gray-500">/ {totalMarks}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                            {percentage}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-sm font-semibold ${gradeInfo.color}`}>
                              {gradeInfo.grade}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {student.isSaved ? (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleUpdateMarks(student.id)}
                                  className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                                  title="Update Marks"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteMarks(student.id)}
                                  className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                                  title="Delete Marks"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                                <span className="text-xs text-yellow-600 dark:text-yellow-400">Not Saved</span>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Save Button */}
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleSaveAllMarks}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-3"
                >
                  <Save className="w-5 h-5" />
                  Save Test Marks
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Summary Statistics */}
        {showMarksTable && testMarks.some(s => s.isSaved) && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Test Statistics</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Performance overview</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {testMarks.filter(s => s.isSaved).length}
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">Students Evaluated</div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 border border-green-200 dark:border-green-700">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {testMarks.filter(s => s.isSaved && parseFloat(s.obtainedMarks) >= (totalMarks * 0.4)).length}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">Passed</div>
                </div>
                
                <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl p-4 border border-red-200 dark:border-red-700">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {testMarks.filter(s => s.isSaved && parseFloat(s.obtainedMarks) < (totalMarks * 0.4)).length}
                  </div>
                  <div className="text-sm text-red-600 dark:text-red-400">Failed</div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 border border-purple-200 dark:border-purple-700">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {testMarks.filter(s => s.isSaved).length > 0 
                      ? (testMarks.filter(s => s.isSaved).reduce((sum, s) => sum + parseFloat(s.obtainedMarks || 0), 0) / testMarks.filter(s => s.isSaved).length).toFixed(1)
                      : '0'
                    }
                  </div>
                  <div className="text-sm text-purple-600 dark:text-purple-400">Average Marks</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageTestMarks;
