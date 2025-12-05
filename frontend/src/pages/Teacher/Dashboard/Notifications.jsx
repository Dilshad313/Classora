import { useState, useEffect } from 'react';
import { 
  Bell, CheckCircle, AlertCircle, Info, MessageSquare, Calendar, 
  BookOpen, Users, Award, Clock, Filter, Search, MoreVertical,
  Trash2, Mail, Archive, Settings, RefreshCw, X
} from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [showActionMenu, setShowActionMenu] = useState(null);

  // Mock notification data
  const mockNotifications = [
    {
      id: 1,
      type: 'homework',
      title: 'New Homework Submission',
      message: 'John Doe has submitted homework for Mathematics - Chapter 5',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      isRead: false,
      priority: 'medium',
      actionUrl: '/teacher/homework',
      sender: 'System',
      category: 'Academic'
    },
    {
      id: 2,
      type: 'message',
      title: 'New Message from Parent',
      message: 'Sarah Johnson\'s parent has sent you a message regarding her performance',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      isRead: false,
      priority: 'high',
      actionUrl: '/teacher/messaging',
      sender: 'Robert Johnson',
      category: 'Communication'
    },
    {
      id: 3,
      type: 'attendance',
      title: 'Attendance Reminder',
      message: 'Please mark attendance for Class 10-A for today\'s session',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      isRead: true,
      priority: 'medium',
      actionUrl: '/teacher/attendance/students',
      sender: 'System',
      category: 'Administrative'
    },
    {
      id: 4,
      type: 'exam',
      title: 'Exam Schedule Updated',
      message: 'Mathematics exam for Class 10-A has been rescheduled to next Friday',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      isRead: true,
      priority: 'high',
      actionUrl: '/teacher/exams',
      sender: 'Administration',
      category: 'Academic'
    },
    {
      id: 5,
      type: 'achievement',
      title: 'Student Achievement',
      message: 'Emma Wilson has won first prize in the Science Fair competition',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      isRead: true,
      priority: 'low',
      actionUrl: '/teacher/reports/student-card',
      sender: 'System',
      category: 'Achievement'
    },
    {
      id: 6,
      type: 'system',
      title: 'System Maintenance',
      message: 'Scheduled system maintenance will occur this weekend from 2 AM to 4 AM',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      isRead: false,
      priority: 'medium',
      actionUrl: null,
      sender: 'IT Department',
      category: 'System'
    },
    {
      id: 7,
      type: 'meeting',
      title: 'Staff Meeting Reminder',
      message: 'Monthly staff meeting scheduled for tomorrow at 3:00 PM in the conference room',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      isRead: true,
      priority: 'medium',
      actionUrl: '/teacher/timetable',
      sender: 'Principal Office',
      category: 'Administrative'
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setNotifications(mockNotifications);
      setFilteredNotifications(mockNotifications);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterNotifications();
  }, [selectedFilter, searchTerm, notifications]);

  const filterNotifications = () => {
    let filtered = notifications;

    // Filter by type
    if (selectedFilter !== 'all') {
      if (selectedFilter === 'unread') {
        filtered = filtered.filter(n => !n.isRead);
      } else if (selectedFilter === 'read') {
        filtered = filtered.filter(n => n.isRead);
      } else {
        filtered = filtered.filter(n => n.type === selectedFilter);
      }
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.sender.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredNotifications(filtered);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'homework': return <BookOpen className="w-5 h-5" />;
      case 'message': return <MessageSquare className="w-5 h-5" />;
      case 'attendance': return <Users className="w-5 h-5" />;
      case 'exam': return <Calendar className="w-5 h-5" />;
      case 'achievement': return <Award className="w-5 h-5" />;
      case 'system': return <Settings className="w-5 h-5" />;
      case 'meeting': return <Clock className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'high') return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
    
    switch (type) {
      case 'homework': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
      case 'message': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'attendance': return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30';
      case 'exam': return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30';
      case 'achievement': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
      case 'system': return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30';
      case 'meeting': return 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const markAsUnread = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: false } : n)
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    setSelectedNotifications(prev => prev.filter(nId => nId !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      // In a real app, you would navigate to the action URL
      console.log('Navigate to:', notification.actionUrl);
    }
  };

  const toggleNotificationSelection = (id) => {
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(nId => nId !== id)
        : [...prev, id]
    );
  };

  const handleBulkAction = (action) => {
    switch (action) {
      case 'markRead':
        setNotifications(prev => 
          prev.map(n => selectedNotifications.includes(n.id) ? { ...n, isRead: true } : n)
        );
        break;
      case 'markUnread':
        setNotifications(prev => 
          prev.map(n => selectedNotifications.includes(n.id) ? { ...n, isRead: false } : n)
        );
        break;
      case 'delete':
        setNotifications(prev => prev.filter(n => !selectedNotifications.includes(n.id)));
        break;
    }
    setSelectedNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filterOptions = [
    { value: 'all', label: 'All Notifications', count: notifications.length },
    { value: 'unread', label: 'Unread', count: unreadCount },
    { value: 'read', label: 'Read', count: notifications.length - unreadCount },
    { value: 'homework', label: 'Homework', count: notifications.filter(n => n.type === 'homework').length },
    { value: 'message', label: 'Messages', count: notifications.filter(n => n.type === 'message').length },
    { value: 'attendance', label: 'Attendance', count: notifications.filter(n => n.type === 'attendance').length },
    { value: 'exam', label: 'Exams', count: notifications.filter(n => n.type === 'exam').length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <Bell className="w-7 h-7" />
            Notifications
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Stay updated with important announcements and activities
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={markAllAsRead}
            className="btn-secondary flex items-center gap-2"
            disabled={unreadCount === 0}
          >
            <CheckCircle className="w-4 h-4" />
            Mark All Read
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3">
            <Bell className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{notifications.length}</p>
            </div>
          </div>
        </div>
        <div className="card bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Unread</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{unreadCount}</p>
            </div>
          </div>
        </div>
        <div className="card bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Messages</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {notifications.filter(n => n.type === 'message').length}
              </p>
            </div>
          </div>
        </div>
        <div className="card bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Academic</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {notifications.filter(n => ['homework', 'exam', 'attendance'].includes(n.type)).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="btn-secondary flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              {filterOptions.find(f => f.value === selectedFilter)?.label}
            </button>
            {showFilterMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-10">
                {filterOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSelectedFilter(option.value);
                      setShowFilterMenu(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between ${
                      selectedFilter === option.value ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    <span>{option.label}</span>
                    <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
                      {option.count}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedNotifications.length > 0 && (
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selectedNotifications.length} selected
            </span>
            <button
              onClick={() => handleBulkAction('markRead')}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Mark as Read
            </button>
            <button
              onClick={() => handleBulkAction('markUnread')}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Mark as Unread
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              className="text-sm text-red-600 dark:text-red-400 hover:underline"
            >
              Delete
            </button>
            <button
              onClick={() => setSelectedNotifications([])}
              className="text-sm text-gray-600 dark:text-gray-400 hover:underline ml-auto"
            >
              Clear Selection
            </button>
          </div>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="card">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="card text-center py-12">
            <Bell className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No notifications found
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              {searchTerm || selectedFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'You\'re all caught up! No new notifications at the moment.'
              }
            </p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div
              key={notification.id}
              className={`card hover:shadow-md transition-all cursor-pointer ${
                !notification.isRead ? 'border-l-4 border-l-primary-500 bg-primary-50/30 dark:bg-primary-900/10' : ''
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start gap-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedNotifications.includes(notification.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleNotificationSelection(notification.id);
                    }}
                    className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <div className={`p-3 rounded-full ${getNotificationColor(notification.type, notification.priority)}`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className={`font-semibold ${!notification.isRead ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}>
                        {notification.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-500">
                        <span>From: {notification.sender}</span>
                        <span>•</span>
                        <span>{notification.category}</span>
                        <span>•</span>
                        <span>{formatTimestamp(notification.timestamp)}</span>
                        {notification.priority === 'high' && (
                          <>
                            <span>•</span>
                            <span className="text-red-600 dark:text-red-400 font-medium">High Priority</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      )}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowActionMenu(showActionMenu === notification.id ? null : notification.id);
                          }}
                          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                        
                        {showActionMenu === notification.id && (
                          <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                notification.isRead ? markAsUnread(notification.id) : markAsRead(notification.id);
                                setShowActionMenu(null);
                              }}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                            >
                              <Mail className="w-4 h-4" />
                              Mark as {notification.isRead ? 'Unread' : 'Read'}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                                setShowActionMenu(null);
                              }}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-red-600 dark:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More Button */}
      {filteredNotifications.length > 0 && (
        <div className="text-center">
          <button className="btn-secondary">
            Load More Notifications
          </button>
        </div>
      )}
    </div>
  );
};

export default Notifications;
