import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen,
  Plus,
  Search,
  Edit3,
  Trash2,
  Save,
  X,
  Home,
  ChevronRight,
  Calendar,
  Users,
  GraduationCap,
  FileText,
  Clock,
  Filter
} from 'lucide-react';

const HomeWork = () => {
  const navigate = useNavigate();

  // Sample data - in real app, this would come from API
  const [classes] = useState([
    { id: 1, name: 'Grade 10 - A' },
    { id: 2, name: 'Grade 10 - B' },
    { id: 3, name: 'Grade 11 - A' },
    { id: 4, name: 'Grade 11 - B' }
  ]);

  const [teachers] = useState([
    { id: 1, name: 'Dr. Sharma', subject: 'Mathematics' },
    { id: 2, name: 'Prof. Kumar', subject: 'Physics' },
    { id: 3, name: 'Ms. Patel', subject: 'Chemistry' },
    { id: 4, name: 'Mr. Singh', subject: 'English' },
    { id: 5, name: 'Dr. Verma', subject: 'History' }
  ]);

  const [subjects] = useState([
    { id: 1, name: 'Mathematics' },
    { id: 2, name: 'Physics' },
    { id: 3, name: 'Chemistry' },
    { id: 4, name: 'English' },
    { id: 5, name: 'History' },
    { id: 6, name: 'Computer Science' }
  ]);

  const [homeworks, setHomeworks] = useState([
    {
      id: 1,
      date: '2024-11-10',
      setBy: 1,
      class: 1,
      subject: 1,
      details: 'Complete exercises 1-10 from Chapter 5: Quadratic Equations. Show all working steps.',
      createdAt: '2024-11-09'
    },
    {
      id: 2,
      date: '2024-11-11',
      setBy: 2,
      class: 1,
      subject: 2,
      details: 'Write a lab report on the Newton\'s Laws experiment conducted in class.',
      createdAt: '2024-11-09'
    },
    {
      id: 3,
      date: '2024-11-10',
      setBy: 4,
      class: 2,
      subject: 4,
      details: 'Read Chapter 3 and write a summary of 500 words on the main themes.',
      createdAt: '2024-11-08'
    }
  ]);

  // Filter states
  const [filters, setFilters] = useState({
    date: '',
    class: '',
    teacher: ''
  });

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingHomework, setEditingHomework] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    setBy: '',
    class: '',
    subject: '',
    details: ''
  });

  // Filter homeworks based on selected filters
  const filteredHomeworks = homeworks.filter(hw => {
    const matchesDate = !filters.date || hw.date === filters.date;
    const matchesClass = !filters.class || hw.class === parseInt(filters.class);
    const matchesTeacher = !filters.teacher || hw.setBy === parseInt(filters.teacher);
    return matchesDate && matchesClass && matchesTeacher;
  });

  const handleAddHomework = () => {
    setEditingHomework(null);
    setFormData({
      date: '',
      setBy: '',
      class: '',
      subject: '',
      details: ''
    });
    setShowAddModal(true);
  };

  const handleEditHomework = (homework) => {
    setEditingHomework(homework);
    setFormData({
      date: homework.date,
      setBy: homework.setBy,
      class: homework.class,
      subject: homework.subject,
      details: homework.details
    });
    setShowAddModal(true);
  };

  const handleDeleteHomework = (id) => {
    if (window.confirm('Are you sure you want to delete this homework?')) {
      setHomeworks(prev => prev.filter(hw => hw.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingHomework) {
      // Update existing homework
      setHomeworks(prev => prev.map(hw =>
        hw.id === editingHomework.id
          ? {
              ...hw,
              ...formData,
              setBy: parseInt(formData.setBy),
              class: parseInt(formData.class),
              subject: parseInt(formData.subject)
            }
          : hw
      ));
    } else {
      // Add new homework
      const newHomework = {
        id: Date.now(),
        ...formData,
        setBy: parseInt(formData.setBy),
        class: parseInt(formData.class),
        subject: parseInt(formData.subject),
        createdAt: new Date().toISOString().split('T')[0]
      };
      setHomeworks(prev => [...prev, newHomework]);
    }

    setShowAddModal(false);
    setFormData({
      date: '',
      setBy: '',
      class: '',
      subject: '',
      details: ''
    });
  };

  const handleCancel = () => {
    setShowAddModal(false);
    setEditingHomework(null);
    setFormData({
      date: '',
      setBy: '',
      class: '',
      subject: '',
      details: ''
    });
  };

  const handleClearFilters = () => {
    setFilters({
      date: '',
      class: '',
      teacher: ''
    });
  };

  const getTeacherName = (teacherId) => {
    return teachers.find(t => t.id === teacherId)?.name || 'Unknown';
  };

  const getClassName = (classId) => {
    return classes.find(c => c.id === classId)?.name || 'Unknown';
  };

  const getSubjectName = (subjectId) => {
    return subjects.find(s => s.id === subjectId)?.name || 'Unknown';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const activeFiltersCount = Object.values(filters).filter(v => v !== '').length;

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
          <span className="text-blue-600 font-semibold">Homework</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-semibold">Manage Homework</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Homework Management</h1>
              <p className="text-gray-600 mt-1">Assign and manage homework for students</p>
            </div>
            <button
              onClick={handleAddHomework}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              <span className="font-semibold">Add Homework</span>
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Homework</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{homeworks.length}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Filtered Results</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{filteredHomeworks.length}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center">
                <Search className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Active Filters</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{activeFiltersCount}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center">
                <Filter className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
              <Filter className="w-5 h-5 text-blue-600" />
              <span>Search Filters</span>
            </h2>
            {activeFiltersCount > 0 && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-red-600 hover:text-red-700 font-semibold flex items-center space-x-1"
              >
                <X className="w-4 h-4" />
                <span>Clear Filters</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Homework Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={filters.date}
                  onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Class
              </label>
              <div className="relative">
                <Users className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={filters.class}
                  onChange={(e) => setFilters({ ...filters, class: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                >
                  <option value="">All Classes</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Teacher
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={filters.teacher}
                  onChange={(e) => setFilters({ ...filters, teacher: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                >
                  <option value="">All Teachers</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name} ({teacher.subject})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Homework List */}
        {filteredHomeworks.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {filteredHomeworks.map((homework) => (
              <div
                key={homework.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">
                          {getSubjectName(homework.subject)}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {getClassName(homework.class)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditHomework(homework)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteHomework(homework.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Homework Date</p>
                        <p className="font-semibold text-gray-900">{formatDate(homework.date)}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Set By</p>
                        <p className="font-semibold text-gray-900">{getTeacherName(homework.setBy)}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Created On</p>
                        <p className="font-semibold text-gray-900">{formatDate(homework.createdAt)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-start space-x-2">
                      <FileText className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                          Homework Details
                        </p>
                        <p className="text-gray-900 leading-relaxed">{homework.details}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-16 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Homework Found</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              {activeFiltersCount > 0 
                ? 'No homework matches your search criteria. Try adjusting the filters.' 
                : 'Get started by adding homework assignments for your students.'}
            </p>
            <button
              onClick={handleAddHomework}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              <Plus className="w-5 h-5" />
              <span>Add Homework</span>
            </button>
          </div>
        )}

        {/* Add/Edit Homework Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingHomework ? 'Edit Homework' : 'Add Homework'}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {editingHomework ? 'Update homework details' : 'Create a new homework assignment'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Homework Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Set By (Teacher) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <select
                        value={formData.setBy}
                        onChange={(e) => setFormData({ ...formData, setBy: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                        required
                      >
                        <option value="">Select teacher...</option>
                        {teachers.map(teacher => (
                          <option key={teacher.id} value={teacher.id}>
                            {teacher.name} ({teacher.subject})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Class <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Users className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <select
                        value={formData.class}
                        onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                        required
                      >
                        <option value="">Select class...</option>
                        {classes.map(cls => (
                          <option key={cls.id} value={cls.id}>
                            {cls.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <BookOpen className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                        required
                      >
                        <option value="">Select subject...</option>
                        {subjects.map(subject => (
                          <option key={subject.id} value={subject.id}>
                            {subject.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Homework Details <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <textarea
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px] resize-y"
                      placeholder="Enter detailed homework instructions..."
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Provide clear and detailed instructions for the homework assignment.
                  </p>
                </div>

                <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg font-semibold"
                  >
                    <Save className="w-5 h-5" />
                    <span>{editingHomework ? 'Update Homework' : 'Add Homework'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-semibold"
                  >
                    <X className="w-5 h-5" />
                    <span>Cancel</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeWork;
