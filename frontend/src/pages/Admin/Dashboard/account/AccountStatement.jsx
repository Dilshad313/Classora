import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  ChevronRight,
  FileText,
  Search,
  Trash2,
  Copy,
  FileDown,
  Printer,
  Calendar,
  Filter,
  Download,
  AlertCircle,
  Loader
} from 'lucide-react';
import { accountApi } from '../../../../services/accountApi';
import toast from 'react-hot-toast';

const AccountStatement = () => {
  const navigate = useNavigate();
  // State management
  const [filterType, setFilterType] = useState('today');
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [showReferences, setShowReferences] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statements, setStatements] = useState([]);
  const [totals, setTotals] = useState({ debit: 0, credit: 0, netBalance: 0 });

  // Fetch account statement data
  const fetchAccountStatement = async () => {
    setLoading(true);
    try {
      const filters = {
        filterType,
        search: searchQuery,
        showReferences: showReferences.toString()
      };
     
      if (filterType === 'custom' && customDateRange.start && customDateRange.end) {
        filters.startDate = customDateRange.start;
        filters.endDate = customDateRange.end;
      }
     
      const result = await accountApi.getAccountStatement(filters);
     
      if (result.success) {
        setStatements(result.data);
        setTotals(result.totals);
      } else {
        toast.error(result.message || 'Failed to fetch account statement');
      }
    } catch (error) {
      console.error('Error fetching account statement:', error);
      toast.error(error.message || 'Error fetching account statement');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when filters change
  useEffect(() => {
    fetchAccountStatement();
  }, [filterType, customDateRange, searchQuery, showReferences]);

  // Calculate net balance for each row
  const calculateNetBalance = (index) => {
    let balance = 0;
    for (let i = 0; i <= index; i++) {
      balance += statements[i].credit - statements[i].debit;
    }
    return balance;
  };

  // Handle select all
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRecords(statements.map(s => s.id));
    } else {
      setSelectedRecords([]);
    }
  };

  // Handle individual select
  const handleSelectRecord = (id) => {
    setSelectedRecords(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Delete selected records
  const handleDelete = async () => {
    if (selectedRecords.length === 0) {
      toast.error('Please select records to delete');
      return;
    }
   
    if (window.confirm(`Are you sure you want to delete ${selectedRecords.length} record(s)?`)) {
      try {
        const result = await accountApi.deleteTransactions(selectedRecords);
       
        if (result.success) {
          toast.success(result.message);
          setSelectedRecords([]);
          fetchAccountStatement(); // Refresh the data
        } else {
          toast.error(result.message || 'Failed to delete transactions');
        }
      } catch (error) {
        console.error('Error deleting transactions:', error);
        toast.error(error.message || 'Error deleting transactions');
      }
    }
  };

  // Export functions
  const handleCopy = () => {
    const headers = showReferences
      ? ['Date', 'Description', 'Reference', 'Debit', 'Credit', 'Net Balance']
      : ['Date', 'Description', 'Debit', 'Credit', 'Net Balance'];
   
    const rows = statements.map((statement, index) => {
      const row = [
        statement.date,
        statement.description,
        ...(showReferences ? [statement.reference] : []),
        statement.debit.toFixed(2),
        statement.credit.toFixed(2),
        calculateNetBalance(index).toFixed(2)
      ];
      return row.join('\t');
    });
   
    const text = [headers.join('\t'), ...rows].join('\n');
    navigator.clipboard.writeText(text);
    toast.success('Data copied to clipboard!');
  };

  const handleCSV = () => {
    const headers = showReferences
      ? ['Date', 'Description', 'Reference', 'Debit', 'Credit', 'Net Balance']
      : ['Date', 'Description', 'Debit', 'Credit', 'Net Balance'];
   
    const rows = statements.map((statement, index) => {
      const row = [
        statement.date,
        `"${statement.description}"`,
        ...(showReferences ? [statement.reference] : []),
        statement.debit.toFixed(2),
        statement.credit.toFixed(2),
        calculateNetBalance(index).toFixed(2)
      ];
      return row.join(',');
    });
   
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `account-statement-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('CSV exported successfully!');
  };

  const handleExcel = () => {
    const headers = showReferences
      ? ['Date', 'Description', 'Reference', 'Debit', 'Credit', 'Net Balance']
      : ['Date', 'Description', 'Debit', 'Credit', 'Net Balance'];
   
    let html = '<table><thead><tr>';
    headers.forEach(header => {
      html += `<th>${header}</th>`;
    });
    html += '</tr></thead><tbody>';
   
    statements.forEach((statement, index) => {
      html += '<tr>';
      html += `<td>${statement.date}</td>`;
      html += `<td>${statement.description}</td>`;
      if (showReferences) html += `<td>${statement.reference}</td>`;
      html += `<td>${statement.debit.toFixed(2)}</td>`;
      html += `<td>${statement.credit.toFixed(2)}</td>`;
      html += `<td>${calculateNetBalance(index).toFixed(2)}</td>`;
      html += '</tr>';
    });
   
    html += '</tbody></table>';
   
    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `account-statement-${new Date().toISOString().split('T')[0]}.xls`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Excel file exported successfully!');
  };

  const handlePDF = () => {
    window.print();
    toast.success('PDF generated successfully!');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRefresh = () => {
    fetchAccountStatement();
    toast.success('Data refreshed successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span className="text-blue-600 dark:text-blue-400 font-semibold">Account</span>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span className="text-gray-900 dark:text-white font-semibold">Account Statement</span>
        </div>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Account Statement</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">View and manage your account transactions</p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-400 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
            >
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span>Refresh</span>
            </button>
          </div>
        </div>
        {/* Filters and Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Filter Options */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                <Filter className="w-4 h-4 inline mr-2 text-gray-600 dark:text-gray-400" />
                Filter Period
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { value: 'today', label: 'Today' },
                  { value: 'yesterday', label: 'Yesterday' },
                  { value: 'last7days', label: 'Last 7 Days' },
                  { value: 'last30days', label: 'Last 30 Days' },
                  { value: 'thismonth', label: 'This Month' },
                  { value: 'lastmonth', label: 'Last Month' },
                  { value: 'custom', label: 'Custom Range' }
                ].map(filter => (
                  <button
                    key={filter.value}
                    onClick={() => setFilterType(filter.value)}
                    disabled={loading}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      filterType === filter.value
                        ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-md'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
              {/* Custom Date Range */}
              {filterType === 'custom' && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={customDateRange.start}
                      onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                      className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">End Date</label>
                    <input
                      type="date"
                      value={customDateRange.end}
                      onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                      className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              )}
            </div>
            {/* Search and Toggle */}
            <div className="space-y-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  <Search className="w-4 h-4 inline mr-2 text-gray-600 dark:text-gray-400" />
                  Search Records
                </label>
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by description or reference..."
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
              </div>
              {/* References Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Show References</span>
                <button
                  onClick={() => setShowReferences(!showReferences)}
                  className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
                    showReferences ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      showReferences ? 'translate-x-8' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleDelete}
              disabled={selectedRecords.length === 0 || loading}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all ${
                selectedRecords.length > 0 && !loading
                  ? 'bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-400 text-white shadow-md hover:shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              Delete ({selectedRecords.length})
            </button>
            <div className="flex-1" />
            <button
              onClick={handleCopy}
              disabled={statements.length === 0 || loading}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all ${
                statements.length > 0 && !loading
                  ? 'bg-gray-600 dark:bg-gray-500 hover:bg-gray-700 dark:hover:bg-gray-400 text-white shadow-md hover:shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              }`}
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>
            <button
              onClick={handleCSV}
              disabled={statements.length === 0 || loading}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all ${
                statements.length > 0 && !loading
                  ? 'bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-400 text-white shadow-md hover:shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              }`}
            >
              <FileDown className="w-4 h-4" />
              CSV
            </button>
            <button
              onClick={handleExcel}
              disabled={statements.length === 0 || loading}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all ${
                statements.length > 0 && !loading
                  ? 'bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-400 text-white shadow-md hover:shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              }`}
            >
              <Download className="w-4 h-4" />
              Excel
            </button>
            <button
              onClick={handlePDF}
              disabled={statements.length === 0 || loading}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all ${
                statements.length > 0 && !loading
                  ? 'bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-400 text-white shadow-md hover:shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              }`}
            >
              <FileText className="w-4 h-4" />
              PDF
            </button>
            <button
              onClick={handlePrint}
              disabled={statements.length === 0 || loading}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all ${
                statements.length > 0 && !loading
                  ? 'bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-400 text-white shadow-md hover:shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              }`}
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>
        {/* Loading State */}
        {loading && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 mb-6 text-center">
            <Loader className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">Loading account statement...</p>
          </div>
        )}
        {/* Table */}
        {!loading && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <tr>
                    <th className="px-4 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedRecords.length === statements.length && statements.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 rounded border-white"
                      />
                    </th>
                    <th className="px-4 py-4 text-left font-bold">Date</th>
                    <th className="px-4 py-4 text-left font-bold">Description</th>
                    {showReferences && <th className="px-4 py-4 text-left font-bold">Reference</th>}
                    <th className="px-4 py-4 text-right font-bold">Debit</th>
                    <th className="px-4 py-4 text-right font-bold">Credit</th>
                    <th className="px-4 py-4 text-right font-bold">Net Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {statements.length === 0 ? (
                    <tr>
                      <td colSpan={showReferences ? 7 : 6} className="px-4 py-12 text-center text-gray-500 dark:text-gray-400">
                        <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                        <p className="text-lg font-semibold">No records found</p>
                        <p className="text-sm">Try adjusting your filters or search query</p>
                      </td>
                    </tr>
                  ) : (
                    statements.map((statement, index) => (
                      <tr
                        key={statement.id}
                        className={`hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors ${
                          selectedRecords.includes(statement.id) ? 'bg-blue-50 dark:bg-gray-700/50' : ''
                        }`}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedRecords.includes(statement.id)}
                            onChange={() => handleSelectRecord(statement.id)}
                            className="w-4 h-4 rounded border-gray-300 dark:border-gray-600"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                          {new Date(statement.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{statement.description}</td>
                        {showReferences && (
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 font-mono">{statement.reference}</td>
                        )}
                        <td className="px-4 py-3 text-sm text-right font-semibold text-red-600 dark:text-red-400">
                          {statement.debit > 0 ? `₹${statement.debit.toFixed(2)}` : '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-semibold text-green-600 dark:text-green-400">
                          {statement.credit > 0 ? `₹${statement.credit.toFixed(2)}` : '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-bold text-blue-600 dark:text-blue-400">
                          ₹{calculateNetBalance(index).toFixed(2)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                {statements.length > 0 && (
                  <tfoot className="bg-gray-100 dark:bg-gray-700 border-t-2 border-gray-300 dark:border-gray-600">
                    <tr>
                      <td colSpan={showReferences ? 4 : 3} className="px-4 py-4 text-right font-bold text-gray-900 dark:text-white">
                        Total:
                      </td>
                      <td className="px-4 py-4 text-right font-bold text-red-600 dark:text-red-400">
                        ₹{totals.debit.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 text-right font-bold text-green-600 dark:text-green-400">
                        ₹{totals.credit.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 text-right font-bold text-blue-600 dark:text-blue-400">
                        ₹{totals.netBalance.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        )}
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Total Debit</p>
                <p className="text-3xl font-bold mt-1">₹{totals.debit.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Credit</p>
                <p className="text-3xl font-bold mt-1">₹{totals.credit.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Net Balance</p>
                <p className="text-3xl font-bold mt-1">₹{totals.netBalance.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .bg-white.rounded-2xl.shadow-lg.border.border-gray-200,
          .bg-white.rounded-2xl.shadow-lg.border.border-gray-200 * {
            visibility: visible;
          }
          .bg-white.rounded-2xl.shadow-lg.border.border-gray-200 {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            box-shadow: none;
            border: 1px solid #000;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AccountStatement;