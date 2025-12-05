import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home,
  ChevronRight,
  Search,
  TrendingUp,
  Users,
  RefreshCw,
  CheckCircle,
  ArrowRight,
  GraduationCap,
  Filter,
  Loader
} from 'lucide-react';
import { getStudents, promoteStudents, getStudentStats } from '../../../../services/studentApi';
import toast from 'react-hot-toast';

const PromoteStudents = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [promoteClass, setPromoteClass] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promoting, setPromoting] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0
  });

  const classes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

  useEffect(() => {
    fetchStudents();
    fetchStats();
  }, [selectedClass]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const filters = {
        class: selectedClass || undefined
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

  const filteredStudents = students.filter((student) => {
    const matchesSearch = search === '' ||
      student.studentName.toLowerCase().includes(search.toLowerCase()) ||
      student.registrationNo.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const handleReload = () => {
    setSearch('');
    setSelectedClass('');
    setSelectedStudents([]);
    setSelectAll(false);
    setPromoteClass('');
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(s => s._id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectStudent = (id) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents(selectedStudents.filter(sid => sid !== id));
      setSelectAll(false);
    } else {
      const newSelected = [...selectedStudents, id];
      setSelectedStudents(newSelected);
      if (newSelected.length === filteredStudents.length) {
        setSelectAll(true);
      }
    }
  };

  const handleSave = async () => {
    if (selectedStudents.length === 0) {
      toast.error('Please select at least one student to promote');
      return;
    }
    if (!promoteClass) {
      toast.error('Please select a class to promote students to');
      return;
    }

    try {
      setPromoting(true);
      await promoteStudents(selectedStudents, promoteClass);
      toast.success(`Successfully promoted ${selectedStudents.length} student(s) to Grade ${promoteClass}`);
      
      // Refresh data
      fetchStudents();
      fetchStats();
      setSelectedStudents([]);
      setSelectAll(false);
      setPromoteClass('');
    } catch (error) {
      console.error('Failed to promote students', error);
      toast.error(error.message || 'Failed to promote students');
    } finally {
      setPromoting(false);
    }
  };

  const handleRefresh = () => {
    fetchStudents();
    fetchStats();
    toast.success('Data refreshed');
  };

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
          <span className="text-gray-900 font-semibold">Promote Students</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Promote Students</h1>
              <p className="text-gray-600 mt-1">Promote students to the next class or grade level</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Students</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{filteredStudents.length}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                <Users className="w-7 h-7 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Selected</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{selectedStudents.length}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Promote To</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{promoteClass ? `Grade ${promoteClass}` : '-'}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search and Filter Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-6">
              <div className="flex items-center gap-2 mb-6">
                <Search className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Search & Filter</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Search Student
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name or ID..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Current Class
                  </label>
                  <div className="relative">
                    <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all appearance-none"
                    >
                      <option value="">All Classes</option>
                      {classes.map((cls) => (
                        <option key={cls} value={cls}>Grade {cls}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleReload}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all font-semibold"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Reset</span>
                  </button>
                  <button
                    onClick={handleRefresh}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl transition-all font-semibold"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              {/* Promote Section */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-bold text-gray-900">Promote To</h3>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select New Class *
                  </label>
                  <select
                    value={promoteClass}
                    onChange={(e) => setPromoteClass(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white transition-all font-medium"
                  >
                    <option value="">Select Class</option>
                    {classes.map((cls) => (
                      <option key={cls} value={cls}>Grade {cls}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleSave}
                  disabled={selectedStudents.length === 0 || !promoteClass || promoting}
                  className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {promoting ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <ArrowRight className="w-5 h-5" />
                  )}
                  <span>
                    {promoting ? 'Promoting...' : `Promote ${selectedStudents.length} Students`}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Students Table Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <h2 className="text-xl font-bold text-gray-900">Students List</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedStudents.length > 0 
                    ? `${selectedStudents.length} student(s) selected` 
                    : 'Select students to promote'}
                </p>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex justify-center items-center py-12">
                  <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
              )}

              {!loading && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                          <div className="flex items-center gap-2">
                            <input 
                              type="checkbox" 
                              checked={selectAll}
                              onChange={handleSelectAll}
                              className="w-4 h-4 rounded border-white"
                            />
                            <span>Select All</span>
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">ID</th>
                        <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Student Name</th>
                        <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Current Class</th>
                        <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Roll Number</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student, index) => (
                          <tr
                            key={student._id}
                            className={`hover:bg-blue-50 transition-colors cursor-pointer ${
                              index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                            } ${selectedStudents.includes(student._id) ? 'bg-blue-50 border-l-4 border-blue-600' : ''}`}
                            onClick={() => handleSelectStudent(student._id)}
                          >
                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                checked={selectedStudents.includes(student._id)}
                                onChange={() => handleSelectStudent(student._id)}
                                className="w-4 h-4 rounded border-gray-300"
                              />
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">{student.registrationNo}</td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.studentName}</td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">Grade {student.selectClass} - {student.section}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{student.rollNumber || 'N/A'}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-6 py-12 text-center">
                            <div className="flex flex-col items-center justify-center">
                              <Users className="w-16 h-16 text-gray-400 mb-4" />
                              <p className="text-lg font-semibold text-gray-900 mb-1">No students found</p>
                              <p className="text-sm text-gray-600">Try adjusting your search or filters</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoteStudents;