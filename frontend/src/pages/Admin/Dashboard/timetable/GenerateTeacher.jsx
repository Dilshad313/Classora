import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar,
  Download,
  Printer,
  Home,
  ChevronRight,
  BookOpen,
  Users,
  Clock,
  DoorOpen,
  Search,
  UserCheck,
  FileText,
  GraduationCap
} from 'lucide-react';

const GenerateTeacher = () => {
  const navigate = useNavigate();
  
  const [teachers] = useState([
    { id: 1, name: 'Dr. Sharma', subject: 'Mathematics', employeeId: 'EMP001', department: 'Science' },
    { id: 2, name: 'Prof. Kumar', subject: 'Physics', employeeId: 'EMP002', department: 'Science' },
    { id: 3, name: 'Ms. Patel', subject: 'Chemistry', employeeId: 'EMP003', department: 'Science' },
    { id: 4, name: 'Mr. Singh', subject: 'English', employeeId: 'EMP004', department: 'Languages' },
    { id: 5, name: 'Dr. Verma', subject: 'History', employeeId: 'EMP005', department: 'Social Studies' }
  ]);

  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample teacher timetable data
  const [timetableData] = useState({
    1: { // Dr. Sharma (Mathematics)
      Monday: [
        { period: 'Period 1', time: '08:00-08:45', class: 'Grade 10 - A', subject: 'Mathematics', room: 'Room 101' },
        { period: 'Period 2', time: '08:45-09:30', class: 'Grade 11 - B', subject: 'Mathematics', room: 'Room 103' },
        { period: 'Break', time: '09:30-09:45', class: '-', subject: 'Break', room: '-' },
        { period: 'Period 3', time: '09:45-10:30', class: '-', subject: 'Free Period', room: '-' },
        { period: 'Period 4', time: '10:30-11:15', class: 'Grade 10 - B', subject: 'Mathematics', room: 'Room 102' },
        { period: 'Lunch', time: '11:15-12:00', class: '-', subject: 'Lunch Break', room: '-' },
        { period: 'Period 5', time: '12:00-12:45', class: 'Grade 11 - A', subject: 'Mathematics', room: 'Room 104' },
        { period: 'Period 6', time: '12:45-13:30', class: '-', subject: 'Free Period', room: '-' }
      ],
      Tuesday: [
        { period: 'Period 1', time: '08:00-08:45', class: 'Grade 11 - A', subject: 'Mathematics', room: 'Room 104' },
        { period: 'Period 2', time: '08:45-09:30', class: 'Grade 10 - A', subject: 'Mathematics', room: 'Room 101' },
        { period: 'Break', time: '09:30-09:45', class: '-', subject: 'Break', room: '-' },
        { period: 'Period 3', time: '09:45-10:30', class: 'Grade 10 - B', subject: 'Mathematics', room: 'Room 102' },
        { period: 'Period 4', time: '10:30-11:15', class: '-', subject: 'Free Period', room: '-' },
        { period: 'Lunch', time: '11:15-12:00', class: '-', subject: 'Lunch Break', room: '-' },
        { period: 'Period 5', time: '12:00-12:45', class: 'Grade 11 - B', subject: 'Mathematics', room: 'Room 103' },
        { period: 'Period 6', time: '12:45-13:30', class: 'Grade 10 - A', subject: 'Mathematics', room: 'Room 101' }
      ],
      Wednesday: [
        { period: 'Period 1', time: '08:00-08:45', class: 'Grade 10 - B', subject: 'Mathematics', room: 'Room 102' },
        { period: 'Period 2', time: '08:45-09:30', class: 'Grade 10 - A', subject: 'Mathematics', room: 'Room 101' },
        { period: 'Break', time: '09:30-09:45', class: '-', subject: 'Break', room: '-' },
        { period: 'Period 3', time: '09:45-10:30', class: 'Grade 11 - A', subject: 'Mathematics', room: 'Room 104' },
        { period: 'Period 4', time: '10:30-11:15', class: 'Grade 11 - B', subject: 'Mathematics', room: 'Room 103' },
        { period: 'Lunch', time: '11:15-12:00', class: '-', subject: 'Lunch Break', room: '-' },
        { period: 'Period 5', time: '12:00-12:45', class: '-', subject: 'Free Period', room: '-' },
        { period: 'Period 6', time: '12:45-13:30', class: 'Grade 10 - A', subject: 'Mathematics', room: 'Room 101' }
      ],
      Thursday: [
        { period: 'Period 1', time: '08:00-08:45', class: 'Grade 11 - B', subject: 'Mathematics', room: 'Room 103' },
        { period: 'Period 2', time: '08:45-09:30', class: '-', subject: 'Free Period', room: '-' },
        { period: 'Break', time: '09:30-09:45', class: '-', subject: 'Break', room: '-' },
        { period: 'Period 3', time: '09:45-10:30', class: 'Grade 10 - A', subject: 'Mathematics', room: 'Room 101' },
        { period: 'Period 4', time: '10:30-11:15', class: 'Grade 10 - B', subject: 'Mathematics', room: 'Room 102' },
        { period: 'Lunch', time: '11:15-12:00', class: '-', subject: 'Lunch Break', room: '-' },
        { period: 'Period 5', time: '12:00-12:45', class: 'Grade 11 - A', subject: 'Mathematics', room: 'Room 104' },
        { period: 'Period 6', time: '12:45-13:30', class: '-', subject: 'Free Period', room: '-' }
      ],
      Friday: [
        { period: 'Period 1', time: '08:00-08:45', class: '-', subject: 'Free Period', room: '-' },
        { period: 'Period 2', time: '08:45-09:30', class: 'Grade 11 - A', subject: 'Mathematics', room: 'Room 104' },
        { period: 'Break', time: '09:30-09:45', class: '-', subject: 'Break', room: '-' },
        { period: 'Period 3', time: '09:45-10:30', class: 'Grade 11 - B', subject: 'Mathematics', room: 'Room 103' },
        { period: 'Period 4', time: '10:30-11:15', class: 'Grade 10 - A', subject: 'Mathematics', room: 'Room 101' },
        { period: 'Lunch', time: '11:15-12:00', class: '-', subject: 'Lunch Break', room: '-' },
        { period: 'Period 5', time: '12:00-12:45', class: 'Grade 10 - B', subject: 'Mathematics', room: 'Room 102' },
        { period: 'Period 6', time: '12:45-13:30', class: '-', subject: 'Free Period', room: '-' }
      ]
    }
  });

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedTeacherData = teachers.find(t => t.id === parseInt(selectedTeacher));
  const timetable = timetableData[selectedTeacher] || {};

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert('Downloading timetable as PDF...');
    // Implement PDF download logic
  };

  const isBreakOrFree = (subject) => {
    return subject === 'Break' || subject === 'Lunch Break' || subject === 'Free Period';
  };

  const getSubjectColor = (subject) => {
    if (subject === 'Break' || subject === 'Lunch Break') return 'bg-orange-50';
    if (subject === 'Free Period') return 'bg-green-50';
    return 'bg-blue-50';
  };

  // Calculate statistics
  const calculateStats = () => {
    if (!timetable || Object.keys(timetable).length === 0) {
      return { totalPeriods: 0, classPeriods: 0, freePeriods: 0 };
    }

    let totalPeriods = 0;
    let classPeriods = 0;
    let freePeriods = 0;

    Object.values(timetable).forEach(day => {
      day.forEach(period => {
        if (!isBreakOrFree(period.subject)) {
          classPeriods++;
        } else if (period.subject === 'Free Period') {
          freePeriods++;
        }
        if (period.subject !== 'Break' && period.subject !== 'Lunch Break') {
          totalPeriods++;
        }
      });
    });

    return { totalPeriods, classPeriods, freePeriods };
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm print:hidden">
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
          <span className="text-gray-900 font-semibold">Teacher Timetable</span>
        </div>

        {/* Header */}
        <div className="mb-8 print:mb-4">
          <div className="flex items-center justify-between print:block">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 print:text-2xl print:text-center">Teacher Timetable</h1>
              <p className="text-gray-600 mt-1 print:text-center print:text-sm">View and download teacher-wise schedules</p>
            </div>
            <div className="flex items-center space-x-3 print:hidden">
              <button
                onClick={handlePrint}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-xl"
              >
                <Printer className="w-5 h-5" />
                <span className="font-semibold">Print</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl"
              >
                <Download className="w-5 h-5" />
                <span className="font-semibold">Download PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Teacher Selection */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8 print:hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Teacher
              </label>
              <select
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choose a teacher...</option>
                {teachers.map(teacher => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name} - {teacher.subject} ({teacher.employeeId})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search Teachers
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Timetable Display */}
        {selectedTeacher && selectedTeacherData ? (
          <div>
            {/* Teacher Info & Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
              <div className="lg:col-span-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-6 text-white print:bg-white print:text-gray-900 print:border print:border-gray-300">
                <div className="flex items-center space-x-3 mb-4 print:justify-center">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center print:bg-blue-100">
                    <GraduationCap className="w-6 h-6 print:text-blue-600" />
                  </div>
                  <div className="print:hidden">
                    <h3 className="font-bold text-lg">{selectedTeacherData.name}</h3>
                    <p className="text-blue-100 text-sm">{selectedTeacherData.employeeId}</p>
                  </div>
                </div>
                <div className="space-y-2 print:text-center">
                  <p className="text-sm print:font-bold print:text-gray-900 hidden print:block">{selectedTeacherData.name}</p>
                  <p className="text-sm print:text-xs print:text-gray-600">
                    <span className="font-semibold">Subject:</span> {selectedTeacherData.subject}
                  </p>
                  <p className="text-sm print:text-xs print:text-gray-600">
                    <span className="font-semibold">Department:</span> {selectedTeacherData.department}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 print:shadow-none">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Periods</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2 print:text-2xl">{stats.totalPeriods}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center print:w-10 print:h-10">
                    <Clock className="w-6 h-6 text-purple-600 print:w-5 print:h-5" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 print:shadow-none">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Class Periods</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2 print:text-2xl">{stats.classPeriods}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center print:w-10 print:h-10">
                    <BookOpen className="w-6 h-6 text-blue-600 print:w-5 print:h-5" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 print:shadow-none">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Free Periods</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2 print:text-2xl">{stats.freePeriods}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center print:w-10 print:h-10">
                    <UserCheck className="w-6 h-6 text-green-600 print:w-5 print:h-5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Timetable Grid */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden print:shadow-none">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 print:bg-gray-100">
                      <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300 print:text-xs print:py-2">
                        Time / Day
                      </th>
                      {Object.keys(timetable).map(day => (
                        <th key={day} className="px-4 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300 print:text-xs print:py-2">
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timetable[Object.keys(timetable)[0]]?.map((_, periodIndex) => {
                      const period = timetable[Object.keys(timetable)[0]][periodIndex];
                      const isBreakPeriod = period.subject === 'Break' || period.subject === 'Lunch Break';
                      
                      return (
                        <tr key={periodIndex} className={`border-b border-gray-200 ${isBreakPeriod ? 'bg-orange-50 print:bg-gray-50' : 'hover:bg-gray-50'}`}>
                          <td className="px-4 py-3 border-r border-gray-200 print:py-2">
                            <div className="font-semibold text-gray-900 text-sm print:text-xs">{period.period}</div>
                            <div className="text-xs text-gray-500 mt-1 print:text-[10px]">{period.time}</div>
                          </td>
                          {Object.keys(timetable).map(day => {
                            const dayPeriod = timetable[day][periodIndex];
                            const isPeriodBreakOrFree = isBreakOrFree(dayPeriod.subject);
                            
                            return (
                              <td key={day} className={`px-3 py-3 text-center border-r border-gray-200 ${getSubjectColor(dayPeriod.subject)} print:py-2`}>
                                {isPeriodBreakOrFree ? (
                                  <div className={`text-sm font-semibold print:text-xs ${
                                    dayPeriod.subject === 'Free Period' ? 'text-green-700' : 'text-orange-700'
                                  }`}>
                                    {dayPeriod.subject}
                                  </div>
                                ) : (
                                  <div className="space-y-1">
                                    <div className="flex items-center justify-center space-x-1">
                                      <Users className="w-3 h-3 text-blue-600 print:hidden" />
                                      <span className="font-bold text-gray-900 text-sm print:text-xs">
                                        {dayPeriod.class}
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-center space-x-1 text-xs text-gray-600 print:text-[10px]">
                                      <BookOpen className="w-3 h-3 print:hidden" />
                                      <span>{dayPeriod.subject}</span>
                                    </div>
                                    <div className="flex items-center justify-center space-x-1 text-xs text-gray-500 print:text-[10px]">
                                      <DoorOpen className="w-3 h-3 print:hidden" />
                                      <span>{dayPeriod.room}</span>
                                    </div>
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-6 bg-white rounded-2xl shadow-lg border border-gray-200 p-6 print:mt-4 print:shadow-none print:page-break-before">
              <h3 className="text-lg font-bold text-gray-900 mb-4 print:text-sm">Legend</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center print:w-8 print:h-8">
                    <Users className="w-5 h-5 text-blue-600 print:w-4 print:h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm print:text-xs">Class</p>
                    <p className="text-xs text-gray-500 print:text-[10px]">Assigned class</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center print:w-8 print:h-8">
                    <BookOpen className="w-5 h-5 text-purple-600 print:w-4 print:h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm print:text-xs">Subject</p>
                    <p className="text-xs text-gray-500 print:text-[10px]">Teaching subject</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center print:w-8 print:h-8">
                    <DoorOpen className="w-5 h-5 text-green-600 print:w-4 print:h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm print:text-xs">Room</p>
                    <p className="text-xs text-gray-500 print:text-[10px]">Classroom location</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center print:w-8 print:h-8">
                    <Clock className="w-5 h-5 text-orange-600 print:w-4 print:h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm print:text-xs">Free Period</p>
                    <p className="text-xs text-gray-500 print:text-[10px]">No class assigned</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-16 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Teacher Selected</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Please select a teacher from the dropdown above to view their timetable
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateTeacher;
