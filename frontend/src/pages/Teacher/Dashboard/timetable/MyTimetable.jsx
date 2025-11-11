import { Calendar, Clock, MapPin, Users } from 'lucide-react';

const MyTimetable = () => {
  const timetable = {
    Monday: [
      { time: '09:00 - 10:00', class: '10-A', subject: 'Mathematics', room: 'Room 101' },
      { time: '10:30 - 11:30', class: '9-B', subject: 'Mathematics', room: 'Room 203' },
      { time: '12:00 - 01:00', class: '10-C', subject: 'Mathematics', room: 'Room 105' },
      { time: '02:00 - 03:00', class: '8-A', subject: 'Mathematics', room: 'Room 201' },
    ],
    Tuesday: [
      { time: '09:00 - 10:00', class: '10-A', subject: 'Mathematics', room: 'Room 101' },
      { time: '11:00 - 12:00', class: '9-B', subject: 'Mathematics', room: 'Room 203' },
      { time: '02:00 - 03:00', class: '10-C', subject: 'Mathematics', room: 'Room 105' },
    ],
    Wednesday: [
      { time: '09:00 - 10:00', class: '10-A', subject: 'Mathematics', room: 'Room 101' },
      { time: '10:30 - 11:30', class: '8-A', subject: 'Mathematics', room: 'Room 201' },
      { time: '01:00 - 02:00', class: '9-B', subject: 'Mathematics', room: 'Room 203' },
    ],
    Thursday: [
      { time: '09:00 - 10:00', class: '10-C', subject: 'Mathematics', room: 'Room 105' },
      { time: '11:00 - 12:00', class: '10-A', subject: 'Mathematics', room: 'Room 101' },
      { time: '02:00 - 03:00', class: '9-B', subject: 'Mathematics', room: 'Room 203' },
    ],
    Friday: [
      { time: '09:00 - 10:00', class: '8-A', subject: 'Mathematics', room: 'Room 201' },
      { time: '10:30 - 11:30', class: '10-A', subject: 'Mathematics', room: 'Room 101' },
      { time: '12:00 - 01:00', class: '10-C', subject: 'Mathematics', room: 'Room 105' },
    ],
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">My Timetable</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">View your weekly teaching schedule</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
      <div className="card overflow-x-auto">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Weekly Schedule</h3>
        <div className="min-w-[800px]">
          <div className="grid grid-cols-6 gap-4">
            {/* Header */}
            <div className="font-semibold text-gray-700 dark:text-gray-300 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              Time / Day
            </div>
            {days.map((day) => (
              <div key={day} className="font-semibold text-gray-700 dark:text-gray-300 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
                {day}
              </div>
            ))}

            {/* Time slots */}
            {['09:00 - 10:00', '10:30 - 11:30', '11:00 - 12:00', '12:00 - 01:00', '01:00 - 02:00', '02:00 - 03:00'].map((timeSlot) => (
              <>
                <div key={timeSlot} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {timeSlot}
                </div>
                {days.map((day) => {
                  const classInfo = timetable[day]?.find(c => c.time === timeSlot);
                  return (
                    <div key={`${day}-${timeSlot}`} className="p-3 rounded-lg">
                      {classInfo ? (
                        <div className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-2 border-primary-200 dark:border-primary-800 rounded-lg p-3 hover:shadow-md transition-shadow">
                          <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">{classInfo.class}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{classInfo.subject}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {classInfo.room}
                          </p>
                        </div>
                      ) : (
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-center">
                          <p className="text-xs text-gray-400 dark:text-gray-600">Free</p>
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
