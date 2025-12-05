import React, { useState, useEffect } from 'react';
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
  Filter,
  Loader,
  AlertCircle,
  Download,
  Paperclip
} from 'lucide-react';
import { homeworkApi } from '../../../../services/homeworkApi';
import { subjectApi, getAllSubjects } from '../../../../services/subjectApi';
import { classApi } from '../../../../services/classApi';
import { employeesApi } from '../../../../services/employeesApi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HomeWork = () => {
  const navigate = useNavigate();

  // State for data
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [homeworks, setHomeworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    priorityStats: [],
    recentHomeworks: 0
  });

  // Filter states
  const [filters, setFilters] = useState({
    date: '',
    class: '',
    teacher: '',
    subject: '',
    status: 'all',
    search: ''
  });

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingHomework, setEditingHomework] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    dueDate: '',
    class: '',
    section: 'A',
    subject: '',
    teacher: '',
    details: '',
    priority: 'medium',
    status: 'active'
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch initial data
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Fetch data when filters change
  useEffect(() => {
    if (!loading) {
      fetchHomeworks();
    }
  }, [filters, pagination.page]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      
      let fetchedClasses = [];
      let fetchedTeachers = [];
      let fetchedSubjects = [];

      // Try to fetch dropdown data first
      try {
        const dropdownResponse = await homeworkApi.getDropdownData();
        if (dropdownResponse && dropdownResponse.success && dropdownResponse.data) {
          fetchedClasses = dropdownResponse.data?.classes || [];
          fetchedTeachers = dropdownResponse.data?.teachers || [];
          fetchedSubjects = dropdownResponse.data?.subjects || [];
        }
      } catch (dropdownError) {
        console.warn('Dropdown endpoint failed, trying individual endpoints:', dropdownError);
      }

      // Fallback: Fetch classes individually if not from dropdown
      if (fetchedClasses.length === 0) {
        try {
          const classesResponse = await classApi.getAllClasses();
          fetchedClasses = classesResponse.data || [];
        } catch (classError) {
          console.error('Error fetching classes:', classError);
        }
      }

      // Fallback: Fetch teachers individually if not from dropdown
      if (fetchedTeachers.length === 0) {
        try {
          const teachersResponse = await employeesApi.getEmployees({ role: 'Teacher' });
          fetchedTeachers = teachersResponse.data || [];
        } catch (teacherError) {
          console.error('Error fetching teachers:', teacherError);
        }
      }

      // Fallback: Fetch subjects individually if not from dropdown
      if (fetchedSubjects.length === 0) {
        try {
          const subjectsResponse = await subjectApi.getAllSubjects();
          fetchedSubjects = subjectsResponse.data || [];
        } catch (subjectError) {
          console.error('Error fetching subjects:', subjectError);
          toast.error('Failed to load subjects. Please refresh the page.');
        }
      }

      // Set the fetched data
      setClasses(fetchedClasses);
      setTeachers(fetchedTeachers);
      setSubjects(fetchedSubjects);

      // Fetch statistics
      try {
        const statsResponse = await homeworkApi.getHomeworkStats();
        if (statsResponse && statsResponse.success) {
          setStats(statsResponse.data);
        }
      } catch (statsError) {
        console.error('Error fetching stats:', statsError);
        // Don't fail on stats error
      }

      // Fetch homeworks
      await fetchHomeworks();
      
    } catch (error) {
      console.error('Error fetching initial data:', error);
      toast.error('Failed to load data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const fetchHomeworks = async () => {
    try {
      const params = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      };

      const response = await homeworkApi.getHomeworks(params);
      
      if (response.success) {
        setHomeworks(response.data);
        setPagination({
          page: response.currentPage,
          limit: response.limit,
          total: response.total,
          totalPages: response.totalPages
        });
      }
    } catch (error) {
      console.error('Error fetching homeworks:', error);
      toast.error('Failed to load homeworks');
    }
  };

  // Handler functions
  const handleAddHomework = () => {
    setEditingHomework(null);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    setFormData({
      title: '',
      date: new Date().toISOString().split('T')[0],
      dueDate: tomorrow.toISOString().split('T')[0],
      class: '',
      section: 'A',
      subject: '',
      teacher: '',
      details: '',
      priority: 'medium',
      status: 'active'
    });
    setShowAddModal(true);
  };

  const handleEditHomework = (homework) => {
    setEditingHomework(homework);
    setFormData({
      title: homework.title || '',
      date: homework.date ? homework.date.split('T')[0] : '',
      dueDate: homework.dueDate ? homework.dueDate.split('T')[0] : '',
      class: homework.class?._id || homework.class || '',
      section: homework.section || 'A',
      subject: homework.subject?._id || homework.subject || '',
      teacher: homework.teacher?._id || homework.teacher || '',
      details: homework.details || '',
      priority: homework.priority || 'medium',
      status: homework.status || 'active'
    });
    setShowAddModal(true);
  };

  const handleDeleteHomework = async (id) => {
    if (window.confirm('Are you sure you want to delete this homework?')) {
      try {
        const result = await homeworkApi.deleteHomework(id);
        if (result.success) {
          toast.success('Homework deleted successfully');
          await fetchHomeworks();
          // Refresh stats
          const statsResponse = await homeworkApi.getHomeworkStats();
          if (statsResponse.success) {
            setStats(statsResponse.data);
          }
        }
      } catch (error) {
        toast.error(error.message || 'Failed to delete homework');
      }
    }
  };

  const handleBulkDelete = async (ids) => {
    if (window.confirm(`Are you sure you want to delete ${ids.length} homeworks?`)) {
      try {
        const result = await homeworkApi.bulkDeleteHomeworks(ids);
        if (result.success) {
          toast.success(result.message);
          await fetchHomeworks();
          // Refresh stats
          const statsResponse = await homeworkApi.getHomeworkStats();
          if (statsResponse.success) {
            setStats(statsResponse.data);
          }
        }
      } catch (error) {
        toast.error(error.message || 'Failed to delete homeworks');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.class || !formData.subject || !formData.teacher || !formData.details || !formData.date) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    try {
      const homeworkData = {
        ...formData,
        title: formData.title || `Homework - ${formData.date}`
      };

      if (editingHomework) {
        // Update existing homework
        const result = await homeworkApi.updateHomework(editingHomework._id, homeworkData);
        if (result.success) {
          toast.success('Homework updated successfully');
          setShowAddModal(false);
          setEditingHomework(null);
          setFormData({
            title: '',
            date: new Date().toISOString().split('T')[0],
            dueDate: '',
            class: '',
            section: 'A',
            subject: '',
            teacher: '',
            details: '',
            priority: 'medium',
            status: 'active'
          });
          await fetchHomeworks();
          // Refresh stats
          const statsResponse = await homeworkApi.getHomeworkStats();
          if (statsResponse.success) {
            setStats(statsResponse.data);
          }
        }
      } else {
        // Add new homework
        const result = await homeworkApi.createHomework(homeworkData);
        if (result.success) {
          toast.success('Homework created successfully');
          setShowAddModal(false);
          setFormData({
            title: '',
            date: new Date().toISOString().split('T')[0],
            dueDate: '',
            class: '',
            section: 'A',
            subject: '',
            teacher: '',
            details: '',
            priority: 'medium',
            status: 'active'
          });
          await fetchHomeworks();
          // Refresh stats
          const statsResponse = await homeworkApi.getHomeworkStats();
          if (statsResponse.success) {
            setStats(statsResponse.data);
          }
        }
      }
    } catch (error) {
      console.error('Error saving homework:', error);
      toast.error(error.message || 'Failed to save homework');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClearFilters = () => {
    setFilters({
      date: '',
      class: '',
      teacher: '',
      subject: '',
      status: 'all',
      search: ''
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  // Helper functions
  const getTeacherName = (teacher) => {
    if (!teacher) return 'Unknown';
    if (typeof teacher === 'object') return teacher.employeeName;
    return teachers.find(t => t._id === teacher)?.employeeName || 'Unknown';
  };

  const getClassName = (classObj) => {
    if (!classObj) return 'Unknown';
    if (typeof classObj === 'object') return `${classObj.className} - ${classObj.section}`;
    const cls = classes.find(c => c._id === classObj);
    return cls ? `${cls.className} - ${cls.section}` : 'Unknown';
  };

  const getSubjectName = (subject) => {
    if (!subject) return 'Unknown';
    if (typeof subject === 'object') return subject.name;
    return subjects.find(s => s._id === subject)?.name || 'Unknown';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-600';
      case 'medium': return 'bg-yellow-100 text-yellow-600';
      case 'low': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-600';
      case 'completed': return 'bg-green-100 text-green-600';
      case 'cancelled': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const activeFiltersCount = Object.values(filters).filter(v => 
    v !== '' && v !== 'all'
  ).length;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading homework data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      
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
          <span className="text-blue-600 font-semibold">Timetable</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-semibold">Homework Management</span>
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
              disabled={submitting}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5" />
              <span className="font-semibold">Add Homework</span>
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Homework</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{stats.total}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Active</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{stats.active}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Completed</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{stats.completed}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center">
                <Save className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">This Week</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{stats.recentHomeworks}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center">
                <Calendar className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Filtered</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{homeworks.length}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl flex items-center justify-center">
                <Filter className="w-8 h-8 text-pink-600" />
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
            <div className="flex items-center space-x-4">
              {activeFiltersCount > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-red-600 hover:text-red-700 font-semibold flex items-center space-x-1"
                >
                  <X className="w-4 h-4" />
                  <span>Clear Filters</span>
                </button>
              )}
              <div className="text-sm text-gray-600">
                {pagination.total} total homeworks
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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
                    <option key={cls._id} value={cls._id}>
                      {cls.className} - {cls.section}
                    </option>
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
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.employeeName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <div className="relative">
                <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Subject
              </label>
              <div className="relative">
                <BookOpen className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={filters.subject}
                  onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                >
                  <option value="">All Subjects</option>
                  {subjects.map(subject => (
                    <option key={subject._id} value={subject._id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search Homework Details
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  placeholder="Search in homework details..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Homework List */}
        {homeworks.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 mb-8">
              {homeworks.map((homework) => (
                <div
                  key={homework._id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${getPriorityColor(homework.priority)}`}>
                          <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">
                            {homework.title || `Homework - ${formatDate(homework.date)}`}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-sm text-gray-600">
                              {getClassName(homework.class)}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="text-sm text-gray-600">
                              {getSubjectName(homework.subject)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(homework.status)}`}>
                          {homework.status.charAt(0).toUpperCase() + homework.status.slice(1)}
                        </span>
                        <button
                          onClick={() => handleEditHomework(homework)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit3 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteHomework(homework._id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Homework Date</p>
                          <p className="font-semibold text-gray-900">{formatDate(homework.date)}</p>
                          {homework.dueDate && (
                            <p className="text-xs text-gray-500 mt-1">
                              Due: {formatDate(homework.dueDate)}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <GraduationCap className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Set By</p>
                          <p className="font-semibold text-gray-900">{getTeacherName(homework.teacher)}</p>
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

                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Priority</p>
                          <p className="font-semibold text-gray-900 capitalize">{homework.priority}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-4">
                      <div className="flex items-start space-x-2">
                        <FileText className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                            Homework Details
                          </p>
                          <p className="text-gray-900 leading-relaxed whitespace-pre-line">{homework.details}</p>
                        </div>
                      </div>
                    </div>

                    {homework.attachments && homework.attachments.length > 0 && (
                      <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <Paperclip className="w-5 h-5 text-yellow-600" />
                          <p className="text-xs font-semibold text-yellow-600 uppercase tracking-wide">
                            Attachments ({homework.attachments.length})
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {homework.attachments.map((attachment, index) => (
                            <a
                              key={index}
                              href={attachment.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 px-3 py-2 bg-white rounded-lg border border-yellow-200 hover:bg-yellow-50 transition-colors"
                            >
                              <Download className="w-4 h-4 text-yellow-600" />
                              <span className="text-sm text-gray-700 truncate max-w-[200px]">
                                {attachment.fileName}
                              </span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
                <div className="text-sm text-gray-600">
                  Showing page {pagination.page} of {pagination.totalPages} • {pagination.total} total homeworks
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 rounded-lg ${
                            pagination.page === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'border border-gray-300 hover:bg-gray-50'
                          } transition-colors`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-16 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              {activeFiltersCount > 0 ? (
                <AlertCircle className="w-10 h-10 text-gray-400" />
              ) : (
                <BookOpen className="w-10 h-10 text-gray-400" />
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {activeFiltersCount > 0 ? 'No Homework Found' : 'No Homework Yet'}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              {activeFiltersCount > 0 
                ? 'No homework matches your search criteria. Try adjusting the filters.' 
                : 'Get started by adding homework assignments for your students.'}
            </p>
            <button
              onClick={handleAddHomework}
              disabled={submitting}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
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
                      Homework Title (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Chapter 5 Exercises"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>
                </div>

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
                      Due Date (Optional)
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
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
                          <option key={cls._id} value={cls._id}>
                            {cls.className} - {cls.section}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Section
                    </label>
                    <select
                      value={formData.section}
                      onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                    >
                      <option value="A">Section A</option>
                      <option value="B">Section B</option>
                      <option value="C">Section C</option>
                      <option value="D">Section D</option>
                      <option value="E">Section E</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                          <option key={subject._id} value={subject._id}>
                            {subject.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Teacher <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <select
                        value={formData.teacher}
                        onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                        required
                      >
                        <option value="">Select teacher...</option>
                        {teachers.map(teacher => (
                          <option key={teacher._id} value={teacher._id}>
                            {teacher.employeeName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
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
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[150px] resize-y"
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
                    disabled={submitting}
                    className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <Loader className="w-5 h-5 animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    <span>{editingHomework ? 'Update Homework' : 'Add Homework'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    disabled={submitting}
                    className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
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