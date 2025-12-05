import { useState, useEffect } from 'react';
import { 
  Video, Calendar, Clock, Users, Play, Pause, 
  Mic, MicOff, Camera, CameraOff, Monitor, 
  MessageSquare, Hand, Settings, PhoneOff
} from 'lucide-react';

const LiveClass = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isInClass, setIsInClass] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isCameraOff, setIsCameraOff] = useState(true);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatMessage, setChatMessage] = useState('');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    setLoading(false);
  }, []);

  // Mock live classes data
  const liveClasses = [
    {
      id: 1,
      subject: 'Mathematics',
      teacher: 'Mr. Johnson',
      topic: 'Quadratic Equations - Advanced Problems',
      startTime: '2024-11-17T10:00:00',
      endTime: '2024-11-17T11:00:00',
      status: 'live',
      participants: 32,
      maxParticipants: 45,
      meetingId: 'MTH-001-2024',
      description: 'We will solve complex quadratic equation problems and discuss different methods.',
      materials: ['Textbook Chapter 4', 'Practice Problems Sheet', 'Formula Reference']
    },
    {
      id: 2,
      subject: 'Physics',
      teacher: 'Dr. Smith',
      topic: 'Optics - Refraction and Lenses',
      startTime: '2024-11-17T14:00:00',
      endTime: '2024-11-17T15:00:00',
      status: 'scheduled',
      participants: 0,
      maxParticipants: 45,
      meetingId: 'PHY-002-2024',
      description: 'Interactive session on light refraction and lens applications.',
      materials: ['Lab Manual', 'Simulation Software', 'Observation Sheet']
    },
    {
      id: 3,
      subject: 'Chemistry',
      teacher: 'Ms. Brown',
      topic: 'Organic Chemistry - Functional Groups',
      startTime: '2024-11-17T15:30:00',
      endTime: '2024-11-17T16:30:00',
      status: 'scheduled',
      participants: 0,
      maxParticipants: 45,
      meetingId: 'CHE-003-2024',
      description: 'Detailed study of organic functional groups and their properties.',
      materials: ['Organic Chemistry Notes', 'Structure Diagrams', 'Practice Questions']
    },
    {
      id: 4,
      subject: 'English',
      teacher: 'Ms. Davis',
      topic: 'Literature Analysis - Poetry Appreciation',
      startTime: '2024-11-16T11:00:00',
      endTime: '2024-11-16T12:00:00',
      status: 'completed',
      participants: 38,
      maxParticipants: 45,
      meetingId: 'ENG-004-2024',
      description: 'Analysis of romantic poetry and literary devices.',
      materials: ['Poetry Collection', 'Analysis Framework', 'Discussion Points'],
      recording: 'available'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'live': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      case 'scheduled': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
      case 'completed': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'live': return <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>;
      case 'scheduled': return <Clock className="w-4 h-4" />;
      case 'completed': return <Play className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const joinClass = (classData) => {
    setSelectedClass(classData);
    setIsInClass(true);
    // Initialize chat with some sample messages
    setChatMessages([
      { id: 1, sender: 'Teacher', message: 'Welcome to the class everyone!', timestamp: new Date() },
      { id: 2, sender: 'John', message: 'Good morning sir!', timestamp: new Date() }
    ]);
  };

  const leaveClass = () => {
    setIsInClass(false);
    setSelectedClass(null);
    setChatMessages([]);
    setIsMuted(true);
    setIsCameraOff(true);
  };

  const sendChatMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: chatMessages.length + 1,
        sender: user.name || 'You',
        message: chatMessage.trim(),
        timestamp: new Date()
      };
      setChatMessages([...chatMessages, newMessage]);
      setChatMessage('');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isInClass && selectedClass) {
    return (
      <div className="h-screen bg-gray-900 text-white flex flex-col">
        {/* Class Header */}
        <div className="bg-gray-800 p-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">{selectedClass.subject} - {selectedClass.topic}</h1>
            <p className="text-gray-300 text-sm">{selectedClass.teacher} • {selectedClass.participants} participants</p>
          </div>
          <button
            onClick={leaveClass}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <PhoneOff className="w-4 h-4" />
            Leave Class
          </button>
        </div>

        <div className="flex-1 flex">
          {/* Main Video Area */}
          <div className="flex-1 flex flex-col">
            {/* Teacher Video */}
            <div className="flex-1 bg-gray-800 relative flex items-center justify-center">
              <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mb-4">
                    <User className="w-16 h-16 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">{selectedClass.teacher}</h3>
                  <p className="text-blue-200">Teaching {selectedClass.subject}</p>
                </div>
              </div>
              
              {/* Video Controls Overlay */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/50 px-6 py-3 rounded-full">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-3 rounded-full transition-colors ${
                    isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'
                  }`}
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => setIsCameraOff(!isCameraOff)}
                  className={`p-3 rounded-full transition-colors ${
                    isCameraOff ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'
                  }`}
                >
                  {isCameraOff ? <CameraOff className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
                </button>
                <button className="p-3 bg-gray-600 hover:bg-gray-700 rounded-full transition-colors">
                  <Monitor className="w-5 h-5" />
                </button>
                <button className="p-3 bg-gray-600 hover:bg-gray-700 rounded-full transition-colors">
                  <Hand className="w-5 h-5" />
                </button>
                <button className="p-3 bg-gray-600 hover:bg-gray-700 rounded-full transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Student Video Grid */}
            <div className="h-32 bg-gray-700 p-2 flex gap-2 overflow-x-auto">
              {/* Your Video */}
              <div className="min-w-[120px] h-full bg-gray-600 rounded-lg flex items-center justify-center relative">
                <div className="text-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mb-1">
                    <span className="text-xs font-bold">{user.name?.charAt(0) || 'Y'}</span>
                  </div>
                  <p className="text-xs">You</p>
                </div>
                {isCameraOff && (
                  <div className="absolute inset-0 bg-black/70 rounded-lg flex items-center justify-center">
                    <CameraOff className="w-6 h-6" />
                  </div>
                )}
              </div>
              
              {/* Other Students */}
              {Array.from({ length: Math.min(selectedClass.participants - 1, 8) }).map((_, index) => (
                <div key={index} className="min-w-[120px] h-full bg-gray-600 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mb-1">
                      <span className="text-xs font-bold">S{index + 1}</span>
                    </div>
                    <p className="text-xs">Student {index + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Sidebar */}
          <div className="w-80 bg-gray-800 flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <h3 className="font-semibold flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Class Chat
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map(msg => (
                <div key={msg.id} className="text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-blue-300">{msg.sender}:</span>
                    <span className="text-xs text-gray-400">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-gray-200">{msg.message}</p>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                />
                <button
                  onClick={sendChatMessage}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Send
                </button>
              </div>
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
            <Video className="w-7 h-7 text-purple-600" />
            Live Classes
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Join live classes and interactive sessions
          </p>
        </div>
      </div>

      {/* Live Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {liveClasses.map(classData => (
          <div key={classData.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {classData.subject}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{classData.teacher}</p>
              </div>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(classData.status)}`}>
                {getStatusIcon(classData.status)}
                {classData.status.charAt(0).toUpperCase() + classData.status.slice(1)}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-100">{classData.topic}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{classData.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Time</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">
                    {formatTime(classData.startTime)} - {formatTime(classData.endTime)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Participants</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">
                    {classData.participants}/{classData.maxParticipants}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500 dark:text-gray-400">Meeting ID</p>
                  <p className="font-mono text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {classData.meetingId}
                  </p>
                </div>
              </div>

              {classData.materials && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Materials:</p>
                  <div className="flex flex-wrap gap-1">
                    {classData.materials.map((material, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                        {material}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                {classData.status === 'live' && (
                  <button
                    onClick={() => joinClass(classData)}
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    Join Class
                  </button>
                )}
                {classData.status === 'scheduled' && (
                  <button className="btn-secondary flex-1 flex items-center justify-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Set Reminder
                  </button>
                )}
                {classData.status === 'completed' && classData.recording && (
                  <button className="btn-primary flex-1 flex items-center justify-center gap-2">
                    <Play className="w-4 h-4" />
                    Watch Recording
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Live Now</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {liveClasses.filter(c => c.status === 'live').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Scheduled</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {liveClasses.filter(c => c.status === 'scheduled').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <Play className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Recordings</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {liveClasses.filter(c => c.recording).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveClass;
