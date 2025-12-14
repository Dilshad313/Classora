import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Plus, 
  BookOpen, 
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
  BookMarked,
  Loader2,
  RefreshCw,
  AlertTriangle,
  BarChart3,
  Calendar,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { 
  fetchClassesWithSubjects, 
  fetchSubjectStats, 
  deleteSubjectAssignment 
} from '../../../../services/subjectApi';

const ClassesWithSubject = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get('search') || '';
  });
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState('');
  const [statsLoading, setStatsLoading] = useState(true);
  
  const [stats, setStats] = useState({
    totalSubjects: 0,
    totalExamMarks: 0,
    avgMarks: 0,
    requiredSubjects: 0,
    optionalSubjects: 0
  });

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim() !== '') {
        loadData();
      }
    }, 500); // Increased debounce time

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('🔄 Loading classes with subjects...');
      
      const [classesData, statsData] = await Promise.all([
        fetchClassesWithSubjects(searchTerm),
        fetchSubjectStats()
      ]);
      
      console.log(`✅ Loaded ${classesData.length} classes`);
      setClasses(classesData);
      setStats(statsData);
      setStatsLoading(false);
    } catch (error) {
      console.error('❌ Error loading data:', error);
      setError(`Failed to load data: ${error.message}`);
      
      // Set empty state on error
      setClasses([]);
      setStats({
        totalSubjects: 0,
        totalExamMarks: 0,
        avgMarks: 0,
        requiredSubjects: 0,
        optionalSubjects: 0
      });
    } finally {
      setLoading(false);
      setStatsLoading(false);
    }
  };

  const handleDeleteClass = async (id, className) => {
    if (!window.confirm(`Are you sure you want to remove subjects from "${className}"?\n\nThis action cannot be undone.`)) {
      return;
    }
    
    try {
      setDeleting(id);
      await deleteSubjectAssignment(id);
      
      // Update local state
      setClasses(prev => prev.filter(cls => cls.id !== id));
      
      // Refresh stats
      const newStats = await fetchSubjectStats();
      setStats(newStats);
      
      alert('✅ Subject assignment deleted successfully');
    } catch (error) {
      console.error('❌ Delete error:', error);
      alert(`Failed to delete: ${error.message}`);
    } finally {
      setDeleting(null);
    }
  };

  const handleRefresh = () => {
    setSearchTerm('');
    loadData();
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'inactive': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return <CheckCircle className="w-3 h-3" />;
      case 'inactive': return <Clock className="w-3 h-3" />;
      case 'cancelled': return <XCircle className="w-3 h-3" />;
      default: return null;
    }
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
                <BookMarked className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">Classes With Subjects</h1>
                <p className="text-gray-600 dark:text-gray-400">View and manage subjects assigned to classes</p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-red-800 dark:text-red-300 font-medium">Error Loading Data</p>
                <p className="text-red-700 dark:text-red-400 text-sm mt-1">{error}</p>
                <button
                  onClick={handleRefresh}
                  className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">TOTAL SUBJECTS</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">
                  {statsLoading ? '...' : stats.totalSubjects}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full">
                    {statsLoading ? '...' : stats.requiredSubjects} required
                  </span>
                  <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                    {statsLoading ? '...' : stats.optionalSubjects} optional
                  </span>
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">TOTAL EXAM MARKS</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                  {statsLoading ? '...' : stats.totalExamMarks.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Across all classes
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl flex items-center justify-center">
                <Award className="w-7 h-7 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">AVG MARKS/SUBJECT</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                  {statsLoading ? '...' : stats.avgMarks}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Average per subject
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-2xl flex items-center justify-center">
                <BarChart3 className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">CLASSES WITH SUBJECTS</p>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-2">
                  {loading ? '...' : classes.length}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Total assigned classes
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-2xl flex items-center justify-center">
                <Users className="w-7 h-7 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative flex-1 sm:w-80">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search classes or teachers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-900/50 dark:text-white w-full transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Filter - placeholder for future functionality */}
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
          {searchTerm && (
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              Searching for: <span className="font-semibold">"{searchTerm}"</span> • 
              Found {classes.length} result{classes.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-purple-600 dark:text-purple-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading classes with subjects...</p>
            </div>
          </div>
        )}

        {/* Classes Grid */}
        {!loading && classes.length > 0 && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                All Classes ({classes.length})
              </h2>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Sorted by: <span className="font-semibold">Recent</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.map((classItem) => (
                <div
                  key={classItem.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Class Header */}
                  <div className="p-5 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-gray-900 dark:text-white text-lg truncate">{classItem.className}</h3>
                          {classItem.status && (
                            <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${getStatusColor(classItem.status)}`}>
                              {getStatusIcon(classItem.status)}
                              {classItem.status.charAt(0).toUpperCase() + classItem.status.slice(1)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>Teacher:</span>
                            <span className="font-medium text-gray-800 dark:text-gray-300 ml-1">{classItem.teacher}</span>
                          </div>
                        </div>
                      </div>
                      <div className="relative">
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Class Content */}
                  <div className="p-5">
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-5">
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                          <BookOpen className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                          <span className="text-2xl font-bold text-gray-900 dark:text-white">{classItem.subjectCount}</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Subjects</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                          <Award className="w-5 h-5 text-green-500 dark:text-green-400" />
                          <span className="text-2xl font-bold text-gray-900 dark:text-white">{classItem.totalMarks}</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Total Marks</p>
                      </div>
                      <div className="text-center">
                        <div className="mb-2">
                          <span className="text-2xl font-bold text-gray-900 dark:text-white">
                            {classItem.subjectCount > 0 ? Math.round(classItem.totalMarks / classItem.subjectCount) : 0}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Avg/Subject</p>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Students:</span>
                        <span className="font-medium text-gray-900 dark:text-white flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{classItem.studentCount || 0}</span>
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Schedule:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{classItem.schedule}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Class Code:</span>
                        <span className="font-mono text-gray-900 dark:text-white text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          {classItem.classId?.slice(-6) || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 rounded-b-2xl">
                    <div className="flex items-center justify-between">
                      <button 
                        className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium px-3 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        onClick={() => {
                          // Navigate to class details or subject details
                          alert(`Viewing details for ${classItem.className}`);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </button>
                      
                      <div className="flex items-center space-x-1">
                        <button 
                          className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          onClick={() => {
                            // Navigate to edit page
                            navigate(`/dashboard/subjects/assign?edit=${classItem.id}&classId=${classItem.classId}`);
                          }}
                          title="Edit Subjects"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClass(classItem.id, classItem.className)}
                          disabled={deleting === classItem.id}
                          className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                          title="Remove Subjects"
                        >
                          {deleting === classItem.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && classes.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 text-center py-16 px-6">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-12 h-12 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {searchTerm ? 'No classes found' : 'No subjects assigned yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              {searchTerm 
                ? `No classes matching "${searchTerm}" were found. Try adjusting your search.` 
                : 'Get started by assigning subjects to classes and building your curriculum'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setSearchTerm('')}
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all font-semibold"
              >
                Clear Search
              </button>
              <button 
                onClick={() => navigate('/dashboard/subjects/assign')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                <span>Assign Subjects</span>
              </button>
            </div>
          </div>
        )}

        {/* Summary Footer */}
        {!loading && classes.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing <span className="font-semibold">{classes.length}</span> class{classes.length !== 1 ? 'es' : ''} with assigned subjects
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Inactive</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Cancelled</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassesWithSubject;