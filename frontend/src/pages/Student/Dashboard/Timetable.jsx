import { useState, useEffect } from 'react';
import { 
  Calendar, Clock, MapPin, User, BookOpen, 
  ChevronLeft, ChevronRight, Filter, Download, Printer
} from 'lucide-react';

const Timetable = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    setLoading(false);
  }, []);

  // Mock timetable data
  const timetableData = {
    1: [ // Monday
      { time: '08:00-08:45', subject: 'Mathematics', teacher: 'Mr. Johnson', room: 'Room 101', type: 'Theory' },
      { time: '08:45-09:30', subject: 'Physics', teacher: 'Dr. Smith', room: 'Lab 2', type: 'Lab' },
      { time: '09:30-10:15', subject: 'Chemistry', teacher: 'Ms. Brown', room: 'Lab 1', type: 'Theory' },
      { time: '10:15-10:30', subject: 'Break', teacher: '', room: '', type: 'break' },
      { time: '10:30-11:15', subject: 'English', teacher: 'Ms. Davis', room: 'Room 205', type: 'Theory' },
      { time: '11:15-12:00', subject: 'Biology', teacher: 'Dr. Wilson', room: 'Lab 3', type: 'Lab' },
      { time: '12:00-12:45', subject: 'Hindi', teacher: 'Mr. Sharma', room: 'Room 103', type: 'Theory' },
      { time: '12:45-01:30', subject: 'Lunch Break', teacher: '', room: '', type: 'break' },
      { time: '01:30-02:15', subject: 'Computer Science', teacher: 'Ms. Tech', room: 'Computer Lab', type: 'Practical' },
      { time: '02:15-03:00', subject: 'Physical Education', teacher: 'Mr. Fitness', room: 'Playground', type: 'Activity' }
    ],
    2: [ // Tuesday
      { time: '08:00-08:45', subject: 'Physics', teacher: 'Dr. Smith', room: 'Room 102', type: 'Theory' },
      { time: '08:45-09:30', subject: 'Mathematics', teacher: 'Mr. Johnson', room: 'Room 101', type: 'Theory' },
      { time: '09:30-10:15', subject: 'English', teacher: 'Ms. Davis', room: 'Room 205', type: 'Theory' },
      { time: '10:15-10:30', subject: 'Break', teacher: '', room: '', type: 'break' },
      { time: '10:30-11:15', subject: 'Chemistry', teacher: 'Ms. Brown', room: 'Lab 1', type: 'Lab' },
      { time: '11:15-12:00', subject: 'Hindi', teacher: 'Mr. Sharma', room: 'Room 103', type: 'Theory' },
      { time: '12:00-12:45', subject: 'Biology', teacher: 'Dr. Wilson', room: 'Room 104', type: 'Theory' },
      { time: '12:45-01:30', subject: 'Lunch Break', teacher: '', room: '', type: 'break' },
      { time: '01:30-02:15', subject: 'Art & Craft', teacher: 'Ms. Creative', room: 'Art Room', type: 'Practical' },
      { time: '02:15-03:00', subject: 'Music', teacher: 'Mr. Melody', room: 'Music Room', type: 'Activity' }
    ],
    3: [ // Wednesday
      { time: '08:00-08:45', subject: 'Chemistry', teacher: 'Ms. Brown', room: 'Room 106', type: 'Theory' },
      { time: '08:45-09:30', subject: 'Biology', teacher: 'Dr. Wilson', room: 'Lab 3', type: 'Lab' },
      { time: '09:30-10:15', subject: 'Mathematics', teacher: 'Mr. Johnson', room: 'Room 101', type: 'Theory' },
      { time: '10:15-10:30', subject: 'Break', teacher: '', room: '', type: 'break' },
      { time: '10:30-11:15', subject: 'Physics', teacher: 'Dr. Smith', room: 'Lab 2', type: 'Lab' },
      { time: '11:15-12:00', subject: 'English', teacher: 'Ms. Davis', room: 'Room 205', type: 'Theory' },
      { time: '12:00-12:45', subject: 'Computer Science', teacher: 'Ms. Tech', room: 'Computer Lab', type: 'Theory' },
      { time: '12:45-01:30', subject: 'Lunch Break', teacher: '', room: '', type: 'break' },
      { time: '01:30-02:15', subject: 'Hindi', teacher: 'Mr. Sharma', room: 'Room 103', type: 'Theory' },
      { time: '02:15-03:00', subject: 'Library Period', teacher: 'Ms. Librarian', room: 'Library', type: 'Study' }
    ],
    4: [ // Thursday
      { time: '08:00-08:45', subject: 'English', teacher: 'Ms. Davis', room: 'Room 205', type: 'Theory' },
      { time: '08:45-09:30', subject: 'Chemistry', teacher: 'Ms. Brown', room: 'Lab 1', type: 'Lab' },
      { time: '09:30-10:15', subject: 'Physics', teacher: 'Dr. Smith', room: 'Room 102', type: 'Theory' },
      { time: '10:15-10:30', subject: 'Break', teacher: '', room: '', type: 'break' },
      { time: '10:30-11:15', subject: 'Mathematics', teacher: 'Mr. Johnson', room: 'Room 101', type: 'Theory' },
      { time: '11:15-12:00', subject: 'Biology', teacher: 'Dr. Wilson', room: 'Room 104', type: 'Theory' },
      { time: '12:00-12:45', subject: 'Hindi', teacher: 'Mr. Sharma', room: 'Room 103', type: 'Theory' },
      { time: '12:45-01:30', subject: 'Lunch Break', teacher: '', room: '', type: 'break' },
      { time: '01:30-02:15', subject: 'Computer Science', teacher: 'Ms. Tech', room: 'Computer Lab', type: 'Practical' },
      { time: '02:15-03:00', subject: 'Physical Education', teacher: 'Mr. Fitness', room: 'Playground', type: 'Activity' }
    ],
    5: [ // Friday
      { time: '08:00-08:45', subject: 'Biology', teacher: 'Dr. Wilson', room: 'Lab 3', type: 'Lab' },
      { time: '08:45-09:30', subject: 'English', teacher: 'Ms. Davis', room: 'Room 205', type: 'Theory' },
      { time: '09:30-10:15', subject: 'Hindi', teacher: 'Mr. Sharma', room: 'Room 103', type: 'Theory' },
      { time: '10:15-10:30', subject: 'Break', teacher: '', room: '', type: 'break' },
      { time: '10:30-11:15', subject: 'Physics', teacher: 'Dr. Smith', room: 'Room 102', type: 'Theory' },
      { time: '11:15-12:00', subject: 'Mathematics', teacher: 'Mr. Johnson', room: 'Room 101', type: 'Theory' },
      { time: '12:00-12:45', subject: 'Chemistry', teacher: 'Ms. Brown', room: 'Room 106', type: 'Theory' },
      { time: '12:45-01:30', subject: 'Lunch Break', teacher: '', room: '', type: 'break' },
      { time: '01:30-02:15', subject: 'Social Studies', teacher: 'Mr. History', room: 'Room 107', type: 'Theory' },
      { time: '02:15-03:00', subject: 'Assembly', teacher: 'All Teachers', room: 'Main Hall', type: 'Activity' }
    ],
    6: [ // Saturday
      { time: '08:00-08:45', subject: 'Mathematics', teacher: 'Mr. Johnson', room: 'Room 101', type: 'Theory' },
      { time: '08:45-09:30', subject: 'Science Project', teacher: 'All Science Teachers', room: 'Labs', type: 'Project' },
      { time: '09:30-10:15', subject: 'English', teacher: 'Ms. Davis', room: 'Room 205', type: 'Theory' },
      { time: '10:15-10:30', subject: 'Break', teacher: '', room: '', type: 'break' },
      { time: '10:30-11:15', subject: 'Extra Curricular', teacher: 'Various', room: 'Various', type: 'Activity' },
      { time: '11:15-12:00', subject: 'Sports', teacher: 'Mr. Fitness', room: 'Playground', type: 'Activity' }
    ]
  };

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getSubjectColor = (subject) => {
    const colors = {
      'Mathematics': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      'Physics': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      'Chemistry': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
      'Biology': 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      'English': 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
      'Hindi': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
      'Computer Science': 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
      'Physical Education': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
      'Break': 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600',
      'Lunch Break': 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600'
    };
    return colors[subject] || 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600';
  };

  const getCurrentTimeSlot = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const todaySchedule = timetableData[now.getDay()] || [];
    
    return todaySchedule.findIndex(slot => {
      const [startTime] = slot.time.split('-');
      const [hours, minutes] = startTime.split(':').map(Number);
      const slotTime = hours * 60 + minutes;
      return currentTime >= slotTime && currentTime < slotTime + 45;
    });
  };

  const currentSlot = getCurrentTimeSlot();

  const handleDownload = () => {
    // Mock download functionality
    const element = document.createElement('a');
    const file = new Blob(['Timetable Data'], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `timetable-${user.name || 'student'}.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="card">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <Calendar className="w-7 h-7 text-blue-600" />
            My Timetable
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Class {user.class || '10-A'} • Academic Year 2024-2025
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="btn-secondary flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button
            onClick={handleDownload}
            className="btn-primary flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>

      {/* Current Class Info */}
      {new Date().getDay() >= 1 && new Date().getDay() <= 6 && currentSlot >= 0 && (
        <div className="card bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-blue-700 dark:text-blue-300">Current Class</h2>
              <p className="text-blue-600 dark:text-blue-400 text-lg font-semibold">
                {timetableData[new Date().getDay()][currentSlot].subject}
              </p>
              <div className="flex items-center gap-4 mt-2 text-sm text-blue-600 dark:text-blue-400">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {timetableData[new Date().getDay()][currentSlot].teacher}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {timetableData[new Date().getDay()][currentSlot].room}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {timetableData[new Date().getDay()][currentSlot].time}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Day Selector */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Weekly Schedule</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentWeek(new Date(currentWeek.getTime() - 7 * 24 * 60 * 60 * 1000))}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 px-4">
              Week of {currentWeek.toLocaleDateString()}
            </span>
            <button
              onClick={() => setCurrentWeek(new Date(currentWeek.getTime() + 7 * 24 * 60 * 60 * 1000))}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-6">
          {shortDays.map((day, index) => (
            <button
              key={index}
              onClick={() => setSelectedDay(index)}
              className={`p-3 rounded-lg text-center transition-colors ${
                selectedDay === index
                  ? 'bg-blue-500 text-white'
                  : index === 0 
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              disabled={index === 0}
            >
              <div className="text-xs font-medium">{day}</div>
              <div className="text-lg font-bold mt-1">
                {new Date(currentWeek.getTime() + (index - currentWeek.getDay()) * 24 * 60 * 60 * 1000).getDate()}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Timetable Display */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            {days[selectedDay]} Schedule
          </h2>
          {selectedDay === 0 && (
            <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
              Holiday
            </span>
          )}
        </div>

        {selectedDay === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No Classes Today
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              Enjoy your Sunday! Classes resume on Monday.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {(timetableData[selectedDay] || []).map((slot, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedDay === new Date().getDay() && index === currentSlot
                    ? 'ring-2 ring-blue-500 ring-opacity-50 shadow-lg'
                    : ''
                } ${getSubjectColor(slot.subject)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-sm font-semibold">{slot.time.split('-')[0]}</div>
                      <div className="text-xs opacity-75">{slot.time.split('-')[1]}</div>
                    </div>
                    <div className="w-px h-12 bg-current opacity-20"></div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{slot.subject}</h3>
                      {slot.teacher && (
                        <div className="flex items-center gap-4 mt-1 text-sm opacity-75">
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {slot.teacher}
                          </span>
                          {slot.room && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {slot.room}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-1 bg-white/50 dark:bg-black/20 rounded-full text-xs font-medium">
                      {slot.type}
                    </span>
                    {selectedDay === new Date().getDay() && index === currentSlot && (
                      <div className="text-xs font-semibold mt-1 animate-pulse">
                        • Live Now
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Weekly Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Weekly Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Classes</span>
              <span className="font-semibold">48</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Theory Classes</span>
              <span className="font-semibold">32</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Lab Sessions</span>
              <span className="font-semibold">12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Activities</span>
              <span className="font-semibold">4</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Subject Hours</h3>
          <div className="space-y-2">
            {['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'].map((subject) => (
              <div key={subject} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getSubjectColor(subject).split(' ')[0]}`}></div>
                <span className="text-sm text-gray-600 dark:text-gray-400 flex-1">{subject}</span>
                <span className="text-sm font-semibold">6h</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Quick Info</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="text-gray-600 dark:text-gray-400">School Hours: 8:00 AM - 3:00 PM</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-green-500" />
              <span className="text-gray-600 dark:text-gray-400">Working Days: Monday - Saturday</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-500" />
              <span className="text-gray-600 dark:text-gray-400">Class Duration: 45 minutes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timetable;
