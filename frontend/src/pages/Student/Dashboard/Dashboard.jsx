import { useState, useEffect } from 'react';
import { 
  BookOpen, Calendar, Trophy, Clock, TrendingUp, Users, 
  CheckCircle, AlertCircle, Star, Award, Target, Activity,
  FileText, MessageSquare, Video, Bell, ChevronRight, BookMarked
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    setLoading(false);

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Mock data for dashboard
  const academicStats = {
    currentGPA: 3.8,
    totalCredits: 45,
    completedAssignments: 28,
    pendingAssignments: 5,
    attendanceRate: 92,
    rank: 5,
    totalStudents: 45
  };

  const upcomingClasses = [
    {
      id: 1,
      subject: 'Mathematics',
      teacher: 'Mr. Johnson',
      time: '09:00 AM',
      room: 'Room 101',
      type: 'Regular Class',
      status: 'upcoming'
    },
    {
      id: 2,
      subject: 'Physics',
      teacher: 'Dr. Smith',
      time: '11:00 AM',
      room: 'Lab 2',
      type: 'Lab Session',
      status: 'upcoming'
    },
    {
      id: 3,
      subject: 'English',
      teacher: 'Ms. Davis',
      time: '02:00 PM',
      room: 'Room 205',
      type: 'Literature',
      status: 'upcoming'
    }
  ];

  const recentGrades = [
    {
      id: 1,
      subject: 'Mathematics',
      assignment: 'Algebra Test',
      grade: 'A',
      score: 95,
      date: '2024-11-15',
      feedback: 'Excellent work on complex equations!'
    },
    {
      id: 2,
      subject: 'Physics',
      assignment: 'Lab Report',
      grade: 'B+',
      score: 88,
      date: '2024-11-12',
      feedback: 'Good analysis, improve conclusion'
    },
    {
      id: 3,
      subject: 'Chemistry',
      assignment: 'Quiz 3',
      grade: 'A-',
      score: 92,
      date: '2024-11-10',
      feedback: 'Strong understanding of concepts'
    }
  ];

  const pendingTasks = [
    {
      id: 1,
      title: 'Submit History Essay',
      subject: 'History',
      dueDate: '2024-11-20',
      priority: 'high',
      type: 'assignment'
    },
    {
      id: 2,
      title: 'Physics Lab Report',
      subject: 'Physics',
      dueDate: '2024-11-22',
      priority: 'medium',
      type: 'lab'
    },
    {
      id: 3,
      title: 'Math Problem Set 5',
      subject: 'Mathematics',
      dueDate: '2024-11-25',
      priority: 'low',
      type: 'homework'
    }
  ];

  const announcements = [
    {
      id: 1,
      title: 'Mid-term Exam Schedule Released',
      content: 'The mid-term examination schedule has been published. Please check your timetable.',
      date: '2024-11-17',
      type: 'exam',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Library Hours Extended',
      content: 'Library will remain open until 8 PM during exam week.',
      date: '2024-11-16',
      type: 'facility',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Science Fair Registration',
      content: 'Registration for annual science fair is now open. Deadline: November 30th.',
      date: '2024-11-15',
      type: 'event',
      priority: 'low'
    }
  ];

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'A-': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'B+': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
      case 'B': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
      case 'B-': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Welcome back, {user.name?.split(' ')[0] || 'Student'}! 👋
            </h1>
            <p className="text-blue-100 mb-4">
              Ready to continue your learning journey? Here's what's happening today.
            </p>
            <div className="flex items-center gap-4 text-sm text-blue-100">
              <span>📅 {currentTime.toLocaleDateString()}</span>
              <span>🕐 {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <span>📚 Class {user.class || '10-A'}</span>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">Day {Math.floor(Math.random() * 180) + 1}</div>
              <div className="text-sm text-blue-100">Academic Year</div>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Current GPA</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{academicStats.currentGPA}</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Attendance</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{academicStats.attendanceRate}%</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-2 border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Class Rank</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">#{academicStats.rank}</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-2 border-orange-200 dark:border-orange-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Assignments</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{academicStats.completedAssignments}/{academicStats.completedAssignments + academicStats.pendingAssignments}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-blue-600" />
                Today's Schedule
              </h2>
              <button 
                onClick={() => navigate('/student/timetable')}
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center gap-1"
              >
                View Full Timetable <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              {upcomingClasses.map((class_) => (
                <div key={class_.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100">{class_.subject}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{class_.teacher} • {class_.room}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">{class_.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800 dark:text-gray-100">{class_.time}</p>
                    <span className="inline-block px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs rounded-full">
                      Upcoming
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          {/* Pending Tasks */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-600" />
                Pending Tasks
              </h3>
              <button 
                onClick={() => navigate('/student/assignments')}
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                View All
              </button>
            </div>
            
            <div className="space-y-3">
              {pendingTasks.slice(0, 3).map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                    <FileText className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 dark:text-gray-100 text-sm truncate">{task.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">{task.subject}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => navigate('/student/assignments')}
                className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                <BookMarked className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Assignments</span>
              </button>
              <button 
                onClick={() => navigate('/student/messaging')}
                className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
              >
                <MessageSquare className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                <span className="text-sm font-medium text-green-600 dark:text-green-400">Messages</span>
              </button>
              <button 
                onClick={() => navigate('/student/live-class')}
                className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
              >
                <Video className="w-6 h-6 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Live Class</span>
              </button>
              <button 
                onClick={() => navigate('/student/report-card')}
                className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
              >
                <Trophy className="w-6 h-6 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
                <span className="text-sm font-medium text-orange-600 dark:text-orange-400">Grades</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Grades and Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Grades */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-600" />
              Recent Grades
            </h2>
            <button 
              onClick={() => navigate('/student/test-results')}
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center gap-1"
            >
              View All Results <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            {recentGrades.map((grade) => (
              <div key={grade.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">{grade.assignment}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{grade.subject}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{grade.feedback}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getGradeColor(grade.grade)}`}>
                    {grade.grade}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{grade.score}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Announcements */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <Bell className="w-6 h-6 text-blue-600" />
              Announcements
            </h2>
            <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{announcement.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(announcement.priority)}`}>
                    {announcement.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{announcement.content}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">{announcement.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
