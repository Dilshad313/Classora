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

const EmployeeManageLogin = () => {
  const navigate = useNavigate();
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState({});

  // Mock employee login data
  const employees = [
    {
      id: 1,
      employeeId: 'EMP001',
      name: 'Rajesh Kumar',
      role: 'Teacher',
      department: 'Mathematics',
      username: 'rajesh.kumar',
      password: 'Rajesh@2024'
    },
    {
      id: 2,
      employeeId: 'EMP002',
      name: 'Priya Sharma',
      role: 'Principal',
      department: 'Administration',
      username: 'priya.sharma',
      password: 'Priya@2024'
    },
    {
      id: 3,
      employeeId: 'EMP003',
      name: 'Amit Patel',
      role: 'Librarian',
      department: 'Library',
      username: 'amit.patel',
      password: 'Amit@2024'
    },
    {
      id: 4,
      employeeId: 'EMP004',
      name: 'Sneha Reddy',
      role: 'Teacher',
      department: 'Science',
      username: 'sneha.reddy',
      password: 'Sneha@2024'
    },
    {
      id: 5,
      employeeId: 'EMP005',
      name: 'Karan Mehta',
      role: 'Sports Coach',
      department: 'Physical Education',
      username: 'karan.mehta',
      password: 'Karan@2024'
    },
    {
      id: 6,
      employeeId: 'EMP006',
      name: 'Divya Singh',
      role: 'Lab Assistant',
      department: 'Science Lab',
      username: 'divya.singh',
      password: 'Divya@2024'
    },
    {
      id: 7,
      employeeId: 'EMP007',
      name: 'Mohan Verma',
      role: 'Accountant',
      department: 'Administration',
      username: 'mohan.verma',
      password: 'Mohan@2024'
    },
    {
      id: 8,
      employeeId: 'EMP008',
      name: 'Anita Desai',
      role: 'Teacher',
      department: 'English',
      username: 'anita.desai',
      password: 'Anita@2024'
    }
  ];

  // Get unique departments
  const departments = [...new Set(employees.map(e => e.department))].sort();

  // Filter employees by search term and selected department
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = searchTerm === '' || 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = selectedDepartment === 'all' || employee.department === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
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
    const headers = ['ID', 'Employee Name', 'Department', 'Username', 'Password'];
    const rows = filteredEmployees.map(e => [
      e.employeeId,
      e.name,
      e.department,
      e.username,
      e.password
    ]);
    
    const text = [headers, ...rows].map(row => row.join('\t')).join('\n');
    navigator.clipboard.writeText(text);
    alert('Login credentials copied to clipboard!');
  };

  // Export to CSV
  const handleCSV = () => {
    const headers = ['ID', 'Employee Name', 'Department', 'Username', 'Password'];
    const rows = filteredEmployees.map(e => [
      e.employeeId,
      e.name,
      e.department,
      e.username,
      e.password
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `employee_login_credentials_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Export to Excel
  const handleExcel = () => {
    const headers = ['ID', 'Employee Name', 'Department', 'Username', 'Password'];
    const rows = filteredEmployees.map(e => [
      e.employeeId,
      e.name,
      e.department,
      e.username,
      e.password
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
    link.download = `employee_login_credentials_${new Date().toISOString().split('T')[0]}.xls`;
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
  const handleEdit = (employee) => {
    alert(`Edit login for: ${employee.name}`);
  };

  // Handle delete
  const handleDelete = (employee) => {
    if (window.confirm(`Are you sure you want to delete login credentials for ${employee.name}?`)) {
      alert(`Login deleted for: ${employee.name}`);
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
          <span className="text-blue-600 font-semibold">Employees</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-semibold">Manage Login</span>
        </div>

        {/* Header */}
        <div className="mb-8 print:hidden">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Employee Login</h1>
              <p className="text-gray-600 mt-1">Manage employee login credentials and access</p>
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

            {/* Department Filter */}
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium"
              >
                <option value="all">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
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
            <h3 className="text-xl font-semibold text-gray-700 text-center mb-1">Employee Login Credentials</h3>
            <p className="text-sm text-gray-600 text-center">
              {selectedDepartment === 'all' ? 'All Departments' : selectedDepartment} - Generated on {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Employee Name</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Department</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Username</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Password</th>
                  <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider print:hidden">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee, index) => (
                    <tr 
                      key={employee.id} 
                      className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{employee.employeeId}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{employee.name}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{employee.department}</td>
                      <td className="px-6 py-4 text-sm font-mono text-blue-600 font-semibold">{employee.username}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono text-gray-900 font-semibold">
                            {visiblePasswords[employee.id] ? employee.password : '••••••••'}
                          </span>
                          <button
                            onClick={() => togglePasswordVisibility(employee.id)}
                            className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors print:hidden"
                            title={visiblePasswords[employee.id] ? 'Hide password' : 'Show password'}
                          >
                            {visiblePasswords[employee.id] ? (
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
                            onClick={() => handleEdit(employee)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Edit login"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(employee)}
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
          {filteredEmployees.length > 0 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-700">
                  Total Employees: <span className="text-blue-600 text-lg">{filteredEmployees.length}</span>
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

export default EmployeeManageLogin;
