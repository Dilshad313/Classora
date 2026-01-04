import mongoose from 'mongoose';
import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import Student from '../models/Student.js';
import Employee from '../models/Employee.js';
import Class from '../models/Class.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js';
import { StatusCodes } from 'http-status-codes';

/**
 * Get all chats for current user
 * @route GET /api/messages/chats
 */
export const getAllChats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { search, type, unreadOnly } = req.query;
    
    console.log(`📥 GET /api/messages/chats for user: ${userId}`);
    
    // Build query
    const query = {
      isActive: true,
      $or: [
        { createdBy: userId },
        { 'participants.user': userId, 'participants.model': 'Admin' }
      ]
    };
    
    if (type && type !== 'all') {
      query.type = type;
    }
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    const chats = await Chat.find(query)
      .populate({
        path: 'lastMessage',
        select: 'text createdAt senderName'
      })
      .populate({
        path: 'class',
        select: 'className section'
      })
      .populate({
        path: 'individualRecipient.user',
        select: 'studentName employeeName'
      })
      .sort({ updatedAt: -1 });
    
    // Calculate unread counts for each chat
    const chatsWithUnread = await Promise.all(chats.map(async (chat) => {
      const unreadKey = `${userId}_Admin`;
      const unreadCount = chat.unreadCounts.get(unreadKey) || 0;
      
      const lastMessageTime = chat.lastMessage ? chat.lastMessage.createdAt : chat.updatedAt;
      const timeDiff = new Date() - new Date(lastMessageTime);
      const minutes = Math.floor(timeDiff / 60000);
      const hours = Math.floor(timeDiff / 3600000);
      const days = Math.floor(timeDiff / 86400000);
      
      let timeAgo = '';
      if (minutes < 1) timeAgo = 'Just now';
      else if (minutes < 60) timeAgo = `${minutes} min ago`;
      else if (hours < 24) timeAgo = `${hours} hour${hours > 1 ? 's' : ''} ago`;
      else if (days < 7) timeAgo = `${days} day${days > 1 ? 's' : ''} ago`;
      else timeAgo = new Date(lastMessageTime).toLocaleDateString();
      
      const chatObj = chat.toObject();
      chatObj.unread = unreadCount;
      chatObj.time = timeAgo;
      
      return chatObj;
    }));
    
    // Filter unread only if requested
    const filteredChats = unreadOnly === 'true' 
      ? chatsWithUnread.filter(chat => chat.unread > 0)
      : chatsWithUnread;
    
    console.log(`✅ Found ${filteredChats.length} chats`);
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Chats retrieved successfully',
      data: filteredChats
    });
  } catch (error) {
    console.error('❌ Get chats error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch chats'
    });
  }
};

/**
 * Get single chat by ID with messages
 * @route GET /api/messages/chats/:id
 */
export const getChatById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    console.log(`📥 GET /api/messages/chats/${id}`);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid chat ID'
      });
    }
    
    // Find chat and verify access
    const chat = await Chat.findOne({
      _id: id,
      isActive: true,
      $or: [
        { createdBy: userId },
        { 'participants.user': userId, 'participants.model': 'Admin' }
      ]
    })
    .populate({
      path: 'class',
      select: 'className section teacher'
    })
    .populate({
      path: 'individualRecipient.user',
      select: 'studentName employeeName picture'
    });
    
    if (!chat) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Chat not found or access denied'
      });
    }
    
    // Get messages with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [messages, total] = await Promise.all([
      Message.find({ chat: id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Message.countDocuments({ chat: id })
    ]);
    
    // Mark messages as read for current user
    await Message.markAsRead(id, userId, 'Admin');
    
    // Reset unread count for this user
    const unreadKey = `${userId}_Admin`;
    chat.unreadCounts.set(unreadKey, 0);
    await chat.save();
    
    console.log(`✅ Found ${messages.length} messages in chat`);
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Chat retrieved successfully',
      data: {
        chat,
        messages: messages.reverse(), // Return in chronological order
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('❌ Get chat error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch chat'
    });
  }
};

/**
 * Send new message
 * @route POST /api/messages/send
 */
