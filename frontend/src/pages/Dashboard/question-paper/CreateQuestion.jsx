import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FilePlus,
  Home,
  ChevronRight,
  CheckCircle2,
  BookOpen,
  FileText,
  Hash
} from 'lucide-react';

const CreateQuestion = () => {
  const navigate = useNavigate();

  const [subjects] = useState([
    { id: 1, name: 'Mathematics', class: 'Grade 10' },
    { id: 2, name: 'Physics', class: 'Grade 10' },
    { id: 3, name: 'Chemistry', class: 'Grade 11' },
    { id: 4, name: 'English', class: 'Grade 9' }
  ]);

  const [chapters] = useState([
    { id: 1, subjectId: 1, name: 'Real Numbers' },
    { id: 2, subjectId: 1, name: 'Polynomials' },
    { id: 3, subjectId: 1, name: 'Linear Equations' },
    { id: 4, subjectId: 2, name: 'Light - Reflection and Refraction' },
    { id: 5, subjectId: 2, name: 'Electricity' }
  ]);

  const questionTypes = ['Very Short Answer', 'Short Answer', 'Long Answer', 'MCQ', 'True/False'];
  const difficultyLevels = ['Easy', 'Medium', 'Hard'];

  const [formData, setFormData] = useState({
    subjectId: '',
    chapterId: '',
    questionType: '',
    difficulty: '',
    marks: '',
    question: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    correctAnswer: '',
    solution: '',
    hint: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const filteredChapters = formData.subjectId 
    ? chapters.filter(ch => ch.subjectId === parseInt(formData.subjectId))
    : [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'subjectId' && { chapterId: '' })
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.subjectId || !formData.chapterId || !formData.questionType || 
        !formData.difficulty || !formData.marks || !formData.question) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.questionType === 'MCQ' && 
        (!formData.option1 || !formData.option2 || !formData.option3 || !formData.option4 || !formData.correctAnswer)) {
      alert('Please fill in all MCQ options and select the correct answer');
      return;
    }

    // Show success message
    setShowSuccess(true);

    // Reset form after 2 seconds
    setTimeout(() => {
      setShowSuccess(false);
      setFormData({
        subjectId: '',
        chapterId: '',
        questionType: '',
        difficulty: '',
        marks: '',
        question: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        correctAnswer: '',
        solution: '',
        hint: ''
      });
    }, 2000);
  };

  const getSubjectName = (subjectId) => {
    const subject = subjects.find(s => s.id === parseInt(subjectId));
    return subject ? `${subject.name} - ${subject.class}` : '';
  };

  const getChapterName = (chapterId) => {
    return chapters.find(ch => ch.id === parseInt(chapterId))?.name || '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
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
          <span className="text-gray-900 font-semibold">Create Question</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <FilePlus className="w-6 h-6 text-white" />
            </div>
            <span>Create New Question</span>
          </h1>
          <p className="text-gray-600 mt-2">Add a new question to the question bank</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <FileText className="w-6 h-6 text-green-600" />
              <span>Question Details</span>
            </h2>
            <p className="text-sm text-gray-600 mt-1">Fill in the information below</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Subject and Chapter */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <select
                  name="subjectId"
                  value={formData.subjectId}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                  Chapter <span className="text-red-500">*</span>
                </label>
                <select
                  name="chapterId"
                  value={formData.chapterId}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  disabled={!formData.subjectId}
                  required
                >
                  <option value="">Select Chapter</option>
                  {filteredChapters.map(chapter => (
                    <option key={chapter.id} value={chapter.id}>
                      {chapter.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Question Type, Difficulty, and Marks */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Question Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="questionType"
                  value={formData.questionType}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="">Select Type</option>
                  {questionTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Difficulty Level <span className="text-red-500">*</span>
                </label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="">Select Difficulty</option>
                  {difficultyLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Marks <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="marks"
                  value={formData.marks}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., 5"
                  min="1"
                  max="10"
                  required
                />
              </div>
            </div>

            {/* Question */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Question <span className="text-red-500">*</span>
              </label>
              <textarea
                name="question"
                value={formData.question}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 min-h-[120px] resize-y"
                placeholder="Enter the question here..."
                required
              />
            </div>

            {/* MCQ Options (only show if MCQ is selected) */}
            {formData.questionType === 'MCQ' && (
              <div className="space-y-4 p-6 bg-blue-50 rounded-xl border border-blue-200">
                <h3 className="font-bold text-gray-900 flex items-center space-x-2">
                  <Hash className="w-5 h-5 text-blue-600" />
                  <span>Multiple Choice Options</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Option 1 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="option1"
                      value={formData.option1}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter option 1"
                      required={formData.questionType === 'MCQ'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Option 2 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="option2"
                      value={formData.option2}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter option 2"
                      required={formData.questionType === 'MCQ'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Option 3 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="option3"
                      value={formData.option3}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter option 3"
                      required={formData.questionType === 'MCQ'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Option 4 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="option4"
                      value={formData.option4}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter option 4"
                      required={formData.questionType === 'MCQ'}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Correct Answer <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="correctAnswer"
                    value={formData.correctAnswer}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required={formData.questionType === 'MCQ'}
                  >
                    <option value="">Select Correct Answer</option>
                    <option value="1">Option 1</option>
                    <option value="2">Option 2</option>
                    <option value="3">Option 3</option>
                    <option value="4">Option 4</option>
                  </select>
                </div>
              </div>
            )}

            {/* Solution and Hint */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Solution <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <textarea
                  name="solution"
                  value={formData.solution}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 min-h-[100px] resize-y"
                  placeholder="Enter the solution or answer..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hint <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <textarea
                  name="hint"
                  value={formData.hint}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 min-h-[100px] resize-y"
                  placeholder="Enter a hint for students..."
                />
              </div>
            </div>

            {/* Preview Box */}
            {(formData.subjectId || formData.chapterId || formData.questionType) && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-green-600" />
                  <span>Question Preview</span>
                </h3>
                <div className="space-y-2 text-sm">
                  {formData.subjectId && (
                    <p><span className="font-semibold text-gray-700">Subject:</span> <span className="text-gray-900">{getSubjectName(formData.subjectId)}</span></p>
                  )}
                  {formData.chapterId && (
                    <p><span className="font-semibold text-gray-700">Chapter:</span> <span className="text-gray-900">{getChapterName(formData.chapterId)}</span></p>
                  )}
                  {formData.questionType && (
                    <p><span className="font-semibold text-gray-700">Type:</span> <span className="text-gray-900">{formData.questionType}</span></p>
                  )}
                  {formData.difficulty && (
                    <p><span className="font-semibold text-gray-700">Difficulty:</span> <span className="text-gray-900">{formData.difficulty}</span></p>
                  )}
                  {formData.marks && (
                    <p><span className="font-semibold text-gray-700">Marks:</span> <span className="text-gray-900">{formData.marks}</span></p>
                  )}
                </div>
              </div>
            )}

            {/* Success Message */}
            {showSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-green-900">Question Created Successfully!</p>
                  <p className="text-sm text-green-700">The question has been added to the question bank.</p>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard/question-paper/bank')}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={showSuccess}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all shadow-lg hover:shadow-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Question
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateQuestion;
