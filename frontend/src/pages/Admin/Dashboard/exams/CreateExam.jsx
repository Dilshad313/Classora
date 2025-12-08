import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardList,
  Plus,
  Edit2,
  Trash2,
  Home,
  ChevronRight,
  CheckCircle2,
  Calendar,
  Eye,
  EyeOff,
  Save,
  Loader2,
  Search,
  Filter
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import * as examAPI from '../../../../services/examsApi.js';

const CreateExam = () => {
  const navigate = useNavigate();

  // State for exams list
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    active: 0,
    upcoming: 0
  });

  // Form state
  const [formData, setFormData] = useState({
    examinationName: '',
    examName: '',
    startDate: '',
    endDate: '',
    isPublished: false
  });

  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    isPublished: 'all',
    academicYear: 'all',
    page: 1,
    limit: 10
  });

  const [editingExam, setEditingExam] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Fetch exams on component mount and when filters change
  useEffect(() => {
    fetchExams();
    fetchStats();
  }, [filters]);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const result = await examAPI.getExams(filters);
      if (result.success) {
        setExams(result.data);
      } else {
        toast.error(result.message || 'Failed to fetch exams');
      }
    } catch (error) {
      toast.error('An error occurred while fetching exams');
      console.error('Fetch exams error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const result = await examAPI.getExamStats();
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Fetch stats error:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.examinationName.trim()) {
      newErrors.examinationName = 'Examination Name is required';
    }

    if (!formData.examName.trim()) {
      newErrors.examName = 'Name of the Exam is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start Date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End Date is required';
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        newErrors.endDate = 'End Date must be after Start Date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      let result;
      if (editingExam) {
        // Update existing exam
        result = await examAPI.updateExam(editingExam._id, formData);
      } else {
        // Create new exam
        result = await examAPI.createExam(formData);
      }

      if (result.success) {
        toast.success(result.message);
        // Reset form
        setFormData({
          examinationName: '',
          examName: '',
          startDate: '',
          endDate: '',
          isPublished: false
        });
        setEditingExam(null);
        setErrors({});
        // Refresh exams list
        fetchExams();
        fetchStats();
      } else {
        toast.error(result.message || 'Operation failed');
        // Set server errors if available
        if (result.errors) {
          setErrors(result.errors);
        }
      }
    } catch (error) {
      toast.error('An error occurred while saving the exam');
      console.error('Save exam error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (exam) => {
    setEditingExam(exam);
    // Convert formatted dates to yyyy-mm-dd for input
    const [day, month, year] = exam.formattedStartDate.split('-');
    const [endDay, endMonth, endYear] = exam.formattedEndDate.split('-');
    
    setFormData({
      examinationName: exam.examinationName,
      examName: exam.examName,
      startDate: `${year}-${month}-${day}`,
      endDate: `${endYear}-${endMonth}-${endDay}`,
      isPublished: exam.isPublished
    });
    setErrors({});
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingExam(null);
    setFormData({
      examinationName: '',
      examName: '',
      startDate: '',
      endDate: '',
      isPublished: false
    });
    setErrors({});
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this exam?')) {
      return;
    }

    try {
      const result = await examAPI.deleteExam(id);
      if (result.success) {
        toast.success(result.message);
        fetchExams();
        fetchStats();
      } else {
        toast.error(result.message || 'Failed to delete exam');
      }
    } catch (error) {
      toast.error('An error occurred while deleting the exam');
      console.error('Delete exam error:', error);
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      const result = await examAPI.togglePublishStatus(id);
      if (result.success) {
        toast.success(result.message);
        fetchExams();
        fetchStats();
      } else {
        toast.error(result.message || 'Failed to toggle publish status');
      }
    } catch (error) {
      toast.error('An error occurred while updating publish status');
      console.error('Toggle publish error:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filter changes
    }));
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
          <span className="text-gray-900 font-semibold">Create Exam</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <ClipboardList className="w-6 h-6 text-white" />
            </div>
            <span>Exam Management</span>
          </h1>
          <p className="text-gray-600 mt-2">Create and manage examination schedules</p>
        </div>

        {/* Add New Exam Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <Plus className="w-6 h-6 text-indigo-600" />
              <span>{editingExam ? 'Edit Exam' : 'Add New Exam'}</span>
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {editingExam ? 'Update the exam details below' : 'Fill in the details to create a new exam'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Examination Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Examination Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="examinationName"
                  value={formData.examinationName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border ${errors.examinationName ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all`}
                  placeholder="e.g., Mid-Term Examination"
                />
                {errors.examinationName && (
                  <p className="mt-1 text-sm text-red-600">{errors.examinationName}</p>
                )}
              </div>

              {/* Name of the Exam */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Name of the Exam <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="examName"
                  value={formData.examName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border ${errors.examName ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all`}
                  placeholder="e.g., Mathematics Mid-Term"
                />
                {errors.examName && (
                  <p className="mt-1 text-sm text-red-600">{errors.examName}</p>
                )}
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2.5 border ${errors.startDate ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all`}
                  />
                </div>
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">Format: yyyy-mm-dd</p>
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  End Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2.5 border ${errors.endDate ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all`}
                  />
                </div>
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">Format: yyyy-mm-dd</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex space-x-4">
              {editingExam && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 md:flex-none px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
                  disabled={submitting}
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-xl hover:from-indigo-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                <span>{editingExam ? 'Update Exam' : 'Save Exam'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Exams</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{stats.total}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl flex items-center justify-center">
                <ClipboardList className="w-8 h-8 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Published</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{stats.published}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center">
                <Eye className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Active</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{stats.active}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
                <ClipboardList className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Upcoming</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{stats.upcoming}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center">
                <Calendar className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
            <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
              <Filter className="w-5 h-5 text-indigo-600" />
              <span>Filters</span>
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Search exams..."
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Publish Status Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Publish Status</label>
                <select
                  value={filters.isPublished}
                  onChange={(e) => handleFilterChange('isPublished', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All</option>
                  <option value="true">Published</option>
                  <option value="false">Unpublished</option>
                </select>
              </div>

              {/* Academic Year Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Academic Year</label>
                <select
                  value={filters.academicYear}
                  onChange={(e) => handleFilterChange('academicYear', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Years</option>
                  <option value="2024-2025">2024-2025</option>
                  <option value="2023-2024">2023-2024</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Exams Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
            <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
              <ClipboardList className="w-5 h-5 text-indigo-600" />
              <span>All Exams ({exams.length})</span>
            </h3>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600" />
              <p className="mt-4 text-gray-600">Loading exams...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Exam Name</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Start Date</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">End Date</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Publish</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {exams.length > 0 ? (
                    exams.map((exam) => (
                      <tr key={exam._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-900">{exam.examName}</p>
                            <p className="text-sm text-gray-500">{exam.examinationName}</p>
                            <p className="text-xs text-gray-400">Academic Year: {exam.academicYear}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2 text-gray-700">
                            <Calendar className="w-4 h-4 text-indigo-600" />
                            <span>{exam.formattedStartDate}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2 text-gray-700">
                            <Calendar className="w-4 h-4 text-indigo-600" />
                            <span>{exam.formattedEndDate}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                              exam.status === 'active' 
                                ? 'bg-green-100 text-green-700'
                                : exam.status === 'completed'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            <button
                              onClick={() => handleTogglePublish(exam._id)}
                              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                                exam.isPublished
                                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                  : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                              }`}
                            >
                              {exam.isPublished ? (
                                <>
                                  <Eye className="w-4 h-4" />
                                  <span>Published</span>
                                </>
                              ) : (
                                <>
                                  <EyeOff className="w-4 h-4" />
                                  <span>Unpublished</span>
                                </>
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => handleEdit(exam)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit exam"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(exam._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete exam"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No exams found</p>
                        <p className="text-gray-400 text-sm mt-1">Try changing your filters or create a new exam</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateExam;