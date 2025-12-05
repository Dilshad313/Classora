import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Video,
  Users,
  UserCheck,
  GraduationCap,
  BookOpen,
  Home,
  ChevronRight,
  Calendar,
  Clock,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const LiveClass = () => {
  const navigate = useNavigate();

  const [classes] = useState([
    { id: 1, name: 'Grade 10 - A', students: 40 },
    { id: 2, name: 'Grade 10 - B', students: 38 },
    { id: 3, name: 'Grade 11 - A', students: 35 },
    { id: 4, name: 'Grade 11 - B', students: 37 }
  ]);

  const [students] = useState([
    { id: 1, name: 'Arun P', class: 'Grade 10 - A' },
    { id: 2, name: 'Priya Sharma', class: 'Grade 10 - B' },
    { id: 3, name: 'Rahul Kumar', class: 'Grade 11 - A' },
    { id: 4, name: 'Sneha Patel', class: 'Grade 9 - A' }
  ]);

  const [teachers] = useState([
    { id: 1, name: 'Dr. Sharma', subject: 'Mathematics' },
    { id: 2, name: 'Prof. Kumar', subject: 'Physics' },
    { id: 3, name: 'Ms. Patel', subject: 'Chemistry' },
    { id: 4, name: 'Mr. Singh', subject: 'English' }
  ]);

  const [meetings, setMeetings] = useState([
    {
      id: 1,
      title: 'Mathematics Class',
      meetingId: 'MTH-2024-001',
      meetingWith: 'Grade 10 - A',
      duration: 60,
      message: 'Today we will cover Chapter 5: Trigonometry',
      scheduled: true,
      scheduledDate: '2024-11-10',
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
    const prefix = meetingTitle.substring(0, 3).toUpperCase() || 'MTG';
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}-${new Date().getFullYear()}-${random}`;
  };

  const handleCreateMeeting = (e) => {
    e.preventDefault();

    if (!meetingTitle.trim()) {
      alert('Please enter a meeting title');
      return;
    }

    if (!meetingWith) {
      alert('Please select who to meet with');
      return;
    }

    if ((meetingWith === 'specificStudent' || meetingWith === 'specificClass' || meetingWith === 'specificTeacher') && !selectedRecipient) {
      alert('Please select a recipient');
      return;
    }

    if (isScheduled && (!scheduledDate || !scheduledTime)) {
      alert('Please select date and time for scheduled meeting');
      return;
    }

    const newMeeting = {
      id: meetings.length + 1,
      title: meetingTitle,
      meetingId: meetingId || generateMeetingId(),
      meetingWith: getMeetingWithLabel(),
      duration: duration,
      message: message,
      scheduled: isScheduled,
      scheduledDate: scheduledDate,
      scheduledTime: scheduledTime,
      createdAt: new Date().toISOString()
    };

    setMeetings([newMeeting, ...meetings]);
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      setMeetingTitle('');
      setMeetingId('');
      setMeetingWith('');
      setSelectedRecipient('');
      setIsScheduled(false);
      setScheduledDate('');
      setScheduledTime('');
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
        return 'All Students';
      case 'allTeachers':
        return 'All Teachers';
      case 'specificClass':
        return classes.find(c => c.id === parseInt(selectedRecipient))?.name || 'Select Class';
      case 'specificStudent':
        return students.find(s => s.id === parseInt(selectedRecipient))?.name || 'Select Student';
      case 'specificTeacher':
        return teachers.find(t => t.id === parseInt(selectedRecipient))?.name || 'Select Teacher';
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
            onClick={() => navigate('/dashboard')}
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
          <p className="text-gray-600 mt-2">Create and manage virtual classroom meetings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side - Create Meeting Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
                <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                  <Plus className="w-6 h-6 text-purple-600" />
                  <span>Create New Meeting</span>
                </h2>
                <p className="text-sm text-gray-600 mt-1">Set up a live class session</p>
              </div>

              <div className="p-6">
                <form onSubmit={handleCreateMeeting} className="space-y-6">
                  {/* Meeting Title */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Meeting Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={meetingTitle}
                      onChange={(e) => setMeetingTitle(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="e.g., Mathematics Class - Chapter 5"
                      required
                    />
                  </div>

                  {/* Meeting ID */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Meeting ID <span className="text-gray-400 text-xs">(Optional - Auto-generated)</span>
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

                  {/* Meeting With */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3">
                      Meeting With: <span className="text-red-500">*</span>
                    </label>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* All Students */}
                      <button
                        type="button"
                        onClick={() => {
                          setMeetingWith('allStudents');
                          setSelectedRecipient('');
                        }}
                        className={`p-3 rounded-xl border-2 transition-all text-left ${
                          meetingWith === 'allStudents'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            meetingWith === 'allStudents'
                              ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                              : 'bg-gray-100'
                          }`}>
                            <Users className={`w-5 h-5 ${meetingWith === 'allStudents' ? 'text-white' : 'text-gray-400'}`} />
                          </div>
                          <span className="font-semibold text-gray-900 text-sm">All Students</span>
                        </div>
                      </button>

                      {/* All Teachers */}
                      <button
                        type="button"
                        onClick={() => {
                          setMeetingWith('allTeachers');
                          setSelectedRecipient('');
                        }}
                        className={`p-3 rounded-xl border-2 transition-all text-left ${
                          meetingWith === 'allTeachers'
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            meetingWith === 'allTeachers'
                              ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                              : 'bg-gray-100'
                          }`}>
                            <GraduationCap className={`w-5 h-5 ${meetingWith === 'allTeachers' ? 'text-white' : 'text-gray-400'}`} />
                          </div>
                          <span className="font-semibold text-gray-900 text-sm">All Teachers</span>
                        </div>
                      </button>

                      {/* Specific Student */}
                      <button
                        type="button"
                        onClick={() => {
                          setMeetingWith('specificStudent');
                          setSelectedRecipient('');
                        }}
                        className={`p-3 rounded-xl border-2 transition-all text-left ${
                          meetingWith === 'specificStudent'
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            meetingWith === 'specificStudent'
                              ? 'bg-gradient-to-br from-orange-500 to-red-600'
                              : 'bg-gray-100'
                          }`}>
                            <UserCheck className={`w-5 h-5 ${meetingWith === 'specificStudent' ? 'text-white' : 'text-gray-400'}`} />
                          </div>
                          <span className="font-semibold text-gray-900 text-sm">Specific Student</span>
                        </div>
                      </button>

                      {/* Specific Class */}
                      <button
                        type="button"
                        onClick={() => {
                          setMeetingWith('specificClass');
                          setSelectedRecipient('');
                        }}
                        className={`p-3 rounded-xl border-2 transition-all text-left ${
                          meetingWith === 'specificClass'
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            meetingWith === 'specificClass'
                              ? 'bg-gradient-to-br from-purple-500 to-pink-600'
                              : 'bg-gray-100'
                          }`}>
                            <BookOpen className={`w-5 h-5 ${meetingWith === 'specificClass' ? 'text-white' : 'text-gray-400'}`} />
                          </div>
                          <span className="font-semibold text-gray-900 text-sm">Specific Class</span>
                        </div>
                      </button>

                      {/* Specific Teacher */}
                      <button
                        type="button"
                        onClick={() => {
                          setMeetingWith('specificTeacher');
                          setSelectedRecipient('');
                        }}
                        className={`p-3 rounded-xl border-2 transition-all text-left md:col-span-2 ${
                          meetingWith === 'specificTeacher'
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            meetingWith === 'specificTeacher'
                              ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
                              : 'bg-gray-100'
                          }`}>
                            <GraduationCap className={`w-5 h-5 ${meetingWith === 'specificTeacher' ? 'text-white' : 'text-gray-400'}`} />
                          </div>
                          <span className="font-semibold text-gray-900 text-sm">Specific Teacher</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Specific Selection Dropdown */}
                  {(meetingWith === 'specificClass' || meetingWith === 'specificStudent' || meetingWith === 'specificTeacher') && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Select {meetingWith === 'specificClass' ? 'Class' : meetingWith === 'specificStudent' ? 'Student' : 'Teacher'}
                      </label>
                      <select
                        value={selectedRecipient}
                        onChange={(e) => setSelectedRecipient(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        required
                      >
                        <option value="">Choose...</option>
                        {meetingWith === 'specificClass' && classes.map(cls => (
                          <option key={cls.id} value={cls.id}>{cls.name} ({cls.students} students)</option>
                        ))}
                        {meetingWith === 'specificStudent' && students.map(student => (
                          <option key={student.id} value={student.id}>{student.name} - {student.class}</option>
                        ))}
                        {meetingWith === 'specificTeacher' && teachers.map(teacher => (
                          <option key={teacher.id} value={teacher.id}>{teacher.name} - {teacher.subject}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Meeting Duration (minutes)
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
                      <option value={120}>2 hours</option>
                      <option value={180}>3 hours</option>
                    </select>
                  </div>

                  {/* Schedule Checkbox */}
                  <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-xl border border-purple-200">
                    <input
                      type="checkbox"
                      id="schedule"
                      checked={isScheduled}
                      onChange={(e) => setIsScheduled(e.target.checked)}
                      className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-0.5"
                    />
                    <label htmlFor="schedule" className="flex-1 cursor-pointer">
                      <span className="font-semibold text-gray-900 block">I want to schedule this meeting</span>
                      <span className="text-sm text-gray-600">Set a specific date and time for the meeting</span>
                    </label>
                  </div>

                  {/* Schedule Date & Time */}
                  {isScheduled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Time <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="time"
                          value={scheduledTime}
                          onChange={(e) => setScheduledTime(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Write message here <span className="text-gray-400 text-xs">(Optional)</span>
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-h-[100px] resize-y"
                      placeholder="Add any notes or agenda for the meeting..."
                    />
                  </div>

                  {/* Success Message */}
                  {showSuccess && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-green-900">Meeting Created Successfully!</p>
                        <p className="text-sm text-green-700">You can now join or manage your meeting.</p>
                      </div>
                    </div>
                  )}

                  {/* Create & Join Button */}
                  <button
                    type="submit"
                    disabled={showSuccess}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-xl hover:from-purple-700 hover:to-indigo-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Video className="w-6 h-6" />
                    <span>Create & Join</span>
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Right Side - Time/Date & Meetings Table */}
          <div className="lg:col-span-1 space-y-6">
            {/* Current Time & Date */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Current Date & Time</h3>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold">{currentDateTime.date}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold">{currentDateTime.time}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Meetings Table */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
                <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                  <Video className="w-5 h-5 text-purple-600" />
                  <span>All Meetings</span>
                </h3>
                <p className="text-sm text-gray-600 mt-1">{meetings.length} active meeting(s)</p>
              </div>

              <div className="max-h-[600px] overflow-y-auto">
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
                              title="Delete meeting"
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
                            {meeting.scheduled && (
                              <div className="flex items-center space-x-2 text-purple-600 font-semibold">
                                <Calendar className="w-4 h-4" />
                                <span>{meeting.scheduledDate} at {meeting.scheduledTime}</span>
                              </div>
                            )}
                          </div>

                          {meeting.message && (
                            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg line-clamp-2">
                              {meeting.message}
                            </p>
                          )}

                          <button
                            onClick={() => handleJoinRoom(meeting)}
                            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-lg hover:from-purple-700 hover:to-indigo-800 transition-all shadow-md hover:shadow-lg font-semibold"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>Join Room</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No meetings created yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveClass;
