import React, { useState, useMemo } from 'react';
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
  Download
} from 'lucide-react';

const AccountStatement = () => {
  const navigate = useNavigate();

  // State management
  const [filterType, setFilterType] = useState('today');
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [showReferences, setShowReferences] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecords, setSelectedRecords] = useState([]);

  // Sample data - replace with actual API data
  const [statements] = useState([
    { id: 1, date: '2024-11-07', description: 'Student Fee Payment - John Doe', reference: 'REF001', debit: 0, credit: 5000 },
    { id: 2, date: '2024-11-07', description: 'Salary Payment - Teacher', reference: 'REF002', debit: 3000, credit: 0 },
    { id: 3, date: '2024-11-06', description: 'Office Supplies Purchase', reference: 'REF003', debit: 500, credit: 0 },
    { id: 4, date: '2024-11-06', description: 'Student Fee Payment - Jane Smith', reference: 'REF004', debit: 0, credit: 4500 },
    { id: 5, date: '2024-11-05', description: 'Electricity Bill', reference: 'REF005', debit: 800, credit: 0 },
    { id: 6, date: '2024-11-05', description: 'Book Sales Revenue', reference: 'REF006', debit: 0, credit: 2000 },
    { id: 7, date: '2024-11-04', description: 'Maintenance Work', reference: 'REF007', debit: 1500, credit: 0 },
    { id: 8, date: '2024-11-03', description: 'Student Fee Payment - Mike Johnson', reference: 'REF008', debit: 0, credit: 5500 },
    { id: 9, date: '2024-10-30', description: 'Internet Bill', reference: 'REF009', debit: 600, credit: 0 },
    { id: 10, date: '2024-10-28', description: 'Event Registration Fees', reference: 'REF010', debit: 0, credit: 3000 },
  ]);

  // Filter data based on selected filter type
  const filteredStatements = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let filtered = statements.filter(statement => {
      const statementDate = new Date(statement.date);
      statementDate.setHours(0, 0, 0, 0);
      
      switch(filterType) {
        case 'today':
          return statementDate.getTime() === today.getTime();
        case 'yesterday':
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          return statementDate.getTime() === yesterday.getTime();
        case 'last7days':
          const last7Days = new Date(today);
          last7Days.setDate(last7Days.getDate() - 7);
          return statementDate >= last7Days && statementDate <= today;
        case 'last30days':
          const last30Days = new Date(today);
          last30Days.setDate(last30Days.getDate() - 30);
          return statementDate >= last30Days && statementDate <= today;
        case 'thismonth':
          return statementDate.getMonth() === today.getMonth() && 
                 statementDate.getFullYear() === today.getFullYear();
        case 'lastmonth':
          const lastMonth = new Date(today);
          lastMonth.setMonth(lastMonth.getMonth() - 1);
          return statementDate.getMonth() === lastMonth.getMonth() && 
                 statementDate.getFullYear() === lastMonth.getFullYear();
        case 'custom':
          if (customDateRange.start && customDateRange.end) {
            const startDate = new Date(customDateRange.start);
            const endDate = new Date(customDateRange.end);
            return statementDate >= startDate && statementDate <= endDate;
          }
          return true;
        default:
          return true;
      }
    });

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(statement => 
        statement.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        statement.reference.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [statements, filterType, customDateRange, searchQuery]);

  // Calculate net balance
  const calculateNetBalance = (index) => {
    let balance = 0;
    for (let i = 0; i <= index; i++) {
      balance += filteredStatements[i].credit - filteredStatements[i].debit;
    }
    return balance;
  };

  // Calculate totals
  const totals = useMemo(() => {
    return filteredStatements.reduce((acc, statement) => ({
      debit: acc.debit + statement.debit,
      credit: acc.credit + statement.credit
    }), { debit: 0, credit: 0 });
  }, [filteredStatements]);

  // Handle select all
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRecords(filteredStatements.map(s => s.id));
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
  const handleDelete = () => {
    if (selectedRecords.length === 0) {
      alert('Please select records to delete');
      return;
    }
    if (window.confirm(`Are you sure you want to delete ${selectedRecords.length} record(s)?`)) {
      alert('Records deleted successfully!');
      setSelectedRecords([]);
    }
  };

  // Export functions
  const handleCopy = () => {
    const headers = showReferences 
      ? ['Date', 'Description', 'Reference', 'Debit', 'Credit', 'Net Balance']
      : ['Date', 'Description', 'Debit', 'Credit', 'Net Balance'];
    
    const rows = filteredStatements.map((statement, index) => {
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
    alert('Data copied to clipboard!');
  };

  const handleCSV = () => {
    const headers = showReferences 
      ? ['Date', 'Description', 'Reference', 'Debit', 'Credit', 'Net Balance']
      : ['Date', 'Description', 'Debit', 'Credit', 'Net Balance'];
    
    const rows = filteredStatements.map((statement, index) => {
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
  };

  const handleExcel = () => {
    // Simple Excel export using HTML table method
    const headers = showReferences 
      ? ['Date', 'Description', 'Reference', 'Debit', 'Credit', 'Net Balance']
      : ['Date', 'Description', 'Debit', 'Credit', 'Net Balance'];
    
    let html = '<table><thead><tr>';
    headers.forEach(header => {
      html += `<th>${header}</th>`;
    });
    html += '</tr></thead><tbody>';
    
    filteredStatements.forEach((statement, index) => {
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
  };

  const handlePDF = () => {
    window.print();
  };

  const handlePrint = () => {
    window.print();
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
          <span className="text-blue-600 font-semibold">Account</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-semibold">Account Statement</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Account Statement</h1>
              <p className="text-gray-600 mt-1">View and manage your account transactions</p>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Filter Options */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Filter className="w-4 h-4 inline mr-2" />
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
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      filterType === filter.value
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              {/* Custom Date Range */}
              {filterType === 'custom' && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={customDateRange.start}
                      onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
                    <input
                      type="date"
                      value={customDateRange.end}
                      onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Search and Toggle */}
            <div className="space-y-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <Search className="w-4 h-4 inline mr-2" />
                  Search Records
                </label>
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by description or reference..."
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* References Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="text-sm font-semibold text-gray-700">Show References</span>
                <button
                  onClick={() => setShowReferences(!showReferences)}
                  className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
                    showReferences ? 'bg-blue-600' : 'bg-gray-300'
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
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleDelete}
              disabled={selectedRecords.length === 0}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all ${
                selectedRecords.length > 0
                  ? 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              Delete ({selectedRecords.length})
            </button>

            <div className="flex-1" />

            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>

            <button
              onClick={handleCSV}
              className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
            >
              <FileDown className="w-4 h-4" />
              CSV
            </button>

            <button
              onClick={handleExcel}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
            >
              <Download className="w-4 h-4" />
              Excel
            </button>

            <button
              onClick={handlePDF}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
            >
              <FileText className="w-4 h-4" />
              PDF
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <tr>
                  <th className="px-4 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedRecords.length === filteredStatements.length && filteredStatements.length > 0}
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
              <tbody className="divide-y divide-gray-200">
                {filteredStatements.length === 0 ? (
                  <tr>
                    <td colSpan={showReferences ? 7 : 6} className="px-4 py-12 text-center text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-lg font-semibold">No records found</p>
                      <p className="text-sm">Try adjusting your filters or search query</p>
                    </td>
                  </tr>
                ) : (
                  filteredStatements.map((statement, index) => (
                    <tr 
                      key={statement.id}
                      className={`hover:bg-blue-50 transition-colors ${
                        selectedRecords.includes(statement.id) ? 'bg-blue-50' : ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedRecords.includes(statement.id)}
                          onChange={() => handleSelectRecord(statement.id)}
                          className="w-4 h-4 rounded border-gray-300"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {new Date(statement.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{statement.description}</td>
                      {showReferences && (
                        <td className="px-4 py-3 text-sm text-gray-600 font-mono">{statement.reference}</td>
                      )}
                      <td className="px-4 py-3 text-sm text-right font-semibold text-red-600">
                        {statement.debit > 0 ? `₹${statement.debit.toFixed(2)}` : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-green-600">
                        {statement.credit > 0 ? `₹${statement.credit.toFixed(2)}` : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-bold text-blue-600">
                        ₹{calculateNetBalance(index).toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {filteredStatements.length > 0 && (
                <tfoot className="bg-gray-100 border-t-2 border-gray-300">
                  <tr>
                    <td colSpan={showReferences ? 4 : 3} className="px-4 py-4 text-right font-bold text-gray-900">
                      Total:
                    </td>
                    <td className="px-4 py-4 text-right font-bold text-red-600">
                      ₹{totals.debit.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 text-right font-bold text-green-600">
                      ₹{totals.credit.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 text-right font-bold text-blue-600">
                      ₹{(totals.credit - totals.debit).toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg p-6 text-white">
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

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
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

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Net Balance</p>
                <p className="text-3xl font-bold mt-1">₹{(totals.credit - totals.debit).toFixed(2)}</p>
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
          }
        }
      `}</style>
    </div>
  );
};

export default AccountStatement;
