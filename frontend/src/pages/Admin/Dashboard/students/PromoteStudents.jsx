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
import { classApi } from '../../../../services/classApi';
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

  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetchClasses();
    fetchStudents();
    fetchStats();
  }, [selectedClass]);

  const fetchClasses = async () => {
    try {
      const data = await classApi.getAllClassNames();
      setClasses(data || []);
    } catch (error) {
      console.error('Failed to load classes', error);
      toast.error('Failed to load classes');
    }
  };

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
      toast.success(`Successfully promoted ${selectedStudents.length} student(s) to Class ${promoteClass}`);
      
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span className="text-blue-600 dark:text-blue-400 font-semibold">Students</span>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span className="text-gray-900 dark:text-gray-100 font-semibold">Promote Students</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Promote Students</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Promote students to the next class or grade level</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Total Students</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{filteredStudents.length}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-xl flex items-center justify-center">
                <Users className="w-7 h-7 text-blue-600 dark:text-blue-300" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Selected</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{selectedStudents.length}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-green-600 dark:text-green-300" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Promote To</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{promoteClass ? `Class ${promoteClass}` : '-'}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-purple-600 dark:text-purple-300" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search and Filter Section */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sticky top-6 transition-colors duration-300">
              <div className="flex items-center gap-2 mb-6">
                <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Search & Filter</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Search Student
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search by name or ID..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Select Current Class
                  </label>
                  <div className="relative">
                    <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all appearance-none"
                    >
                      <option value="" className="dark:bg-gray-800">All Classes</option>
                      {classes.map((cls) => (
                        <option key={cls} value={cls} className="dark:bg-gray-800">Class {cls}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleReload}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-all font-semibold"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Reset</span>
                  </button>
                  <button
                    onClick={handleRefresh}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-xl transition-all font-semibold"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              {/* Promote Section */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Promote To</h3>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Select New Class *
                  </label>
                  <select
                    value={promoteClass}
                    onChange={(e) => setPromoteClass(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-purple-300 dark:border-purple-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white transition-all font-medium"
                  >
                    <option value="" className="dark:bg-gray-800">Select Class</option>
                    {classes.map((cls) => (
                      <option key={cls} value={cls} className="dark:bg-gray-800">Class {cls}</option>
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
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Students List</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {selectedStudents.length > 0 
                    ? `${selectedStudents.length} student(s) selected` 
                    : 'Select students to promote'}
                </p>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex justify-center items-center py-12">
                  <Loader className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
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
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student, index) => (
                          <tr
                            key={student._id}
                            className={`hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                              index % 2 === 0 
                                ? 'bg-white dark:bg-gray-800' 
                                : 'bg-gray-50 dark:bg-gray-900'
                            } ${selectedStudents.includes(student._id) 
                                ? 'bg-blue-50 dark:bg-gray-700 border-l-4 border-blue-600 dark:border-blue-500' 
                                : ''}`}
                            onClick={() => handleSelectStudent(student._id)}
                          >
                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                checked={selectedStudents.includes(student._id)}
                                onChange={() => handleSelectStudent(student._id)}
                                className="w-4 h-4 rounded border-gray-300 dark:border-gray-600"
                              />
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">{student.registrationNo}</td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{student.studentName}</td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">Class {student.selectClass} - {student.section}</td>
                            <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{student.rollNumber || 'N/A'}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-6 py-12 text-center">
                            <div className="flex flex-col items-center justify-center">
                              <Users className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
                              <p className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No students found</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Try adjusting your search or filters</p>
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