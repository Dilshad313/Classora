import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FilePlus,
  Home,
  ChevronRight,
  CheckCircle2,
  BookOpen,
  FileText,
  Hash,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import {
  getQuestionById,
  updateQuestion,
  getDropdownData
} from '../../../../services/questionPaperApi';

const EditQuestion = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [questionTypes] = useState(['Very Short Answer', 'Short Answer', 'Long Answer', 'MCQ', 'True/False']);
  const [difficultyLevels] = useState(['Easy', 'Medium', 'Hard']);

  const [formData, setFormData] = useState({
    question: '',
    questionType: '',
    difficulty: '',
    marks: '',
    subject: '',
    chapter: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    correctAnswer: '',
    solution: '',
    hint: ''
  });

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadQuestionData();
  }, [id]);

  const loadQuestionData = async () => {
    try {
      setLoading(true);
      
      // Load question data
      const question = await getQuestionById(id);
      setFormData({
        question: question.question,
        questionType: question.questionType,
        difficulty: question.difficulty,
        marks: question.marks.toString(),
        subject: question.subject?._id || question.subject,
        chapter: question.chapter?._id || question.chapter,
        option1: question.options?.option1 || '',
        option2: question.options?.option2 || '',
        option3: question.options?.option3 || '',
        option4: question.options?.option4 || '',
        correctAnswer: question.correctAnswer || '',
        solution: question.solution || '',
        hint: question.hint || ''
      });

      // Load dropdown data
      const dropdownData = await getDropdownData();
      setSubjects(dropdownData.subjects);
      setChapters(dropdownData.chapters);
    } catch (error) {
      console.error('Failed to load question:', error);
      alert('Failed to load question data. Please try again.');
      navigate('/dashboard/question-paper/bank');
    } finally {
      setLoading(false);
    }
  };

  const filteredChapters = formData.subject
    ? chapters.filter(ch => ch.subject?._id === formData.subject || ch.subject === formData.subject)
    : [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'subject' && { chapter: '' }) // Reset chapter when subject changes
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.question.trim()) newErrors.question = 'Question is required';
    if (!formData.questionType) newErrors.questionType = 'Question type is required';
    if (!formData.difficulty) newErrors.difficulty = 'Difficulty level is required';
    if (!formData.marks || formData.marks < 1) newErrors.marks = 'Valid marks are required';
    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (!formData.chapter) newErrors.chapter = 'Chapter is required';

    if (formData.questionType === 'MCQ') {
      if (!formData.option1.trim()) newErrors.option1 = 'Option 1 is required';
      if (!formData.option2.trim()) newErrors.option2 = 'Option 2 is required';
      if (!formData.option3.trim()) newErrors.option3 = 'Option 3 is required';
      if (!formData.option4.trim()) newErrors.option4 = 'Option 4 is required';
      if (!formData.correctAnswer) newErrors.correctAnswer = 'Correct answer is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      const questionData = {
        question: formData.question,
        questionType: formData.questionType,
        difficulty: formData.difficulty,
        marks: parseInt(formData.marks),
        subject: formData.subject,
        chapter: formData.chapter,
        solution: formData.solution || '',
        hint: formData.hint || ''
      };

      if (formData.questionType === 'MCQ') {
        questionData.option1 = formData.option1;
        questionData.option2 = formData.option2;
        questionData.option3 = formData.option3;
        questionData.option4 = formData.option4;
        questionData.correctAnswer = formData.correctAnswer;
      }

      await updateQuestion(id, questionData);
      
      // Show success message
      setShowSuccess(true);

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/dashboard/question-paper/bank');
      }, 2000);

    } catch (error) {
      console.error('Error updating question:', error);
      alert(error.message || 'Failed to update question. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getSubjectName = (subjectId) => {
    const subject = subjects.find(s => s._id === subjectId);
    return subject ? subject.name : '';
  };

  const getChapterName = (chapterId) => {
    const chapter = chapters.find(ch => ch._id === chapterId);
    return chapter ? chapter.title : '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading question data...</p>
        </div>
      </div>
    );
  }

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
          <button
            onClick={() => navigate('/dashboard/question-paper/bank')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Question Paper
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-semibold">Edit Question</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <FilePlus className="w-6 h-6 text-white" />
                </div>
                <span>Edit Question</span>
              </h1>
              <p className="text-gray-600 mt-2">Update question details</p>
            </div>
            <button
              onClick={() => navigate('/dashboard/question-paper/bank')}
              className="flex items-center space-x-2 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Bank</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-orange-50">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <FileText className="w-6 h-6 text-yellow-600" />
              <span>Edit Question Details</span>
            </h2>
            <p className="text-sm text-gray-600 mt-1">Update the information below</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Subject and Chapter */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border ${errors.subject ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500`}
                  disabled={saving}
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject._id} value={subject._id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Chapter <span className="text-red-500">*</span>
                </label>
                <select
                  name="chapter"
                  value={formData.chapter}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border ${errors.chapter ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500`}
                  disabled={!formData.subject || saving}
                >
                  <option value="">Select Chapter</option>
                  {filteredChapters.map(chapter => (
                    <option key={chapter._id} value={chapter._id}>
                      {chapter.title} (Chapter {chapter.chapterNumber})
                    </option>
                  ))}
                </select>
                {errors.chapter && (
                  <p className="mt-1 text-sm text-red-600">{errors.chapter}</p>
                )}
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
                  className={`w-full px-4 py-2.5 border ${errors.questionType ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500`}
                  disabled={saving}
                >
                  <option value="">Select Type</option>
                  {questionTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.questionType && (
                  <p className="mt-1 text-sm text-red-600">{errors.questionType}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Difficulty Level <span className="text-red-500">*</span>
                </label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border ${errors.difficulty ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500`}
                  disabled={saving}
                >
                  <option value="">Select Difficulty</option>
                  {difficultyLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
                {errors.difficulty && (
                  <p className="mt-1 text-sm text-red-600">{errors.difficulty}</p>
                )}
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
                  className={`w-full px-4 py-2.5 border ${errors.marks ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500`}
                  placeholder="e.g., 5"
                  min="1"
                  max="100"
                  disabled={saving}
                />
                {errors.marks && (
                  <p className="mt-1 text-sm text-red-600">{errors.marks}</p>
                )}
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
                className={`w-full px-4 py-3 border ${errors.question ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 min-h-[120px] resize-y`}
                placeholder="Enter the question here..."
                disabled={saving}
              />
              {errors.question && (
                <p className="mt-1 text-sm text-red-600">{errors.question}</p>
              )}
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
                      className={`w-full px-4 py-2.5 border ${errors.option1 ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500`}
                      placeholder="Enter option 1"
                      disabled={saving}
                    />
                    {errors.option1 && (
                      <p className="mt-1 text-sm text-red-600">{errors.option1}</p>
                    )}
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
                      className={`w-full px-4 py-2.5 border ${errors.option2 ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500`}
                      placeholder="Enter option 2"
                      disabled={saving}
                    />
                    {errors.option2 && (
                      <p className="mt-1 text-sm text-red-600">{errors.option2}</p>
                    )}
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
                      className={`w-full px-4 py-2.5 border ${errors.option3 ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500`}
                      placeholder="Enter option 3"
                      disabled={saving}
                    />
                    {errors.option3 && (
                      <p className="mt-1 text-sm text-red-600">{errors.option3}</p>
                    )}
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
                      className={`w-full px-4 py-2.5 border ${errors.option4 ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500`}
                      placeholder="Enter option 4"
                      disabled={saving}
                    />
                    {errors.option4 && (
                      <p className="mt-1 text-sm text-red-600">{errors.option4}</p>
                    )}
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
                    className={`w-full px-4 py-2.5 border ${errors.correctAnswer ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500`}
                    disabled={saving}
                  >
                    <option value="">Select Correct Answer</option>
                    <option value="1">Option 1</option>
                    <option value="2">Option 2</option>
                    <option value="3">Option 3</option>
                    <option value="4">Option 4</option>
                  </select>
                  {errors.correctAnswer && (
                    <p className="mt-1 text-sm text-red-600">{errors.correctAnswer}</p>
                  )}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 min-h-[100px] resize-y"
                  placeholder="Enter the solution or answer..."
                  disabled={saving}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 min-h-[100px] resize-y"
                  placeholder="Enter a hint for students..."
                  disabled={saving}
                />
              </div>
            </div>

            {/* Preview Box */}
            {(formData.subject || formData.chapter || formData.questionType) && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-yellow-600" />
                  <span>Question Preview</span>
                </h3>
                <div className="space-y-2 text-sm">
                  {formData.subject && (
                    <p><span className="font-semibold text-gray-700">Subject:</span> <span className="text-gray-900">{getSubjectName(formData.subject)}</span></p>
                  )}
                  {formData.chapter && (
                    <p><span className="font-semibold text-gray-700">Chapter:</span> <span className="text-gray-900">{getChapterName(formData.chapter)}</span></p>
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
                  <p className="font-semibold text-green-900">Question Updated Successfully!</p>
                  <p className="text-sm text-green-700">Redirecting to question bank...</p>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard/question-paper/bank')}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || showSuccess}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-700 text-white rounded-xl hover:from-yellow-700 hover:to-orange-800 transition-all shadow-lg hover:shadow-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Question'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditQuestion;