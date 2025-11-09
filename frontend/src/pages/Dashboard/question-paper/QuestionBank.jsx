import React, { useState } from 'react';
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
  BookOpen
} from 'lucide-react';

const QuestionBank = () => {
  const navigate = useNavigate();

  const [subjects] = useState([
    { id: 1, name: 'Mathematics' },
    { id: 2, name: 'Physics' },
    { id: 3, name: 'Chemistry' },
    { id: 4, name: 'English' }
  ]);

  const [chapters] = useState([
    { id: 1, subjectId: 1, name: 'Real Numbers' },
    { id: 2, subjectId: 1, name: 'Polynomials' },
    { id: 3, subjectId: 2, name: 'Light - Reflection and Refraction' },
    { id: 4, subjectId: 2, name: 'Electricity' }
  ]);

  const [questions, setQuestions] = useState([
    {
      id: 1,
      subjectId: 1,
      chapterId: 1,
      question: 'Prove that √2 is an irrational number.',
      type: 'Long Answer',
      difficulty: 'Hard',
      marks: 5,
      createdDate: '2024-11-01'
    },
    {
      id: 2,
      subjectId: 1,
      chapterId: 1,
      question: 'Find the HCF of 96 and 404 using Euclid\'s division algorithm.',
      type: 'Short Answer',
      difficulty: 'Medium',
      marks: 3,
      createdDate: '2024-11-02'
    },
    {
      id: 3,
      subjectId: 1,
      chapterId: 2,
      question: 'If one zero of the polynomial x² - 4x + 1 is 2 + √3, write the other zero.',
      type: 'Very Short Answer',
      difficulty: 'Easy',
      marks: 1,
      createdDate: '2024-11-03'
    },
    {
      id: 4,
      subjectId: 2,
      chapterId: 3,
      question: 'Define the principal focus of a concave mirror.',
      type: 'Very Short Answer',
      difficulty: 'Easy',
      marks: 1,
      createdDate: '2024-11-04'
    },
    {
      id: 5,
      subjectId: 2,
      chapterId: 4,
      question: 'State Ohm\'s law and explain with a circuit diagram.',
      type: 'Short Answer',
      difficulty: 'Medium',
      marks: 3,
      createdDate: '2024-11-05'
    }
  ]);

  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingQuestion, setViewingQuestion] = useState(null);

  const questionTypes = ['Very Short Answer', 'Short Answer', 'Long Answer', 'MCQ', 'True/False'];
  const difficultyLevels = ['Easy', 'Medium', 'Hard'];

  const filteredQuestions = questions.filter(q => {
    const matchesSubject = selectedSubject ? q.subjectId === parseInt(selectedSubject) : true;
    const matchesChapter = selectedChapter ? q.chapterId === parseInt(selectedChapter) : true;
    const matchesType = selectedType ? q.type === selectedType : true;
    const matchesDifficulty = selectedDifficulty ? q.difficulty === selectedDifficulty : true;
    const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSubject && matchesChapter && matchesType && matchesDifficulty && matchesSearch;
  });

  const filteredChapters = selectedSubject 
    ? chapters.filter(ch => ch.subjectId === parseInt(selectedSubject))
    : chapters;

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const handleClearFilters = () => {
    setSelectedSubject('');
    setSelectedChapter('');
    setSelectedType('');
    setSelectedDifficulty('');
    setSearchTerm('');
  };

  const getSubjectName = (subjectId) => {
    return subjects.find(s => s.id === subjectId)?.name || 'Unknown';
  };

  const getChapterName = (chapterId) => {
    return chapters.find(ch => ch.id === chapterId)?.name || 'Unknown';
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'Very Short Answer': return 'bg-blue-100 text-blue-700';
      case 'Short Answer': return 'bg-purple-100 text-purple-700';
      case 'Long Answer': return 'bg-indigo-100 text-indigo-700';
      case 'MCQ': return 'bg-pink-100 text-pink-700';
      case 'True/False': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const totalQuestions = filteredQuestions.length;
  const totalMarks = filteredQuestions.reduce((sum, q) => sum + q.marks, 0);

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
          <span className="text-blue-600 font-semibold">Question Paper</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-semibold">Question Bank</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <span>Question Bank</span>
              </h1>
              <p className="text-gray-600 mt-2">Browse and manage all questions</p>
            </div>
            <button
              onClick={() => navigate('/dashboard/question-paper/create')}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-xl hover:from-purple-700 hover:to-indigo-800 transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              <Plus className="w-5 h-5" />
              <span>Create Question</span>
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Questions</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{totalQuestions}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center">
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Marks</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{totalMarks}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Subjects</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{subjects.length}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Chapters</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{chapters.length}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center">
                <Filter className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
              <Filter className="w-5 h-5 text-purple-600" />
              <span>Filters</span>
            </h3>
            <button
              onClick={handleClearFilters}
              className="text-sm text-purple-600 hover:text-purple-700 font-semibold"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => {
                  setSelectedSubject(e.target.value);
                  setSelectedChapter('');
                }}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>{subject.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Chapter</label>
              <select
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                disabled={!selectedSubject}
              >
                <option value="">All Chapters</option>
                {filteredChapters.map(chapter => (
                  <option key={chapter.id} value={chapter.id}>{chapter.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Question Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">All Types</option>
                {questionTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">All Levels</option>
                {difficultyLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
            <h3 className="text-lg font-bold text-gray-900">All Questions ({filteredQuestions.length})</h3>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((question) => (
                <div key={question.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(question.type)}`}>
                          {question.type}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(question.difficulty)}`}>
                          {question.difficulty}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                          {question.marks} {question.marks === 1 ? 'Mark' : 'Marks'}
                        </span>
                      </div>
                      <p className="text-gray-900 font-medium text-lg mb-2">{question.question}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center space-x-1">
                          <BookOpen className="w-4 h-4" />
                          <span>{getSubjectName(question.subjectId)}</span>
                        </span>
                        <span>•</span>
                        <span>{getChapterName(question.chapterId)}</span>
                        <span>•</span>
                        <span>{new Date(question.createdDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => setViewingQuestion(question)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => navigate(`/dashboard/question-paper/create?edit=${question.id}`)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit question"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(question.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete question"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <button
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No questions found</p>
                <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or create a new question</p>
              </div>
            )}
          </div>
        </div>

        {/* View Question Modal */}
        {viewingQuestion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Question Details</h2>
                  <button
                    onClick={() => setViewingQuestion(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                  >
                    <span className="text-2xl">×</span>
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Question</label>
                  <p className="text-lg text-gray-900 bg-gray-50 p-4 rounded-xl">{viewingQuestion.question}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Subject</label>
                    <p className="text-gray-900">{getSubjectName(viewingQuestion.subjectId)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Chapter</label>
                    <p className="text-gray-900">{getChapterName(viewingQuestion.chapterId)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Type</label>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getTypeColor(viewingQuestion.type)}`}>
                      {viewingQuestion.type}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Difficulty</label>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getDifficultyColor(viewingQuestion.difficulty)}`}>
                      {viewingQuestion.difficulty}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Marks</label>
                    <p className="text-gray-900">{viewingQuestion.marks}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Created Date</label>
                    <p className="text-gray-900">{new Date(viewingQuestion.createdDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <button
                  onClick={() => setViewingQuestion(null)}
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-xl hover:from-purple-700 hover:to-indigo-800 transition-all shadow-lg font-semibold"
                >
                  Close
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
