import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Home,
  ChevronRight,
  Search,
  Filter,
  List,
  CheckCircle2,
  X,
  Loader2,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getAllChapters,
  createChapter,
  updateChapter,
  deleteChapter,
  getChapterStats,
  getDropdownData
} from '../../../../services/questionPaperApi';

const SubjectChapters = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [chapters, setChapters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [stats, setStats] = useState({
    totalChapters: 0,
    totalTopics: 0,
    totalQuestions: 0,
    totalMarks: 0
  });

  const [filters, setFilters] = useState({
    subject: '',
    search: '',
    status: 'active',
    page: 1,
    limit: 10
  });

  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1
  });

  const [showModal, setShowModal] = useState(false);
  const [editingChapter, setEditingChapter] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Delete confirmation dialog state
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    chapterId: null,
    chapterTitle: '',
    chapterNumber: ''
  });

  const [formData, setFormData] = useState({
    subject: '',
    chapterNumber: '',
    title: '',
    topics: '',
    description: ''
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadData();
  }, [filters]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await getAllChapters(filters);
      setChapters(response.data);
      setPagination({
        total: response.total,
        totalPages: response.totalPages,
        currentPage: response.currentPage
      });

      if (subjects.length === 0) {
        const dropdownData = await getDropdownData();
        setSubjects(dropdownData.subjects);
      }
    } catch (error) {
      console.error('Failed to load chapters:', error);
      toast.error('Failed to load chapters. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      setLoadingStats(true);
      const statsData = await getChapterStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load statistics:', error);
      toast.error('Failed to load statistics.');
    } finally {
      setLoadingStats(false);
    }
  };

  const handleOpenModal = (chapter = null) => {
    if (chapter) {
      setEditingChapter(chapter);
      setFormData({
        subject: chapter.subject?._id || chapter.subject,
        chapterNumber: chapter.chapterNumber.toString(),
        title: chapter.title,
        topics: chapter.topics.toString(),
        description: chapter.description || ''
      });
    } else {
      setEditingChapter(null);
      setFormData({
        subject: filters.subject || '',
        chapterNumber: '',
        title: '',
        topics: '',
        description: ''
      });
    }
    setFormErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingChapter(null);
    setFormData({
      subject: '',
      chapterNumber: '',
      title: '',
      topics: '',
      description: ''
    });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.subject) errors.subject = 'Subject is required';
    if (!formData.chapterNumber || parseInt(formData.chapterNumber) < 1) 
      errors.chapterNumber = 'Valid chapter number is required';
    if (!formData.title.trim()) errors.title = 'Chapter title is required';
    if (!formData.topics || parseInt(formData.topics) < 1) 
      errors.topics = 'Valid number of topics is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setFormLoading(true);

    try {
      const chapterData = {
        subject: formData.subject,
        chapterNumber: parseInt(formData.chapterNumber),
        title: formData.title.trim(),
        topics: parseInt(formData.topics),
        description: formData.description?.trim() || ''
      };

      if (editingChapter) {
        await updateChapter(editingChapter._id, chapterData);
        toast.success('Chapter updated successfully!');
      } else {
        await createChapter(chapterData);
        toast.success('Chapter added successfully!');
      }

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        handleCloseModal();
        loadData();
        loadStats();
      }, 1500);
    } catch (error) {
      console.error('Error saving chapter:', error);
      toast.error(error.message || 'Failed to save chapter. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    // Find the chapter details for confirmation dialog
    const chapter = chapters.find(ch => ch._id === id);
    if (chapter) {
      setDeleteConfirm({
        show: true,
        chapterId: id,
        chapterTitle: chapter.title,
        chapterNumber: chapter.chapterNumber
      });
    }
  };

  const confirmDelete = async () => {
    try {
      setDeleteLoading(true);
      await deleteChapter(deleteConfirm.chapterId);
      await loadData();
      await loadStats();
      toast.success('Chapter deleted successfully');
    } catch (error) {
      console.error('Failed to delete chapter:', error);
      toast.error(error.message || 'Failed to delete chapter. Please check if it has questions.');
    } finally {
      setDeleteLoading(false);
      setDeleteConfirm({ show: false, chapterId: null, chapterTitle: '', chapterNumber: '' });
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm({ show: false, chapterId: null, chapterTitle: '', chapterNumber: '' });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const getSubjectName = (subjectId) => {
    const subject = subjects.find(s => s._id === subjectId);
    return subject ? subject.name : 'Unknown';
  };

  const totalChapters = pagination.total;
  const totalTopics = chapters.reduce((sum, ch) => sum + (ch.topics || 0), 0);
  const totalQuestions = chapters.reduce((sum, ch) => sum + (ch.questionCount || 0), 0);
  const totalMarks = chapters.reduce((sum, ch) => sum + (ch.totalMarks || 0), 0);

  if (loading && chapters.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading chapters...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600" />
          <button
            onClick={() => navigate('/dashboard/question-paper/bank')}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
          >
            Question Paper
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600" />
          <span className="text-gray-900 dark:text-white font-semibold">Subject Chapters</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <span>Subject Chapters</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Manage chapters and topics for each subject</p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all shadow-lg hover:shadow-xl font-semibold dark:from-blue-700 dark:to-indigo-800 dark:hover:from-blue-800 dark:hover:to-indigo-900"
            >
              <Plus className="w-5 h-5" />
              <span>Add Chapter</span>
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Subjects</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{subjects.length}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Chapters</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{totalChapters}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 rounded-2xl flex items-center justify-center">
                <List className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Topics</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{totalTopics}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 rounded-2xl flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Questions</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{totalQuestions}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/40 dark:to-orange-800/40 rounded-2xl flex items-center justify-center">
                <Filter className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Filter by Subject
              </label>
              <select
                value={filters.subject}
                onChange={(e) => handleFilterChange('subject', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="" className="dark:bg-gray-700">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject._id} value={subject._id} className="dark:bg-gray-700">
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Search Chapters
              </label>
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Search by chapter title..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Chapters Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">Chapter #</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">Subject</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">Chapter Title</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-900 dark:text-white">Topics</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-900 dark:text-white">Questions</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-900 dark:text-white">Total Marks</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <Loader2 className="w-8 h-8 text-gray-400 dark:text-gray-600 animate-spin mx-auto mb-3" />
                      <p className="text-gray-500 dark:text-gray-400">Loading chapters...</p>
                    </td>
                  </tr>
                ) : chapters.length > 0 ? (
                  chapters.map((chapter) => (
                    <tr key={chapter._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-700 rounded-lg font-bold dark:bg-blue-900/30 dark:text-blue-300">
                          {chapter.chapterNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900 dark:text-white">{getSubjectName(chapter.subject?._id || chapter.subject)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <span className="text-gray-900 dark:text-white font-medium">{chapter.title}</span>
                          {chapter.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{chapter.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                          {chapter.topics}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                          {chapter.questionCount || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                          {chapter.totalMarks || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleOpenModal(chapter)}
                            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                            title="Edit chapter"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(chapter._id)}
                            disabled={deleteLoading}
                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
                            title="Delete chapter"
                          >
                            {deleteLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-500 dark:text-gray-400">No chapters found</p>
                      <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                        {filters.subject ? 'Try changing the filter' : 'Add your first chapter'}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {chapters.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {((filters.page - 1) * filters.limit) + 1} to {Math.min(filters.page * filters.limit, pagination.total)} of {pagination.total} chapters
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleFilterChange('page', Math.max(1, pagination.currentPage - 1))}
                  disabled={pagination.currentPage === 1}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => handleFilterChange('page', Math.min(pagination.totalPages, pagination.currentPage + 1))}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {editingChapter ? 'Edit Chapter' : 'Add New Chapter'}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                    disabled={formLoading}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className={`w-full px-4 py-2.5 border ${formErrors.subject ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    disabled={formLoading}
                  >
                    <option value="" className="dark:bg-gray-700">Select Subject</option>
                    {subjects.map(subject => (
                      <option key={subject._id} value={subject._id} className="dark:bg-gray-700">
                        {subject.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.subject && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.subject}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Chapter Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.chapterNumber}
                    onChange={(e) => setFormData({...formData, chapterNumber: e.target.value})}
                    className={`w-full px-4 py-2.5 border ${formErrors.chapterNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    placeholder="e.g., 1"
                    min="1"
                    disabled={formLoading}
                  />
                  {formErrors.chapterNumber && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.chapterNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Chapter Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className={`w-full px-4 py-2.5 border ${formErrors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    placeholder="e.g., Real Numbers"
                    disabled={formLoading}
                  />
                  {formErrors.title && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Number of Topics <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.topics}
                    onChange={(e) => setFormData({...formData, topics: e.target.value})}
                    className={`w-full px-4 py-2.5 border ${formErrors.topics ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    placeholder="e.g., 5"
                    min="1"
                    disabled={formLoading}
                  />
                  {formErrors.topics && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.topics}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Description <span className="text-gray-400 dark:text-gray-500 text-xs">(Optional)</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 min-h-[80px] resize-y bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Brief description of the chapter..."
                    disabled={formLoading}
                  />
                </div>

                {showSuccess && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <p className="text-green-900 dark:text-green-200 font-semibold">
                      Chapter {editingChapter ? 'updated' : 'added'} successfully!
                    </p>
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-semibold disabled:opacity-50"
                    disabled={formLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all shadow-lg font-semibold disabled:opacity-50 flex items-center justify-center dark:from-blue-700 dark:to-indigo-800 dark:hover:from-blue-800 dark:hover:to-indigo-900"
                  >
                    {formLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        {editingChapter ? 'Updating...' : 'Adding...'}
                      </>
                    ) : (
                      editingChapter ? 'Update Chapter' : 'Add Chapter'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {deleteConfirm.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Delete Chapter</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">This action cannot be undone</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="text-gray-700 dark:text-gray-300">
                    Are you sure you want to delete the chapter:
                  </p>
                  <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      Chapter {deleteConfirm.chapterNumber}: {deleteConfirm.chapterTitle}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    All associated questions and data will be permanently removed.
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={cancelDelete}
                    className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-semibold"
                    disabled={deleteLoading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Deleting...</span>
                      </div>
                    ) : (
                      'Delete Chapter'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectChapters;