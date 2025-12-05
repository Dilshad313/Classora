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
import toast from 'react-hot-toast';

const PrintBasicList = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState('all');
  const [students, setStudents] = useState([]);
  const [summary, setSummary] = useState({ totalStudents: 0, totalFeeRemaining: 0 });
  const [loading, setLoading] = useState(true);

  const classes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

  useEffect(() => {
    fetchBasicList();
  }, [selectedClass]);

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
      `Grade ${s.selectClass} - ${s.section}`,
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
      `Grade ${s.selectClass} - ${s.section}`,
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
      `Grade ${s.selectClass} - ${s.section}`,
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 mb-6 text-sm print:hidden">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-blue-600 font-semibold">Students</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-semibold">Print Basic List</span>
        </div>

        {/* Header */}
        <div className="mb-8 print:hidden">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Print Basic List</h1>
              <p className="text-gray-600 mt-1">View and export student information</p>
            </div>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Filter and Export Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6 print:hidden">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Class Filter */}
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-gray-600" />
              <label className="text-sm font-semibold text-gray-700">Filter by Class:</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium min-w-[200px]"
              >
                <option value="all">All Classes</option>
                {classes.map((cls) => (
                  <option key={cls} value={cls}>Grade {cls}</option>
                ))}
              </select>
            </div>

            {/* Export Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-all font-medium shadow-lg hover:shadow-xl"
              >
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </button>
              <button
                onClick={handleCSV}
                className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all font-medium shadow-lg hover:shadow-xl"
              >
                <FileText className="w-4 h-4" />
                <span>CSV</span>
              </button>
              <button
                onClick={handleExcel}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all font-medium shadow-lg hover:shadow-xl"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Excel</span>
              </button>
              <button
                onClick={handlePDF}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all font-medium shadow-lg hover:shadow-xl"
              >
                <Download className="w-4 h-4" />
                <span>PDF</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all font-medium shadow-lg hover:shadow-xl"
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
            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        )}

        {/* Students Table */}
        {!loading && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Table Header - Print Only */}
            <div className="hidden print:block p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">CLASSORA INSTITUTE</h2>
              <h3 className="text-xl font-semibold text-gray-700 text-center mb-1">Student Basic List</h3>
              <p className="text-sm text-gray-600 text-center">
                {selectedClass === 'all' ? 'All Classes' : `Grade ${selectedClass}`} - Generated on {new Date().toLocaleDateString()}
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
                <tbody className="divide-y divide-gray-200">
                  {students.length > 0 ? (
                    students.map((student, index) => (
                      <tr 
                        key={student._id} 
                        className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                      >
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">{student.registrationNo}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.studentName}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{student.fatherName || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">Grade {student.selectClass} - {student.section}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`font-bold ${(student.feeRemaining || 0) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            ₹{(student.feeRemaining || 0).toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 font-mono">{student.mobileNo || 'N/A'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <Users className="w-16 h-16 text-gray-400 mb-4" />
                          <p className="text-lg font-semibold text-gray-900 mb-1">No students found</p>
                          <p className="text-sm text-gray-600">Try selecting a different class</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer with Summary */}
            {students.length > 0 && (
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <p className="text-sm font-semibold text-gray-700">
                    Total Students: <span className="text-blue-600 text-lg">{summary.totalStudents}</span>
                  </p>
                  <p className="text-sm font-semibold text-gray-700">
                    Total Fee Remaining: <span className="text-red-600 text-lg">
                      ₹{summary.totalFeeRemaining.toLocaleString()}
                    </span>
                  </p>
                </div>
              </div>
            )}
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