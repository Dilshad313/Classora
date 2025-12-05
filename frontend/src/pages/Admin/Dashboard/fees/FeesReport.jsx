import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, ChevronRight, BarChart3, TrendingUp, TrendingDown, DollarSign, Users, Calendar,
  Printer, Download, CheckCircle, Clock, PieChart, Activity, CreditCard, Wallet, Target, Award, FileText, Loader
} from 'lucide-react';
import * as feesApi from '../../../../services/feesApi';

const FeesReport = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  // Load report data when filters change
  useEffect(() => {
    loadReportData();
  }, [selectedPeriod, selectedMonth, selectedYear, startDate, endDate]);

  const loadReportData = async () => {
    try {
      setLoading(true);
      
      const filters = {
        period: selectedPeriod
      };

      if (selectedPeriod === 'month') {
        filters.month = selectedMonth;
        filters.year = new Date(selectedMonth).getFullYear();
      } else if (selectedPeriod === 'year') {
        filters.year = selectedYear;
      } else if (selectedPeriod === 'custom' && startDate && endDate) {
        filters.startDate = startDate;
        filters.endDate = endDate;
      }

      const response = await feesApi.getFeesReport(filters);
      setReportData(response);
    } catch (error) {
      console.error('Error loading report data:', error);
      alert('Failed to load fees report');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    alert('Export feature coming soon...');
  };

  const overallStats = reportData?.overallStats || {
    totalCollected: 0, totalPending: 0, totalDefaulters: 0, collectionRate: 0,
    totalStudents: 0, paidStudents: 0, averageFeePerStudent: 0
  };

  const monthlyData = reportData?.monthlyData || [];
  const classWiseData = reportData?.classWiseData || [];
  const paymentMethods = reportData?.paymentMethods || [];
  const feeCategories = reportData?.feeCategories || [];
  const recentTransactions = reportData?.recentTransactions || [];

  const maxCollected = monthlyData.length > 0 ? Math.max(...monthlyData.map(d => d.collected)) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-6 text-sm no-print">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-colors font-medium">
            <Home className="w-4 h-4" /><span>Dashboard</span>
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-blue-600 font-semibold">Fees</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-semibold">Fees Report</span>
        </div>

        <div className="mb-8 no-print">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Fees Report & Analytics</h1>
                <p className="text-gray-600 mt-1">Comprehensive overview of fee collection and insights</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleExport} className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                <Download className="w-5 h-5" />Export
              </button>
              <button onClick={() => window.print()} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                <Printer className="w-5 h-5" />Print
              </button>
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader className="w-8 h-8 animate-spin text-indigo-600" />
            <span className="ml-2 text-gray-600">Loading report data...</span>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6 no-print">
          <div className="flex items-center gap-4">
            <label className="text-sm font-semibold text-gray-700">Report Period:</label>
            <div className="flex gap-2">
              {['month', 'quarter', 'year', 'custom'].map(period => (
                <button 
                  key={period} 
                  onClick={() => setSelectedPeriod(period)} 
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedPeriod === period 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
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
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                />
              </>
            )}
            
            {selectedPeriod === 'year' && (
              <>
                <div className="w-px h-8 bg-gray-300 mx-2"></div>
                <select 
                  value={selectedYear} 
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {[2022, 2023, 2024, 2025].map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </>
            )}
            
            {selectedPeriod === 'custom' && (
              <>
                <div className="w-px h-8 bg-gray-300 mx-2"></div>
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)} 
                  placeholder="Start Date"
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                />
                <span className="text-gray-500">to</span>
                <input 
                  type="date" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)} 
                  placeholder="End Date"
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                />
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-sm bg-white/20 px-3 py-1 rounded-full">
                <TrendingUp className="w-4 h-4" />
                <span>+12.5%</span>
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">
              ₹{(overallStats.totalCollected / 100000).toFixed(1)}L
            </div>
            <div className="text-green-100 text-sm font-medium">Total Collected</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-sm bg-white/20 px-3 py-1 rounded-full">
                <TrendingDown className="w-4 h-4" />
                <span>-5.2%</span>
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">
              ₹{(overallStats.totalPending / 100000).toFixed(1)}L
            </div>
            <div className="text-orange-100 text-sm font-medium">Total Pending</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-sm bg-white/20 px-3 py-1 rounded-full">
                <TrendingUp className="w-4 h-4" />
                <span>+3.8%</span>
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{overallStats.collectionRate}%</div>
            <div className="text-blue-100 text-sm font-medium">Collection Rate</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-sm bg-white/20 px-3 py-1 rounded-full">
                <CheckCircle className="w-4 h-4" />
                <span>{overallStats.paidStudents}</span>
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{overallStats.totalStudents}</div>
            <div className="text-purple-100 text-sm font-medium">Total Students</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-600" />Monthly Collection Trend
                </h2>
                <p className="text-sm text-gray-600 mt-1">Collected vs Target comparison</p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-indigo-600 rounded"></div>
                  <span className="text-gray-600">Collected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-300 rounded"></div>
                  <span className="text-gray-600">Target</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {monthlyData.map((data, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-12 text-sm font-semibold text-gray-700">
                    {new Date(data.month).toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                  <div className="flex-1 relative h-10 bg-gray-100 rounded-lg overflow-hidden">
                    <div 
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg transition-all duration-500 flex items-center justify-end pr-3" 
                      style={{ width: `${maxCollected > 0 ? (data.collected / maxCollected) * 100 : 0}%` }}
                    >
                      <span className="text-white text-xs font-bold">
                        ₹{(data.collected / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div 
                      className="absolute inset-y-0 left-0 border-2 border-dashed border-gray-400 rounded-lg pointer-events-none" 
                      style={{ width: `${maxCollected > 0 ? (data.target / maxCollected) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <div className="w-20 text-right">
                    {data.collected >= data.target ? (
                      <span className="text-green-600 text-sm font-semibold flex items-center justify-end gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {data.target > 0 ? ((data.collected / data.target) * 100 - 100).toFixed(1) : 0}%
                      </span>
                    ) : (
                      <span className="text-orange-600 text-sm font-semibold flex items-center justify-end gap-1">
                        <TrendingDown className="w-4 h-4" />
                        {data.target > 0 ? ((data.collected / data.target) * 100 - 100).toFixed(1) : 0}%
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-indigo-600" />Payment Methods
            </h2>
            <div className="space-y-4">
              {paymentMethods.map((method, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-semibold text-gray-700 capitalize">{method._id}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{method.percentage}%</span>
                  </div>
                  <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`absolute inset-y-0 left-0 bg-indigo-500 rounded-full transition-all duration-500`} 
                      style={{ width: `${method.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    ₹{(method.amount / 1000).toFixed(0)}K
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Total</span>
                <span className="text-lg font-bold text-indigo-600">
                  ₹{(paymentMethods.reduce((sum, m) => sum + m.amount, 0) / 100000).toFixed(1)}L
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />Class-wise Fee Collection
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-bold">Class</th>
                  <th className="px-6 py-4 text-center font-bold">Students</th>
                  <th className="px-6 py-4 text-right font-bold">Collected</th>
                  <th className="px-6 py-4 text-right font-bold">Pending</th>
                  <th className="px-6 py-4 text-center font-bold">Collection %</th>
                  <th className="px-6 py-4 text-left font-bold">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {classWiseData.map((classData, index) => (
                  <tr key={index} className="hover:bg-indigo-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">{classData.class}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                        {classData.students}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-green-600 font-bold">
                        ₹{(classData.collected / 1000).toFixed(0)}K
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-orange-600 font-bold">
                        ₹{(classData.pending / 1000).toFixed(0)}K
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                        classData.percentage >= 85 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {classData.percentage}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden w-32">
                        <div 
                          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                            classData.percentage >= 85 ? 'bg-green-500' : 'bg-yellow-500'
                          }`} 
                          style={{ width: `${classData.percentage}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-indigo-50 border-t-2 border-indigo-200">
                <tr>
                  <td className="px-6 py-4 font-bold text-gray-900">Total</td>
                  <td className="px-6 py-4 text-center font-bold text-gray-900">
                    {classWiseData.reduce((sum, c) => sum + c.students, 0)}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-green-600">
                    ₹{(classWiseData.reduce((sum, c) => sum + c.collected, 0) / 100000).toFixed(1)}L
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-orange-600">
                    ₹{(classWiseData.reduce((sum, c) => sum + c.pending, 0) / 100000).toFixed(1)}L
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-indigo-600">
                    {classWiseData.length > 0 ? 
                      (classWiseData.reduce((sum, c) => sum + parseFloat(c.percentage), 0) / classWiseData.length).toFixed(1) 
                      : 0}%
                  </td>
                  <td className="px-6 py-4"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-indigo-600" />Fee Categories Breakdown
            </h2>
            <div className="space-y-4">
              {feeCategories.map((category, index) => (
                <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">{category._id}</span>
                    <span className="text-sm font-bold text-gray-900">
                      ₹{(category.amount / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500" 
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-600">{category.percentage}% of total</span>
                    <span className="text-xs text-indigo-600 font-semibold">
                      ₹{overallStats.totalStudents > 0 ? (category.amount / overallStats.totalStudents).toFixed(0) : 0}/student
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />Recent Transactions
            </h2>
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={transaction._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 text-sm">
                      {transaction.student?.studentName || transaction.studentName}
                    </div>
                    <div className="text-xs text-gray-600 mt-0.5">
                      {transaction.class} • {new Date(transaction.paymentDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">₹{transaction.amount.toLocaleString()}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-600 capitalize">{transaction.depositType}</span>
                      {transaction.status === 'completed' ? 
                        <CheckCircle className="w-3 h-3 text-green-600" /> : 
                        <Clock className="w-3 h-3 text-orange-600" />
                      }
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => navigate('/dashboard/fees/collect-fees')} 
              className="w-full mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all"
            >
              View All Transactions
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg">Collection Efficiency</h3>
            </div>
            <div className="text-4xl font-bold mb-2">{overallStats.collectionRate}%</div>
            <p className="text-cyan-100 text-sm">
              {overallStats.paidStudents} out of {overallStats.totalStudents} students paid
            </p>
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex items-center justify-between text-sm">
                <span>This Month</span>
                <span className="font-semibold">+3.2%</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg">Avg Fee/Student</h3>
            </div>
            <div className="text-4xl font-bold mb-2">₹{overallStats.averageFeePerStudent.toLocaleString()}</div>
            <p className="text-violet-100 text-sm">Per student average fee</p>
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex items-center justify-between text-sm">
                <span>Last Month</span>
                <span className="font-semibold">₹6,850</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg">Defaulters</h3>
            </div>
            <div className="text-4xl font-bold mb-2">{overallStats.totalDefaulters}</div>
            <p className="text-pink-100 text-sm">Students with pending fees</p>
            <div className="mt-4 pt-4 border-t border-white/20">
              <button 
                onClick={() => navigate('/dashboard/fees/defaulters')} 
                className="text-sm font-semibold hover:underline"
              >
                View Details →
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media print { 
          .no-print { display: none !important; } 
          body { background: white !important; } 
        }
      `}</style>
    </div>
  );
};

export default FeesReport;