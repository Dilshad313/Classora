import React, { useState, useEffect } from 'react';
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
  TrendingDown,
  Loader2
} from 'lucide-react';
import { salaryApi } from '../../../../services/salaryApi';

const PaySalary = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [salaryMonth, setSalaryMonth] = useState('');
  const [salaryDate, setSalaryDate] = useState('');
  const [fixedSalary, setFixedSalary] = useState('');
  const [bonus, setBonus] = useState('');
  const [deduction, setDeduction] = useState('');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Set default date values
  useEffect(() => {
    const today = new Date();
    const currentMonth = today.toISOString().slice(0, 7);
    const currentDate = today.toISOString().slice(0, 10);
   
    setSalaryMonth(currentMonth);
    setSalaryDate(currentDate);
  }, []);

  // Search employees when query changes
  useEffect(() => {
    const searchEmployees = async () => {
      if (searchQuery.length < 2) {
        setFilteredEmployees([]);
        return;
      }
      setSearching(true);
      setError(null);
     
      try {
        const result = await salaryApi.searchEmployees(searchQuery);
       
        if (result.success) {
          const mappedEmployees = result.data.map(emp => ({
            id: emp._id,
            employeeId: emp.employeeId,
            name: emp.employeeName,
            role: emp.employeeRole,
            department: emp.department,
            email: emp.emailAddress,
            phone: emp.mobileNo,
            monthlySalary: emp.monthlySalary,
            photo: emp.picture?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.employeeName)}&background=4F46E5&color=fff`
          }));
         
          setFilteredEmployees(mappedEmployees);
          setEmployees(mappedEmployees);
        }
      } catch (err) {
        setError(err.message || 'Failed to search employees');
        setFilteredEmployees([]);
      } finally {
        setSearching(false);
      }
    };
    const debounceTimer = setTimeout(searchEmployees, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Get suggestions for dropdown
  const getSuggestions = () => {
    if (!searchQuery) return [];
    return filteredEmployees.filter(emp =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setShowSuggestions(value.length > 0);
    setSelectedEmployee(null);
    setError(null);
  };

  const handleSelectEmployee = (employee) => {
    setSelectedEmployee(employee);
    setSearchQuery(employee.name);
    setShowSuggestions(false);
   
    // Auto-fill salary with employee's monthly salary
    setFixedSalary(employee.monthlySalary?.toString() || '');
   
    // Reset other fields
    setBonus('');
    setDeduction('');
  };

  const handleSubmitSalary = async () => {
    if (!selectedEmployee || !salaryMonth || !salaryDate || !fixedSalary) {
      setError('Please fill all required fields (Employee, Month, Date, and Fixed Salary)');
      return;
    }
    const fixedSalaryNum = parseFloat(fixedSalary) || 0;
    if (fixedSalaryNum <= 0) {
      setError('Fixed salary must be greater than 0');
      return;
    }
    const bonusNum = parseFloat(bonus) || 0;
    const deductionNum = parseFloat(deduction) || 0;
    const totalSalary = fixedSalaryNum + bonusNum - deductionNum;
    if (totalSalary < 0) {
      setError('Total salary cannot be negative');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const salaryData = {
        employeeId: selectedEmployee.id,
        month: salaryMonth,
        salaryDate: salaryDate,
        fixedSalary: fixedSalaryNum,
        bonus: bonusNum,
        deduction: deductionNum
      };
      const result = await salaryApi.paySalary(salaryData);
     
      if (result.success) {
        setSuccess('Salary paid successfully!');
       
        // Navigate to salary slip after 1 second
        setTimeout(() => {
          navigate(`../paid-slip/${result.data._id}`, {
            state: {
              salaryDetails: {
                ...result.data,
                employee: selectedEmployee,
                receiptNo: result.data.receiptNo,
                paymentDate: new Date().toLocaleDateString('en-GB'),
                paymentTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
              }
            }
          });
        }, 1000);
      }
    } catch (err) {
      setError(err.message || 'Failed to process salary payment');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    const fixedSalaryNum = parseFloat(fixedSalary) || 0;
    const bonusNum = parseFloat(bonus) || 0;
    const deductionNum = parseFloat(deduction) || 0;
    return fixedSalaryNum + bonusNum - deductionNum;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 mb-6 text-sm no-print">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span className="text-blue-600 dark:text-blue-400 font-semibold">Salary</span>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span className="text-gray-900 dark:text-white font-semibold">Pay Salary</span>
        </div>
        {/* Header */}
        <div className="mb-8 no-print">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-green-600 dark:from-emerald-500 dark:to-green-500 rounded-xl flex items-center justify-center shadow-lg">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Pay Salary</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Process and manage employee salary payments</p>
            </div>
          </div>
        </div>
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 rounded">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 dark:text-red-300 font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}
        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 dark:border-green-400 rounded">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700 dark:text-green-300 font-medium">{success}</p>
              </div>
            </div>
          </div>
        )}
        {/* Search Employee */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-6 no-print">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Search className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            Search Employee
          </h2>
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400 dark:text-gray-500 z-10" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search employee by name, ID, or role..."
              className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            {searching && (
              <div className="absolute right-3 top-3 z-10">
                <Loader2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 animate-spin" />
              </div>
            )}
            {showSuggestions && getSuggestions().length > 0 && (
              <div className="absolute z-20 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-lg max-h-80 overflow-y-auto">
                {getSuggestions().map(employee => (
                  <button
                    key={employee.id}
                    onClick={() => handleSelectEmployee(employee)}
                    className="w-full px-4 py-4 text-left hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0 flex items-center gap-4"
                  >
                    <img
                      src={employee.photo}
                      alt={employee.name}
                      className="w-12 h-12 rounded-full border-2 border-emerald-200 dark:border-emerald-500"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 dark:text-white">{employee.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {employee.employeeId} • {employee.role} • {employee.department}
                      </div>
                      <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mt-1">
                        Monthly Salary: ₹{employee.monthlySalary?.toLocaleString()}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {showSuggestions && searchQuery && !searching && getSuggestions().length === 0 && (
              <div className="absolute z-20 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-lg p-4">
                <p className="text-gray-600 dark:text-gray-400 text-center">No employees found</p>
              </div>
            )}
          </div>
          {selectedEmployee && (
            <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-500 rounded-xl flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-800 dark:text-emerald-200 font-semibold">Selected: {selectedEmployee.name}</span>
            </div>
          )}
        </div>
        {/* Salary Payment Form */}
        {selectedEmployee && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-6 no-print">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Wallet className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              Pay Employee Salary
            </h2>
            {/* Employee Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-6 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl border border-emerald-200 dark:border-emerald-500">
              <div className="flex items-center gap-3">
                <img
                  src={selectedEmployee.photo}
                  alt={selectedEmployee.name}
                  className="w-16 h-16 rounded-full border-2 border-emerald-300 dark:border-emerald-400"
                />
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <User className="w-4 h-4" />
                    Employee Name
                  </div>
                  <div className="font-bold text-gray-900 dark:text-white">{selectedEmployee.name}</div>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <Hash className="w-4 h-4" />
                  Employee ID
                </div>
                <div className="font-bold text-gray-900 dark:text-white">{selectedEmployee.employeeId}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <Briefcase className="w-4 h-4" />
                  Employee Role
                </div>
                <div className="font-bold text-gray-900 dark:text-white">{selectedEmployee.role}</div>
              </div>
            </div>
            {/* Salary Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Salary Month <span className="text-red-500">*</span>
                </label>
                <input
                  type="month"
                  value={salaryMonth}
                  onChange={(e) => setSalaryMonth(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={salaryDate}
                  onChange={(e) => setSalaryDate(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  Fixed Salary <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={fixedSalary}
                  onChange={(e) => setFixedSalary(e.target.value)}
                  placeholder="Enter fixed salary amount"
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <TrendingUp className="w-4 h-4 inline mr-2" />
                  Any Bonus
                </label>
                <input
                  type="number"
                  value={bonus}
                  onChange={(e) => setBonus(e.target.value)}
                  placeholder="Enter bonus amount (optional)"
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <TrendingDown className="w-4 h-4 inline mr-2" />
                  Any Deduction
                </label>
                <input
                  type="number"
                  value={deduction}
                  onChange={(e) => setDeduction(e.target.value)}
                  placeholder="Enter deduction amount (optional)"
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            {/* Total Calculation Preview */}
            {fixedSalary && (
              <div className="mb-8 p-6 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-2 border-emerald-200 dark:border-emerald-500 rounded-xl">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Salary Calculation</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Fixed Salary:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">₹{parseFloat(fixedSalary || 0).toLocaleString()}</span>
                  </div>
                  {bonus && (
                    <div className="flex items-center justify-between text-green-600 dark:text-green-400">
                      <span className="flex items-center gap-2"><TrendingUp className="w-4 h-4" />Bonus:</span>
                      <span className="font-semibold">+ ₹{parseFloat(bonus).toLocaleString()}</span>
                    </div>
                  )}
                  {deduction && (
                    <div className="flex items-center justify-between text-red-600 dark:text-red-400">
                      <span className="flex items-center gap-2"><TrendingDown className="w-4 h-4" />Deduction:</span>
                      <span className="font-semibold">- ₹{parseFloat(deduction).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="pt-3 border-t-2 border-emerald-300 dark:border-emerald-500 flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">Total Salary:</span>
                    <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">₹{calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSubmitSalary}
                disabled={loading}
                className={`px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-500 dark:to-green-500 hover:from-emerald-700 hover:to-green-700 dark:hover:from-emerald-600 dark:hover:to-green-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Submit Salary
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaySalary;