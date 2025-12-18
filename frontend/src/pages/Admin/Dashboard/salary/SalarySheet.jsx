import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, ChevronRight, FileSpreadsheet, Search, Calendar, DollarSign, Users, Printer, Download, 
  Filter, TrendingUp, TrendingDown, Eye, Copy, FileText, Loader2, ChevronLeft, ChevronRight as RightIcon
} from 'lucide-react';
import { salaryApi } from '../../../../services/salaryApi';

const SalarySheet = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [salaryData, setSalaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [departments, setDepartments] = useState([]);

  // Set default month
  useEffect(() => {
    const today = new Date();
    const currentMonth = today.toISOString().slice(0, 7);
    setFilterMonth(currentMonth);
  }, []);

  // Fetch salary sheet data
  useEffect(() => {
    const fetchSalarySheet = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = {
          page,
          limit,
          ...(searchQuery && { search: searchQuery }),
          ...(filterMonth && { month: filterMonth }),
          ...(filterDepartment && { department: filterDepartment }),
          ...(filterStatus && { status: filterStatus }),
          sortBy: 'createdAt',
          sortOrder: 'desc'
        };

        const result = await salaryApi.getSalarySheet(params);
        
        if (result.success) {
          setSalaryData(result.data);
          
          // Extract unique departments from salary records
          if (result.data.salaries) {
            const deptSet = new Set();
            result.data.salaries.forEach(salary => {
              if (salary.employee?.department) {
                deptSet.add(salary.employee.department);
              }
            });
            setDepartments(Array.from(deptSet));
          }
        } else {
          setError('Failed to load salary sheet');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch salary sheet');
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const debounceTimer = setTimeout(fetchSalarySheet, 300);
    return () => clearTimeout(debounceTimer);
  }, [page, limit, searchQuery, filterMonth, filterDepartment, filterStatus]);

  const handlePrint = () => window.print();

  const handleExport = async () => {
    try {
      setExporting(true);
      // In a real implementation, this would trigger a file download
      alert('Export feature would download the salary sheet as Excel/PDF');
      // Example: window.open(`${API_BASE_URL}/salary/sheet/export?${queryParams}`, '_blank');
    } catch (err) {
      alert('Failed to export salary sheet: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterMonth('');
    setFilterDepartment('');
    setFilterStatus('');
    setPage(1);
  };

  const handleViewSlip = (salaryId) => {
    navigate(`/dashboard/salary/paid-slip/${salaryId}`);
  };

  const handleCopyReceipt = (receiptNo) => {
    navigator.clipboard.writeText(receiptNo);
    alert(`Receipt number ${receiptNo} copied to clipboard`);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= (salaryData?.pagination?.pages || 1)) {
      setPage(newPage);
    }
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  if (loading && !salaryData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6 text-sm">
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors font-medium">
              <Home className="w-4 h-4" /><span>Dashboard</span>
            </button>
            <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <span className="text-blue-600 dark:text-blue-400 font-semibold">Salary</span>
            <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <span className="text-gray-900 dark:text-gray-100 font-semibold">Salary Sheet</span>
          </div>
          
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-purple-600 dark:text-purple-400 animate-spin mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">Loading salary sheet...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm no-print">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors font-medium">
            <Home className="w-4 h-4" /><span>Dashboard</span>
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span className="text-blue-600 dark:text-blue-400 font-semibold">Salary</span>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span className="text-gray-900 dark:text-gray-100 font-semibold">Salary Sheet</span>
        </div>

        {/* Header */}
        <div className="mb-8 no-print">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 dark:from-purple-700 dark:to-indigo-800 rounded-xl flex items-center justify-center shadow-lg">
                <FileSpreadsheet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Salary Sheet</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">Complete salary details for all employees</p>
                {filterMonth && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Showing data for {new Date(filterMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={handleExport} 
                disabled={exporting}
                className="px-5 py-2.5 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-75"
              >
                {exporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                {exporting ? 'Exporting...' : 'Export'}
              </button>
              <button onClick={handlePrint} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                <Printer className="w-5 h-5" />Print
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-600 rounded">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 dark:text-red-300 font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 no-print">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{salaryData?.pagination?.total || 0}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Total Records</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  ₹{salaryData?.totals?.totalFixed ? (salaryData.totals.totalFixed / 100000).toFixed(1) + 'L' : '0'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Total Fixed Salary</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  ₹{salaryData?.totals?.totalBonus ? (salaryData.totals.totalBonus / 1000).toFixed(0) + 'K' : '0'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Total Bonus</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  ₹{salaryData?.totals?.totalNet ? (salaryData.totals.totalNet / 100000).toFixed(1) + 'L' : '0'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Total Net Salary</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6 no-print">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <Search className="w-4 h-4 inline mr-2" />Search
              </label>
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input 
                  type="text" 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  placeholder="Search by name, ID, or role..." 
                  className="w-full pl-11 pr-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />Salary Month
              </label>
              <input 
                type="month" 
                value={filterMonth} 
                onChange={(e) => setFilterMonth(e.target.value)} 
                className="w-full px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400" 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <Filter className="w-4 h-4 inline mr-2" />Department
              </label>
              <select 
                value={filterDepartment} 
                onChange={(e) => setFilterDepartment(e.target.value)} 
                className="w-full px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <Filter className="w-4 h-4 inline mr-2" />Status
              </label>
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)} 
                className="w-full px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400"
              >
                <option value="">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button 
              onClick={handleClearFilters} 
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-all"
            >
              Clear Filters
            </button>
            <div className="flex-1"></div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Show:</span>
                <select 
                  value={limit} 
                  onChange={(e) => handleLimitChange(parseInt(e.target.value))}
                  className="px-2 py-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded text-sm"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Showing {salaryData?.pagination?.total ? (page - 1) * limit + 1 : 0}-
                {Math.min(page * limit, salaryData?.pagination?.total || 0)} of {salaryData?.pagination?.total || 0} records
              </span>
            </div>
          </div>
        </div>

        {/* Salary Sheet Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="w-8 h-8 text-purple-600 dark:text-purple-400 animate-spin" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-700 dark:to-indigo-800 text-white">
                    <tr>
                      <th className="px-4 py-4 text-left font-bold">S.No</th>
                      <th className="px-4 py-4 text-left font-bold">Receipt No</th>
                      <th className="px-4 py-4 text-left font-bold">Employee Name</th>
                      <th className="px-4 py-4 text-left font-bold">Role</th>
                      <th className="px-4 py-4 text-left font-bold">Department</th>
                      <th className="px-4 py-4 text-right font-bold">Fixed Salary</th>
                      <th className="px-4 py-4 text-right font-bold">Bonus</th>
                      <th className="px-4 py-4 text-right font-bold">Deduction</th>
                      <th className="px-4 py-4 text-right font-bold">Net Salary</th>
                      <th className="px-4 py-4 text-center font-bold">Status</th>
                      <th className="px-4 py-4 text-center font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {salaryData?.salaries && salaryData.salaries.length > 0 ? (
                      salaryData.salaries.map((salary, index) => (
                        <tr key={salary._id} className="hover:bg-purple-50 dark:hover:bg-gray-700 transition-colors">
                          <td className="px-4 py-4 text-gray-700 dark:text-gray-300 font-medium">
                            {(page - 1) * limit + index + 1}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900 dark:text-gray-100">{salary.receiptNo}</span>
                              <button 
                                onClick={() => handleCopyReceipt(salary.receiptNo)}
                                className="text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                                title="Copy receipt number"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="font-semibold text-gray-900 dark:text-gray-100">
                              {salary.employee?.employeeName || 'Unknown'}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              ID: {salary.employee?.employeeId || 'N/A'}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                            {salary.employee?.employeeRole || 'Unknown'}
                          </td>
                          <td className="px-4 py-4">
                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium">
                              {salary.employee?.department || 'Unknown'}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                              ₹{salary.fixedSalary?.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <span className="font-semibold text-green-600 dark:text-green-400">
                              ₹{salary.bonus?.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <span className="font-semibold text-red-600 dark:text-red-400">
                              ₹{salary.deduction?.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <span className="font-bold text-purple-600 dark:text-purple-400 text-lg">
                              ₹{salary.netSalary?.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              salary.status === 'paid' 
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                : salary.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                              {salary.status?.charAt(0).toUpperCase() + salary.status?.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleViewSlip(salary._id)}
                                className="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-700 dark:hover:bg-cyan-600 text-white rounded-lg text-sm font-medium flex items-center gap-1 transition-colors"
                                title="View Salary Slip"
                              >
                                <Eye className="w-4 h-4" />
                                View
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="11" className="px-4 py-8 text-center">
                          <FileSpreadsheet className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                          <p className="text-gray-600 dark:text-gray-300 text-lg font-semibold">No salary records found</p>
                          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                  {salaryData?.totals && salaryData.salaries && salaryData.salaries.length > 0 && (
                    <tfoot className="bg-purple-50 dark:bg-gray-700 border-t-2 border-purple-200 dark:border-purple-900">
                      <tr>
                        <td colSpan="5" className="px-4 py-4 font-bold text-gray-900 dark:text-gray-100 text-lg">
                          Total ({salaryData.pagination.total} records)
                        </td>
                        <td className="px-4 py-4 text-right font-bold text-gray-900 dark:text-gray-100">
                          ₹{salaryData.totals.totalFixed?.toLocaleString()}
                        </td>
                        <td className="px-4 py-4 text-right font-bold text-green-600 dark:text-green-400">
                          ₹{salaryData.totals.totalBonus?.toLocaleString()}
                        </td>
                        <td className="px-4 py-4 text-right font-bold text-red-600 dark:text-red-400">
                          ₹{salaryData.totals.totalDeduction?.toLocaleString()}
                        </td>
                        <td className="px-4 py-4 text-right font-bold text-purple-600 dark:text-purple-400 text-xl">
                          ₹{salaryData.totals.totalNet?.toLocaleString()}
                        </td>
                        <td colSpan="2" className="px-4 py-4"></td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>

              {/* Pagination */}
              {salaryData?.pagination && salaryData.pagination.total > 0 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 no-print">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>Page {salaryData.pagination.page} of {salaryData.pagination.pages}</span>
                    <span className="mx-2">•</span>
                    <span>{salaryData.pagination.total} total records</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={!salaryData.pagination.hasPrev}
                      className={`px-4 py-2 rounded-lg flex items-center gap-1 ${
                        salaryData.pagination.hasPrev
                          ? 'bg-purple-600 dark:bg-purple-700 text-white hover:bg-purple-700 dark:hover:bg-purple-600'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, salaryData.pagination.pages) }, (_, i) => {
                        let pageNum;
                        if (salaryData.pagination.pages <= 5) {
                          pageNum = i + 1;
                        } else if (page <= 3) {
                          pageNum = i + 1;
                        } else if (page >= salaryData.pagination.pages - 2) {
                          pageNum = salaryData.pagination.pages - 4 + i;
                        } else {
                          pageNum = page - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              page === pageNum
                                ? 'bg-purple-600 dark:bg-purple-700 text-white font-bold'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={!salaryData.pagination.hasNext}
                      className={`px-4 py-2 rounded-lg flex items-center gap-1 ${
                        salaryData.pagination.hasNext
                          ? 'bg-purple-600 dark:bg-purple-700 text-white hover:bg-purple-700 dark:hover:bg-purple-600'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Next
                      <RightIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 no-print">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Salary Sheet Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-purple-600 dark:bg-purple-500 rounded-full mt-1.5"></div>
              <div className="text-gray-700 dark:text-gray-300">
                <strong>Month:</strong> {filterMonth 
                  ? new Date(filterMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                  : 'All Months'}
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-purple-600 dark:bg-purple-500 rounded-full mt-1.5"></div>
              <div className="text-gray-700 dark:text-gray-300">
                <strong>Generated On:</strong> {new Date().toLocaleDateString('en-GB')}
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-purple-600 dark:bg-purple-500 rounded-full mt-1.5"></div>
              <div className="text-gray-700 dark:text-gray-300">
                <strong>Total Records:</strong> {salaryData?.pagination?.total || 0}
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-purple-600 dark:bg-purple-500 rounded-full mt-1.5"></div>
              <div className="text-gray-700 dark:text-gray-300">
                <strong>Payment Status:</strong> {filterStatus ? filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1) : 'All'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media print { 
          .no-print { 
            display: none !important; 
          } 
          body { 
            background: white !important; 
          } 
        }
      `}</style>
    </div>
  );
};

export default SalarySheet;