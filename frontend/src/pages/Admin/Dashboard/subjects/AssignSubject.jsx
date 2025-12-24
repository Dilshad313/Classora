import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast'; // Ensure toast is imported
import { 
  Trash2, 
  Save,
  BookOpen,
  AlertCircle,
  Home,
  ChevronRight,
  BookMarked,
  ArrowLeft,
  Loader2,
  AlertTriangle,
  RefreshCw,
  X,
  Plus // Added Plus icon
} from 'lucide-react';
import { fetchClassesForDropdown, submitSubjectAssignment, getSubjectsByClass } from '../../../../services/subjectApi';

const AssignSubject = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const editModeId = searchParams.get('edit');
  const classIdParam = searchParams.get('classId');

  const [subjects, setSubjects] = useState([
    {
      id: Date.now(),
      subjectName: '',
      totalMarks: '',
      isRequired: true
    }
  ]);

  const [selectedClass, setSelectedClass] = useState('');
  const [classes, setClasses] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  // Fetch classes on component mount
  useEffect(() => {
    const loadClasses = async () => {
      try {
        setLoading(true);
        setApiError('');
        console.log('🔄 Loading classes...');
        
        const data = await fetchClassesForDropdown();
        
        if (data && data.length > 0) {
          console.log(`✅ Loaded ${data.length} classes`);
          setClasses(data);
        } else {
          console.log('⚠️ No classes found');
          setClasses([]);
          // Show Toast as per requirement
          toast.custom((t) => (
            <div className={`${
              t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
              <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <AlertCircle className="h-10 w-10 text-red-500" />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Alert: No Class has been found
                    </p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Please add at least one Class before to access this feature.
                    </p>
                    <div className="mt-3 flex space-x-3">
                      <button
                        onClick={() => {
                          toast.dismiss(t.id);
                          navigate('/dashboard/classes/new');
                        }}
                        className="bg-indigo-600 rounded-md text-sm font-medium text-white px-4 py-2 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Ok, Add Class
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex border-l border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          ), {
            duration: Infinity,
            position: 'top-center',
          });
          
          setApiError('No classes available. Please create classes first.');
        }
      } catch (error) {
        console.error('❌ Failed to load classes:', error);
        toast.error(`Failed to load classes: ${error.message}`);
        setApiError(error.message);
        
        // Retry logic
        if (retryCount < 3) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    loadClasses();
  }, [retryCount]);

  // Handle Edit Mode Pre-filling
  useEffect(() => {
    const prefillData = async () => {
      if (!editModeId || !classIdParam) return;

      try {
        setLoading(true);
        console.log(`🔄 Pre-filling data for class: ${classIdParam}`);
        
        const response = await getSubjectsByClass(classIdParam);
        
        if (response.success && response.data) {
          const { subjects: existingSubjects, teacher } = response.data;
          
          setSelectedClass(classIdParam);
          setSelectedTeacher(teacher);
          
          if (existingSubjects && existingSubjects.length > 0) {
            setSubjects(existingSubjects.map(s => ({
              id: s._id || Date.now() + Math.random(),
              subjectName: s.subjectName || '',
              totalMarks: s.totalMarks || '',
              isRequired: s.isRequired
            })));
          }
        }
      } catch (error) {
        console.error('❌ Prefill error:', error);
        toast.error('Failed to load existing subjects for editing');
      } finally {
        setLoading(false);
      }
    };

    if (classes.length > 0) {
      prefillData();
    }
  }, [editModeId, classIdParam, classes]);
  const handleAddSubject = () => {
    setSubjects(prev => [
      ...prev,
      {
        id: Date.now(),
        subjectName: '',
        totalMarks: '',
        isRequired: true
      }
    ]);
  };

  const handleRemoveSubject = (id) => {
    if (subjects.length <= 1) {
      alert('Cannot remove all subjects');
      return;
    }
    setSubjects(prev => prev.filter(subject => subject.id !== id));
  };

  const handleSubjectChange = (id, field, value) => {
    setSubjects(prev => 
      prev.map(subject => 
        subject.id === id 
          ? { ...subject, [field]: field === 'totalMarks' ? Math.max(0, parseInt(value) || '') : value }
          : subject
      )
    );

    // Clear errors when user starts typing
    if (errors[`subject_${id}`] || errors[`marks_${id}`]) {
      const newErrors = { ...errors };
      delete newErrors[`subject_${id}`];
      delete newErrors[`marks_${id}`];
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!selectedClass) {
      newErrors.class = 'Please select a class';
    }

    if (selectedClass && !selectedTeacher?._id) {
      newErrors.teacher = 'Teacher is not assigned to the selected class';
    }

    // Validate each subject
    subjects.forEach((subject, index) => {
      if (!subject.subjectName || !subject.subjectName.trim()) {
        newErrors[`subject_${subject.id}`] = 'Subject name is required';
      }
      
      if (!subject.totalMarks || isNaN(subject.totalMarks) || subject.totalMarks <= 0) {
        newErrors[`marks_${subject.id}`] = 'Valid total marks are required (minimum 1)';
      } else if (subject.totalMarks > 1000) {
        newErrors[`marks_${subject.id}`] = 'Maximum marks cannot exceed 1000';
      }
    });

    // Check for duplicate subject names
    const subjectNames = subjects.map(s => s.subjectName.trim().toLowerCase());
    const uniqueNames = new Set(subjectNames);
    if (uniqueNames.size !== subjectNames.length) {
      newErrors.general = 'Duplicate subject names are not allowed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      setApiError('');

      // Format data for API
      const payload = {
        classId: selectedClass,
        update: !!editModeId,
        subjects: subjects.map(s => ({
          subjectName: s.subjectName.trim(),
          totalMarks: parseInt(s.totalMarks),
          isRequired: s.isRequired
        }))
      };

      console.log('📤 Submitting payload:', payload);

      await submitSubjectAssignment(payload);
      
      toast.success(editModeId ? '✅ Subjects updated successfully!' : '✅ Subjects assigned successfully!');

      if (editModeId) {
        // After editing, navigate back
        setTimeout(() => navigate('/dashboard/subjects/classes'), 1500);
      } else {
        setSubjects([{
          id: Date.now(),
          subjectName: '',
          totalMarks: '',
          isRequired: true
        }]);
      }
      
    } catch (error) {
      console.error('❌ Submit error:', error);
      toast.error(error.message || 'Failed to assign subjects');
      setApiError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedClass('');
    setSelectedTeacher(null);
    setSubjects([{
      id: Date.now(),
      subjectName: '',
      totalMarks: '',
      isRequired: true
    }]);
    setErrors({});
    setApiError('');
  };

  const calculateTotalMarks = () => {
    return subjects.reduce((total, subject) => {
      return total + (parseInt(subject.totalMarks) || 0);
    }, 0);
  };

  const handleRefreshClasses = () => {
    setRetryCount(prev => prev + 1);
  };

  const getSelectedClassName = () => {
    const selected = classes.find(c => c._id === selectedClass);
    return selected ? selected.name : '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/40 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <button 
            onClick={() => navigate('/dashboard/subjects/classes')}
            className="text-purple-600 dark:text-purple-400 font-semibold hover:underline"
          >
            Subjects
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 dark:text-white font-semibold">{editModeId ? 'Edit Assignment' : 'Assign Subjects'}</span>
        </div>

        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard/subjects/classes')}
                className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
              <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
                <BookMarked className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                  {editModeId ? 'Edit Subjects' : 'Assign Subjects'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {editModeId ? 'Modify existing subject assignments' : 'Create and assign subjects to classes'}
                </p>
              </div>
            </div>
            <button
              onClick={handleRefreshClasses}
              disabled={loading}
              className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              title="Refresh Classes"
            >
              <RefreshCw className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* API Error Message */}


        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
          {/* Divider */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="px-8 py-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                {editModeId ? 'Update Subjects' : 'Create Subjects'}
              </h2>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {/* General Errors */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <p className="text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {errors.general}
                </p>
              </div>
            )}

            {/* Class Selection */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Select Class <span className="text-red-500">*</span>
                {selectedClass && (
                  <span className="ml-2 text-sm text-purple-600 dark:text-purple-400 font-medium">
                    Selected: {getSelectedClassName()}
                  </span>
                )}
              </label>
              <div className="relative">
                <select
                  value={selectedClass}
                  onChange={(e) => {
                    setSelectedClass(e.target.value);
                    const selected = classes.find(c => c._id === e.target.value);
                    setSelectedTeacher(selected?.teacherDetails || null);
                    if (errors.class) {
                      setErrors(prev => ({ ...prev, class: '' }));
                    }
                  }}
                  disabled={loading || classes.length === 0}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-900/50 dark:text-white transition-all appearance-none ${
                    errors.class ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                  } ${(loading || classes.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <option value="">
                    {loading ? 'Loading classes...' : classes.length === 0 ? 'No classes available' : 'Select a class'}
                  </option>
                  {classes.map(classItem => (
                    <option key={classItem._id} value={classItem._id}>
                      {classItem.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {errors.class && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.class}</span>
                </p>
              )}
              {errors.teacher && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.teacher}</span>
                </p>
              )}
              {!loading && classes.length === 0 && !apiError && (
                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                  <p className="text-yellow-800 dark:text-yellow-300 text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    No classes found. Please create classes first before assigning subjects.
                  </p>
                  <button
                    onClick={() => navigate('/dashboard/classes')}
                    className="mt-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Create Classes
                  </button>
                </div>
              )}
            </div>

            {/* Subjects List */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Subject Details</h3>
                <div className="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl border border-green-200 dark:border-green-800">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Marks: </span>
                  <span className="font-bold text-green-600 dark:text-green-400 text-lg">{calculateTotalMarks()}</span>
                </div>
              </div>

              {selectedClass && (
                <div className="border-2 border-gray-200 dark:border-gray-600 rounded-2xl p-6 bg-gray-50 dark:bg-gray-900/30">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Teacher Name</label>
                      <input
                        type="text"
                        value={selectedTeacher?.employeeName || ''}
                        readOnly
                        className="w-full px-4 py-3 border rounded-xl dark:bg-gray-900/50 dark:text-white dark:border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Teacher Email</label>
                      <input
                        type="text"
                        value={selectedTeacher?.emailAddress || ''}
                        readOnly
                        className="w-full px-4 py-3 border rounded-xl dark:bg-gray-900/50 dark:text-white dark:border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Teacher Mobile</label>
                      <input
                        type="text"
                        value={selectedTeacher?.mobileNo || ''}
                        readOnly
                        className="w-full px-4 py-3 border rounded-xl dark:bg-gray-900/50 dark:text-white dark:border-gray-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {subjects.map((subject, index) => (
                <div key={subject.id} className="border-2 border-gray-200 dark:border-gray-600 rounded-2xl p-6 bg-gray-50 dark:bg-gray-900/30 hover:border-purple-300 dark:hover:border-purple-700 transition-all">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Subject Number and Required/Optional Toggle */}
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-lg flex items-center justify-center">
                          <span className="text-purple-700 dark:text-purple-300 font-bold">{index + 1}</span>
                        </div>
                        <span className="text-sm font-medium text-red-500">Required*</span>
                      </div>
                    </div>

                    {/* Subject Name */}
                    <div className="md:col-span-5">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Subject Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={subject.subjectName}
                        onChange={(e) => handleSubjectChange(subject.id, 'subjectName', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-900/50 dark:text-white dark:border-gray-600 transition-all ${
                          errors[`subject_${subject.id}`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors[`subject_${subject.id}`] && (
                        <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors[`subject_${subject.id}`]}</span>
                        </p>
                      )}
                    </div>

                    {/* Total Marks */}
                    <div className="md:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Total Marks <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={subject.totalMarks}
                        onChange={(e) => handleSubjectChange(subject.id, 'totalMarks', e.target.value)}
                        min="1"
                        max="1000"
                        step="1"
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-900/50 dark:text-white dark:border-gray-600 transition-all ${
                          errors[`marks_${subject.id}`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors[`marks_${subject.id}`] && (
                        <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors[`marks_${subject.id}`]}</span>
                        </p>
                      )}
                    </div>

                    {/* Remove Button */}
                    <div className="md:col-span-2 flex items-end">
                      <button
                        onClick={() => handleRemoveSubject(subject.id)}
                        disabled={subjects.length <= 1}
                        className={`w-full px-4 py-3 border rounded-xl transition-all flex items-center justify-center space-x-2 ${
                          subjects.length <= 1
                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed border-gray-300 dark:border-gray-700'
                            : 'border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-400 dark:hover:border-red-600 hover:scale-[1.02]'
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add More Subject Button */}
              <div className="flex justify-center mt-8">
                <button
                  type="button"
                  onClick={handleAddSubject}
                  className="group flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-900 border-2 border-dashed border-purple-300 dark:border-purple-700 rounded-2xl text-purple-600 dark:text-purple-400 font-bold hover:border-purple-500 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all active:scale-95 shadow-sm hover:shadow-md"
                >
                  <div className="p-1 bg-purple-100 dark:bg-purple-900/50 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <Plus className="w-6 h-6" />
                  </div>
                  <span>Add More Subject</span>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 mt-8 border-t-2 border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  {subjects.length} subject{subjects.length !== 1 ? 's' : ''} configured
                </div>
                <div className="hidden sm:block text-gray-400">•</div>
                <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                  {calculateTotalMarks()} total marks
                </div>
                <div className="hidden sm:block text-gray-400">•</div>
                <div className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                  {subjects.filter(s => s.isRequired).length} required
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  onClick={handleReset}
                  disabled={submitting}
                  className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all font-semibold hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  Reset
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || loading || !selectedClass || !selectedTeacher?._id || subjects.some(s => !s.subjectName.trim() || !s.totalMarks)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-2 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{editModeId ? 'Updating...' : 'Assigning...'}</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>{editModeId ? 'Update Subjects' : 'Assign Subjects'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Form Validation Summary */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Form Validation:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className={`flex items-center gap-2 text-sm ${selectedClass ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                  <div className={`w-2 h-2 rounded-full ${selectedClass ? 'bg-green-500' : 'bg-gray-400'}`} />
                  Class selected
                </div>
                <div className={`flex items-center gap-2 text-sm ${subjects.length > 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                  <div className={`w-2 h-2 rounded-full ${subjects.length > 0 ? 'bg-green-500' : 'bg-gray-400'}`} />
                  At least 1 subject added
                </div>
                <div className={`flex items-center gap-2 text-sm ${subjects.every(s => s.subjectName.trim()) ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                  <div className={`w-2 h-2 rounded-full ${subjects.every(s => s.subjectName.trim()) ? 'bg-green-500' : 'bg-gray-400'}`} />
                  All subjects named
                </div>
                <div className={`flex items-center gap-2 text-sm ${subjects.every(s => s.totalMarks > 0) ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                  <div className={`w-2 h-2 rounded-full ${subjects.every(s => s.totalMarks > 0) ? 'bg-green-500' : 'bg-gray-400'}`} />
                  All marks set
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignSubject;