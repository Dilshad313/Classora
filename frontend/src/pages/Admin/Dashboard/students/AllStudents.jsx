import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Users,
  Edit3,
  Trash2,
  Eye,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  Download,
  UserPlus,
  Grid3x3,
  List,
  Check,
  X,
  Home,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { getStudents, deleteStudent, getStudentStats } from '../../../../services/studentApi';
import toast from 'react-hot-toast';

const AllStudents = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get('search') || '';
  });
  const [selectedClass, setSelectedClass] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    avgAttendance: 0
  });

  const classes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

  useEffect(() => {
    fetchStudents();
    fetchStats();
  }, [activeTab, selectedClass, searchTerm]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const filters = {
        search: searchTerm,
        class: selectedClass !== 'all' ? selectedClass : undefined,
        status: activeTab !== 'all' ? activeTab : undefined
      };
      
      const data = await getStudents(filters);
      setStudents(data || []);
    } catch (error) {
      console.error('Failed to load students', error);
      toast.error('Failed to load students');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await getStudentStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats', error);
    }
  };

  const handleDeleteStudent = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      try {
        await deleteStudent(id);
        toast.success('Student deleted successfully');
        fetchStudents();
        fetchStats();
      } catch (error) {
        console.error('Failed to delete student', error);
        toast.error(error.message || 'Failed to delete student');
      }
    }
  };

  const handleRefresh = () => {
    fetchStudents();
    fetchStats();
    toast.success('Data refreshed');
  };

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'text-green-700 bg-green-100 border-green-200'
      : 'text-red-700 bg-red-100 border-red-200';
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.registrationNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.admissionNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-blue-600 font-semibold">Students</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-semibold">All Students</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Students</h1>
              <p className="text-gray-600 mt-1">Manage and view all student records</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
              <button
                onClick={() => navigate('/dashboard/students/add-new')}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <UserPlus className="w-5 h-5" />
                <span className="font-semibold">Add New Student</span>
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Students</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{stats.total}</p>
                <p className="text-sm text-gray-500 mt-1">All registered students</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Active Students</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{stats.active}</p>
                <p className="text-sm text-gray-500 mt-1">Currently enrolled</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center">
                <Check className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Inactive Students</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{stats.inactive}</p>
                <p className="text-sm text-gray-500 mt-1">Not currently enrolled</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center">
                <X className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Avg. Attendance</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{stats.avgAttendance}%</p>
                <p className="text-sm text-gray-500 mt-1">Overall attendance rate</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center">
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 gap-4">
            {/* Tabs */}
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  activeTab === 'all'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                All ({stats.total})
              </button>
              <button
                onClick={() => setActiveTab('active')}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  activeTab === 'active'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Active ({stats.active})
              </button>
              <button
                onClick={() => setActiveTab('inactive')}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  activeTab === 'inactive'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Inactive ({stats.inactive})
              </button>
            </div>

            {/* Search and Actions */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center gap-3">
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium"
                >
                  <option value="all">All Classes</option>
                  {classes.map((cls) => (
                    <option key={cls} value={cls}>Class {cls}</option>
                  ))}
                </select>
                
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full lg:w-64 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 rounded-xl transition-all ${
                    viewMode === 'grid'
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 rounded-xl transition-all ${
                    viewMode === 'list'
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              <button className="flex items-center space-x-2 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-medium">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Students Grid */}
        {!loading && viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <div
                key={student._id}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {getInitials(student.studentName)}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(student.status)}`}>
                      {student.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-xl mb-1">{student.studentName}</h3>
                  <p className="text-sm text-gray-600 font-medium">{student.registrationNo}</p>
                  {student.admissionNumber && (
                    <p className="text-xs text-gray-500 mt-1">Admission: {student.admissionNumber}</p>
                  )}
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Class</p>
                      <p className="font-semibold text-gray-900">
                        {student.selectClass} - {student.section}
                      </p>
                    </div>
                  </div>

                  {student.email && (
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-500 text-xs">Email</p>
                        <p className="font-medium text-gray-900 truncate">{student.email}</p>
                      </div>
                    </div>
                  )}

                  {student.mobileNo && (
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Phone</p>
                        <p className="font-medium text-gray-900">{student.mobileNo}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Joined</p>
                      <p className="font-medium text-gray-900">
                        {new Date(student.dateOfAdmission).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                  <button 
                    onClick={() => navigate(`/dashboard/students/view/${student._id}`)}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => navigate(`/dashboard/students/edit/${student._id}`)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteStudent(student._id, student.studentName)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : !loading ? (
          /* List View */
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Class</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                          {getInitials(student.studentName)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{student.studentName}</p>
                          <p className="text-sm text-gray-500">
                            {student.admissionNumber || student.registrationNo}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.registrationNo}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {student.selectClass} - {student.section}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {student.mobileNo || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(student.status)}`}>
                        {student.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => navigate(`/dashboard/students/view/${student._id}`)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => navigate(`/dashboard/students/edit/${student._id}`)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(student._id, student.studentName)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {/* Empty State */}
        {!loading && filteredStudents.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-200">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No students found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchTerm || selectedClass !== 'all' || activeTab !== 'all'
                ? 'Try adjusting your search terms or filters' 
                : 'Get started by adding your first student to the system'}
            </p>
            <button
              onClick={() => navigate('/dashboard/students/add-new')}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              <UserPlus className="w-5 h-5" />
              <span>Add New Student</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllStudents;