import React, { useState } from 'react';
import { 
  FileEdit, 
  Save, 
  Plus, 
  Trash2, 
  Eye, 
  BookOpen, 
  Clock, 
  Users, 
  Award, 
  CheckCircle2,
  AlertCircle,
  Edit3,
  Copy,
  Download
} from 'lucide-react';

const CreateQuestion = () => {
  const [paperDetails, setPaperDetails] = useState({
    title: '',
    subject: '',
    class: '',
    totalMarks: 100,
    duration: 180,
    examDate: '',
    instructions: ''
  });

  const [sections, setSections] = useState([
    {
      id: 1,
      name: 'Section A: Multiple Choice Questions',
      description: 'Choose the correct answer',
      marksPerQuestion: 1,
      totalQuestions: 20,
      totalMarks: 20,
      questions: []
    },
    {
      id: 2,
      name: 'Section B: Short Answer Questions',
      description: 'Answer in 2-3 sentences',
      marksPerQuestion: 3,
      totalQuestions: 10,
      totalMarks: 30,
      questions: []
    },
    {
      id: 3,
      name: 'Section C: Long Answer Questions',
      description: 'Answer in detail',
      marksPerQuestion: 5,
      totalQuestions: 10,
      totalMarks: 50,
      questions: []
    }
  ]);

  const [showPreview, setShowPreview] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  const subjects = ['Mathematics', 'English', 'Science', 'Social Studies', 'Hindi'];
  const classes = ['Class 10-A', 'Class 10-B', 'Class 9-A', 'Class 9-B'];

  const handleInputChange = (field, value) => {
    setPaperDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSectionUpdate = (sectionId, field, value) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, [field]: value, totalMarks: field === 'totalQuestions' || field === 'marksPerQuestion' 
            ? (field === 'totalQuestions' ? value * section.marksPerQuestion : section.totalQuestions * value)
            : section.totalMarks }
        : section
    ));
  };

  const addSection = () => {
    const newSection = {
      id: sections.length + 1,
      name: `Section ${String.fromCharCode(65 + sections.length)}: New Section`,
      description: 'Enter section description',
      marksPerQuestion: 1,
      totalQuestions: 5,
      totalMarks: 5,
      questions: []
    };
    setSections([...sections, newSection]);
  };

  const removeSection = (sectionId) => {
    setSections(sections.filter(section => section.id !== sectionId));
  };

  const calculateTotalMarks = () => {
    return sections.reduce((total, section) => total + section.totalMarks, 0);
  };

  const handleSaveAndGenerate = () => {
    if (!paperDetails.title || !paperDetails.subject || !paperDetails.class) {
      alert('Please fill in all required fields');
      return;
    }
    
    setShowGenerateModal(true);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-800 dark:to-purple-800 rounded-2xl shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative px-8 py-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <FileEdit className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Create Question Paper</h1>
                <p className="text-indigo-100 text-lg">Design comprehensive question papers with ease</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-indigo-100">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span>Multiple Sections</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span>Auto Calculation</span>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-end">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
          >
            <Eye className="w-5 h-5" />
            {showPreview ? 'Hide Preview' : 'Preview Paper'}
          </button>
          <button
            onClick={handleSaveAndGenerate}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            Save & Generate
          </button>
        </div>

        {/* Paper Details */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Paper Details</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Configure your question paper settings</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Paper Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={paperDetails.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                  placeholder="e.g., Mid-term Examination"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Subject <span className="text-red-500">*</span>
                </label>
                <select
                  value={paperDetails.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Class <span className="text-red-500">*</span>
                </label>
                <select
                  value={paperDetails.class}
                  onChange={(e) => handleInputChange('class', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                >
                  <option value="">Select Class</option>
                  {classes.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Clock className="w-4 h-4 inline mr-2 text-indigo-600 dark:text-indigo-400" />
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={paperDetails.duration}
                  onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                  placeholder="180"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Exam Date
                </label>
                <input
                  type="date"
                  value={paperDetails.examDate}
                  onChange={(e) => handleInputChange('examDate', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Award className="w-4 h-4 inline mr-2 text-green-600 dark:text-green-400" />
                  Total Marks
                </label>
                <div className="px-4 py-3 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">{calculateTotalMarks()}</span>
                  <span className="text-sm text-green-600 dark:text-green-400 ml-2">marks</span>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Instructions (Optional)
              </label>
              <textarea
                value={paperDetails.instructions}
                onChange={(e) => handleInputChange('instructions', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200 min-h-[100px] resize-y"
                placeholder="Enter exam instructions, rules, or guidelines..."
              />
            </div>
          </div>
        </div>

        {/* Sections Configuration */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Edit3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Question Sections</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Configure sections and question distribution</p>
                </div>
              </div>
              <button
                onClick={addSection}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Section
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {sections.map((section, index) => (
                <div key={section.id} className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={section.name}
                        onChange={(e) => handleSectionUpdate(section.id, 'name', e.target.value)}
                        className="text-lg font-bold bg-transparent border-none outline-none text-gray-800 dark:text-gray-100 w-full"
                      />
                      <input
                        type="text"
                        value={section.description}
                        onChange={(e) => handleSectionUpdate(section.id, 'description', e.target.value)}
                        className="text-sm bg-transparent border-none outline-none text-gray-600 dark:text-gray-400 w-full mt-1"
                      />
                    </div>
                    {sections.length > 1 && (
                      <button
                        onClick={() => removeSection(section.id)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Questions Count
                      </label>
                      <input
                        type="number"
                        value={section.totalQuestions}
                        onChange={(e) => handleSectionUpdate(section.id, 'totalQuestions', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Marks per Question
                      </label>
                      <input
                        type="number"
                        value={section.marksPerQuestion}
                        onChange={(e) => handleSectionUpdate(section.id, 'marksPerQuestion', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Total Marks
                      </label>
                      <div className="px-3 py-2 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                        <span className="font-bold text-purple-600 dark:text-purple-400">{section.totalMarks}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-green-900 dark:text-green-100">Question Paper Created Successfully!</p>
              <p className="text-sm text-green-700 dark:text-green-300">Your question paper has been generated and saved.</p>
            </div>
          </div>
        )}

        {/* Preview Section */}
        {showPreview && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Paper Preview</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Preview of your question paper</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{paperDetails.title || 'Question Paper Title'}</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Subject: {paperDetails.subject || 'Subject'} | Class: {paperDetails.class || 'Class'} | 
                  Duration: {paperDetails.duration} minutes | Total Marks: {calculateTotalMarks()}
                </p>
                {paperDetails.examDate && (
                  <p className="text-gray-600 dark:text-gray-400">Date: {paperDetails.examDate}</p>
                )}
              </div>
              
              {paperDetails.instructions && (
                <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Instructions:</h4>
                  <p className="text-gray-700 dark:text-gray-300">{paperDetails.instructions}</p>
                </div>
              )}

              <div className="space-y-6">
                {sections.map((section, index) => (
                  <div key={section.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-2">{section.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{section.description}</p>
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      <p>Number of Questions: {section.totalQuestions}</p>
                      <p>Marks per Question: {section.marksPerQuestion}</p>
                      <p className="font-semibold">Total Marks: {section.totalMarks}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Add Question Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                      <Plus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Add Question to Section</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Create a new question for your paper</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Question Text <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200 min-h-[100px] resize-y"
                      placeholder="Enter your question here..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Question Type
                      </label>
                      <select className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200">
                        <option>Multiple Choice</option>
                        <option>Short Answer</option>
                        <option>Long Answer</option>
                        <option>True/False</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Marks
                      </label>
                      <input
                        type="number"
                        min="1"
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                        placeholder="5"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Options (for MCQ)
                    </label>
                    <div className="space-y-2">
                      {[1, 2, 3, 4].map(num => (
                        <div key={num} className="flex items-center gap-3">
                          <span className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600 dark:text-gray-400">
                            {String.fromCharCode(64 + num)}
                          </span>
                          <input
                            type="text"
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            placeholder={`Option ${num}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Correct Answer
                    </label>
                    <textarea
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                      placeholder="Enter the correct answer or explanation..."
                      rows="3"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                      Add Question
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Generate Paper Modal */}
        {showGenerateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <Download className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Generated Question Paper</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Your question paper is ready</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowGenerateModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl p-8 mb-6">
                  <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                      {paperDetails.title || 'Question Paper Title'}
                    </h1>
                    <div className="text-gray-600 dark:text-gray-400 space-y-1">
                      <p>Subject: {paperDetails.subject} | Class: {paperDetails.class}</p>
                      <p>Duration: {paperDetails.duration} minutes | Total Marks: {calculateTotalMarks()}</p>
                      {paperDetails.examDate && <p>Date: {paperDetails.examDate}</p>}
                    </div>
                  </div>

                  {paperDetails.instructions && (
                    <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Instructions:</h4>
                      <p className="text-gray-700 dark:text-gray-300">{paperDetails.instructions}</p>
                    </div>
                  )}

                  <div className="space-y-8">
                    {sections.map((section, index) => (
                      <div key={section.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">{section.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{section.description}</p>
                        <div className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                          <p>Answer any {section.totalQuestions} questions. Each question carries {section.marksPerQuestion} mark(s).</p>
                        </div>
                        
                        <div className="space-y-4">
                          {Array.from({ length: Math.min(section.totalQuestions, 3) }, (_, i) => (
                            <div key={i} className="border-l-4 border-indigo-500 pl-4">
                              <p className="font-semibold text-gray-800 dark:text-gray-100">
                                {i + 1}. Sample question for {section.name.toLowerCase()}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                [{section.marksPerQuestion} mark{section.marksPerQuestion > 1 ? 's' : ''}]
                              </p>
                            </div>
                          ))}
                          {section.totalQuestions > 3 && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                              ... and {section.totalQuestions - 3} more questions
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowGenerateModal(false)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => alert('Paper downloaded successfully!')}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download PDF
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

export default CreateQuestion;
