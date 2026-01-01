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
  Loader,
  MessageSquare,
  X,
  Send
} from 'lucide-react';
import * as feesApi from '../../../../services/feesApi';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const FeesDefaulters = () => {
  const navigate = useNavigate();
  const [feesMonth, setFeesMonth] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('table');
  const [selectedDefaulters, setSelectedDefaulters] = useState([]);
  const [defaulters, setDefaulters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ totalDefaulters: 0, totalPayable: 0, totalRequired: 0, totalPaid: 0 });
  const [messageBox, setMessageBox] = useState({ isOpen: false, student: null, message: '' });

  // Load defaulters when month changes
  useEffect(() => {
    if (feesMonth) {
      loadDefaulters();
    }
  }, [feesMonth]);

  const loadDefaulters = async () => {
    try {
      setLoading(true);
      
      // Debug: Log the selected month
      console.log('Loading defaulters for month:', feesMonth);
      
      // Validate month format
      if (!feesMonth) {
        toast.error('Please select a month');
        return;
      }
      
      const filters = {
        month: feesMonth,
        search: searchQuery || undefined // Only include search if it has a value
      };
      
      console.log('Sending filters:', filters);

      const response = await feesApi.getFeesDefaulters(filters);
      console.log('Full API Response:', JSON.stringify(response, null, 2));
      
      // Handle different response formats more robustly
      let defaultersList = [];
      let responseStats = null;
      
      if (response) {
        // Check if response has data property
        if (response.data && Array.isArray(response.data)) {
          defaultersList = response.data;
          responseStats = response.stats;
        } 
        // Check if response is directly an array
        else if (Array.isArray(response)) {
          defaultersList = response;
        }
        // Check if response has success property and data
        else if (response.success && response.data) {
          defaultersList = Array.isArray(response.data) ? response.data : [];
          responseStats = response.stats;
        }
        // Check if response itself is the data (some API patterns)
        else if (typeof response === 'object' && !response.success && !response.data) {
          // Response might be the data directly
          const possibleDataKeys = ['defaulters', 'results', 'items'];
          for (const key of possibleDataKeys) {
            if (response[key] && Array.isArray(response[key])) {
              defaultersList = response[key];
              responseStats = response.stats;
              break;
            }
          }
        }
      }
      
      console.log('Processed defaulters list:', defaultersList);
      console.log('Response stats:', responseStats);
      
      // Validate defaulters data
      if (!Array.isArray(defaultersList)) {
        console.error('Defaulters list is not an array:', defaultersList);
        defaultersList = [];
      }
      
      setDefaulters(defaultersList);
      
      // Calculate stats from API response or from the data
      const stats = responseStats || {
        totalDefaulters: defaultersList.length,
        totalPayable: defaultersList.reduce((sum, d) => sum + (d.payable || 0), 0),
        totalRequired: defaultersList.reduce((sum, d) => sum + (d.totalFeeRequired || 0), 0),
        totalPaid: defaultersList.reduce((sum, d) => sum + (d.amountPaid || 0), 0)
      };
      
      console.log('Final stats:', stats);
      setStats(stats);
      
      // Provide user feedback
      if (defaultersList.length === 0) {
        toast.info('No defaulters found for the selected month. All students may have paid their fees.');
      } else {
        toast.success(`Loaded ${defaultersList.length} defaulter(s) successfully`);
      }
    } catch (error) {
      console.error('Error loading defaulters:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response
      });
      
      // Provide specific error messages
      let errorMessage = 'Failed to load fees defaulters';
      if (error.message.includes('404')) {
        errorMessage = 'Fees defaulters endpoint not found';
      } else if (error.message.includes('401')) {
        errorMessage = 'Authentication failed. Please login again.';
      } else if (error.message.includes('500')) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.message) {
        errorMessage = `Failed to load fees defaulters: ${error.message}`;
      }
      
      toast.error(errorMessage);
      setDefaulters([]);
      setStats({ totalDefaulters: 0, totalPayable: 0, totalRequired: 0, totalPaid: 0 });
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
      (defaulter.guardianName && defaulter.guardianName.toLowerCase().includes(query)) ||
      (defaulter.fatherName && defaulter.fatherName.toLowerCase().includes(query)) ||
      (defaulter.motherName && defaulter.motherName.toLowerCase().includes(query)) ||
      (defaulter.class && defaulter.class.toLowerCase().includes(query)) ||
      (defaulter.selectClass && defaulter.selectClass.toLowerCase().includes(query)) ||
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
      toast.error('Please select at least one defaulter to send reminder');
      return;
    }
    toast.success(`Reminder sent to ${selectedDefaulters.length} defaulter(s)`);
  };

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount || 0).toFixed(2)}`;
  };

  // Helper function to get guardian name
  const getGuardianName = (defaulter) => {
    return defaulter.fatherName || defaulter.guardianName || 'N/A';
  };

  // Helper function to get class name
  const getClassName = (defaulter) => {
    return `Class ${defaulter.selectClass || defaulter.class || 'N/A'}`;
  };

  // Handle export functions
  const handleCopy = () => {
    if (filteredDefaulters.length === 0) {
      toast.error('No data to copy');
      return;
    }

    // Create formatted data for clipboard
    const headers = ['ID', 'Name', 'Registration No', 'Guardian', 'Class', 'Total Fee Required', 'Amount Paid', 'Payable', 'Phone'];
    const data = filteredDefaulters.map((defaulter, index) => [
      index + 1,
      defaulter.studentName,
      defaulter.registrationNo,
      getGuardianName(defaulter),
      getClassName(defaulter),
      formatCurrency(defaulter.totalFeeRequired),
      formatCurrency(defaulter.amountPaid),
      formatCurrency(defaulter.payable),
      defaulter.mobileNo || 'N/A'
    ]);

    const csvContent = [headers, ...data]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    navigator.clipboard.writeText(csvContent)
      .then(() => toast.success('Data copied to clipboard'))
      .catch(() => toast.error('Failed to copy data'));
  };

  const handleExportCSV = () => {
    if (filteredDefaulters.length === 0) {
      toast.error('No data to export');
      return;
    }

    try {
      const headers = ['ID', 'Name', 'Registration No', 'Guardian', 'Class', 'Total Fee Required', 'Amount Paid', 'Payable', 'Phone'];
      const data = filteredDefaulters.map((defaulter, index) => [
        index + 1,
        defaulter.studentName,
        defaulter.registrationNo,
        getGuardianName(defaulter),
        getClassName(defaulter),
        defaulter.totalFeeRequired || 0,
        defaulter.amountPaid || 0,
        defaulter.payable || 0,
        defaulter.mobileNo || 'N/A'
      ]);

      const csvContent = [headers, ...data]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `fees-defaulters-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('CSV exported successfully');
    } catch (error) {
      console.error('CSV export error:', error);
      toast.error('Failed to export CSV');
    }
  };

  const handleExportExcel = () => {
    if (filteredDefaulters.length === 0) {
      toast.error('No data to export');
      return;
    }

    try {
      // Create HTML table for Excel export
      const headers = ['ID', 'Name', 'Registration No', 'Guardian', 'Class', 'Total Fee Required', 'Amount Paid', 'Payable', 'Phone'];
      const data = filteredDefaulters.map((defaulter, index) => [
        index + 1,
        defaulter.studentName,
        defaulter.registrationNo,
        getGuardianName(defaulter),
        getClassName(defaulter),
        formatCurrency(defaulter.totalFeeRequired),
        formatCurrency(defaulter.amountPaid),
        formatCurrency(defaulter.payable),
        defaulter.mobileNo || 'N/A'
      ]);

      let html = '<table>\n';
      html += '<tr>' + headers.map(header => `<th>${header}</th>`).join('') + '</tr>\n';
      data.forEach(row => {
        html += '<tr>' + row.map(cell => `<td>${cell}</td>`).join('') + '</tr>\n';
      });
      html += '</table>';

      const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `fees-defaulters-${new Date().toISOString().split('T')[0]}.xls`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Excel exported successfully');
    } catch (error) {
      console.error('Excel export error:', error);
      toast.error('Failed to export Excel');
    }
  };

  const handleExportPDF = () => {
    if (filteredDefaulters.length === 0) {
      toast.error('No data to export');
      return;
    }

    try {
      // Initialize jsPDF
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      // Add title
      doc.setFontSize(16);
      doc.text('Fees Defaulters Report', 14, 15);
      
      // Add date and month info
      doc.setFontSize(10);
      doc.text(`Month: ${feesMonth ? new Date(feesMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'}`, 14, 22);
      doc.text(`Generated: ${new Date().toLocaleDateString('en-US')} at ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`, 14, 28);
      doc.text(`Total Defaulters: ${filteredDefaulters.length}`, 14, 34);
      
      // Prepare table data
      const headers = [
        { header: 'ID', dataKey: 'id' },
        { header: 'Name', dataKey: 'name' },
        { header: 'Reg. No', dataKey: 'regNo' },
        { header: 'Guardian', dataKey: 'guardian' },
        { header: 'Class', dataKey: 'class' },
        { header: 'Total Required', dataKey: 'totalRequired' },
        { header: 'Amount Paid', dataKey: 'amountPaid' },
        { header: 'Payable', dataKey: 'payable' },
        { header: 'Phone', dataKey: 'phone' }
      ];
      
      const data = filteredDefaulters.map((defaulter, index) => ({
        id: index + 1,
        name: defaulter.studentName || '',
        regNo: defaulter.registrationNo || '',
        guardian: getGuardianName(defaulter),
        class: getClassName(defaulter),
        totalRequired: formatCurrency(defaulter.totalFeeRequired),
        amountPaid: formatCurrency(defaulter.amountPaid),
        payable: formatCurrency(defaulter.payable),
        phone: defaulter.mobileNo || 'N/A'
      }));

      // Add table using autoTable
      doc.autoTable({
        columns: headers,
        body: data,
        startY: 40,
        styles: {
          fontSize: 8,
          cellPadding: 2,
          valign: 'middle',
          halign: 'left'
        },
        headStyles: {
          fillColor: [220, 38, 38],
          textColor: 255,
          fontStyle: 'bold',
          fontSize: 9
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        margin: { left: 10, right: 10, top: 40, bottom: 20 },
        theme: 'grid',
        columnStyles: {
          0: { cellWidth: 15, halign: 'center' }, // ID
          1: { cellWidth: 40 }, // Name
          2: { cellWidth: 25 }, // Reg No
          3: { cellWidth: 35 }, // Guardian
          4: { cellWidth: 20, halign: 'center' }, // Class
          5: { cellWidth: 30, halign: 'right' }, // Total Required
          6: { cellWidth: 25, halign: 'right' }, // Amount Paid
          7: { cellWidth: 25, halign: 'right' }, // Payable
          8: { cellWidth: 30 } // Phone
        }
      });

      // Add summary at the bottom
      const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 50;
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.text(`Summary:`, 14, finalY);
      doc.setFont(undefined, 'normal');
      doc.text(`Total Required: ${formatCurrency(stats.totalRequired)}`, 14, finalY + 6);
      doc.text(`Total Paid: ${formatCurrency(stats.totalPaid)}`, 14, finalY + 12);
      doc.text(`Total Payable: ${formatCurrency(stats.totalPayable)}`, 14, finalY + 18);

      // Save the PDF
      const fileName = `fees-defaulters-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      toast.success('PDF exported successfully');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to export PDF: ' + error.message);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Handle submit (navigate to Collect Fees with selected students)
  const handleSubmit = () => {
    if (selectedDefaulters.length === 0) {
      toast.error('Please select at least one defaulter');
      return;
    }
    
    const selectedStudents = defaulters.filter(d => selectedDefaulters.includes(d._id));
    navigate('/dashboard/fees/collect-fees', { 
      state: { selectedDefaulters: selectedStudents }
    });
  };

  // Handle message functionality
  const handleMessageClick = (student) => {
    setMessageBox({ isOpen: true, student, message: '' });
  };

  const handleCloseMessage = () => {
    setMessageBox({ isOpen: false, student: null, message: '' });
  };

  const handleSendMessage = () => {
    if (!messageBox.message.trim()) {
      toast.error('Please enter a message');
      return;
    }
    
    // Here you would implement the actual message sending logic
    console.log('Sending message to:', messageBox.student.studentName);
    console.log('Message:', messageBox.message);
    
    toast.success(`Message sent to ${messageBox.student.studentName}`);
    handleCloseMessage();
  };

  // Helper function to get initials
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 mb-6 text-sm no-print">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span className="text-blue-600 dark:text-blue-400 font-semibold">Fees</span>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span className="text-gray-900 dark:text-gray-100 font-semibold">Fees Defaulters</span>
        </div>

        {/* Header */}
        <div className="mb-8 no-print">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Fees Defaulters</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">View and manage students with pending fee payments</p>
            </div>
          </div>
        </div>

        {/* Fees Month Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6 no-print transition-colors duration-300">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Select Fees Month</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Fees Month <span className="text-red-500">*</span>
              </label>
              <input
                type="month"
                value={feesMonth}
                onChange={(e) => setFeesMonth(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
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
            <Loader className="w-8 h-8 animate-spin text-red-600 dark:text-red-400" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading defaulters...</span>
          </div>
        )}

        {feesMonth && defaulters.length > 0 && (
          <>
            {/* Action Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6 no-print transition-colors duration-300">
              <div className="flex flex-wrap items-center gap-4">
                {/* View Mode Toggle */}
                <div className="flex items-center gap-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                      viewMode === 'table'
                        ? 'bg-red-600 text-white shadow-md'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
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
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Grid3x3 className="w-4 h-4" />
                    Large View
                  </button>
                </div>

                {/* Search */}
                <div className="flex-1 min-w-[250px]">
                  <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name, registration no, guardian, class, or phone..."
                      className="w-full pl-11 pr-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
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
                      : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  Send Reminder ({selectedDefaulters.length})
                </button>
              </div>

              {/* Export Buttons */}
              <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Export:</span>
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-all flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-all flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  CSV
                </button>
                <button
                  onClick={handleExportExcel}
                  className="px-4 py-2 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-800 text-green-700 dark:text-green-300 rounded-lg font-medium transition-all flex items-center gap-2"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Excel
                </button>
                <button
                  onClick={handleExportPDF}
                  className="px-4 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800 text-red-700 dark:text-red-300 rounded-lg font-medium transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  PDF
                </button>
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-lg font-medium transition-all flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>
              </div>
            </div>

            {/* Table View */}
            {viewMode === 'table' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300">
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
                        <th className="px-4 py-4 text-right font-bold">Total Fee Required</th>
                        <th className="px-4 py-4 text-right font-bold">Amount Paid</th>
                        <th className="px-4 py-4 text-right font-bold">Payable</th>
                        <th className="px-4 py-4 text-left font-bold">Phone</th>
                        <th className="px-4 py-4 text-center font-bold">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredDefaulters.map((defaulter, index) => (
                        <tr key={defaulter._id} className="hover:bg-red-50 dark:hover:bg-gray-700 transition-colors">
                          <td className="px-4 py-4">
                            <input
                              type="checkbox"
                              checked={selectedDefaulters.includes(defaulter._id)}
                              onChange={() => handleSelectDefaulter(defaulter._id)}
                              className="w-4 h-4 rounded border-gray-300 dark:border-gray-600"
                            />
                          </td>
                          <td className="px-4 py-4 text-gray-700 dark:text-gray-300 font-medium">{index + 1}</td>
                          <td className="px-4 py-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full border-2 border-red-200 dark:border-red-700 overflow-hidden flex items-center justify-center">
                              {defaulter.picture?.url ? (
                                <img 
                                  src={defaulter.picture.url} 
                                  alt={defaulter.studentName}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    // Fallback to initials if image fails to load
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              {/* Fallback initials - hidden by default when image is present */}
                              <div 
                                className="text-white font-bold text-sm" 
                                style={{ display: defaulter.picture?.url ? 'none' : 'flex' }}
                              >
                                {getInitials(defaulter.studentName)}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="font-semibold text-gray-900 dark:text-white">{defaulter.studentName}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{defaulter.registrationNo}</div>
                          </td>
                          <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                            {defaulter.fatherName || defaulter.guardianName || 'N/A'}
                          </td>
                          <td className="px-4 py-4">
                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                              Class {defaulter.selectClass || defaulter.class}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <span className="text-gray-600 dark:text-gray-400 font-semibold">₹{defaulter.totalFeeRequired?.toFixed(2) || '0.00'}</span>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <span className="text-blue-600 dark:text-blue-400 font-semibold">₹{defaulter.amountPaid?.toFixed(2) || '0.00'}</span>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <span className="text-red-600 dark:text-red-400 font-bold text-lg">₹{defaulter.payable?.toFixed(2) || '0.00'}</span>
                            {defaulter.paymentStatus === 'partial' && (
                              <div className="text-xs text-orange-500 dark:text-orange-400 mt-1">Partial</div>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                              <Phone className="w-4 h-4" />
                              {defaulter.mobileNo || 'N/A'}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => navigate('/dashboard/fees/collect-fees', { state: { selectedStudent: defaulter } })}
                                className="p-2 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-800 text-green-700 dark:text-green-300 rounded-lg transition-all"
                                title="Collect Fees"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleMessageClick(defaulter)}
                                className="p-2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-lg transition-all"
                                title="Send Message"
                              >
                                <MessageSquare className="w-4 h-4" />
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
                    <AlertTriangle className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-300 text-lg font-semibold">No defaulters found</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Try adjusting your search</p>
                  </div>
                )}
              </div>
            )}

            {/* Large View */}
            {viewMode === 'large' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300">
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
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredDefaulters.map((defaulter) => (
                        <tr key={defaulter._id} className="hover:bg-red-50 dark:hover:bg-gray-700 transition-colors">
                          <td className="px-6 py-5">
                            <input
                              type="checkbox"
                              checked={selectedDefaulters.includes(defaulter._id)}
                              onChange={() => handleSelectDefaulter(defaulter._id)}
                              className="w-5 h-5 rounded border-gray-300 dark:border-gray-600"
                            />
                          </td>
                          <td className="px-6 py-5">
                            <span className="text-gray-900 dark:text-white font-bold text-lg">{defaulter.registrationNo}</span>
                          </td>
                          <td className="px-6 py-5">
                            <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-base font-semibold">
                              Class {defaulter.selectClass || defaulter.class}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full border-2 border-red-200 dark:border-red-700 overflow-hidden flex items-center justify-center">
                                {defaulter.picture?.url ? (
                                  <img 
                                    src={defaulter.picture.url} 
                                    alt={defaulter.studentName}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      // Fallback to initials if image fails to load
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display = 'flex';
                                    }}
                                  />
                                ) : null}
                                {/* Fallback initials - hidden by default when image is present */}
                                <div 
                                  className="text-white font-bold" 
                                  style={{ display: defaulter.picture?.url ? 'none' : 'flex' }}
                                >
                                  {getInitials(defaulter.studentName)}
                                </div>
                              </div>
                              <div>
                                <div className="font-bold text-gray-900 dark:text-white text-lg">{defaulter.studentName}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Guardian: {defaulter.fatherName || defaulter.guardianName || 'N/A'}</div>
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
                    <AlertTriangle className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-300 text-lg font-semibold">No defaulters found</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Try adjusting your search</p>
                  </div>
                )}
              </div>
            )}

            {/* Summary Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mt-6 no-print transition-colors duration-300">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-red-50 dark:bg-gray-900 rounded-xl border border-red-200 dark:border-gray-700">
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.totalDefaulters}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Defaulters</div>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-gray-900 rounded-xl border border-orange-200 dark:border-gray-700">
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{selectedDefaulters.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Selected</div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-gray-900 rounded-xl border border-blue-200 dark:border-gray-700">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">₹{stats.totalRequired.toFixed(2)}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Required</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-gray-900 rounded-xl border border-green-200 dark:border-gray-700">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">₹{stats.totalPaid.toFixed(2)}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Paid</div>
                </div>
                <div className="text-center p-4 bg-red-50 dark:bg-gray-900 rounded-xl border border-red-200 dark:border-gray-700">
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                    ₹{stats.totalPayable.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Payable</div>
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
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
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
            <AlertTriangle className="w-16 h-16 text-green-500 dark:text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Defaulters Found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              All students have paid their fees for {new Date(feesMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        )}

        {/* Message Box Modal */}
        {messageBox.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Send Message
                </h3>
                <button
                  onClick={handleCloseMessage}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Student Info */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full border-2 border-red-200 dark:border-red-700 overflow-hidden flex items-center justify-center">
                    {messageBox.student?.picture?.url ? (
                      <img 
                        src={messageBox.student.picture.url} 
                        alt={messageBox.student?.studentName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className="text-white font-bold" 
                      style={{ display: messageBox.student?.picture?.url ? 'none' : 'flex' }}
                    >
                      {getInitials(messageBox.student?.studentName || '')}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {messageBox.student?.studentName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {messageBox.student?.registrationNo}
                    </p>
                  </div>
                </div>
              </div>

              {/* Message Input */}
              <div className="p-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  value={messageBox.message}
                  onChange={(e) => setMessageBox(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Type your message here..."
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  rows={4}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleCloseMessage}
                  className="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendMessage}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </div>
            </div>
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