import { useState } from 'react';
import { HelpCircle, Plus, Edit, Trash2, Filter } from 'lucide-react';

const QuestionBank = () => {
  const questions = [
    { id: 1, question: 'Solve the quadratic equation x² + 5x + 6 = 0', type: 'Short Answer', difficulty: 'Medium', marks: 3 },
    { id: 2, question: 'What is the value of sin 90°?', type: 'MCQ', difficulty: 'Easy', marks: 1 },
    { id: 3, question: 'Prove the Pythagorean theorem', type: 'Long Answer', difficulty: 'Hard', marks: 5 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Question Bank</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your question repository</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Question
        </button>
      </div>

      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <select className="input">
            <option>All Subjects</option>
            <option>Mathematics</option>
            <option>English</option>
          </select>
          <select className="input">
            <option>All Types</option>
            <option>MCQ</option>
            <option>Short Answer</option>
            <option>Long Answer</option>
          </select>
          <select className="input">
            <option>All Difficulty</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {questions.map(q => (
          <div key={q.id} className="card">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    q.difficulty === 'Easy' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                    q.difficulty === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                    'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                  }`}>
                    {q.difficulty}
                  </span>
                  <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                    {q.type}
                  </span>
                  <span className="px-2 py-1 rounded text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
                    {q.marks} marks
                  </span>
                </div>
                <p className="text-gray-800 dark:text-gray-100">{q.question}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionBank;
