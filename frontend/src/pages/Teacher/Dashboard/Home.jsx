import { useState, useEffect } from 'react';
import { Users, Calendar, BookOpen, ClipboardCheck, Award, TrendingUp, UserCheck, UserX, BookOpenCheck, MessageSquare, Video, ChevronLeft, ChevronRight, Mail, Phone, MapPin, Briefcase, GraduationCap, DollarSign, CreditCard, TrendingDown, CheckCircle, Clock, Building } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { getDashboardStats } from '../../../services/dashboardApi';
import toast from 'react-hot-toast';

const Home = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [stats, setStats] = useState({
    myClasses: 0,
    totalStudents: 0,
    pendingHomework: 0,
    upcomingTests: 0,
    todaySchedule: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        if (data) {
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        toast.error('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  // Top Stats Cards
  const topStats = [
    {
      title: 'My Classes',
      value: stats.myClasses,
      subtitle: 'Active Classes',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Total Students',
      value: stats.totalStudents,
      subtitle: 'Across all classes',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      title: 'Pending Homework',
      value: stats.pendingHomework,
      subtitle: 'To be reviewed',
      icon: BookOpenCheck,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      textColor: 'text-orange-600 dark:text-orange-400'
    },
    {
      title: 'Upcoming Tests',
      value: stats.upcomingTests,
      subtitle: 'This week',
      icon: ClipboardCheck,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400'
    },
  ];

  // Today's Schedule
  const todaySchedule = stats.todaySchedule || [];

  // Recent Activities
  const recentActivities = [
    { type: 'homework', title: 'New homework submitted by John Doe', time: '10 mins ago', class: 'Class 10-A' },
    { type: 'message', title: 'New message from Parent - Sarah Smith', time: '25 mins ago', class: 'Class 9-B' },
    { type: 'attendance', title: 'Attendance marked for Class 10-C', time: '1 hour ago', class: 'Class 10-C' },
    { type: 'exam', title: 'Exam marks updated for Mid-term', time: '2 hours ago', class: 'Class 10-A' },
  ];

  // Quick Stats
  const quickStats = [
    {
      title: 'Today\'s Attendance',
      value: '94.5%',
      subtitle: '148 out of 156 students',
      icon: UserCheck,
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400',
      iconBg: 'bg-green-500'
    },
    {
      title: 'Absent Today',
      value: '8',
      subtitle: '5.5% of total students',
      icon: UserX,
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      textColor: 'text-red-600 dark:text-red-400',
      iconBg: 'bg-red-500'
    },
    {
      title: 'Pending Reviews',
      value: '12',
      subtitle: 'Homework & Assignments',
      icon: BookOpenCheck,
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      textColor: 'text-orange-600 dark:text-orange-400',
      iconBg: 'bg-orange-500'
    },
    {
      title: 'Unread Messages',
      value: '5',
      subtitle: 'From students & parents',
      icon: MessageSquare,
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-500'
    },
  ];

  // Teacher Profile Data
  const teacherProfile = {
    name: user.name || 'John Anderson',
    employeeId: 'TCH-2024-1056',
    email: user.email || 'john.anderson@classora.edu',
    phone: '+1 (555) 123-4567',
    department: 'Mathematics Department',
    designation: 'Senior Mathematics Teacher',
    joiningDate: 'August 15, 2018',
    experience: '12 Years',
    qualification: 'M.Sc. Mathematics, B.Ed.',
    address: '123 Education Lane, Academic City, ST 12345',
    specialization: 'Algebra, Calculus, Statistics'
  };

  // Attendance Report Data (Monthly)
  const attendanceData = [
    { name: 'Present', value: 148, percentage: 94.9 },
    { name: 'Absent', value: 5, percentage: 3.2 },
    { name: 'Late', value: 3, percentage: 1.9 }
  ];

  const ATTENDANCE_COLORS = ['#10b981', '#ef4444', '#f59e0b'];

  // Monthly Attendance Trend
  const monthlyAttendanceTrend = [
    { month: 'Jan', percentage: 92.5 },
    { month: 'Feb', percentage: 94.2 },
    { month: 'Mar', percentage: 93.8 },
    { month: 'Apr', percentage: 95.1 },
    { month: 'May', percentage: 94.9 },
    { month: 'Jun', percentage: 93.5 }
  ];

  // Salary Report Data
  const salaryInfo = {
    basicSalary: 45000,
    allowances: {
      houseRent: 13500,
      transport: 3000,
      medical: 2500,
      special: 5000
    },
    deductions: {
      tax: 6800,
      insurance: 1200,
      providentFund: 4500
    },
    netSalary: 56500,
    currency: '$'
  };

  // Recent Salary History
  const salaryHistory = [
    { month: 'November 2024', amount: 56500, status: 'Paid', date: 'Nov 1, 2024' },
    { month: 'October 2024', amount: 56500, status: 'Paid', date: 'Oct 1, 2024' },
    { month: 'September 2024', amount: 56500, status: 'Paid', date: 'Sep 1, 2024' },
    { month: 'August 2024', amount: 56500, status: 'Paid', date: 'Aug 1, 2024' }
  ];

  // Custom label for pie chart
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="font-bold text-sm"
      >
        {`${percentage.toFixed(1)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Welcome back, {user.name}! 👋
        </h1>
        <p className="text-primary-100">
          Here's your teaching dashboard for today
        </p>
      </div>

      {/* Teacher Profile Section */}
      <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-2 border-blue-200 dark:border-blue-800">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Profile Picture and Basic Info */}
          <div className="flex flex-col items-center lg:items-start">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                {teacherProfile.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="absolute bottom-0 right-0 w-10 h-10 bg-green-500 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-center lg:text-left mt-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{teacherProfile.name}</h2>
              <p className="text-primary-600 dark:text-primary-400 font-semibold">{teacherProfile.designation}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">ID: {teacherProfile.employeeId}</p>
            </div>
          </div>

          {/* Detailed Information Grid */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Email Address</p>
                <p className="text-sm text-gray-800 dark:text-gray-200 font-semibold">{teacherProfile.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Phone Number</p>
                <p className="text-sm text-gray-800 dark:text-gray-200 font-semibold">{teacherProfile.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Building className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Department</p>
                <p className="text-sm text-gray-800 dark:text-gray-200 font-semibold">{teacherProfile.department}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Briefcase className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Experience</p>
                <p className="text-sm text-gray-800 dark:text-gray-200 font-semibold">{teacherProfile.experience}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Qualification</p>
                <p className="text-sm text-gray-800 dark:text-gray-200 font-semibold">{teacherProfile.qualification}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
              <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                <Calendar className="w-5 h-5 text-pink-600 dark:text-pink-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Joining Date</p>
                <p className="text-sm text-gray-800 dark:text-gray-200 font-semibold">{teacherProfile.joiningDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Bar */}
        <div className="mt-6 pt-6 border-t border-blue-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <p className="text-sm text-gray-600 dark:text-gray-400"><span className="font-semibold">Address:</span> {teacherProfile.address}</p>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <p className="text-sm text-gray-600 dark:text-gray-400"><span className="font-semibold">Specialization:</span> {teacherProfile.specialization}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {topStats.map((stat, index) => (
          <div key={index} className="card hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={stat.bgColor + " p-3 rounded-lg"}>
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 text-sm mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">{stat.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{stat.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Attendance & Salary Reports Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Attendance Report Card */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <UserCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
              Attendance Report
            </h3>
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
              This Month
            </span>
          </div>

          {/* Donut Chart */}
          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={attendanceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={100}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={2}
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={ATTENDANCE_COLORS[index % ATTENDANCE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="grid grid-cols-3 gap-4 mt-6 w-full">
              {attendanceData.map((item, index) => (
                <div key={index} className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: ATTENDANCE_COLORS[index] }}
                    />
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">{item.name}</span>
                  </div>
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{item.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.percentage}%</p>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Trend */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Monthly Attendance Trend</h4>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={monthlyAttendanceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#6b7280" />
                <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" domain={[85, 100]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="percentage" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Salary Report Card */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              Salary Report
            </h3>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded-full">
              November 2024
            </span>
          </div>

          {/* Net Salary Display */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white mb-6">
            <p className="text-sm opacity-90 mb-1">Net Salary</p>
            <p className="text-4xl font-bold mb-2">{salaryInfo.currency}{salaryInfo.netSalary.toLocaleString()}</p>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>Paid on November 1, 2024</span>
            </div>
          </div>

          {/* Salary Breakdown */}
          <div className="space-y-4">
            {/* Basic Salary */}
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-green-600 dark:text-green-400" />
                  Basic Salary
                </h4>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  {salaryInfo.currency}{salaryInfo.basicSalary.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Allowances */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Allowances
                </h4>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  +{salaryInfo.currency}{Object.values(salaryInfo.allowances).reduce((a, b) => a + b, 0).toLocaleString()}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>House Rent</span>
                  <span className="font-semibold">{salaryInfo.currency}{salaryInfo.allowances.houseRent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Transport</span>
                  <span className="font-semibold">{salaryInfo.currency}{salaryInfo.allowances.transport.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Medical</span>
                  <span className="font-semibold">{salaryInfo.currency}{salaryInfo.allowances.medical.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Special Allowance</span>
                  <span className="font-semibold">{salaryInfo.currency}{salaryInfo.allowances.special.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                  Deductions
                </h4>
                <span className="text-lg font-bold text-red-600 dark:text-red-400">
                  -{salaryInfo.currency}{Object.values(salaryInfo.deductions).reduce((a, b) => a + b, 0).toLocaleString()}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Income Tax</span>
                  <span className="font-semibold">{salaryInfo.currency}{salaryInfo.deductions.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Insurance</span>
                  <span className="font-semibold">{salaryInfo.currency}{salaryInfo.deductions.insurance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Provident Fund</span>
                  <span className="font-semibold">{salaryInfo.currency}{salaryInfo.deductions.providentFund.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Payment History */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Recent Payment History
            </h4>
            <div className="space-y-2">
              {salaryHistory.map((payment, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{payment.month}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{payment.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{salaryInfo.currency}{payment.amount.toLocaleString()}</p>
                    <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                      <CheckCircle className="w-3 h-3" />
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Schedule & Activities */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickStats.map((stat, index) => (
              <div key={index} className="card hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`${stat.iconBg} p-2.5 rounded-lg`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-gray-800 dark:text-gray-100 text-sm font-semibold">{stat.title}</h3>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">{stat.value}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{stat.subtitle}</p>
              </div>
            ))}
          </div>

          {/* Today's Schedule */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                Today's Schedule
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
            </div>
            <div className="space-y-3">
              {todaySchedule.map((schedule, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div className="text-center min-w-[80px]">
                    <p className="text-sm font-semibold text-primary-600 dark:text-primary-400">{schedule.time}</p>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 dark:text-gray-100">{schedule.class}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{schedule.subject} • {schedule.room}</p>
                  </div>
                  <button className="px-3 py-1 text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors">
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="card">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              Recent Activities
            </h3>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'homework' ? 'bg-orange-100 dark:bg-orange-900/30' :
                    activity.type === 'message' ? 'bg-blue-100 dark:bg-blue-900/30' :
                    activity.type === 'attendance' ? 'bg-green-100 dark:bg-green-900/30' :
                    'bg-purple-100 dark:bg-purple-900/30'
                  }`}>
                    {activity.type === 'homework' && <BookOpenCheck className="w-4 h-4 text-orange-600 dark:text-orange-400" />}
                    {activity.type === 'message' && <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                    {activity.type === 'attendance' && <ClipboardCheck className="w-4 h-4 text-green-600 dark:text-green-400" />}
                    {activity.type === 'exam' && <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{activity.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{activity.class}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
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

          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-3 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors">
                <ClipboardCheck className="w-5 h-5" />
                <span className="text-sm font-medium">Mark Attendance</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
                <BookOpenCheck className="w-5 h-5" />
                <span className="text-sm font-medium">Assign Homework</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <Award className="w-5 h-5" />
                <span className="text-sm font-medium">Enter Marks</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <Video className="w-5 h-5" />
                <span className="text-sm font-medium">Start Live Class</span>
              </button>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="card bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-2 border-primary-200 dark:border-primary-800">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">This Month</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Classes Conducted</span>
                <span className="text-lg font-bold text-primary-600 dark:text-primary-400">68</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Homework Assigned</span>
                <span className="text-lg font-bold text-primary-600 dark:text-primary-400">24</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Tests Conducted</span>
                <span className="text-lg font-bold text-primary-600 dark:text-primary-400">8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Avg. Attendance</span>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">94.2%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
