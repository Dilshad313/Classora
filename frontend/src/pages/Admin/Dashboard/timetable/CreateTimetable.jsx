import React, { useState, useEffect } from 'react';
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
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { timetableApi, classroomApi } from '../../../../services/timetableApi';
import { employeesApi } from '../../../../services/employeesApi';
import { classApi } from '../../../../services/classApi';
import { toast } from 'react-hot-toast';

const CreateTimetable = () => {
  const navigate = useNavigate();
  
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [weekDays, setWeekDays] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState('');
  const [timetable, setTimetable] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentSlot, setCurrentSlot] = useState({ day: null, period: null });
  const [slotData, setSlotData] = useState({
    subject: '',
    teacher: '',
    room: ''
  });
  const [academicYear, setAcademicYear] = useState(new Date().getFullYear().toString());
  const [term, setTerm] = useState('1st Term');

  // Fetch all required data on component mount
  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      
      // Fetch all resources in parallel
      const [
        classesRes,
        teachersRes,
        resourcesRes
      ] = await Promise.all([
        classApi.getAllClasses(),
        employeesApi.getEmployees({ role: 'Teacher' }),
        timetableApi.getAvailableResources()
      ]);

      setClasses(classesRes.data || []);
      setTeachers(teachersRes.data || []);
      setSubjects(resourcesRes.data?.subjects || []);
      setRooms(resourcesRes.data?.classRooms || []);
      setWeekDays(resourcesRes.data?.days || []);
      setPeriods(resourcesRes.data?.periods || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast.error('Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  const fetchTimetable = async () => {
    if (!selectedClass) return;
    
    try {
      const data = await timetableApi.getTimetableByClass(selectedClass, {
        academicYear,
        term
      });
      
      // Convert timetable data to slot format
      const slotMap = {};
      if (data.periods) {
        data.periods.forEach(period => {
          const key = `${period.dayId._id}-${period.periodId._id}`;
          slotMap[key] = {
            subject: period.subjectId?._id || '',
            teacher: period.teacherId?._id || '',
            room: period.roomId?._id || ''
          };
        });
      }
      setTimetable(slotMap);
    } catch (error) {
      console.error('Error fetching timetable:', error);
      // Don't show error if no timetable exists yet
      setTimetable({});
    }
  };

  useEffect(() => {
    if (selectedClass) {
      fetchTimetable();
    }
  }, [selectedClass, academicYear, term]);

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

  const handleSaveSlot = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!slotData.subject || !slotData.teacher || !slotData.room) {
      toast.error('Please fill in all fields');
      return;
    }
    
    try {
      // Update local state first
      const key = `${currentSlot.day}-${currentSlot.period}`;
      setTimetable(prev => ({
        ...prev,
        [key]: { ...slotData }
      }));
      
      setShowAddModal(false);
      setSlotData({ subject: '', teacher: '', room: '' });
      toast.success('Period saved successfully');
    } catch (error) {
      console.error('Error saving slot:', error);
      toast.error(error.message || 'Failed to save period');
    }
  };

  const handleDeleteSlot = async (dayId, periodId) => {
    if (!window.confirm('Are you sure you want to delete this period?')) {
      return;
    }

    try {
      // Update local state
      const key = `${dayId}-${periodId}`;
      setTimetable(prev => {
        const newTimetable = { ...prev };
        delete newTimetable[key];
        return newTimetable;
      });

      toast.success('Period deleted successfully');
    } catch (error) {
      console.error('Error deleting slot:', error);
      toast.error('Failed to delete period');
    }
  };

  const handleCancel = () => {
    setShowAddModal(false);
    setSlotData({ subject: '', teacher: '', room: '' });
  };

  const handleSaveTimetable = async () => {
    if (!selectedClass) {
      toast.error('Please select a class first');
      return;
    }

    if (filledSlots === 0) {
      toast.error('Please add at least one period to the timetable');
      return;
    }

    try {
      // Convert timetable to periods array
      const periodsArray = Object.entries(timetable).map(([key, data]) => {
        const [dayId, periodId] = key.split('-');
        return {
          dayId,
          periodId,
          subjectId: data.subject || null,
          teacherId: data.teacher || null,
          roomId: data.room || null,
          isBreak: false
        };
      });

      await timetableApi.createOrUpdateTimetable({
        classId: selectedClass,
        academicYear,
        term,
        periods: periodsArray
      });

      toast.success('Timetable saved successfully!');
      // Refresh timetable to confirm save
      await fetchTimetable();
    } catch (error) {
      console.error('Error saving timetable:', error);
      toast.error(error.message || 'Failed to save timetable');
    }
  };

  const getSlotData = (dayId, periodId) => {
    return timetable[`${dayId}-${periodId}`];
  };

  const filledSlots = Object.keys(timetable).length;
  const totalSlots = weekDays.filter(day => day.isActive).length * periods.length;
  const completionPercentage = totalSlots > 0 ? Math.round((filledSlots / totalSlots) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading resources...</p>
        </div>
      </div>
    );
  }

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
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Academic Year
              </label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {[2023, 2024, 2025, 2026].map(year => (
                  <option key={year} value={year.toString()}>
                    {year}-{year + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Term
              </label>
              <select
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="1st Term">1st Term</option>
                <option value="2nd Term">2nd Term</option>
                <option value="3rd Term">3rd Term</option>
                <option value="Annual">Annual</option>
              </select>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
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
                  <option key={cls._id} value={cls._id}>
                    {cls.className} - {cls.section}
                  </option>
                ))}
              </select>
            </div>
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
          <div>
            {/* Quick Info */}
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Tip:</span> Click on any cell to add or edit a period. You can add subjects, assign teachers, and select classrooms. Save your changes using the "Save Timetable" button at the top.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <tr>
                    <th className="px-4 py-4 text-left text-sm font-bold uppercase tracking-wider min-w-[120px]">
                      Day / Period
                    </th>
                    {periods.map(period => (
                      <th key={period._id} className="px-4 py-4 text-center text-sm font-bold uppercase tracking-wider min-w-[180px]">
                        <div>{period.name}</div>
                        <div className="text-xs font-normal mt-1 opacity-90">
                          {period.startTime} - {period.endTime}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {weekDays.filter(day => day.isActive).map(day => (
                    <tr key={day._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 bg-gray-50">
                        <div className="font-bold text-gray-900">{day.name}</div>
                        <div className="text-xs text-gray-500">{day.shortName}</div>
                      </td>
                      {periods.map(period => {
                        const slotData = getSlotData(day._id, period._id);
                        const subject = subjects.find(s => s._id === slotData?.subject);
                        const teacher = teachers.find(t => t._id === slotData?.teacher);
                        const room = rooms.find(r => r._id === slotData?.room);
                        
                        return (
                          <td key={period._id} className="px-2 py-2 text-center">
                            {slotData ? (
                              <div className="relative group">
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-3 hover:shadow-md transition-all">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-1">
                                      <BookOpen className="w-4 h-4 text-blue-600" />
                                      <span className="text-xs font-bold text-blue-900">
                                        {subject?.code || 'N/A'}
                                      </span>
                                    </div>
                                    <button
                                      onClick={() => handleDeleteSlot(day._id, period._id)}
                                      className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-100 rounded transition-all"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                  <div className="text-xs text-gray-700 space-y-1">
                                    <div className="flex items-center space-x-1">
                                      <Users className="w-3 h-3 text-gray-500" />
                                      <span className="truncate">
                                        {teacher?.employeeName || 'Not assigned'}
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <DoorOpen className="w-3 h-3 text-gray-500" />
                                      <span>
                                        {room?.name || 'Not assigned'}
                                      </span>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleAddSlot(day._id, period._id)}
                                    className="mt-2 w-full text-xs text-blue-600 hover:text-blue-800 font-medium"
                                  >
                                    Edit
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleAddSlot(day._id, period._id)}
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
                  {weekDays.find(d => d._id === currentSlot.day)?.name} - {periods.find(p => p._id === currentSlot.period)?.name}
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
                      <option key={subject._id} value={subject._id}>
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
                      <option key={teacher._id} value={teacher._id}>
                        {teacher.employeeName} ({teacher.employeeRole})
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
                      <option key={room._id} value={room._id}>
                        {room.name} ({room.building})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={!slotData.subject || !slotData.teacher || !slotData.room}
                    className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
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