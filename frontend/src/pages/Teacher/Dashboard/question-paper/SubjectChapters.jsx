import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Eye, 
  Award, 
  Users, 
  CheckCircle2,
  AlertCircle,
  X,
  Save,
  List,
  Grid3X3,
  Calendar,
  Clock,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { classApi } from '../../../../services/classApi';
import { subjectApi } from '../../../../services/subjectApi';

const SubjectChapters = () => {
  const [chapters, setChapters] = useState([
    { 
      id: 1, 
      subject: 'Mathematics', 
      class: 'Class 10-A', 
      chapter: 'Quadratic Equations', 
      topics: ['Introduction to Quadratic Equations', 'Solving by Factorization', 'Quadratic Formula', 'Nature of Roots'],
      description: 'Learn about quadratic equations and their solutions',
      difficulty: 'Medium',
      estimatedHours: 8,
      createdAt: '2024-11-10'
    },
    { 
      id: 2, 
      subject: 'Mathematics', 
      class: 'Class 10-A', 
      chapter: 'Trigonometry', 
      topics: ['Trigonometric Ratios', 'Trigonometric Identities', 'Heights and Distances', 'Applications'],
      description: 'Understanding trigonometric functions and their applications',
      difficulty: 'Hard',
      estimatedHours: 12,
      createdAt: '2024-11-09'
    },
    { 
      id: 3, 
      subject: 'Mathematics', 
      class: 'Class 9-B', 
      chapter: 'Linear Equations', 
      topics: ['Linear Equations in One Variable', 'Linear Equations in Two Variables', 'Graphical Method'],
      description: 'Solving linear equations using various methods',
      difficulty: 'Easy',
      estimatedHours: 6,
      createdAt: '2024-11-08'
    },
    { 
      id: 4, 
      subject: 'Science', 
      class: 'Class 10-B', 
      chapter: 'Life Processes', 
      topics: ['Nutrition', 'Respiration', 'Transportation', 'Excretion'],
      description: 'Understanding basic life processes in living organisms',
      difficulty: 'Medium',
      estimatedHours: 10,
      createdAt: '2024-11-07'
    }
  ]);

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  const [filters, setFilters] = useState({
    subject: '',
    class: '',
    difficulty: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingChapter, setEditingChapter] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  const [newChapter, setNewChapter] = useState({
    subject: '',
    class: '',
    chapter: '',
    topics: [''],
    description: '',
    difficulty: 'Easy',
    estimatedHours: 1
  });

  const difficulties = ['Easy', 'Medium', 'Hard'];

  // Fetch classes on component mount
  useEffect(() => {
    fetchClasses();
  }, []);

  // Fetch subjects when class is selected
  useEffect(() => {
    if (newChapter.class) {
      fetchSubjectsForClass(newChapter.class);
    } else {
      setSubjects([]);
      setNewChapter(prev => ({ ...prev, subject: '' }));
    }
  }, [newChapter.class]);

  const fetchClasses = async () => {
    try {
      setLoadingClasses(true);
      const response = await classApi.getAllClasses();
      setClasses(response.data || []);
    } catch (error) {
      console.error('Failed to fetch classes:', error);
      toast.error('Failed to load classes');
      setClasses([]);
    } finally {
      setLoadingClasses(false);
    }
  };

  const fetchSubjectsForClass = async (classId) => {
    try {
      setLoadingSubjects(true);
      console.log('Fetching subjects for class:', classId);
      
      const response = await subjectApi.getSubjectsByClass(classId);
      console.log('Subjects API response:', response); // Debug log
      console.log('Subjects data:', response.data?.subjects); // Debug log
      
      const subjectsData = response.data?.subjects || [];
      console.log('Setting subjects:', subjectsData);
      
      setSubjects(subjectsData);
      
      if (subjectsData.length === 0) {
        toast.info('No subjects assigned to this class yet');
      }
    } catch (error) {
      console.error('Failed to fetch subjects:', error);
      toast.error('Failed to load subjects for this class');
      setSubjects([]);
    } finally {
      setLoadingSubjects(false);
    }
  };

  const filteredChapters = chapters.filter(chapter => {
    const matchesSearch = chapter.chapter.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chapter.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chapter.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSubject = !filters.subject || chapter.subject === filters.subject;
    const matchesClass = !filters.class || chapter.class === filters.class;
    const matchesDifficulty = !filters.difficulty || chapter.difficulty === filters.difficulty;
    
    return matchesSearch && matchesSubject && matchesClass && matchesDifficulty;
  });

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleDeleteChapter = (id) => {
    if (window.confirm('Are you sure you want to delete this chapter?')) {
      setChapters(chapters.filter(c => c.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-800 dark:to-blue-800 rounded-2xl shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative px-8 py-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Subject Chapters</h1>
                <p className="text-green-100 text-lg">Organize your curriculum with structured chapters and topics</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-green-100">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span>{chapters.length} Chapters</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>Multi-Class</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                viewMode === 'grid' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <Grid3X3 className="w-4 h-4 inline mr-2" />
              Grid View
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                viewMode === 'table' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <List className="w-4 h-4 inline mr-2" />
              Table View
            </button>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Chapter
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Filter className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Filter Chapters</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Search and filter your chapters</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search chapters..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-500/20 dark:focus:ring-green-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                />
              </div>
              <select
                value={filters.subject}
                onChange={(e) => handleFilterChange('subject', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-500/20 dark:focus:ring-green-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
              >
                <option value="">All Subjects</option>
                {Array.isArray(subjects) && subjects.map(subject => (
                  <option key={subject._id} value={subject._id}>{subject.subjectName}</option>
                ))}
              </select>
              <select
                value={filters.class}
                onChange={(e) => handleFilterChange('class', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-500/20 dark:focus:ring-green-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
              >
                <option value="">All Classes</option>
                {Array.isArray(classes) && classes.map(cls => (
                  <option key={cls._id} value={cls._id}>{cls.className}</option>
                ))}
              </select>
              <select
                value={filters.difficulty}
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-500/20 dark:focus:ring-green-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
              >
                <option value="">All Difficulty</option>
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredChapters.length} of {chapters.length} chapters
            </div>
          </div>
        </div>

        {/* Chapters Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChapters.map(chapter => (
              <div key={chapter.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          chapter.difficulty === 'Easy' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                          chapter.difficulty === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                          'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        }`}>
                          {chapter.difficulty}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                          {chapter.subject}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">{chapter.chapter}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{chapter.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{chapter.class}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{chapter.estimatedHours}h</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Topics ({chapter.topics.length}):</p>
                        <div className="space-y-1">
                          {chapter.topics.slice(0, 3).map((topic, index) => (
                            <div key={index} className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded">
                              • {topic}
                            </div>
                          ))}
                          {chapter.topics.length > 3 && (
                            <div className="text-xs text-gray-500 dark:text-gray-500">
                              +{chapter.topics.length - 3} more topics
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <button 
                      onClick={() => {
                        setEditingChapter(chapter);
                        setNewChapter(chapter);
                        setShowAddModal(true);
                      }}
                      className="flex-1 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteChapter(chapter.id)}
                      className="flex-1 px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Subject</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Class</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Chapter</th>
                    <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Topics</th>
                    <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Difficulty</th>
                    <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Hours</th>
                    <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {filteredChapters.map(chapter => (
                    <tr key={chapter.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-300">{chapter.subject}</td>
                      <td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-300">{chapter.class}</td>
                      <td className="py-4 px-6">
                        <div>
                          <div className="text-sm font-medium text-gray-800 dark:text-gray-100">{chapter.chapter}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{chapter.description}</div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center text-sm text-gray-700 dark:text-gray-300">{chapter.topics.length}</td>
                      <td className="py-4 px-6 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          chapter.difficulty === 'Easy' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                          chapter.difficulty === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                          'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        }`}>
                          {chapter.difficulty}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center text-sm text-gray-700 dark:text-gray-300">{chapter.estimatedHours}h</td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex justify-center gap-2">
                          <button 
                            onClick={() => {
                              setEditingChapter(chapter);
                              setNewChapter(chapter);
                              setShowAddModal(true);
                            }}
                            className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteChapter(chapter.id)}
                            className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Success Message */}
        {showSuccess && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 flex items-center space-x-3">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
            <div>
              <p className="font-semibold text-green-900 dark:text-green-100">Success!</p>
              <p className="text-sm text-green-700 dark:text-green-300">Chapter has been saved successfully.</p>
            </div>
          </div>
        )}

        {/* Add/Edit Chapter Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      {editingChapter ? <Edit className="w-5 h-5 text-green-600 dark:text-green-400" /> : <Plus className="w-5 h-5 text-green-600 dark:text-green-400" />}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                        {editingChapter ? 'Edit Chapter' : 'Add New Chapter'}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {editingChapter ? 'Update chapter details' : 'Create a new chapter for your curriculum'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingChapter(null);
                      setNewChapter({
                        subject: '',
                        class: '',
                        chapter: '',
                        topics: [''],
                        description: '',
                        difficulty: 'Easy',
                        estimatedHours: 1
                      });
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (editingChapter) {
                    setChapters(chapters.map(c => 
                      c.id === editingChapter.id ? { ...newChapter, id: editingChapter.id } : c
                    ));
                  } else {
                    setChapters([...chapters, { ...newChapter, id: chapters.length + 1, createdAt: new Date().toISOString().split('T')[0] }]);
                  }
                  setShowAddModal(false);
                  setEditingChapter(null);
                  setShowSuccess(true);
                  setTimeout(() => setShowSuccess(false), 3000);
                }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Class <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={newChapter.class}
                        onChange={(e) => {
                          setNewChapter(prev => ({ ...prev, class: e.target.value, subject: '' }));
                        }}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-500/20 dark:focus:ring-green-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                        required
                        disabled={loadingClasses}
                      >
                        <option value="">Select Class</option>
                        {loadingClasses ? (
                          <option disabled>Loading classes...</option>
                        ) : (
                          Array.isArray(classes) && classes.map(cls => (
                            <option key={cls._id} value={cls._id}>
                              {cls.className}
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={newChapter.subject}
                        onChange={(e) => setNewChapter(prev => ({ ...prev, subject: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-500/20 dark:focus:ring-green-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        required
                        disabled={!newChapter.class || loadingSubjects}
                      >
                        <option value="">
                          {loadingSubjects ? 'Loading subjects...' : 'Select Subject'}
                        </option>
                        {Array.isArray(subjects) && subjects.map(subject => (
                          <option key={subject._id} value={subject._id}>
                            {subject.subjectName}
                          </option>
                        ))}
                      </select>
                      {!newChapter.class && (
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Please select a class first</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Chapter Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newChapter.chapter}
                      onChange={(e) => setNewChapter(prev => ({ ...prev, chapter: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-500/20 dark:focus:ring-green-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                      placeholder="e.g., Quadratic Equations"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newChapter.description}
                      onChange={(e) => setNewChapter(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-500/20 dark:focus:ring-green-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                      placeholder="Brief description of the chapter..."
                      rows="3"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Difficulty Level
                      </label>
                      <select
                        value={newChapter.difficulty}
                        onChange={(e) => setNewChapter(prev => ({ ...prev, difficulty: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-500/20 dark:focus:ring-green-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                      >
                        {difficulties.map(difficulty => (
                          <option key={difficulty} value={difficulty}>{difficulty}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Estimated Hours
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={newChapter.estimatedHours}
                        onChange={(e) => setNewChapter(prev => ({ ...prev, estimatedHours: parseInt(e.target.value) || 1 }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-500/20 dark:focus:ring-green-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                        placeholder="8"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Topics
                    </label>
                    <div className="space-y-3">
                      {newChapter.topics.map((topic, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <span className="w-8 h-8 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-sm font-semibold">
                            {index + 1}
                          </span>
                          <input
                            type="text"
                            value={topic}
                            onChange={(e) => {
                              const updatedTopics = [...newChapter.topics];
                              updatedTopics[index] = e.target.value;
                              setNewChapter(prev => ({ ...prev, topics: updatedTopics }));
                            }}
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            placeholder={`Topic ${index + 1}`}
                          />
                          {newChapter.topics.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const updatedTopics = newChapter.topics.filter((_, i) => i !== index);
                                setNewChapter(prev => ({ ...prev, topics: updatedTopics }));
                              }}
                              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          setNewChapter(prev => ({ ...prev, topics: [...prev.topics, ''] }));
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-green-600 dark:text-green-400 border border-green-300 dark:border-green-600 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Topic
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddModal(false);
                        setEditingChapter(null);
                      }}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                      {editingChapter ? 'Update Chapter' : 'Add Chapter'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectChapters;