export const sendMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const adminName = req.user.name || 'Admin';
    console.log('📥 POST /api/messages/send');
    
    const {
      type,
      targetType,
      recipientId,
      recipientModel,
      className,
      text,
      chatId
    } = req.body;
    
    // Validation
    if ((!text || !text.trim()) && (!req.files || !req.files.attachments || req.files.attachments.length === 0)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Message text or attachments is required'
      });
    }
    
    let chat = null;
    let recipients = [];
    
    // If chatId is provided, use existing chat
    if (chatId && mongoose.Types.ObjectId.isValid(chatId)) {
      chat = await Chat.findOne({
        _id: chatId,
        isActive: true,
        $or: [
          { createdBy: userId },
          { 'participants.user': userId, 'participants.model': 'Admin' }
        ]
      });
      
      if (!chat) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Chat not found'
        });
      }
    } else {
      // Create new chat or find existing one
      if (type === 'broadcast') {
        // Broadcast message
        if (!targetType || !['allStudents', 'allEmployees'].includes(targetType)) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Invalid target type for broadcast'
          });
        }
        
        chat = await Chat.createBroadcastChat(targetType, userId);
        
        // Get recipients based on broadcast type
        if (targetType === 'allStudents') {
          const students = await Student.find({ status: 'active' });
          recipients = students.map(student => ({
            user: student._id,
            model: 'Student'
          }));
        } else {
          const employees = await Employee.find({ status: 'active' });
          recipients = employees.map(employee => ({
            user: employee._id,
            model: 'Employee'
          }));
        }
        
      } else if (type === 'group') {
        // Group message to class
        if (!className) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Class name is required for group message'
          });
        }
        
        const classData = await Class.findOne({
          className: { $regex: new RegExp(className, 'i') },
          createdBy: userId
        });
        
        if (!classData) {
          return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: 'Class not found'
          });
        }
        
        // Find or create chat for this class
        chat = await Chat.findOne({
          type: 'group',
          class: classData._id,
          createdBy: userId,
          isActive: true
        });
        
        if (!chat) {
          chat = await Chat.create({
            name: `Grade ${classData.className} - Section ${classData.section}`,
            type: 'group',
            class: classData._id,
            participants: [{
              user: userId,
              model: 'Admin'
            }],
            createdBy: userId
          });
        }
        
        // Get students in this class
        const students = await Student.find({
          selectClass: classData.className,
          status: 'active'
        });
        
        recipients = students.map(student => ({
          user: student._id,
          model: 'Student'
        }));
        
      } else if (type === 'individual') {
        // Individual message
        if (!recipientId || !recipientModel) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Recipient information is required'
          });
        }
        
        // Find recipient
        let recipientName = '';
        let recipientData = null;
        
        if (recipientModel === 'Student') {
          recipientData = await Student.findById(recipientId);
          recipientName = recipientData?.studentName;
        } else if (recipientModel === 'Employee') {
          recipientData = await Employee.findById(recipientId);
          recipientName = recipientData?.employeeName;
        }
        
        if (!recipientData) {
          return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: 'Recipient not found'
          });
        }
        
        // Find existing individual chat
        chat = await Chat.findOne({
          type: 'individual',
          'individualRecipient.user': recipientId,
          'individualRecipient.model': recipientModel,
          createdBy: userId,
          isActive: true
        });
        
        if (!chat) {
          chat = await Chat.create({
            name: recipientName,
            type: 'individual',
            individualRecipient: {
              user: recipientId,
              model: recipientModel
            },
            participants: [
              { user: userId, model: 'Admin' },
              { user: recipientId, model: recipientModel }
            ],
            createdBy: userId
          });
        }
        
        recipients = [{
          user: recipientId,
          model: recipientModel
        }];
      }
    }
    
    // Handle file attachments
    let attachments = [];
    if (req.files && req.files.attachments) {
      for (const file of req.files.attachments) {
        try {
          const uploadResult = await uploadToCloudinary(
            file.buffer,
            'message-attachments'
          );
          
          attachments.push({
            name: file.originalname,
            url: uploadResult.url,
            publicId: uploadResult.publicId,
            fileType: file.mimetype,
            fileSize: file.size
          });
        } catch (uploadError) {
          console.error('Attachment upload error:', uploadError);
        }
      }
    }
    
    // Create message
    const message = await Message.create({
      chat: chat._id,
      sender: userId,
      senderModel: 'Admin',
      senderName: adminName,
      text: text.trim(),
      attachments,
      readBy: [{
        user: userId,
        userModel: 'Admin',
        readAt: new Date()
      }]
    });
    
    // Update chat's last message
    chat.lastMessage = message._id;
    await chat.save();
    
    // Increment unread counts for all recipients except sender
    recipients.forEach(recipient => {
      const key = `${recipient.user}_${recipient.model}`;
      const currentCount = chat.unreadCounts.get(key) || 0;
      chat.unreadCounts.set(key, currentCount + 1);
    });
    
    await chat.save();
    
    console.log('✅ Message sent successfully');
    
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        message,
        chat
      }
    });
  } catch (error) {
    console.error('❌ Send message error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to send message'
    });
  }
};

/**
 * Delete chat
 * @route DELETE /api/messages/chats/:id
 */
