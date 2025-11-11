import React, { useState } from 'react';
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
  CheckCircle2
} from 'lucide-react';

const ClassRooms = () => {
  const navigate = useNavigate();
  const [classRooms, setClassRooms] = useState([
    { id: 1, name: 'Room 101', capacity: 40, floor: 1, building: 'Main Block', type: 'Standard', isAvailable: true },
    { id: 2, name: 'Room 102', capacity: 40, floor: 1, building: 'Main Block', type: 'Standard', isAvailable: true },
    { id: 3, name: 'Lab 201', capacity: 30, floor: 2, building: 'Science Block', type: 'Laboratory', isAvailable: true },
    { id: 4, name: 'Room 202', capacity: 35, floor: 2, building: 'Main Block', type: 'Standard', isAvailable: true },
    { id: 5, name: 'Computer Lab', capacity: 35, floor: 2, building: 'Tech Block', type: 'Computer Lab', isAvailable: true },
    { id: 6, name: 'Auditorium', capacity: 200, floor: 1, building: 'Main Block', type: 'Auditorium', isAvailable: false }
  ]);

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

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this classroom?')) {
      setClassRooms(prev => prev.filter(room => room.id !== id));
    }
  };

  const handleToggleAvailability = (id) => {
    setClassRooms(prev => prev.map(room => 
      room.id === id ? { ...room, isAvailable: !room.isAvailable } : room
    ));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingRoom) {
      setClassRooms(prev => prev.map(room =>
        room.id === editingRoom.id
          ? { ...room, ...formData, capacity: Number(formData.capacity), floor: Number(formData.floor) }
          : room
      ));
    } else {
      const newRoom = {
        id: Date.now(),
        ...formData,
        capacity: Number(formData.capacity),
        floor: Number(formData.floor)
      };
      setClassRooms(prev => [...prev, newRoom]);
    }

    setShowAddModal(false);
    setEditingRoom(null);
    setFormData({ name: '', capacity: '', floor: '', building: '', type: 'Standard', isAvailable: true });
  };

  const handleCancel = () => {
    setShowAddModal(false);
    setEditingRoom(null);
    setFormData({ name: '', capacity: '', floor: '', building: '', type: 'Standard', isAvailable: true });
  };

  const totalRooms = classRooms.length;
  const availableRooms = classRooms.filter(r => r.isAvailable).length;
  const totalCapacity = classRooms.reduce((sum, r) => sum + r.capacity, 0);

  const getTypeColor = (type) => {
    const colors = {
      'Standard': 'from-blue-500 to-indigo-600',
      'Laboratory': 'from-purple-500 to-pink-600',
      'Computer Lab': 'from-green-500 to-emerald-600',
      'Auditorium': 'from-orange-500 to-red-600'
    };
    return colors[type] || 'from-gray-500 to-gray-600';
  };

  const getTypeBadgeColor = (type) => {
    const colors = {
      'Standard': 'bg-blue-100 text-blue-700 border-blue-200',
      'Laboratory': 'bg-purple-100 text-purple-700 border-purple-200',
      'Computer Lab': 'bg-green-100 text-green-700 border-green-200',
      'Auditorium': 'bg-orange-100 text-orange-700 border-orange-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-700 border-gray-200';
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
          <span className="text-gray-900 font-semibold">Classrooms</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Classroom Management</h1>
              <p className="text-gray-600 mt-1">Manage classrooms and their availability</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              <span className="font-semibold">Add Classroom</span>
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Rooms</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{totalRooms}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
                <DoorOpen className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Available</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{availableRooms}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Capacity</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{totalCapacity}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Classrooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classRooms.map((room) => (
            <div
              key={room.id}
              className={`bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 overflow-hidden ${
                room.isAvailable 
                  ? 'border-green-200 hover:shadow-xl' 
                  : 'border-gray-200 opacity-60'
              }`}
            >
              <div className={`p-6 bg-gradient-to-br ${room.isAvailable ? 'from-green-50 to-emerald-50' : 'from-gray-50 to-gray-100'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${getTypeColor(room.type)} rounded-2xl flex items-center justify-center shadow-md`}>
                    <DoorOpen className="w-7 h-7 text-white" />
                  </div>
                  <button
                    onClick={() => handleToggleAvailability(room.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      room.isAvailable
                        ? 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200'
                        : 'bg-gray-200 text-gray-600 border border-gray-300 hover:bg-gray-300'
                    }`}
                  >
                    {room.isAvailable ? 'Available' : 'Unavailable'}
                  </button>
                </div>
                
                <h3 className="font-bold text-gray-900 text-xl mb-2">{room.name}</h3>
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getTypeBadgeColor(room.type)}`}>
                  {room.type}
                </span>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Capacity</p>
                      <p className="font-semibold text-gray-900">{room.capacity} students</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Building</p>
                      <p className="font-semibold text-gray-900">{room.building}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Floor</p>
                      <p className="font-semibold text-gray-900">Floor {room.floor}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end space-x-2">
                <button
                  onClick={() => handleEdit(room)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(room.id)}
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
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingRoom ? 'Edit Classroom' : 'Add Classroom'}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Room Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Room 101"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Room Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Standard">Standard Classroom</option>
                    <option value="Laboratory">Laboratory</option>
                    <option value="Computer Lab">Computer Lab</option>
                    <option value="Auditorium">Auditorium</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Capacity
                    </label>
                    <input
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="40"
                      min="1"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Floor
                    </label>
                    <input
                      type="number"
                      value={formData.floor}
                      onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="1"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Building
                  </label>
                  <input
                    type="text"
                    value={formData.building}
                    onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isAvailable" className="text-sm font-medium text-gray-700">
                    Mark as available for timetable
                  </label>
                </div>

                <div className="flex items-center space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg font-semibold"
                  >
                    <Save className="w-5 h-5" />
                    <span>{editingRoom ? 'Update' : 'Save'}</span>
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

export default ClassRooms;
