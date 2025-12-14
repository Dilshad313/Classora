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
  Briefcase,
  Download,
  UserPlus,
  Grid3x3,
  List,
  Check,
  X,
  Home,
  ChevronRight,
  DollarSign
} from 'lucide-react';
import { employeeApi } from '../../../../services/employeesApi';

const AllEmployees = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get('search') || '';
  });
  const [viewMode, setViewMode] = useState('grid');
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0
  });

  useEffect(() => {
    fetchEmployees();
  }, [activeTab, searchTerm]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const result = await employeeApi.getEmployees({
        status: activeTab === 'all' ? '' : activeTab,
        search: searchTerm
      });
      
      if (result.success) {
        setEmployees(result.data);
        setStats(result.stats);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      alert('Error fetching employees. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const result = await employeeApi.deleteEmployee(id);
        if (result.success) {
          alert('Employee deleted successfully');
          fetchEmployees(); // Refresh the list
        } else {
          alert(result.message || 'Error deleting employee');
        }
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Error deleting employee. Please try again.');
      }
    }
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
          <span className="text-blue-600 font-semibold">Employees</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-semibold">All Employees</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
              <p className="text-gray-600 mt-1">Manage and view all employee records</p>
            </div>
            <button
              onClick={() => navigate('/dashboard/employee/add-new')}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <UserPlus className="w-5 h-5" />
              <span className="font-semibold">Add New Employee</span>
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Employees</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{stats.total}</p>
                <p className="text-sm text-gray-500 mt-1">All registered employees</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Active Employees</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{stats.active}</p>
                <p className="text-sm text-gray-500 mt-1">Currently working</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center">
                <Check className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Inactive Employees</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{stats.inactive}</p>
                <p className="text-sm text-gray-500 mt-1">Not currently working</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center">
                <X className="w-8 h-8 text-red-600" />
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
              <div className="relative flex-1 lg:flex-initial">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full lg:w-64 transition-all"
                />
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
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading employees...</p>
          </div>
        )}

        {/* Employees Grid */}
        {!loading && viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employees.map((employee) => (
              <div
                key={employee._id}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {getInitials(employee.employeeName)}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(employee.status)}`}>
                      {employee.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-xl mb-1">{employee.employeeName}</h3>
                  <p className="text-sm text-gray-600 font-medium">{employee.employeeId}</p>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Role</p>
                      <p className="font-semibold text-gray-900">{employee.employeeRole}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-500 text-xs">Email</p>
                      <p className="font-medium text-gray-900 truncate">{employee.emailAddress}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Phone</p>
                      <p className="font-medium text-gray-900">{employee.mobileNo}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Salary</p>
                      <p className="font-medium text-gray-900">₹{employee.monthlySalary?.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                  <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors">
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteEmployee(employee._id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          !loading && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Salary</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {employees.map((employee) => (
                    <tr key={employee._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                            {getInitials(employee.employeeName)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{employee.employeeName}</p>
                            <p className="text-sm text-gray-500">{employee.emailAddress}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{employee.employeeId}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{employee.employeeRole}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{employee.mobileNo}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">₹{employee.monthlySalary?.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(employee.status)}`}>
                          {employee.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(employee._id)}
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
          )
        )}

        {/* Empty State */}
        {!loading && employees.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-200">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No employees found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchTerm 
                ? 'Try adjusting your search terms or filters' 
                : 'Get started by adding your first employee to the system'}
            </p>
            <button
              onClick={() => navigate('/dashboard/employee/add-new')}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              <UserPlus className="w-5 h-5" />
              <span>Add New Employee</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllEmployees;