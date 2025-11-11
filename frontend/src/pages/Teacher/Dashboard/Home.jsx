import { useState } from 'react';
import { Users, Calendar, BookOpen, ClipboardCheck, Award, TrendingUp, UserCheck, UserX, BookOpenCheck, MessageSquare, Video, ChevronLeft, ChevronRight } from 'lucide-react';

const Home = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [currentDate, setCurrentDate] = useState(new Date());

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
      value: '5',
      subtitle: 'Active Classes',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Total Students',
      value: '156',
      subtitle: 'Across all classes',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      title: 'Pending Homework',
      value: '12',
      subtitle: 'To be reviewed',
      icon: BookOpenCheck,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      textColor: 'text-orange-600 dark:text-orange-400'
    },
    {
      title: 'Upcoming Tests',
      value: '3',
      subtitle: 'This week',
      icon: ClipboardCheck,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400'
    },
  ];

  // Today's Schedule
  const todaySchedule = [
    { time: '09:00 AM', class: 'Class 10-A', subject: 'Mathematics', room: 'Room 101' },
    { time: '10:30 AM', class: 'Class 9-B', subject: 'Mathematics', room: 'Room 203' },
    { time: '12:00 PM', class: 'Class 10-C', subject: 'Mathematics', room: 'Room 105' },
    { time: '02:00 PM', class: 'Class 8-A', subject: 'Mathematics', room: 'Room 201' },
  ];

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
