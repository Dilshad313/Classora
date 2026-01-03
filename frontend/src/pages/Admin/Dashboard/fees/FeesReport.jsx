import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, ChevronRight, BarChart3, TrendingUp, TrendingDown, DollarSign, Users, Calendar,
  Printer, Download, CheckCircle, Clock, PieChart, Activity, CreditCard, Wallet, Target, Award, FileText, Loader, FileSpreadsheet, Copy
} from 'lucide-react';
import * as feesApi from '../../../../services/feesApi';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';


const FeesReport = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  // Load report data when filters change
  useEffect(() => {
    loadReportData();
  }, [selectedPeriod, selectedMonth, selectedYear, startDate, endDate]);

  const loadReportData = async () => {
    try {
      setLoading(true);
      
      const filters = {
        period: selectedPeriod
      };

      if (selectedPeriod === 'month') {
        filters.month = selectedMonth;
        filters.year = new Date(selectedMonth).getFullYear();
      } else if (selectedPeriod === 'year') {
        filters.year = selectedYear;
      } else if (selectedPeriod === 'custom' && startDate && endDate) {
        filters.startDate = startDate;
        filters.endDate = endDate;
      }

      const response = await feesApi.getFeesReport(filters);
      setReportData(response);
    } catch (error) {
      console.error('Error loading report data:', error);
      toast.error('Failed to load fees report');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format currency in thousands (K)
  const formatCurrency = (amount, decimals = 1) => {
    if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(decimals)}K`;
    }
    return `₹${amount.toFixed(0)}`;
  };

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      // Add header
      doc.setFontSize(18);
      doc.setFont(undefined, 'bold');
      doc.text('Fees Report & Analytics', 14, 15);
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(`Period: ${getPeriodLabel()}`, 14, 22);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);

      // Overall Stats
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Overall Statistics', 14, 40);
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(`Total Collected: ${formatCurrency(overallStats.totalCollected)}`, 14, 48);
      doc.text(`Total Pending: ${formatCurrency(overallStats.totalPending)}`, 14, 54);
      doc.text(`Collection Rate: ${overallStats.collectionRate}%`, 14, 60);
      doc.text(`Total Students: ${overallStats.totalStudents}`, 80, 48);
      doc.text(`Paid Students: ${overallStats.paidStudents}`, 80, 54);
      doc.text(`Defaulters: ${overallStats.totalDefaulters}`, 80, 60);

      // Class-wise data table
      if (classWiseData.length > 0) {
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('Class-wise Collection', 14, 72);

        const classHeaders = [
          { header: 'Class', dataKey: 'class' },
          { header: 'Students', dataKey: 'students' },
          { header: 'Collected', dataKey: 'collected' },
          { header: 'Pending', dataKey: 'pending' },
          { header: 'Rate %', dataKey: 'percentage' }
        ];

        const classTableData = classWiseData.map(item => ({
          class: item.class,
          students: item.students,
          collected: formatCurrency(item.collected),
          pending: formatCurrency(item.pending),
          percentage: `${item.percentage}%`
        }));

        doc.autoTable({
          columns: classHeaders,
          body: classTableData,
          startY: 76,
          styles: { fontSize: 8, cellPadding: 2 },
          headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [245, 245, 245] }
        });
      }

      // Recent transactions
      if (recentTransactions.length > 0) {
        const transY = doc.previousAutoTable ? doc.previousAutoTable.finalY + 10 : 115;
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('Recent Transactions', 14, transY);

        const transHeaders = [
          { header: 'Student', dataKey: 'student' },
          { header: 'Class', dataKey: 'class' },
          { header: 'Amount', dataKey: 'amount' },
          { header: 'Date', dataKey: 'date' },
          { header: 'Method', dataKey: 'method' }
        ];

        const transTableData = recentTransactions.map(t => ({
          student: t.student?.studentName || t.studentName,
          class: t.class,
          amount: formatCurrency(t.amount, 0),
          date: new Date(t.paymentDate).toLocaleDateString(),
          method: t.depositType
        }));

        doc.autoTable({
          columns: transHeaders,
          body: transTableData,
          startY: transY + 4,
          styles: { fontSize: 8, cellPadding: 2 },
          headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [245, 245, 245] }
        });
      }

      doc.save(`fees-report-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('PDF exported successfully');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to export PDF: ' + error.message);
    }
  };

  const handleExportCSV = () => {
    const toastId = toast.loading('Generating CSV file...');
    try {
      const csvData = [];
      
      // Headers
      csvData.push(['Fees Report']);
      csvData.push([`Period: ${getPeriodLabel()}`]);
      csvData.push([`Generated: ${new Date().toLocaleString()}`]);
      csvData.push([]);
      
      // Overall Stats
      csvData.push(['Overall Statistics']);
      csvData.push(['Metric', 'Value']);
      csvData.push(['Total Collected', overallStats.totalCollected]);
      csvData.push(['Total Pending', overallStats.totalPending]);
      csvData.push(['Collection Rate', `${overallStats.collectionRate}%`]);
      csvData.push(['Total Students', overallStats.totalStudents]);
      csvData.push(['Paid Students', overallStats.paidStudents]);
      csvData.push(['Defaulters', overallStats.totalDefaulters]);
      csvData.push([]);
      
      // Class-wise Data
      if (classWiseData.length > 0) {
        csvData.push(['Class-wise Collection']);
        csvData.push(['Class', 'Students', 'Collected', 'Pending', 'Collection %']);
        classWiseData.forEach(item => {
          csvData.push([
            item.class,
            item.students,
            item.collected,
            item.pending,
            `${item.percentage}%`
          ]);
        });
        csvData.push([]);
      }
      
      // Payment Methods
      if (paymentMethods.length > 0) {
        csvData.push(['Payment Methods']);
        csvData.push(['Method', 'Amount', 'Percentage']);
        paymentMethods.forEach(method => {
          csvData.push([
            method._id,
            method.amount,
            `${method.percentage}%`
          ]);
        });
      }

      const csvString = csvData.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `fees-report-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('CSV exported successfully', { id: toastId });
    } catch (error) {
      console.error('CSV export error:', error);
      toast.error('Failed to export CSV', { id: toastId });
    }
  };

  const escapeXml = (unsafe) => {
    if (unsafe === null || unsafe === undefined) {
        return '';
    }
    return unsafe.toString().replace(/[<>&'"]/g, (c) => {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
    });
  };

  const handleExportXLSX = () => {
    const toastId = toast.loading('Generating XLSX file...');
    try {
      const data = [];
      
      // Headers
      data.push(['Fees Report']);
      data.push([`Period: ${getPeriodLabel()}`]);
      data.push([`Generated: ${new Date().toLocaleString()}`]);
      data.push([]);
      
      // Overall Stats
      data.push(['Overall Statistics']);
      data.push(['Metric', 'Value']);
      data.push(['Total Collected', overallStats.totalCollected]);
      data.push(['Total Pending', overallStats.totalPending]);
      data.push(['Collection Rate', `${overallStats.collectionRate}%`]);
      data.push(['Total Students', overallStats.totalStudents]);
      data.push(['Paid Students', overallStats.paidStudents]);
      data.push(['Defaulters', overallStats.totalDefaulters]);
      data.push([]);
      
      // Class-wise Data
      if (classWiseData.length > 0) {
        data.push(['Class-wise Collection']);
        data.push(['Class', 'Students', 'Collected', 'Pending', 'Collection %']);
        classWiseData.forEach(item => {
          data.push([
            item.class,
            item.students,
            item.collected,
            item.pending,
            `${item.percentage}%`
          ]);
        });
        data.push([]);
      }
      
      // Payment Methods
      if (paymentMethods.length > 0) {
        data.push(['Payment Methods']);
        data.push(['Method', 'Amount', 'Percentage']);
        paymentMethods.forEach(method => {
          data.push([
            method._id,
            method.amount,
            `${method.percentage}%`
          ]);
        });
      }

      const xlsxContent = `<?xml version="1.0" encoding="UTF-8"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:x="urn:schemas-microsoft-com:office:excel"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:html="http://www.w3.org/TR/REC-html40">
  <Worksheet ss:Name="Fees Report">
    <Table>
      ${data.map(row => `<Row>${row.map(cell => {
        const type = typeof cell === 'number' ? 'Number' : 'String';
        return `<Cell><Data ss:Type="${type}">${escapeXml(cell)}</Data></Cell>`;
      }).join('')}</Row>`).join('')}
    </Table>
  </Worksheet>
</Workbook>`;

      const blob = new Blob([xlsxContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `fees-report-${new Date().toISOString().split('T')[0]}.xls`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('XLSX exported successfully', { id: toastId });
    } catch (error) {
      console.error('XLSX export error:', error);
      toast.error(`Failed to export XLSX: ${error.message}`, { id: toastId });
    }
  };

  const handleCopyData = () => {
    try {
      let textData = `FEES REPORT\n`;
      textData += `Period: ${getPeriodLabel()}\n\n`;
      textData += `OVERALL STATISTICS\n`;
      textData += `Total Collected: ${formatCurrency(overallStats.totalCollected)}\n`;
      textData += `Total Pending: ${formatCurrency(overallStats.totalPending)}\n`;
      textData += `Collection Rate: ${overallStats.collectionRate}%\n`;
      textData += `Total Students: ${overallStats.totalStudents}\n`;
      textData += `Paid Students: ${overallStats.paidStudents}\n`;
      textData += `Defaulters: ${overallStats.totalDefaulters}\n\n`;

      if (classWiseData.length > 0) {
        textData += `CLASS-WISE COLLECTION\n`;
        classWiseData.forEach(item => {
          textData += `${item.class}: ${item.students} students, Collected: ${formatCurrency(item.collected)}, Pending: ${formatCurrency(item.pending)}, Rate: ${item.percentage}%\n`;
        });
      }

      navigator.clipboard.writeText(textData);
      toast.success('Data copied to clipboard');
    } catch (error) {
      console.error('Copy error:', error);
      toast.error('Failed to copy data');
    }
  };

  const getPeriodLabel = () => {
    if (selectedPeriod === 'month') {
      return new Date(selectedMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } else if (selectedPeriod === 'year') {
      return selectedYear;
    } else if (selectedPeriod === 'custom' && startDate && endDate) {
      return `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`;
    } else if (selectedPeriod === 'quarter') {
      const now = new Date();
      const quarter = Math.floor(now.getMonth() / 3) + 1;
      return `Q${quarter} ${now.getFullYear()}`;
    }
    return 'Current Month';
  };

  const overallStats = reportData?.overallStats || {
    totalCollected: 0, totalPending: 0, totalDefaulters: 0, collectionRate: 0,
    totalStudents: 0, paidStudents: 0, averageFeePerStudent: 0
  };

  const monthlyData = reportData?.monthlyData || [];
  const classWiseData = reportData?.classWiseData || [];
  const paymentMethods = reportData?.paymentMethods || [];
  const feeCategories = reportData?.feeCategories || [];
  const recentTransactions = reportData?.recentTransactions || [];

  const maxCollected = monthlyData.length > 0 ? Math.max(...monthlyData.map(d => d.collected)) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-6 text-sm no-print">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
            <Home className="w-4 h-4" /><span>Dashboard</span>
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span className="text-blue-600 dark:text-blue-400 font-semibold">Fees</span>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span className="text-gray-900 dark:text-gray-100 font-semibold">Fees Report</span>
        </div>

        <div className="mb-8 no-print">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Fees Report & Analytics</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">Comprehensive overview of fee collection and insights</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleCopyData} className="px-5 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                <Copy className="w-5 h-5" />Copy
              </button>
              <button onClick={handleExportCSV} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                <FileText className="w-5 h-5" />CSV
              </button>
              <button onClick={handleExportXLSX} className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5" />XLSX
              </button>
              <button onClick={handleExportPDF} className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                <Download className="w-5 h-5" />PDF
              </button>
              <button onClick={() => window.print()} className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                <Printer className="w-5 h-5" />Print
              </button>
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading report data...</span>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6 no-print transition-colors duration-300">
          <div className="flex items-center gap-4 flex-wrap">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Report Period:</label>
            <div className="flex gap-2">
              {['month', 'quarter', 'year', 'custom'].map(period => (
                <button 
                  key={period} 
                  onClick={() => setSelectedPeriod(period)} 
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedPeriod === period 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
            
            {selectedPeriod === 'month' && (
              <>
                <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mx-2"></div>
                <input 
                  type="month" 
                  value={selectedMonth} 
                  onChange={(e) => setSelectedMonth(e.target.value)} 
                  className="px-4 py-2 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
                />
              </>
            )}
            
            {selectedPeriod === 'year' && (
              <>
                <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mx-2"></div>
                <select 
                  value={selectedYear} 
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-4 py-2 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                >
                  {[2022, 2023, 2024, 2025, 2026].map(year => (
                    <option key={year} value={year} className="dark:bg-gray-800">{year}</option>
                  ))}
                </select>
              </>
            )}
            
            {selectedPeriod === 'custom' && (
              <>
                <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mx-2"></div>
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)} 
                  placeholder="Start Date"
                  className="px-4 py-2 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
                />
                <span className="text-gray-500 dark:text-gray-400">to</span>
                <input 
                  type="date" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)} 
                  placeholder="End Date"
                  className="px-4 py-2 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
                />
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-sm bg-white/20 px-3 py-1 rounded-full">
                <TrendingUp className="w-4 h-4" />
                <span>{overallStats.totalStudents > 0 ? ((overallStats.paidStudents / overallStats.totalStudents) * 100).toFixed(1) : 0}%</span>
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">
              {formatCurrency(overallStats.totalCollected)}
            </div>
            <div className="text-green-100 text-sm font-medium">Total Collected</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-sm bg-white/20 px-3 py-1 rounded-full">
                <TrendingDown className="w-4 h-4" />
                <span>{overallStats.totalDefaulters}</span>
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">
              {formatCurrency(overallStats.totalPending)}
            </div>
            <div className="text-orange-100 text-sm font-medium">Total Pending</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-sm bg-white/20 px-3 py-1 rounded-full">
                <TrendingUp className="w-4 h-4" />
                <span>{overallStats.paidStudents}/{overallStats.totalStudents}</span>
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{overallStats.collectionRate}%</div>
            <div className="text-blue-100 text-sm font-medium">Collection Rate</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-sm bg-white/20 px-3 py-1 rounded-full">
                <CheckCircle className="w-4 h-4" />
                <span>{overallStats.paidStudents}</span>
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{overallStats.totalStudents}</div>
            <div className="text-purple-100 text-sm font-medium">Total Students</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />Monthly Collection Trend
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Collected vs Target comparison</p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-indigo-600 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">Collected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">Target</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {monthlyData.length > 0 ? monthlyData.map((data, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-12 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {new Date(data.month).toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                  <div className="flex-1 relative h-10 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <div 
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg transition-all duration-500 flex items-center justify-end pr-3" 
                      style={{ width: `${maxCollected > 0 ? (data.collected / maxCollected) * 100 : 0}%` }}
                    >
                      <span className="text-white text-xs font-bold">
                        {formatCurrency(data.collected)}
                      </span>
                    </div>
                    <div 
                      className="absolute inset-y-0 left-0 border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-lg pointer-events-none" 
                      style={{ width: `${maxCollected > 0 ? (data.target / maxCollected) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <div className="w-20 text-right">
                    {data.collected >= data.target ? (
                      <span className="text-green-600 dark:text-green-400 text-sm font-semibold flex items-center justify-end gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {data.target > 0 ? ((data.collected / data.target) * 100 - 100).toFixed(1) : 0}%
                      </span>
                    ) : (
                      <span className="text-orange-600 dark:text-orange-400 text-sm font-semibold flex items-center justify-end gap-1">
                        <TrendingDown className="w-4 h-4" />
                        {data.target > 0 ? ((data.collected / data.target) * 100 - 100).toFixed(1) : 0}%
                      </span>
                    )}
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No monthly data available
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />Payment Methods
            </h2>
            <div className="space-y-4">
              {paymentMethods.length > 0 ? paymentMethods.map((method, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 capitalize">{method._id}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{method.percentage?.toFixed(1)}%</span>
                  </div>
                  <div className="relative h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`absolute inset-y-0 left-0 bg-indigo-500 rounded-full transition-all duration-500`} 
                      style={{ width: `${method.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {formatCurrency(method.amount)}
                  </div>
                </div>
              )) : (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                  No payment data
                </div>
              )}
            </div>
            {paymentMethods.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Total</span>
                  <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                    {formatCurrency(paymentMethods.reduce((sum, m) => sum + m.amount, 0))}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6 transition-colors duration-300">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />Class-wise Fee Collection
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-bold">Class</th>
                  <th className="px-6 py-4 text-center font-bold">Students</th>
                  <th className="px-6 py-4 text-right font-bold">Collected</th>
                  <th className="px-6 py-4 text-right font-bold">Pending</th>
                  <th className="px-6 py-4 text-center font-bold">Collection %</th>
                  <th className="px-6 py-4 text-left font-bold">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {classWiseData.length > 0 ? classWiseData.map((classData, index) => (
                  <tr key={index} className="hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900 dark:text-white">{classData.class}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                        {classData.students}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-green-600 dark:text-green-400 font-bold">
                        {formatCurrency(classData.collected)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-orange-600 dark:text-orange-400 font-bold">
                        {formatCurrency(classData.pending)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                        classData.percentage >= 85 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                      }`}>
                        {Number(classData.percentage).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden w-32">
                        <div 
                          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                            classData.percentage >= 85 ? 'bg-green-500' : 'bg-yellow-500'
                          }`} 
                          style={{ width: `${Math.min(classData.percentage, 100)}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      No class-wise data available
                    </td>
                  </tr>
                )}
              </tbody>
              {classWiseData.length > 0 && (
                <tfoot className="bg-indigo-50 dark:bg-gray-900 border-t-2 border-indigo-200 dark:border-gray-700">
                  <tr>
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">Total</td>
                    <td className="px-6 py-4 text-center font-bold text-gray-900 dark:text-white">
                      {classWiseData.reduce((sum, c) => sum + c.students, 0)}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(classWiseData.reduce((sum, c) => sum + c.collected, 0))}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-orange-600 dark:text-orange-400">
                      {formatCurrency(classWiseData.reduce((sum, c) => sum + c.pending, 0))}
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-indigo-600 dark:text-indigo-400">
                      {classWiseData.length > 0 ? 
                        (classWiseData.reduce((sum, c) => sum + parseFloat(c.percentage), 0) / classWiseData.length).toFixed(1) 
                        : 0}%
                    </td>
                    <td className="px-6 py-4"></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />Fee Categories Breakdown
            </h2>
            <div className="space-y-4">
              {feeCategories.length > 0 ? feeCategories.map((category, index) => (
                <div key={index} className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{category._id}</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {formatCurrency(category.amount)}
                    </span>
                  </div>
                  <div className="relative h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500" 
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-600 dark:text-gray-400">{category.percentage?.toFixed(1)}% of total</span>
                    <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                      ₹{overallStats.totalStudents > 0 ? (category.amount / overallStats.totalStudents).toFixed(0) : 0}/student
                    </span>
                  </div>
                </div>
              )) : (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                  No category data
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />Recent Transactions
            </h2>
            <div className="space-y-3">
              {recentTransactions.length > 0 ? recentTransactions.map((transaction) => (
                <div key={transaction._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 dark:text-white text-sm">
                      {transaction.student?.studentName || transaction.studentName}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                      {transaction.class} • {new Date(transaction.paymentDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900 dark:text-white">₹{transaction.amount.toLocaleString()}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">{transaction.depositType}</span>
                      {transaction.status === 'completed' ? 
                        <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" /> : 
                        <Clock className="w-3 h-3 text-orange-600 dark:text-orange-400" />
                      }
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                  No recent transactions
                </div>
              )}
            </div>
            <button 
              onClick={() => navigate('/dashboard/fees/collect-fees')} 
              className="w-full mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all"
            >
              View All Transactions
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg">Collection Efficiency</h3>
            </div>
            <div className="text-4xl font-bold mb-2">{overallStats.collectionRate}%</div>
            <p className="text-cyan-100 text-sm">
              {overallStats.paidStudents} out of {overallStats.totalStudents} students paid
            </p>
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex items-center justify-between text-sm">
                <span>Coverage</span>
                <span className="font-semibold">{overallStats.totalStudents > 0 ? ((overallStats.paidStudents / overallStats.totalStudents) * 100).toFixed(1) : 0}%</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg">Avg Fee/Student</h3>
            </div>
            <div className="text-4xl font-bold mb-2">₹{overallStats.averageFeePerStudent.toLocaleString()}</div>
            <p className="text-violet-100 text-sm">Per student average fee</p>
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex items-center justify-between text-sm">
                <span>Total collected</span>
                <span className="font-semibold">{formatCurrency(overallStats.totalCollected)}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg">Defaulters</h3>
            </div>
            <div className="text-4xl font-bold mb-2">{overallStats.totalDefaulters}</div>
            <p className="text-pink-100 text-sm">Students with pending fees</p>
            <div className="mt-4 pt-4 border-t border-white/20">
              <button 
                onClick={() => navigate('/dashboard/fees/defaulters')} 
                className="text-sm font-semibold hover:underline"
              >
                View Details →
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media print { 
          .no-print { display: none !important; } 
          body { background: white !important; } 
        }
      `}</style>
    </div>
  );
};

export default FeesReport;