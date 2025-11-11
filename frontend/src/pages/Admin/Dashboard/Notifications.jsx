import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, ChevronRight, Bell, Check, Trash2, Filter, Search, 
  CheckCheck, AlertCircle, Info, Award, Calendar, Users, 
  FileText, DollarSign, Clock, X
} from 'lucide-react';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      category: 'Academic',
      title: 'Exam Results Published',
      message: 'Grade 10 Mathematics exam results have been published successfully.',
      timestamp: '2 minutes ago',
      read: false,
      icon: Award
    },
    {
      id: 2,
      type: 'info',
      category: 'Attendance',
      title: 'Attendance Report Ready',
      message: 'Monthly attendance report for November is now available for download.',
      timestamp: '15 minutes ago',
      read: false,
      icon: Users
    },
    {
      id: 3,
      type: 'warning',
      category: 'Fees',
      title: 'Payment Reminder',
      message: '5 students have pending fee payments for this month.',
      timestamp: '1 hour ago',
      read: false,
      icon: DollarSign
    },
    {
      id: 4,
      type: 'info',
      category: 'Events',
      title: 'Upcoming Event',
      message: 'Annual Sports Day is scheduled for November 15, 2025.',
      timestamp: '2 hours ago',
      read: true,
      icon: Calendar
    },
    {
      id: 5,
      type: 'success',
      category: 'Certificates',
      title: 'Certificate Generated',
      message: 'Transfer certificate for Anjali A has been generated successfully.',
      timestamp: '3 hours ago',
      read: true,
      icon: FileText
    },
    {
      id: 6,
      type: 'info',
      category: 'Academic',
      title: 'New Assignment Posted',
      message: 'Mathematics teacher has posted a new assignment for Grade 10.',
      timestamp: '5 hours ago',
      read: true,
      icon: FileText
    },
    {
      id: 7,
      type: 'warning',
      category: 'System',
      title: 'System Maintenance',
      message: 'Scheduled maintenance on November 12, 2025 from 2:00 AM to 4:00 AM.',
      timestamp: '1 day ago',
      read: true,
      icon: AlertCircle
    },
    {
      id: 8,
      type: 'success',
      category: 'Staff',
      title: 'New Staff Member',
      message: 'Dr. Priya Sharma has joined as Physics Teacher.',
      timestamp: '2 days ago',
      read: true,
      icon: Users
    }
  ]);

  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['All', 'Academic', 'Attendance', 'Fees', 'Events', 'Certificates', 'Staff', 'System'];

  const getTypeStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'warning':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
      case 'info':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600';
    }
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const clearAll = () => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      setNotifications([]);
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    const matchesSearch = notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notif.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                         filterType === 'unread' && !notif.read ||
                         filterType === 'read' && notif.read ||
                         notif.category.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600" />
          <span className="text-gray-900 dark:text-gray-100 font-semibold">Notifications</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Notifications</h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="flex items-center gap-2 px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCheck className="w-4 h-4" />
                Mark All Read
              </button>
              <button
                onClick={clearAll}
                disabled={notifications.length === 0}
                className="flex items-center gap-2 px-4 py-2.5 border-2 border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full transition-all"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                showFilters 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterType === 'all'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setFilterType('unread')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterType === 'unread'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
                <button
                  onClick={() => setFilterType('read')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterType === 'read'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Read ({notifications.length - unreadCount})
                </button>
                <div className="w-px bg-gray-300 dark:bg-gray-600 mx-2"></div>
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setFilterType(category.toLowerCase())}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      filterType === category.toLowerCase()
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bell className="w-12 h-12 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">No Notifications</h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto text-lg">
                {searchTerm || filterType !== 'all' 
                  ? 'No notifications match your search or filter criteria.' 
                  : 'You\'re all caught up! No new notifications at the moment.'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => {
              const IconComponent = notification.icon;
              return (
                <div
                  key={notification.id}
                  className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 transition-all hover:shadow-xl ${
                    notification.read 
                      ? 'border-gray-200 dark:border-gray-700' 
                      : 'border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/10'
                  }`}
                >
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border-2 ${getTypeStyles(notification.type)}`}>
                        <IconComponent className="w-6 h-6" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className={`text-lg font-bold ${notification.read ? 'text-gray-900 dark:text-gray-100' : 'text-blue-900 dark:text-blue-100'}`}>
                                {notification.title}
                              </h3>
                              {!notification.read && (
                                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                              )}
                            </div>
                            <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-semibold">
                              {notification.category}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-all text-blue-600 dark:text-blue-400"
                                title="Mark as read"
                              >
                                <Check className="w-5 h-5" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all text-red-600 dark:text-red-400"
                              title="Delete"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>{notification.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Stats Summary */}
        {notifications.length > 0 && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Notification Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{notifications.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total</p>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{unreadCount}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Unread</p>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{notifications.length - unreadCount}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Read</p>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {notifications.filter(n => n.type === 'warning').length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Important</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
