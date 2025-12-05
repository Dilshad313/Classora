import { useState } from 'react';
import { Users, DollarSign, Calendar, UserCheck, UserX, UserPlus, ArrowUpRight, ArrowDownRight, ChevronLeft, ChevronRight } from 'lucide-react';

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

  // Center Statistics
  const centerStats = [
    {
      title: 'Statistics for Income',
      value: '$125,450',
      change: '+18.5%',
      trend: 'up',
      icon: DollarSign,
      iconBg: 'bg-green-500'
    },
    {
      title: 'Statistics for Student',
      value: '1,245',
      change: '+12.3%',
      trend: 'up',
      icon: Users,
      iconBg: 'bg-blue-500'
    },
    {
      title: 'Today Absent Students',
      value: '23',
      change: '-5.2%',
      trend: 'down',
      icon: UserX,
      iconBg: 'bg-red-500'
    },
    {
      title: 'Today Present Employees',
      value: '82',
      change: '+2.1%',
      trend: 'up',
      icon: UserCheck,
      iconBg: 'bg-purple-500'
    },
    {
      title: 'New Admissions',
      value: '45',
      change: '+28.4%',
      trend: 'up',
      icon: UserPlus,
      iconBg: 'bg-orange-500'
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
          Here's what's happening in Future Leaders Academy today
        </p>
      </div>

      {/* Main Layout: Center Stats + Right Sidebar */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Center Column - Statistics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Center Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {centerStats.map((stat, index) => (
              <div key={index} className="card hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.iconBg} p-3 rounded-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-sm font-semibold flex items-center gap-1 ${stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-gray-600 dark:text-gray-400 text-sm mb-2">{stat.title}</h3>
                <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{stat.value}</p>
              </div>
            ))}
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
            <p className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">$45,280</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Expected from 1,245 students</p>
            <div className="mt-4 pt-4 border-t border-primary-200 dark:border-primary-800">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Collected</span>
                <span className="font-semibold text-green-600 dark:text-green-400">$32,150 (71%)</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-600 dark:text-gray-400">Pending</span>
                <span className="font-semibold text-orange-600 dark:text-orange-400">$13,130 (29%)</span>
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
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">94.5%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '94.5%' }}></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">1,177 out of 1,245 students</p>
            </div>

            {/* Today Present Employees */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Today Present Employees</span>
                <span className="text-sm font-bold text-purple-600 dark:text-purple-400">94.3%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '94.3%' }}></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">82 out of 87 employees</p>
            </div>

            {/* This Month Fee Collection */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">This Month Fee Collection</span>
                <span className="text-sm font-bold text-green-600 dark:text-green-400">71.0%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '71%' }}></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">$32,150 out of $45,280</p>
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
