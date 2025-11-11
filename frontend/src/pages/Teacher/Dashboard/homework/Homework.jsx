import { useState } from 'react';
import { BookOpenCheck, Plus, Calendar, Users, FileText, Edit, Trash2, Eye } from 'lucide-react';

const Homework = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  const homeworkList = [
    {
      id: 1,
      title: 'Chapter 5 - Quadratic Equations',
      class: '10-A',
      subject: 'Mathematics',
      dueDate: '2024-01-15',
      assignedDate: '2024-01-10',
      totalStudents: 35,
      submitted: 28,
      pending: 7,
      status: 'active'
    },
    {
      id: 2,
      title: 'Essay on Climate Change',
      class: '9-B',
      subject: 'English',
      dueDate: '2024-01-12',
      assignedDate: '2024-01-08',
      totalStudents: 32,
      submitted: 30,
      pending: 2,
      status: 'active'
    },
    {
      id: 3,
      title: 'Lab Report - Chemical Reactions',
      class: '10-C',
      subject: 'Chemistry',
      dueDate: '2024-01-20',
      assignedDate: '2024-01-12',
      totalStudents: 38,
      submitted: 15,
      pending: 23,
      status: 'active'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Homework Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Assign and track homework assignments</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Assign New Homework
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800">
          <BookOpenCheck className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Assignments</p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">12</p>
        </div>
        <div className="card bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800">
          <FileText className="w-8 h-8 text-green-600 dark:text-green-400 mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">8</p>
        </div>
        <div className="card bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-800">
          <Users className="w-8 h-8 text-orange-600 dark:text-orange-400 mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Pending Reviews</p>
          <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">32</p>
        </div>
        <div className="card bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-800">
          <Calendar className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Due This Week</p>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">3</p>
        </div>
      </div>

      {/* Homework List */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">All Homework Assignments</h3>
        <div className="space-y-4">
          {homeworkList.map((homework) => (
            <div key={homework.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">{homework.title}</h4>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {homework.class} - {homework.subject}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Due: {new Date(homework.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Submitted:</span>
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                        {homework.submitted}/{homework.totalStudents}
                      </span>
                    </div>
                    <div className="flex-1 max-w-xs">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                          style={{ width: `${(homework.submitted / homework.totalStudents) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                    <Eye className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Homework Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Assign New Homework</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                <input type="text" className="input" placeholder="Enter homework title" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Class</label>
                  <select className="input">
                    <option>Select Class</option>
                    <option>10-A</option>
                    <option>9-B</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                  <select className="input">
                    <option>Select Subject</option>
                    <option>Mathematics</option>
                    <option>English</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Due Date</label>
                <input type="date" className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea className="input" rows="4" placeholder="Enter homework description"></textarea>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all font-semibold"
              >
                Cancel
              </button>
              <button className="flex-1 btn-primary">
                Assign Homework
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Homework;
