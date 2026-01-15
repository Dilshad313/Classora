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
  RefreshCw,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

// API Service Import
import meetingApi from '../../../../services/meetingApi';
import { classApi } from '../../../../services/classApi';

const LiveClass = () => {
  const navigate = useNavigate();

  // State for data
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [meetings, setMeetings] = useState([]);
  
  // State for form
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [meetingWith, setMeetingWith] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [duration, setDuration] = useState(60);
  const [message, setMessage] = useState('');
  
  // UI State for confirmation dialog
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    meetingId: null,
    meetingTitle: ''
  });
  
  // UI State
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState({
    meetings: false,
    classes: false,
    students: false,
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
        creating: false
      });
      setError('');

      // Fetch all data in parallel
      const [meetingsData, classesData, studentsData] = await Promise.all([
        meetingApi.getMeetings(),
        getAvailableClasses(),
        getAvailableStudents()
      ]);

      console.log('📊 Fetched data:', { 
        meetings: meetingsData?.data?.length || 0, 
        classes: classesData?.length || 0, 
        students: studentsData?.length || 0 
      });
      console.log('📚 Classes:', classesData);

      setMeetings(meetingsData?.data || []);
      setClasses(classesData || []);
      setStudents(studentsData || []);

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
        creating: false
      });
    }
  };

  // Helper functions to fetch available data
  const getAvailableClasses = async () => {
    try {
      // Use getAllClasses to get complete class objects with _id
      const response = await classApi.getAllClasses();
      // Return the classes array from the response
      return response?.data || [];
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast.error('Failed to load classes');
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

  const handleCreateMeeting = async (e) => {
    e.preventDefault();

    // Validation
    if (!meetingTitle.trim()) {
      toast.error('Please enter a meeting title');
      return;
    }

    if (!meetingLink.trim()) {
      toast.error('Please enter a meeting link');
      return;
    }

    // Validate Google Meet link
    if (!meetingLink.includes('meet.google.com')) {
      toast.error('Please enter a valid Google Meet link');
      return;
    }

    if (!meetingWith) {
      toast.error('Please select who to meet with');
      return;
    }

    if ((meetingWith === 'specificStudent' || meetingWith === 'specificClass') && !selectedRecipient) {
      toast.error('Please select a recipient');
      return;
    }

    if (isScheduled && (!scheduledDate || !scheduledTime)) {
      toast.error('Please select date and time for scheduled meeting');
      return;
    }

    try {
      setLoading(prev => ({ ...prev, creating: true }));
      setError('');

      // Prepare meeting data for backend
      const meetingData = {
        title: meetingTitle,
        meetingLink: meetingLink,
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

      // Add to local state - filter out existing if it was an update
      setMeetings(prev => {
        const filtered = prev.filter(m => m._id !== newMeeting._id);
        return [newMeeting, ...filtered];
      });
      // Show initial success message
      toast.success('Meeting created successfully!');

      // Automatically join the meeting after creation
      setTimeout(() => {
        handleJoinRoom(newMeeting);
        toast.success('Joining meeting room now...');
      }, 1000); // Small delay to allow UI to update

      // Reset form
      resetForm();

    } catch (error) {
      console.error('Error creating meeting:', error);
      setError(`Failed to create meeting: ${error.message}`);
      toast.error(`Failed to create meeting: ${error.message}`);
    } finally {
      setLoading(prev => ({ ...prev, creating: false }));
    }
  };

  const handleDeleteMeeting = async (id) => {
    try {
      setLoading(prev => ({ ...prev, meetings: true }));
      await meetingApi.deleteMeeting(id);
      
      // Remove from local state
      setMeetings(prev => prev.filter(meeting => meeting._id !== id));
      
      toast.success('Meeting deleted successfully!');
    } catch (error) {
      console.error('Error deleting meeting:', error);
      toast.error(`Failed to delete meeting: ${error.message}`);
    } finally {
      setLoading(prev => ({ ...prev, meetings: false }));
      setDeleteConfirm({ show: false, meetingId: null, meetingTitle: '' });
    }
  };

  const handleJoinRoom = async (meeting) => {
    try {
      // First, register the user as a participant by calling the backend
      if (meeting._id) {
        try {
          const joinResult = await meetingApi.joinMeeting(meeting._id);
          console.log('Joined meeting successfully:', joinResult);
        } catch (joinError) {
          console.warn('Could not register join event:', joinError.message);
          // Continue anyway, as the join isn't critical for opening the meeting
        }
      }

      // Then open the meeting link in a new tab
      if (meeting.meetingLink && meeting.meetingLink.includes('meet.google.com')) {
        window.open(meeting.meetingLink, '_blank', 'noopener,noreferrer');
        toast.success('Opening meeting room...');
      } else {
        toast.error('Invalid meeting link');
      }
    } catch (error) {
      console.error('Error joining meeting:', error);
      toast.error(`Failed to join meeting: ${error.message}`);
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
        if (selectedClass) {
          return `${selectedClass.className} ${selectedClass.section ? `- ${selectedClass.section}` : ''} ${selectedClass.subject ? `(${selectedClass.subject})` : ''}`.trim();
        }
        return 'Select Class';
      case 'specificStudent':
        const selectedStudent = students.find(s => s._id === selectedRecipient);
        return selectedStudent ? `${selectedStudent.studentName} - ${selectedStudent.registrationNo}` : 'Select Student';
      default:
        return '';
    }
  };

  const resetForm = () => {
    setMeetingTitle('');
    setMeetingLink('');
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
            onClick={() => navigate('/teacher')}
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

                  {/* Meeting Link */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Meeting Link <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      value={meetingLink}
                      onChange={(e) => setMeetingLink(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="https://meet.google.com/xxx-xxxx-xxx"
                      required
                      disabled={loading.creating}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Paste a Google Meet link</p>
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
                        className={`p-3 rounded-xl border-2 transition-all text-left md:col-span-2 disabled:opacity-50 ${
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
                    </div>
                  </div>

                  {/* Specific Selection Dropdown */}
                  {(meetingWith === 'specificClass' || meetingWith === 'specificStudent') && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Select {meetingWith === 'specificClass' ? 'Class' : 'Student'}
                      </label>
                      {loading.classes || loading.students ? (
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
                              {cls.className} {cls.section ? `- ${cls.section}` : ''} {cls.subject ? `(${cls.subject})` : ''}
                            </option>
                          ))}
                          {meetingWith === 'specificStudent' && students.map(student => (
                            <option key={student._id} value={student._id}>
                              {student.studentName} - {student.registrationNo} (Grade {student.selectClass})
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
                        <span>Creating & Joining...</span>
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
                              <p className="text-xs text-gray-500 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-700 inline-block px-2 py-1 rounded truncate max-w-[200px]">
                                {meeting.meetingLink}
                              </p>
                            </div>
                            <button
                              onClick={() => setDeleteConfirm({
                                show: true,
                                meetingId: meeting._id,
                                meetingTitle: meeting.title
                              })}
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
                               meeting.status === 'cancelled' ? 'Cancelled' :
                               meeting.status === 'scheduled' ? 'Join Scheduled' : 'Join Room'}
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

      {/* Delete Confirmation Dialog */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Delete Meeting</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">This action cannot be undone</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700 dark:text-gray-300">
                  Are you sure you want to delete the meeting:
                </p>
                <p className="font-semibold text-gray-900 dark:text-gray-100 mt-2">
                  "{deleteConfirm.meetingTitle}"
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setDeleteConfirm({ show: false, meetingId: null, meetingTitle: '' })}
                  className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-semibold"
                  disabled={loading.meetings}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteMeeting(deleteConfirm.meetingId)}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading.meetings}
                >
                  {loading.meetings ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Deleting...</span>
                    </div>
                  ) : (
                    'Delete Meeting'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveClass;
