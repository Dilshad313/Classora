import React, { useState } from 'react';
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
  Clock
} from 'lucide-react';

const WeekDays = () => {
  const navigate = useNavigate();
  const [weekDays, setWeekDays] = useState([
    { id: 1, name: 'Monday', shortName: 'Mon', isActive: true, order: 1 },
    { id: 2, name: 'Tuesday', shortName: 'Tue', isActive: true, order: 2 },
    { id: 3, name: 'Wednesday', shortName: 'Wed', isActive: true, order: 3 },
    { id: 4, name: 'Thursday', shortName: 'Thu', isActive: true, order: 4 },
    { id: 5, name: 'Friday', shortName: 'Fri', isActive: true, order: 5 },
    { id: 6, name: 'Saturday', shortName: 'Sat', isActive: false, order: 6 },
    { id: 7, name: 'Sunday', shortName: 'Sun', isActive: false, order: 7 }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDay, setEditingDay] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    isActive: true
  });

  const handleToggleActive = (id) => {
    setWeekDays(prev => prev.map(day => 
      day.id === id ? { ...day, isActive: !day.isActive } : day
    ));
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

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this day?')) {
      setWeekDays(prev => prev.filter(day => day.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingDay) {
      setWeekDays(prev => prev.map(day =>
        day.id === editingDay.id
          ? { ...day, ...formData }
          : day
      ));
    } else {
      const newDay = {
        id: Date.now(),
        ...formData,
        order: weekDays.length + 1
      };
      setWeekDays(prev => [...prev, newDay]);
    }

    setShowAddModal(false);
    setEditingDay(null);
    setFormData({ name: '', shortName: '', isActive: true });
  };

  const handleCancel = () => {
    setShowAddModal(false);
    setEditingDay(null);
    setFormData({ name: '', shortName: '', isActive: true });
  };

  const activeDays = weekDays.filter(day => day.isActive).length;

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
          <span className="text-gray-900 font-semibold">Week Days</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Week Days Management</h1>
              <p className="text-gray-600 mt-1">Configure working days for your institution</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              <span className="font-semibold">Add Custom Day</span>
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Days</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{weekDays.length}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Active Days</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{activeDays}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Working Days</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{activeDays}/week</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Week Days Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {weekDays.sort((a, b) => a.order - b.order).map((day) => (
            <div
              key={day.id}
              className={`bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 overflow-hidden ${
                day.isActive 
                  ? 'border-green-200 hover:shadow-xl' 
                  : 'border-gray-200 opacity-60'
              }`}
            >
              <div className={`p-6 ${day.isActive ? 'bg-gradient-to-br from-green-50 to-emerald-50' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg shadow-md ${
                    day.isActive 
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white' 
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {day.shortName}
                  </div>
                  <button
                    onClick={() => handleToggleActive(day.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      day.isActive
                        ? 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200'
                        : 'bg-gray-200 text-gray-600 border border-gray-300 hover:bg-gray-300'
                    }`}
                  >
                    {day.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
                
                <h3 className="font-bold text-gray-900 text-xl mb-1">{day.name}</h3>
                <p className="text-sm text-gray-600">Order: {day.order}</p>
              </div>

              <div className="p-4 bg-white border-t border-gray-200 flex items-center justify-end space-x-2">
                <button
                  onClick={() => handleEdit(day)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(day.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingDay ? 'Edit Week Day' : 'Add Custom Day'}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Day Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Monday"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Short Name
                  </label>
                  <input
                    type="text"
                    value={formData.shortName}
                    onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Set as active working day
                  </label>
                </div>

                <div className="flex items-center space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg font-semibold"
                  >
                    <Save className="w-5 h-5" />
                    <span>{editingDay ? 'Update' : 'Save'}</span>
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

export default WeekDays;
