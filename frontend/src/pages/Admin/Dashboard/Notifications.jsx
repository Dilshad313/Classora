import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, ChevronRight, Bell, Check, Trash2, Filter, Search, 
  CheckCheck, AlertCircle, Info, Award, Calendar, Users, 
  FileText, DollarSign, Clock, X, Plus, Send, Pin, PinOff,
  Loader2
} from 'lucide-react';
import { notificationApi } from '../../../services/notificationApi';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Fetch notifications from API
  useEffect(() => {
    fetchNotifications();
    fetchStats();
  }, [pagination.page, statusFilter, priorityFilter, categoryFilter, searchTerm]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        priority: priorityFilter !== 'all' ? priorityFilter : undefined,
        category: categoryFilter !== 'all' ? categoryFilter : undefined
      };

      const response = await notificationApi.getAllNotifications(filters);
      
      if (response.success && response.data) {
        setNotifications(response.data.notifications || []);
        setPagination(response.data.pagination || pagination);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await notificationApi.getNotificationStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const getTypeStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'warning':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
      case 'error':
        return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800';
      case 'info':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600';
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) {
      return;
    }

    try {
      await notificationApi.deleteNotification(id);
      setNotifications(notifications.filter(notif => notif._id !== id));
      fetchStats();
    } catch (err) {
      console.error('Error deleting notification:', err);
      alert('Failed to delete notification: ' + err.message);
    }
  };

  const handleTogglePin = async (id) => {
    try {
      await notificationApi.togglePin(id);
      fetchNotifications();
    } catch (err) {
      console.error('Error toggling pin:', err);
      alert('Failed to toggle pin: ' + err.message);
    }
  };

  const handleSendNow = async (id) => {
    if (!window.confirm('Are you sure you want to send this notification now?')) {
      return;
    }

    try {
      await notificationApi.sendNotification(id);
      fetchNotifications();
      fetchStats();
      alert('Notification sent successfully!');
    } catch (err) {
      console.error('Error sending notification:', err);
      alert('Failed to send notification: ' + err.message);
    }
  };

  const handleCancelScheduled = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this scheduled notification?')) {
      return;
    }

    try {
      await notificationApi.cancelNotification(id);
      fetchNotifications();
      alert('Notification cancelled successfully!');
    } catch (err) {
      console.error('Error cancelling notification:', err);
      alert('Failed to cancel notification: ' + err.message);
    }
  };

  const clearAll = () => {
    if (window.confirm('Are you sure you want to clear all notifications? This action cannot be undone.')) {
      alert('Bulk delete functionality coming soon!');
    }
  };

  const getNotificationIcon = (category) => {
    const iconMap = {
      'academic': Award,
      'attendance': Users,
      'fees': DollarSign,
      'event': Calendar,
      'exam': FileText,
      'general': Info,
      'holiday': Calendar,
      'meeting': Users,
      'maintenance': AlertCircle
    };
    return iconMap[category?.toLowerCase()] || Bell;
  };

  const formatTimestamp = (date) => {
    if (!date) return 'Unknown';
    const notifDate = new Date(date);
    const now = new Date();
    const diffMs = now - notifDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return notifDate.toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const totalNotifications = stats?.overview?.total || notifications.length;

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
                onClick={() => navigate('/dashboard/notifications/create')}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-lg"
              >
                <Plus className="w-4 h-4" />
                Create New
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
              <div className="space-y-3">
                {/* Status Filters */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Status</label>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'sent', 'scheduled', 'draft'].map(status => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                          statusFilter === status
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Priority Filters */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Priority</label>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'urgent', 'high', 'medium', 'low'].map(priority => (
                      <button
                        key={priority}
                        onClick={() => setPriorityFilter(priority)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                          priorityFilter === priority
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {priority}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category Filters */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'academic', 'attendance', 'fees', 'event', 'exam', 'general', 'holiday', 'meeting'].map(category => (
                      <button
                        key={category}
                        onClick={() => setCategoryFilter(category)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                          categoryFilter === category
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">Loading notifications...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              <div>
                <h3 className="font-bold text-red-900 dark:text-red-100">Error Loading Notifications</h3>
                <p className="text-red-700 dark:text-red-300 text-sm mt-1">{error}</p>
                <button
                  onClick={fetchNotifications}
                  className="mt-2 text-sm text-red-600 dark:text-red-400 underline hover:no-underline"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notifications List */}
        {!loading && (
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bell className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">No Notifications</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto text-lg">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'No notifications match your search or filter criteria.' 
                    : 'You\'re all caught up! No new notifications at the moment.'}
                </p>
              </div>
            ) : (
              notifications.map((notification) => {
                const IconComponent = getNotificationIcon(notification.category);
                const isPinned = notification.isPinned;
                const isScheduled = notification.status === 'scheduled';
                const isDraft = notification.status === 'draft';
                
                return (
                  <div
                    key={notification._id}
                    className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 transition-all hover:shadow-xl ${
                      isPinned 
                        ? 'border-yellow-300 dark:border-yellow-700 bg-yellow-50/30 dark:bg-yellow-900/10' 
                        : 'border-gray-200 dark:border-gray-700'
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
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                  {notification.title}
                                </h3>
                                {isPinned && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-xs font-semibold">
                                    <Pin className="w-3 h-3" />
                                    Pinned
                                  </span>
                                )}
                                {isScheduled && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-semibold">
                                    <Clock className="w-3 h-3" />
                                    Scheduled
                                  </span>
                                )}
                                {isDraft && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-semibold">
                                    Draft
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-semibold capitalize">
                                  {notification.category}
                                </span>
                                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                                  notification.priority === 'urgent' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                                  notification.priority === 'high' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' :
                                  notification.priority === 'medium' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                                  'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                }`}>
                                  {notification.priority}
                                </span>
                                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                                  notification.status === 'sent' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                                  notification.status === 'scheduled' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                                  notification.status === 'draft' ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300' :
                                  'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                }`}>
                                  {notification.status}
                                </span>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1">
                              {isScheduled && (
                                <button
                                  onClick={() => handleSendNow(notification._id)}
                                  className="p-2 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-all text-green-600 dark:text-green-400"
                                  title="Send Now"
                                >
                                  <Send className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => handleTogglePin(notification._id)}
                                className="p-2 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded-lg transition-all text-yellow-600 dark:text-yellow-400"
                                title={isPinned ? "Unpin" : "Pin"}
                              >
                                {isPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => navigate(`/dashboard/notifications/${notification._id}`)}
                                className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-all text-blue-600 dark:text-blue-400"
                                title="View Details"
                              >
                                <Info className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(notification._id)}
                                className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all text-red-600 dark:text-red-400"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-3 line-clamp-2">
                            {notification.message}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{formatTimestamp(notification.createdAt)}</span>
                              </div>
                              {notification.readCount > 0 && (
                                <div className="flex items-center gap-1">
                                  <Check className="w-4 h-4" />
                                  <span>{notification.readPercentage}% read</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Stats Summary */}
        {notifications.length > 0 && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Notification Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalNotifications}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total</p>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats?.overview?.sent || 0}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Sent</p>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats?.overview?.scheduled || 0}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Scheduled</p>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{stats?.overview?.draft || 0}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Draft</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;