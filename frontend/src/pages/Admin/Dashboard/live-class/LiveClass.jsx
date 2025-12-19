import React, { useState, useEffect } from 'react';
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
  AlertCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';

// API Service Import (create this file in services/meetingApi.js)
import meetingApi from '../../../../services/meetingApi';

const LiveClass = () => {
  const navigate = useNavigate();

  // State for data
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [meetings, setMeetings] = useState([]);
  
  // State for form
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingId, setMeetingId] = useState('');
  const [meetingWith, setMeetingWith] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [duration, setDuration] = useState(60);
  const [message, setMessage] = useState('');
  
  // UI State
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState({
    meetings: false,
    classes: false,
    students: false,
    teachers: false,
    creating: false
  });
  const [error, setError] = useState('');

  // Fetch initial data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading({
        meetings: true,
        classes: true,
        students: true,
        teachers: true,
        creating: false
      });
      setError('');

      // Fetch all data in parallel
      const [meetingsData, classesData, studentsData, teachersData] = await Promise.all([
        meetingApi.getMeetings(),
        getAvailableClasses(),
        getAvailableStudents(),
        getAvailableTeachers()
      ]);

      setMeetings(meetingsData?.data || []);
      setClasses(classesData || []);
      setStudents(studentsData || []);
      setTeachers(teachersData || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      setError(`Failed to load data: ${error.message}`);
      
      // Try to fetch at least meetings if other calls fail
      try {
        const meetingsData = await meetingApi.getMeetings();
        setMeetings(meetingsData?.data || []);
      } catch (meetingsError) {
        console.error('Could not fetch meetings:', meetingsError);
      }
    } finally {
      setLoading({
        meetings: false,
        classes: false,
        students: false,
        teachers: false,
        creating: false
      });
    }
  };

  // Helper functions to fetch available data
  const getAvailableClasses = async () => {
    try {
      // Using existing classApi or create a new one
      const response = await meetingApi.getAvailableClasses();
      return response || [];
    } catch (error) {
      console.error('Error fetching classes:', error);
      return [];
    }
  };

  const getAvailableStudents = async () => {
    try {
      const response = await meetingApi.getAvailableStudents();
      return response || [];
    } catch (error) {
      console.error('Error fetching students:', error);
      return [];
    }
  };

  const getAvailableTeachers = async () => {
    try {
      const response = await meetingApi.getAvailableTeachers();
      return response || [];
    } catch (error) {
      console.error('Error fetching teachers:', error);
      return [];
    }
  };

  const generateMeetingId = () => {
    const prefix = meetingTitle.substring(0, 3).toUpperCase() || 'MTG';
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const generatedId = `${prefix}-${new Date().getFullYear()}-${random}`;
    setMeetingId(generatedId);
    return generatedId;
  };

  const handleCreateMeeting = async (e) => {
    e.preventDefault();

    // Validation
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

    try {
      setLoading(prev => ({ ...prev, creating: true }));
      setError('');

      // Prepare meeting data for backend
      const meetingData = {
        title: meetingTitle,
        meetingId: meetingId || generateMeetingId(),
        meetingType: meetingWith,
        meetingWith: getMeetingWithLabel(),
        duration: duration,
        message: message,
        isScheduled: isScheduled,
        scheduledDate: isScheduled ? scheduledDate : null,
        scheduledTime: isScheduled ? scheduledTime : null,
        specificClass: meetingWith === 'specificClass' ? selectedRecipient : null,
        specificStudent: meetingWith === 'specificStudent' ? selectedRecipient : null,
        specificTeacher: meetingWith === 'specificTeacher' ? selectedRecipient : null
      };

      console.log('Creating meeting with data:', meetingData);

      // Call API to create meeting
      const newMeeting = await meetingApi.createMeeting(meetingData);
      
      // Add to local state
      setMeetings(prev => [newMeeting, ...prev]);
      setShowSuccess(true);

      // Reset form
      setTimeout(() => {
        setShowSuccess(false);
        resetForm();
      }, 2000);

    } catch (error) {
      console.error('Error creating meeting:', error);
      setError(`Failed to create meeting: ${error.message}`);
      alert(`Failed to create meeting: ${error.message}`);
    } finally {
      setLoading(prev => ({ ...prev, creating: false }));
    }
  };

  const handleDeleteMeeting = async (id) => {
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      try {
        setLoading(prev => ({ ...prev, meetings: true }));
        await meetingApi.deleteMeeting(id);
        
        // Remove from local state
        setMeetings(prev => prev.filter(meeting => meeting._id !== id));
        
        alert('Meeting deleted successfully!');
      } catch (error) {
        console.error('Error deleting meeting:', error);
        alert(`Failed to delete meeting: ${error.message}`);
      } finally {
        setLoading(prev => ({ ...prev, meetings: false }));
      }
    }
  };

  const handleJoinRoom = async (meeting) => {
    try {
      const result = await meetingApi.joinMeeting(meeting._id);
      
      // Show meeting details (in real app, you would redirect to meeting URL)
      alert(
        `Joining Meeting:\n\n` +
        `Title: ${meeting.title}\n` +
        `Meeting ID: ${meeting.meetingId}\n` +
        `Room: ${result.roomUrl || 'Not configured'}\n` +
        `Password: ${result.meetingPassword || 'No password'}\n\n` +
        `Note: This is a demo. In a real application, you would be redirected to the meeting room.`
      );
      
      // For demo purposes, we'll just log the join
      console.log('Joining meeting:', meeting.title, 'with details:', result);
      
    } catch (error) {
      console.error('Error joining meeting:', error);
      alert(`Failed to join meeting: ${error.message}`);
    }
  };

  const getMeetingWithLabel = () => {
    switch(meetingWith) {
      case 'allStudents':
        return 'All Students';
      case 'allTeachers':
        return 'All Teachers';
      case 'specificClass':
        const selectedClass = classes.find(c => c._id === selectedRecipient);
        return selectedClass ? `${selectedClass.name} - Section ${selectedClass.section}` : 'Select Class';
      case 'specificStudent':
        const selectedStudent = students.find(s => s._id === selectedRecipient);
        return selectedStudent ? `${selectedStudent.studentName} - ${selectedStudent.registrationNo}` : 'Select Student';
      case 'specificTeacher':
        const selectedTeacher = teachers.find(t => t._id === selectedRecipient);
        return selectedTeacher ? `${selectedTeacher.employeeName} - ${selectedTeacher.employeeRole}` : 'Select Teacher';
      default:
        return '';
    }
  };

  const resetForm = () => {
    setMeetingTitle('');
    setMeetingId('');
    setMeetingWith('');
    setSelectedRecipient('');
    setIsScheduled(false);
    setScheduledDate('');
    setScheduledTime('');
    setDuration(60);
    setMessage('');
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

  // Format meeting date for display
  const formatMeetingDate = (dateString) => {
    if (!dateString) return 'Not scheduled';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'live': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span className="text-blue-600 dark:text-blue-400 font-semibold">Live Class</span>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span className="text-gray-900 dark:text-gray-100 font-semibold">Meetings</span>
        </div>

        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Video className="w-6 h-6 text-white" />
              </div>
              <span>Live Class Management</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Create and manage virtual classroom meetings</p>
          </div>
          
          <button
            onClick={fetchData}
            disabled={loading.meetings}
            className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading.meetings ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side - Create Meeting Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
                  <Plus className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  <span>Create New Meeting</span>
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Set up a live class session</p>
              </div>

              <div className="p-6">
                <form onSubmit={handleCreateMeeting} className="space-y-6">
                  {/* Meeting Title */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Meeting Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={meetingTitle}
                      onChange={(e) => setMeetingTitle(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="e.g., Mathematics Class - Chapter 5"
                      required
                      disabled={loading.creating}
                    />
                  </div>

                  {/* Meeting ID */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Meeting ID <span className="text-gray-400 dark:text-gray-500 text-xs">(Optional - Auto-generated)</span>
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={meetingId}
                        onChange={(e) => setMeetingId(e.target.value)}
                        className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder="Leave empty for auto-generation"
                        disabled={loading.creating}
                      />
                      <button
                        type="button"
                        onClick={() => generateMeetingId()}
                        className="px-4 py-2.5 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-xl hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors font-semibold disabled:opacity-50"
                        disabled={loading.creating}
                      >
                        Generate
                      </button>
                    </div>
                  </div>

                  {/* Meeting With */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">
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
                        disabled={loading.creating}
                        className={`p-3 rounded-xl border-2 transition-all text-left disabled:opacity-50 ${
                          meetingWith === 'allStudents'
                            ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-gray-800'
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            meetingWith === 'allStudents'
                              ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                              : 'bg-gray-100 dark:bg-gray-700'
                          }`}>
                            <Users className={`w-5 h-5 ${meetingWith === 'allStudents' ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`} />
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">All Students</span>
                        </div>
                      </button>

                      {/* All Teachers */}
                      <button
                        type="button"
                        onClick={() => {
                          setMeetingWith('allTeachers');
                          setSelectedRecipient('');
                        }}
                        disabled={loading.creating}
                        className={`p-3 rounded-xl border-2 transition-all text-left disabled:opacity-50 ${
                          meetingWith === 'allTeachers'
                            ? 'border-green-500 dark:border-green-400 bg-green-50 dark:bg-gray-800'
                            : 'border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            meetingWith === 'allTeachers'
                              ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                              : 'bg-gray-100 dark:bg-gray-700'
                          }`}>
                            <GraduationCap className={`w-5 h-5 ${meetingWith === 'allTeachers' ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`} />
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">All Teachers</span>
                        </div>
                      </button>

                      {/* Specific Student */}
                      <button
                        type="button"
                        onClick={() => {
                          setMeetingWith('specificStudent');
                          setSelectedRecipient('');
                        }}
                        disabled={loading.creating}
                        className={`p-3 rounded-xl border-2 transition-all text-left disabled:opacity-50 ${
                          meetingWith === 'specificStudent'
                            ? 'border-orange-500 dark:border-orange-400 bg-orange-50 dark:bg-gray-800'
                            : 'border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            meetingWith === 'specificStudent'
                              ? 'bg-gradient-to-br from-orange-500 to-red-600'
                              : 'bg-gray-100 dark:bg-gray-700'
                          }`}>
                            <UserCheck className={`w-5 h-5 ${meetingWith === 'specificStudent' ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`} />
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Specific Student</span>
                        </div>
                      </button>

                      {/* Specific Class */}
                      <button
                        type="button"
                        onClick={() => {
                          setMeetingWith('specificClass');
                          setSelectedRecipient('');
                        }}
                        disabled={loading.creating}
                        className={`p-3 rounded-xl border-2 transition-all text-left disabled:opacity-50 ${
                          meetingWith === 'specificClass'
                            ? 'border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-gray-800'
                            : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            meetingWith === 'specificClass'
                              ? 'bg-gradient-to-br from-purple-500 to-pink-600'
                              : 'bg-gray-100 dark:bg-gray-700'
                          }`}>
                            <BookOpen className={`w-5 h-5 ${meetingWith === 'specificClass' ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`} />
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Specific Class</span>
                        </div>
                      </button>

                      {/* Specific Teacher */}
                      <button
                        type="button"
                        onClick={() => {
                          setMeetingWith('specificTeacher');
                          setSelectedRecipient('');
                        }}
                        disabled={loading.creating}
                        className={`p-3 rounded-xl border-2 transition-all text-left md:col-span-2 disabled:opacity-50 ${
                          meetingWith === 'specificTeacher'
                            ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-gray-800'
                            : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            meetingWith === 'specificTeacher'
                              ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
                              : 'bg-gray-100 dark:bg-gray-700'
                          }`}>
                            <GraduationCap className={`w-5 h-5 ${meetingWith === 'specificTeacher' ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`} />
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Specific Teacher</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Specific Selection Dropdown */}
                  {(meetingWith === 'specificClass' || meetingWith === 'specificStudent' || meetingWith === 'specificTeacher') && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Select {meetingWith === 'specificClass' ? 'Class' : meetingWith === 'specificStudent' ? 'Student' : 'Teacher'}
                      </label>
                      {loading.classes || loading.students || loading.teachers ? (
                        <div className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl flex items-center justify-center bg-white dark:bg-gray-700">
                          <Loader2 className="w-5 h-5 animate-spin text-gray-400 dark:text-gray-500" />
                          <span className="ml-2 text-gray-500 dark:text-gray-400">Loading...</span>
                        </div>
                      ) : (
                        <select
                          value={selectedRecipient}
                          onChange={(e) => setSelectedRecipient(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          required
                          disabled={loading.creating}
                        >
                          <option value="">Choose...</option>
                          {meetingWith === 'specificClass' && classes.map(cls => (
                            <option key={cls._id} value={cls._id}>
                              {cls.name} - Section {cls.section} ({cls.studentCount || 0} students)
                            </option>
                          ))}
                          {meetingWith === 'specificStudent' && students.map(student => (
                            <option key={student._id} value={student._id}>
                              {student.studentName} - {student.registrationNo} (Grade {student.selectClass})
                            </option>
                          ))}
                          {meetingWith === 'specificTeacher' && teachers.map(teacher => (
                            <option key={teacher._id} value={teacher._id}>
                              {teacher.employeeName} - {teacher.employeeRole} ({teacher.department || 'No Department'})
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  )}

                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Meeting Duration (minutes)
                    </label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value))}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      disabled={loading.creating}
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
                  <div className="flex items-start space-x-3 p-4 bg-purple-50 dark:bg-gray-800 rounded-xl border border-purple-200 dark:border-gray-700">
                    <input
                      type="checkbox"
                      id="schedule"
                      checked={isScheduled}
                      onChange={(e) => setIsScheduled(e.target.checked)}
                      className="w-5 h-5 text-purple-600 dark:text-purple-400 border-gray-300 dark:border-gray-600 rounded focus:ring-purple-500 dark:focus:ring-purple-400 mt-0.5"
                      disabled={loading.creating}
                    />
                    <label htmlFor="schedule" className="flex-1 cursor-pointer">
                      <span className="font-semibold text-gray-900 dark:text-gray-100 block">I want to schedule this meeting</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Set a specific date and time for the meeting</span>
                    </label>
                  </div>

                  {/* Schedule Date & Time */}
                  {isScheduled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          required
                          min={new Date().toISOString().split('T')[0]}
                          disabled={loading.creating}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Time <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="time"
                          value={scheduledTime}
                          onChange={(e) => setScheduledTime(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          required
                          disabled={loading.creating}
                        />
                      </div>
                    </div>
                  )}

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Write message here <span className="text-gray-400 dark:text-gray-500 text-xs">(Optional)</span>
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 min-h-[100px] resize-y"
                      placeholder="Add any notes or agenda for the meeting..."
                      disabled={loading.creating}
                    />
                  </div>

                  {/* Success Message */}
                  {showSuccess && (
                    <div className="bg-green-50 dark:bg-gray-800 border border-green-200 dark:border-gray-700 rounded-xl p-4 flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-green-900 dark:text-green-300">Meeting Created Successfully!</p>
                        <p className="text-sm text-green-700 dark:text-green-400">You can now join or manage your meeting.</p>
                      </div>
                    </div>
                  )}

                  {/* Create & Join Button */}
                  <button
                    type="submit"
                    disabled={loading.creating}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 dark:from-purple-700 dark:to-indigo-800 dark:hover:from-purple-600 dark:hover:to-indigo-700 text-white rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading.creating ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <Video className="w-6 h-6" />
                        <span>Create & Join</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Right Side - Time/Date & Meetings Table */}
          <div className="lg:col-span-1 space-y-6">
            {/* Current Time & Date */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Current Date & Time</h3>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="font-semibold">{currentDateTime.date}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="font-semibold">{currentDateTime.time}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Meetings Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
                      <Video className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      <span>All Meetings</span>
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {loading.meetings ? 'Loading...' : `${meetings.length} meeting(s)`}
                    </p>
                  </div>
                  {loading.meetings && (
                    <Loader2 className="w-5 h-5 animate-spin text-purple-600 dark:text-purple-400" />
                  )}
                </div>
              </div>

              <div className="max-h-[600px] overflow-y-auto">
                {loading.meetings ? (
                  <div className="p-8 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">Loading meetings...</p>
                  </div>
                ) : meetings.length > 0 ? (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {meetings.map((meeting) => (
                      <div key={meeting._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-bold text-gray-900 dark:text-gray-100">{meeting.title}</h4>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(meeting.status)}`}>
                                  {meeting.status}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-700 inline-block px-2 py-1 rounded">
                                {meeting.meetingId}
                              </p>
                            </div>
                            <button
                              onClick={() => handleDeleteMeeting(meeting._id)}
                              className="p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-600 rounded-lg transition-colors ml-2"
                              title="Delete meeting"
                              disabled={loading.meetings}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="space-y-1 text-sm">
                            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                              <Users className="w-4 h-4" />
                              <span>{meeting.meetingWith}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                              <Clock className="w-4 h-4" />
                              <span>{meeting.duration} minutes</span>
                            </div>
                            {meeting.isScheduled && meeting.scheduledDate && (
                              <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 font-semibold">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {formatMeetingDate(meeting.scheduledDate)} at {meeting.scheduledTime || 'TBA'}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                              <Users className="w-4 h-4" />
                              <span>{meeting.participantCount || 0} participants</span>
                            </div>
                          </div>

                          {meeting.message && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-2 rounded-lg line-clamp-2">
                              {meeting.message}
                            </p>
                          )}

                          <button
                            onClick={() => handleJoinRoom(meeting)}
                            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 dark:from-purple-700 dark:to-indigo-800 dark:hover:from-purple-600 dark:hover:to-indigo-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg font-semibold disabled:opacity-50"
                            disabled={meeting.status === 'completed' || meeting.status === 'cancelled'}
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>
                              {meeting.status === 'completed' ? 'Completed' : 
                               meeting.status === 'cancelled' ? 'Cancelled' : 'Join Room'}
                            </span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <AlertCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">No meetings created yet</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Create your first meeting to get started</p>
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