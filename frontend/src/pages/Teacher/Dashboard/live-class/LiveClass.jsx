import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Video,
  Users,
  UserCheck,
  BookOpen,
  Home,
  ChevronRight,
  Calendar,
  Clock,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  User
} from 'lucide-react';

const LiveClass = () => {
  const navigate = useNavigate();

  // Teacher-specific data
  const [classes] = useState([
    { id: 1, name: 'Class 10-A', students: 35 },
    { id: 2, name: 'Class 10-B', students: 32 },
    { id: 3, name: 'Class 9-A', students: 30 },
    { id: 4, name: 'Class 9-B', students: 28 }
  ]);

  const [students] = useState([
    { id: 1, name: 'Arun P', class: 'Class 10-A' },
    { id: 2, name: 'Priya Sharma', class: 'Class 10-B' },
    { id: 3, name: 'Rahul Kumar', class: 'Class 9-A' },
    { id: 4, name: 'Sneha Patel', class: 'Class 9-B' }
  ]);

  const [parents] = useState([
    { id: 1, name: 'Mr. Arun Kumar', child: 'Arun P', class: 'Class 10-A' },
    { id: 2, name: 'Mrs. Priya Sharma', child: 'Priya Sharma', class: 'Class 10-B' },
    { id: 3, name: 'Mr. Rahul Singh', child: 'Rahul Kumar', class: 'Class 9-A' },
    { id: 4, name: 'Mrs. Sneha Gupta', child: 'Sneha Patel', class: 'Class 9-B' }
  ]);

  const [meetings, setMeetings] = useState([
    {
      id: 1,
      title: 'Mathematics Class - Trigonometry',
      meetingId: 'MTH-2024-001',
      meetingWith: 'Class 10-A',
      duration: 60,
      message: 'Today we will cover Chapter 5: Trigonometry basics and applications',
      scheduled: true,
      scheduledDate: '2024-11-15',
      scheduledTime: '10:00',
      createdAt: new Date().toISOString()
    }
  ]);

  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingId, setMeetingId] = useState('');
  const [meetingWith, setMeetingWith] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [duration, setDuration] = useState(60);
  const [message, setMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const generateMeetingId = () => {
    const prefix = meetingTitle.substring(0, 3).toUpperCase() || 'CLS';
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}-${new Date().getFullYear()}-${random}`;
  };

  const handleCreateMeeting = (e) => {
    e.preventDefault();

    if (!meetingTitle.trim()) {
      alert('Please enter a class title');
      return;
    }

    if (!selectedRecipient) {
      alert('Please select a class');
      return;
    }

    const selectedClass = classes.find(c => c.id === parseInt(selectedRecipient));
    
    const newMeeting = {
      id: meetings.length + 1,
      title: meetingTitle,
      meetingId: meetingId || generateMeetingId(),
      meetingWith: selectedClass ? selectedClass.name : 'Selected Class',
      duration: duration,
      message: message,
      scheduled: false,
      scheduledDate: '',
      scheduledTime: '',
      createdAt: new Date().toISOString()
    };

    setMeetings([newMeeting, ...meetings]);
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      setMeetingTitle('');
      setMeetingId('');
      setSelectedRecipient('');
      setDuration(60);
      setMessage('');
    }, 2000);
  };

  const handleDeleteMeeting = (id) => {
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      setMeetings(meetings.filter(meeting => meeting.id !== id));
    }
  };

  const handleJoinRoom = (meeting) => {
    alert(`Joining meeting: ${meeting.title}\nMeeting ID: ${meeting.meetingId}`);
  };

  const getMeetingWithLabel = () => {
    switch(meetingWith) {
      case 'allStudents':
        return 'All My Students';
      case 'allParents':
        return 'All Parents';
      case 'specificClass':
        return classes.find(c => c.id === parseInt(selectedRecipient))?.name || 'Select Class';
      case 'specificStudent':
        return students.find(s => s.id === parseInt(selectedRecipient))?.name || 'Select Student';
      case 'specificParent':
        return parents.find(p => p.id === parseInt(selectedRecipient))?.name || 'Select Parent';
      default:
        return '';
    }
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    return {
      date: now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      })
    };
  };

  const currentDateTime = getCurrentDateTime();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <button 
            onClick={() => navigate('/teacher')}
            className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-blue-600 font-semibold">Live Class</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-semibold">Meetings</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Video className="w-6 h-6 text-white" />
            </div>
            <span>Live Class Management</span>
          </h1>
          <p className="text-gray-600 mt-2">Create and manage virtual classroom sessions with your students</p>
        </div>

        {/* Simple Live Class Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Create New Class */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
              <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                <Plus className="w-6 h-6 text-purple-600" />
                <span>Create New Live Class</span>
              </h2>
              <p className="text-sm text-gray-600 mt-1">Set up a virtual classroom session</p>
            </div>

            <div className="p-6">
              <form onSubmit={handleCreateMeeting} className="space-y-6">
                {/* Class Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Class Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={meetingTitle}
                    onChange={(e) => setMeetingTitle(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="e.g., Mathematics Class - Algebra"
                    required
                  />
                </div>

                {/* Meeting ID */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Meeting ID <span className="text-gray-400 text-xs">(Auto-generated)</span>
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={meetingId}
                      onChange={(e) => setMeetingId(e.target.value)}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Leave empty for auto-generation"
                    />
                    <button
                      type="button"
                      onClick={() => setMeetingId(generateMeetingId())}
                      className="px-4 py-2.5 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-colors font-semibold"
                    >
                      Generate
                    </button>
                  </div>
                </div>

                {/* Class Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Class <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedRecipient}
                    onChange={(e) => setSelectedRecipient(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  >
                    <option value="">Choose a class...</option>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>{cls.name} ({cls.students} students)</option>
                    ))}
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Class Duration
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                  </select>
                </div>

                {/* Success Message */}
                {showSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                    <div>
                      <p className="font-semibold text-green-900">Live Class Created!</p>
                      <p className="text-sm text-green-700">You can now join your class.</p>
                    </div>
                  </div>
                )}

                {/* Create Button */}
                <button
                  type="submit"
                  disabled={showSuccess}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-xl hover:from-purple-700 hover:to-indigo-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold text-lg disabled:opacity-50"
                >
                  <Video className="w-6 h-6" />
                  <span>Create & Join Class</span>
                </button>
              </form>
            </div>
          </div>

          {/* My Live Classes */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                <Video className="w-5 h-5 text-blue-600" />
                <span>My Live Classes</span>
              </h3>
              <p className="text-sm text-gray-600 mt-1">{meetings.length} active class(es)</p>
            </div>

            <div className="max-h-[500px] overflow-y-auto">
              {meetings.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {meetings.map((meeting) => (
                    <div key={meeting.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 mb-1">{meeting.title}</h4>
                            <p className="text-xs text-gray-500 font-mono bg-gray-100 inline-block px-2 py-1 rounded">
                              {meeting.meetingId}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteMeeting(meeting.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="space-y-1 text-sm">
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Users className="w-4 h-4" />
                            <span>{meeting.meetingWith}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{meeting.duration} minutes</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleJoinRoom(meeting)}
                          className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-lg hover:from-purple-700 hover:to-indigo-800 transition-all shadow-md hover:shadow-lg font-semibold"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Join Class</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No live classes created yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveClass;