export const deleteChat = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    console.log(`📥 DELETE /api/messages/chats/${id}`);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid chat ID'
      });
    }
    
    const chat = await Chat.findOne({
      _id: id,
      createdBy: userId,
      isActive: true
    });
    
    if (!chat) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Chat not found'
      });
    }
    
    // Soft delete (mark as inactive)
    chat.isActive = false;
    await chat.save();
    
    console.log('✅ Chat deleted successfully');
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Chat deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete chat error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete chat'
    });
  }
};

/**
 * Get recipients for new message
 * @route GET /api/messages/recipients
 */
export const getRecipients = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, search } = req.query;
    
    console.log(`📥 GET /api/messages/recipients`);
    
    let data = {};
    
    if (!type || type === 'allStudents') {
      const studentFilter = search 
        ? {
            $or: [
              { studentName: { $regex: search, $options: 'i' } },
              { registrationNo: { $regex: search, $options: 'i' } }
            ],
            status: 'active'
          }
        : { status: 'active' };
      
      const students = await Student.find(studentFilter)
        .select('studentName selectClass section registrationNo')
        .limit(20);
      
      data.students = students;
    }
    
    if (!type || type === 'allEmployees') {
      const employeeFilter = search
        ? {
            $or: [
              { employeeName: { $regex: search, $options: 'i' } },
              { employeeRole: { $regex: search, $options: 'i' } }
            ],
            status: 'active'
          }
        : { status: 'active' };
      
      const employees = await Employee.find(employeeFilter)
        .select('employeeName employeeRole department')
        .limit(20);
      
      data.employees = employees;
    }
    
    if (!type || type === 'specificClass') {
      const classFilter = search
        ? {
            className: { $regex: search, $options: 'i' },
            createdBy: userId,
            status: 'active'
          }
        : { createdBy: userId, status: 'active' };
      
      const classes = await Class.find(classFilter)
        .select('className section subject teacher studentCount')
        .limit(20);
      
      data.classes = classes;
    }
    
    console.log('✅ Recipients retrieved successfully');
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Recipients retrieved successfully',
      data
    });
  } catch (error) {
    console.error('❌ Get recipients error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch recipients'
    });
  }
};

/**
 * Mark chat as read
 * @route POST /api/messages/chats/:id/read
 */
export const markChatAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    console.log(`📥 POST /api/messages/chats/${id}/read`);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid chat ID'
      });
    }
    
    const chat = await Chat.findOne({
      _id: id,
      $or: [
        { createdBy: userId },
        { 'participants.user': userId, 'participants.model': 'Admin' }
      ]
    });
    
    if (!chat) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Chat not found'
      });
    }
    
    // Mark all messages as read
    await Message.markAsRead(id, userId, 'Admin');
    
    // Reset unread count for this user
    const unreadKey = `${userId}_Admin`;
    chat.unreadCounts.set(unreadKey, 0);
    await chat.save();
    
    console.log('✅ Chat marked as read');
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Chat marked as read'
    });
  } catch (error) {
    console.error('❌ Mark chat as read error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to mark chat as read'
    });
  }
};

/**
 * Get message statistics
 * @route GET /api/messages/stats
 */
export const getMessageStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    console.log(`📥 GET /api/messages/stats`);
    
    const [totalChats, unreadMessages, todayMessages] = await Promise.all([
      Chat.countDocuments({
        isActive: true,
        $or: [
          { createdBy: userId },
          { 'participants.user': userId, 'participants.model': 'Admin' }
        ]
      }),
      Chat.aggregate([
        {
          $match: {
            isActive: true,
            $or: [
              { createdBy: new mongoose.Types.ObjectId(userId) },
              { 'participants.user': new mongoose.Types.ObjectId(userId), 'participants.model': 'Admin' }
            ]
          }
        },
        {
          $project: {
            unreadCount: {
              $ifNull: [
                { $getField: { field: `${userId}_Admin`, input: '$unreadCounts' } },
                0
              ]
            }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$unreadCount' }
          }
        }
      ]),
      Message.countDocuments({
        sender: userId,
        senderModel: 'Admin',
        createdAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      })
    ]);
    
    const stats = {
      totalChats,
      unreadMessages: unreadMessages[0]?.total || 0,
      todayMessages,
      chatTypes: {
        group: await Chat.countDocuments({ type: 'group', createdBy: userId, isActive: true }),
        individual: await Chat.countDocuments({ type: 'individual', createdBy: userId, isActive: true }),
        broadcast: await Chat.countDocuments({ type: 'broadcast', createdBy: userId, isActive: true })
      }
    };
    
    console.log('✅ Message stats retrieved');
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Message statistics retrieved successfully',
      data: stats
    });
  } catch (error) {
    console.error('❌ Get message stats error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch message statistics'
    });
  }
};