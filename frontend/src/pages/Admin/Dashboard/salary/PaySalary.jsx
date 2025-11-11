import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  ChevronRight, 
  Wallet, 
  Search, 
  Calendar,
  DollarSign,
  User,
  Briefcase,
  Hash,
  CheckCircle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

const PaySalary = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [salaryMonth, setSalaryMonth] = useState('');
  const [salaryDate, setSalaryDate] = useState('');
  const [fixedSalary, setFixedSalary] = useState('');
  const [bonus, setBonus] = useState('');
  const [deduction, setDeduction] = useState('');

  // Sample employees data
  const employees = [
    {
      id: 1,
      employeeId: 'EMP001',
      name: 'Dr. Rajesh Kumar',
      role: 'Principal',
      department: 'Administration',
      email: 'rajesh.kumar@classora.edu',
      phone: '+91 98765 43210',
      joiningDate: '2020-01-15',
      photo: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=4F46E5&color=fff'
    },
    {
      id: 2,
      employeeId: 'EMP002',
      name: 'Mrs. Priya Sharma',
      role: 'Mathematics Teacher',
      department: 'Teaching',
      email: 'priya.sharma@classora.edu',
      phone: '+91 98765 43211',
      joiningDate: '2019-06-10',
      photo: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=7C3AED&color=fff'
    },
    {
      id: 3,
      employeeId: 'EMP003',
      name: 'Mr. Amit Patel',
      role: 'Science Teacher',
      department: 'Teaching',
      email: 'amit.patel@classora.edu',
      phone: '+91 98765 43212',
      joiningDate: '2020-08-20',
      photo: 'https://ui-avatars.com/api/?name=Amit+Patel&background=EC4899&color=fff'
    },
    {
      id: 4,
      employeeId: 'EMP004',
      name: 'Ms. Sneha Reddy',
      role: 'English Teacher',
      department: 'Teaching',
      email: 'sneha.reddy@classora.edu',
      phone: '+91 98765 43213',
      joiningDate: '2021-03-15',
      photo: 'https://ui-avatars.com/api/?name=Sneha+Reddy&background=F59E0B&color=fff'
    },
    {
      id: 5,
      employeeId: 'EMP005',
      name: 'Mr. Vikram Singh',
      role: 'Sports Instructor',
      department: 'Sports',
      email: 'vikram.singh@classora.edu',
      phone: '+91 98765 43214',
      joiningDate: '2019-11-01',
      photo: 'https://ui-avatars.com/api/?name=Vikram+Singh&background=10B981&color=fff'
    },
    {
      id: 6,
      employeeId: 'EMP006',
      name: 'Mrs. Anita Desai',
      role: 'Librarian',
      department: 'Library',
      email: 'anita.desai@classora.edu',
      phone: '+91 98765 43215',
      joiningDate: '2018-04-12',
      photo: 'https://ui-avatars.com/api/?name=Anita+Desai&background=3B82F6&color=fff'
    }
  ];

  // Filter employees based on search
  const getSuggestions = () => {
    const query = searchQuery.toLowerCase();
    if (!query) return [];
    return employees.filter(emp => 
      emp.name.toLowerCase().includes(query) ||
      emp.employeeId.toLowerCase().includes(query) ||
      emp.role.toLowerCase().includes(query)
    );
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setShowSuggestions(value.length > 0);
    setSelectedEmployee(null);
  };

  const handleSelectEmployee = (employee) => {
    setSelectedEmployee(employee);
    setSearchQuery(employee.name);
    setShowSuggestions(false);
    // Reset form
    setSalaryMonth('');
    setSalaryDate('');
    setFixedSalary('');
    setBonus('');
    setDeduction('');
  };

  const handleSubmitSalary = () => {
    if (!selectedEmployee || !salaryMonth || !salaryDate || !fixedSalary) {
      alert('Please fill all required fields');
      return;
    }

    const fixedSalaryNum = parseFloat(fixedSalary) || 0;
    const bonusNum = parseFloat(bonus) || 0;
    const deductionNum = parseFloat(deduction) || 0;
    const totalSalary = fixedSalaryNum + bonusNum - deductionNum;

    const details = {
      receiptNo: `SAL${Date.now()}`,
      employee: selectedEmployee,
      salaryMonth,
      salaryDate,
      fixedSalary: fixedSalaryNum,
      bonus: bonusNum,
      deduction: deductionNum,
      totalSalary,
      paymentDate: new Date().toLocaleDateString('en-GB'),
      paymentTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    // Navigate to Salary Paid Slip page with salary details
    navigate('/dashboard/salary/paid-slip', { state: { salaryDetails: details } });
  };


  const calculateTotal = () => {
    const fixedSalaryNum = parseFloat(fixedSalary) || 0;
    const bonusNum = parseFloat(bonus) || 0;
    const deductionNum = parseFloat(deduction) || 0;
    return fixedSalaryNum + bonusNum - deductionNum;
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
          <span className="text-blue-600 font-semibold">Salary</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-semibold">Pay Salary</span>
        </div>

        {/* Header */}
        <div className="mb-8 no-print">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Pay Salary</h1>
              <p className="text-gray-600 mt-1">Process and manage employee salary payments</p>
            </div>
          </div>
        </div>

        {/* Search Employee */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-6 no-print">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Search className="w-6 h-6 text-emerald-600" />
            Search Employee
          </h2>
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400 z-10" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search employee by name, ID, or role..."
              className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            {showSuggestions && getSuggestions().length > 0 && (
              <div className="absolute z-20 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-80 overflow-y-auto">
                {getSuggestions().map(employee => (
                  <button
                    key={employee.id}
                    onClick={() => handleSelectEmployee(employee)}
                    className="w-full px-4 py-4 text-left hover:bg-emerald-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-4"
                  >
                    <img
                      src={employee.photo}
                      alt={employee.name}
                      className="w-12 h-12 rounded-full border-2 border-emerald-200"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{employee.name}</div>
                      <div className="text-sm text-gray-600">
                        {employee.employeeId} • {employee.role} • {employee.department}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          {selectedEmployee && (
            <div className="mt-4 p-4 bg-emerald-50 border-2 border-emerald-200 rounded-xl flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span className="text-emerald-800 font-semibold">Selected: {selectedEmployee.name}</span>
            </div>
          )}
        </div>

        {/* Salary Payment Form */}
        {selectedEmployee && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-6 no-print">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Wallet className="w-6 h-6 text-emerald-600" />
              Pay Employee Salary
            </h2>

            {/* Employee Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
              <div className="flex items-center gap-3">
                <img
                  src={selectedEmployee.photo}
                  alt={selectedEmployee.name}
                  className="w-16 h-16 rounded-full border-2 border-emerald-300"
                />
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <User className="w-4 h-4" />
                    Employee Name
                  </div>
                  <div className="font-bold text-gray-900">{selectedEmployee.name}</div>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Hash className="w-4 h-4" />
                  Employee ID
                </div>
                <div className="font-bold text-gray-900">{selectedEmployee.employeeId}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Briefcase className="w-4 h-4" />
                  Employee Role
                </div>
                <div className="font-bold text-gray-900">{selectedEmployee.role}</div>
              </div>
            </div>

            {/* Salary Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Salary Month <span className="text-red-500">*</span>
                </label>
                <input
                  type="month"
                  value={salaryMonth}
                  onChange={(e) => setSalaryMonth(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={salaryDate}
                  onChange={(e) => setSalaryDate(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  Fixed Salary <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={fixedSalary}
                  onChange={(e) => setFixedSalary(e.target.value)}
                  placeholder="Enter fixed salary amount"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <TrendingUp className="w-4 h-4 inline mr-2" />
                  Any Bonus
                </label>
                <input
                  type="number"
                  value={bonus}
                  onChange={(e) => setBonus(e.target.value)}
                  placeholder="Enter bonus amount (optional)"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <TrendingDown className="w-4 h-4 inline mr-2" />
                  Any Deduction
                </label>
                <input
                  type="number"
                  value={deduction}
                  onChange={(e) => setDeduction(e.target.value)}
                  placeholder="Enter deduction amount (optional)"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Total Calculation Preview */}
            {fixedSalary && (
              <div className="mb-8 p-6 bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Salary Calculation</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Fixed Salary:</span>
                    <span className="font-semibold text-gray-900">₹{parseFloat(fixedSalary || 0).toLocaleString()}</span>
                  </div>
                  {bonus && (
                    <div className="flex items-center justify-between text-green-600">
                      <span className="flex items-center gap-2"><TrendingUp className="w-4 h-4" />Bonus:</span>
                      <span className="font-semibold">+ ₹{parseFloat(bonus).toLocaleString()}</span>
                    </div>
                  )}
                  {deduction && (
                    <div className="flex items-center justify-between text-red-600">
                      <span className="flex items-center gap-2"><TrendingDown className="w-4 h-4" />Deduction:</span>
                      <span className="font-semibold">- ₹{parseFloat(deduction).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="pt-3 border-t-2 border-emerald-300 flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">Total Salary:</span>
                    <span className="text-2xl font-bold text-emerald-600">₹{calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSubmitSalary}
                className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Submit Salary
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PaySalary;
