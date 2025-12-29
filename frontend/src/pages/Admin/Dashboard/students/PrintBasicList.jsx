import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home,
  ChevronRight,
  Copy,
  FileSpreadsheet,
  FileText,
  Printer,
  Download,
  Filter,
  Users,
  Loader,
  RefreshCw
} from 'lucide-react';
import { getBasicList } from '../../../../services/studentApi';
import { classApi } from '../../../../services/classApi';
import toast from 'react-hot-toast';

const PrintBasicList = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState('all');
  const [students, setStudents] = useState([]);
  const [summary, setSummary] = useState({ totalStudents: 0, totalFeeRemaining: 0 });
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);

  useEffect(() => {
    fetchBasicList();
  }, [selectedClass]);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoadingClasses(true);
      const data = await classApi.getAllClassNames();
      setClasses(data || []);
    } catch (error) {
      console.error('Failed to load classes', error);
      toast.error('Failed to load classes');
      setClasses([]);
    } finally {
      setLoadingClasses(false);
    }
  };

  const fetchBasicList = async () => {
    try {
      setLoading(true);
      const filters = {
        class: selectedClass !== 'all' ? selectedClass : undefined
      };
      
      const data = await getBasicList(filters);
      setStudents(data.students || []);
      setSummary(data.summary || { totalStudents: 0, totalFeeRemaining: 0 });
    } catch (error) {
      console.error('Failed to load student list', error);
      toast.error('Failed to load student list');
      setStudents([]);
      setSummary({ totalStudents: 0, totalFeeRemaining: 0 });
    } finally {
      setLoading(false);
    }
  };

  // Copy to clipboard
  const handleCopy = () => {
    const headers = ['Student ID', 'Student Name', 'Father\'s Name', 'Class', 'Fee Remaining', 'Phone Number'];
    const rows = students.map(s => [
      s.registrationNo,
      s.studentName,
      s.fatherName || 'N/A',
      `Class ${s.selectClass} - ${s.section}`,
      `₹${s.feeRemaining || 0}`,
      s.mobileNo || 'N/A'
    ]);
    
    const text = [headers, ...rows].map(row => row.join('\t')).join('\n');
    navigator.clipboard.writeText(text);
    toast.success('Table data copied to clipboard!');
  };

  // Export to CSV
  const handleCSV = () => {
    const headers = ['Student ID', 'Student Name', 'Father\'s Name', 'Class', 'Fee Remaining', 'Phone Number'];
    const rows = students.map(s => [
      s.registrationNo,
      s.studentName,
      s.fatherName || '',
      `Class ${s.selectClass} - ${s.section}`,
      s.feeRemaining || 0,
      s.mobileNo || ''
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `students_list_${selectedClass}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success('CSV exported successfully!');
  };

  // Export to Excel (using HTML table method)
  const handleExcel = () => {
    const headers = ['Student ID', 'Student Name', 'Father\'s Name', 'Class', 'Fee Remaining', 'Phone Number'];
    const rows = students.map(s => [
      s.registrationNo,
      s.studentName,
      s.fatherName || 'N/A',
      `Class ${s.selectClass} - ${s.section}`,
      `₹${s.feeRemaining || 0}`,
      s.mobileNo || 'N/A'
    ]);
    
    let tableHTML = '<table border="1"><thead><tr>';
    headers.forEach(header => {
      tableHTML += `<th>${header}</th>`;
    });
    tableHTML += '</tr></thead><tbody>';
    
    rows.forEach(row => {
      tableHTML += '<tr>';
      row.forEach(cell => {
        tableHTML += `<td>${cell}</td>`;
      });
      tableHTML += '</tr>';
    });
    tableHTML += '</tbody></table>';
    
    const blob = new Blob([tableHTML], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `students_list_${selectedClass}_${new Date().toISOString().split('T')[0]}.xls`;
    link.click();
    toast.success('Excel file exported successfully!');
  };

  // Export to PDF (simple text-based PDF)
  const handlePDF = () => {
    window.print();
    toast.success('PDF generated successfully!');
  };

  // Print
  const handlePrint = () => {
    window.print();
  };

  const handleRefresh = () => {
    fetchBasicList();
    toast.success('List refreshed');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 mb-6 text-sm print:hidden">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span className="text-blue-600 dark:text-blue-400 font-semibold">Students</span>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span className="text-gray-900 dark:text-gray-100 font-semibold">Print Basic List</span>
        </div>

        {/* Header */}
        <div className="mb-8 print:hidden">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Print Basic List</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">View and export student information</p>
            </div>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-600 transition-all font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Filter and Export Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6 print:hidden transition-colors duration-300">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Class Filter */}
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Filter by Class:</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                disabled={loadingClasses}
                className="px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium min-w-[200px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="all" className="dark:bg-gray-800">All Classes</option>
                {classes.map((cls) => (
                  <option key={cls} value={cls} className="dark:bg-gray-800">Class {cls}</option>
                ))}
              </select>
              {loadingClasses && (
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>

            {/* Export Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-xl transition-all font-medium shadow-lg hover:shadow-xl"
              >
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </button>
              <button
                onClick={handleCSV}
                className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white rounded-xl transition-all font-medium shadow-lg hover:shadow-xl"
              >
                <FileText className="w-4 h-4" />
                <span>CSV</span>
              </button>
              <button
                onClick={handleExcel}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-xl transition-all font-medium shadow-lg hover:shadow-xl"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Excel</span>
              </button>
              <button
                onClick={handlePDF}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white rounded-xl transition-all font-medium shadow-lg hover:shadow-xl"
              >
                <Download className="w-4 h-4" />
                <span>PDF</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-xl transition-all font-medium shadow-lg hover:shadow-xl"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
          </div>
        )}

        {/* Classes Loading State */}
        {loadingClasses && !loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <Loader className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading classes...</p>
            </div>
          </div>
        )}

        {/* Students Table */}
        {!loading && !loadingClasses && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300">
            {/* Table Header - Print Only */}
            <div className="hidden print:block p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">CLASSORA INSTITUTE</h2>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 text-center mb-1">Student Basic List</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                {selectedClass === 'all' ? 'All Classes' : `Class ${selectedClass}`} - Generated on {new Date().toLocaleDateString()}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Student ID</th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Student Name</th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Father's Name</th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Class</th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Fee Remaining</th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Phone Number</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {students.length > 0 ? (
                    students.map((student, index) => (
                      <tr 
                        key={student._id} 
                        className={`hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors ${
                          index % 2 === 0 
                            ? 'bg-white dark:bg-gray-800' 
                            : 'bg-gray-50 dark:bg-gray-900'
                        }`}
                      >
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">{student.registrationNo}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{student.studentName}</td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{student.fatherName || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">Class {student.selectClass} - {student.section}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`font-bold ${(student.feeRemaining || 0) > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                            ₹{(student.feeRemaining || 0).toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 font-mono">{student.mobileNo || 'N/A'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <Users className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
                          <p className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No students found</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Try selecting a different class</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer with Summary */}
            {students.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Total Students: <span className="text-blue-600 dark:text-blue-400 text-lg">{summary.totalStudents}</span>
                  </p>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Total Fee Remaining: <span className="text-red-600 dark:text-red-400 text-lg">
                      ₹{summary.totalFeeRemaining.toLocaleString()}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!loading && !loadingClasses && students.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No Students Found</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto text-lg">
              No students found in the selected class
            </p>
          </div>
        )}
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:block {
            display: block !important;
          }
          @page {
            size: A4 landscape;
            margin: 1cm;
          }
          table {
            page-break-inside: auto;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default PrintBasicList;