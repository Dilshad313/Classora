import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar,
  Plus,
  Save,
  X,
  Home,
  ChevronRight,
  BookOpen,
  Users,
  Clock,
  DoorOpen,
  Trash2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

const CreateTimetable = () => {
  const navigate = useNavigate();
  
  // Sample data - in real app, this would come from API
  const [classes] = useState([
    { id: 1, name: 'Grade 10 - A' },
    { id: 2, name: 'Grade 10 - B' },
    { id: 3, name: 'Grade 11 - A' }
  ]);

  const [subjects] = useState([
    { id: 1, name: 'Mathematics', code: 'MATH' },
    { id: 2, name: 'Physics', code: 'PHY' },
    { id: 3, name: 'Chemistry', code: 'CHEM' },
    { id: 4, name: 'English', code: 'ENG' },
    { id: 5, name: 'History', code: 'HIST' }
  ]);

  const [teachers] = useState([
    { id: 1, name: 'Dr. Sharma', subject: 'Mathematics' },
    { id: 2, name: 'Prof. Kumar', subject: 'Physics' },
    { id: 3, name: 'Ms. Patel', subject: 'Chemistry' },
    { id: 4, name: 'Mr. Singh', subject: 'English' }
  ]);

  const [rooms] = useState([
    { id: 1, name: 'Room 101' },
    { id: 2, name: 'Room 102' },
    { id: 3, name: 'Lab 201' }
  ]);

  const [weekDays] = useState([
    { id: 1, name: 'Monday', shortName: 'Mon' },
    { id: 2, name: 'Tuesday', shortName: 'Tue' },
    { id: 3, name: 'Wednesday', shortName: 'Wed' },
    { id: 4, name: 'Thursday', shortName: 'Thu' },
    { id: 5, name: 'Friday', shortName: 'Fri' }
  ]);

  const [periods] = useState([
    { id: 1, name: 'Period 1', startTime: '08:00', endTime: '08:45' },
    { id: 2, name: 'Period 2', startTime: '08:45', endTime: '09:30' },
    { id: 3, name: 'Period 3', startTime: '09:45', endTime: '10:30' },
    { id: 4, name: 'Period 4', startTime: '10:30', endTime: '11:15' },
    { id: 5, name: 'Period 5', startTime: '12:00', endTime: '12:45' },
    { id: 6, name: 'Period 6', startTime: '12:45', endTime: '13:30' }
  ]);

  const [selectedClass, setSelectedClass] = useState('');
  const [timetable, setTimetable] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentSlot, setCurrentSlot] = useState({ day: null, period: null });
  const [slotData, setSlotData] = useState({
    subject: '',
    teacher: '',
    room: ''
  });

  const handleAddSlot = (dayId, periodId) => {
    setCurrentSlot({ day: dayId, period: periodId });
    const existing = timetable[`${dayId}-${periodId}`];
    if (existing) {
      setSlotData(existing);
    } else {
      setSlotData({ subject: '', teacher: '', room: '' });
    }
    setShowAddModal(true);
  };

  const handleSaveSlot = (e) => {
    e.preventDefault();
    const key = `${currentSlot.day}-${currentSlot.period}`;
    setTimetable(prev => ({
      ...prev,
      [key]: { ...slotData }
    }));
    setShowAddModal(false);
    setSlotData({ subject: '', teacher: '', room: '' });
  };

  const handleDeleteSlot = (dayId, periodId) => {
    const key = `${dayId}-${periodId}`;
    setTimetable(prev => {
      const newTimetable = { ...prev };
      delete newTimetable[key];
      return newTimetable;
    });
  };

  const handleCancel = () => {
    setShowAddModal(false);
    setSlotData({ subject: '', teacher: '', room: '' });
  };

  const handleSaveTimetable = () => {
    if (!selectedClass) {
      alert('Please select a class first');
      return;
    }
    if (Object.keys(timetable).length === 0) {
      alert('Please add at least one period to the timetable');
      return;
    }
    alert('Timetable saved successfully!');
    // Here you would save to backend
  };

  const getSlotData = (dayId, periodId) => {
    return timetable[`${dayId}-${periodId}`];
  };

  const filledSlots = Object.keys(timetable).length;
  const totalSlots = weekDays.length * periods.length;
  const completionPercentage = Math.round((filledSlots / totalSlots) * 100);

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
          <span className="text-gray-900 font-semibold">Create Timetable</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create Timetable</h1>
              <p className="text-gray-600 mt-1">Design and manage class schedules</p>
            </div>
            <button
              onClick={handleSaveTimetable}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Save className="w-5 h-5" />
              <span className="font-semibold">Save Timetable</span>
            </button>
          </div>
        </div>

        {/* Class Selection & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Choose a class...</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Filled Slots</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{filledSlots}/{totalSlots}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
                <Calendar className="w-7 h-7 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Completion</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{completionPercentage}%</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Periods</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{periods.length}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center">
                <Clock className="w-7 h-7 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Timetable Grid */}
        {selectedClass ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <tr>
                    <th className="px-4 py-4 text-left text-sm font-bold uppercase tracking-wider min-w-[120px]">
                      Day / Period
                    </th>
                    {periods.map(period => (
                      <th key={period.id} className="px-4 py-4 text-center text-sm font-bold uppercase tracking-wider min-w-[180px]">
                        <div>{period.name}</div>
                        <div className="text-xs font-normal mt-1 opacity-90">
                          {period.startTime} - {period.endTime}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {weekDays.map(day => (
                    <tr key={day.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 bg-gray-50">
                        <div className="font-bold text-gray-900">{day.name}</div>
                        <div className="text-xs text-gray-500">{day.shortName}</div>
                      </td>
                      {periods.map(period => {
                        const slotData = getSlotData(day.id, period.id);
                        return (
                          <td key={period.id} className="px-2 py-2 text-center">
                            {slotData ? (
                              <div className="relative group">
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-3 hover:shadow-md transition-all">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-1">
                                      <BookOpen className="w-4 h-4 text-blue-600" />
                                      <span className="text-xs font-bold text-blue-900">
                                        {subjects.find(s => s.id === parseInt(slotData.subject))?.code}
                                      </span>
                                    </div>
                                    <button
                                      onClick={() => handleDeleteSlot(day.id, period.id)}
                                      className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-100 rounded transition-all"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                  <div className="text-xs text-gray-700 space-y-1">
                                    <div className="flex items-center space-x-1">
                                      <Users className="w-3 h-3 text-gray-500" />
                                      <span className="truncate">
                                        {teachers.find(t => t.id === parseInt(slotData.teacher))?.name}
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <DoorOpen className="w-3 h-3 text-gray-500" />
                                      <span>
                                        {rooms.find(r => r.id === parseInt(slotData.room))?.name}
                                      </span>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleAddSlot(day.id, period.id)}
                                    className="mt-2 w-full text-xs text-blue-600 hover:text-blue-800 font-medium"
                                  >
                                    Edit
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleAddSlot(day.id, period.id)}
                                className="w-full h-full min-h-[100px] border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all group"
                              >
                                <div className="flex flex-col items-center justify-center space-y-2 text-gray-400 group-hover:text-blue-600">
                                  <Plus className="w-6 h-6" />
                                  <span className="text-xs font-medium">Add Period</span>
                                </div>
                              </button>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-16 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Select a Class</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Please select a class from the dropdown above to start creating the timetable
            </p>
          </div>
        )}

        {/* Add/Edit Slot Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  {getSlotData(currentSlot.day, currentSlot.period) ? 'Edit Period' : 'Add Period'}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {weekDays.find(d => d.id === currentSlot.day)?.name} - {periods.find(p => p.id === currentSlot.period)?.name}
                </p>
              </div>

              <form onSubmit={handleSaveSlot} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    value={slotData.subject}
                    onChange={(e) => setSlotData({ ...slotData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select subject...</option>
                    {subjects.map(subject => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name} ({subject.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Teacher
                  </label>
                  <select
                    value={slotData.teacher}
                    onChange={(e) => setSlotData({ ...slotData, teacher: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select teacher...</option>
                    {teachers.map(teacher => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name} ({teacher.subject})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Room
                  </label>
                  <select
                    value={slotData.room}
                    onChange={(e) => setSlotData({ ...slotData, room: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select room...</option>
                    {rooms.map(room => (
                      <option key={room.id} value={room.id}>
                        {room.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg font-semibold"
                  >
                    <Save className="w-5 h-5" />
                    <span>Save</span>
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

export default CreateTimetable;
