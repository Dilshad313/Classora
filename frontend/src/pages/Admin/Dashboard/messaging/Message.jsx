import React, { useState, useEffect, useRef } from 'react';
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
  Loader2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { messageApi } from '../../../../services/messageApi';

const Message = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // State
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [messageType, setMessageType] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [messageText, setMessageText] = useState('');
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  
  // New state for API data
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  
  // Loading states
  const [loading, setLoading] = useState({
    chats: false,
    chatDetails: false,
    recipients: false,
    sending: false
  });
  
  // Error states
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
    hasMore: false
  });

  // Fetch chats on component mount and when search term changes
  useEffect(() => {
    fetchChats();
  }, [searchTerm]);

  // Fetch recipients when message type changes
  useEffect(() => {
    if (messageType) {
      fetchRecipients();
    }
  }, [messageType]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch all chats
  const fetchChats = async () => {
    try {
      setLoading(prev => ({ ...prev, chats: true }));
      setError('');
      
      const filters = {};
      if (searchTerm) filters.search = searchTerm;
      
      const data = await messageApi.getChats(filters);
      setChats(data || []);
    } catch (err) {
      setError(`Failed to load chats: ${err.message}`);
      console.error('Error fetching chats:', err);
    } finally {
      setLoading(prev => ({ ...prev, chats: false }));
    }
  };

  // Fetch recipients based on message type
  const fetchRecipients = async () => {
    try {
      setLoading(prev => ({ ...prev, recipients: true }));
      setError('');
      
      let recipientType = '';
      if (messageType === 'specificClass') recipientType = 'specificClass';
      else if (messageType === 'specificStudent') recipientType = 'allStudents';
      else if (messageType === 'specificEmployee') recipientType = 'allEmployees';
      
      if (!recipientType) return;
      
      const data = await messageApi.getRecipients({ 
        type: recipientType,
        search: searchTerm 
      });
      
      if (messageType === 'specificClass') {
        setClasses(data?.classes || []);
      } else if (messageType === 'specificStudent') {
        setStudents(data?.students || []);
      } else if (messageType === 'specificEmployee') {
        setEmployees(data?.employees || []);
      }
    } catch (err) {
      setError(`Failed to load recipients: ${err.message}`);
      console.error('Error fetching recipients:', err);
    } finally {
      setLoading(prev => ({ ...prev, recipients: false }));
    }
  };

  // Fetch chat details and messages
  const fetchChatDetails = async (chatId) => {
    try {
      setLoading(prev => ({ ...prev, chatDetails: true }));
      setError('');
      
      const data = await messageApi.getChatById(chatId, {
        page: pagination.page,
        limit: pagination.limit
      });
      
      if (data?.chat) {
        setSelectedChat(data.chat);
        setChatMessages(data.messages || []);
        
        // Update pagination
        if (data.pagination) {
          setPagination({
            page: data.pagination.page,
            limit: data.pagination.limit,
            total: data.pagination.total,
            totalPages: data.pagination.totalPages,
            hasMore: data.pagination.page < data.pagination.totalPages
          });
        }
        
        // Mark chat as read
        await messageApi.markChatAsRead(chatId);
      }
    } catch (err) {
      setError(`Failed to load chat: ${err.message}`);
      console.error('Error fetching chat details:', err);
    } finally {
      setLoading(prev => ({ ...prev, chatDetails: false }));
    }
  };

  // Handle chat click
  const handleChatClick = async (chat) => {
    setSelectedChat(chat);
    setShowNewChat(false);
    await fetchChatDetails(chat._id);
  };

  // Handle new chat button
  const handleNewChat = () => {
    setSelectedChat(null);
    setShowNewChat(true);
    setMessageType('');
    setSelectedRecipient('');
    setMessageText('');
    setAttachedFiles([]);
    setClasses([]);
    setStudents([]);
    setEmployees([]);
    setError('');
  };

  // Send new message in existing chat
  const handleSendNewMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;
    
    try {
      setLoading(prev => ({ ...prev, sending: true }));
      
      const messageData = {
        text: newMessage,
        chatId: selectedChat._id,
        type: selectedChat.type,
        targetType: selectedChat.targetType || ''
      };
      
      const data = await messageApi.sendMessage(messageData, attachedFiles);
      
      if (data?.message) {
        // Add new message to local state
        setChatMessages(prev => [...prev, {
          ...data.message,
          senderName: data.message.senderName || 'You',
          isSent: true,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        
        // Update chat list
        setChats(prev => prev.map(chat => 
          chat._id === selectedChat._id 
            ? { ...chat, lastMessage: data.message.text, lastActivity: new Date() }
            : chat
        ));
        
        setNewMessage('');
        setAttachedFiles([]);
        
        setSuccessMessage('Message sent successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      setError(`Failed to send message: ${err.message}`);
      console.error('Error sending message:', err);
    } finally {
      setLoading(prev => ({ ...prev, sending: false }));
    }
  };

  // Send new message to recipients
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!messageType) {
      setError('Please select a recipient type');
      return;
    }
    
    if ((messageType === 'specificClass' || messageType === 'specificStudent' || messageType === 'specificEmployee') && !selectedRecipient) {
      setError('Please select a recipient');
      return;
    }

    if (!messageText.trim()) {
      setError('Please enter a message');
      return;
    }

    try {
      setLoading(prev => ({ ...prev, sending: true }));
      setError('');
      
      // Prepare message data based on type
      let messageData = {
        text: messageText.trim(),
        type: messageType === 'allStudents' || messageType === 'allEmployees' ? 'broadcast' : 
              messageType === 'specificClass' ? 'group' : 'individual'
      };
      
      // Add recipient info based on type
      if (messageType === 'allStudents') {
        messageData.targetType = 'allStudents';
      } else if (messageType === 'allEmployees') {
        messageData.targetType = 'allEmployees';
      } else if (messageType === 'specificClass') {
        const selectedClass = classes.find(c => c._id === selectedRecipient);
        messageData.className = selectedClass?.className || '';
        messageData.recipientId = selectedRecipient;
      } else if (messageType === 'specificStudent') {
        messageData.recipientId = selectedRecipient;
        messageData.recipientModel = 'Student';
      } else if (messageType === 'specificEmployee') {
        messageData.recipientId = selectedRecipient;
        messageData.recipientModel = 'Employee';
      }
      
      const data = await messageApi.sendMessage(messageData, attachedFiles);
      
      if (data?.message) {
        // Show success message
        setShowSuccess(true);
        setSuccessMessage(`Message sent to ${getRecipientLabel()}!`);
        
        // Refresh chats list
        fetchChats();
        
        // Reset form after 3 seconds
        setTimeout(() => {
          setShowSuccess(false);
          setShowNewChat(false);
          setMessageType('');
          setSelectedRecipient('');
          setMessageText('');
          setAttachedFiles([]);
          setClasses([]);
          setStudents([]);
          setEmployees([]);
          setSuccessMessage('');
        }, 3000);
      }
    } catch (err) {
      setError(`Failed to send message: ${err.message}`);
      console.error('Error sending new message:', err);
    } finally {
      setLoading(prev => ({ ...prev, sending: false }));
    }
  };

  // Handle file attachment
  const handleFileAttach = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf', 'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain', 'application/zip', 'application/x-rar-compressed'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        setError(`File type ${file.type} is not allowed`);
        return false;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return false;
      }
      
      return true;
    });
    
    setAttachedFiles(prev => [...prev, ...validFiles]);
  };

  const handleRemoveFile = (index) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Load more messages
  const loadMoreMessages = async () => {
    if (!selectedChat || !pagination.hasMore || loading.chatDetails) return;
    
    try {
      setLoading(prev => ({ ...prev, chatDetails: true }));
      
      const nextPage = pagination.page + 1;
      const data = await messageApi.getChatById(selectedChat._id, {
        page: nextPage,
        limit: pagination.limit
      });
      
      if (data?.messages) {
        // Add older messages to the beginning
        setChatMessages(prev => [...data.messages, ...prev]);
        
        // Update pagination
        setPagination({
          page: nextPage,
          limit: pagination.limit,
          total: data.pagination.total,
          totalPages: data.pagination.totalPages,
          hasMore: nextPage < data.pagination.totalPages
        });
      }
    } catch (err) {
      setError(`Failed to load more messages: ${err.message}`);
      console.error('Error loading more messages:', err);
    } finally {
      setLoading(prev => ({ ...prev, chatDetails: false }));
    }
  };

  // Delete chat
  const handleDeleteChat = async (chatId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this chat?')) {
      try {
        await messageApi.deleteChat(chatId);
        
        // Remove from local state
        setChats(prev => prev.filter(chat => chat._id !== chatId));
        
        if (selectedChat?._id === chatId) {
          setSelectedChat(null);
          setChatMessages([]);
        }
        
        setSuccessMessage('Chat deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        setError(`Failed to delete chat: ${err.message}`);
        console.error('Error deleting chat:', err);
      }
    }
  };

  // Format time for display
  const formatTime = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get recipient label for display
  const getRecipientLabel = () => {
    switch(messageType) {
      case 'allStudents':
        return 'All Students';
      case 'allEmployees':
        return 'All Employees';
      case 'specificClass':
        const selectedClass = classes.find(c => c._id === selectedRecipient);
        return selectedClass ? `${selectedClass.className} - Section ${selectedClass.section}` : 'Select Class';
      case 'specificStudent':
        const selectedStudent = students.find(s => s._id === selectedRecipient);
        return selectedStudent ? `${selectedStudent.studentName} - ${selectedStudent.selectClass}` : 'Select Student';
      case 'specificEmployee':
        const selectedEmployee = employees.find(e => e._id === selectedRecipient);
        return selectedEmployee ? `${selectedEmployee.employeeName} - ${selectedEmployee.employeeRole}` : 'Select Employee';
      default:
        return 'Select recipient type';
    }
  };

  // Filter chats based on search
  const filteredChats = chats.filter(chat =>
    chat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.lastMessageData?.text?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <div className="flex-shrink-0 p-6 pb-0">
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
            <span className="text-blue-600 dark:text-blue-400 font-semibold">Messaging</span>
            <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <span className="text-gray-900 dark:text-gray-100 font-semibold">Messages</span>
          </div>
        </div>
      </div>

      {/* Error and Success Messages */}
      {error && (
        <div className="max-w-7xl mx-auto px-6 mb-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
              <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
            </div>
            <button
              onClick={() => setError('')}
              className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="max-w-7xl mx-auto px-6 mb-4">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Check className="w-5 h-5 text-green-500 dark:text-green-400" />
              <p className="text-green-700 dark:text-green-300 font-medium">{successMessage}</p>
            </div>
            <button
              onClick={() => setSuccessMessage('')}
              className="text-green-500 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden px-6 pb-6">
        <div className="max-w-7xl mx-auto h-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* Left Sidebar - Chats List */}
            <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-full">
              {/* Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
                    <MessageCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <span>Chats</span>
                  </h2>
                  <button
                    onClick={fetchChats}
                    disabled={loading.chats}
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-all"
                    title="Refresh"
                  >
                    {loading.chats ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <RefreshCw className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Chat Button */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleNewChat}
                  disabled={loading.chats}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-semibold">New Chat</span>
                </button>
              </div>

              {/* Search Bar */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search chats..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={loading.chats}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Chats List */}
              <div className="flex-1 overflow-y-auto">
                {loading.chats ? (
                  <div className="p-8 text-center">
                    <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">Loading chats...</p>
                  </div>
                ) : filteredChats.length > 0 ? (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredChats.map(chat => (
                      <button
                        key={chat._id}
                        onClick={() => handleChatClick(chat)}
                        className={`w-full p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left ${
                          selectedChat?._id === chat._id 
                            ? 'bg-blue-50 dark:bg-gray-700 border-l-4 border-blue-600 dark:border-blue-400' 
                            : ''
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
                              <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{chat.name}</h3>
                              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                                {formatTime(chat.lastActivity || chat.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                              {chat.lastMessageData?.text || 'No messages yet'}
                            </p>
                          </div>
                          {(() => {
                            const userId = localStorage.getItem('userId');
                            const userKey = `${userId}_Admin`;
                            const unreadCount = chat.unreadCounts instanceof Map 
                              ? chat.unreadCounts.get(userKey)
                              : chat.unreadCounts?.[userKey] || 0;
                            
                            return unreadCount > 0 && (
                              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-bold text-white">
                                  {unreadCount}
                                </span>
                              </div>
                            );
                          })()}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <MessageCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">No chats found</p>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="mt-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Content Area */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-full">
              {selectedChat ? (
                /* Chat View */
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Chat Header */}
                  <div className="flex-shrink-0 p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
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
                          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{selectedChat.name}</h2>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedChat.type === 'group' ? 'Group Chat' : 
                             selectedChat.type === 'broadcast' ? 'Broadcast' : 'Individual Chat'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleDeleteChat(selectedChat._id, { stopPropagation: () => {} })}
                          className="p-2 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-all"
                          title="Delete Chat"
                        >
                          <X className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedChat(null);
                            setChatMessages([]);
                          }}
                          className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900 relative">
                    {loading.chatDetails && chatMessages.length === 0 ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
                      </div>
                    ) : (
                      <>
                        {pagination.hasMore && (
                          <div className="text-center mb-4">
                            <button
                              onClick={loadMoreMessages}
                              disabled={loading.chatDetails}
                              className="inline-flex items-center space-x-2 px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-all"
                            >
                              {loading.chatDetails ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Plus className="w-4 h-4" />
                              )}
                              <span>Load older messages</span>
                            </button>
                          </div>
                        )}
                        
                        <div className="space-y-4">
                          {chatMessages.map((message) => (
                            <div
                              key={message._id}
                              className={`flex ${message.senderModel === 'Admin' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`max-w-[70%] ${message.senderModel === 'Admin' ? 'order-2' : 'order-1'}`}>
                                {message.senderModel !== 'Admin' && (
                                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 ml-2">
                                    {message.senderName}
                                  </p>
                                )}
                                <div className={`rounded-2xl px-4 py-3 ${
                                  message.senderModel === 'Admin' 
                                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' 
                                    : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100'
                                }`}>
                                  <p className="text-sm leading-relaxed">{message.text}</p>
                                  
                                  {message.attachments && message.attachments.length > 0 && (
                                    <div className="mt-2 space-y-2">
                                      {message.attachments.map((attachment, index) => (
                                        <div key={index} className="flex items-center space-x-2 p-2 bg-white/20 dark:bg-gray-800/50 rounded-lg">
                                          <Paperclip className="w-4 h-4" />
                                          <a
                                            href={attachment.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm underline truncate"
                                          >
                                            {attachment.name}
                                          </a>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  
                                  <p className={`text-xs mt-1 ${
                                    message.senderModel === 'Admin' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                                  }`}>
                                    {message.formattedTime || formatTime(message.createdAt)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                          <div ref={messagesEndRef} />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <form onSubmit={handleSendNewMessage} className="space-y-3">
                      {attachedFiles.length > 0 && (
                        <div className="space-y-2">
                          {attachedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                              <div className="flex items-center space-x-2">
                                <Paperclip className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  ({(file.size / 1024).toFixed(2)} KB)
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveFile(index)}
                                className="p-1 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-600 rounded transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-end space-x-3">
                        <div className="flex-1">
                          <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                            rows="2"
                            disabled={loading.sending}
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <input
                            type="file"
                            ref={fileInputRef}
                            multiple
                            onChange={handleFileAttach}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={loading.sending}
                            className="p-3 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-xl transition-all disabled:opacity-50"
                          >
                            <Paperclip className="w-5 h-5" />
                          </button>
                          <button
                            type="submit"
                            disabled={!newMessage.trim() || loading.sending}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                          >
                            {loading.sending ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Send className="w-5 h-5" />
                            )}
                            <span className="font-semibold">Send</span>
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              ) : !showNewChat ? (
                /* Welcome Screen */
                <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
                  <div className="text-center max-w-2xl">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                      <MessageCircle className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                    </div>
                    
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center justify-center space-x-2">
                      <span>Stay Connected!</span>
                      <Sparkles className="w-8 h-8 text-yellow-500" />
                    </h2>
                    
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                      Effortless communication at your fingertips! Classora's built-in chatting system lets school admins, teachers, students, and staff collaborate instantly.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-blue-200 dark:border-gray-700">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                          <Users className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Group Messages</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Send announcements to all students or staff</p>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-purple-200 dark:border-gray-700">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                          <UserCheck className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Individual Chat</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Direct messaging with specific users</p>
                      </div>

                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-green-200 dark:border-gray-700">
                        <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                          <BookOpen className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Class Updates</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Share information with entire classes</p>
                      </div>
                    </div>

                    <button
                      onClick={handleNewChat}
                      className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold text-lg"
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
                  <div className="flex-shrink-0 p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
                        <Send className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        <span>Start New Chat</span>
                      </h2>
                      <button
                        onClick={() => setShowNewChat(false)}
                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
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
                          <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-4 text-lg">
                            Send Message To:
                          </label>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* All Students */}
                            <button
                              type="button"
                              onClick={() => {
                                setMessageType('allStudents');
                                setSelectedRecipient('');
                                setClasses([]);
                                setStudents([]);
                                setEmployees([]);
                              }}
                              className={`p-4 rounded-xl border-2 transition-all text-left ${
                                messageType === 'allStudents'
                                  ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-gray-800'
                                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                  messageType === 'allStudents'
                                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                                    : 'bg-gray-100 dark:bg-gray-700'
                                }`}>
                                  <Users className={`w-6 h-6 ${messageType === 'allStudents' ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`} />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">All Students</h3>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Group message</p>
                                </div>
                              </div>
                            </button>

                            {/* All Employees */}
                            <button
                              type="button"
                              onClick={() => {
                                setMessageType('allEmployees');
                                setSelectedRecipient('');
                                setClasses([]);
                                setStudents([]);
                                setEmployees([]);
                              }}
                              className={`p-4 rounded-xl border-2 transition-all text-left ${
                                messageType === 'allEmployees'
                                  ? 'border-green-500 dark:border-green-400 bg-green-50 dark:bg-gray-800'
                                  : 'border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                  messageType === 'allEmployees'
                                    ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                                    : 'bg-gray-100 dark:bg-gray-700'
                                }`}>
                                  <GraduationCap className={`w-6 h-6 ${messageType === 'allEmployees' ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`} />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">All Employees</h3>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Group message</p>
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
                                  ? 'border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-gray-800'
                                  : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                  messageType === 'specificClass'
                                    ? 'bg-gradient-to-br from-purple-500 to-pink-600'
                                    : 'bg-gray-100 dark:bg-gray-700'
                                }`}>
                                  <BookOpen className={`w-6 h-6 ${messageType === 'specificClass' ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`} />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Specific Class</h3>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Group message</p>
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
                                  ? 'border-orange-500 dark:border-orange-400 bg-orange-50 dark:bg-gray-800'
                                  : 'border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                  messageType === 'specificStudent'
                                    ? 'bg-gradient-to-br from-orange-500 to-red-600'
                                    : 'bg-gray-100 dark:bg-gray-700'
                                }`}>
                                  <UserCheck className={`w-6 h-6 ${messageType === 'specificStudent' ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`} />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Specific Student</h3>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Individual message</p>
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
                                  ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-gray-800'
                                  : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                  messageType === 'specificEmployee'
                                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
                                    : 'bg-gray-100 dark:bg-gray-700'
                                }`}>
                                  <GraduationCap className={`w-6 h-6 ${messageType === 'specificEmployee' ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`} />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Specific Employee</h3>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Individual message</p>
                                </div>
                              </div>
                            </button>
                          </div>
                        </div>

                        {/* Recipient Selection (for specific options) */}
                        {(messageType === 'specificClass' || messageType === 'specificStudent' || messageType === 'specificEmployee') && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Select {messageType === 'specificClass' ? 'Class' : messageType === 'specificStudent' ? 'Student' : 'Employee'}
                              </label>
                              {loading.recipients && (
                                <Loader2 className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />
                              )}
                            </div>
                            <select
                              value={selectedRecipient}
                              onChange={(e) => setSelectedRecipient(e.target.value)}
                              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50"
                              required
                              disabled={loading.recipients}
                            >
                              <option value="">Choose...</option>
                              {messageType === 'specificClass' && classes.map(cls => (
                                <option key={cls._id} value={cls._id}>
                                  {cls.className} - Section {cls.section} ({cls.studentCount} students)
                                </option>
                              ))}
                              {messageType === 'specificStudent' && students.map(student => (
                                <option key={student._id} value={student._id}>
                                  {student.studentName} - Grade {student.selectClass} - {student.section}
                                </option>
                              ))}
                              {messageType === 'specificEmployee' && employees.map(employee => (
                                <option key={employee._id} value={employee._id}>
                                  {employee.employeeName} - {employee.employeeRole}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {/* Message Input */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Message <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 min-h-[150px] resize-y disabled:opacity-50"
                            placeholder="Type your message here..."
                            required
                            disabled={loading.sending}
                          />
                        </div>

                        {/* File Attachment */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Attachments (Optional)
                          </label>
                          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors bg-gray-50/50 dark:bg-gray-900/50">
                            <input
                              type="file"
                              id="file-upload-new"
                              multiple
                              onChange={handleFileAttach}
                              className="hidden"
                              disabled={loading.sending}
                            />
                            <label htmlFor="file-upload-new" className="cursor-pointer disabled:cursor-not-allowed">
                              <Paperclip className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Click to attach files</p>
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">PDF, DOC, Images, etc. (Max 10MB each)</p>
                            </label>
                          </div>

                          {/* Attached Files List */}
                          {attachedFiles.length > 0 && (
                            <div className="mt-4 space-y-2">
                              {attachedFiles.map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                  <div className="flex items-center space-x-2">
                                    <Paperclip className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      ({(file.size / 1024).toFixed(2)} KB)
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveFile(index)}
                                    className="p-1 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-600 rounded transition-colors"
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
                          <div className="bg-blue-50 dark:bg-gray-800 border border-blue-200 dark:border-gray-700 rounded-xl p-4">
                            <p className="text-sm text-blue-900 dark:text-blue-300">
                              <span className="font-semibold">Sending to:</span> {getRecipientLabel()}
                            </p>
                            {(messageType === 'allStudents' || messageType === 'allEmployees') && (
                              <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                                This will be sent as a broadcast message to all recipients
                              </p>
                            )}
                          </div>
                        )}

                        {/* Success Message */}
                        {showSuccess && (
                          <div className="bg-green-50 dark:bg-gray-800 border border-green-200 dark:border-gray-700 rounded-xl p-4 flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                              <Check className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-green-900 dark:text-green-300">Message Sent Successfully!</p>
                              <p className="text-sm text-green-700 dark:text-green-400">Your message has been delivered.</p>
                            </div>
                          </div>
                        )}

                        {/* Send Button */}
                        <button
                          type="submit"
                          disabled={loading.sending || showSuccess}
                          className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading.sending ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                          ) : (
                            <Send className="w-6 h-6" />
                          )}
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