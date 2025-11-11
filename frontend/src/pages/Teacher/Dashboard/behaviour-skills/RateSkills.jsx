import { useState } from 'react';
import { Target, Users, Save, Search } from 'lucide-react';

const RateSkills = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const skillCriteria = [
    'Communication', 'Teamwork', 'Critical Thinking', 'Creativity', 'Problem Solving'
  ];

  const students = [
    { id: 1, name: 'John Doe', rollNo: '001', class: '10-A' },
    { id: 2, name: 'Jane Smith', rollNo: '002', class: '10-A' },
    { id: 3, name: 'Mike Johnson', rollNo: '003', class: '10-A' },
  ];

  const [ratings, setRatings] = useState({});

  const handleRating = (studentId, skill, rating) => {
    setRatings(prev => ({
      ...prev,
      [`${studentId}-${skill}`]: rating
    }));
  };

  const getRatingLabel = (rating) => {
    if (rating >= 4) return 'Excellent';
    if (rating >= 3) return 'Good';
    if (rating >= 2) return 'Average';
    return 'Needs Improvement';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Rate Student Skills</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Evaluate student skills and competencies</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Save className="w-5 h-5" />
          Save Ratings
        </button>
      </div>

      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Class</label>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="input">
              <option value="">Select a class</option>
              <option value="10-A">Class 10-A</option>
              <option value="9-B">Class 9-B</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search Student</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input pl-10" />
            </div>
          </div>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Student</th>
              {skillCriteria.map(skill => (
                <th key={skill} className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">{skill}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id} className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{student.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Roll: {student.rollNo}</p>
                    </div>
                  </div>
                </td>
                {skillCriteria.map(skill => (
                  <td key={skill} className="py-3 px-4">
                    <div className="flex flex-col items-center gap-2">
                      <select
                        value={ratings[`${student.id}-${skill}`] || ''}
                        onChange={(e) => handleRating(student.id, skill, parseInt(e.target.value))}
                        className="input text-sm py-1"
                      >
                        <option value="">Rate</option>
                        <option value="5">5 - Excellent</option>
                        <option value="4">4 - Good</option>
                        <option value="3">3 - Average</option>
                        <option value="2">2 - Below Average</option>
                        <option value="1">1 - Poor</option>
                      </select>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RateSkills;
