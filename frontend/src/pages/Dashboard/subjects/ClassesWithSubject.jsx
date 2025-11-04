import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  BookOpen, 
  Clock,
  Search,
  Filter,
  Users,
  Award,
  MoreVertical,
  Edit3,
  Trash2,
  Eye,
  Home,
  ChevronRight,
  BookMarked
} from 'lucide-react';

const ClassesWithSubject = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([
    {
      id: 1,
      className: 'Mathematics',
      subjectCount: 5,
      totalMarks: 500,
      studentCount: 25,
      teacher: 'John Smith',
      schedule: 'Mon, Wed, Fri'
    },
    {
      id: 2,
      className: 'Science',
      subjectCount: 4,
      totalMarks: 400,
      studentCount: 30,
      teacher: 'Sarah Johnson',
      schedule: 'Tue, Thu'
    },
    {
      id: 3,
      className: 'English',
      subjectCount: 3,
      totalMarks: 300,
      studentCount: 20,
      teacher: 'Mike Wilson',
      schedule: 'Mon, Tue, Wed'
    },
    {
      id: 4,
      className: 'History',
      subjectCount: 2,
      totalMarks: 200,
      studentCount: 18,
      teacher: 'Emily Brown',
      schedule: 'Thu, Fri'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalSubjects: 14,
    totalExamMarks: 1400
  });

  const filteredClasses = classes.filter(cls =>
    cls.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.teacher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClass = (id) => {
    setClasses(prev => prev.filter(cls => cls.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/40 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-purple-600 dark:text-purple-400 font-semibold">Subjects</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 dark:text-white font-semibold">Classes With Subjects</span>
        </div>

        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
              <BookMarked className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">Classes With Subjects</h1>
              <p className="text-gray-600 dark:text-gray-400">View and manage subjects assigned to classes</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">TOTAL SUBJECTS</p>
                <p className="text-4xl font-bold text-purple-600 dark:text-purple-400 mt-2">{stats.totalSubjects}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">TOTAL EXAM MARKS</p>
                <p className="text-4xl font-bold text-green-600 dark:text-green-400 mt-2">{stats.totalExamMarks}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl flex items-center justify-center">
                <Award className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">AVG MARKS/SUBJECT</p>
                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mt-2">100</p>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 font-bold">
                Marks
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search classes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-900/50 dark:text-white w-full sm:w-64 transition-all"
                />
              </div>

              {/* Filter */}
              <button className="flex items-center gap-2 px-6 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all font-semibold text-gray-700 dark:text-gray-300">
                <Filter className="w-5 h-5" />
                <span>Filter</span>
              </button>
            </div>

            {/* Assign Subjects Button */}
            <button 
              onClick={() => navigate('/dashboard/subjects/assign')}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>Assign Subjects</span>
            </button>
          </div>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((classItem) => (
            <div
              key={classItem.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              {/* Class Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{classItem.className}</h3>
                    <p className="text-sm text-gray-500">Teacher: {classItem.teacher}</p>
                  </div>
                  <div className="relative">
                    <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Class Content */}
              <div className="p-4">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <BookOpen className="w-4 h-4 text-blue-500" />
                      <span className="text-2xl font-bold text-gray-900">{classItem.subjectCount}</span>
                    </div>
                    <p className="text-xs text-gray-500">Subjects</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Award className="w-4 h-4 text-green-500" />
                      <span className="text-2xl font-bold text-gray-900">{classItem.totalMarks}</span>
                    </div>
                    <p className="text-xs text-gray-500">Total Marks</p>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Students:</span>
                    <span className="font-medium text-gray-900 flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{classItem.studentCount}</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Schedule:</span>
                    <span className="font-medium text-gray-900">{classItem.schedule}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Avg. Marks:</span>
                    <span className="font-medium text-gray-900">100</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                <div className="flex items-center justify-between">
                  <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClass(classItem.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredClasses.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 text-center py-16 px-6">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-12 h-12 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No classes found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by assigning subjects to classes and building your curriculum'}
            </p>
            <button 
              onClick={() => navigate('/dashboard/subjects/assign')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>Assign Subjects</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassesWithSubject;