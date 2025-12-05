import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, ChevronRight, BarChart3, TrendingUp, TrendingDown, DollarSign, Users, Calendar,
  Printer, Download, CheckCircle, Clock, Activity, PieChart, Award, FileText, AlertCircle,
  Loader2
} from 'lucide-react';
import { salaryApi } from '../../../../services/salaryApi';

const SalaryReport = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  // Set default month
  useEffect(() => {
    const today = new Date();
    const currentMonth = today.toISOString().slice(0, 7);
    setSelectedMonth(currentMonth);
  }, []);

  // Fetch report data
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = {};
        if (selectedPeriod === 'month' && selectedMonth) {
          params.month = selectedMonth;
        } else if (selectedPeriod === 'year' && selectedMonth) {
          params.year = selectedMonth.split('-')[0];
        }
        
        const result = await salaryApi.getSalaryReport(params);
        
        if (result.success) {
          setReportData(result.data);
        } else {
          setError('Failed to load salary report');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch salary report');
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [selectedPeriod, selectedMonth]);

  const handleExport = async () => {
    try {
      setExporting(true);
      // In a real implementation, this would trigger a file download
      alert('Export feature would download the report as Excel/PDF');
      // Example: window.open(`${API_BASE_URL}/salary/report/export?month=${selectedMonth}`, '_blank');
    } catch (err) {
      alert('Failed to export report: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6 text-sm">
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-colors font-medium">
              <Home className="w-4 h-4" /><span>Dashboard</span>
            </button>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-blue-600 font-semibold">Salary</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-semibold">Salary Report</span>
          </div>
          
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-cyan-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-medium">Loading salary report...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6 text-sm">
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-colors font-medium">
              <Home className="w-4 h-4" /><span>Dashboard</span>
            </button>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-blue-600 font-semibold">Salary</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-semibold">Salary Report</span>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Report</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-semibold transition-all"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { summary, monthlyTrend, departmentWise, recentPayments, pendingSalaries } = reportData || {};
  
  // Calculate max paid for chart scaling
  const maxPaid = monthlyTrend && monthlyTrend.length > 0 
    ? Math.max(...monthlyTrend.map(d => d.paid))
    : 1;

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
                {selectedPeriod === 'month' && selectedMonth && (
                  <p className="text-sm text-gray-500 mt-1">
                    Showing data for {new Date(selectedMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={handleExport} 
                disabled={exporting}
                className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-75"
              >
                {exporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                {exporting ? 'Exporting...' : 'Export'}
              </button>
              <button onClick={handlePrint} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2">
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
                <button 
                  key={period} 
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedPeriod === period ? 'bg-cyan-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
            {selectedPeriod === 'month' && (
              <>
                <div className="w-px h-8 bg-gray-300 mx-2"></div>
                <input 
                  type="month" 
                  value={selectedMonth} 
                  onChange={(e) => setSelectedMonth(e.target.value)} 
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500" 
                />
              </>
            )}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"><DollarSign className="w-6 h-6" /></div>
              <div className="flex items-center gap-1 text-sm bg-white/20 px-3 py-1 rounded-full">
                <TrendingUp className="w-4 h-4" />
                <span>+{summary?.paymentRate || 0}%</span>
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">₹{(summary?.totalPaid / 100000).toFixed(1)}L</div>
            <div className="text-green-100 text-sm font-medium">Total Paid</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"><Clock className="w-6 h-6" /></div>
              <div className="flex items-center gap-1 text-sm bg-white/20 px-3 py-1 rounded-full">
                <AlertCircle className="w-4 h-4" />
                <span>{summary?.pendingEmployees || 0}</span>
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">₹{(summary?.totalPending / 100000).toFixed(1)}L</div>
            <div className="text-orange-100 text-sm font-medium">Total Pending</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"><Activity className="w-6 h-6" /></div>
              <div className="flex items-center gap-1 text-sm bg-white/20 px-3 py-1 rounded-full">
                <TrendingUp className="w-4 h-4" />
                <span>+2.1%</span>
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{summary?.paymentRate || 0}%</div>
            <div className="text-blue-100 text-sm font-medium">Payment Rate</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"><Users className="w-6 h-6" /></div>
              <div className="flex items-center gap-1 text-sm bg-white/20 px-3 py-1 rounded-full">
                <CheckCircle className="w-4 h-4" />
                <span>{summary?.paidEmployees || 0}</span>
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{summary?.totalEmployees || 0}</div>
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
                <p className="text-sm text-gray-600 mt-1">Paid salary over time</p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-cyan-600 rounded"></div><span className="text-gray-600">Paid</span></div>
              </div>
            </div>
            <div className="space-y-3">
              {monthlyTrend && monthlyTrend.length > 0 ? (
                monthlyTrend.map((data, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-16 text-sm font-semibold text-gray-700">
                      {new Date(data._id).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                    </div>
                    <div className="flex-1 relative h-10 bg-gray-100 rounded-lg overflow-hidden">
                      <div 
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg transition-all duration-500 flex items-center justify-end pr-3" 
                        style={{ width: `${(data.paid / maxPaid) * 100}%` }}
                      >
                        <span className="text-white text-xs font-bold">₹{(data.paid / 1000).toFixed(0)}K</span>
                      </div>
                    </div>
                    <div className="w-20 text-right">
                      <span className="text-sm font-semibold text-gray-900">{data.count} employees</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">No data available</div>
              )}
            </div>
          </div>

          {/* Department-wise Salary */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><PieChart className="w-5 h-5 text-cyan-600" />Department-wise Salary</h2>
            <div className="space-y-4">
              {departmentWise && departmentWise.length > 0 ? (
                departmentWise.map((dept, index) => {
                  const percentage = Math.round((dept.employees / summary?.totalEmployees) * 100);
                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700 truncate">{dept._id || 'Unknown'}</span>
                        <span className="text-sm font-bold text-gray-900">{dept.employees} ({percentage}%)</span>
                      </div>
                      <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className="absolute inset-y-0 left-0 bg-cyan-600 rounded-full transition-all duration-500" style={{ width: `${percentage * 3}%` }}></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Avg: ₹{Math.round(dept.avgSalary).toLocaleString()} | Total: ₹{(dept.paid / 1000).toFixed(0)}K
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">No department data</div>
              )}
            </div>
            {summary && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Avg Salary</span>
                  <span className="text-lg font-bold text-cyan-600">₹{summary.averageSalary.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Department-wise Salary Table */}
        {departmentWise && departmentWise.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Award className="w-5 h-5 text-cyan-600" />Department-wise Salary Details</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold">Department</th>
                    <th className="px-6 py-4 text-center font-bold">Employees</th>
                    <th className="px-6 py-4 text-right font-bold">Paid</th>
                    <th className="px-6 py-4 text-right font-bold">Avg Salary</th>
                    <th className="px-6 py-4 text-left font-bold">Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {departmentWise.map((dept, index) => {
                    const percentage = Math.round((dept.employees / summary.totalEmployees) * 100);
                    const share = Math.round((dept.paid / summary.totalPaid) * 100);
                    return (
                      <tr key={index} className="hover:bg-cyan-50 transition-colors">
                        <td className="px-6 py-4"><span className="font-semibold text-gray-900">{dept._id || 'Unknown'}</span></td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                            {dept.employees}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-green-600 font-bold">₹{(dept.paid / 1000).toFixed(0)}K</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-cyan-600 font-bold">₹{Math.round(dept.avgSalary).toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden w-32">
                              <div 
                                className="absolute inset-y-0 left-0 bg-cyan-500 rounded-full transition-all duration-500" 
                                style={{ width: `${share}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-semibold text-gray-700">{share}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Recent & Pending Payments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Recent Payments */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />Recent Payments
            </h2>
            <div className="space-y-3">
              {recentPayments && recentPayments.length > 0 ? (
                recentPayments.map((payment) => (
                  <div key={payment._id} className="flex items-center justify-between p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-sm">
                        {payment.employee?.employeeName || 'Unknown Employee'}
                      </div>
                      <div className="text-xs text-gray-600 mt-0.5">
                        {payment.employee?.employeeRole || 'Unknown Role'} • {new Date(payment.createdAt).toLocaleDateString('en-GB')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">₹{payment.netSalary?.toLocaleString()}</div>
                      <div className="flex items-center gap-1 mt-0.5 justify-end">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        <span className="text-xs text-green-600 font-semibold capitalize">{payment.status}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">No recent payments</div>
              )}
            </div>
            <button 
              onClick={() => navigate('/dashboard/salary/sheet')} 
              className="w-full mt-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold transition-all"
            >
              View All Payments
            </button>
          </div>

          {/* Pending Payments */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />Pending Payments
            </h2>
            <div className="space-y-3">
              {pendingSalaries && pendingSalaries.length > 0 ? (
                pendingSalaries.map((employee) => (
                  <div key={employee.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-sm">{employee.name}</div>
                      <div className="text-xs text-gray-600 mt-0.5">
                        {employee.role} • Due: {new Date(employee.dueDate).toLocaleDateString('en-GB')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">₹{employee.monthlySalary?.toLocaleString()}</div>
                      <div className="flex items-center gap-1 mt-0.5 justify-end">
                        <AlertCircle className="w-3 h-3 text-orange-600" />
                        <span className="text-xs font-semibold text-orange-600">PENDING</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">All salaries are paid up to date</div>
              )}
            </div>
            <button 
              onClick={() => navigate('/dashboard/salary/pay')} 
              className="w-full mt-4 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-all"
            >
              Pay Pending Salaries
            </button>
          </div>
        </div>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg">Payment Efficiency</h3>
            </div>
            <div className="text-4xl font-bold mb-2">{summary?.paymentRate || 0}%</div>
            <p className="text-teal-100 text-sm">
              {summary?.paidEmployees || 0} out of {summary?.totalEmployees || 0} employees paid
            </p>
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex items-center justify-between text-sm">
                <span>This Month</span>
                <span className="font-semibold">+2.5%</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg">Avg Salary</h3>
            </div>
            <div className="text-4xl font-bold mb-2">₹{summary?.averageSalary?.toLocaleString() || '0'}</div>
            <p className="text-violet-100 text-sm">Per employee average</p>
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex items-center justify-between text-sm">
                <span>Last Month</span>
                <span className="font-semibold">₹{summary?.averageSalary ? (summary.averageSalary * 0.95).toLocaleString() : '0'}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg">Pending Count</h3>
            </div>
            <div className="text-4xl font-bold mb-2">{summary?.pendingEmployees || 0}</div>
            <p className="text-rose-100 text-sm">Employees awaiting payment</p>
            <div className="mt-4 pt-4 border-t border-white/20">
              <button 
                onClick={() => navigate('/dashboard/salary/pay')} 
                className="text-sm font-semibold hover:underline"
              >
                Process Now →
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media print { 
          .no-print { 
            display: none !important; 
          } 
          body { 
            background: white !important; 
          } 
        }
      `}</style>
    </div>
  );
};

export default SalaryReport;