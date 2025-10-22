import { useState } from 'react';
import { Plus, Edit, Trash2, Users, BookOpen } from 'lucide-react';

const Classes = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    className: '',
    numericValue: '',
    sections: []
  });

  const classes = [
    {
      id: 1,
      name: 'Grade 6',
      numericValue: 6,
      sections: ['A', 'B'],
      students: 85,
      subjects: 6,
      classTeacher: 'Ms. Jane Doe'
    },
    {
      id: 2,
      name: 'Grade 7',
      numericValue: 7,
      sections: ['A', 'B'],
      students: 78,
      subjects: 7,
      classTeacher: 'Mr. John Smith'
    },
    {
      id: 3,
      name: 'Grade 8',
      numericValue: 8,
      sections: ['A', 'B'],
      students: 72,
      subjects: 8,
      classTeacher: 'Dr. Alice Brown'
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Class created successfully!');
    setShowModal(false);
    setFormData({ className: '', numericValue: '', sections: [] });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Classes & Sections</h1>
          <p className="text-gray-600 mt-1">Manage academic classes and their sections</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Class
        </button>
      </div>

      {/* Classes Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classItem) => (
          <div key={classItem.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{classItem.name}</h3>
                <p className="text-sm text-gray-600">Class Teacher: {classItem.classTeacher}</p>
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

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Students</span>
                </div>
                <span className="text-lg font-bold text-blue-600">{classItem.students}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">Subjects</span>
                </div>
                <span className="text-lg font-bold text-purple-600">{classItem.subjects}</span>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">Sections:</p>
                <div className="flex gap-2">
                  {classItem.sections.map((section, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg text-sm font-semibold"
                    >
                      {classItem.name} - {section}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button className="w-full mt-4 btn-secondary text-sm">
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Add Class Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Class</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Class Name</label>
                <input
                  type="text"
                  value={formData.className}
                  onChange={(e) => setFormData({...formData, className: e.target.value})}
                  className="input-field"
                  placeholder="e.g., Grade 6"
                  required
                />
              </div>

              <div>
                <label className="label">Numeric Value</label>
                <input
                  type="number"
                  value={formData.numericValue}
                  onChange={(e) => setFormData({...formData, numericValue: e.target.value})}
                  className="input-field"
                  placeholder="e.g., 6"
                  required
                />
              </div>

              <div>
                <label className="label">Sections (comma-separated)</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g., A, B, C"
                />
                <p className="text-xs text-gray-500 mt-1">Enter section names separated by commas</p>
              </div>

              <div>
                <label className="label">Class Teacher</label>
                <select className="input-field">
                  <option value="">Select Teacher</option>
                  <option value="1">Ms. Jane Doe</option>
                  <option value="2">Mr. John Smith</option>
                  <option value="3">Dr. Alice Brown</option>
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
                  Create Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Classes;
