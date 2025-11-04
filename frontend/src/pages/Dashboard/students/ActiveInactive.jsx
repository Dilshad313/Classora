import React, { useState } from 'react';
import { 
  Search, 
  Filter,
  Users,
  User,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  MoreVertical,
  Edit3,
  Trash2,
  Eye,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react';

const ActiveInactive = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'Arun P',
      studentId: 'STU001',
      email: 'arun.p@example.com',
      phone: '+1 234-567-8900',
      class: 'Grade 10 - A',
      rollNumber: '220/236',
      joinDate: '2024-01-15',
      status: 'active',
      lastActive: '2024-11-04',
      attendance: '95%'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      studentId: 'STU002',
      email: 'priya.sharma@example.com',
      phone: '+1 234-567-8901',
      class: 'Grade 10 - B',
      rollNumber: '221/236',
      joinDate: '2024-01-16',
      status: 'active',
      lastActive: '2024-11-04',
      attendance: '92%'
    },
    {
      id: 3,
      name: 'Rahul Kumar',
      studentId: 'STU003',
      email: 'rahul.kumar@example.com',
      phone: '+1 234-567-8902',
      class: 'Grade 11 - A',
      rollNumber: '150/180',
      joinDate: '2024-01-10',
      status: 'active',
      lastActive: '2024-11-03',
      attendance: '88%'
    },
    {
      id: 4,
      name: 'Sneha Patel',
      studentId: 'STU004',
      email: 'sneha.patel@example.com',
      phone: '+1 234-567-8903',
      class: 'Grade 9 - A',
      rollNumber: '089/120',
      joinDate: '2024-01-20',
      status: 'inactive',
      lastActive: '2024-10-15',
      attendance: '45%',
      inactiveReason: 'Transferred to another school'
    },
    {
      id: 5,
      name: 'Amit Singh',
      studentId: 'STU005',
      email: 'amit.singh@example.com',
      phone: '+1 234-567-8904',
      class: 'Grade 12 - A',
      rollNumber: '045/060',
      joinDate: '2024-01-05',
      status: 'inactive',
      lastActive: '2024-09-30',
      attendance: '78%',
      inactiveReason: 'Graduated'
    },
    {
      id: 6,
      name: 'Neha Gupta',
      studentId: 'STU006',
      email: 'neha.gupta@example.com',
      phone: '+1 234-567-8905',
      class: 'Grade 8 - B',
      rollNumber: '112/150',
      joinDate: '2024-02-01',
      status: 'active',
      lastActive: '2024-11-04',
      attendance: '96%'
    }
  ]);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.class.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = activeTab === 'all' || student.status === activeTab;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: students.length,
    active: students.filter(s => s.status === 'active').length,
    inactive: students.filter(s => s.status === 'inactive').length
  };

  const handleStatusChange = (studentId, newStatus) => {
    setStudents(prev => 
      prev.map(student => 
        student.id === studentId 
          ? { 
              ...student, 
              status: newStatus,
              lastActive: newStatus === 'active' ? new Date().toISOString().split('T')[0] : student.lastActive
            }
          : student
      )
    );
  };

  const handleDeleteStudent = (studentId) => {
    if (window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      setStudents(prev => prev.filter(student => student.id !== studentId));
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'text-green-600 bg-green-50 border-green-200'
      : 'text-red-600 bg-red-50 border-red-200';
  };

  const getStatusIcon = (status) => {
    return status === 'active' 
      ? <CheckCircle className="w-4 h-4 text-green-500" />
      : <XCircle className="w-4 h-4 text-red-500" />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Student Status Management</h1>
          <p className="text-gray-600 mt-1">Manage active and inactive students</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">TOTAL STUDENTS</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">ACTIVE STUDENTS</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.active}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">INACTIVE STUDENTS</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.inactive}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AVG. ATTENDANCE</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {Math.round(students.reduce((acc, student) => {
                    const attendance = parseInt(student.attendance) || 0;
                    return acc + attendance;
                  }, 0) / students.length)}%
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs and Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Tabs */}
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  activeTab === 'all'
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                All Students
              </button>
              <button
                onClick={() => setActiveTab('active')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  activeTab === 'active'
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'text-gray-600 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setActiveTab('inactive')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  activeTab === 'inactive'
                    ? 'bg-red-100 text-red-700 border border-red-200'
                    : 'text-gray-600 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                Inactive
              </button>
            </div>

            {/* Search and Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                />
              </div>

              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Academic
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.studentId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.email}</div>
                      <div className="text-sm text-gray-500">{student.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.class}</div>
                      <div className="text-sm text-gray-500">Roll: {student.rollNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(student.status)}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                          {student.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      {student.inactiveReason && (
                        <div className="text-xs text-gray-500 mt-1">{student.inactiveReason}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{student.attendance}</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className={`h-2 rounded-full ${
                            parseInt(student.attendance) >= 90 ? 'bg-green-500' :
                            parseInt(student.attendance) >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: student.attendance }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(student.lastActive)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        {student.status === 'active' ? (
                          <button
                            onClick={() => handleStatusChange(student.id, 'inactive')}
                            className="p-1 text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded transition-colors"
                            title="Deactivate Student"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(student.id, 'active')}
                            className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
                            title="Activate Student"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteStudent(student.id)}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
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

          {/* Empty State */}
          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
              <p className="text-gray-500">
                {searchTerm ? 'Try adjusting your search terms' : `No ${activeTab} students found`}
              </p>
            </div>
          )}

          {/* Table Footer */}
          {filteredStudents.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {filteredStudents.length} of {students.length} students
                </div>
                <div className="text-sm text-gray-500">
                  {activeTab === 'all' ? 'All Students' : 
                   activeTab === 'active' ? 'Active Students' : 'Inactive Students'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bulk Actions */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Select students to perform bulk actions
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Export Selected
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Bulk Status Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveInactive;