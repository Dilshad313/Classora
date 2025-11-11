import { useState } from 'react';
import { BookOpen, Plus, Edit, Trash2 } from 'lucide-react';

const SubjectChapters = () => {
  const chapters = [
    { id: 1, subject: 'Mathematics', class: '10-A', chapter: 'Quadratic Equations', topics: 12 },
    { id: 2, subject: 'Mathematics', class: '10-A', chapter: 'Trigonometry', topics: 15 },
    { id: 3, subject: 'Mathematics', class: '9-B', chapter: 'Linear Equations', topics: 10 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Subject Chapters</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage chapters and topics</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Chapter
        </button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Subject</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Class</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Chapter</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Topics</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {chapters.map(chapter => (
                <tr key={chapter.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">{chapter.subject}</td>
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">{chapter.class}</td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-800 dark:text-gray-100">{chapter.chapter}</td>
                  <td className="py-3 px-4 text-center text-sm text-gray-700 dark:text-gray-300">{chapter.topics}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50">
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
    </div>
  );
};

export default SubjectChapters;
