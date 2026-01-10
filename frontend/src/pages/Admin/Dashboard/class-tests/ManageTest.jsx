import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardCheck,
  Home,
  ChevronRight,
  CheckCircle2,
  Save,
  Users,
  BookOpen,
  Calendar,
  Edit2,
  Trash2,
  AlertCircle,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { 
  getDropdownData, 
  createClassTest, 
  updateClassTest, 
  deleteClassTest,
  getClassTestById,
  getClassTests
} from '../../../../services/classTestApi';

const ManageTest = () => {
  const navigate = useNavigate();

  // State for dropdown data
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  
  // State for form data
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [testDate, setTestDate] = useState('');
  const [totalMarks, setTotalMarks] = useState('');
  const [testName, setTestName] = useState('');
  const [testType, setTestType] = useState('unit');
  
  // State for student marks
  const [marks, setMarks] = useState([]);
  
  // UI state
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [existingTestId, setExistingTestId] = useState(null);
  const [error, setError] = useState('');
  const [shouldCheckExisting, setShouldCheckExisting] = useState(false);
  const [isTestNameManual, setIsTestNameManual] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load classes on component mount
  useEffect(() => {
    fetchClasses();
  }, []);

  // Fetch classes and their data
  const fetchClasses = async () => {
    try {
      setLoading(true);
      const data = await getDropdownData();
      setClasses(data.classes || []);
    } catch (err) {
      setError('Failed to load classes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // When class changes, fetch subjects and students
  useEffect(() => {
    if (selectedClass) {
      fetchClassData(selectedClass);
    } else {
      setSubjects([]);
      setStudents([]);
      setMarks([]);
    }
  }, [selectedClass]);

  // When subject, date, and marks are set, check for existing test
  useEffect(() => {
    if (shouldCheckExisting && selectedClass && selectedSubject && testDate && totalMarks) {
      checkExistingTest();
    }
  }, [selectedClass, selectedSubject, testDate, totalMarks, shouldCheckExisting]);

  const fetchClassData = async (classId) => {
    try {
      setLoading(true);
      const data = await getDropdownData(classId);
      setSubjects(data.subjects || []);
      setStudents(data.students || []);
      
      // Initialize marks for each student
      const initialMarks = data.students.map(student => ({
        studentId: student._id,
        studentName: student.studentName,
        rollNo: student.rollNumber || student.registrationNo || '',
        obtainedMarks: ''
      }));
      setMarks(initialMarks);
    } catch (err) {
      setError('Failed to load class data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkExistingTest = async () => {
    try {
      setLoading(true);
      // Check if test already exists for this class, subject, and date
      const filters = {
        classId: selectedClass,
        subject: selectedSubject,
        startDate: testDate,
        endDate: testDate
      };
      
      const response = await getClassTests(filters);
      
      if (response.data && response.data.length > 0) {
        const existingTest = response.data[0];
        setExistingTestId(existingTest._id);
        
        // Load existing marks
        const updatedMarks = marks.map(mark => {
          const existingMark = existingTest.studentMarks?.find(
            sm => sm.studentId === mark.studentId
          );
          return {
            ...mark,
            obtainedMarks: existingMark ? existingMark.obtainedMarks : ''
          };
        });
        
        setMarks(updatedMarks);
        setTestName(existingTest.testName || `Test - ${new Date(testDate).toLocaleDateString()}`);
        setIsTestNameManual(!!existingTest.testName);
        setTestType(existingTest.testType || 'unit');
        setIsSaved(true);
        setIsEditing(false);
      } else {
        setExistingTestId(null);
        if (!isTestNameManual) {
          setTestName(`Test - ${new Date(testDate).toLocaleDateString()}`);
        }
        setIsSaved(false);
      }
    } catch (err) {
      console.error('Error checking existing test:', err);
    } finally {
      setLoading(false);
      setShouldCheckExisting(false);
    }
  };

  const getClassName = () => {
    const cls = classes.find(c => c._id === selectedClass);
    return cls ? `${cls.className}${cls.section ? ` - ${cls.section}` : ''}` : '';
  };

  const getSubjectName = () => {
    const subject = subjects.find(s => s._id === selectedSubject);
    return subject ? subject.name : '';
  };

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    setSelectedSubject('');
    setTestDate('');
    setTotalMarks('');
    setTestName('');
    setIsTestNameManual(false);
    setMarks([]);
    setExistingTestId(null);
    setIsSaved(false);
    setIsEditing(false);
    setError('');
    setShouldCheckExisting(false);
  };

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
    setTestDate('');
    setTotalMarks('');
    setTestName('');
    setIsTestNameManual(false);
    setMarks(students.map(student => ({
      studentId: student._id,
      studentName: student.studentName,
      rollNo: student.rollNumber || student.registrationNo || '',
      obtainedMarks: ''
    })));
    setExistingTestId(null);
    setIsSaved(false);
    setIsEditing(false);
    setShouldCheckExisting(false);
  };

  const handleTestDateChange = (e) => {
    const newDate = e.target.value;
    setTestDate(newDate);
    setShouldCheckExisting(false);
    if (!isTestNameManual && newDate) {
      setTestName(`Test - ${new Date(newDate).toLocaleDateString()}`);
    }
  };

  const handleTotalMarksChange = (e) => {
    const value = e.target.value;
    setTotalMarks(value);
    setShouldCheckExisting(false);
    
    // Validate existing marks if total marks changed
    if (value) {
      const maxMarks = parseFloat(value);
      const updatedMarks = marks.map(mark => {
        if (mark.obtainedMarks && parseFloat(mark.obtainedMarks) > maxMarks) {
          return { ...mark, obtainedMarks: maxMarks };
        }
        return mark;
      });
      setMarks(updatedMarks);
    }
  };

  const handleTotalMarksBlur = () => {
    if (selectedClass && selectedSubject && testDate && totalMarks) {
      setShouldCheckExisting(true);
    }
  };

  const handleMarkChange = (studentId, value) => {
    const numValue = value === '' ? '' : parseFloat(value);
    
    // Validate marks
    if (numValue !== '' && totalMarks) {
      const maxMarks = parseFloat(totalMarks);
      if (numValue < 0 || numValue > maxMarks) {
        return;
      }
    }

    setMarks(prev => 
      prev.map(mark => 
        mark.studentId === studentId 
          ? { ...mark, obtainedMarks: value }
          : mark
      )
    );
  };

  const handleSaveMarks = async () => {
    try {
      // Validate that all required fields are filled
      if (!selectedClass || !selectedSubject || !testDate || !totalMarks) {
        setError('Please fill all required fields');
        toast.error('Please fill all required fields');
        return;
      }

      // Validate that at least some marks are entered
      const hasMarks = marks.some(mark => mark.obtainedMarks !== '' && mark.obtainedMarks !== undefined);
      
      if (!hasMarks) {
        setError('Please enter at least some marks before saving');
        toast.error('Please enter at least some marks before saving');
        return;
      }

      setLoading(true);
      setError('');

      // Prepare student marks data
      const studentMarks = marks
        .filter(mark => mark.obtainedMarks !== '' && mark.obtainedMarks !== undefined)
        .map(mark => ({
          studentId: mark.studentId,
          studentName: mark.studentName,
          rollNo: mark.rollNo,
          obtainedMarks: parseFloat(mark.obtainedMarks)
        }));

      const testData = {
        testName: testName.trim() || `Test - ${new Date(testDate).toLocaleDateString()}`,
        testType,
        testDate,
        totalMarks: parseFloat(totalMarks),
        classId: selectedClass,
        subjectName: getSubjectName(),
        subjectId: selectedSubject,
        studentMarks,
        isPublished: false
      };

      let savedTest;
      if (existingTestId) {
        // Update existing test
        savedTest = await updateClassTest(existingTestId, testData);
      } else {
        // Create new test
        savedTest = await createClassTest(testData);
        setExistingTestId(savedTest._id);
      }

      toast.success('Test marks saved successfully');
      // Show success message
      setShowSuccess(true);
      setIsSaved(true);
      setIsEditing(false);

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to save test marks');
      console.error('Save error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = () => {
    setIsEditing(true);
    setIsSaved(false);
  };

  const handleDelete = () => {
    if (!existingTestId) return;
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!existingTestId) return;
    try {
      setLoading(true);
      await deleteClassTest(existingTestId);
      
      // Reset form
      setMarks(marks.map(mark => ({ ...mark, obtainedMarks: '' })));
      setExistingTestId(null);
      setIsSaved(false);
      setIsEditing(false);
      setShowSuccess(false);
      setError('');
      toast.success('Test marks deleted successfully');
    } catch (err) {
      setError('Failed to delete test marks');
      toast.error('Failed to delete test marks');
      console.error('Delete error:', err);
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const showTable = selectedClass && selectedSubject && testDate && totalMarks;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span className="text-blue-600 dark:text-blue-400 font-semibold">Class Tests</span>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span className="text-gray-900 dark:text-gray-100 font-semibold">Manage Test</span>
        </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 flex items-center gap-3 border-b border-gray-200 dark:border-gray-700">
              <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-300" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Delete Test Marks?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">This action cannot be undone.</p>
              </div>
            </div>
            <div className="px-6 py-5 space-y-3">
              <p className="text-sm text-gray-700 dark:text-gray-200">
                You are about to delete all saved marks for this test. Students' marks will be removed.
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={handleCancelDelete}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md transition disabled:opacity-50"
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <ClipboardCheck className="w-6 h-6 text-white" />
            </div>
            <span>Manage Test Marks</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Add, update, or delete test marks for students</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center space-x-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center space-x-3 animate-fade-in">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-green-900 dark:text-green-100">Test Marks Saved Successfully!</p>
              <p className="text-sm text-green-700 dark:text-green-300">All marks have been updated in the system.</p>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 flex flex-col items-center space-y-4">
              <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
              <p className="text-gray-700 dark:text-gray-300">Processing...</p>
            </div>
          </div>
        )}

        {/* Selection Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
              <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <span>Test Details</span>
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Select class, subject, and test date</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Select Class */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Select Class <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedClass}
                  onChange={handleClassChange}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  disabled={loading}
                >
                  <option value="">Choose Class...</option>
                  {classes.map(cls => (
                    <option key={cls._id} value={cls._id}>
                      {cls.className}{cls.section ? ` - ${cls.section}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Subject */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Select Subject <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedSubject}
                  onChange={handleSubjectChange}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  disabled={!selectedClass || loading}
                >
                  <option value="">Choose Subject...</option>
                  {subjects.map(subject => (
                    <option key={subject._id} value={subject._id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Test Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Test Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <input
                    type="date"
                    value={testDate}
                    onChange={handleTestDateChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    disabled={!selectedSubject || loading}
                  />
                </div>
              </div>

              {/* Total Marks */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Total Marks <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={totalMarks}
                  onChange={handleTotalMarksChange}
                  onBlur={handleTotalMarksBlur}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Enter total marks"
                  min="1"
                  step="0.5"
                  disabled={!testDate || loading}
                />
              </div>

              {/* Test Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Test Name
                </label>
                <input
                  type="text"
                  value={testName}
                  onChange={(e) => {
                    setTestName(e.target.value);
                    setIsTestNameManual(true);
                  }}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Enter test name"
                  disabled={loading}
                />
              </div>

              {/* Test Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Test Type
                </label>
                <select
                  value={testType}
                  onChange={(e) => setTestType(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  disabled={loading}
                >
                  <option value="unit">Unit Test</option>
                  <option value="mid-term">Mid Term</option>
                  <option value="final">Final Term</option>
                  <option value="quiz">Quiz</option>
                  <option value="assignment">Assignment</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Marks Entry Table */}
        {showTable && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
                    <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    <span>Add/Update Test Marks</span>
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {getClassName()} - {getSubjectName()} - {new Date(testDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Total Marks</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{totalMarks}</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-gray-100">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-gray-100">Student Name</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-gray-100">Roll No</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-900 dark:text-gray-100">
                      Obtained Marks
                      <div className="text-xs font-normal text-gray-500 dark:text-gray-400 mt-1">(Out of {totalMarks})</div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {students.length > 0 ? (
                    marks.map((mark, index) => (
                      <tr key={mark.studentId} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center justify-center w-10 h-10 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg font-bold">
                            {index + 1}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-gray-100">{mark.studentName}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-500 dark:text-gray-400">{mark.rollNo}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            <input
                              type="number"
                              value={mark.obtainedMarks}
                              onChange={(e) => handleMarkChange(mark.studentId, e.target.value)}
                              className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                              placeholder="0"
                              min="0"
                              max={totalMarks}
                              step="0.5"
                              disabled={(isSaved && !isEditing) || loading}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center">
                        <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400">No students found in this class</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Action Buttons */}
            {students.length > 0 && (
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                {!isSaved ? (
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p className="font-semibold">Note:</p>
                      <p>• Enter marks between 0 and {totalMarks}</p>
                      <p>• Leave blank if student was absent</p>
                      <p>• Marks can be entered with decimals (e.g., 85.5)</p>
                    </div>
                    <button
                      onClick={handleSaveMarks}
                      disabled={loading}
                      className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-xl hover:from-purple-700 hover:to-indigo-800 transition-all shadow-lg hover:shadow-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Save className="w-5 h-5" />
                      )}
                      <span>{loading ? 'Saving...' : 'Save Test Marks'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">Marks Saved</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {existingTestId ? 'Test marks are saved in the database' : 'You can update or delete these marks'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={handleUpdate}
                        disabled={loading}
                        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-700 text-white rounded-xl hover:from-blue-700 hover:to-cyan-800 transition-all shadow-lg hover:shadow-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Edit2 className="w-5 h-5" />
                        <span>Update</span>
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={loading}
                        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-5 h-5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!showTable && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
            <ClipboardCheck className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Complete Test Details</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Please fill in all the required fields above to start entering test marks
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageTest;