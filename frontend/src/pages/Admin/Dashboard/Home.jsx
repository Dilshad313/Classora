import { useState, useEffect } from 'react';
import { Users, DollarSign, Calendar, UserCheck, UserX, UserPlus, ArrowUpRight, ArrowDownRight, ChevronLeft, ChevronRight, TrendingUp, Briefcase, Settings } from 'lucide-react';
import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, AreaChart, Area, BarChart, Bar } from 'recharts';
import { getDashboardStats } from '../../../services/dashboardApi';
import toast from 'react-hot-toast';

const Home = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Dashboard Data State
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalEmployees: 0,
    totalRevenue: 0,
    totalProfit: 0,
    todayAbsentStudents: 0,
    todayPresentEmployees: 0,
    todayPresentStudents: 0, 
    newAdmissions: 0,
    estimatedFee: 0,
    collectedFee: 0,
    incomeStats: [],
    studentStats: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async (showLoader = false) => {
      try {
        if (showLoader) setLoading(true);
        const data = await getDashboardStats();
        if (data) {
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        toast.error('Failed to load dashboard statistics');
      } finally {
        if (showLoader) setLoading(false);
      }
    };

    fetchStats(true);
    const intervalId = setInterval(() => fetchStats(false), 30000);
    return () => clearInterval(intervalId);
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD', // Default to USD for now, could be dynamic
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  // Get calendar data
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const buildLastNMonths = (n) => {
    const base = new Date();
    base.setDate(1);
    const out = [];
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(base.getFullYear(), base.getMonth() - i, 1);
      out.push({
        month: d.getMonth() + 1,
        year: d.getFullYear(),
        label: `${monthShort[d.getMonth()]} ${String(d.getFullYear()).slice(-2)}`
      });
    }
    return out;
  };

  const last6 = buildLastNMonths(6);
  const incomeMap = new Map(stats.incomeStats.map(it => [`${it._id.year}-${it._id.month}`, it.total]));
  const studentMap = new Map(stats.studentStats.map(it => [`${it._id.year}-${it._id.month}`, it.count]));

  const incomeChartData = last6.map(m => ({
    label: m.label,
    total: Number(incomeMap.get(`${m.year}-${m.month}`) || 0)
  }));

  const studentChartData = last6.map(m => ({
    label: m.label,
    count: Number(studentMap.get(`${m.year}-${m.month}`) || 0)
  }));



  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  // Derived Stats for UI
  const topStats = [
    {
      title: 'Total Students',
      value: stats.totalStudents.toLocaleString(),
      change: '+0%', // Placeholder for change
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Total Employees',
      value: stats.totalEmployees.toLocaleString(),
      change: '+0%',
      icon: Briefcase,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      change: '+0%',
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Total Profit',
      value: formatCurrency(stats.totalProfit),
      change: '+0%',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      textColor: 'text-orange-600 dark:text-orange-400'
    },
  ];

  const centerStats = [
    {
      title: 'Statistics for Income',
      value: formatCurrency(stats.totalRevenue), // Showing total revenue
      change: '+0%',
      trend: 'up',
      icon: DollarSign,
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400',
      iconBg: 'bg-green-500'
    },
    {
      title: 'Statistics for Student',
      value: stats.totalStudents.toLocaleString(),
      change: '+0%',
      trend: 'up',
      icon: Users,
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-500'
    },
    {
      title: 'Today Absent Students',
      value: stats.todayAbsentStudents.toLocaleString(),
      change: '0%',
      trend: 'down',
      icon: UserX,
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      textColor: 'text-red-600 dark:text-red-400',
      iconBg: 'bg-red-500'
    },
    {
      title: 'Today Present Employees',
      value: stats.todayPresentEmployees.toLocaleString(),
      change: '0%',
      trend: 'up',
      icon: UserCheck,
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400',
      iconBg: 'bg-purple-500'
    },
    {
      title: 'New Admissions',
      value: stats.newAdmissions.toLocaleString(),
      change: 'This Month',
      trend: 'up',
      icon: UserPlus,
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      textColor: 'text-orange-600 dark:text-orange-400',
      iconBg: 'bg-orange-500'
    },
  ];

  // Calculations for Side Panel
  const pendingFee = Math.max(0, stats.estimatedFee - stats.collectedFee);
  const collectedPercentage = stats.estimatedFee > 0 ? Math.round((stats.collectedFee / stats.estimatedFee) * 100) : 0;
  const pendingPercentage = stats.estimatedFee > 0 ? Math.round((pendingFee / stats.estimatedFee) * 100) : 0;
  
  // Attendance and other percentages
  const presentStudentPercentage = stats.totalStudents > 0 
    ? ((stats.todayPresentStudents / stats.totalStudents) * 100).toFixed(1) 
    : 0;
  
  const presentEmployeePercentage = stats.totalEmployees > 0 
    ? ((stats.todayPresentEmployees / stats.totalEmployees) * 100).toFixed(1) 
    : 0;

  if (loading) {
     return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
     );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Welcome back, {user.name}! 👋
        </h1>
        <p className="text-primary-100">
          Here's what's happening in Future Leaders Academy today
        </p>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {topStats.map((stat, index) => (
          <div key={index} className="card hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={stat.bgColor + " p-3 rounded-lg"}>
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
              <span className="text-green-600 dark:text-green-400 text-sm font-semibold flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 text-sm mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Layout: Center Graphs + Right Sidebar */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Center Column - Statistics Graphs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Statistics Graphs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {centerStats.map((stat, index) => (
              <div key={index} className="card hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`${stat.iconBg} p-2.5 rounded-lg`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-gray-800 dark:text-gray-100 text-sm font-semibold">{stat.title}</h3>
                      <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">{stat.value}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold flex items-center gap-1 ${stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {stat.trend === 'up' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    {stat.change}
                  </span>
                </div>
                
                {/* Mini Bar Chart - Visual Only for now */}
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{stat.trend === 'up' ? 'Increasing' : 'Decreasing'}</span>
                  </div>
                  <div className="flex gap-1 h-24 items-end">
                    {[65, 75, 70, 85, 80, 90, 95].map((height, i) => (
                      <div
                        key={i}
                        className={`flex-1 ${stat.iconBg} rounded-t opacity-${i === 6 ? '100' : '60'} hover:opacity-100 transition-opacity`}
                        style={{ height: `${height}%` }}
                      ></div>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-1">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Income (Last 6 Months)</h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={incomeChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="#6b7280" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                    <Tooltip />
                    <Area type="monotone" dataKey="total" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Admissions (Last 6 Months)</h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={studentChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="#6b7280" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Estimated Fee This Month */}
          <div className="card bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-2 border-primary-200 dark:border-primary-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Estimated Fee This Month</h3>
              <DollarSign className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <p className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">{formatCurrency(stats.estimatedFee)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Expected from {stats.totalStudents} students</p>
            <div className="mt-4 pt-4 border-t border-primary-200 dark:border-primary-800">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Collected</span>
                <span className="font-semibold text-green-600 dark:text-green-400">{formatCurrency(stats.collectedFee)} ({collectedPercentage}%)</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-600 dark:text-gray-400">Pending</span>
                <span className="font-semibold text-orange-600 dark:text-orange-400">{formatCurrency(pendingFee)} ({pendingPercentage}%)</span>
              </div>
            </div>
          </div>

          {/* Today's Tracking */}
          <div className="card">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Today's Tracking</h3>
            
            {/* Today Present Students */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Today Present Students</span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{presentStudentPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${Math.min(100, presentStudentPercentage)}%` }}></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stats.todayPresentStudents} out of {stats.totalStudents} students</p>
            </div>

            {/* Today Present Employees */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Today Present Employees</span>
                <span className="text-sm font-bold text-purple-600 dark:text-purple-400">{presentEmployeePercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${Math.min(100, presentEmployeePercentage)}%` }}></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stats.todayPresentEmployees} out of {stats.totalEmployees} employees</p>
            </div>

            {/* This Month Fee Collection */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">This Month Fee Collection</span>
                <span className="text-sm font-bold text-green-600 dark:text-green-400">{collectedPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${Math.min(100, collectedPercentage)}%` }}></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formatCurrency(stats.collectedFee)} out of {formatCurrency(stats.estimatedFee)}</p>
            </div>
          </div>

          {/* Calendar */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Calendar</h3>
              <div className="flex gap-2">
                <button 
                  onClick={previousMonth}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <button 
                  onClick={nextMonth}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>
            
            <div className="text-center mb-4">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </p>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Day names */}
              {dayNames.map(day => (
                <div key={day} className="text-center text-xs font-semibold text-gray-600 dark:text-gray-400 py-2">
                  {day}
                </div>
              ))}
              
              {/* Empty cells for days before month starts */}
              {[...Array(startingDayOfWeek)].map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square"></div>
              ))}
              
              {/* Calendar days */}
              {[...Array(daysInMonth)].map((_, index) => {
                const day = index + 1;
                const isToday = day === new Date().getDate() && 
                               currentDate.getMonth() === new Date().getMonth() && 
                               currentDate.getFullYear() === new Date().getFullYear();
                
                return (
                  <button
                    key={day}
                    className={`aspect-square flex items-center justify-center text-sm rounded-lg transition-colors ${
                      isToday 
                        ? 'bg-primary-600 text-white font-bold' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
