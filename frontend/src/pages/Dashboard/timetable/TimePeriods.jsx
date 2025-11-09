import React, { useState } from 'react';
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
  BookOpen
} from 'lucide-react';

const TimePeriods = () => {
  const navigate = useNavigate();
  const [timePeriods, setTimePeriods] = useState([
    { id: 1, name: 'Period 1', startTime: '08:00', endTime: '08:45', duration: 45, type: 'class', order: 1 },
    { id: 2, name: 'Period 2', startTime: '08:45', endTime: '09:30', duration: 45, type: 'class', order: 2 },
    { id: 3, name: 'Short Break', startTime: '09:30', endTime: '09:45', duration: 15, type: 'break', order: 3 },
    { id: 4, name: 'Period 3', startTime: '09:45', endTime: '10:30', duration: 45, type: 'class', order: 4 },
    { id: 5, name: 'Period 4', startTime: '10:30', endTime: '11:15', duration: 45, type: 'class', order: 5 },
    { id: 6, name: 'Lunch Break', startTime: '11:15', endTime: '12:00', duration: 45, type: 'break', order: 6 },
    { id: 7, name: 'Period 5', startTime: '12:00', endTime: '12:45', duration: 45, type: 'class', order: 7 },
    { id: 8, name: 'Period 6', startTime: '12:45', endTime: '13:30', duration: 45, type: 'class', order: 8 }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    startTime: '',
    endTime: '',
    type: 'class'
  });

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

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this period?')) {
      setTimePeriods(prev => prev.filter(period => period.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const duration = calculateDuration(formData.startTime, formData.endTime);
    
    if (duration <= 0) {
      alert('End time must be after start time');
      return;
    }

    if (editingPeriod) {
      setTimePeriods(prev => prev.map(period =>
        period.id === editingPeriod.id
          ? { ...period, ...formData, duration }
          : period
      ));
    } else {
      const newPeriod = {
        id: Date.now(),
        ...formData,
        duration,
        order: timePeriods.length + 1
      };
      setTimePeriods(prev => [...prev, newPeriod]);
    }

    setShowAddModal(false);
    setEditingPeriod(null);
    setFormData({ name: '', startTime: '', endTime: '', type: 'class' });
  };

  const handleCancel = () => {
    setShowAddModal(false);
    setEditingPeriod(null);
    setFormData({ name: '', startTime: '', endTime: '', type: 'class' });
  };

  const classPeriods = timePeriods.filter(p => p.type === 'class').length;
  const breakPeriods = timePeriods.filter(p => p.type === 'break').length;
  const totalDuration = timePeriods.reduce((sum, p) => sum + p.duration, 0);

  const getTypeIcon = (type) => {
    return type === 'class' ? BookOpen : Coffee;
  };

  const getTypeColor = (type) => {
    return type === 'class' 
      ? 'from-blue-500 to-indigo-600' 
      : 'from-orange-500 to-red-600';
  };

  const getTypeBgColor = (type) => {
    return type === 'class' 
      ? 'from-blue-50 to-indigo-50' 
      : 'from-orange-50 to-red-50';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-blue-600 font-semibold">Timetable</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-semibold">Time Periods</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Time Periods Management</h1>
              <p className="text-gray-600 mt-1">Configure class periods and break times</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              <span className="font-semibold">Add Period</span>
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Periods</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{timePeriods.length}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Class Periods</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{classPeriods}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Break Periods</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{breakPeriods}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center">
                <Coffee className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Duration</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{Math.floor(totalDuration / 60)}h {totalDuration % 60}m</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center">
                <Timer className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Time Periods List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Period Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Start Time</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">End Time</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {timePeriods.sort((a, b) => a.order - b.order).map((period) => {
                  const TypeIcon = getTypeIcon(period.type);
                  return (
                    <tr key={period.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                          <span className="font-bold text-gray-700">{period.order}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 bg-gradient-to-br ${getTypeColor(period.type)} rounded-xl flex items-center justify-center`}>
                            <TypeIcon className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-semibold text-gray-900">{period.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          period.type === 'class' 
                            ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                            : 'bg-orange-100 text-orange-700 border border-orange-200'
                        }`}>
                          {period.type === 'class' ? 'Class' : 'Break'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-900">{period.startTime}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-900">{period.endTime}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center space-x-1 px-3 py-1 bg-gray-100 rounded-lg text-sm font-semibold text-gray-700">
                          <Timer className="w-4 h-4" />
                          <span>{period.duration} min</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(period)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(period.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingPeriod ? 'Edit Time Period' : 'Add Time Period'}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Period Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Period 1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="class">Class Period</option>
                    <option value="break">Break Time</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                {formData.startTime && formData.endTime && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm text-blue-800">
                      <span className="font-semibold">Duration:</span> {calculateDuration(formData.startTime, formData.endTime)} minutes
                    </p>
                  </div>
                )}

                <div className="flex items-center space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg font-semibold"
                  >
                    <Save className="w-5 h-5" />
                    <span>{editingPeriod ? 'Update' : 'Save'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-semibold"
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
