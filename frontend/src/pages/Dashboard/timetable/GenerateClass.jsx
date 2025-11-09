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
  Filter,
  FileText
} from 'lucide-react';

const GenerateClass = () => {
  const navigate = useNavigate();
  
  const [classes] = useState([
    { id: 1, name: 'Grade 10 - A', students: 40, section: 'A' },
    { id: 2, name: 'Grade 10 - B', students: 38, section: 'B' },
    { id: 3, name: 'Grade 11 - A', students: 35, section: 'A' },
    { id: 4, name: 'Grade 11 - B', students: 37, section: 'B' }
  ]);

  const [selectedClass, setSelectedClass] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample timetable data
  const [timetableData] = useState({
    1: { // Grade 10 - A
      Monday: [
        { period: 'Period 1', time: '08:00-08:45', subject: 'Mathematics', teacher: 'Dr. Sharma', room: 'Room 101' },
        { period: 'Period 2', time: '08:45-09:30', subject: 'Physics', teacher: 'Prof. Kumar', room: 'Lab 201' },
        { period: 'Break', time: '09:30-09:45', subject: 'Break', teacher: '-', room: '-' },
        { period: 'Period 3', time: '09:45-10:30', subject: 'Chemistry', teacher: 'Ms. Patel', room: 'Lab 202' },
        { period: 'Period 4', time: '10:30-11:15', subject: 'English', teacher: 'Mr. Singh', room: 'Room 101' },
        { period: 'Lunch', time: '11:15-12:00', subject: 'Lunch Break', teacher: '-', room: '-' },
        { period: 'Period 5', time: '12:00-12:45', subject: 'History', teacher: 'Dr. Verma', room: 'Room 102' },
        { period: 'Period 6', time: '12:45-13:30', subject: 'Computer', teacher: 'Mr. Reddy', room: 'Computer Lab' }
      ],
      Tuesday: [
        { period: 'Period 1', time: '08:00-08:45', subject: 'English', teacher: 'Mr. Singh', room: 'Room 101' },
        { period: 'Period 2', time: '08:45-09:30', subject: 'Mathematics', teacher: 'Dr. Sharma', room: 'Room 101' },
        { period: 'Break', time: '09:30-09:45', subject: 'Break', teacher: '-', room: '-' },
        { period: 'Period 3', time: '09:45-10:30', subject: 'Physics', teacher: 'Prof. Kumar', room: 'Lab 201' },
        { period: 'Period 4', time: '10:30-11:15', subject: 'Chemistry', teacher: 'Ms. Patel', room: 'Lab 202' },
        { period: 'Lunch', time: '11:15-12:00', subject: 'Lunch Break', teacher: '-', room: '-' },
        { period: 'Period 5', time: '12:00-12:45', subject: 'Physical Education', teacher: 'Coach Rao', room: 'Ground' },
        { period: 'Period 6', time: '12:45-13:30', subject: 'History', teacher: 'Dr. Verma', room: 'Room 102' }
      ],
      Wednesday: [
        { period: 'Period 1', time: '08:00-08:45', subject: 'Chemistry', teacher: 'Ms. Patel', room: 'Lab 202' },
        { period: 'Period 2', time: '08:45-09:30', subject: 'Mathematics', teacher: 'Dr. Sharma', room: 'Room 101' },
        { period: 'Break', time: '09:30-09:45', subject: 'Break', teacher: '-', room: '-' },
        { period: 'Period 3', time: '09:45-10:30', subject: 'English', teacher: 'Mr. Singh', room: 'Room 101' },
        { period: 'Period 4', time: '10:30-11:15', subject: 'Physics', teacher: 'Prof. Kumar', room: 'Lab 201' },
        { period: 'Lunch', time: '11:15-12:00', subject: 'Lunch Break', teacher: '-', room: '-' },
        { period: 'Period 5', time: '12:00-12:45', subject: 'Computer', teacher: 'Mr. Reddy', room: 'Computer Lab' },
        { period: 'Period 6', time: '12:45-13:30', subject: 'History', teacher: 'Dr. Verma', room: 'Room 102' }
      ],
      Thursday: [
        { period: 'Period 1', time: '08:00-08:45', subject: 'Physics', teacher: 'Prof. Kumar', room: 'Lab 201' },
        { period: 'Period 2', time: '08:45-09:30', subject: 'English', teacher: 'Mr. Singh', room: 'Room 101' },
        { period: 'Break', time: '09:30-09:45', subject: 'Break', teacher: '-', room: '-' },
        { period: 'Period 3', time: '09:45-10:30', subject: 'Mathematics', teacher: 'Dr. Sharma', room: 'Room 101' },
        { period: 'Period 4', time: '10:30-11:15', subject: 'History', teacher: 'Dr. Verma', room: 'Room 102' },
        { period: 'Lunch', time: '11:15-12:00', subject: 'Lunch Break', teacher: '-', room: '-' },
        { period: 'Period 5', time: '12:00-12:45', subject: 'Chemistry', teacher: 'Ms. Patel', room: 'Lab 202' },
        { period: 'Period 6', time: '12:45-13:30', subject: 'Computer', teacher: 'Mr. Reddy', room: 'Computer Lab' }
      ],
      Friday: [
        { period: 'Period 1', time: '08:00-08:45', subject: 'History', teacher: 'Dr. Verma', room: 'Room 102' },
        { period: 'Period 2', time: '08:45-09:30', subject: 'Chemistry', teacher: 'Ms. Patel', room: 'Lab 202' },
        { period: 'Break', time: '09:30-09:45', subject: 'Break', teacher: '-', room: '-' },
        { period: 'Period 3', time: '09:45-10:30', subject: 'Computer', teacher: 'Mr. Reddy', room: 'Computer Lab' },
        { period: 'Period 4', time: '10:30-11:15', subject: 'Mathematics', teacher: 'Dr. Sharma', room: 'Room 101' },
        { period: 'Lunch', time: '11:15-12:00', subject: 'Lunch Break', teacher: '-', room: '-' },
        { period: 'Period 5', time: '12:00-12:45', subject: 'English', teacher: 'Mr. Singh', room: 'Room 101' },
        { period: 'Period 6', time: '12:45-13:30', subject: 'Physical Education', teacher: 'Coach Rao', room: 'Ground' }
      ]
    }
  });

  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedClassData = classes.find(c => c.id === parseInt(selectedClass));
  const timetable = timetableData[selectedClass] || {};

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert('Downloading timetable as PDF...');
    // Implement PDF download logic
  };

  const isBreak = (subject) => {
    return subject === 'Break' || subject === 'Lunch Break';
  };

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
          <span className="text-gray-900 font-semibold">Class Timetable</span>
        </div>

        {/* Header */}
        <div className="mb-8 print:mb-4">
          <div className="flex items-center justify-between print:block">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 print:text-2xl print:text-center">Class Timetable</h1>
              <p className="text-gray-600 mt-1 print:text-center print:text-sm">View and download class-wise schedules</p>
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

        {/* Class Selection */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8 print:hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choose a class...</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} ({cls.students} students)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search Classes
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by class name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Timetable Display */}
        {selectedClass && selectedClassData ? (
          <div>
            {/* Class Info */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-6 mb-6 text-white print:bg-white print:text-gray-900 print:border print:border-gray-300">
              <div className="flex items-center justify-between print:block">
                <div>
                  <h2 className="text-2xl font-bold print:text-xl print:text-center">{selectedClassData.name}</h2>
                  <p className="text-blue-100 mt-1 print:text-gray-600 print:text-center">
                    Total Students: {selectedClassData.students} | Section: {selectedClassData.section}
                  </p>
                </div>
                <div className="flex items-center space-x-2 print:hidden">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6" />
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
                      <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300 print:text-xs">
                        Time / Day
                      </th>
                      {Object.keys(timetable).map(day => (
                        <th key={day} className="px-4 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300 print:text-xs">
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timetable[Object.keys(timetable)[0]]?.map((_, periodIndex) => {
                      const period = timetable[Object.keys(timetable)[0]][periodIndex];
                      const isBreakPeriod = isBreak(period.subject);
                      
                      return (
                        <tr key={periodIndex} className={`border-b border-gray-200 ${isBreakPeriod ? 'bg-orange-50 print:bg-gray-50' : 'hover:bg-gray-50'}`}>
                          <td className="px-4 py-3 border-r border-gray-200 print:py-2">
                            <div className="font-semibold text-gray-900 text-sm print:text-xs">{period.period}</div>
                            <div className="text-xs text-gray-500 mt-1 print:text-[10px]">{period.time}</div>
                          </td>
                          {Object.keys(timetable).map(day => {
                            const dayPeriod = timetable[day][periodIndex];
                            const isPeriodBreak = isBreak(dayPeriod.subject);
                            
                            return (
                              <td key={day} className="px-3 py-3 text-center border-r border-gray-200 print:py-2">
                                {isPeriodBreak ? (
                                  <div className="text-sm font-semibold text-orange-700 print:text-xs">
                                    {dayPeriod.subject}
                                  </div>
                                ) : (
                                  <div className="space-y-1">
                                    <div className="flex items-center justify-center space-x-1">
                                      <BookOpen className="w-3 h-3 text-blue-600 print:hidden" />
                                      <span className="font-bold text-gray-900 text-sm print:text-xs">
                                        {dayPeriod.subject}
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-center space-x-1 text-xs text-gray-600 print:text-[10px]">
                                      <Users className="w-3 h-3 print:hidden" />
                                      <span>{dayPeriod.teacher}</span>
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
            <div className="mt-6 bg-white rounded-2xl shadow-lg border border-gray-200 p-6 print:mt-4 print:shadow-none">
              <h3 className="text-lg font-bold text-gray-900 mb-4 print:text-sm">Legend</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center print:w-8 print:h-8">
                    <BookOpen className="w-5 h-5 text-blue-600 print:w-4 print:h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm print:text-xs">Subject</p>
                    <p className="text-xs text-gray-500 print:text-[10px]">Class subject</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center print:w-8 print:h-8">
                    <Users className="w-5 h-5 text-purple-600 print:w-4 print:h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm print:text-xs">Teacher</p>
                    <p className="text-xs text-gray-500 print:text-[10px]">Assigned teacher</p>
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
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-16 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Class Selected</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Please select a class from the dropdown above to view its timetable
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateClass;
