import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FilePlus,
  Home,
  ChevronRight,
  CheckCircle2,
  BookOpen,
  FileText,
  Hash,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  createQuestion,
  getDropdownData,
  getQuestionById
} from '../../../../services/questionPaperApi';

const CreateQuestion = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
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

  useEffect(() => {
    loadDropdownData();
  }, []);

  const loadDropdownData = async () => {
    try {
      setLoadingData(true);
      const data = await getDropdownData();
      setSubjects(data.subjects);
      setChapters(data.chapters);
      toast.success('Subjects and chapters loaded successfully');
    } catch (error) {
      console.error('Failed to load dropdown data:', error);
      toast.error('Failed to load subjects and chapters. Please try again.');
    } finally {
      setLoadingData(false);
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
    
    // Show toast when subject changes (chapters reset)
    if (name === 'subject' && value) {
      const subjectName = subjects.find(s => s._id === value)?.name || value;
      toast.success(`Subject changed to: ${subjectName}`, {
        duration: 2000,
      });
    }
    
    // Show toast when question type changes to MCQ
    if (name === 'questionType' && value === 'MCQ') {
      toast('MCQ selected - Please fill in all four options and select the correct answer', {
        icon: '📝',
        duration: 3000,
      });
    }
    
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
    
    // Show validation error toast if there are errors
    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fill in all required fields correctly');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

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

      await createQuestion(questionData);
      
      // Show success toast
      toast.success('Question created successfully!', {
        duration: 3000,
      });

      // Reset form after successful submission
      setFormData({
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
      setErrors({});
      
      // Show form reset notification
      toast('Form reset - Ready for next question', {
        icon: '🔄',
        duration: 2000,
      });

    } catch (error) {
      console.error('Error creating question:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create question. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
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

  if (loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-5xl mx-auto">
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
          <span className="text-gray-900 dark:text-white font-semibold">Create Question</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <FilePlus className="w-6 h-6 text-white" />
            </div>
            <span>Create New Question</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Add a new question to the question bank</p>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
              <span>Question Details</span>
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Fill in the information below</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Subject and Chapter */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border ${errors.subject ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  disabled={loading}
                >
                  <option value="" className="dark:bg-gray-700">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject._id} value={subject._id} className="dark:bg-gray-700">
                      {subject.name}
                    </option>
                  ))}
                </select>
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.subject}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Chapter <span className="text-red-500">*</span>
                </label>
                <select
                  name="chapter"
                  value={formData.chapter}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border ${errors.chapter ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  disabled={!formData.subject || loading}
                >
                  <option value="" className="dark:bg-gray-700">Select Chapter</option>
                  {filteredChapters.map(chapter => (
                    <option key={chapter._id} value={chapter._id} className="dark:bg-gray-700">
                      {chapter.title} (Chapter {chapter.chapterNumber})
                    </option>
                  ))}
                </select>
                {errors.chapter && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.chapter}</p>
                )}
              </div>
            </div>

            {/* Question Type, Difficulty, and Marks */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Question Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="questionType"
                  value={formData.questionType}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border ${errors.questionType ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  disabled={loading}
                >
                  <option value="" className="dark:bg-gray-700">Select Type</option>
                  {questionTypes.map(type => (
                    <option key={type} value={type} className="dark:bg-gray-700">{type}</option>
                  ))}
                </select>
                {errors.questionType && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.questionType}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Difficulty Level <span className="text-red-500">*</span>
                </label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border ${errors.difficulty ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  disabled={loading}
                >
                  <option value="" className="dark:bg-gray-700">Select Difficulty</option>
                  {difficultyLevels.map(level => (
                    <option key={level} value={level} className="dark:bg-gray-700">{level}</option>
                  ))}
                </select>
                {errors.difficulty && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.difficulty}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Marks <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="marks"
                  value={formData.marks}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border ${errors.marks ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="e.g., 5"
                  min="1"
                  max="100"
                  disabled={loading}
                />
                {errors.marks && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.marks}</p>
                )}
              </div>
            </div>

            {/* Question */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Question <span className="text-red-500">*</span>
              </label>
              <textarea
                name="question"
                value={formData.question}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${errors.question ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400 min-h-[120px] resize-y bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                placeholder="Enter the question here..."
                disabled={loading}
              />
              {errors.question && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.question}</p>
              )}
            </div>

            {/* MCQ Options (only show if MCQ is selected) */}
            {formData.questionType === 'MCQ' && (
              <div className="space-y-4 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                  <Hash className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>Multiple Choice Options</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Option 1 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="option1"
                      value={formData.option1}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 border ${errors.option1 ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      placeholder="Enter option 1"
                      disabled={loading}
                    />
                    {errors.option1 && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.option1}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Option 2 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="option2"
                      value={formData.option2}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 border ${errors.option2 ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      placeholder="Enter option 2"
                      disabled={loading}
                    />
                    {errors.option2 && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.option2}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Option 3 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="option3"
                      value={formData.option3}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 border ${errors.option3 ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      placeholder="Enter option 3"
                      disabled={loading}
                    />
                    {errors.option3 && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.option3}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Option 4 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="option4"
                      value={formData.option4}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 border ${errors.option4 ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      placeholder="Enter option 4"
                      disabled={loading}
                    />
                    {errors.option4 && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.option4}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Correct Answer <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="correctAnswer"
                    value={formData.correctAnswer}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border ${errors.correctAnswer ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    disabled={loading}
                  >
                    <option value="" className="dark:bg-gray-700">Select Correct Answer</option>
                    <option value="1" className="dark:bg-gray-700">Option 1</option>
                    <option value="2" className="dark:bg-gray-700">Option 2</option>
                    <option value="3" className="dark:bg-gray-700">Option 3</option>
                    <option value="4" className="dark:bg-gray-700">Option 4</option>
                  </select>
                  {errors.correctAnswer && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.correctAnswer}</p>
                  )}
                </div>
              </div>
            )}

            {/* Solution and Hint */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Solution <span className="text-gray-400 dark:text-gray-500 text-xs">(Optional)</span>
                </label>
                <textarea
                  name="solution"
                  value={formData.solution}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400 min-h-[100px] resize-y bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter the solution or answer..."
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Hint <span className="text-gray-400 dark:text-gray-500 text-xs">(Optional)</span>
                </label>
                <textarea
                  name="hint"
                  value={formData.hint}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400 min-h-[100px] resize-y bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter a hint for students..."
                  disabled={loading}
                />
              </div>
            </div>

            {/* Preview Box */}
            {(formData.subject || formData.chapter || formData.questionType) && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span>Question Preview</span>
                </h3>
                <div className="space-y-2 text-sm">
                  {formData.subject && (
                    <p><span className="font-semibold text-gray-700 dark:text-gray-300">Subject:</span> <span className="text-gray-900 dark:text-white">{getSubjectName(formData.subject)}</span></p>
                  )}
                  {formData.chapter && (
                    <p><span className="font-semibold text-gray-700 dark:text-gray-300">Chapter:</span> <span className="text-gray-900 dark:text-white">{getChapterName(formData.chapter)}</span></p>
                  )}
                  {formData.questionType && (
                    <p><span className="font-semibold text-gray-700 dark:text-gray-300">Type:</span> <span className="text-gray-900 dark:text-white">{formData.questionType}</span></p>
                  )}
                  {formData.difficulty && (
                    <p><span className="font-semibold text-gray-700 dark:text-gray-300">Difficulty:</span> <span className="text-gray-900 dark:text-white">{formData.difficulty}</span></p>
                  )}
                  {formData.marks && (
                    <p><span className="font-semibold text-gray-700 dark:text-gray-300">Marks:</span> <span className="text-gray-900 dark:text-white">{formData.marks}</span></p>
                  )}
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => {
                  toast('Navigating back to Question Bank');
                  navigate('/dashboard/question-paper/bank');
                }}
                className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all shadow-lg hover:shadow-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center dark:from-green-700 dark:to-emerald-800 dark:hover:from-green-800 dark:hover:to-emerald-900"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Question'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateQuestion;