import { Video, Calendar, Users, Clock, Plus } from 'lucide-react';

const LiveClass = () => {
  const upcomingClasses = [
    { id: 1, title: 'Mathematics - Class 10-A', date: '2024-01-15', time: '10:00 AM', duration: '60 min', students: 35 },
    { id: 2, title: 'Mathematics - Class 9-B', date: '2024-01-15', time: '02:00 PM', duration: '45 min', students: 32 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Live Classes</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Schedule and conduct online classes</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Schedule New Class
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800">
          <Video className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Classes</p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">24</p>
        </div>
        <div className="card bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800">
          <Calendar className="w-8 h-8 text-green-600 dark:text-green-400 mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">2</p>
        </div>
        <div className="card bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-800">
          <Users className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Participants</p>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">67</p>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Upcoming Classes</h3>
        <div className="space-y-4">
          {upcomingClasses.map(cls => (
            <div key={cls.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">{cls.title}</h4>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {cls.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {cls.time} ({cls.duration})
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {cls.students} students
                    </span>
                  </div>
                </div>
                <button className="btn-primary flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  Start Class
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveClass;
