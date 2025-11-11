import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, ChevronRight, FileSpreadsheet, Search, Calendar, DollarSign, Users, Printer, Download, 
  Filter, TrendingUp, TrendingDown, Eye, Copy, FileText
} from 'lucide-react';

const SalarySheet = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMonth, setFilterMonth] = useState('2024-11');
  const [filterDepartment, setFilterDepartment] = useState('');

  // Sample salary data
  const salaryRecords = [
    { id: 1, employeeId: 'EMP001', name: 'Dr. Rajesh Kumar', role: 'Principal', department: 'Administration', fixedSalary: 85000, bonus: 15000, deduction: 5000, netSalary: 95000, month: '2024-11', status: 'Paid' },
    { id: 2, employeeId: 'EMP002', name: 'Mrs. Priya Sharma', role: 'Mathematics Teacher', department: 'Teaching', fixedSalary: 45000, bonus: 5000, deduction: 2000, netSalary: 48000, month: '2024-11', status: 'Paid' },
    { id: 3, employeeId: 'EMP003', name: 'Mr. Amit Patel', role: 'Science Teacher', department: 'Teaching', fixedSalary: 42000, bonus: 3000, deduction: 1500, netSalary: 43500, month: '2024-11', status: 'Paid' },
    { id: 4, employeeId: 'EMP004', name: 'Ms. Sneha Reddy', role: 'English Teacher', department: 'Teaching', fixedSalary: 40000, bonus: 2000, deduction: 1000, netSalary: 41000, month: '2024-11', status: 'Paid' },
    { id: 5, employeeId: 'EMP005', name: 'Mr. Vikram Singh', role: 'Sports Instructor', department: 'Sports', fixedSalary: 35000, bonus: 5000, deduction: 1500, netSalary: 38500, month: '2024-11', status: 'Paid' },
    { id: 6, employeeId: 'EMP006', name: 'Mrs. Anita Desai', role: 'Librarian', department: 'Library', fixedSalary: 32000, bonus: 2000, deduction: 1000, netSalary: 33000, month: '2024-11', status: 'Paid' },
    { id: 7, employeeId: 'EMP007', name: 'Mr. Suresh Nair', role: 'Lab Assistant', department: 'Laboratory', fixedSalary: 28000, bonus: 1000, deduction: 500, netSalary: 28500, month: '2024-11', status: 'Paid' },
    { id: 8, employeeId: 'EMP008', name: 'Ms. Kavita Joshi', role: 'Computer Teacher', department: 'Teaching', fixedSalary: 43000, bonus: 4000, deduction: 1500, netSalary: 45500, month: '2024-11', status: 'Paid' },
    { id: 9, employeeId: 'EMP009', name: 'Mr. Ravi Verma', role: 'Accountant', department: 'Administration', fixedSalary: 38000, bonus: 3000, deduction: 1200, netSalary: 39800, month: '2024-11', status: 'Paid' },
    { id: 10, employeeId: 'EMP010', name: 'Mrs. Meera Iyer', role: 'HR Manager', department: 'Administration', fixedSalary: 55000, bonus: 8000, deduction: 3000, netSalary: 60000, month: '2024-11', status: 'Paid' }
  ];

  // Filter records
  const filteredRecords = salaryRecords.filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         record.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMonth = !filterMonth || record.month === filterMonth;
    const matchesDepartment = !filterDepartment || record.department === filterDepartment;
    return matchesSearch && matchesMonth && matchesDepartment;
  });

  // Get unique departments
  const departments = [...new Set(salaryRecords.map(r => r.department))];

  // Calculate totals
  const totals = filteredRecords.reduce((acc, record) => ({
    fixedSalary: acc.fixedSalary + record.fixedSalary,
    bonus: acc.bonus + record.bonus,
    deduction: acc.deduction + record.deduction,
    netSalary: acc.netSalary + record.netSalary
  }), { fixedSalary: 0, bonus: 0, deduction: 0, netSalary: 0 });

  const handlePrint = () => window.print();
  const handleExport = () => alert('Exporting salary sheet...');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm no-print">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-colors font-medium">
            <Home className="w-4 h-4" /><span>Dashboard</span>
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-blue-600 font-semibold">Salary</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-semibold">Salary Sheet</span>
        </div>

        {/* Header */}
        <div className="mb-8 no-print">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileSpreadsheet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Salary Sheet</h1>
                <p className="text-gray-600 mt-1">Complete salary details for all employees</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleExport} className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                <Download className="w-5 h-5" />Export
              </button>
              <button onClick={handlePrint} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                <Printer className="w-5 h-5" />Print
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 no-print">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{filteredRecords.length}</div>
                <div className="text-sm text-gray-600">Total Employees</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">₹{(totals.fixedSalary / 100000).toFixed(1)}L</div>
                <div className="text-sm text-gray-600">Total Fixed Salary</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">₹{(totals.bonus / 1000).toFixed(0)}K</div>
                <div className="text-sm text-gray-600">Total Bonus</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">₹{(totals.netSalary / 100000).toFixed(1)}L</div>
                <div className="text-sm text-gray-600">Total Net Salary</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6 no-print">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Search className="w-4 h-4 inline mr-2" />Search
              </label>
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by name, ID, or role..." className="w-full pl-11 pr-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />Salary Month
              </label>
              <input type="month" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Filter className="w-4 h-4 inline mr-2" />Department
              </label>
              <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)} className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                <option value="">All Departments</option>
                {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200">
            <button onClick={() => { setSearchQuery(''); setFilterMonth('2024-11'); setFilterDepartment(''); }} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all">
              Clear Filters
            </button>
            <div className="flex-1"></div>
            <span className="text-sm text-gray-600">Showing {filteredRecords.length} of {salaryRecords.length} records</span>
          </div>
        </div>

        {/* Salary Sheet Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                <tr>
                  <th className="px-4 py-4 text-left font-bold">S.No</th>
                  <th className="px-4 py-4 text-left font-bold">Employee ID</th>
                  <th className="px-4 py-4 text-left font-bold">Employee Name</th>
                  <th className="px-4 py-4 text-left font-bold">Role</th>
                  <th className="px-4 py-4 text-left font-bold">Department</th>
                  <th className="px-4 py-4 text-right font-bold">Fixed Salary</th>
                  <th className="px-4 py-4 text-right font-bold">Bonus</th>
                  <th className="px-4 py-4 text-right font-bold">Deduction</th>
                  <th className="px-4 py-4 text-right font-bold">Net Salary</th>
                  <th className="px-4 py-4 text-center font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRecords.map((record, index) => (
                  <tr key={record.id} className="hover:bg-purple-50 transition-colors">
                    <td className="px-4 py-4 text-gray-700 font-medium">{index + 1}</td>
                    <td className="px-4 py-4"><span className="font-semibold text-gray-900">{record.employeeId}</span></td>
                    <td className="px-4 py-4"><div className="font-semibold text-gray-900">{record.name}</div></td>
                    <td className="px-4 py-4 text-gray-700">{record.role}</td>
                    <td className="px-4 py-4"><span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">{record.department}</span></td>
                    <td className="px-4 py-4 text-right"><span className="font-semibold text-gray-900">₹{record.fixedSalary.toLocaleString()}</span></td>
                    <td className="px-4 py-4 text-right"><span className="font-semibold text-green-600">₹{record.bonus.toLocaleString()}</span></td>
                    <td className="px-4 py-4 text-right"><span className="font-semibold text-red-600">₹{record.deduction.toLocaleString()}</span></td>
                    <td className="px-4 py-4 text-right"><span className="font-bold text-purple-600 text-lg">₹{record.netSalary.toLocaleString()}</span></td>
                    <td className="px-4 py-4 text-center"><span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">{record.status}</span></td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-purple-50 border-t-2 border-purple-200">
                <tr>
                  <td colSpan="5" className="px-4 py-4 font-bold text-gray-900 text-lg">Total</td>
                  <td className="px-4 py-4 text-right font-bold text-gray-900">₹{totals.fixedSalary.toLocaleString()}</td>
                  <td className="px-4 py-4 text-right font-bold text-green-600">₹{totals.bonus.toLocaleString()}</td>
                  <td className="px-4 py-4 text-right font-bold text-red-600">₹{totals.deduction.toLocaleString()}</td>
                  <td className="px-4 py-4 text-right font-bold text-purple-600 text-xl">₹{totals.netSalary.toLocaleString()}</td>
                  <td className="px-4 py-4"></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {filteredRecords.length === 0 && (
            <div className="text-center py-12">
              <FileSpreadsheet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-semibold">No salary records found</p>
              <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-6 bg-white rounded-2xl shadow-lg border border-gray-200 p-6 no-print">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Salary Sheet Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-purple-600 rounded-full mt-1.5"></div>
              <div><strong>Month:</strong> {new Date(filterMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-purple-600 rounded-full mt-1.5"></div>
              <div><strong>Generated On:</strong> {new Date().toLocaleDateString('en-GB')}</div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-purple-600 rounded-full mt-1.5"></div>
              <div><strong>Total Employees:</strong> {filteredRecords.length}</div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-purple-600 rounded-full mt-1.5"></div>
              <div><strong>Payment Status:</strong> All Paid</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`@media print { .no-print { display: none !important; } body { background: white !important; } }`}</style>
    </div>
  );
};

export default SalarySheet;
