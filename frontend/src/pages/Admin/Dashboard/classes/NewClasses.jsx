import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Users, 
  BookOpen, 
  Clock,
  Calendar,
  User,
  MapPin,
  DollarSign,
  Save,
  X,
  Upload,
  Trash2,
  Home,
  ChevronRight,
  GraduationCap,
  ArrowLeft
} from 'lucide-react';

const NewClasses = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    // Basic Information
    className: '',
    section: '',
    subject: '',
    teacher: '',
    room: '',
    
    // Schedule
    scheduleType: 'regular',
    startDate: '',
    endDate: '',
    days: [],
    startTime: '',
    endTime: '',
    
    // Students
    maxStudents: '',
    studentList: [],
    
    // Fees
    feeType: 'free',
    amount: '',
    currency: 'USD',
    
    // Resources
    description: '',
    materials: []
  });

  const daysOfWeek = [
    { id: 'monday', label: 'Monday' },
    { id: 'tuesday', label: 'Tuesday' },
    { id: 'wednesday', label: 'Wednesday' },
    { id: 'thursday', label: 'Thursday' },
    { id: 'friday', label: 'Friday' },
    { id: 'saturday', label: 'Saturday' },
    { id: 'sunday', label: 'Sunday' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDayToggle = (dayId) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.includes(dayId)
        ? prev.days.filter(day => day !== dayId)
        : [...prev.days, dayId]
    }));
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setFormData(prev => ({
      ...prev,
      materials: [...prev.materials, ...files.map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        type: file.type,
        size: file.size,
        file
      }))]
    }));
  };

  const handleRemoveFile = (fileId) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.filter(file => file.id !== fileId)
    }));
  };

  const handleSubmit = () => {
    // Validation
    if (!formData.className || !formData.section || !formData.subject) {
      alert('Please fill in all required fields');
      return;
    }

    // Create class object
    const newClass = {
      id: Date.now(),
      name: formData.className,
      section: formData.section,
      subject: formData.subject,
      teacher: formData.teacher || 'Not assigned',
      room: formData.room || 'TBA',
      studentCount: parseInt(formData.maxStudents) || 0,
      attendancePercentage: 0,
      schedule: {
        type: formData.scheduleType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        days: formData.days,
        startTime: formData.startTime,
        endTime: formData.endTime
      },
      fees: {
        type: formData.feeType,
        amount: formData.amount,
        currency: formData.currency
      },
      description: formData.description,
      materials: formData.materials
    };

    // Get existing classes from localStorage
    const existingClasses = JSON.parse(localStorage.getItem('classes') || '[]');
    
    // Add new class
    const updatedClasses = [...existingClasses, newClass];
    
    // Save to localStorage
    localStorage.setItem('classes', JSON.stringify(updatedClasses));

    console.log('Class created:', newClass);
    alert('Class created successfully!');
    
    // Navigate to All Classes page
    navigate('/dashboard/classes/all');
  };

  const handleReset = () => {
    setFormData({
      className: '',
      section: '',
      subject: '',
      teacher: '',
      room: '',
      scheduleType: 'regular',
      startDate: '',
      endDate: '',
      days: [],
      startTime: '',
      endTime: '',
      maxStudents: '',
      studentList: [],
      feeType: 'free',
      amount: '',
      currency: 'USD',
      description: '',
      materials: []
    });
    setActiveTab('basic');
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/40 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <button 
            onClick={() => navigate('/dashboard/classes/all')}
            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            Classes
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 dark:text-white font-semibold">New Class</span>
        </div>

        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard/classes/all')}
                className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
              <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">Create New Class</h1>
                <p className="text-gray-600 dark:text-gray-400">Add a new class to your institution</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
          {/* Progress Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('basic')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === 'basic'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Basic Info</span>
              </button>
              <button
                onClick={() => setActiveTab('schedule')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === 'schedule'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Schedule</span>
              </button>
              <button
                onClick={() => setActiveTab('students')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === 'students'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Students</span>
              </button>
              <button
                onClick={() => setActiveTab('fees')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === 'fees'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>Fees</span>
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === 'resources'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>Resources</span>
              </button>
            </nav>
          </div>

          {/* Form Content */}
          <div className="p-6">
            {/* Basic Information Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Class Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.className}
                      onChange={(e) => handleInputChange('className', e.target.value)}
                      placeholder="Enter class name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.section}
                      onChange={(e) => handleInputChange('section', e.target.value)}
                      placeholder="Enter section"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      placeholder="Enter subject"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teacher
                    </label>
                    <input
                      type="text"
                      value={formData.teacher}
                      onChange={(e) => handleInputChange('teacher', e.target.value)}
                      placeholder="Enter teacher name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Room/Location
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={formData.room}
                        onChange={(e) => handleInputChange('room', e.target.value)}
                        placeholder="Enter room number or location"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Schedule Tab */}
            {activeTab === 'schedule' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Class Schedule</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Schedule Type
                    </label>
                    <select
                      value={formData.scheduleType}
                      onChange={(e) => handleInputChange('scheduleType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="regular">Regular</option>
                      <option value="intensive">Intensive</option>
                      <option value="weekend">Weekend</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Class Days
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {daysOfWeek.map(day => (
                        <label key={day.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.days.includes(day.id)}
                            onChange={() => handleDayToggle(day.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{day.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => handleInputChange('startTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => handleInputChange('endTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Students Tab */}
            {activeTab === 'students' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Student Management</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Students
                    </label>
                    <input
                      type="number"
                      value={formData.maxStudents}
                      onChange={(e) => handleInputChange('maxStudents', e.target.value)}
                      placeholder="0"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Add Students (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm mb-4">
                        You can add students after creating the class
                      </p>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Import Students
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Fees Tab */}
            {activeTab === 'fees' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Fee Structure</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fee Type
                    </label>
                    <select
                      value={formData.feeType}
                      onChange={(e) => handleInputChange('feeType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="free">Free</option>
                      <option value="one-time">One-time Payment</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>

                  {formData.feeType !== 'free' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Amount
                        </label>
                        <div className="relative">
                          <DollarSign className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="number"
                            value={formData.amount}
                            onChange={(e) => handleInputChange('amount', e.target.value)}
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Currency
                        </label>
                        <select
                          value={formData.currency}
                          onChange={(e) => handleInputChange('currency', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                          <option value="JPY">JPY (¥)</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>

                {formData.feeType === 'free' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-green-800">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold">✓</span>
                      </div>
                      <span className="font-medium">This class will be free for students</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Resources Tab */}
            {activeTab === 'resources' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Class Resources</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter class description, objectives, or any additional information..."
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Materials
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Choose Files</span>
                    </label>
                    <p className="text-gray-500 text-sm mt-2">
                      Upload syllabus, materials, or other resources
                    </p>
                  </div>

                  {/* Uploaded Files List */}
                  {formData.materials.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">Uploaded Files:</h4>
                      {formData.materials.map(file => (
                        <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                              <span className="text-blue-600 text-xs font-medium">
                                {file.type.split('/')[1]?.toUpperCase().substring(0, 3) || 'FILE'}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{file.name}</p>
                              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveFile(file.id)}
                            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-200">
              <div>
                {activeTab !== 'basic' && (
                  <button
                    onClick={() => {
                      const tabs = ['basic', 'schedule', 'students', 'fees', 'resources'];
                      const currentIndex = tabs.indexOf(activeTab);
                      setActiveTab(tabs[currentIndex - 1]);
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleReset}
                  className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all font-semibold"
                >
                  Reset
                </button>

                {activeTab !== 'resources' ? (
                  <button
                    onClick={() => {
                      const tabs = ['basic', 'schedule', 'students', 'fees', 'resources'];
                      const currentIndex = tabs.indexOf(activeTab);
                      setActiveTab(tabs[currentIndex + 1]);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Create Class</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewClasses;