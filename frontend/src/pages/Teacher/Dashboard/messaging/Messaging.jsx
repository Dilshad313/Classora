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
  Check,
  User
} from 'lucide-react';

const Messaging = () => {
  const navigate = useNavigate();

  // Sample data adapted for teachers
  const [classes] = useState([
    { id: 1, name: 'Class 10-A' },
    { id: 2, name: 'Class 10-B' },
    { id: 3, name: 'Class 9-A' },
    { id: 4, name: 'Class 9-B' }
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

  const [chats] = useState([
    { 
      id: 1, 
      name: 'Class 10-A', 
      lastMessage: 'Homework submitted successfully', 
      time: '2 min ago', 
      unread: 3, 
      type: 'group',
      messages: [
        { id: 1, sender: 'Arun P', text: 'Sir, I have submitted my homework', time: '10:30 AM', isSent: false },
        { id: 2, sender: 'You', text: 'Great! Well done everyone', time: '10:32 AM', isSent: true },
        { id: 3, sender: 'Priya Sharma', text: 'Homework submitted successfully', time: '10:35 AM', isSent: false }
      ]
    },
    { 
      id: 2, 
      name: 'Mr. Arun Kumar (Parent)', 
      lastMessage: 'Thank you for the update', 
      time: '15 min ago', 
      unread: 0, 
      type: 'individual',
      messages: [
        { id: 1, sender: 'Mr. Arun Kumar', text: 'How is my child performing?', time: '9:00 AM', isSent: false },
        { id: 2, sender: 'You', text: 'Arun is doing excellent work!', time: '9:02 AM', isSent: true },
        { id: 3, sender: 'Mr. Arun Kumar', text: 'Thank you for the update', time: '9:05 AM', isSent: false }
      ]
    },
    { 
      id: 3, 
      name: 'All My Students', 
      lastMessage: 'Test announcement', 
      time: '1 hour ago', 
      unread: 0, 
      type: 'broadcast',
      messages: [
        { id: 1, sender: 'You', text: 'Test announcement: Math test on Friday', time: '8:00 AM', isSent: true }
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
    
    if ((messageType === 'specificClass' || messageType === 'specificStudent' || messageType === 'specificParent') && !selectedRecipient) {
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
        return 'All My Students (Group Message)';
      case 'allParents':
        return 'All Parents (Group Message)';
      case 'specificClass':
        return classes.find(c => c.id === parseInt(selectedRecipient))?.name || 'Select Class';
      case 'specificStudent':
        return students.find(s => s.id === parseInt(selectedRecipient))?.name || 'Select Student';
      case 'specificParent':
        return parents.find(p => p.id === parseInt(selectedRecipient))?.name || 'Select Parent';
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
              onClick={() => navigate('/teacher')}
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
                          {selectedChat.type === 'group' ? 'Class Group' : 
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
                    Connect with your students and parents instantly! Send announcements, share updates, and maintain effective communication.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                        <Users className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">Class Groups</h3>
                      <p className="text-sm text-gray-600">Communicate with entire classes</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                        <User className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">Parent Chat</h3>
                      <p className="text-sm text-gray-600">Direct messaging with parents</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                      <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                        <BookOpen className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">Student Updates</h3>
                      <p className="text-sm text-gray-600">Share progress and announcements</p>
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
              /* New Chat Form - Simplified for teachers */
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center max-w-md">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send className="w-12 h-12 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">New Chat Coming Soon!</h3>
                  <p className="text-gray-600 mb-6">
                    The new chat feature is under development. For now, you can view and respond to existing conversations.
                  </p>
                  <button
                    onClick={() => setShowNewChat(false)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
                  >
                    Back to Chats
                  </button>
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

export default Messaging;
