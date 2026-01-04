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
import { subjectApi } from '../../../../services/subjectApi';
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

  // Fetch timetable when class is selected
  useEffect(() => {
    if (selectedClass) {
      fetchTimetable();
    }
  }, [selectedClass, academicYear, term]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      
      // Fetch all resources in parallel
      const [
        classesRes,
        teachersRes,
        resourcesRes,
        subjectsRes
      ] = await Promise.all([
        classApi.getAllClasses(),
        employeesApi.getEmployees({ role: 'Teacher' }),
        timetableApi.getAvailableResources(),
        subjectApi.getAllSubjects().catch(() => ({ data: [] })) // Fallback for subjects
      ]);

      setClasses(classesRes.data || []);
      setTeachers(teachersRes.data || []);
      
      // Handle the resources response structure properly
      if (resourcesRes && resourcesRes.data) {
        setRooms(resourcesRes.data.classRooms || []);
        setWeekDays(resourcesRes.data.days || []);
        setPeriods(resourcesRes.data.periods || []);
        
        // Use subjects from resources if available, otherwise use direct subjects API
        if (resourcesRes.data.subjects && resourcesRes.data.subjects.length > 0) {
          setSubjects(resourcesRes.data.subjects);
        } else if (subjectsRes && subjectsRes.data) {
          setSubjects(subjectsRes.data);
        } else {
          setSubjects([]);
        }
      } else {
        // Fallback if resources endpoint fails
        console.warn('Resources endpoint returned unexpected structure, using fallbacks');
        setRooms([]);
        setWeekDays([]);
        setPeriods([]);
        
        // Use subjects from direct API call as fallback
        if (subjectsRes && subjectsRes.data) {
          setSubjects(subjectsRes.data);
        } else {
          setSubjects([]);
        }
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast.error('Failed to load resources');
      
      // Set empty arrays on error to prevent crashes
      setSubjects([]);
      setRooms([]);
      setWeekDays([]);
      setPeriods([]);
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
      if (data && data.periods && Array.isArray(data.periods)) {
        data.periods.forEach(period => {
          if (period.dayId && period.periodId) {
            const dayId = period.dayId._id || period.dayId;
            const periodId = period.periodId._id || period.periodId;
            const key = `${dayId}-${periodId}`;
            slotMap[key] = {
              subject: period.subjectId?._id || period.subjectId || '',
              teacher: period.teacherId?._id || period.teacherId || '',
              room: period.roomId?._id || period.roomId || ''
            };
          }
        });
      }
      setTimetable(slotMap);
    } catch (error) {
      console.error('Error fetching timetable:', error);
      // Don't show error if no timetable exists yet
      setTimetable({});
    }
  };

  const handleAddSlot = (dayId, periodId) => {
    // Validate that we have the required resources
    if (subjects.length === 0) {
      toast.error('No subjects available. Please add subjects first.');
      return;
    }
    if (teachers.length === 0) {
      toast.error('No teachers available. Please add teachers first.');
      return;
    }
    if (rooms.length === 0) {
      toast.error('No classrooms available. Please add classrooms first.');
      return;
    }
    if (weekDays.length === 0) {
      toast.error('No week days configured. Please configure week days first.');
      return;
    }
    if (periods.length === 0) {
      toast.error('No time periods configured. Please configure time periods first.');
      return;
    }
    
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
    
    // Enhanced validation with specific error messages
    if (!slotData.subject) {
      toast.error('Please select a subject');
      return;
    }
    if (!slotData.teacher) {
      toast.error('Please select a teacher');
      return;
    }
    if (!slotData.room) {
      toast.error('Please select a room');
      return;
    }
    
    try {
      // Update local state first for better UX
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
    const day = weekDays.find(d => d._id === dayId);
    const period = periods.find(p => p._id === periodId);
    const slotName = `${day?.name || 'Unknown'} - ${period?.name || 'Unknown'}`;
    
    if (!window.confirm(`Are you sure you want to delete the period for "${slotName}"?`)) {
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

      toast.success(`Period deleted for ${slotName}`);
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
    // Comprehensive validation with detailed feedback
    const validationErrors = [];
    
    // Validate mandatory fields
    if (!selectedClass) {
      validationErrors.push('Please select a class (mandatory)');
    }

    // Validate that at least one period is added
    if (filledSlots === 0) {
      validationErrors.push('Please add at least one period to the timetable (mandatory)');
    }

    // Validate resources are available
    if (subjects.length === 0) {
      validationErrors.push('No subjects available. Please add subjects first.');
    }
    if (teachers.length === 0) {
      validationErrors.push('No teachers available. Please add teachers first.');
    }
    if (rooms.length === 0) {
      validationErrors.push('No classrooms available. Please add classrooms first.');
    }
    if (weekDays.length === 0) {
      validationErrors.push('No week days configured. Please configure week days first.');
    }
    if (periods.length === 0) {
      validationErrors.push('No time periods configured. Please configure time periods first.');
    }

    // Show all validation errors at once
    if (validationErrors.length > 0) {
      toast.error(validationErrors[0]); // Show first error
      console.log('Validation errors:', validationErrors);
      return;
    }

    // Validate all slots have complete data
    const invalidSlots = [];
    Object.entries(timetable).forEach(([key, data]) => {
      if (!data.subject || !data.teacher || !data.room) {
        const [dayId, periodId] = key.split('-');
        const day = weekDays.find(d => d._id === dayId);
        const period = periods.find(p => p._id === periodId);
        invalidSlots.push(`${day?.name || 'Unknown'} - ${period?.name || 'Unknown'}`);
      }
    });

    if (invalidSlots.length > 0) {
      toast.error(`Incomplete data for: ${invalidSlots.slice(0, 3).join(', ')}${invalidSlots.length > 3 ? '...' : ''}`);
      return;
    }

    try {
      // Show loading state
      toast.loading('Saving timetable...', { id: 'saveTimetable' });
      
      // Convert timetable to periods array
      const periodsArray = Object.entries(timetable).map(([key, data]) => {
        const [dayId, periodId] = key.split('-');
        return {
          dayId: dayId.trim(),
          periodId: periodId.trim(),
          subjectId: data.subject || null,
          teacherId: data.teacher || null,
          roomId: data.room || null,
          isBreak: false
        };
      });

      // Prepare timetable data with optional fields
      const timetableData = {
        classId: selectedClass,
        periods: periodsArray
      };

      // Add optional fields only if they have values
      if (academicYear) {
        timetableData.academicYear = academicYear;
      }
      if (term) {
        timetableData.term = term;
      }

      const result = await timetableApi.createOrUpdateTimetable(timetableData);

      toast.success('Timetable saved successfully!', { id: 'saveTimetable' });
      
      // Refresh timetable to confirm save
      await fetchTimetable();
      
      // Navigate to view the saved timetable
      setTimeout(() => {
        navigate('/dashboard/timetable/class', { 
          state: { classId: selectedClass, academicYear, term } 
        });
      }, 1500);
    } catch (error) {
      console.error('Error saving timetable:', error);
      toast.error(error.message || 'Failed to save timetable', { id: 'saveTimetable' });
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading resources...</p>
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
          <span className="text-gray-900 dark:text-gray-100 font-semibold">Create Timetable</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Create Timetable</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Design and manage class schedules with mandatory and optional fields
              </p>
              <div className="mt-3 flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full"></span>
                  <span className="text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Mandatory:</span> Class, Subject, Time Periods, Week Days
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full"></span>
                  <span className="text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Optional:</span> Academic Year, Term
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/dashboard/timetable/class')}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 dark:bg-purple-700 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-800 transition-all"
              >
                <Calendar className="w-4 h-4" />
                <span className="font-medium">View Class</span>
              </button>
              <button
                onClick={() => navigate('/dashboard/timetable/teacher')}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 dark:bg-indigo-700 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-800 transition-all"
              >
                <Users className="w-4 h-4" />
                <span className="font-medium">View Teacher</span>
              </button>
              <button
                onClick={handleSaveTimetable}
                disabled={!selectedClass || filledSlots === 0}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 text-white rounded-xl hover:from-green-700 hover:to-green-800 dark:hover:from-green-600 dark:hover:to-green-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Save className="w-5 h-5" />
                <span className="font-semibold">Save Timetable</span>
              </button>
            </div>
          </div>
        </div>

        {/* Class Selection & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Select Class <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
              >
                <option value="">Choose a class...</option>
                {classes.map(cls => (
                  <option key={cls._id} value={cls._id}>
                    {cls.className} - {cls.section}
                  </option>
                ))}
              </select>
              {!selectedClass && (
                <p className="mt-1 text-xs text-red-500">Class selection is required</p>
              )}
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Mandatory:</span> Select the class for this timetable
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Academic Year <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
              >
                {[2023, 2024, 2025, 2026, 2027].map(year => (
                  <option key={year} value={year.toString()}>
                    {year}-{year + 1}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Defaults to current year if not specified
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Term <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <select
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
              >
                <option value="1st Term">1st Term</option>
                <option value="2nd Term">2nd Term</option>
                <option value="3rd Term">3rd Term</option>
                <option value="Annual">Annual</option>
              </select>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Defaults to 1st Term if not specified
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Filled Slots</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{filledSlots}/{totalSlots}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl flex items-center justify-center">
                <Calendar className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Completion</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{completionPercentage}%</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-2xl flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Total Periods</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{periods.length}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-2xl flex items-center justify-center">
                <Clock className="w-7 h-7 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Timetable Grid */}
        {selectedClass ? (
          <div>
            {/* Quick Info */}
            <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4">
              <div className="mb-3">
                <h3 className="text-sm font-bold text-blue-900 dark:text-blue-300 mb-2">
                  📋 Timetable Creation Guide
                </h3>
                <div className="space-y-2 text-sm text-blue-900 dark:text-blue-300">
                  <div>
                    <span className="font-semibold">Mandatory Fields:</span>
                    <ul className="ml-4 mt-1 space-y-1">
                      <li>• <span className="font-medium">Class:</span> Select the class for this timetable</li>
                      <li>• <span className="font-medium">Subject:</span> Choose subject for each period</li>
                      <li>• <span className="font-medium">Time Periods:</span> Configure time slots</li>
                      <li>• <span className="font-medium">Week Days:</span> Select active days</li>
                    </ul>
                  </div>
                  <div>
                    <span className="font-semibold">Optional Fields:</span>
                    <ul className="ml-4 mt-1 space-y-1">
                      <li>• <span className="font-medium">Academic Year:</span> Defaults to current year</li>
                      <li>• <span className="font-medium">Term:</span> Defaults to 1st Term</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-blue-200 dark:border-blue-800">
                <div>
                  <p className="text-sm text-blue-900 dark:text-blue-300">
                    <span className="font-semibold">Setup Progress:</span> Configure your resources in order
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    weekDays.length > 0 ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-300'
                  }`}>
                    Week Days: {weekDays.length}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    periods.length > 0 ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-300'
                  }`}>
                    Periods: {periods.length}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    rooms.length > 0 ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-300'
                  }`}>
                    Rooms: {rooms.length}
                  </div>
                </div>
              </div>
              <p className="text-sm text-blue-900 dark:text-blue-300 mt-3">
                <span className="font-semibold">Tip:</span> Click on any cell to add or edit a period. You can add subjects, assign teachers, and select classrooms. Save your changes using the "Save Timetable" button at the top.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-800 text-white">
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
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {weekDays.filter(day => day.isActive).map(day => (
                    <tr key={day._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-4 py-3 bg-gray-50 dark:bg-gray-700">
                        <div className="font-bold text-gray-900 dark:text-gray-100">{day.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{day.shortName}</div>
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
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-3 hover:shadow-md transition-all">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-1">
                                      <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                      <span className="text-xs font-bold text-blue-900 dark:text-blue-300">
                                        {subject?.code || 'N/A'}
                                      </span>
                                    </div>
                                    <button
                                      onClick={() => handleDeleteSlot(day._id, period._id)}
                                      className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-all"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                  <div className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                                    <div className="flex items-center space-x-1">
                                      <Users className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                                      <span className="truncate">
                                        {teacher?.employeeName || 'Not assigned'}
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <DoorOpen className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                                      <span>
                                        {room?.name || 'Not assigned'}
                                      </span>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleAddSlot(day._id, period._id)}
                                    className="mt-2 w-full text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                                  >
                                    Edit
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleAddSlot(day._id, period._id)}
                                className="w-full h-full min-h-[100px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
                              >
                                <div className="flex flex-col items-center justify-center space-y-2 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400">
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
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-16 text-center">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Select a Class</h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
              Please select a class from the dropdown above to start creating the timetable
            </p>
          </div>
        )}

        {/* Add/Edit Slot Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {getSlotData(currentSlot.day, currentSlot.period) ? 'Edit Period' : 'Add Period'}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {weekDays.find(d => d._id === currentSlot.day)?.name} - {periods.find(p => p._id === currentSlot.period)?.name}
                </p>
              </div>

              <form onSubmit={handleSaveSlot} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Subject <span className="text-red-500">* Mandatory</span>
                  </label>
                  <select
                    value={slotData.subject}
                    onChange={(e) => setSlotData({ ...slotData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                    required
                  >
                    <option value="">Select subject...</option>
                    {subjects.map(subject => (
                      <option key={subject._id} value={subject._id}>
                        {subject.name} ({subject.code})
                      </option>
                    ))}
                  </select>
                  {!slotData.subject && (
                    <p className="mt-1 text-xs text-red-500">Subject is required for this period</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Teacher <span className="text-red-500">* Mandatory</span>
                  </label>
                  <select
                    value={slotData.teacher}
                    onChange={(e) => setSlotData({ ...slotData, teacher: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                    required
                  >
                    <option value="">Select teacher...</option>
                    {teachers.map(teacher => (
                      <option key={teacher._id} value={teacher._id}>
                        {teacher.employeeName} ({teacher.employeeRole})
                      </option>
                    ))}
                  </select>
                  {!slotData.teacher && (
                    <p className="mt-1 text-xs text-red-500">Teacher is required for this period</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Room <span className="text-red-500">* Mandatory</span>
                  </label>
                  <select
                    value={slotData.room}
                    onChange={(e) => setSlotData({ ...slotData, room: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                    required
                  >
                    <option value="">Select room...</option>
                    {rooms.map(room => (
                      <option key={room._id} value={room._id}>
                        {room.name} ({room.building})
                      </option>
                    ))}
                  </select>
                  {!slotData.room && (
                    <p className="mt-1 text-xs text-red-500">Room is required</p>
                  )}
                </div>

                <div className="flex items-center space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={!slotData.subject || !slotData.teacher || !slotData.room}
                    className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-5 h-5" />
                    <span>Save</span>
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

export default CreateTimetable;