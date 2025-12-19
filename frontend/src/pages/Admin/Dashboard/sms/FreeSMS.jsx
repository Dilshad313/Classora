import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare,
  Send,
  Users,
  UserCheck,
  GraduationCap,
  BookOpen,
  Home,
  ChevronRight,
  Phone,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Hash,
  MessageCircleMore,
  Loader2
} from 'lucide-react';
import { smsApi } from '../../../../services/smsApi';

const FreeSMS = () => {
  const navigate = useNavigate();

  // State variables
  const [stats, setStats] = useState({
    totalSMS: 0,
    totalRecipients: 0,
    totalStudents: 0,
    totalEmployees: 0,
    sentCount: 0,
    recentHistory: []
  });
  
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [smsHistory, setSmsHistory] = useState([]);
  
  const [loading, setLoading] = useState({
    stats: true,
    classes: false,
    students: false,
    employees: false,
    sending: false
  });
  
  const [recipientType, setRecipientType] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [smsMessage, setSmsMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [error, setError] = useState('');
  const maxChars = 160;

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(prev => ({ ...prev, stats: true }));
      
      // Load stats and recent history
      const statsData = await smsApi.getSMSStats();
      setStats(statsData);
      setSmsHistory(statsData.recentHistory || []);
      
      // Load classes
      const classesData = await smsApi.getClassesForSMS();
      setClasses(classesData);
      
      // Load students
      const studentsData = await smsApi.getStudentsForSMS();
      setStudents(studentsData);
      
      // Load employees
      const employeesData = await smsApi.getEmployeesForSMS();
      setEmployees(employeesData);
      
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load SMS data. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, stats: false }));
    }
  };

  const handleMessageChange = (e) => {
    const text = e.target.value;
    if (text.length <= maxChars) {
      setSmsMessage(text);
      setCharCount(text.length);
    }
  };

  const handleSendSMS = async (e) => {
    e.preventDefault();
    setError('');

    if (!recipientType) {
      setError('Please select a recipient type');
      return;
    }

    if ((recipientType === 'specificClass' || recipientType === 'specificStudent' || recipientType === 'specificEmployee') && !selectedRecipient) {
      setError('Please select a recipient');
      return;
    }

    if (!smsMessage.trim()) {
      setError('Please enter a message');
      return;
    }

    setLoading(prev => ({ ...prev, sending: true }));

    try {
      const smsData = {
        recipientType,
        recipientId: selectedRecipient || undefined,
        message: smsMessage.trim()
      };

      const result = await smsApi.sendSMS(smsData);
      
      // Show success message
      setShowSuccess(true);
      
      // Refresh stats
      const updatedStats = await smsApi.getSMSStats();
      setStats(updatedStats);
      setSmsHistory(updatedStats.recentHistory || []);

      // Reset form after 2 seconds
      setTimeout(() => {
        setShowSuccess(false);
        setRecipientType('');
        setSelectedRecipient('');
        setSmsMessage('');
        setCharCount(0);
        setError('');
      }, 2000);

    } catch (err) {
      console.error('Error sending SMS:', err);
      setError(err.message || 'Failed to send SMS. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, sending: false }));
    }
  };

  const getRecipientCount = () => {
    switch(recipientType) {
      case 'allStudents':
        return stats.totalStudents || 0;
      case 'allEmployees':
        return stats.totalEmployees || 0;
      case 'specificClass':
        return classes.find(c => c.id === selectedRecipient)?.studentCount || 0;
      case 'specificStudent':
      case 'specificEmployee':
        return 1;
      default:
        return 0;
    }
  };

  const getRecipientLabel = () => {
    switch(recipientType) {
      case 'allStudents':
        return 'All Students';
      case 'allEmployees':
        return 'All Employees';
      case 'specificClass':
        return classes.find(c => c.id === selectedRecipient)?.name || 'Select Class';
      case 'specificStudent':
        return students.find(s => s.id === selectedRecipient)?.name || 'Select Student';
      case 'specificEmployee':
        return employees.find(e => e.id === selectedRecipient)?.name || 'Select Employee';
      default:
        return 'Select recipient type';
    }
  };

  const totalSMSSent = stats.totalSMS || 0;

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
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600" />
          <span className="text-blue-600 dark:text-blue-400 font-semibold">SMS</span>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600" />
          <span className="text-gray-900 dark:text-white font-semibold">Free SMS</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <span>Free SMS Service</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Send SMS messages to students, employees, and parents</p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Statistics */}
        {loading.stats ? (
          <div className="mb-8 flex justify-center items-center h-32">
            <Loader2 className="w-8 h-8 animate-spin text-green-600 dark:text-green-400" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Total SMS Sent</p>
                  <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{totalSMSSent}</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 rounded-2xl flex items-center justify-center">
                  <MessageCircleMore className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Total Recipients</p>
                  <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalRecipients}</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 rounded-2xl flex items-center justify-center">
                  <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Students</p>
                  <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalStudents}</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 rounded-2xl flex items-center justify-center">
                  <GraduationCap className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Employees</p>
                  <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalEmployees}</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/40 dark:to-orange-800/40 rounded-2xl flex items-center justify-center">
                  <Phone className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SMS Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                  <Smartphone className="w-6 h-6 text-green-600 dark:text-green-400" />
                  <span>Send SMS</span>
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Compose and send SMS to recipients</p>
              </div>

              <div className="p-6">
                <form onSubmit={handleSendSMS} className="space-y-6">
                  {/* Recipient Type Selection */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-4">
                      Select Recipient Type:
                    </label>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* All Students */}
                      <button
                        type="button"
                        onClick={() => {
                          setRecipientType('allStudents');
                          setSelectedRecipient('');
                        }}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          recipientType === 'allStudents'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400'
                            : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            recipientType === 'allStudents'
                              ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                              : 'bg-gray-100 dark:bg-gray-700'
                          }`}>
                            <Users className={`w-6 h-6 ${recipientType === 'allStudents' ? 'text-white' : 'text-gray-400 dark:text-gray-400'}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">All Students</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{stats.totalStudents || 0} recipients</p>
                          </div>
                        </div>
                      </button>

                      {/* All Employees */}
                      <button
                        type="button"
                        onClick={() => {
                          setRecipientType('allEmployees');
                          setSelectedRecipient('');
                        }}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          recipientType === 'allEmployees'
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/30 dark:border-green-400'
                            : 'border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            recipientType === 'allEmployees'
                              ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                              : 'bg-gray-100 dark:bg-gray-700'
                          }`}>
                            <GraduationCap className={`w-6 h-6 ${recipientType === 'allEmployees' ? 'text-white' : 'text-gray-400 dark:text-gray-400'}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">All Employees</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{stats.totalEmployees || 0} recipients</p>
                          </div>
                        </div>
                      </button>

                      {/* Specific Class */}
                      <button
                        type="button"
                        onClick={() => {
                          setRecipientType('specificClass');
                          setSelectedRecipient('');
                        }}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          recipientType === 'specificClass'
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 dark:border-purple-400'
                            : 'border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            recipientType === 'specificClass'
                              ? 'bg-gradient-to-br from-purple-500 to-pink-600'
                              : 'bg-gray-100 dark:bg-gray-700'
                          }`}>
                            <BookOpen className={`w-6 h-6 ${recipientType === 'specificClass' ? 'text-white' : 'text-gray-400 dark:text-gray-400'}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">Specific Class</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Select a class</p>
                          </div>
                        </div>
                      </button>

                      {/* Specific Student */}
                      <button
                        type="button"
                        onClick={() => {
                          setRecipientType('specificStudent');
                          setSelectedRecipient('');
                        }}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          recipientType === 'specificStudent'
                            ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/30 dark:border-orange-400'
                            : 'border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            recipientType === 'specificStudent'
                              ? 'bg-gradient-to-br from-orange-500 to-red-600'
                              : 'bg-gray-100 dark:bg-gray-700'
                          }`}>
                            <UserCheck className={`w-6 h-6 ${recipientType === 'specificStudent' ? 'text-white' : 'text-gray-400 dark:text-gray-400'}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">Specific Student</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Select a student</p>
                          </div>
                        </div>
                      </button>

                      {/* Specific Employee */}
                      <button
                        type="button"
                        onClick={() => {
                          setRecipientType('specificEmployee');
                          setSelectedRecipient('');
                        }}
                        className={`p-4 rounded-xl border-2 transition-all text-left md:col-span-2 ${
                          recipientType === 'specificEmployee'
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 dark:border-indigo-400'
                            : 'border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            recipientType === 'specificEmployee'
                              ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
                              : 'bg-gray-100 dark:bg-gray-700'
                          }`}>
                            <GraduationCap className={`w-6 h-6 ${recipientType === 'specificEmployee' ? 'text-white' : 'text-gray-400 dark:text-gray-400'}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">Specific Employee</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Select an employee</p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Recipient Selection Dropdown */}
                  {(recipientType === 'specificClass' || recipientType === 'specificStudent' || recipientType === 'specificEmployee') && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Select {recipientType === 'specificClass' ? 'Class' : recipientType === 'specificStudent' ? 'Student' : 'Employee'}
                      </label>
                      <select
                        value={selectedRecipient}
                        onChange={(e) => setSelectedRecipient(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      >
                        <option value="">Choose...</option>
                        {recipientType === 'specificClass' && classes.map(cls => (
                          <option key={cls.id} value={cls.id} className="bg-white dark:bg-gray-700">
                            {cls.name} ({cls.studentCount} students)
                          </option>
                        ))}
                        {recipientType === 'specificStudent' && students.map(student => (
                          <option key={student.id} value={student.id} className="bg-white dark:bg-gray-700">
                            {student.name} - {student.class} {student.phone && `(${student.phone})`}
                          </option>
                        ))}
                        {recipientType === 'specificEmployee' && employees.map(employee => (
                          <option key={employee.id} value={employee.id} className="bg-white dark:bg-gray-700">
                            {employee.name} - {employee.role} {employee.phone && `(${employee.phone})`}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* SMS Message */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        SMS Message <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center space-x-2">
                        <Hash className="w-4 h-4 text-gray-400" />
                        <span className={`text-sm font-semibold ${charCount > maxChars * 0.9 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
                          {charCount}/{maxChars}
                        </span>
                      </div>
                    </div>
                    <textarea
                      value={smsMessage}
                      onChange={handleMessageChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400 min-h-[120px] resize-y bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="Type your SMS message here... (Max 160 characters)"
                      required
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Keep your message concise and clear. Standard SMS length is 160 characters.
                    </p>
                  </div>

                  {/* Recipient Summary */}
                  {recipientType && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Phone className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-green-900 dark:text-green-200">
                            Sending to: {getRecipientLabel()}
                          </p>
                          <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                            Total Recipients: {getRecipientCount()} • Message Length: {charCount} characters
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Success Message */}
                  {showSuccess && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-green-900 dark:text-green-200">SMS Sent Successfully!</p>
                        <p className="text-sm text-green-700 dark:text-green-300">Your message has been delivered to {getRecipientCount()} recipient(s).</p>
                      </div>
                    </div>
                  )}

                  {/* Send Button */}
                  <button
                    type="submit"
                    disabled={loading.sending || showSuccess}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed dark:from-green-700 dark:to-emerald-800 dark:hover:from-green-800 dark:hover:to-emerald-900"
                  >
                    {loading.sending ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-6 h-6" />
                        <span>Send SMS</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* SMS History */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                  <MessageCircleMore className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <span>Recent SMS</span>
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Last sent messages</p>
              </div>

              <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[600px] overflow-y-auto">
                {smsHistory.length > 0 ? (
                  smsHistory.map((sms) => (
                    <div key={sms._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                            <Phone className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{sms.recipientName}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{sms.recipientCount} recipient(s)</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          sms.status === 'sent' 
                            ? 'bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800' 
                            : 'bg-yellow-100 text-yellow-700 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800'
                        }`}>
                          {sms.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">{sms.message}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {new Date(sms.sentAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <AlertCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">No SMS history</p>
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

export default FreeSMS;