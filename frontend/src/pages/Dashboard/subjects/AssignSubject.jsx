import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Trash2, 
  Save,
  Clock,
  BookOpen,
  X,
  AlertCircle,
  Home,
  ChevronRight,
  BookMarked,
  ArrowLeft
} from 'lucide-react';

const AssignSubject = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([
    {
      id: 1,
      subjectName: '',
      totalMarks: '',
      isRequired: true
    }
  ]);

  const [selectedClass, setSelectedClass] = useState('');
  const [errors, setErrors] = useState({});

  const classes = [
    { id: '1', name: 'Grade 1 - Section A' },
    { id: '2', name: 'Grade 1 - Section B' },
    { id: '3', name: 'Grade 2 - Section A' },
    { id: '4', name: 'Grade 2 - Section B' },
    { id: '5', name: 'Grade 3 - Section A' }
  ];

  const handleAddSubject = () => {
    setSubjects(prev => [...prev, {
      id: Date.now(),
      subjectName: '',
      totalMarks: '',
      isRequired: true
    }]);
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
          ? { ...subject, [field]: value }
          : subject
      )
    );

    // Clear errors when user starts typing
    if (errors[`subject_${id}`]) {
      setErrors(prev => ({
        ...prev,
        [`subject_${id}`]: ''
      }));
    }
  };

  const handleRequiredToggle = (id) => {
    setSubjects(prev => 
      prev.map(subject => 
        subject.id === id 
          ? { ...subject, isRequired: !subject.isRequired }
          : subject
      )
    );
  };

  const validateForm = () => {
    const newErrors = {};

    if (!selectedClass) {
      newErrors.class = 'Please select a class';
    }

    subjects.forEach((subject, index) => {
      if (!subject.subjectName.trim()) {
        newErrors[`subject_${subject.id}`] = 'Subject name is required';
      }
      if (!subject.totalMarks || subject.totalMarks <= 0) {
        newErrors[`marks_${subject.id}`] = 'Valid total marks are required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    // Submit logic here
    console.log('Assigning subjects:', {
      class: selectedClass,
      subjects: subjects
    });

    alert('Subjects assigned successfully!');
    
    // Reset form
    setSelectedClass('');
    setSubjects([{
      id: 1,
      subjectName: '',
      totalMarks: '',
      isRequired: true
    }]);
  };

  const calculateTotalMarks = () => {
    return subjects.reduce((total, subject) => {
      return total + (parseInt(subject.totalMarks) || 0);
    }, 0);
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
          <span className="text-gray-900 dark:text-white font-semibold">Assign Subjects</span>
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
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">Assign Subjects</h1>
                <p className="text-gray-600 dark:text-gray-400">Create and assign subjects to classes</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
          {/* Divider */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="px-8 py-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                Create Subjects
              </h2>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {/* Required/Optional Indicator */}
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-red-500 text-sm font-medium">Required*</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500 text-sm">Optional</span>
            </div>

            {/* Class Selection */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Class <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  if (errors.class) {
                    setErrors(prev => ({ ...prev, class: '' }));
                  }
                }}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-900/50 dark:text-white transition-all ${
                  errors.class ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                }`}
              >
                <option value="">Select a class</option>
                {classes.map(classItem => (
                  <option key={classItem.id} value={classItem.id}>
                    {classItem.name}
                  </option>
                ))}
              </select>
              {errors.class && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.class}</span>
                </p>
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

              {subjects.map((subject, index) => (
                <div key={subject.id} className="border-2 border-gray-200 dark:border-gray-600 rounded-2xl p-6 bg-gray-50 dark:bg-gray-900/30 hover:border-purple-300 dark:hover:border-purple-700 transition-all">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Required/Optional Toggle */}
                    <div className="md:col-span-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={subject.isRequired}
                          onChange={() => handleRequiredToggle(subject.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className={`text-sm font-medium ${
                          subject.isRequired ? 'text-red-500' : 'text-gray-500'
                        }`}>
                          {subject.isRequired ? 'Required*' : 'Optional'}
                        </span>
                      </label>
                    </div>

                    {/* Subject Name */}
                    <div className="md:col-span-5">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject Name {subject.isRequired && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        type="text"
                        value={subject.subjectName}
                        onChange={(e) => handleSubjectChange(subject.id, 'subjectName', e.target.value)}
                        placeholder="Name Of Subject"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors[`subject_${subject.id}`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors[`subject_${subject.id}`] && (
                        <p className="mt-1 text-sm text-red-600">{errors[`subject_${subject.id}`]}</p>
                      )}
                    </div>

                    {/* Total Marks */}
                    <div className="md:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Exam Marks {subject.isRequired && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        type="number"
                        value={subject.totalMarks}
                        onChange={(e) => handleSubjectChange(subject.id, 'totalMarks', e.target.value)}
                        placeholder="100"
                        min="0"
                        max="1000"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors[`marks_${subject.id}`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors[`marks_${subject.id}`] && (
                        <p className="mt-1 text-sm text-red-600">{errors[`marks_${subject.id}`]}</p>
                      )}
                    </div>

                    {/* Remove Button */}
                    <div className="md:col-span-2 flex items-end">
                      <button
                        onClick={() => handleRemoveSubject(subject.id)}
                        disabled={subjects.length <= 1}
                        className={`w-full px-3 py-2 border rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                          subjects.length <= 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400'
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="text-sm">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add More Button */}
            <div className="mt-6">
              <button
                onClick={handleAddSubject}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                <span>Add More Subject</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 mt-8 border-t-2 border-gray-200 dark:border-gray-700">
              <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                {subjects.length} subject{subjects.length !== 1 ? 's' : ''} configured • {calculateTotalMarks()} total marks
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedClass('');
                    setSubjects([{
                      id: 1,
                      subjectName: '',
                      totalMarks: '',
                      isRequired: true
                    }]);
                    setErrors({});
                  }}
                  className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all font-semibold hover:scale-105"
                >
                  Reset
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl flex items-center gap-2 hover:scale-105"
                >
                  <Save className="w-5 h-5" />
                  <span>Assign Subjects</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignSubject;