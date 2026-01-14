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
  RefreshCw,
  File,
  Image as ImageIcon,
  Trash2
} from 'lucide-react';
import { messageApi } from '../../../../services/messageApi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Messaging = () => {
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
  
  // Confirmation modal state
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    chatId: null,
    chatName: ''
  });
  
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

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchChats();
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    toast.info('Loading chats...', { toastId: 'initial-load' });
    fetchChats().finally(() => {
      toast.dismiss('initial-load');
    });
  }, []);

  useEffect(() => {
    if (messageType) {
      fetchRecipients();
    }
  }, [messageType]);

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
      if (searchTerm && searchTerm.trim()) {
        filters.search = searchTerm.trim();
        if (searchTerm.length > 0) {
          toast.info('Searching chats...', { toastId: 'search-chats' });
        }
      }
      
      const data = await messageApi.getChats(filters);
      setChats(data || []);
      
      if (searchTerm && searchTerm.trim()) {
        toast.dismiss('search-chats');
        if (data && data.length > 0) {
          toast.success(`Found ${data.length} chat(s)`);
        } else {
          toast.info('No chats found for your search');
        }
      }
    } catch (err) {
        setError(`Failed to load chats: ${err.message}`);
        toast.error(`Failed to load chats: ${err.message}`);
        toast.dismiss('search-chats');
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
      
      toast.info(`Loading ${messageType === 'specificClass' ? 'classes' : messageType === 'specificStudent' ? 'students' : 'employees'}...`, { toastId: 'load-recipients' });
      
      const data = await messageApi.getRecipients({ 
        type: recipientType,
        search: searchTerm 
      });
      
      if (messageType === 'specificClass') {
        setClasses(data?.classes || []);
        toast.success(`Loaded ${data?.classes?.length || 0} class(es)`);
      } else if (messageType === 'specificStudent') {
        setStudents(data?.students || []);
        toast.success(`Loaded ${data?.students?.length || 0} student(s)`);
      } else if (messageType === 'specificEmployee') {
        setEmployees(data?.employees || []);
        toast.success(`Loaded ${data?.employees?.length || 0} employee(s)`);
      }
    } catch (err) {
      setError(`Failed to load recipients: ${err.message}`);
      toast.error(`Failed to load recipients: ${err.message}`);
      console.error('Error fetching recipients:', err);
    } finally {
      setLoading(prev => ({ ...prev, recipients: false }));
      toast.dismiss('load-recipients');
    }
  };

  // Fetch chat details and messages
  const fetchChatDetails = async (chatId) => {
    try {
      setLoading(prev => ({ ...prev, chatDetails: true }));
      setError('');
      
      toast.info('Loading chat messages...', { toastId: 'load-chat' });
      
      const data = await messageApi.getChatById(chatId, {
        page: pagination.page,
        limit: pagination.limit
      });
      
      if (data?.chat) {
        setSelectedChat(data.chat);
        setChatMessages(data.messages || []);
        
        if (data.pagination) {
          setPagination({
            page: data.pagination.page,
            limit: data.pagination.limit,
            total: data.pagination.total,
            totalPages: data.pagination.totalPages,
            hasMore: data.pagination.page < data.pagination.totalPages
          });
        }
        
        await messageApi.markChatAsRead(chatId);
        toast.success(`Loaded ${data.messages?.length || 0} message(s)`);
      }
    } catch (err) {
      setError(`Failed to load chat: ${err.message}`);
      toast.error(`Failed to load chat: ${err.message}`);
      console.error('Error fetching chat details:', err);
    } finally {
      setLoading(prev => ({ ...prev, chatDetails: false }));
      toast.dismiss('load-chat');
    }
  };

  const filteredChats = (chats || []).filter(chat =>
    (chat?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChatClick = async (chat) => {
    setSelectedChat(chat);
    setShowNewChat(false);
    await fetchChatDetails(chat._id);
  };

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
    if ((!newMessage.trim() && attachedFiles.length === 0) || !selectedChat) {
      if (!newMessage.trim() && attachedFiles.length === 0) {
        toast.error('Please enter a message or attach a file');
      }
      return;
    }
    
    try {
      setLoading(prev => ({ ...prev, sending: true }));
      
      toast.info('Sending message...', { toastId: 'send-message' });
      
      const messageData = {
        text: newMessage.trim() || '',
        chatId: selectedChat._id,
        type: selectedChat.type,
        targetType: selectedChat.targetType || ''
      };
      
      const data = await messageApi.sendMessage(messageData, attachedFiles);
      
      if (data?.message) {
        const newMessage = {
          ...data.message,
          senderName: data.message.senderName || 'You',
          isSent: true,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          attachments: data.message.attachments || []
        };
        
        setChatMessages(prev => [...prev, newMessage]);
        
        setChats(prev => prev.map(chat => 
          chat._id === selectedChat._id 
            ? { ...chat, lastMessage: data.message.text || '📎 Attachment', lastActivity: new Date() }
            : chat
        ));
        
        setNewMessage('');
        setAttachedFiles([]);
        
        setSuccessMessage('Message sent successfully!');
        toast.success('Message sent successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      setError(`Failed to send message: ${err.message}`);
      toast.error(`Failed to send message: ${err.message}`);
      console.error('Error sending message:', err);
    } finally {
      setLoading(prev => ({ ...prev, sending: false }));
      toast.dismiss('send-message');
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
        toast.error(`File type ${file.type} is not allowed`);
        setError(`File type ${file.type} is not allowed`);
        return false;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        setError('File size must be less than 10MB');
        return false;
      }
      
      return true;
    });
    
    if (validFiles.length > 0) {
      setAttachedFiles(prev => [...prev, ...validFiles]);
      toast.success(`Added ${validFiles.length} file(s)`);
    }
    
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleRemoveFile = (index) => {
    const removedFile = attachedFiles[index];
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
    toast.info(`Removed ${removedFile.name}`);
  };

  // Send new message to recipients
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!messageType) {
      toast.error('Please select a recipient type');
      setError('Please select a recipient type');
      return;
    }
    
    if ((messageType === 'specificClass' || messageType === 'specificStudent' || messageType === 'specificEmployee') && !selectedRecipient) {
      toast.error('Please select a recipient');
      setError('Please select a recipient');
      return;
    }

    if (!messageText.trim() && attachedFiles.length === 0) {
      toast.error('Please enter a message or attach a file');
      setError('Please enter a message or attach a file');
      return;
    }

    try {
      setLoading(prev => ({ ...prev, sending: true }));
      setError('');
      
      toast.info('Sending message...', { toastId: 'send-new-message' });
      
      // Prepare message data based on type
      let messageData = {
        text: messageText.trim() || '',
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
        setShowSuccess(true);
        setSuccessMessage(`Message sent to ${getRecipientLabel()}!`);
        toast.success(`Message sent to ${getRecipientLabel()}!`);
        
        fetchChats();
        
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
      toast.error(`Failed to send message: ${err.message}`);
      console.error('Error sending new message:', err);
    } finally {
      setLoading(prev => ({ ...prev, sending: false }));
      toast.dismiss('send-new-message');
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
        return selectedClass ? `${selectedClass.className}` : 'Select Class';
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

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col transition-colors">
      <div className="flex-shrink-0 p-6 pb-0">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6 text-sm text-gray-600 dark:text-gray-300">
            <button 
              onClick={() => navigate('/teacher')}
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

      {/* Main Content */}
      <div className="flex-1 overflow-hidden px-6 pb-6">
        <div className="max-w-7xl mx-auto h-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* Left Sidebar - Chats List */}
            <div className="lg:col-span-1 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col h-full transition-colors">
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
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                      title="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Chats List */}
              <div className="flex-1 overflow-y-auto">
                {loading.chats ? (
                  <div className="p-8 text-center">
                    <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">Loading chats...</p>
                  </div>
                ) : chats.length > 0 ? (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {chats.map(chat => (
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
                              {chat.lastMessage?.text || 'No messages yet'}
                            </p>
                          </div>
                          {(() => {
                            const userId = localStorage.getItem('userId');
                            const userKey = `${userId}_Teacher`;
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
            <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col h-full transition-colors">
              {selectedChat ? (
                /* Chat View */
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Chat Header */}
                  <div className="flex-shrink-0 p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
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
                            {selectedChat.type === 'group' ? 'Class Group' : 
                             selectedChat.type === 'broadcast' ? 'Broadcast' : 'Individual Chat'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedChat(null)}
                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
                      >
                        <X className="w-5 h-5" />
                      </button>
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
                        <div className="space-y-4">
                          {chatMessages.length === 0 ? (
                            <div className="text-center py-8">
                              <MessageCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                              <p className="text-gray-500 dark:text-gray-400">No messages yet</p>
                              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Start the conversation!</p>
                            </div>
                          ) : (
                            chatMessages.map((message) => (
                              <div
                                key={message._id}
                                className={`flex ${message.senderModel === 'Teacher' ? 'justify-end' : 'justify-start'}`}
                              >
                                <div className={`max-w-[70%] ${message.senderModel === 'Teacher' ? 'order-2' : 'order-1'}`}>
                                  {message.senderModel !== 'Teacher' && (
                                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 ml-2">
                                      {message.senderName}
                                    </p>
                                  )}
                                  <div className={`rounded-2xl px-4 py-3 ${
                                    message.senderModel === 'Teacher' 
                                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' 
                                      : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100'
                                  }`}>
                                    <p className="text-sm leading-relaxed">{message.text}</p>
                                    
                                    {message.attachments && message.attachments.length > 0 && (
                                      <div className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-900 rounded text-xs">
                                        📎 Has {message.attachments.length} attachment(s)
                                      </div>
                                    )}
                                    
                                    <p className={`text-xs mt-1 ${
                                      message.senderModel === 'Teacher' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                                    }`}>
                                      {message.formattedTime || formatTime(message.createdAt)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
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
                            disabled={(!newMessage.trim() && attachedFiles.length === 0) || loading.sending}
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
                    
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center space-x-2">
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
                          </div>
                        </div>

                        {/* Recipient Selection */}
                        {(messageType === 'specificClass' || messageType === 'specificStudent') && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Select {messageType === 'specificClass' ? 'Class' : 'Student'}
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
                                  {cls.className}
                                </option>
                              ))}
                              {messageType === 'specificStudent' && students.map(student => (
                                <option key={student._id} value={student._id}>
                                  {student.studentName} - Grade {student.selectClass} - {student.section}
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
                            {messageType === 'allStudents' && (
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

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={3}
      />
    </div>
  );
};

export default Messaging;