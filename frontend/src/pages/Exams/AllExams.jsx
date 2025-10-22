import { useState } from 'react';
import { Plus, Calendar, FileText, Edit, Trash2, Award } from 'lucide-react';

const AllExams = () => {
  const [showModal, setShowModal] = useState(false);

  const exams = [
    {
      id: 1,
      name: 'First Term Examination 2024',
      academicYear: '2024-2025',
      startDate: '2024-10-30',
      endDate: '2024-11-10',
      classes: ['Grade 6', 'Grade 7', 'Grade 8'],
      subjects: 6,
      status: 'Upcoming'
    },
    {
      id: 2,
      name: 'Mid-Term Assessment',
      academicYear: '2024-2025',
      startDate: '2024-09-15',
      endDate: '2024-09-25',
      classes: ['Grade 6', 'Grade 7', 'Grade 8'],
      subjects: 6,
      status: 'Completed'
    },
    {
      id: 3,
      name: 'Unit Test - Mathematics',
      academicYear: '2024-2025',
      startDate: '2024-10-25',
      endDate: '2024-10-25',
      classes: ['Grade 6'],
      subjects: 1,
      status: 'In Progress'
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Upcoming':
        return 'bg-blue-100 text-blue-700';
      case 'In Progress':
        return 'bg-green-100 text-green-700';
      case 'Completed':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Exam Management</h1>
          <p className="text-gray-600 mt-1">Create and manage examinations</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create New Exam
        </button>
      </div>

      {/* Exams List */}
      <div className="grid gap-6">
        {exams.map((exam) => (
          <div key={exam.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-primary-500 to-secondary-500 p-4 rounded-xl">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{exam.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">Academic Year: {exam.academicYear}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {exam.startDate} to {exam.endDate}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(exam.status)}`}>
                      {exam.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600 font-medium mb-1">Classes</p>
                <div className="flex flex-wrap gap-2">
                  {exam.classes.map((cls, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-200 text-blue-800 rounded text-xs font-semibold">
                      {cls}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-600 font-medium mb-1">Subjects</p>
                <p className="text-2xl font-bold text-purple-700">{exam.subjects}</p>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex-1 btn-secondary text-sm">
                  View Schedule
                </button>
                <button className="flex-1 btn-primary text-sm">
                  Enter Marks
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Exam Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Create New Exam</h2>
            
            <form className="space-y-4">
              <div>
                <label className="label">Exam Name</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g., First Term Examination 2024"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Start Date</label>
                  <input type="date" className="input-field" required />
                </div>
                <div>
                  <label className="label">End Date</label>
                  <input type="date" className="input-field" required />
                </div>
              </div>

              <div>
                <label className="label">Select Classes</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Grade 6', 'Grade 7', 'Grade 8'].map((cls) => (
                    <label key={cls} className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input type="checkbox" className="w-4 h-4 text-primary-600" />
                      <span className="text-sm font-medium">{cls}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="label">Exam Type</label>
                <select className="input-field">
                  <option>Terminal Exam</option>
                  <option>Unit Test</option>
                  <option>Mid-Term</option>
                  <option>Final Exam</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  Create Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllExams;
