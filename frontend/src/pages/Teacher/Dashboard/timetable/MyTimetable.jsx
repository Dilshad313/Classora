import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Printer } from 'lucide-react';
import { timetableApi } from '../../../../services/timetableApi';
import toast from 'react-hot-toast';

const MyTimetable = () => {
  const [timetable, setTimetable] = useState({});
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        setLoading(true);
        const data = await timetableApi.getTimetableByTeacher(user._id);
        if (data) {
          // The data is already grouped by day, we just need to format it for the table
          const formattedTimetable = {};
          data.groupedByDay.forEach(day => {
            formattedTimetable[day.day.name] = day.periods.map(period => ({
              time: `${period.periodId.startTime} - ${period.periodId.endTime}`,
              class: `${period.className}-${period.section}`,
              subject: period.subjectName,
              room: period.roomName
            }));
          });
          setTimetable(formattedTimetable);
        }
      } catch (error) {
        console.error('Error fetching timetable:', error);
        toast.error('Failed to load timetable');
      } finally {
        setLoading(false);
      }
    };

    if (user._id) {
      fetchTimetable();
    }
  }, [user._id]);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  // Print functionality
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Print Header - Only visible when printing */}
      <div className="hidden print:block text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Teacher Timetable</h1>
        <p className="text-lg text-gray-700">Weekly Teaching Schedule</p>
        <p className="text-sm text-gray-600 mt-2">Generated on: {new Date().toLocaleDateString()}</p>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">My Timetable</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">View your weekly teaching schedule</p>
        </div>
        <button
          onClick={handlePrint}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
        >
          <Printer className="w-5 h-5" />
          Print Timetable
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 print:hidden">
        <div className="card bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800">
          <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Classes This Week</p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">18</p>
        </div>
        <div className="card bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800">
          <Clock className="w-8 h-8 text-green-600 dark:text-green-400 mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Teaching Hours</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">18</p>
        </div>
        <div className="card bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-800">
          <Users className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Classes</p>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">5</p>
        </div>
        <div className="card bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-800">
          <MapPin className="w-8 h-8 text-orange-600 dark:text-orange-400 mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Rooms Used</p>
          <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">4</p>
        </div>
      </div>

      {/* Timetable */}
      <div className="card overflow-x-auto print:overflow-visible print:shadow-none print:border-0">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 print:text-black print:text-xl print:mb-6">Weekly Schedule</h3>
        <div className="min-w-[800px] print:min-w-0">
          <div className="grid grid-cols-6 gap-4 print:gap-1">
            {/* Header */}
            <div className="font-semibold text-gray-700 dark:text-gray-300 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg print:bg-gray-200 print:text-black print:border print:border-gray-400 print:rounded-none">
              Time / Day
            </div>
            {days.map((day) => (
              <div key={day} className="font-semibold text-gray-700 dark:text-gray-300 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-center print:bg-gray-200 print:text-black print:border print:border-gray-400 print:rounded-none">
                {day}
              </div>
            ))}

            {/* Time slots */}
            {['09:00 - 10:00', '10:30 - 11:30', '11:00 - 12:00', '12:00 - 01:00', '01:00 - 02:00', '02:00 - 03:00'].map((timeSlot) => (
              <>
                <div key={timeSlot} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm text-gray-600 dark:text-gray-400 font-medium print:bg-gray-100 print:text-black print:border print:border-gray-400 print:rounded-none">
                  {timeSlot}
                </div>
                {days.map((day) => {
                  const classInfo = timetable[day]?.find(c => c.time === timeSlot);
                  return (
                    <div key={`${day}-${timeSlot}`} className="p-3 rounded-lg print:p-2 print:rounded-none">
                      {classInfo ? (
                        <div className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-2 border-primary-200 dark:border-primary-800 rounded-lg p-3 hover:shadow-md transition-shadow print:bg-blue-50 print:border print:border-blue-300 print:rounded-none print:p-2">
                          <p className="font-semibold text-sm text-gray-800 dark:text-gray-100 print:text-black print:text-xs">{classInfo.class}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 print:text-black print:text-xs">{classInfo.subject}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 flex items-center gap-1 print:text-black print:text-xs">
                            <MapPin className="w-3 h-3 print:hidden" />
                            <span className="print:before:content-['📍_']">{classInfo.room}</span>
                          </p>
                        </div>
                      ) : (
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-center print:bg-gray-50 print:border print:border-gray-300 print:rounded-none print:p-2">
                          <p className="text-xs text-gray-400 dark:text-gray-600 print:text-gray-500">Free</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTimetable;
