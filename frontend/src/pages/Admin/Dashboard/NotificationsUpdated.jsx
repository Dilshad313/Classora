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

  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Fetch notifications from API
  useEffect(() => {
    fetchNotifications();
    fetchStats();
  }, [pagination.page, statusFilter, priorityFilter, categoryFilter]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== undefined) {
        fetchNotifications();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

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
      case 'info':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'error':
        return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800';
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

  const totalNotifications = stats?.overview?.total || notifications.length;
  const sentCount = stats?.overview?.sent || 0;
  const scheduledCount = stats?.overview?.scheduled || 0;
  const draftCount = stats?.overview?.draft || 0;

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
                    {loading ? 'Loading...' : `${totalNotifications} total notification${totalNotifications !== 1 ? 's' : ''}`}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => alert('Create notification page coming soon!')}
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
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr