import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, ChevronRight, FileText, Search, Calendar, Filter, Copy, 
  FileSpreadsheet, Download, Printer, ChevronLeft, ChevronRight as ChevronRightIcon,
  Loader2
} from 'lucide-react';
import { attendanceApi } from '../../../../services/attendanceApi';

const StudentsReport = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('today');
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);

  const getDateRange = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let start, end;
    
    switch (selectedFilter) {
      case 'today':
        start = today.toISOString().split('T')[0];
        end = today.toISOString().split('T')[0];
        break;
      case 'yesterday':
        start = yesterday.toISOString().split('T')[0];
        end = yesterday.toISOString().split('T')[0];
        break;
      case 'last7':
        const last7 = new Date(today);
        last7.setDate(last7.getDate() - 7);
        start = last7.toISOString().split('T')[0];
        end = today.toISOString().split('T')[0];
        break;
      case 'last30':
        const last30 = new Date(today);
        last30.setDate(last30.getDate() - 30);
        start = last30.toISOString().split('T')[0];
        end = today.toISOString().split('T')[0];
        break;
      case 'thisMonth':
        start = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
        break;
      case 'lastMonth':
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        start = lastMonth.toISOString().split('T')[0];
        end = new Date(today.getFullYear(), today.getMonth(), 0).toISOString().split('T')[0];
        break;
      case 'custom':
        if (!startDate || !endDate) {
          alert('Please select both start and end dates');
          return null;
        }
        start = startDate;
        end = endDate;
        break;
      default:
        return null;
    }
    
    return { start, end };
  };

  const loadReport = async () => {
    const dateRange = getDateRange();
    if (!dateRange) return;
    
    setIsLoading(true);
    try {
      const filters = {
        startDate: dateRange.start,
        endDate: dateRange.end,
        search: searchQuery || undefined,
        page: currentPage,
        limit: entriesPerPage
      };
      
      const result = await attendanceApi.getStudentAttendanceReport(filters);
      setRecords(result.data || []);
      setTotalRecords(result.pagination?.total || result.data?.length || 0);
    } catch (error) {
      alert(`Failed to load report: ${error.message}`);
      setRecords([]);
      setTotalRecords(0);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (selectedFilter !== 'custom' || (selectedFilter === 'custom' && startDate && endDate)) {
      loadReport();
    }
  }, [selectedFilter, currentPage, entriesPerPage, startDate, endDate]);

  React.useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery.trim() !== '' || selectedFilter) {
        setCurrentPage(1);
        loadReport();
      }
    }, 500);
    
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    setShowCustomRange(filter === 'custom');
    setCurrentPage(1);
  };

  const handleCopy = async () => {
    const dateRange = getDateRange();
    if (!dateRange) return;
    
    try {
      const exportData = {
        startDate: dateRange.start,
        endDate: dateRange.end,
        format: 'csv'
      };
      
      const data = await attendanceApi.exportStudentReport(exportData);
      
      const text = data.map(r => 
        `${r.date}\t${r.day}\t${r.studentId}\t${r.name}\t${r.class}\t${r.status}`
      ).join('\n');
      
      navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    } catch (error) {
      alert(`Failed to copy: ${error.message}`);
    }
  };

  const handleCSV = async () => {
    const dateRange = getDateRange();
    if (!dateRange) return;
    
    try {
      const exportData = {
        startDate: dateRange.start,
        endDate: dateRange.end,
        format: 'csv'
      };
      
      const data = await attendanceApi.exportStudentReport(exportData);
      
      const headers = 'DATE,DAY,ID,NAME,CLASS,STATUS\n';
      const rows = data.map(r => 
        `${r.date},${r.day},${r.studentId},${r.name},${r.class},${r.status}`
      ).join('\n');
      const csv = headers + rows;
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `student_attendance_${dateRange.start}_to_${dateRange.end}.csv`;
      a.click();
    } catch (error) {
      alert(`Failed to export CSV: ${error.message}`);
    }
  };

  const handleExcel = async () => {
    try {
      await handleCSV(); // For now, CSV serves as Excel
      alert('Excel file downloaded successfully!');
    } catch (error) {
      alert(`Failed to export Excel: ${error.message}`);
    }
  };

  const handlePDF = () => {
    window.print();
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'P':
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">Present</span>;
      case 'A':
        return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold">Absent</span>;
      case 'L':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-bold">Leave</span>;
      default:
        return status;
    }
  };

  const getDayName = (dateString) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const date = new Date(dateString);
    return days[date.getDay()];
  };

  const totalPages = Math.ceil(totalRecords / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = Math.min(startIndex + entriesPerPage, totalRecords);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm no-print">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-colors font-medium">
            <Home className="w-4 h-4" /><span>Dashboard</span>
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-blue-600 font-semibold">Attendance</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-semibold">Students Report</span>
        </div>

        {/* Header */}
        <div className="mb-8 no-print">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Students Attendance Report</h1>
              <p className="text-gray-600 mt-1">View and export student attendance records</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6 no-print">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-gray-900">Filter by Period</h2>
          </div>
          <div className="flex flex-wrap gap-3 mb-4">
            {[
              { value: 'today', label: 'Today' },
              { value: 'yesterday', label: 'Yesterday' },
              { value: 'last7', label: 'Last 7 Days' },
              { value: 'last30', label: 'Last 30 Days' },
              { value: 'thisMonth', label: 'This Month' },
              { value: 'lastMonth', label: 'Last Month' },
              { value: 'custom', label: 'Custom Range' }
            ].map(filter => (
              <button
                key={filter.value}
                onClick={() => handleFilterChange(filter.value)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedFilter === filter.value
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Custom Date Range */}
          {showCustomRange && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Search and Export Options */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6 no-print">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="w-full md:w-96">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, ID, or class..."
                  className="w-full pl-11 pr-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Export Buttons */}
            <div className="flex gap-2">
              <button onClick={handleCopy} className="px-4 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2">
                <Copy className="w-4 h-4" />Copy
              </button>
              <button onClick={handleCSV} className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4" />CSV
              </button>
              <button onClick={handleExcel} className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4" />Excel
              </button>
              <button onClick={handlePDF} className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2">
                <Download className="w-4 h-4" />PDF
              </button>
              <button onClick={handlePrint} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2">
                <Printer className="w-4 h-4" />Print
              </button>
            </div>
          </div>
        </div>

        {/* Entries Per Page */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 mb-6 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-600">entries</span>
          </div>
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {endIndex} of {totalRecords} entries
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-bold">DATE</th>
                  <th className="px-6 py-4 text-left font-bold">DAY</th>
                  <th className="px-6 py-4 text-left font-bold">ID</th>
                  <th className="px-6 py-4 text-left font-bold">NAME</th>
                  <th className="px-6 py-4 text-left font-bold">CLASS</th>
                  <th className="px-6 py-4 text-center font-bold">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                        <span className="text-gray-600">Loading records...</span>
                      </div>
                    </td>
                  </tr>
                ) : records.length > 0 ? (
                  records.map((record, index) => (
                    <tr key={index} className="hover:bg-indigo-50 transition-colors">
                      <td className="px-6 py-4 text-gray-700 font-medium">
                        {new Date(record.date).toLocaleDateString('en-GB')}
                      </td>
                      <td className="px-6 py-4 text-gray-700">{getDayName(record.date)}</td>
                      <td className="px-6 py-4 text-gray-700 font-semibold">{record.studentId}</td>
                      <td className="px-6 py-4 text-gray-900 font-semibold">{record.name}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                          {record.class}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">{getStatusBadge(record.status)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      No attendance records found for the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {records.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 flex items-center justify-between no-print">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {endIndex} of {totalRecords} entries
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 rounded-lg font-semibold transition-all ${
                        currentPage === pageNum
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                Next
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`@media print { .no-print { display: none !important; } body { background: white !important; } }`}</style>
    </div>
  );
};

export default StudentsReport;