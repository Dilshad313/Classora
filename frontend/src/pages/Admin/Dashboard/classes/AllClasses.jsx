import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Users, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Eye,
  Search,
  Filter,
  BookOpen,
  Home,
  ChevronRight,
  GraduationCap
} from 'lucide-react';

const AllClasses = () => {
  const navigate = useNavigate();
  
  // Load classes from localStorage
  const [classes, setClasses] = useState(() => {
    const savedClasses = localStorage.getItem('classes');
    return savedClasses ? JSON.parse(savedClasses) : [
    {
      id: 1,
      name: 'Boye',
      studentCount: 9,
      attendancePercentage: 0,
      section: 'A',
      teacher: 'John Smith',
      subject: 'Mathematics'
    },
    {
      id: 2,
      name: 'Ghis',
      studentCount: 6,
      attendancePercentage: 0,
      section: 'B',
      teacher: 'Sarah Johnson',
      subject: 'Science'
    },
    {
      id: 3,
      name: 'N/A',
      studentCount: 12,
      attendancePercentage: 100,
      section: 'C',
      teacher: 'Mike Wilson',
      subject: 'English'
    }
    ];
  });

  // Save classes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('classes', JSON.stringify(classes));
  }, [classes]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleDeleteClass = (id) => {
    setClasses(prev => prev.filter(cls => cls.id !== id));
  };

  const getAttendanceColor = (percentage) => {
    if (percentage === 0) return 'text-red-600 bg-red-50';
    if (percentage === 100) return 'text-green-600 bg-green-50';
    return 'text-yellow-600 bg-yellow-50';
  };

  const getAttendanceText = (percentage) => {
    if (percentage === 0) return 'No attendance';
    if (percentage === 100) return 'Perfect attendance';
    return `${percentage}% attendance`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/40 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-blue-600 dark:text-blue-400 font-semibold">Classes</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 dark:text-white font-semibold">All Classes</span>
        </div>

        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-6 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">All Classes</h1>
                <p className="text-gray-600 dark:text-gray-400">Manage and view all classes</p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex items-center gap-6 mt-4 sm:mt-0">
              <div className="text-center px-6 py-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{classes.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Classes</div>
              </div>
              <div className="text-center px-6 py-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {classes.reduce((total, cls) => total + cls.studentCount, 0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Students</div>
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
                  className="pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900/50 dark:text-white w-full sm:w-64 transition-all"
                />
              </div>

              {/* Filter */}
              <button className="flex items-center gap-2 px-6 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all font-semibold text-gray-700 dark:text-gray-300">
                <Filter className="w-5 h-5" />
                <span>Filter</span>
              </button>
            </div>

            {/* Add New Class Button */}
            <button
              onClick={() => navigate('/dashboard/classes/new')}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Class</span>
            </button>
          </div>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredClasses.map((classItem) => (
            <div
              key={classItem.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              {/* Class Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{classItem.name}</h3>
                    <p className="text-sm text-gray-500">Section {classItem.section}</p>
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
                {/* Student Count */}
                <div className="flex items-center space-x-2 mb-4">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {classItem.studentCount} STUDENT{classItem.studentCount !== 1 ? 'S' : ''}
                  </span>
                </div>

                {/* Attendance */}
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getAttendanceColor(classItem.attendancePercentage)}`}>
                  {classItem.attendancePercentage}%
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {getAttendanceText(classItem.attendancePercentage)}
                </p>

                {/* Teacher and Subject */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Teacher:</span>
                    <span className="font-medium text-gray-900">{classItem.teacher}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Subject:</span>
                    <span className="font-medium text-gray-900">{classItem.subject}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                <div className="flex items-center justify-between">
                  <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
                    <Eye className="w-4 h-4" />
                    <span>View</span>
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
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No classes found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first class and building your curriculum'}
            </p>
            <button
              onClick={() => navigate('/dashboard/classes/new')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Class</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllClasses;