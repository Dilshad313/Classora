import { useState } from 'react';
import { Target, Users, Save, Search, Award, TrendingUp, BarChart3, Brain, Lightbulb, MessageSquare } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-800 dark:to-cyan-800 rounded-2xl shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative px-8 py-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Rate Student Skills</h1>
                <p className="text-blue-100 text-lg">Evaluate student skills and competencies with precision</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-blue-100">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                <span>Skill Assessment</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span>Growth Tracking</span>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2">
            <Save className="w-5 h-5" />
            Save Ratings
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Students</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">24</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <Brain className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Skills Assessed</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">15</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Skill Rating</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">3.8</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Progress</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">+22%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Filter Students</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Select class and search for specific students</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Users className="w-4 h-4 inline mr-2 text-blue-600 dark:text-blue-400" />
                  Select Class
                </label>
                <select 
                  value={selectedClass} 
                  onChange={(e) => setSelectedClass(e.target.value)} 
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                >
                  <option value="">Select a class</option>
                  <option value="10-A">Class 10-A</option>
                  <option value="9-B">Class 9-B</option>
                  <option value="10-C">Class 10-C</option>
                  <option value="9-A">Class 9-A</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Search className="w-4 h-4 inline mr-2 text-cyan-600 dark:text-cyan-400" />
                  Search Student
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search by name or roll number..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 dark:focus:ring-cyan-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Skills Rating Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Skills Assessment Matrix</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Evaluate each student's skills and competencies (1-5 scale)</p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50">
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700 dark:text-gray-300 min-w-[200px]">Student Information</th>
                  {skillCriteria.map(skill => (
                    <th key={skill} className="text-center py-4 px-4 text-sm font-bold text-gray-700 dark:text-gray-300 min-w-[160px]">
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2">
                          {skill === 'Communication' && <MessageSquare className="w-4 h-4 text-blue-500" />}
                          {skill === 'Teamwork' && <Users className="w-4 h-4 text-green-500" />}
                          {skill === 'Critical Thinking' && <Brain className="w-4 h-4 text-purple-500" />}
                          {skill === 'Creativity' && <Lightbulb className="w-4 h-4 text-yellow-500" />}
                          {skill === 'Problem Solving' && <Target className="w-4 h-4 text-red-500" />}
                          <span>{skill}</span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">1-5 Scale</div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{student.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Roll No: {student.rollNo}</p>
                          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{student.class}</p>
                        </div>
                      </div>
                    </td>
                    {skillCriteria.map(skill => (
                      <td key={skill} className="py-4 px-4">
                        <div className="flex flex-col items-center gap-3">
                          <select
                            value={ratings[`${student.id}-${skill}`] || ''}
                            onChange={(e) => handleRating(student.id, skill, parseInt(e.target.value))}
                            className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm transition-all duration-200"
                          >
                            <option value="">Select Rating</option>
                            <option value="5">5 - Excellent</option>
                            <option value="4">4 - Good</option>
                            <option value="3">3 - Average</option>
                            <option value="2">2 - Below Average</option>
                            <option value="1">1 - Poor</option>
                          </select>
                          {ratings[`${student.id}-${skill}`] && (
                            <div className="text-center">
                              <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                                ratings[`${student.id}-${skill}`] >= 4 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                  : ratings[`${student.id}-${skill}`] >= 3
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                  : ratings[`${student.id}-${skill}`] >= 2
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                              }`}>
                                {getRatingLabel(ratings[`${student.id}-${skill}`])}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateSkills;
