import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, BookOpen, ClipboardCheck, Award, TrendingUp, UserCheck, UserX, BookOpenCheck, MessageSquare, Video, ChevronLeft, ChevronRight, Mail, Phone, MapPin, Briefcase, GraduationCap, DollarSign, CreditCard, TrendingDown, CheckCircle, Clock, Building } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import toast from 'react-hot-toast';
import * as classApi from '../../../services/classApi';
import * as studentApi from '../../../services/studentApi';
import { attendanceApi } from '../../../services/attendanceApi';
import { salaryApi } from '../../../services/salaryApi';
import timetableApi from '../../../services/timetableApi';

const Home = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [stats, setStats] = useState({
    myClasses: 0,
    totalStudents: 0,
    pendingHomework: 0,
    upcomingTests: 0,
    todaySchedule: [],
    unreadMessages: 0,
    pendingReviews: 0
  });
  const [profile, setProfile] = useState({});
  const [attendanceSummary, setAttendanceSummary] = useState({
    present: 0,
    absent: 0,
    late: 0,
    percentage: 0
  });
  const [salaryData, setSalaryData] = useState(null);
  const [scheduleToday, setScheduleToday] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [performance, setPerformance] = useState({
    classesConducted: 0,
    homeworkAssigned: 0,
    testsConducted: 0,
    avgAttendance: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const todayIso = new Date().toISOString().split('T')[0];

        // Classes and students
        const [classesRes, studentsRes] = await Promise.allSettled([
          classApi.getAllClasses({ limit: 1000 }),
          studentApi.getStudents()
        ]);

        const classList =
          classesRes.status === 'fulfilled'
            ? classesRes.value?.data || classesRes.value?.data?.data || classesRes.value?.data?.classes || []
            : [];

        let totalStudents = classList.reduce(
          (sum, cls) => sum + (Array.isArray(cls.students) ? cls.students.length : cls.studentCount || 0),
          0
        );

        if (totalStudents === 0 && studentsRes.status === 'fulfilled') {
          const studentsList = studentsRes.value?.data || studentsRes.value?.data?.data || studentsRes.value || [];
          if (Array.isArray(studentsList)) {
            totalStudents = studentsList.length;
          }
        }

        setStats(prev => ({
          ...prev,
          myClasses: classList.length || 0,
          totalStudents
        }));

        // Teacher profile (conditional fields only)
        setProfile({
          name: user.name || user.employeeName,
          designation: user.employeeRole || user.designation,
          employeeId: user.employeeId || user.id || user._id,
          email: user.email || user.emailAddress,
          phone: user.mobileNo || user.phone,
          department: user.department,
          experience: user.experience,
          qualification: user.education || user.qualification,
          joiningDate: user.dateOfJoining
            ? new Date(user.dateOfJoining).toLocaleDateString()
            : user.joiningDate,
          address: user.homeAddress || user.address,
          specialization: user.specialization
        });

        // Attendance (class-wise for today)
        try {
          const attendanceRes = await attendanceApi.getClassWiseReport(todayIso);
          const rows = attendanceRes?.data || attendanceRes || [];
          let present = 0;
          let absent = 0;
          let late = 0;
          rows.forEach(r => {
            present += r.present || r.presentCount || 0;
            absent += r.absent || r.absentCount || 0;
            late += r.late || r.lateCount || 0;
          });
          const total = present + absent + late;
          const percentage = total ? (present / total) * 100 : 0;
          setAttendanceSummary({ present, absent, late, percentage: Number(percentage.toFixed(1)) });
          setStats(prev => ({
            ...prev,
            todaySchedule: prev.todaySchedule,
            pendingHomework: prev.pendingHomework,
            pendingReviews: prev.pendingReviews,
            unreadMessages: prev.unreadMessages
          }));
          setPerformance(prev => ({ ...prev, avgAttendance: Number(percentage.toFixed(1)) }));
        } catch (error) {
          console.warn('Attendance fetch failed, defaulting to zero', error);
          setAttendanceSummary({ present: 0, absent: 0, late: 0, percentage: 0 });
          setPerformance(prev => ({ ...prev, avgAttendance: 0 }));
        }

        // Salary (graceful fallback)
        try {
          const salaryRes = await salaryApi.getSalaryReport({ employeeId: user._id || user.id });
          const salaryPayload = salaryRes?.data || salaryRes;
          if (salaryPayload) {
            const latest = Array.isArray(salaryPayload.records)
              ? salaryPayload.records[0]
              : salaryPayload.records || salaryPayload;
            const allowancesTotal = latest?.allowances ? Object.values(latest.allowances).reduce((a, b) => a + b, 0) : 0;
            const deductionsTotal = latest?.deductions ? Object.values(latest.deductions).reduce((a, b) => a + b, 0) : 0;
            const net = (latest?.basicSalary || 0) + allowancesTotal - deductionsTotal;
            setSalaryData({
              basicSalary: latest?.basicSalary || 0,
              allowances: latest?.allowances || {},
              deductions: latest?.deductions || {},
              netSalary: net,
              history: latest?.history || [],
              month: latest?.month,
              paidOn: latest?.paidOn
            });
          } else {
            setSalaryData(null);
          }
        } catch (error) {
          console.warn('Salary fetch failed, hiding salary section', error);
          setSalaryData(null);
        }

        // Timetable / Today schedule
        try {
          const timetableRes = await timetableApi.getTimetableByTeacher(user._id || user.id);
          const grouped = timetableRes?.data?.groupedByDay || timetableRes?.groupedByDay || [];
          const todayName = new Date().toLocaleDateString('en-US', { weekday: 'short' });
          const todayGroup =
            grouped.find(g => g.day?.shortName === todayName) ||
            grouped.find(g => g.day?.name?.startsWith(todayName)) ||
            null;
          const periods = todayGroup?.periods || [];
          const mapped = periods
            .filter(p => !p.isBreak)
            .map(p => ({
              time:
                (p.periodId?.startTime && p.periodId?.endTime
                  ? `${p.periodId.startTime} - ${p.periodId.endTime}`
                  : 'Time'),
              class: p.className || p.classId?.className || 'Class',
              section: p.section || p.classId?.section,
              subject: p.subjectName || p.subjectId?.name || 'Subject',
              room: p.roomName || p.roomId?.name || ''
            }));
          setScheduleToday(mapped);
          setPerformance(prev => ({
            ...prev,
            classesConducted: periods.filter(p => !p.isBreak).length
          }));
        } catch (error) {
          console.warn('Timetable fetch failed, defaulting empty schedule', error);
          setScheduleToday([]);
        }

        // Recent activities placeholder from existing data (notifications service not wired yet)
        setRecentActivities([]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  // Top Stats Cards (data-driven, default 0)
  const topStats = [
    {
      title: 'My Classes',
      value: stats.myClasses || 0,
      subtitle: 'Active Classes',
      icon: Users,
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Total Students',
      value: stats.totalStudents || 0,
      subtitle: 'Across assigned classes',
      icon: Users,
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      title: 'Pending Reviews',
      value: stats.pendingReviews || 0,
      subtitle: 'Homework & assignments',
      icon: BookOpenCheck,
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      textColor: 'text-orange-600 dark:text-orange-400'
    },
    {
      title: 'Upcoming Tests',
      value: stats.upcomingTests || 0,
      subtitle: 'This week',
      icon: ClipboardCheck,
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400'
    }
  ];

  // Quick Stats (today)
  const quickStats = [
    {
      title: "Today's Attendance",
      value: `${attendanceSummary.percentage || 0}%`,
      subtitle: `${attendanceSummary.present || 0} present`,
      icon: UserCheck,
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400',
      iconBg: 'bg-green-500'
    },
    {
      title: 'Absent Today',
      value: `${attendanceSummary.absent || 0}`,
      subtitle: 'Students absent',
      icon: UserX,
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      textColor: 'text-red-600 dark:text-red-400',
      iconBg: 'bg-red-500'
    },
    {
      title: 'Pending Reviews',
      value: `${stats.pendingReviews || 0}`,
      subtitle: 'Homework & Assignments',
      icon: BookOpenCheck,
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      textColor: 'text-orange-600 dark:text-orange-400',
      iconBg: 'bg-orange-500'
    },
    {
      title: 'Unread Messages',
      value: `${stats.unreadMessages || 0}`,
      subtitle: 'From students & parents',
      icon: MessageSquare,
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-500'
    }
  ];

  // Attendance Report Data (Monthly) - derived with fallback to zero
  const attendanceData = [
    { name: 'Present', value: attendanceSummary.present || 0, percentage: attendanceSummary.percentage || 0 },
    { name: 'Absent', value: attendanceSummary.absent || 0, percentage: attendanceSummary.absent || 0 },
    { name: 'Late', value: attendanceSummary.late || 0, percentage: attendanceSummary.late || 0 }
  ];

  const ATTENDANCE_COLORS = ['#10b981', '#ef4444', '#f59e0b'];

  // Monthly Attendance Trend (placeholder from summary; if no data, stays empty)
  const monthlyAttendanceTrend = useMemo(() => {
    return [
      { month: 'This Month', percentage: attendanceSummary.percentage || 0 }
    ];
  }, [attendanceSummary.percentage]);

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
          Welcome back, {profile.name || 'Teacher'}! 👋
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
                {(profile.name || 'T').split(' ').map(n => n[0]).join('')}
              </div>
              <div className="absolute bottom-0 right-0 w-10 h-10 bg-green-500 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-center lg:text-left mt-4 space-y-1">
              {profile.name && <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{profile.name}</h2>}
              {profile.designation && <p className="text-primary-600 dark:text-primary-400 font-semibold">{profile.designation}</p>}
              {profile.employeeId && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">ID: {profile.employeeId}</p>}
            </div>
          </div>

          {/* Detailed Information Grid */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Email Address', icon: Mail, value: profile.email },
              { label: 'Phone Number', icon: Phone, value: profile.phone },
              { label: 'Department', icon: Building, value: profile.department },
              { label: 'Experience', icon: Briefcase, value: profile.experience },
              { label: 'Qualification', icon: GraduationCap, value: profile.qualification },
              { label: 'Joining Date', icon: Calendar, value: profile.joiningDate }
            ]
              .filter(field => Boolean(field.value))
              .map(field => (
                <div key={field.label} className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="p-2 bg-gray-100 dark:bg-gray-900/30 rounded-lg">
                    <field.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{field.label}</p>
                    <p className="text-sm text-gray-800 dark:text-gray-200 font-semibold">{field.value}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Additional Info Bar */}
        {(profile.address || profile.specialization) && (
          <div className="mt-6 pt-6 border-t border-blue-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <p className="text-sm text-gray-600 dark:text-gray-400"><span className="font-semibold">Address:</span> {profile.address}</p>
                </div>
              )}
              {profile.specialization && (
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <p className="text-sm text-gray-600 dark:text-gray-400"><span className="font-semibold">Specialization:</span> {profile.specialization}</p>
                </div>
              )}
            </div>
          </div>
        )}
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
            {salaryData?.month && (
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded-full">
                {salaryData.month}
              </span>
            )}
          </div>

          {salaryData ? (
            <>
              {/* Net Salary Display */}
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white mb-6">
                <p className="text-sm opacity-90 mb-1">Net Salary</p>
                <p className="text-4xl font-bold mb-2">₹{(salaryData.netSalary || 0).toLocaleString()}</p>
                {salaryData.paidOn && (
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>Paid on {salaryData.paidOn}</span>
                  </div>
                )}
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
                      ₹{(salaryData.basicSalary || 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Allowances */}
                {salaryData.allowances && Object.keys(salaryData.allowances).length > 0 && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        Allowances
                      </h4>
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        +₹{Object.values(salaryData.allowances).reduce((a, b) => a + b, 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      {Object.entries(salaryData.allowances).map(([key, val]) => (
                        <div key={key} className="flex justify-between text-gray-600 dark:text-gray-400">
                          <span>{key}</span>
                          <span className="font-semibold">₹{(val || 0).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Deductions */}
                {salaryData.deductions && Object.keys(salaryData.deductions).length > 0 && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                        Deductions
                      </h4>
                      <span className="text-lg font-bold text-red-600 dark:text-red-400">
                        -₹{Object.values(salaryData.deductions).reduce((a, b) => a + b, 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      {Object.entries(salaryData.deductions).map(([key, val]) => (
                        <div key={key} className="flex justify-between text-gray-600 dark:text-gray-400">
                          <span>{key}</span>
                          <span className="font-semibold">₹{(val || 0).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">Salary data not available.</p>
          )}
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
              {scheduleToday.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">No schedule for today.</p>
              )}
              {scheduleToday.map((schedule, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div className="text-center min-w-[80px]">
                    <p className="text-sm font-semibold text-primary-600 dark:text-primary-400">{schedule.time}</p>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 dark:text-gray-100">{schedule.class}{schedule.section ? `-${schedule.section}` : ''}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{schedule.subject}{schedule.room ? ` • ${schedule.room}` : ''}</p>
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
              {recentActivities.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">No recent activities available.</p>
              )}
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
                      {activity.class && (
                        <>
                          <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{activity.class}</span>
                        </>
                      )}
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
              <button
                onClick={() => navigate('/teacher/attendance')}
                className="w-full flex items-center gap-3 p-3 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
              >
                <ClipboardCheck className="w-5 h-5" />
                <span className="text-sm font-medium">Mark Attendance</span>
              </button>
              <button
                onClick={() => navigate('/teacher/homework')}
                className="w-full flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
              >
                <BookOpenCheck className="w-5 h-5" />
                <span className="text-sm font-medium">Assign Homework</span>
              </button>
              <button
                onClick={() => navigate('/teacher/exams')}
                className="w-full flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
              >
                <Award className="w-5 h-5" />
                <span className="text-sm font-medium">Enter Marks</span>
              </button>
              <button
                onClick={() => navigate('/teacher/live-class')}
                className="w-full flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
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
                <span className="text-lg font-bold text-primary-600 dark:text-primary-400">{performance.classesConducted || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Homework Assigned</span>
                <span className="text-lg font-bold text-primary-600 dark:text-primary-400">{performance.homeworkAssigned || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Tests Conducted</span>
                <span className="text-lg font-bold text-primary-600 dark:text-primary-400">{performance.testsConducted || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Avg. Attendance</span>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">{performance.avgAttendance || 0}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
