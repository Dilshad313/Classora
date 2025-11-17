import { useState, useEffect } from 'react';
import { 
  MessageSquare, Send, Search, Plus, Phone, Video, 
  MoreVertical, Paperclip, Smile, User, Users, Clock
} from 'lucide-react';

const Messaging = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    setLoading(false);
  }, []);

  // Mock conversations data
  const conversations = [
    {
      id: 1,
      name: 'Mr. Johnson',
      role: 'Mathematics Teacher',
      avatar: 'MJ',
      lastMessage: 'Your assignment submission was excellent!',
      timestamp: '2024-11-17T10:30:00',
      unread: 2,
      online: true,
      messages: [
        {
          id: 1,
          sender: 'teacher',
          content: 'Hello! I wanted to discuss your recent test performance.',
          timestamp: '2024-11-17T09:00:00'
        },
        {
          id: 2,
          sender: 'student',
          content: 'Good morning, sir. Thank you for reaching out.',
          timestamp: '2024-11-17T09:05:00'
        },
        {
          id: 3,
          sender: 'teacher',
          content: 'Your assignment submission was excellent! Keep up the good work.',
          timestamp: '2024-11-17T10:30:00'
        }
      ]
    },
    {
      id: 2,
      name: 'Dr. Smith',
      role: 'Physics Teacher',
      avatar: 'DS',
      lastMessage: 'Lab report deadline is tomorrow',
      timestamp: '2024-11-17T08:15:00',
      unread: 0,
      online: false,
      messages: [
        {
          id: 1,
          sender: 'teacher',
          content: 'Reminder: Lab report deadline is tomorrow. Please submit on time.',
          timestamp: '2024-11-17T08:15:00'
        }
      ]
    },
    {
      id: 3,
      name: 'Class 10-A Group',
      role: 'Class Group',
      avatar: '10A',
      lastMessage: 'Sarah: Anyone has notes for chemistry?',
      timestamp: '2024-11-16T16:45:00',
      unread: 5,
      online: true,
      isGroup: true,
      messages: [
        {
          id: 1,
          sender: 'John',
          content: 'Hey everyone! Did you complete the math homework?',
          timestamp: '2024-11-16T15:30:00'
        },
        {
          id: 2,
          sender: 'student',
          content: 'Yes, it was quite challenging but manageable.',
          timestamp: '2024-11-16T15:35:00'
        },
        {
          id: 3,
          sender: 'Sarah',
          content: 'Anyone has notes for chemistry?',
          timestamp: '2024-11-16T16:45:00'
        }
      ]
    },
    {
      id: 4,
      name: 'Ms. Davis',
      role: 'English Teacher',
      avatar: 'MD',
      lastMessage: 'Great essay! Well structured.',
      timestamp: '2024-11-16T14:20:00',
      unread: 0,
      online: true,
      messages: [
        {
          id: 1,
          sender: 'teacher',
          content: 'I reviewed your essay on environmental conservation.',
          timestamp: '2024-11-16T14:15:00'
        },
        {
          id: 2,
          sender: 'teacher',
          content: 'Great essay! Well structured and thoughtful arguments.',
          timestamp: '2024-11-16T14:20:00'
        }
      ]
    }
  ];

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  const sendMessage = () => {
    if (message.trim() && selectedChat) {
      const newMessage = {
        id: selectedChat.messages.length + 1,
        sender: 'student',
        content: message.trim(),
        timestamp: new Date().toISOString()
      };
      
      // Update the selected chat's messages
      const updatedConversations = conversations.map(conv => {
        if (conv.id === selectedChat.id) {
          return {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastMessage: message.trim(),
            timestamp: new Date().toISOString()
          };
        }
        return conv;
      });
      
      setSelectedChat({
        ...selectedChat,
        messages: [...selectedChat.messages, newMessage]
      });
      
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
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
            <MessageSquare className="w-7 h-7 text-blue-600" />
            Messages
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Communicate with teachers and classmates
          </p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Message
        </button>
      </div>

      {/* Messaging Interface */}
      <div className="card p-0 h-[600px] flex">
        {/* Conversations List */}
        <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map(conversation => (
              <div
                key={conversation.id}
                onClick={() => setSelectedChat(conversation)}
                className={`p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                  selectedChat?.id === conversation.id ? 'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-r-blue-500' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
                      conversation.isGroup ? 'bg-purple-500' : 'bg-blue-500'
                    }`}>
                      {conversation.avatar}
                    </div>
                    {conversation.online && !conversation.isGroup && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100 truncate">
                        {conversation.name}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTime(conversation.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {conversation.role}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-500 dark:text-gray-500 truncate">
                        {conversation.lastMessage}
                      </p>
                      {conversation.unread > 0 && (
                        <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[1.25rem] text-center">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                      selectedChat.isGroup ? 'bg-purple-500' : 'bg-blue-500'
                    }`}>
                      {selectedChat.avatar}
                    </div>
                    {selectedChat.online && !selectedChat.isGroup && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                      {selectedChat.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedChat.isGroup ? `${selectedChat.role}` : selectedChat.online ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!selectedChat.isGroup && (
                    <>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        <Video className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </button>
                    </>
                  )}
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedChat.messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'student' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.sender === 'student'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100'
                    }`}>
                      {selectedChat.isGroup && msg.sender !== 'student' && (
                        <p className="text-xs font-semibold mb-1 opacity-75">{msg.sender}</p>
                      )}
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs mt-1 ${
                        msg.sender === 'student' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="w-full px-4 py-2 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                      <Smile className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                  <button
                    onClick={sendMessage}
                    disabled={!message.trim()}
                    className="p-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* No Chat Selected */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-500 dark:text-gray-500">
                  Choose a conversation from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Conversations</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{conversations.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Teachers</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {conversations.filter(c => !c.isGroup).length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Group Chats</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {conversations.filter(c => c.isGroup).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messaging;
