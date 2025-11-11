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
  Search,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  Users,
  Lock
} from 'lucide-react';

const ManageLogin = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState({});

  // Mock student login data
  const students = [
    {
      id: 1,
      studentId: 'STU001',
      name: 'Arun P',
      class: 'Grade 10',
      section: 'A',
      username: 'arun.p',
      password: 'Arun@2024'
    },
    {
      id: 2,
      studentId: 'STU002',
      name: 'Priya Sharma',
      class: 'Grade 10',
      section: 'B',
      username: 'priya.sharma',
      password: 'Priya@2024'
    },
    {
      id: 3,
      studentId: 'STU003',
      name: 'Rahul Kumar',
      class: 'Grade 11',
      section: 'A',
      username: 'rahul.kumar',
      password: 'Rahul@2024'
    },
    {
      id: 4,
      studentId: 'STU004',
      name: 'Sneha Patel',
      class: 'Grade 9',
      section: 'A',
      username: 'sneha.patel',
      password: 'Sneha@2024'
    },
    {
      id: 5,
      studentId: 'STU005',
      name: 'Amit Verma',
      class: 'Grade 10',
      section: 'C',
      username: 'amit.verma',
      password: 'Amit@2024'
    },
    {
      id: 6,
      studentId: 'STU006',
      name: 'Neha Singh',
      class: 'Grade 11',
      section: 'B',
      username: 'neha.singh',
      password: 'Neha@2024'
    },
    {
      id: 7,
      studentId: 'STU007',
      name: 'Karan Mehta',
      class: 'Grade 9',
      section: 'B',
      username: 'karan.mehta',
      password: 'Karan@2024'
    },
    {
      id: 8,
      studentId: 'STU008',
      name: 'Divya Reddy',
      class: 'Grade 10',
      section: 'A',
      username: 'divya.reddy',
      password: 'Divya@2024'
    }
  ];

  // Get unique classes
  const classes = [...new Set(students.map(s => s.class))].sort();

  // Filter students by search term and selected class
  const filteredStudents = students.filter(student => {
    const matchesSearch = searchTerm === '' || 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = selectedClass === 'all' || student.class === selectedClass;
    
    return matchesSearch && matchesClass;
  });

  // Toggle password visibility
  const togglePasswordVisibility = (id) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Copy to clipboard
  const handleCopy = () => {
    const headers = ['ID', 'Student Name', 'Class', 'Username', 'Password'];
    const rows = filteredStudents.map(s => [
      s.studentId,
      s.name,
      `${s.class} - ${s.section}`,
      s.username,
      s.password
    ]);
    
    const text = [headers, ...rows].map(row => row.join('\t')).join('\n');
    navigator.clipboard.writeText(text);
    alert('Login credentials copied to clipboard!');
  };

  // Export to CSV
  const handleCSV = () => {
    const headers = ['ID', 'Student Name', 'Class', 'Username', 'Password'];
    const rows = filteredStudents.map(s => [
      s.studentId,
      s.name,
      `${s.class} - ${s.section}`,
      s.username,
      s.password
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `student_login_credentials_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Export to Excel
  const handleExcel = () => {
    const headers = ['ID', 'Student Name', 'Class', 'Username', 'Password'];
    const rows = filteredStudents.map(s => [
      s.studentId,
      s.name,
      `${s.class} - ${s.section}`,
      s.username,
      s.password
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
    link.download = `student_login_credentials_${new Date().toISOString().split('T')[0]}.xls`;
    link.click();
  };

  // Export to PDF
  const handlePDF = () => {
    window.print();
  };

  // Print
  const handlePrint = () => {
    window.print();
  };

  // Handle edit
  const handleEdit = (student) => {
    alert(`Edit login for: ${student.name}`);
  };

  // Handle delete
  const handleDelete = (student) => {
    if (window.confirm(`Are you sure you want to delete login credentials for ${student.name}?`)) {
      alert(`Login deleted for: ${student.name}`);
    }
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
          <span className="text-gray-900 font-semibold">Manage Login</span>
        </div>

        {/* Header */}
        <div className="mb-8 print:hidden">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Student Login</h1>
              <p className="text-gray-600 mt-1">Manage student login credentials and access</p>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6 print:hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, ID, or username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-sm"
              />
            </div>

            {/* Class Filter */}
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium"
              >
                <option value="all">All Classes</option>
                {classes.map((cls) => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Export Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-200">
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

        {/* Login Credentials Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Table Header - Print Only */}
          <div className="hidden print:block p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">CLASSORA INSTITUTE</h2>
            <h3 className="text-xl font-semibold text-gray-700 text-center mb-1">Student Login Credentials</h3>
            <p className="text-sm text-gray-600 text-center">
              {selectedClass === 'all' ? 'All Classes' : selectedClass} - Generated on {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Student Name</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Class</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Username</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Password</th>
                  <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider print:hidden">Action</th>
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
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.class} - {student.section}</td>
                      <td className="px-6 py-4 text-sm font-mono text-blue-600 font-semibold">{student.username}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono text-gray-900 font-semibold">
                            {visiblePasswords[student.id] ? student.password : '••••••••'}
                          </span>
                          <button
                            onClick={() => togglePasswordVisibility(student.id)}
                            className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors print:hidden"
                            title={visiblePasswords[student.id] ? 'Hide password' : 'Show password'}
                          >
                            {visiblePasswords[student.id] ? (
                              <EyeOff className="w-4 h-4 text-gray-600" />
                            ) : (
                              <Eye className="w-4 h-4 text-gray-600" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 print:hidden">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(student)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Edit login"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(student)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete login"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Lock className="w-16 h-16 text-gray-400 mb-4" />
                        <p className="text-lg font-semibold text-gray-900 mb-1">No login credentials found</p>
                        <p className="text-sm text-gray-600">Try adjusting your search or filters</p>
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
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-700">
                  Total Students: <span className="text-blue-600 text-lg">{filteredStudents.length}</span>
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Lock className="w-4 h-4" />
                  <span className="font-medium">Login credentials are confidential</span>
                </div>
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

export default ManageLogin;
