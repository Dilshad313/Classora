import React, { useState } from 'react';
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
  Users
} from 'lucide-react';

const PrintBasicList = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState('all');

  // Mock student data
  const students = [
    {
      id: 1,
      studentId: 'STU001',
      name: 'Arun P',
      fatherName: 'Prakash Kumar',
      class: 'Grade 10',
      section: 'A',
      feeRemaining: 5000,
      phone: '+91 98765 43210'
    },
    {
      id: 2,
      studentId: 'STU002',
      name: 'Priya Sharma',
      fatherName: 'Rajesh Sharma',
      class: 'Grade 10',
      section: 'B',
      feeRemaining: 0,
      phone: '+91 98765 43211'
    },
    {
      id: 3,
      studentId: 'STU003',
      name: 'Rahul Kumar',
      fatherName: 'Vijay Kumar',
      class: 'Grade 11',
      section: 'A',
      feeRemaining: 3500,
      phone: '+91 98765 43212'
    },
    {
      id: 4,
      studentId: 'STU004',
      name: 'Sneha Patel',
      fatherName: 'Amit Patel',
      class: 'Grade 9',
      section: 'A',
      feeRemaining: 2000,
      phone: '+91 98765 43213'
    },
    {
      id: 5,
      studentId: 'STU005',
      name: 'Amit Verma',
      fatherName: 'Suresh Verma',
      class: 'Grade 10',
      section: 'C',
      feeRemaining: 0,
      phone: '+91 98765 43214'
    },
    {
      id: 6,
      studentId: 'STU006',
      name: 'Neha Singh',
      fatherName: 'Ravi Singh',
      class: 'Grade 11',
      section: 'B',
      feeRemaining: 4500,
      phone: '+91 98765 43215'
    },
    {
      id: 7,
      studentId: 'STU007',
      name: 'Karan Mehta',
      fatherName: 'Ashok Mehta',
      class: 'Grade 9',
      section: 'B',
      feeRemaining: 1500,
      phone: '+91 98765 43216'
    },
    {
      id: 8,
      studentId: 'STU008',
      name: 'Divya Reddy',
      fatherName: 'Mohan Reddy',
      class: 'Grade 10',
      section: 'A',
      feeRemaining: 0,
      phone: '+91 98765 43217'
    }
  ];

  // Get unique classes
  const classes = [...new Set(students.map(s => s.class))].sort();

  // Filter students by selected class
  const filteredStudents = selectedClass === 'all' 
    ? students 
    : students.filter(s => s.class === selectedClass);

  // Copy to clipboard
  const handleCopy = () => {
    const headers = ['Student ID', 'Student Name', 'Father\'s Name', 'Class', 'Fee Remaining', 'Phone Number'];
    const rows = filteredStudents.map(s => [
      s.studentId,
      s.name,
      s.fatherName,
      `${s.class} - ${s.section}`,
      `₹${s.feeRemaining}`,
      s.phone
    ]);
    
    const text = [headers, ...rows].map(row => row.join('\t')).join('\n');
    navigator.clipboard.writeText(text);
    alert('Table data copied to clipboard!');
  };

  // Export to CSV
  const handleCSV = () => {
    const headers = ['Student ID', 'Student Name', 'Father\'s Name', 'Class', 'Fee Remaining', 'Phone Number'];
    const rows = filteredStudents.map(s => [
      s.studentId,
      s.name,
      s.fatherName,
      `${s.class} - ${s.section}`,
      s.feeRemaining,
      s.phone
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `students_list_${selectedClass}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Export to Excel (using HTML table method)
  const handleExcel = () => {
    const headers = ['Student ID', 'Student Name', 'Father\'s Name', 'Class', 'Fee Remaining', 'Phone Number'];
    const rows = filteredStudents.map(s => [
      s.studentId,
      s.name,
      s.fatherName,
      `${s.class} - ${s.section}`,
      `₹${s.feeRemaining}`,
      s.phone
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
  };

  // Export to PDF (simple text-based PDF)
  const handlePDF = () => {
    window.print();
  };

  // Print
  const handlePrint = () => {
    window.print();
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
                  <option key={cls} value={cls}>{cls}</option>
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

        {/* Students Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Table Header - Print Only */}
          <div className="hidden print:block p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">CLASSORA INSTITUTE</h2>
            <h3 className="text-xl font-semibold text-gray-700 text-center mb-1">Student Basic List</h3>
            <p className="text-sm text-gray-600 text-center">
              {selectedClass === 'all' ? 'All Classes' : selectedClass} - Generated on {new Date().toLocaleDateString()}
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
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student, index) => (
                    <tr 
                      key={student.id} 
                      className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{student.studentId}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{student.fatherName}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.class} - {student.section}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`font-bold ${student.feeRemaining > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          ₹{student.feeRemaining.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 font-mono">{student.phone}</td>
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
          {filteredStudents.length > 0 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <p className="text-sm font-semibold text-gray-700">
                  Total Students: <span className="text-blue-600 text-lg">{filteredStudents.length}</span>
                </p>
                <p className="text-sm font-semibold text-gray-700">
                  Total Fee Remaining: <span className="text-red-600 text-lg">
                    ₹{filteredStudents.reduce((sum, s) => sum + s.feeRemaining, 0).toLocaleString()}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
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
