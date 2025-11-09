import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageCircle,
  Plus,
  Search,
  Send,
  Paperclip,
  Users,
  UserCheck,
  GraduationCap,
  BookOpen,
  Home,
  ChevronRight,
  MessageSquare,
  Sparkles,
  X,
  Check
} from 'lucide-react';

const Message = () => {
  const navigate = useNavigate();

  // Sample data
  const [classes] = useState([
    { id: 1, name: 'Grade 10 - A' },
    { id: 2, name: 'Grade 10 - B' },
    { id: 3, name: 'Grade 11 - A' },
    { id: 4, name: 'Grade 11 - B' }
  ]);

  const [students] = useState([
    { id: 1, name: 'Arun P', class: 'Grade 10 - A' },
    { id: 2, name: 'Priya Sharma', class: 'Grade 10 - B' },
    { id: 3, name: 'Rahul Kumar', class: 'Grade 11 - A' },
    { id: 4, name: 'Sneha Patel', class: 'Grade 9 - A' }
  ]);

  const [employees] = useState([
    { id: 1, name: 'Dr. Sharma', role: 'Mathematics Teacher' },
    { id: 2, name: 'Prof. Kumar', role: 'Physics Teacher' },
    { id: 3, name: 'Ms. Patel', role: 'Chemistry Teacher' },
    { id: 4, name: 'Mr. Singh', role: 'English Teacher' }
  ]);

  const [chats] = useState([
    { 
      id: 1, 
      name: 'Grade 10 - A', 
      lastMessage: 'Homework submitted successfully', 
      time: '2 min ago', 
      unread: 3, 
      type: 'group',
      messages: [
        { id: 1, sender: 'John Doe', text: 'Hello everyone!', time: '10:30 AM', isSent: false },
        { id: 2, sender: 'You', text: 'Hi! How can I help?', time: '10:32 AM', isSent: true },
        { id: 3, sender: 'Jane Smith', text: 'Homework submitted successfully', time: '10:35 AM', isSent: false }
      ]
    },
    { 
      id: 2, 
      name: 'Dr. Sharma', 
      lastMessage: 'Meeting scheduled for tomorrow', 
      time: '15 min ago', 
      unread: 0, 
      type: 'individual',
      messages: [
        { id: 1, sender: 'Dr. Sharma', text: 'Good morning!', time: '9:00 AM', isSent: false },
        { id: 2, sender: 'You', text: 'Good morning, Dr. Sharma!', time: '9:02 AM', isSent: true },
        { id: 3, sender: 'Dr. Sharma', text: 'Meeting scheduled for tomorrow', time: '9:05 AM', isSent: false }
      ]
    },
    { 
      id: 3, 
      name: 'All Students', 
      lastMessage: 'Holiday announcement', 
      time: '1 hour ago', 
      unread: 0, 
      type: 'broadcast',
      messages: [
        { id: 1, sender: 'You', text: 'Holiday announcement: School will be closed on Friday', time: '8:00 AM', isSent: true }
      ]
    }
  ]);

  const [selectedChat, setSelectedChat] = useState(null);
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [messageType, setMessageType] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [messageText, setMessageText] = useState('');
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChatClick = (chat) => {
    setSelectedChat(chat);
    setShowNewChat(false);
  };

  const handleNewChat = () => {
    setSelectedChat(null);
    setShowNewChat(true);
    setMessageType('');
    setSelectedRecipient('');
    setMessageText('');
    setAttachedFiles([]);
  };

  const handleSendNewMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    // In a real app, this would send the message to the backend
    alert(`Message sent: ${newMessage}`);
    setNewMessage('');
  };

  const handleFileAttach = (e) => {
    const files = Array.from(e.target.files);
    setAttachedFiles(prev => [...prev, ...files]);
  };

  const handleRemoveFile = (index) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    // Validation
    if (!messageType) {
      alert('Please select a recipient type');
      return;
    }
    
    if ((messageType === 'specificClass' || messageType === 'specificStudent' || messageType === 'specificEmployee') && !selectedRecipient) {
      alert('Please select a recipient');
      return;
    }

    if (!messageText.trim()) {
      alert('Please enter a message');
      return;
    }

    // Show success message
    setShowSuccess(true);
    
    // Reset form after 2 seconds
    setTimeout(() => {
      setShowSuccess(false);
      setShowNewChat(false);
      setMessageType('');
      setSelectedRecipient('');
      setMessageText('');
      setAttachedFiles([]);
    }, 2000);
  };

  const getRecipientLabel = () => {
    switch(messageType) {
      case 'allStudents':
        return 'All Students (Group Message)';
      case 'allEmployees':
        return 'All Employees (Group Message)';
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

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <div className="flex-shrink-0 p-6 pb-0">
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
            <span className="text-blue-600 font-semibold">Messaging</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-semibold">Messages</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden px-6 pb-6">
        <div className="max-w-7xl mx-auto h-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Left Sidebar - Chats List */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <MessageCircle className="w-6 h-6 text-blue-600" />
                <span>Chats</span>
              </h2>
            </div>

            {/* New Chat Button */}
            <div className="p-4 border-b border-gray-200">
              <button
                onClick={handleNewChat}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5" />
                <span className="font-semibold">New Chat</span>
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Chats List */}
            <div className="flex-1 overflow-y-auto">
              {filteredChats.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {filteredChats.map(chat => (
                    <button
                      key={chat.id}
                      onClick={() => handleChatClick(chat)}
                      className={`w-full p-4 hover:bg-gray-50 transition-colors text-left ${
                        selectedChat?.id === chat.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          chat.type === 'group' ? 'bg-gradient-to-br from-purple-500 to-pink-600' :
                          chat.type === 'broadcast' ? 'bg-gradient-to-br from-orange-500 to-red-600' :
                          'bg-gradient-to-br from-blue-500 to-indigo-600'
                        }`}>
                          {chat.type === 'group' ? (
                            <Users className="w-6 h-6 text-white" />
                          ) : chat.type === 'broadcast' ? (
                            <MessageSquare className="w-6 h-6 text-white" />
                          ) : (
                            <UserCheck className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-gray-900 truncate">{chat.name}</h3>
                            <span className="text-xs text-gray-500 ml-2">{chat.time}</span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                        </div>
                        {chat.unread > 0 && (
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-white">{chat.unread}</span>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No chats found</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden flex flex-col h-full">
            {selectedChat ? (
              /* Chat View */
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Chat Header */}
                <div className="flex-shrink-0 p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        selectedChat.type === 'group' ? 'bg-gradient-to-br from-purple-500 to-pink-600' :
                        selectedChat.type === 'broadcast' ? 'bg-gradient-to-br from-orange-500 to-red-600' :
                        'bg-gradient-to-br from-blue-500 to-indigo-600'
                      }`}>
                        {selectedChat.type === 'group' ? (
                          <Users className="w-6 h-6 text-white" />
                        ) : selectedChat.type === 'broadcast' ? (
                          <MessageSquare className="w-6 h-6 text-white" />
                        ) : (
                          <UserCheck className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{selectedChat.name}</h2>
                        <p className="text-sm text-gray-600">
                          {selectedChat.type === 'group' ? 'Group Chat' : 
                           selectedChat.type === 'broadcast' ? 'Broadcast' : 'Individual Chat'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedChat(null)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                  <div className="space-y-4">
                    {selectedChat.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isSent ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] ${message.isSent ? 'order-2' : 'order-1'}`}>
                          {!message.isSent && (
                            <p className="text-xs font-semibold text-gray-600 mb-1 ml-2">{message.sender}</p>
                          )}
                          <div className={`rounded-2xl px-4 py-3 ${
                            message.isSent 
                              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' 
                              : 'bg-white border border-gray-200 text-gray-900'
                          }`}>
                            <p className="text-sm leading-relaxed">{message.text}</p>
                            <p className={`text-xs mt-1 ${
                              message.isSent ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {message.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Message Input */}
                <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
                  <form onSubmit={handleSendNewMessage} className="flex items-end space-x-3">
                    <div className="flex-1">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        rows="2"
                      />
                    </div>
                    <button
                      type="button"
                      className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      <Send className="w-5 h-5" />
                      <span className="font-semibold">Send</span>
                    </button>
                  </form>
                </div>
              </div>
            ) : !showNewChat ? (
              /* Welcome Screen */
              <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
                <div className="text-center max-w-2xl">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                    <MessageCircle className="w-16 h-16 text-blue-600" />
                  </div>
                  
                  <h2 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center space-x-2">
                    <span>Stay Connected!</span>
                    <Sparkles className="w-8 h-8 text-yellow-500" />
                  </h2>
                  
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    Effortless communication at your fingertips! Classora's built-in chatting system lets school admins, teachers, students, and staff collaborate instantly.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                        <Users className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">Group Messages</h3>
                      <p className="text-sm text-gray-600">Send announcements to all students or staff</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                        <UserCheck className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">Individual Chat</h3>
                      <p className="text-sm text-gray-600">Direct messaging with specific users</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                      <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                        <BookOpen className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">Class Updates</h3>
                      <p className="text-sm text-gray-600">Share information with entire classes</p>
                    </div>
                  </div>

                  <button
                    onClick={handleNewChat}
                    className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold text-lg"
                  >
                    <Plus className="w-6 h-6" />
                    <span>Start New Chat</span>
                  </button>
                </div>
              </div>
            ) : (
              /* New Chat Form */
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex-shrink-0 p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                      <Send className="w-6 h-6 text-blue-600" />
                      <span>Start New Chat</span>
                    </h2>
                    <button
                      onClick={() => setShowNewChat(false)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-6">
                  <form onSubmit={handleSendMessage} className="space-y-6 pb-4">
                    {/* Send Message To Section */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-4 text-lg">
                        Send Message To:
                      </label>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* All Students */}
                        <button
                          type="button"
                          onClick={() => {
                            setMessageType('allStudents');
                            setSelectedRecipient('');
                          }}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            messageType === 'allStudents'
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              messageType === 'allStudents'
                                ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                                : 'bg-gray-100'
                            }`}>
                              <Users className={`w-6 h-6 ${messageType === 'allStudents' ? 'text-white' : 'text-gray-400'}`} />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">All Students</h3>
                              <p className="text-xs text-gray-500">Group message</p>
                            </div>
                          </div>
                        </button>

                        {/* All Employees */}
                        <button
                          type="button"
                          onClick={() => {
                            setMessageType('allEmployees');
                            setSelectedRecipient('');
                          }}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            messageType === 'allEmployees'
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              messageType === 'allEmployees'
                                ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                                : 'bg-gray-100'
                            }`}>
                              <GraduationCap className={`w-6 h-6 ${messageType === 'allEmployees' ? 'text-white' : 'text-gray-400'}`} />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">All Employees</h3>
                              <p className="text-xs text-gray-500">Group message</p>
                            </div>
                          </div>
                        </button>

                        {/* Specific Class */}
                        <button
                          type="button"
                          onClick={() => {
                            setMessageType('specificClass');
                            setSelectedRecipient('');
                          }}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            messageType === 'specificClass'
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              messageType === 'specificClass'
                                ? 'bg-gradient-to-br from-purple-500 to-pink-600'
                                : 'bg-gray-100'
                            }`}>
                              <BookOpen className={`w-6 h-6 ${messageType === 'specificClass' ? 'text-white' : 'text-gray-400'}`} />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">Specific Class</h3>
                              <p className="text-xs text-gray-500">Individual message</p>
                            </div>
                          </div>
                        </button>

                        {/* Specific Student */}
                        <button
                          type="button"
                          onClick={() => {
                            setMessageType('specificStudent');
                            setSelectedRecipient('');
                          }}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            messageType === 'specificStudent'
                              ? 'border-orange-500 bg-orange-50'
                              : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              messageType === 'specificStudent'
                                ? 'bg-gradient-to-br from-orange-500 to-red-600'
                                : 'bg-gray-100'
                            }`}>
                              <UserCheck className={`w-6 h-6 ${messageType === 'specificStudent' ? 'text-white' : 'text-gray-400'}`} />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">Specific Student</h3>
                              <p className="text-xs text-gray-500">Individual message</p>
                            </div>
                          </div>
                        </button>

                        {/* Specific Employee */}
                        <button
                          type="button"
                          onClick={() => {
                            setMessageType('specificEmployee');
                            setSelectedRecipient('');
                          }}
                          className={`p-4 rounded-xl border-2 transition-all text-left md:col-span-2 ${
                            messageType === 'specificEmployee'
                              ? 'border-indigo-500 bg-indigo-50'
                              : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              messageType === 'specificEmployee'
                                ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
                                : 'bg-gray-100'
                            }`}>
                              <GraduationCap className={`w-6 h-6 ${messageType === 'specificEmployee' ? 'text-white' : 'text-gray-400'}`} />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">Specific Employee</h3>
                              <p className="text-xs text-gray-500">Individual message</p>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Recipient Selection (for specific options) */}
                    {(messageType === 'specificClass' || messageType === 'specificStudent' || messageType === 'specificEmployee') && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Select {messageType === 'specificClass' ? 'Class' : messageType === 'specificStudent' ? 'Student' : 'Employee'}
                        </label>
                        <select
                          value={selectedRecipient}
                          onChange={(e) => setSelectedRecipient(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="">Choose...</option>
                          {messageType === 'specificClass' && classes.map(cls => (
                            <option key={cls.id} value={cls.id}>{cls.name}</option>
                          ))}
                          {messageType === 'specificStudent' && students.map(student => (
                            <option key={student.id} value={student.id}>{student.name} - {student.class}</option>
                          ))}
                          {messageType === 'specificEmployee' && employees.map(employee => (
                            <option key={employee.id} value={employee.id}>{employee.name} - {employee.role}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Message Input */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[150px] resize-y"
                        placeholder="Type your message here..."
                        required
                      />
                    </div>

                    {/* File Attachment */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Attachments (Optional)
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                        <input
                          type="file"
                          id="file-upload"
                          multiple
                          onChange={handleFileAttach}
                          className="hidden"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <Paperclip className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 font-medium">Click to attach files</p>
                          <p className="text-xs text-gray-500 mt-1">PDF, DOC, Images, etc.</p>
                        </label>
                      </div>

                      {/* Attached Files List */}
                      {attachedFiles.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {attachedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                              <div className="flex items-center space-x-2">
                                <Paperclip className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-700">{file.name}</span>
                                <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(2)} KB)</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveFile(index)}
                                className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Recipient Summary */}
                    {messageType && (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <p className="text-sm text-blue-900">
                          <span className="font-semibold">Sending to:</span> {getRecipientLabel()}
                        </p>
                        {(messageType === 'allStudents' || messageType === 'allEmployees') && (
                          <p className="text-xs text-blue-700 mt-1">
                            This will be sent as a group message to all recipients
                          </p>
                        )}
                      </div>
                    )}

                    {/* Success Message */}
                    {showSuccess && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-green-900">Message Sent Successfully!</p>
                          <p className="text-sm text-green-700">Your message has been delivered.</p>
                        </div>
                      </div>
                    )}

                    {/* Send Button */}
                    <button
                      type="submit"
                      disabled={showSuccess}
                      className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-6 h-6" />
                      <span>Send Message</span>
                    </button>
                  </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
