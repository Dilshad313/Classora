import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DoorOpen,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Home,
  ChevronRight,
  Users,
  MapPin,
  Building2,
  CheckCircle2,
  Loader2,
  Clock,
  Calendar
} from 'lucide-react';
import { classroomApi } from '../../../../services/timetableApi';
import { toast } from 'react-hot-toast';

const ClassRooms = () => {
  const navigate = useNavigate();
  const [classRooms, setClassRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    floor: '',
    building: '',
    type: 'Standard',
    isAvailable: true
  });
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    totalCapacity: 0
  });

  // Fetch classrooms on component mount
  useEffect(() => {
    fetchClassrooms();
    fetchStats();
  }, []);

  const fetchClassrooms = async () => {
    try {
      setLoading(true);
      const response = await classroomApi.getClassrooms();
      setClassRooms(response.data || []);
    } catch (error) {
      console.error('Error fetching classrooms:', error);
      toast.error('Failed to load classrooms');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await classroomApi.getClassroomStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      capacity: room.capacity,
      floor: room.floor,
      building: room.building,
      type: room.type,
      isAvailable: room.isAvailable
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this classroom?')) {
      try {
        await classroomApi.deleteClassroom(id);
        toast.success('Classroom deleted successfully');
        fetchClassrooms();
        fetchStats();
      } catch (error) {
        console.error('Error deleting classroom:', error);
        toast.error('Failed to delete classroom');
      }
    }
  };

  const handleToggleAvailability = async (id) => {
    try {
      const updatedRoom = await classroomApi.toggleAvailability(id);
      toast.success(`Classroom ${updatedRoom.isAvailable ? 'marked as available' : 'marked as unavailable'}`);
      fetchClassrooms();
      fetchStats();
    } catch (error) {
      console.error('Error toggling availability:', error);
      toast.error('Failed to update availability');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const roomData = {
        ...formData,
        capacity: parseInt(formData.capacity),
        floor: parseInt(formData.floor)
      };

      if (editingRoom) {
        await classroomApi.updateClassroom(editingRoom._id, roomData);
        toast.success('Classroom updated successfully');
      } else {
        await classroomApi.createClassroom(roomData);
        toast.success('Classroom created successfully');
      }

      setShowAddModal(false);
      setEditingRoom(null);
      setFormData({ name: '', capacity: '', floor: '', building: '', type: 'Standard', isAvailable: true });
      fetchClassrooms();
      fetchStats();
    } catch (error) {
      console.error('Error saving classroom:', error);
      toast.error(error.message || 'Failed to save classroom');
    }
  };

  const handleCancel = () => {
    setShowAddModal(false);
    setEditingRoom(null);
    setFormData({ name: '', capacity: '', floor: '', building: '', type: 'Standard', isAvailable: true });
  };

  const getTypeColor = (type) => {
    const colors = {
      'Standard': 'from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700',
      'Laboratory': 'from-purple-500 to-pink-600 dark:from-purple-600 dark:to-pink-700',
      'Computer Lab': 'from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700',
      'Auditorium': 'from-orange-500 to-red-600 dark:from-orange-600 dark:to-red-700'
    };
    return colors[type] || 'from-gray-500 to-gray-600 dark:from-gray-600 dark:to-gray-700';
  };

  const getTypeBadgeColor = (type) => {
    const colors = {
      'Standard': 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
      'Laboratory': 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
      'Computer Lab': 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
      'Auditorium': 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading classrooms...</p>
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
          <span className="text-gray-900 dark:text-gray-100 font-semibold">Classrooms</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Classroom Management</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Manage classrooms and their availability</p>
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
                onClick={() => navigate('/dashboard/timetable/periods')}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 dark:bg-indigo-700 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-800 transition-all"
              >
                <Clock className="w-4 h-4" />
                <span className="font-medium">Time Periods</span>
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5" />
                <span className="font-semibold">Add Classroom</span>
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Total Rooms</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-gray-100 mt-2">{stats.totalRooms}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl flex items-center justify-center">
                <DoorOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Available</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-gray-100 mt-2">{stats.availableRooms}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-2xl flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Total Capacity</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-gray-100 mt-2">{stats.totalCapacity}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-2xl flex items-center justify-center">
                <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Classrooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classRooms.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <DoorOpen className="w-10 h-10 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No Classrooms Found</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Get started by creating your first classroom</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all"
              >
                <Plus className="w-5 h-5" />
                <span className="font-semibold">Add Classroom</span>
              </button>
            </div>
          ) : (
            classRooms.map((room) => (
              <div
                key={room._id}
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 transition-all duration-300 overflow-hidden ${
                  room.isAvailable 
                    ? 'border-green-200 dark:border-green-800 hover:shadow-xl' 
                    : 'border-gray-200 dark:border-gray-700 opacity-60'
                }`}
              >
                <div className={`p-6 ${room.isAvailable ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20' : 'bg-gray-50 dark:bg-gray-700'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${getTypeColor(room.type)} rounded-2xl flex items-center justify-center shadow-md`}>
                      <DoorOpen className="w-7 h-7 text-white" />
                    </div>
                    <button
                      onClick={() => handleToggleAvailability(room._id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        room.isAvailable
                          ? 'bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800 hover:bg-green-200 dark:hover:bg-green-800/30'
                          : 'bg-gray-200 text-gray-600 border border-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {room.isAvailable ? 'Available' : 'Unavailable'}
                    </button>
                  </div>
                  
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 text-xl mb-2">{room.name}</h3>
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getTypeBadgeColor(room.type)}`}>
                    {room.type}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">Capacity</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{room.capacity} students</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">Building</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{room.building}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">Floor</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">Floor {room.floor}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 flex items-center justify-end space-x-2">
                  <button
                    onClick={() => handleEdit(room)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-all"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(room._id)}
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
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {editingRoom ? 'Edit Classroom' : 'Add Classroom'}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Room Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                    placeholder="e.g., Room 101"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Room Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                  >
                    <option value="Standard">Standard Classroom</option>
                    <option value="Laboratory">Laboratory</option>
                    <option value="Computer Lab">Computer Lab</option>
                    <option value="Auditorium">Auditorium</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Capacity
                    </label>
                    <input
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                      placeholder="40"
                      min="1"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Floor
                    </label>
                    <input
                      type="number"
                      value={formData.floor}
                      onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                      placeholder="1"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Building
                  </label>
                  <input
                    type="text"
                    value={formData.building}
                    onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                    placeholder="e.g., Main Block"
                    required
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isAvailable"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    className="w-5 h-5 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700"
                  />
                  <label htmlFor="isAvailable" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Mark as available for timetable
                  </label>
                </div>

                <div className="flex items-center space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all shadow-lg font-semibold"
                  >
                    <Save className="w-5 h-5" />
                    <span>{editingRoom ? 'Update' : 'Save'}</span>
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

export default ClassRooms;