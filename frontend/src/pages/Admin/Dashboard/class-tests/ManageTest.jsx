import React, { useState } from 'react';
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
  AlertCircle
} from 'lucide-react';

const ManageTest = () => {
  const navigate = useNavigate();

  // Sample data
  const [classes] = useState([
    { id: 1, name: 'Grade 10', section: 'A' },
    { id: 2, name: 'Grade 10', section: 'B' },
    { id: 3, name: 'Grade 11', section: 'A' },
    { id: 4, name: 'Grade 9', section: 'A' }
  ]);

  const [subjectsData] = useState({
    1: [
      { id: 1, name: 'Mathematics' },
      { id: 2, name: 'Physics' },
      { id: 3, name: 'Chemistry' },
      { id: 4, name: 'English' }
    ],
    2: [
      { id: 1, name: 'Mathematics' },
      { id: 2, name: 'Physics' },
      { id: 5, name: 'Biology' },
      { id: 4, name: 'English' }
    ],
    3: [
      { id: 1, name: 'Mathematics' },
      { id: 2, name: 'Physics' },
      { id: 3, name: 'Chemistry' },
      { id: 6, name: 'Computer Science' }
    ],
    4: [
      { id: 1, name: 'Mathematics' },
      { id: 7, name: 'Science' },
      { id: 8, name: 'Social Studies' },
      { id: 4, name: 'English' }
    ]
  });

  const [studentsData] = useState({
    1: [
      { id: 1, name: 'Arun P', rollNo: '001' },
      { id: 2, name: 'Priya Sharma', rollNo: '002' },
      { id: 3, name: 'Rahul Kumar', rollNo: '003' },
      { id: 4, name: 'Sneha Patel', rollNo: '004' },
      { id: 5, name: 'Vikram Singh', rollNo: '005' }
    ],
    2: [
      { id: 6, name: 'Anjali Verma', rollNo: '001' },
      { id: 7, name: 'Rohan Gupta', rollNo: '002' },
      { id: 8, name: 'Kavya Reddy', rollNo: '003' },
      { id: 9, name: 'Arjun Nair', rollNo: '004' }
    ],
    3: [
      { id: 10, name: 'Meera Shah', rollNo: '001' },
      { id: 11, name: 'Karan Mehta', rollNo: '002' },
      { id: 12, name: 'Divya Iyer', rollNo: '003' }
    ],
    4: [
      { id: 13, name: 'Ravi Kumar', rollNo: '001' },
      { id: 14, name: 'Sita Devi', rollNo: '002' },
      { id: 15, name: 'Amit Joshi', rollNo: '003' },
      { id: 16, name: 'Pooja Rao', rollNo: '004' }
    ]
  });

  // State management
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [testDate, setTestDate] = useState('');
  const [totalMarks, setTotalMarks] = useState('');
  const [marks, setMarks] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Get available subjects for selected class
  const availableSubjects = selectedClass ? subjectsData[selectedClass] || [] : [];
  
  // Get students for selected class
  const students = selectedClass ? studentsData[selectedClass] || [] : [];

  const getClassName = (classId) => {
    const cls = classes.find(c => c.id === parseInt(classId));
    return cls ? `${cls.name} - ${cls.section}` : '';
  };

  const getSubjectName = (subjectId) => {
    const subject = availableSubjects.find(s => s.id === parseInt(subjectId));
    return subject ? subject.name : '';
  };

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    setSelectedSubject('');
    setTestDate('');
    setTotalMarks('');
    setMarks({});
    setIsSaved(false);
    setIsEditing(false);
  };

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
    setTestDate('');
    setTotalMarks('');
    setMarks({});
    setIsSaved(false);
    setIsEditing(false);
  };

  const handleTestDateChange = (e) => {
    setTestDate(e.target.value);
    setTotalMarks('');
    setMarks({});
    setIsSaved(false);
    setIsEditing(false);
  };

  const handleTotalMarksChange = (e) => {
    setTotalMarks(e.target.value);
    setMarks({});
    setIsSaved(false);
  };

  const handleMarkChange = (studentId, value) => {
    const numValue = value === '' ? '' : parseFloat(value);
    
    // Validate marks
    if (numValue !== '' && (numValue < 0 || numValue > parseFloat(totalMarks))) {
      return;
    }

    setMarks(prev => ({
      ...prev,
      [studentId]: value
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
    setIsSaved(true);
    setIsEditing(false);

    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const handleUpdate = () => {
    setIsEditing(true);
    setIsSaved(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete these test marks? This action cannot be undone.')) {
      setMarks({});
      setIsSaved(false);
      setIsEditing(false);
      setShowSuccess(false);
    }
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
                >
                  <option value="">Choose Class...</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} - {cls.section}
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
                  disabled={!selectedClass}
                >
                  <option value="">Choose Subject...</option>
                  {availableSubjects.map(subject => (
                    <option key={subject.id} value={subject.id}>
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
                    disabled={!selectedSubject}
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
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Enter total marks"
                  min="1"
                  disabled={!testDate}
                />
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
                    {getClassName(selectedClass)} - {getSubjectName(selectedSubject)} - {new Date(testDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
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
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-900 dark:text-gray-100">
                      Obtained Marks
                      <div className="text-xs font-normal text-gray-500 dark:text-gray-400 mt-1">(Out of {totalMarks})</div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {students.length > 0 ? (
                    students.map((student, index) => (
                      <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center justify-center w-10 h-10 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg font-bold">
                            {index + 1}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-gray-100">{student.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Roll No: {student.rollNo}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            <input
                              type="number"
                              value={marks[student.id] || ''}
                              onChange={(e) => handleMarkChange(student.id, e.target.value)}
                              className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                              placeholder="0"
                              min="0"
                              max={totalMarks}
                              step="0.5"
                              disabled={isSaved && !isEditing}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-6 py-12 text-center">
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
                      <p>• Leave blank if marks are not available</p>
                    </div>
                    <button
                      onClick={handleSaveMarks}
                      className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-xl hover:from-purple-700 hover:to-indigo-800 transition-all shadow-lg hover:shadow-xl font-semibold"
                    >
                      <Save className="w-5 h-5" />
                      <span>Save Test Marks</span>
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
                        <p className="text-sm text-gray-600 dark:text-gray-400">You can update or delete these marks</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={handleUpdate}
                        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-700 text-white rounded-xl hover:from-blue-700 hover:to-cyan-800 transition-all shadow-lg hover:shadow-xl font-semibold"
                      >
                        <Edit2 className="w-5 h-5" />
                        <span>Update</span>
                      </button>
                      <button
                        onClick={handleDelete}
                        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl font-semibold"
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
            <p className="text-gray-500 dark:text-gray-400">Please fill in all the required fields above to start entering test marks</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageTest;
