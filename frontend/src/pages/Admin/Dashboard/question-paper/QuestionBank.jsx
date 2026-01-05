import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText,
  Plus,
  Edit2,
  Trash2,
  Home,
  ChevronRight,
  Search,
  Filter,
  Eye,
  Download,
  BookOpen,
  Loader2,
  X,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getAllQuestions,
  deleteQuestion,
  bulkDeleteQuestions,
  getQuestionStats,
  getDropdownData,
  getQuestionById
} from '../../../../services/questionPaperApi';

const QuestionBank = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    recentQuestions: 0,
    totalMarks: 0,
    subjectDistribution: []
  });

  const [filters, setFilters] = useState({
    subject: '',
    chapter: '',
    questionType: '',
    difficulty: '',
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

  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [viewingQuestion, setViewingQuestion] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [bulkDeleteLoading, setBulkDeleteLoading] = useState(false);

  // Single delete confirmation dialog state
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    questionId: null,
    questionText: ''
  });

  const questionTypes = ['Very Short Answer', 'Short Answer', 'Long Answer', 'MCQ', 'True/False'];
  const difficultyLevels = ['Easy', 'Medium', 'Hard'];

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load questions
      const questionsResponse = await getAllQuestions(filters);
      setQuestions(questionsResponse.data);
      setPagination({
        total: questionsResponse.total,
        totalPages: questionsResponse.totalPages,
        currentPage: questionsResponse.currentPage
      });

      // Load stats if first load
      if (loadingStats) {
        const statsData = await getQuestionStats();
        setStats(statsData);
        setLoadingStats(false);
      }

      // Load dropdown data if not loaded
      if (subjects.length === 0) {
        const dropdownData = await getDropdownData();
        setSubjects(dropdownData.subjects);
        setChapters(dropdownData.chapters);
      }
    } catch (error) {
      console.error('Failed to load question:', error);
      toast.error('Failed to load question data. Please try again.');
      navigate('/dashboard/question-paper/bank');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({
      subject: '',
      chapter: '',
      questionType: '',
      difficulty: '',
      search: '',
      status: 'active',
      page: 1,
      limit: 10
    });
  };

  const handleDelete = (id) => {
    console.log('handleDelete called with id:', id);
    // Find question details for confirmation dialog
    const question = questions.find(q => q._id === id);
    console.log('Found question for delete:', question);
    if (question) {
      const questionText = question.question ? 
        (question.question.length > 50 ? question.question.substring(0, 50) + '...' : question.question)
        : 'Question text not available';
      
      console.log('Setting deleteConfirm with questionText:', questionText);
      setDeleteConfirm({
        show: true,
        questionId: id,
        questionText: questionText
      });
    } else {
      console.log('Question not found for id:', id);
    }
  };

  const confirmDelete = async () => {
    console.log('confirmDelete called with questionId:', deleteConfirm.questionId);
    try {
      setDeleteLoading(true);
      await deleteQuestion(deleteConfirm.questionId);
      await loadData();
      toast.success('Question deleted successfully');
    } catch (error) {
      console.error('Failed to delete question:', error);
      toast.error(error.message || 'Failed to delete question');
    } finally {
      setDeleteLoading(false);
      setDeleteConfirm({ show: false, questionId: null, questionText: '' });
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm({ show: false, questionId: null, questionText: '' });
  };

  const handleDownload = async (question) => {
    try {
      // Create a simple text content for the question
      const content = `
QUESTION PAPER
===============

Subject: ${getSubjectName(question.subject)}
Chapter: ${getChapterName(question.chapter)}
Type: ${question.questionType}
Difficulty: ${question.difficulty}
Marks: ${question.marks}

Question:
${question.question}

${question.questionType === 'MCQ' && question.options ? 
  'Options:\n' + Object.entries(question.options).map(([key, value]) => `${key}: ${value}`).join('\n') + 
  '\nCorrect Answer: ' + question.correctAnswer : ''
}

${question.solution ? 'Solution:\n' + question.solution : ''}

${question.hint ? 'Hint:\n' + question.hint : ''}

Generated on: ${new Date().toLocaleString()}
`;

      // Create blob and download
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `question_${question._id}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success('Question downloaded successfully');
    } catch (error) {
      console.error('Failed to download question:', error);
      toast.error('Failed to download question');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedQuestions.length === 0) {
      toast.error('Please select questions to delete');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedQuestions.length} questions?`)) {
      return;
    }

    try {
      setBulkDeleteLoading(true);
      await bulkDeleteQuestions(selectedQuestions);
      setSelectedQuestions([]);
      await loadData();
      setShowDeleteModal(false);
      toast.success(`${selectedQuestions.length} questions deleted successfully`);
    } catch (error) {
      console.error('Failed to delete questions:', error);
      toast.error(error.message || 'Failed to delete questions');
    } finally {
      setBulkDeleteLoading(false);
    }
  };

  const handleQuestionSelect = (id) => {
    setSelectedQuestions(prev => 
      prev.includes(id) 
        ? prev.filter(qId => qId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedQuestions.length === questions.length) {
      setSelectedQuestions([]);
    } else {
      setSelectedQuestions(questions.map(q => q._id));
    }
  };

  const getSubjectName = (subjectId) => {
    if (!subjectId) return 'Unknown';
    
    // Handle different data structures
    if (typeof subjectId === 'object' && subjectId !== null) {
      // If subject is already populated object
      return subjectId.name || 'Unknown';
    }
    
    // If subjectId is a string ID, find it in subjects array
    const subject = subjects.find(s => s._id === subjectId || s.id === subjectId);
    return subject ? subject.name : 'Unknown';
  };

  const getChapterName = (chapterId) => {
    if (!chapterId) return 'Unknown';
    
    // Handle different data structures
    if (typeof chapterId === 'object' && chapterId !== null) {
      // If chapter is already populated object
      return chapterId.title || 'Unknown';
    }
    
    // If chapterId is a string ID, find it in chapters array
    const chapter = chapters.find(ch => ch._id === chapterId || ch.id === chapterId);
    return chapter ? chapter.title : 'Unknown';
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'Very Short Answer': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Short Answer': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'Long Answer': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300';
      case 'MCQ': return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300';
      case 'True/False': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const filteredChapters = filters.subject
    ? chapters.filter(ch => ch.subject?._id === filters.subject || ch.subject === filters.subject)
    : chapters;

  if (loading && questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading questions...</p>
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
          <span className="text-blue-600 dark:text-blue-400 font-semibold">Question Paper</span>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600" />
          <span className="text-gray-900 dark:text-white font-semibold">Question Bank</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <span>Question Bank</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Browse and manage all questions</p>
            </div>
            <div className="flex space-x-3">
              {selectedQuestions.length > 0 && (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center space-x-2 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all shadow-lg hover:shadow-xl font-semibold dark:bg-red-700 dark:hover:bg-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Selected ({selectedQuestions.length})</span>
                </button>
              )}
              <button
                onClick={() => navigate('/dashboard/question-paper/create')}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-xl hover:from-purple-700 hover:to-indigo-800 transition-all shadow-lg hover:shadow-xl font-semibold dark:from-purple-700 dark:to-indigo-800 dark:hover:from-purple-800 dark:hover:to-indigo-900"
              >
                <Plus className="w-5 h-5" />
                <span>Create Question</span>
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Total Questions</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{stats.total}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 rounded-2xl flex items-center justify-center">
                <FileText className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Total Marks</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalMarks}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Recent (30 days)</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{stats.recentQuestions}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Subjects</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{subjects.length}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/40 dark:to-orange-800/40 rounded-2xl flex items-center justify-center">
                <Filter className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <Filter className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span>Filters</span>
            </h3>
            <div className="flex items-center space-x-3">
              {selectedQuestions.length > 0 && (
                <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                  {selectedQuestions.length} selected
                </span>
              )}
              <button
                onClick={handleClearFilters}
                className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold"
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Subject</label>
              <select
                value={filters.subject}
                onChange={(e) => handleFilterChange('subject', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:ring-purple-400 dark:focus:border-purple-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="" className="dark:bg-gray-700">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject._id} value={subject._id} className="dark:bg-gray-700">{subject.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Chapter</label>
              <select
                value={filters.chapter}
                onChange={(e) => handleFilterChange('chapter', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:ring-purple-400 dark:focus:border-purple-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                disabled={!filters.subject}
              >
                <option value="" className="dark:bg-gray-700">All Chapters</option>
                {filteredChapters.map(chapter => (
                  <option key={chapter._id} value={chapter._id} className="dark:bg-gray-700">
                    {chapter.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Question Type</label>
              <select
                value={filters.questionType}
                onChange={(e) => handleFilterChange('questionType', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:ring-purple-400 dark:focus:border-purple-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="" className="dark:bg-gray-700">All Types</option>
                {questionTypes.map(type => (
                  <option key={type} value={type} className="dark:bg-gray-700">{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Difficulty</label>
              <select
                value={filters.difficulty}
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:ring-purple-400 dark:focus:border-purple-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="" className="dark:bg-gray-700">All Levels</option>
                {difficultyLevels.map(level => (
                  <option key={level} value={level} className="dark:bg-gray-700">{level}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Search</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Search questions..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:ring-purple-400 dark:focus:border-purple-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">All Questions ({pagination.total})</h3>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSelectAll}
                className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold"
              >
                {selectedQuestions.length === questions.length ? 'Deselect All' : 'Select All'}
              </button>
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
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <div className="p-12 text-center">
                <Loader2 className="w-8 h-8 text-gray-400 dark:text-gray-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Loading questions...</p>
              </div>
            ) : questions.length > 0 ? (
              questions.map((question) => (
                <div key={question._id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-start space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedQuestions.includes(question._id)}
                      onChange={() => handleQuestionSelect(question._id)}
                      className="mt-2 text-purple-600 dark:text-purple-400"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(question.questionType)}`}>
                          {question.questionType}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(question.difficulty)}`}>
                          {question.difficulty}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                          {question.marks} {question.marks === 1 ? 'Mark' : 'Marks'}
                        </span>
                      </div>
                      <p className="text-gray-900 dark:text-white font-medium text-lg mb-2">{question.question}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center space-x-1">
                          <BookOpen className="w-4 h-4" />
                          <span>{getSubjectName(question.subject)}</span>
                        </span>
                        <span>•</span>
                        <span>{getChapterName(question.chapter)}</span>
                        <span>•</span>
                        <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => setViewingQuestion(question)}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        title="View details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          const editUrl = `/dashboard/question-paper/edit/${question._id}`;
                          toast(`Editing question: ${question._id}`);
                          navigate(editUrl);
                        }}
                        className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                        title="Edit question"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(question._id)}
                        disabled={deleteLoading}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete question"
                      >
                        {deleteLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDownload(question)}
                        className="p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                        title="Download question"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-lg">No questions found</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Try adjusting your filters or create a new question</p>
              </div>
            )}
          </div>
        </div>

        {/* View Question Modal */}
        {viewingQuestion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Question Details</h2>
                  <button
                    onClick={() => setViewingQuestion(null)}
                    className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Question</label>
                  <p className="text-lg text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">{viewingQuestion.question}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Subject</label>
                    <p className="text-gray-900 dark:text-white">{getSubjectName(viewingQuestion.subject)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Chapter</label>
                    <p className="text-gray-900 dark:text-white">{getChapterName(viewingQuestion.chapter)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Type</label>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getTypeColor(viewingQuestion.questionType)}`}>
                      {viewingQuestion.questionType}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Difficulty</label>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getDifficultyColor(viewingQuestion.difficulty)}`}>
                      {viewingQuestion.difficulty}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Marks</label>
                    <p className="text-gray-900 dark:text-white">{viewingQuestion.marks}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Created Date</label>
                    <p className="text-gray-900 dark:text-white">{new Date(viewingQuestion.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {viewingQuestion.questionType === 'MCQ' && viewingQuestion.options && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Options</label>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(viewingQuestion.options).map(([key, value]) => (
                        <div key={key} className={`p-3 rounded-lg border ${viewingQuestion.correctAnswer === key.replace('option', '') ? 'border-green-500 bg-green-50 dark:bg-green-900/30 dark:border-green-700' : 'border-gray-200 dark:border-gray-600'}`}>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900 dark:text-white">{key}:</span>
                            {viewingQuestion.correctAnswer === key.replace('option', '') && (
                              <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">Correct</span>
                            )}
                          </div>
                          <p className="mt-1 text-gray-700 dark:text-gray-300">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {viewingQuestion.solution && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Solution</label>
                    <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">{viewingQuestion.solution}</p>
                  </div>
                )}

                {viewingQuestion.hint && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Hint</label>
                    <p className="text-gray-900 dark:text-white bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800">{viewingQuestion.hint}</p>
                  </div>
                )}

                <button
                  onClick={() => setViewingQuestion(null)}
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-xl hover:from-purple-700 hover:to-indigo-800 transition-all shadow-lg font-semibold dark:from-purple-700 dark:to-indigo-800 dark:hover:from-purple-800 dark:hover:to-indigo-900"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Single Delete Confirmation Dialog */}
        {deleteConfirm.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-[9999] p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Delete Question</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">This action cannot be undone</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="text-gray-700 dark:text-gray-300">
                    Are you sure you want to delete this question?
                  </p>
                  <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-900 dark:text-gray-100 italic">
                      "{deleteConfirm.questionText}"
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    This question will be permanently removed from the question bank.
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
                      'Delete Question'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Delete Questions</h2>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                      Are you sure you want to delete {selectedQuestions.length} questions?
                    </p>
                  </div>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  This action cannot be undone. All selected questions will be permanently removed.
                </p>
              </div>

              <div className="p-6 flex space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-semibold"
                  disabled={bulkDeleteLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkDelete}
                  disabled={bulkDeleteLoading}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all shadow-lg font-semibold disabled:opacity-50 flex items-center justify-center dark:bg-red-700 dark:hover:bg-red-800"
                >
                  {bulkDeleteLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete Questions'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionBank;