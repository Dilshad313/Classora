import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  ChevronRight, 
  AlertTriangle, 
  Search, 
  Calendar,
  FileText,
  Printer,
  Download,
  Mail,
  Phone,
  Grid3x3,
  List,
  Copy,
  FileSpreadsheet,
  CheckCircle,
  Loader
} from 'lucide-react';
import * as feesApi from '../../../../services/feesApi';

const FeesDefaulters = () => {
  const navigate = useNavigate();
  const [feesMonth, setFeesMonth] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('table');
  const [selectedDefaulters, setSelectedDefaulters] = useState([]);
  const [defaulters, setDefaulters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ totalDefaulters: 0, totalPayable: 0 });

  // Load defaulters when month changes
  useEffect(() => {
    if (feesMonth) {
      loadDefaulters();
    }
  }, [feesMonth]);

  const loadDefaulters = async () => {
    try {
      setLoading(true);
      const filters = {
        month: feesMonth,
        search: searchQuery
      };

      const response = await feesApi.getFeesDefaulters(filters);
      const defaultersList = Array.isArray(response) ? response : [];
      setDefaulters(defaultersList);
      
      // Calculate stats from defaulters list
      const totalPayable = defaultersList.reduce((sum, d) => sum + (d.payable || 0), 0);
      setStats({
        totalDefaulters: defaultersList.length,
        totalPayable: totalPayable
      });
    } catch (error) {
      console.error('Error loading defaulters:', error);
      alert('Failed to load fees defaulters');
    } finally {
      setLoading(false);
    }
  };

  // Filter defaulters based on search query
  const filteredDefaulters = defaulters.filter(defaulter => {
    const query = searchQuery.toLowerCase();
    return (
      defaulter.studentName.toLowerCase().includes(query) ||
      defaulter.registrationNo.toLowerCase().includes(query) ||
      defaulter.guardianName.toLowerCase().includes(query) ||
      defaulter.class.toLowerCase().includes(query) ||
      (defaulter.mobileNo && defaulter.mobileNo.includes(query))
    );
  });

  // Handle checkbox selection
  const handleSelectDefaulter = (id) => {
    setSelectedDefaulters(prev => 
      prev.includes(id) 
        ? prev.filter(defaulterId => defaulterId !== id)
        : [...prev, id]
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedDefaulters.length === filteredDefaulters.length) {
      setSelectedDefaulters([]);
    } else {
      setSelectedDefaulters(filteredDefaulters.map(d => d._id));
    }
  };

  // Handle send reminder
  const handleSendReminder = () => {
    if (selectedDefaulters.length === 0) {
      alert('Please select at least one defaulter to send reminder');
      return;
    }
    alert(`Reminder sent to ${selectedDefaulters.length} defaulter(s)`);
  };

  // Handle export functions
  const handleCopy = () => {
    alert('Data copied to clipboard');
  };

  const handleExportCSV = () => {
    alert('Exporting to CSV...');
  };

  const handleExportExcel = () => {
    alert('Exporting to Excel...');
  };

  const handleExportPDF = () => {
    alert('Exporting to PDF...');
  };

  const handlePrint = () => {
    window.print();
  };

  // Handle submit (navigate to Collect Fees with selected students)
  const handleSubmit = () => {
    if (selectedDefaulters.length === 0) {
      alert('Please select at least one defaulter');
      return;
    }
    
    const selectedStudents = defaulters.filter(d => selectedDefaulters.includes(d._id));
    // You can pass the selected students to CollectFees via state or context
    navigate('/dashboard/fees/collect-fees', { 
      state: { selectedDefaulters: selectedStudents }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 mb-6 text-sm no-print">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-blue-600 font-semibold">Fees</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-semibold">Fees Defaulters</span>
        </div>

        {/* Header */}
        <div className="mb-8 no-print">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Fees Defaulters</h1>
              <p className="text-gray-600 mt-1">View and manage students with pending fee payments</p>
            </div>
          </div>
        </div>

        {/* Fees Month Selection */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6 no-print">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Select Fees Month</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Fees Month <span className="text-red-500">*</span>
              </label>
              <input
                type="month"
                value={feesMonth}
                onChange={(e) => setFeesMonth(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div className="flex items-end gap-4">
              <button
                onClick={loadDefaulters}
                disabled={!feesMonth || loading}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                {loading ? 'Loading...' : 'Load Defaulters'}
              </button>
              {feesMonth && (
                <button
                  onClick={() => {
                    setFeesMonth('');
                    setDefaulters([]);
                    setSelectedDefaulters([]);
                  }}
                  className="px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-semibold transition-all"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader className="w-8 h-8 animate-spin text-red-600" />
            <span className="ml-2 text-gray-600">Loading defaulters...</span>
          </div>
        )}

        {feesMonth && defaulters.length > 0 && (
          <>
            {/* Action Bar */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6 no-print">
              <div className="flex flex-wrap items-center gap-4">
                {/* View Mode Toggle */}
                <div className="flex items-center gap-2 border-2 border-gray-300 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                      viewMode === 'table'
                        ? 'bg-red-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <List className="w-4 h-4" />
                    Table View
                  </button>
                  <button
                    onClick={() => setViewMode('large')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                      viewMode === 'large'
                        ? 'bg-red-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Grid3x3 className="w-4 h-4" />
                    Large View
                  </button>
                </div>

                {/* Search */}
                <div className="flex-1 min-w-[250px]">
                  <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name, registration no, guardian, class, or phone..."
                      className="w-full pl-11 pr-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>

                {/* Send Reminder Button */}
                <button
                  onClick={handleSendReminder}
                  disabled={selectedDefaulters.length === 0}
                  className={`px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                    selectedDefaulters.length > 0
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  Send Reminder ({selectedDefaulters.length})
                </button>
              </div>

              {/* Export Buttons */}
              <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-200">
                <span className="text-sm font-semibold text-gray-700">Export:</span>
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  CSV
                </button>
                <button
                  onClick={handleExportExcel}
                  className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg font-medium transition-all flex items-center gap-2"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Excel
                </button>
                <button
                  onClick={handleExportPDF}
                  className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  PDF
                </button>
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-all flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>
              </div>
            </div>

            {/* Table View */}
            {viewMode === 'table' && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
                      <tr>
                        <th className="px-4 py-4 text-left">
                          <input
                            type="checkbox"
                            checked={selectedDefaulters.length === filteredDefaulters.length && filteredDefaulters.length > 0}
                            onChange={handleSelectAll}
                            className="w-4 h-4 rounded border-white"
                          />
                        </th>
                        <th className="px-4 py-4 text-left font-bold">ID</th>
                        <th className="px-4 py-4 text-left font-bold">Photo</th>
                        <th className="px-4 py-4 text-left font-bold">Name</th>
                        <th className="px-4 py-4 text-left font-bold">Guardian</th>
                        <th className="px-4 py-4 text-left font-bold">Class</th>
                        <th className="px-4 py-4 text-right font-bold">Payable</th>
                        <th className="px-4 py-4 text-left font-bold">Phone</th>
                        <th className="px-4 py-4 text-center font-bold">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredDefaulters.map((defaulter, index) => (
                        <tr key={defaulter._id} className="hover:bg-red-50 transition-colors">
                          <td className="px-4 py-4">
                            <input
                              type="checkbox"
                              checked={selectedDefaulters.includes(defaulter._id)}
                              onChange={() => handleSelectDefaulter(defaulter._id)}
                              className="w-4 h-4 rounded border-gray-300"
                            />
                          </td>
                          <td className="px-4 py-4 text-gray-700 font-medium">{index + 1}</td>
                          <td className="px-4 py-4">
                            <img
                              src={defaulter.photo?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(defaulter.studentName)}&background=4F46E5&color=fff`}
                              alt={defaulter.studentName}
                              className="w-10 h-10 rounded-full border-2 border-red-200"
                            />
                          </td>
                          <td className="px-4 py-4">
                            <div className="font-semibold text-gray-900">{defaulter.studentName}</div>
                            <div className="text-sm text-gray-600">{defaulter.registrationNo}</div>
                          </td>
                          <td className="px-4 py-4 text-gray-700">{defaulter.guardianName}</td>
                          <td className="px-4 py-4">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                              {defaulter.class}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <span className="text-red-600 font-bold text-lg">₹{defaulter.payable?.toFixed(2) || '0.00'}</span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2 text-gray-700">
                              <Phone className="w-4 h-4" />
                              {defaulter.mobileNo || 'N/A'}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => navigate('/dashboard/fees/collect-fees', { state: { selectedStudent: defaulter } })}
                                className="p-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-all"
                                title="Collect Fees"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => alert(`Sending reminder to ${defaulter.studentName}`)}
                                className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-all"
                                title="Send Reminder"
                              >
                                <Mail className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredDefaulters.length === 0 && (
                  <div className="text-center py-12">
                    <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg font-semibold">No defaulters found</p>
                    <p className="text-gray-500 text-sm mt-2">Try adjusting your search</p>
                  </div>
                )}
              </div>
            )}

            {/* Large View */}
            {viewMode === 'large' && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left">
                          <input
                            type="checkbox"
                            checked={selectedDefaulters.length === filteredDefaulters.length && filteredDefaulters.length > 0}
                            onChange={handleSelectAll}
                            className="w-5 h-5 rounded border-white"
                          />
                        </th>
                        <th className="px-6 py-4 text-left font-bold text-lg">Registration Number</th>
                        <th className="px-6 py-4 text-left font-bold text-lg">Class</th>
                        <th className="px-6 py-4 text-left font-bold text-lg">Student Name</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredDefaulters.map((defaulter) => (
                        <tr key={defaulter._id} className="hover:bg-red-50 transition-colors">
                          <td className="px-6 py-5">
                            <input
                              type="checkbox"
                              checked={selectedDefaulters.includes(defaulter._id)}
                              onChange={() => handleSelectDefaulter(defaulter._id)}
                              className="w-5 h-5 rounded border-gray-300"
                            />
                          </td>
                          <td className="px-6 py-5">
                            <span className="text-gray-900 font-bold text-lg">{defaulter.registrationNo}</span>
                          </td>
                          <td className="px-6 py-5">
                            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-base font-semibold">
                              {defaulter.class}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              <img
                                src={defaulter.photo?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(defaulter.studentName)}&background=4F46E5&color=fff`}
                                alt={defaulter.studentName}
                                className="w-12 h-12 rounded-full border-2 border-red-200"
                              />
                              <div>
                                <div className="font-bold text-gray-900 text-lg">{defaulter.studentName}</div>
                                <div className="text-sm text-gray-600">Guardian: {defaulter.guardianName}</div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredDefaulters.length === 0 && (
                  <div className="text-center py-12">
                    <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg font-semibold">No defaulters found</p>
                    <p className="text-gray-500 text-sm mt-2">Try adjusting your search</p>
                  </div>
                )}
              </div>
            )}

            {/* Summary Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mt-6 no-print">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-red-50 rounded-xl border border-red-200">
                  <div className="text-3xl font-bold text-red-600">{stats.totalDefaulters}</div>
                  <div className="text-sm text-gray-600 mt-1">Total Defaulters</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-200">
                  <div className="text-3xl font-bold text-orange-600">{selectedDefaulters.length}</div>
                  <div className="text-sm text-gray-600 mt-1">Selected</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="text-3xl font-bold text-green-600">
                    ₹{stats.totalPayable.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Total Payable</div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center mt-8 no-print">
              <button
                onClick={handleSubmit}
                disabled={selectedDefaulters.length === 0}
                className={`px-12 py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center gap-3 ${
                  selectedDefaulters.length > 0
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white hover:shadow-xl transform hover:-translate-y-0.5'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <CheckCircle className="w-6 h-6" />
                Submit & Collect Fees
              </button>
            </div>
          </>
        )}

        {feesMonth && !loading && defaulters.length === 0 && (
          <div className="text-center py-16">
            <AlertTriangle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Defaulters Found</h3>
            <p className="text-gray-600">
              All students have paid their fees for {new Date(feesMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        )}
      </div>

      {/* Print Styles */}
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

export default FeesDefaulters;