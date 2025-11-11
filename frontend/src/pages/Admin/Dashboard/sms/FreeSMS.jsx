import React, { useState } from 'react';
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
  MessageCircleMore
} from 'lucide-react';

const FreeSMS = () => {
  const navigate = useNavigate();

  // Sample data
  const [classes] = useState([
    { id: 1, name: 'Grade 10 - A', students: 40 },
    { id: 2, name: 'Grade 10 - B', students: 38 },
    { id: 3, name: 'Grade 11 - A', students: 35 },
    { id: 4, name: 'Grade 11 - B', students: 37 }
  ]);

  const [students] = useState([
    { id: 1, name: 'Arun P', class: 'Grade 10 - A', phone: '+91 98765 43210' },
    { id: 2, name: 'Priya Sharma', class: 'Grade 10 - B', phone: '+91 98765 43211' },
    { id: 3, name: 'Rahul Kumar', class: 'Grade 11 - A', phone: '+91 98765 43212' },
    { id: 4, name: 'Sneha Patel', class: 'Grade 9 - A', phone: '+91 98765 43213' }
  ]);

  const [employees] = useState([
    { id: 1, name: 'Dr. Sharma', role: 'Mathematics Teacher', phone: '+91 98765 43220' },
    { id: 2, name: 'Prof. Kumar', role: 'Physics Teacher', phone: '+91 98765 43221' },
    { id: 3, name: 'Ms. Patel', role: 'Chemistry Teacher', phone: '+91 98765 43222' },
    { id: 4, name: 'Mr. Singh', role: 'English Teacher', phone: '+91 98765 43223' }
  ]);

  const [smsHistory] = useState([
    { id: 1, recipient: 'All Students', count: 152, message: 'School will remain closed tomorrow due to...', date: '2024-11-08', status: 'sent' },
    { id: 2, recipient: 'Grade 10 - A', count: 40, message: 'Parent-teacher meeting scheduled for...', date: '2024-11-07', status: 'sent' },
    { id: 3, recipient: 'Dr. Sharma', count: 1, message: 'Please submit the attendance report...', date: '2024-11-06', status: 'sent' }
  ]);

  const [recipientType, setRecipientType] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [smsMessage, setSmsMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const maxChars = 160;

  const handleMessageChange = (e) => {
    const text = e.target.value;
    if (text.length <= maxChars) {
      setSmsMessage(text);
      setCharCount(text.length);
    }
  };

  const handleSendSMS = (e) => {
    e.preventDefault();

    if (!recipientType) {
      alert('Please select a recipient type');
      return;
    }

    if ((recipientType === 'specificClass' || recipientType === 'specificStudent' || recipientType === 'specificEmployee') && !selectedRecipient) {
      alert('Please select a recipient');
      return;
    }

    if (!smsMessage.trim()) {
      alert('Please enter a message');
      return;
    }

    // Show success message
    setShowSuccess(true);

    // Reset form after 2 seconds
    setTimeout(() => {
      setShowSuccess(false);
      setRecipientType('');
      setSelectedRecipient('');
      setSmsMessage('');
      setCharCount(0);
    }, 2000);
  };

  const getRecipientCount = () => {
    switch(recipientType) {
      case 'allStudents':
        return students.length;
      case 'allEmployees':
        return employees.length;
      case 'specificClass':
        return classes.find(c => c.id === parseInt(selectedRecipient))?.students || 0;
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
        return classes.find(c => c.id === parseInt(selectedRecipient))?.name || 'Select Class';
      case 'specificStudent':
        return students.find(s => s.id === parseInt(selectedRecipient))?.name || 'Select Student';
      case 'specificEmployee':
        return employees.find(e => e.id === parseInt(selectedRecipient))?.name || 'Select Employee';
      default:
        return 'Select recipient type';
    }
  };

  const totalSMSSent = smsHistory.reduce((sum, sms) => sum + sms.count, 0);

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
          <span className="text-blue-600 font-semibold">SMS</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-semibold">Free SMS</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <span>Free SMS Service</span>
              </h1>
              <p className="text-gray-600 mt-2">Send SMS messages to students, employees, and parents</p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total SMS Sent</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{totalSMSSent}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
                <MessageCircleMore className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Students</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{students.length}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Employees</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{employees.length}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">SMS History</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{smsHistory.length}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center">
                <Phone className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SMS Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
                <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                  <Smartphone className="w-6 h-6 text-green-600" />
                  <span>Send SMS</span>
                </h2>
                <p className="text-sm text-gray-600 mt-1">Compose and send SMS to recipients</p>
              </div>

              <div className="p-6">
                <form onSubmit={handleSendSMS} className="space-y-6">
                  {/* Recipient Type Selection */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-4">
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
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            recipientType === 'allStudents'
                              ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                              : 'bg-gray-100'
                          }`}>
                            <Users className={`w-6 h-6 ${recipientType === 'allStudents' ? 'text-white' : 'text-gray-400'}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">All Students</h3>
                            <p className="text-xs text-gray-500">{students.length} recipients</p>
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
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            recipientType === 'allEmployees'
                              ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                              : 'bg-gray-100'
                          }`}>
                            <GraduationCap className={`w-6 h-6 ${recipientType === 'allEmployees' ? 'text-white' : 'text-gray-400'}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">All Employees</h3>
                            <p className="text-xs text-gray-500">{employees.length} recipients</p>
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
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            recipientType === 'specificClass'
                              ? 'bg-gradient-to-br from-purple-500 to-pink-600'
                              : 'bg-gray-100'
                          }`}>
                            <BookOpen className={`w-6 h-6 ${recipientType === 'specificClass' ? 'text-white' : 'text-gray-400'}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Specific Class</h3>
                            <p className="text-xs text-gray-500">Select a class</p>
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
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            recipientType === 'specificStudent'
                              ? 'bg-gradient-to-br from-orange-500 to-red-600'
                              : 'bg-gray-100'
                          }`}>
                            <UserCheck className={`w-6 h-6 ${recipientType === 'specificStudent' ? 'text-white' : 'text-gray-400'}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Specific Student</h3>
                            <p className="text-xs text-gray-500">Select a student</p>
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
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            recipientType === 'specificEmployee'
                              ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
                              : 'bg-gray-100'
                          }`}>
                            <GraduationCap className={`w-6 h-6 ${recipientType === 'specificEmployee' ? 'text-white' : 'text-gray-400'}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Specific Employee</h3>
                            <p className="text-xs text-gray-500">Select an employee</p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Recipient Selection Dropdown */}
                  {(recipientType === 'specificClass' || recipientType === 'specificStudent' || recipientType === 'specificEmployee') && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Select {recipientType === 'specificClass' ? 'Class' : recipientType === 'specificStudent' ? 'Student' : 'Employee'}
                      </label>
                      <select
                        value={selectedRecipient}
                        onChange={(e) => setSelectedRecipient(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required
                      >
                        <option value="">Choose...</option>
                        {recipientType === 'specificClass' && classes.map(cls => (
                          <option key={cls.id} value={cls.id}>{cls.name} ({cls.students} students)</option>
                        ))}
                        {recipientType === 'specificStudent' && students.map(student => (
                          <option key={student.id} value={student.id}>{student.name} - {student.class} ({student.phone})</option>
                        ))}
                        {recipientType === 'specificEmployee' && employees.map(employee => (
                          <option key={employee.id} value={employee.id}>{employee.name} - {employee.role} ({employee.phone})</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* SMS Message */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        SMS Message <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center space-x-2">
                        <Hash className="w-4 h-4 text-gray-400" />
                        <span className={`text-sm font-semibold ${charCount > maxChars * 0.9 ? 'text-red-600' : 'text-gray-600'}`}>
                          {charCount}/{maxChars}
                        </span>
                      </div>
                    </div>
                    <textarea
                      value={smsMessage}
                      onChange={handleMessageChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 min-h-[120px] resize-y"
                      placeholder="Type your SMS message here... (Max 160 characters)"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Keep your message concise and clear. Standard SMS length is 160 characters.
                    </p>
                  </div>

                  {/* Recipient Summary */}
                  {recipientType && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Phone className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-green-900">
                            Sending to: {getRecipientLabel()}
                          </p>
                          <p className="text-xs text-green-700 mt-1">
                            Total Recipients: {getRecipientCount()} • Message Length: {charCount} characters
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Success Message */}
                  {showSuccess && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-green-900">SMS Sent Successfully!</p>
                        <p className="text-sm text-green-700">Your message has been delivered to {getRecipientCount()} recipient(s).</p>
                      </div>
                    </div>
                  )}

                  {/* Send Button */}
                  <button
                    type="submit"
                    disabled={showSuccess}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-6 h-6" />
                    <span>Send SMS</span>
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* SMS History */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                  <MessageCircleMore className="w-6 h-6 text-blue-600" />
                  <span>Recent SMS</span>
                </h2>
                <p className="text-sm text-gray-600 mt-1">Last sent messages</p>
              </div>

              <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                {smsHistory.map((sms) => (
                  <div key={sms.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                          <Phone className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm">{sms.recipient}</h3>
                          <p className="text-xs text-gray-500">{sms.count} recipient(s)</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        sms.status === 'sent' 
                          ? 'bg-green-100 text-green-700 border border-green-200' 
                          : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                      }`}>
                        {sms.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{sms.message}</p>
                    <p className="text-xs text-gray-400">{new Date(sms.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}</p>
                  </div>
                ))}
              </div>

              {smsHistory.length === 0 && (
                <div className="p-8 text-center">
                  <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No SMS history</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeSMS;
