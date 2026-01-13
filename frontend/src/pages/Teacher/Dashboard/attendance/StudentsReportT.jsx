import { useEffect, useMemo, useState } from 'react';
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
  ChevronDown,
  Loader2
} from 'lucide-react';
import { attendanceApi } from '../../../../services/attendanceApi';
import toast from 'react-hot-toast';

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
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const getDateRange = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let start;
    let end;

    switch (selectedFilter) {
      case 'today':
        start = today.toISOString().split('T')[0];
        end = start;
        break;
      case 'yesterday':
        start = yesterday.toISOString().split('T')[0];
        end = start;
        break;
      case 'last7days': {
        const last7 = new Date(today);
        last7.setDate(last7.getDate() - 7);
        start = last7.toISOString().split('T')[0];
        end = today.toISOString().split('T')[0];
        break;
      }
      case 'last30days': {
        const last30 = new Date(today);
        last30.setDate(last30.getDate() - 30);
        start = last30.toISOString().split('T')[0];
        end = today.toISOString().split('T')[0];
        break;
      }
      case 'thismonth':
        start = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
        break;
      case 'lastmonth': {
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        start = lastMonth.toISOString().split('T')[0];
        end = new Date(today.getFullYear(), today.getMonth(), 0).toISOString().split('T')[0];
        break;
      }
      case 'custom':
        if (!customDateRange.startDate || !customDateRange.endDate) {
          toast.error('Please select both start and end dates');
          return null;
        }
        start = customDateRange.startDate;
        end = customDateRange.endDate;
        break;
      default:
        return null;
    }

    return { start, end };
  };

  const normalizeClassValue = (value = '') => value.toString().replace(/^Class\s*/i, '').trim();

  const loadReport = async () => {
    const dateRange = getDateRange();
    if (!dateRange) return;

    setLoading(true);
    try {
      const classForApi = selectedClass === 'all' ? undefined : normalizeClassValue(selectedClass).split('-')[0];
      const filters = {
        startDate: dateRange.start,
        endDate: dateRange.end,
        search: searchTerm || undefined,
        class: classForApi,
        status: selectedStatus,
        page: 1,
        limit: 500
      };

      const result = await attendanceApi.getStudentAttendanceReport(filters);
      setRecords(result.data || []);
    } catch (error) {
      console.error('Failed to load student attendance report:', error);
      toast.error(error.message || 'Failed to load attendance');
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilter, selectedClass, selectedStatus, customDateRange.startDate, customDateRange.endDate]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      loadReport();
    }, 400);
    return () => clearTimeout(debounceTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const filteredData = useMemo(() => {
    return records.filter(record => {
      const recordClassNormalized = normalizeClassValue(record.class);
      const matchesSearch = record.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recordClassNormalized?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesClass = selectedClass === 'all' || recordClassNormalized === normalizeClassValue(selectedClass);

      const matchesStatus = (() => {
        if (selectedStatus === 'all') return true;
        if (selectedStatus === 'present') return record.status === 'present' || record.status === 'P';
        if (selectedStatus === 'absent') return record.status === 'absent' || record.status === 'A';
        return true;
      })();

      return matchesSearch && matchesClass && matchesStatus;
    });
  }, [records, searchTerm, selectedClass, selectedStatus]);

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
    const present = filteredData.filter(record => record.status === 'P' || record.status === 'present').length;
    const absent = filteredData.filter(record => record.status === 'A' || record.status === 'absent').length;
    const attendanceRate = total > 0 ? ((present / total) * 100).toFixed(1) : 0;
    
    return { total, present, absent, attendanceRate };
  };

  const stats = getTotalStats();

  const getDayName = (dateString) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const date = new Date(dateString);
    return days[date.getDay()];
  };

  const normalizeStatus = (status) => {
    if (status === 'P' || status === 'present') return { label: 'Present', color: 'green' };
    if (status === 'A' || status === 'absent') return { label: 'Absent', color: 'red' };
    return { label: 'Leave', color: 'yellow' };
  };

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
          {loading && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading...
            </div>
          )}
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
              {!loading && filteredData.length > 0 ? (
                filteredData.map((record) => {
                  const statusMeta = normalizeStatus(record.status);
                  return (
                  <tr key={record._id || `${record.studentId}-${record.date}`} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">
                      {new Date(record.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">{getDayName(record.date)}</td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-800 dark:text-gray-100">{record.studentId}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {record.photo && (
                          <img
                            src={record.photo}
                            alt={record.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              if (e.target.nextSibling) {
                                e.target.nextSibling.style.display = 'flex';
                              }
                            }}
                          />
                        )}
                        <div
                          className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full hidden items-center justify-center text-white font-semibold text-sm"
                          style={{ display: record.photo ? 'none' : 'flex' }}
                        >
                          {record.name.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{record.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">{record.class}</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        statusMeta.color === 'green'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : statusMeta.color === 'red'
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                          : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                      }`}>
                        {statusMeta.color === 'green' ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : statusMeta.color === 'red' ? (
                          <XCircle className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {statusMeta.label}
                      </span>
                    </td>
                  </tr>
                )})
              ) : loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Loading attendance records...</span>
                    </div>
                  </td>
                </tr>
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