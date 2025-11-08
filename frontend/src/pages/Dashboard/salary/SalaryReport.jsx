import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, ChevronRight, BarChart3, TrendingUp, TrendingDown, DollarSign, Users, Calendar,
  Printer, Download, CheckCircle, Clock, Activity, PieChart, Award, FileText, AlertCircle
} from 'lucide-react';

const SalaryReport = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMonth, setSelectedMonth] = useState('2024-11');

  // Overall statistics
  const overallStats = {
    totalPaid: 4125000,
    totalPending: 875000,
    totalEmployees: 50,
    paidEmployees: 40,
    pendingEmployees: 10,
    averageSalary: 42500,
    paymentRate: 80
  };

  // Monthly salary data
  const monthlyData = [
    { month: 'Jan', paid: 380000, pending: 95000, total: 475000 },
    { month: 'Feb', paid: 395000, pending: 88000, total: 483000 },
    { month: 'Mar', paid: 405000, pending: 82000, total: 487000 },
    { month: 'Apr', paid: 398000, pending: 90000, total: 488000 },
    { month: 'May', paid: 410000, pending: 75000, total: 485000 },
    { month: 'Jun', paid: 402000, pending: 85000, total: 487000 },
    { month: 'Jul', paid: 415000, pending: 70000, total: 485000 },
    { month: 'Aug', paid: 408000, pending: 80000, total: 488000 },
    { month: 'Sep', paid: 420000, pending: 65000, total: 485000 },
    { month: 'Oct', paid: 418000, pending: 72000, total: 490000 },
    { month: 'Nov', paid: 400000, pending: 88000, total: 488000 },
    { month: 'Dec', paid: 399000, pending: 85000, total: 484000 }
  ];

  // Department-wise salary
  const departmentData = [
    { department: 'Teaching', paid: 1850000, pending: 450000, employees: 25, percentage: 80.4 },
    { department: 'Administration', paid: 1250000, pending: 250000, employees: 12, percentage: 83.3 },
    { department: 'Sports', paid: 450000, pending: 75000, employees: 5, percentage: 85.7 },
    { department: 'Library', paid: 325000, pending: 50000, employees: 4, percentage: 86.7 },
    { department: 'Laboratory', paid: 250000, pending: 50000, employees: 4, percentage: 83.3 }
  ];

  // Salary distribution
  const salaryDistribution = [
    { range: '20K-30K', count: 8, percentage: 16, color: 'bg-blue-500' },
    { range: '30K-40K', count: 12, percentage: 24, color: 'bg-green-500' },
    { range: '40K-50K', count: 15, percentage: 30, color: 'bg-yellow-500' },
    { range: '50K-70K', count: 10, percentage: 20, color: 'bg-orange-500' },
    { range: '70K+', count: 5, percentage: 10, color: 'bg-red-500' }
  ];

  // Recent payments
  const recentPayments = [
    { id: 1, employee: 'Dr. Rajesh Kumar', role: 'Principal', amount: 95000, date: '2024-11-07', status: 'paid' },
    { id: 2, employee: 'Mrs. Priya Sharma', role: 'Mathematics Teacher', amount: 48000, date: '2024-11-07', status: 'paid' },
    { id: 3, employee: 'Mr. Amit Patel', role: 'Science Teacher', amount: 43500, date: '2024-11-06', status: 'paid' },
    { id: 4, employee: 'Ms. Sneha Reddy', role: 'English Teacher', amount: 41000, date: '2024-11-06', status: 'paid' },
    { id: 5, employee: 'Mr. Vikram Singh', role: 'Sports Instructor', amount: 38500, date: '2024-11-05', status: 'paid' }
  ];

  // Pending payments
  const pendingPayments = [
    { id: 1, employee: 'Mrs. Anita Desai', role: 'Librarian', amount: 33000, dueDate: '2024-11-10', priority: 'high' },
    { id: 2, employee: 'Mr. Suresh Nair', role: 'Lab Assistant', amount: 28500, dueDate: '2024-11-10', priority: 'high' },
    { id: 3, employee: 'Ms. Kavita Joshi', role: 'Computer Teacher', amount: 45500, dueDate: '2024-11-12', priority: 'medium' },
    { id: 4, employee: 'Mr. Ravi Verma', role: 'Accountant', amount: 39800, dueDate: '2024-11-12', priority: 'medium' },
    { id: 5, employee: 'Mrs. Meera Iyer', role: 'HR Manager', amount: 60000, dueDate: '2024-11-15', priority: 'low' }
  ];

  const maxPaid = Math.max(...monthlyData.map(d => d.paid));

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
          <span className="text-gray-900 font-semibold">Salary Report</span>
        </div>

        {/* Header */}
        <div className="mb-8 no-print">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Salary Report & Analytics</h1>
                <p className="text-gray-600 mt-1">Comprehensive salary overview and insights</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => alert('Exporting...')} className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                <Download className="w-5 h-5" />Export
              </button>
              <button onClick={() => window.print()} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                <Printer className="w-5 h-5" />Print
              </button>
            </div>
          </div>
        </div>

        {/* Period Selection */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6 no-print">
          <div className="flex items-center gap-4">
            <label className="text-sm font-semibold text-gray-700">Report Period:</label>
            <div className="flex gap-2">
              {['month', 'quarter', 'year'].map(period => (
                <button key={period} onClick={() => setSelectedPeriod(period)} className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedPeriod === period ? 'bg-cyan-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
            {selectedPeriod === 'month' && (
              <>
                <div className="w-px h-8 bg-gray-300 mx-2"></div>
                <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500" />
              </>
            )}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"><DollarSign className="w-6 h-6" /></div>
              <div className="flex items-center gap-1 text-sm bg-white/20 px-3 py-1 rounded-full"><TrendingUp className="w-4 h-4" /><span>+8.5%</span></div>
            </div>
            <div className="text-3xl font-bold mb-1">₹{(overallStats.totalPaid / 100000).toFixed(1)}L</div>
            <div className="text-green-100 text-sm font-medium">Total Paid</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"><Clock className="w-6 h-6" /></div>
              <div className="flex items-center gap-1 text-sm bg-white/20 px-3 py-1 rounded-full"><AlertCircle className="w-4 h-4" /><span>{overallStats.pendingEmployees}</span></div>
            </div>
            <div className="text-3xl font-bold mb-1">₹{(overallStats.totalPending / 100000).toFixed(1)}L</div>
            <div className="text-orange-100 text-sm font-medium">Total Pending</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"><Activity className="w-6 h-6" /></div>
              <div className="flex items-center gap-1 text-sm bg-white/20 px-3 py-1 rounded-full"><TrendingUp className="w-4 h-4" /><span>+2.1%</span></div>
            </div>
            <div className="text-3xl font-bold mb-1">{overallStats.paymentRate}%</div>
            <div className="text-blue-100 text-sm font-medium">Payment Rate</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"><Users className="w-6 h-6" /></div>
              <div className="flex items-center gap-1 text-sm bg-white/20 px-3 py-1 rounded-full"><CheckCircle className="w-4 h-4" /><span>{overallStats.paidEmployees}</span></div>
            </div>
            <div className="text-3xl font-bold mb-1">{overallStats.totalEmployees}</div>
            <div className="text-purple-100 text-sm font-medium">Total Employees</div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Monthly Salary Trend */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Activity className="w-5 h-5 text-cyan-600" />Monthly Salary Trend</h2>
                <p className="text-sm text-gray-600 mt-1">Paid vs Pending comparison</p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-cyan-600 rounded"></div><span className="text-gray-600">Paid</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-500 rounded"></div><span className="text-gray-600">Pending</span></div>
              </div>
            </div>
            <div className="space-y-3">
              {monthlyData.map((data, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-12 text-sm font-semibold text-gray-700">{data.month}</div>
                  <div className="flex-1 relative h-10 bg-gray-100 rounded-lg overflow-hidden">
                    <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg transition-all duration-500 flex items-center justify-end pr-3" style={{ width: `${(data.paid / maxPaid) * 100}%` }}>
                      <span className="text-white text-xs font-bold">₹{(data.paid / 1000).toFixed(0)}K</span>
                    </div>
                  </div>
                  <div className="w-24 text-right">
                    <span className="text-orange-600 text-sm font-semibold">₹{(data.pending / 1000).toFixed(0)}K</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Salary Distribution */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><PieChart className="w-5 h-5 text-cyan-600" />Salary Distribution</h2>
            <div className="space-y-4">
              {salaryDistribution.map((range, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">{range.range}</span>
                    <span className="text-sm font-bold text-gray-900">{range.count} ({range.percentage}%)</span>
                  </div>
                  <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`absolute inset-y-0 left-0 ${range.color} rounded-full transition-all duration-500`} style={{ width: `${range.percentage * 3.33}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Avg Salary</span>
                <span className="text-lg font-bold text-cyan-600">₹{overallStats.averageSalary.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Department-wise Salary */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Award className="w-5 h-5 text-cyan-600" />Department-wise Salary</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-bold">Department</th>
                  <th className="px-6 py-4 text-center font-bold">Employees</th>
                  <th className="px-6 py-4 text-right font-bold">Paid</th>
                  <th className="px-6 py-4 text-right font-bold">Pending</th>
                  <th className="px-6 py-4 text-center font-bold">Payment %</th>
                  <th className="px-6 py-4 text-left font-bold">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {departmentData.map((dept, index) => (
                  <tr key={index} className="hover:bg-cyan-50 transition-colors">
                    <td className="px-6 py-4"><span className="font-semibold text-gray-900">{dept.department}</span></td>
                    <td className="px-6 py-4 text-center"><span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">{dept.employees}</span></td>
                    <td className="px-6 py-4 text-right"><span className="text-green-600 font-bold">₹{(dept.paid / 1000).toFixed(0)}K</span></td>
                    <td className="px-6 py-4 text-right"><span className="text-orange-600 font-bold">₹{(dept.pending / 1000).toFixed(0)}K</span></td>
                    <td className="px-6 py-4 text-center"><span className={`px-3 py-1 rounded-full text-sm font-bold ${dept.percentage >= 85 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{dept.percentage}%</span></td>
                    <td className="px-6 py-4">
                      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden w-32">
                        <div className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${dept.percentage >= 85 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: `${dept.percentage}%` }}></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-cyan-50 border-t-2 border-cyan-200">
                <tr>
                  <td className="px-6 py-4 font-bold text-gray-900">Total</td>
                  <td className="px-6 py-4 text-center font-bold text-gray-900">{departmentData.reduce((sum, d) => sum + d.employees, 0)}</td>
                  <td className="px-6 py-4 text-right font-bold text-green-600">₹{(departmentData.reduce((sum, d) => sum + d.paid, 0) / 100000).toFixed(1)}L</td>
                  <td className="px-6 py-4 text-right font-bold text-orange-600">₹{(departmentData.reduce((sum, d) => sum + d.pending, 0) / 100000).toFixed(1)}L</td>
                  <td className="px-6 py-4 text-center font-bold text-cyan-600">{((departmentData.reduce((sum, d) => sum + d.paid, 0) / (departmentData.reduce((sum, d) => sum + d.paid + d.pending, 0))) * 100).toFixed(1)}%</td>
                  <td className="px-6 py-4"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Recent & Pending Payments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Recent Payments */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-600" />Recent Payments</h2>
            <div className="space-y-3">
              {recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 text-sm">{payment.employee}</div>
                    <div className="text-xs text-gray-600 mt-0.5">{payment.role} • {payment.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">₹{payment.amount.toLocaleString()}</div>
                    <div className="flex items-center gap-1 mt-0.5 justify-end"><CheckCircle className="w-3 h-3 text-green-600" /><span className="text-xs text-green-600 font-semibold">Paid</span></div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/dashboard/salary/sheet')} className="w-full mt-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold transition-all">
              View All Payments
            </button>
          </div>

          {/* Pending Payments */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Clock className="w-5 h-5 text-orange-600" />Pending Payments</h2>
            <div className="space-y-3">
              {pendingPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 text-sm">{payment.employee}</div>
                    <div className="text-xs text-gray-600 mt-0.5">{payment.role} • Due: {payment.dueDate}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">₹{payment.amount.toLocaleString()}</div>
                    <div className="flex items-center gap-1 mt-0.5 justify-end">
                      <AlertCircle className="w-3 h-3 text-orange-600" />
                      <span className={`text-xs font-semibold ${payment.priority === 'high' ? 'text-red-600' : payment.priority === 'medium' ? 'text-orange-600' : 'text-yellow-600'}`}>
                        {payment.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/dashboard/salary/pay')} className="w-full mt-4 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-all">
              Pay Pending Salaries
            </button>
          </div>
        </div>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center"><TrendingUp className="w-5 h-5" /></div>
              <h3 className="font-bold text-lg">Payment Efficiency</h3>
            </div>
            <div className="text-4xl font-bold mb-2">{overallStats.paymentRate}%</div>
            <p className="text-teal-100 text-sm">{overallStats.paidEmployees} out of {overallStats.totalEmployees} employees paid</p>
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex items-center justify-between text-sm"><span>This Month</span><span className="font-semibold">+2.5%</span></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center"><DollarSign className="w-5 h-5" /></div>
              <h3 className="font-bold text-lg">Avg Salary</h3>
            </div>
            <div className="text-4xl font-bold mb-2">₹{overallStats.averageSalary.toLocaleString()}</div>
            <p className="text-violet-100 text-sm">Per employee average</p>
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex items-center justify-between text-sm"><span>Last Month</span><span className="font-semibold">₹41,200</span></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center"><AlertCircle className="w-5 h-5" /></div>
              <h3 className="font-bold text-lg">Pending Count</h3>
            </div>
            <div className="text-4xl font-bold mb-2">{overallStats.pendingEmployees}</div>
            <p className="text-rose-100 text-sm">Employees awaiting payment</p>
            <div className="mt-4 pt-4 border-t border-white/20">
              <button onClick={() => navigate('/dashboard/salary/pay')} className="text-sm font-semibold hover:underline">Process Now →</button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`@media print { .no-print { display: none !important; } body { background: white !important; } }`}</style>
    </div>
  );
};

export default SalaryReport;
