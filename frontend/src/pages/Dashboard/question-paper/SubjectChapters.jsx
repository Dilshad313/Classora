import React, { useState } from 'react';
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
  X
} from 'lucide-react';

const SubjectChapters = () => {
  const navigate = useNavigate();

  const [subjects] = useState([
    { id: 1, name: 'Mathematics', class: 'Grade 10', chapters: 12 },
    { id: 2, name: 'Physics', class: 'Grade 10', chapters: 10 },
    { id: 3, name: 'Chemistry', class: 'Grade 11', chapters: 14 },
    { id: 4, name: 'English', class: 'Grade 9', chapters: 8 }
  ]);

  const [chapters, setChapters] = useState([
    { id: 1, subjectId: 1, chapterNumber: 1, title: 'Real Numbers', topics: 5, questions: 25 },
    { id: 2, subjectId: 1, chapterNumber: 2, title: 'Polynomials', topics: 4, questions: 20 },
    { id: 3, subjectId: 1, chapterNumber: 3, title: 'Linear Equations', topics: 6, questions: 30 },
    { id: 4, subjectId: 2, chapterNumber: 1, title: 'Light - Reflection and Refraction', topics: 7, questions: 35 },
    { id: 5, subjectId: 2, chapterNumber: 2, title: 'Electricity', topics: 8, questions: 40 }
  ]);

  const [selectedSubject, setSelectedSubject] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingChapter, setEditingChapter] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    subjectId: '',
    chapterNumber: '',
    title: '',
    topics: ''
  });

  const filteredChapters = chapters.filter(chapter => {
    const matchesSubject = selectedSubject ? chapter.subjectId === parseInt(selectedSubject) : true;
    const matchesSearch = chapter.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const handleOpenModal = (chapter = null) => {
    if (chapter) {
      setEditingChapter(chapter);
      setFormData({
        subjectId: chapter.subjectId.toString(),
        chapterNumber: chapter.chapterNumber.toString(),
        title: chapter.title,
        topics: chapter.topics.toString()
      });
    } else {
      setEditingChapter(null);
      setFormData({
        subjectId: selectedSubject || '',
        chapterNumber: '',
        title: '',
        topics: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingChapter(null);
    setFormData({
      subjectId: '',
      chapterNumber: '',
      title: '',
      topics: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingChapter) {
      setChapters(chapters.map(ch => 
        ch.id === editingChapter.id 
          ? { ...ch, ...formData, subjectId: parseInt(formData.subjectId), chapterNumber: parseInt(formData.chapterNumber), topics: parseInt(formData.topics) }
          : ch
      ));
    } else {
      const newChapter = {
        id: chapters.length + 1,
        subjectId: parseInt(formData.subjectId),
        chapterNumber: parseInt(formData.chapterNumber),
        title: formData.title,
        topics: parseInt(formData.topics),
        questions: 0
      };
      setChapters([...chapters, newChapter]);
    }

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      handleCloseModal();
    }, 1500);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this chapter?')) {
      setChapters(chapters.filter(ch => ch.id !== id));
    }
  };

  const getSubjectName = (subjectId) => {
    return subjects.find(s => s.id === subjectId)?.name || 'Unknown';
  };

  const totalChapters = filteredChapters.length;
  const totalTopics = filteredChapters.reduce((sum, ch) => sum + ch.topics, 0);
  const totalQuestions = filteredChapters.reduce((sum, ch) => sum + ch.questions, 0);

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
          <span className="text-gray-900 font-semibold">Subject Chapters</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <span>Subject Chapters</span>
              </h1>
              <p className="text-gray-600 mt-2">Manage chapters and topics for each subject</p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              <Plus className="w-5 h-5" />
              <span>Add Chapter</span>
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Subjects</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{subjects.length}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Chapters</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{totalChapters}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center">
                <List className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Topics</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{totalTopics}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Questions</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{totalQuestions}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center">
                <Filter className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filter by Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name} - {subject.class}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search Chapters
              </label>
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by chapter title..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Chapters Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Chapter #</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Subject</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Chapter Title</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Topics</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Questions</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredChapters.length > 0 ? (
                  filteredChapters.map((chapter) => (
                    <tr key={chapter.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-700 rounded-lg font-bold">
                          {chapter.chapterNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">{getSubjectName(chapter.subjectId)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-900">{chapter.title}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                          {chapter.topics}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-700">
                          {chapter.questions}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleOpenModal(chapter)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit chapter"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(chapter.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete chapter"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No chapters found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingChapter ? 'Edit Chapter' : 'Add New Chapter'}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.subjectId}
                    onChange={(e) => setFormData({...formData, subjectId: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(subject => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name} - {subject.class}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Chapter Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.chapterNumber}
                    onChange={(e) => setFormData({...formData, chapterNumber: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 1"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Chapter Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Real Numbers"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Number of Topics <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.topics}
                    onChange={(e) => setFormData({...formData, topics: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 5"
                    min="1"
                    required
                  />
                </div>

                {showSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <p className="text-green-900 font-semibold">
                      Chapter {editingChapter ? 'updated' : 'added'} successfully!
                    </p>
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={showSuccess}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all shadow-lg font-semibold disabled:opacity-50"
                  >
                    {editingChapter ? 'Update Chapter' : 'Add Chapter'}
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

export default SubjectChapters;
