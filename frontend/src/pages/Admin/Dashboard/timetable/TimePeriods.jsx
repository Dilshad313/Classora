import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Home,
  ChevronRight,
  Timer,
  Coffee,
  BookOpen,
  Loader2,
  Calendar,
  DoorOpen
} from 'lucide-react';
import { timePeriodApi } from '../../../../services/timetableApi';
import { toast } from 'react-hot-toast';

const TimePeriods = () => {
  const navigate = useNavigate();
  const [timePeriods, setTimePeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    startTime: '',
    endTime: '',
    type: 'class'
  });
  const [stats, setStats] = useState({
    totalPeriods: 0,
    classPeriods: 0,
    breakPeriods: 0,
    totalDuration: 0
  });

  useEffect(() => {
    fetchTimePeriods();
    fetchStats();
  }, []);

  const fetchTimePeriods = async () => {
    try {
      setLoading(true);
      const data = await timePeriodApi.getTimePeriods();
      setTimePeriods(data);
    } catch (error) {
      console.error('Error fetching time periods:', error);
      toast.error('Failed to load time periods');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await timePeriodApi.getTimePeriodStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const calculateDuration = (start, end) => {
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    return (endHour * 60 + endMin) - (startHour * 60 + startMin);
  };

  const handleEdit = (period) => {
    setEditingPeriod(period);
    setFormData({
      name: period.name,
      startTime: period.startTime,
      endTime: period.endTime,
      type: period.type
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this period?')) {
      try {
        await timePeriodApi.deleteTimePeriod(id);
        toast.success('Time period deleted successfully');
        fetchTimePeriods();
        fetchStats();
      } catch (error) {
        console.error('Error deleting time period:', error);
        toast.error('Failed to delete time period');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const duration = calculateDuration(formData.startTime, formData.endTime);
    
    if (duration <= 0) {
      toast.error('End time must be after start time');
      return;
    }

    try {
      const periodData = {
        ...formData,
        duration,
        order: editingPeriod ? editingPeriod.order : timePeriods.length + 1
      };

      if (editingPeriod) {
        await timePeriodApi.updateTimePeriod(editingPeriod._id, periodData);
        toast.success('Time period updated successfully');
      } else {
        await timePeriodApi.createTimePeriod(periodData);
        toast.success('Time period created successfully');
      }

      setShowAddModal(false);
      setEditingPeriod(null);
      setFormData({ name: '', startTime: '', endTime: '', type: 'class' });
      fetchTimePeriods();
      fetchStats();
    } catch (error) {
      console.error('Error saving time period:', error);
      toast.error(error.message || 'Failed to save time period');
    }
  };

  const handleCancel = () => {
    setShowAddModal(false);
    setEditingPeriod(null);
    setFormData({ name: '', startTime: '', endTime: '', type: 'class' });
  };

  const classPeriods = timePeriods.filter(p => p.type === 'class').length;
  const breakPeriods = timePeriods.filter(p => p.type === 'break').length;
  const totalDuration = timePeriods.reduce((sum, p) => sum + (p.duration || 0), 0);

  const getTypeIcon = (type) => {
    return type === 'class' ? BookOpen : Coffee;
  };

  const getTypeColor = (type) => {
    return type === 'class' 
      ? 'from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700' 
      : 'from-orange-500 to-red-600 dark:from-orange-600 dark:to-red-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading time periods...</p>
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
          <span className="text-gray-900 dark:text-gray-100 font-semibold">Time Periods</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Time Periods Management</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Configure class periods and break times</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/dashboard/timetable/weekdays')}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 dark:bg-purple-700 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-800 transition-all"
              >
                <Calendar className="w-4 h-4" />
                <span className="font-medium">Week Days</span>
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
                <span className="font-semibold">Add Period</span>
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Total Periods</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-gray-100 mt-2">{stats.totalPeriods}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-2xl flex items-center justify-center">
                <Clock className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Class Periods</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-gray-100 mt-2">{stats.classPeriods}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Break Periods</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-gray-100 mt-2">{stats.breakPeriods}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 rounded-2xl flex items-center justify-center">
                <Coffee className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Total Duration</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-gray-100 mt-2">{Math.floor(stats.totalDuration / 60)}h {stats.totalDuration % 60}m</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-2xl flex items-center justify-center">
                <Timer className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Time Periods List */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Period Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Start Time</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">End Time</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {timePeriods.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Clock className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No Time Periods Found</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">Get started by creating your first time period</p>
                      <button
                        onClick={() => setShowAddModal(true)}
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all"
                      >
                        <Plus className="w-5 h-5" />
                        <span className="font-semibold">Add Period</span>
                      </button>
                    </td>
                  </tr>
                ) : (
                  timePeriods.sort((a, b) => a.order - b.order).map((period) => {
                    const TypeIcon = getTypeIcon(period.type);
                    return (
                      <tr key={period._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-xl flex items-center justify-center">
                            <span className="font-bold text-gray-700 dark:text-gray-300">{period.order}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 bg-gradient-to-br ${getTypeColor(period.type)} rounded-xl flex items-center justify-center`}>
                              <TypeIcon className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-semibold text-gray-900 dark:text-gray-100">{period.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            period.type === 'class' 
                              ? 'bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800' 
                              : 'bg-orange-100 text-orange-700 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800'
                          }`}>
                            {period.type === 'class' ? 'Class' : 'Break'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                            <span className="font-medium text-gray-900 dark:text-gray-100">{period.startTime}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                            <span className="font-medium text-gray-900 dark:text-gray-100">{period.endTime}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center space-x-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300">
                            <Timer className="w-4 h-4" />
                            <span>{period.duration || 0} min</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleEdit(period)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-all"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(period._id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {editingPeriod ? 'Edit Time Period' : 'Add Time Period'}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Period Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                    placeholder="e.g., Period 1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                  >
                    <option value="class">Class Period</option>
                    <option value="break">Break Time</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                      required
                    />
                  </div>
                </div>

                {formData.startTime && formData.endTime && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      <span className="font-semibold">Duration:</span> {calculateDuration(formData.startTime, formData.endTime)} minutes
                    </p>
                  </div>
                )}

                <div className="flex items-center space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all shadow-lg font-semibold"
                  >
                    <Save className="w-5 h-5" />
                    <span>{editingPeriod ? 'Update' : 'Save'}</span>
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

export default TimePeriods;