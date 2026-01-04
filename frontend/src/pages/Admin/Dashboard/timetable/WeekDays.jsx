import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Home,
  ChevronRight,
  CheckCircle2,
  Clock,
  Loader2,
  DoorOpen
} from 'lucide-react';
import { weekDayApi } from '../../../../services/timetableApi';
import { toast } from 'react-hot-toast';

const WeekDays = () => {
  const navigate = useNavigate();
  const [weekDays, setWeekDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDay, setEditingDay] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    isActive: true
  });
  const [stats, setStats] = useState({
    totalDays: 0,
    activeDays: 0
  });

  useEffect(() => {
    fetchWeekDays();
    fetchStats();
  }, []);

  const fetchWeekDays = async () => {
    try {
      setLoading(true);
      const data = await weekDayApi.getWeekDays();
      setWeekDays(data);
    } catch (error) {
      console.error('Error fetching week days:', error);
      toast.error('Failed to load week days');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await weekDayApi.getWeekDayStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await weekDayApi.toggleWeekDayActive(id);
      toast.success('Week day status updated');
      fetchWeekDays();
      fetchStats();
    } catch (error) {
      console.error('Error toggling active status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleEdit = (day) => {
    setEditingDay(day);
    setFormData({
      name: day.name,
      shortName: day.shortName,
      isActive: day.isActive
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this day?')) {
      try {
        await weekDayApi.deleteWeekDay(id);
        toast.success('Week day deleted successfully');
        fetchWeekDays();
        fetchStats();
      } catch (error) {
        console.error('Error deleting week day:', error);
        toast.error('Failed to delete week day');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const dayData = {
        ...formData,
        order: editingDay ? editingDay.order : weekDays.length + 1
      };

      if (editingDay) {
        await weekDayApi.updateWeekDay(editingDay._id, dayData);
        toast.success('Week day updated successfully');
      } else {
        await weekDayApi.createWeekDay(dayData);
        toast.success('Week day created successfully');
      }

      setShowAddModal(false);
      setEditingDay(null);
      setFormData({ name: '', shortName: '', isActive: true });
      fetchWeekDays();
      fetchStats();
    } catch (error) {
      console.error('Error saving week day:', error);
      toast.error(error.message || 'Failed to save week day');
    }
  };

  const handleCancel = () => {
    setShowAddModal(false);
    setEditingDay(null);
    setFormData({ name: '', shortName: '', isActive: true });
  };

  const activeDays = weekDays.filter(day => day.isActive).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading week days...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span className="text-blue-600 dark:text-blue-400 font-semibold">Timetable</span>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span className="text-gray-900 dark:text-gray-100 font-semibold">Week Days</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Week Days Management</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Configure working days for your institution</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/dashboard/timetable/periods')}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 dark:bg-purple-700 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-800 transition-all"
              >
                <Clock className="w-4 h-4" />
                <span className="font-medium">Time Periods</span>
              </button>
              <button
                onClick={() => navigate('/dashboard/timetable/classrooms')}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 dark:bg-indigo-700 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-800 transition-all"
              >
                <DoorOpen className="w-4 h-4" />
                <span className="font-medium">Classrooms</span>
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5" />
                <span className="font-semibold">Add Custom Day</span>
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Total Days</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-gray-100 mt-2">{stats.totalDays}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl flex items-center justify-center">
                <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Active Days</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-gray-100 mt-2">{stats.activeDays}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-2xl flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Working Days</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-gray-100 mt-2">{activeDays}/week</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-2xl flex items-center justify-center">
                <Clock className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Week Days Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {weekDays.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-10 h-10 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No Week Days Found</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Get started by creating your first week day</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all"
              >
                <Plus className="w-5 h-5" />
                <span className="font-semibold">Add Week Day</span>
              </button>
            </div>
          ) : (
            weekDays.sort((a, b) => a.order - b.order).map((day) => (
              <div
                key={day._id}
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 transition-all duration-300 overflow-hidden ${
                  day.isActive 
                    ? 'border-green-200 dark:border-green-800 hover:shadow-xl' 
                    : 'border-gray-200 dark:border-gray-700 opacity-60'
                }`}
              >
                <div className={`p-6 ${day.isActive ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20' : 'bg-gray-50 dark:bg-gray-700'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg shadow-md ${
                      day.isActive 
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white' 
                        : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                    }`}>
                      {day.shortName}
                    </div>
                    <button
                      onClick={() => handleToggleActive(day._id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        day.isActive
                          ? 'bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800 hover:bg-green-200 dark:hover:bg-green-800/30'
                          : 'bg-gray-200 text-gray-600 border border-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {day.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                  
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 text-xl mb-1">{day.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Order: {day.order}</p>
                </div>

                <div className="p-4 bg-white dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex items-center justify-end space-x-2">
                  <button
                    onClick={() => handleEdit(day)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-all"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(day._id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {editingDay ? 'Edit Week Day' : 'Add Custom Day'}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Day Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                    placeholder="e.g., Monday"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Short Name
                  </label>
                  <input
                    type="text"
                    value={formData.shortName}
                    onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                    placeholder="e.g., Mon"
                    maxLength="3"
                    required
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-5 h-5 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Set as active working day
                  </label>
                </div>

                <div className="flex items-center space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all shadow-lg font-semibold"
                  >
                    <Save className="w-5 h-5" />
                    <span>{editingDay ? 'Update' : 'Save'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all font-semibold"
                  >
                    <X className="w-5 h-5" />
                    <span>Cancel</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeekDays;