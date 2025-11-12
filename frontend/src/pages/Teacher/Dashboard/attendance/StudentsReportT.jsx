import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  FileText, 
  Printer, 
  Copy,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Eye,
  ChevronDown
} from 'lucide-react';

const StudentsReportT = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('today');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  // Sample attendance data
  const attendanceData = [
    {
      id: 1,
      date: '2024-01-15',
      day: 'Monday',
      studentId: 'STU001',
      name: 'John Doe',
      class: '10-A',
      status: 'present',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 2,
      date: '2024-01-15',
      day: 'Monday',
      studentId: 'STU002',
      name: 'Jane Smith',
      class: '10-A',
      status: 'absent',
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 3,
      date: '2024-01-15',
      day: 'Monday',
      studentId: 'STU003',
      name: 'Mike Johnson',
      class: '9-B',
      status: 'present',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 4,
      date: '2024-01-14',
      day: 'Sunday',
      studentId: 'STU001',
      name: 'John Doe',
      class: '10-A',
      status: 'present',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 5,
      date: '2024-01-14',
      day: 'Sunday',
      studentId: 'STU004',
      name: 'Sarah Williams',
      class: '8-A',
      status: 'absent',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 6,
      date: '2024-01-13',
      day: 'Saturday',
      studentId: 'STU005',
      name: 'Tom Brown',
      class: '9-A',
      status: 'present',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
    }
  ];

  const filterOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last7days', label: 'Last 7 Days' },
    { value: 'last30days', label: 'Last 30 Days' },
    { value: 'thismonth', label: 'This Month' },
    { value: 'lastmonth', label: 'Last Month' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const classOptions = [
    { value: 'all', label: 'All Classes' },
    { value: '10-A', label: 'Class 10-A' },
    { value: '10-B', label: 'Class 10-B' },
    { value: '9-A', label: 'Class 9-A' },
    { value: '9-B', label: 'Class 9-B' },
    { value: '8-A', label: 'Class 8-A' },
    { value: '8-B', label: 'Class 8-B' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'present', label: 'Present Only' },
    { value: 'absent', label: 'Absent Only' }
  ];

  // Filter data based on selected filters
  const filteredData = attendanceData.filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.class.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = selectedClass === 'all' || record.class === selectedClass;
    const matchesStatus = selectedStatus === 'all' || record.status === selectedStatus;
    
    return matchesSearch && matchesClass && matchesStatus;
  });

  const handleExport = (type) => {
    switch(type) {
      case 'copy':
        // Copy to clipboard logic
        navigator.clipboard.writeText(JSON.stringify(filteredData, null, 2));
        alert('Data copied to clipboard!');
        break;
      case 'csv':
        // CSV export logic
        alert('CSV export functionality would be implemented here');
        break;
      case 'excel':
        // Excel export logic
        alert('Excel export functionality would be implemented here');
        break;
      case 'pdf':
        // PDF export logic
        alert('PDF export functionality would be implemented here');
        break;
      case 'print':
        // Print logic
        window.print();
        break;
      default:
        break;
    }
  };

  const getTotalStats = () => {
    const total = filteredData.length;
    const present = filteredData.filter(record => record.status === 'present').length;
    const absent = filteredData.filter(record => record.status === 'absent').length;
    const attendanceRate = total > 0 ? ((present / total) * 100).toFixed(1) : 0;
    
    return { total, present, absent, attendanceRate };
  };

  const stats = getTotalStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Students Attendance Report</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Comprehensive attendance tracking and analysis</p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="card">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Filters & Search</h3>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden btn-secondary flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
          
          {/* Export Options */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Export:</span>
            <button
              onClick={() => handleExport('copy')}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              title="Copy"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
              title="CSV"
            >
              <FileText className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleExport('excel')}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
              title="Excel"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="PDF"
            >
              <FileText className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleExport('print')}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
              title="Print"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 ${showFilters ? 'block' : 'hidden lg:grid'}`}>
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="label">
              <Search className="w-4 h-4 inline mr-2" />
              Search Students
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, ID, or class..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Date Filter */}
          <div>
            <label className="label">
              <Calendar className="w-4 h-4 inline mr-2" />
              Date Range
            </label>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="input-field"
            >
              {filterOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Class Filter */}
          <div>
            <label className="label">
              <Users className="w-4 h-4 inline mr-2" />
              Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="input-field"
            >
              {classOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="label">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input-field"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Custom Date Range */}
        {selectedFilter === 'custom' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <label className="label">Start Date</label>
              <input
                type="date"
                value={customDateRange.startDate}
                onChange={(e) => setCustomDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">End Date</label>
              <input
                type="date"
                value={customDateRange.endDate}
                onChange={(e) => setCustomDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="input-field"
              />
            </div>
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-2">
            <Eye className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Records</p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</p>
        </div>
        <div className="card bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Present</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.present}</p>
        </div>
        <div className="card bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800">
          <div className="flex items-center justify-between mb-2">
            <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Absent</p>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.absent}</p>
        </div>
        <div className="card bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Attendance Rate</p>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.attendanceRate}%</p>
        </div>
      </div>

      {/* Data Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Attendance Records ({filteredData.length} records)
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Date</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Day</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">ID</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Name</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Class</th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((record) => (
                  <tr key={record.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">
                      {new Date(record.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">{record.day}</td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-800 dark:text-gray-100">{record.studentId}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={record.photo}
                          alt={record.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div 
                          className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full hidden items-center justify-center text-white font-semibold text-sm"
                        >
                          {record.name.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{record.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">{record.class}</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        record.status === 'present'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      }`}>
                        {record.status === 'present' ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {record.status === 'present' ? 'Present' : 'Absent'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Search className="w-12 h-12 text-gray-400" />
                      <p className="text-gray-500 dark:text-gray-400">No attendance records found matching your criteria.</p>
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedClass('all');
                          setSelectedStatus('all');
                          setSelectedFilter('today');
                        }}
                        className="btn-secondary"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentsReportT;