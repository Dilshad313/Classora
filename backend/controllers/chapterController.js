// controllers/chapterController.js
import mongoose from 'mongoose';
import Chapter from '../models/Chapter.js';
import Subject from '../models/Subject.js';
import Question from '../models/QuestionPaper.js';
import { StatusCodes } from 'http-status-codes';

/**
 * Get all chapters with filtering
 * @route GET /api/question-paper/chapters
 */
export const getChapters = async (req, res) => {
  try {
    const userId = req.user.id;
    const { subject, search, status, page = 1, limit = 10 } = req.query;

    console.log(`📥 GET /api/question-paper/chapters for user: ${userId}`);

    // Build query
    const query = { createdBy: userId };

    if (subject && mongoose.Types.ObjectId.isValid(subject)) {
      query.subject = subject;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [chapters, total] = await Promise.all([
      Chapter.find(query)
        .populate('subject', 'name')
        .sort({ chapterNumber: 1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Chapter.countDocuments(query)
    ]);

    console.log(`✅ Found ${chapters.length} chapters`);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Chapters retrieved successfully',
      count: chapters.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: chapters
    });
  } catch (error) {
    console.error('❌ Get chapters error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch chapters'
    });
  }
};

/**
 * Get single chapter by ID
 * @route GET /api/question-paper/chapters/:id
 */
export const getChapterById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    console.log(`📥 GET /api/question-paper/chapters/${id}`);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid chapter ID'
      });
    }

    const chapter = await Chapter.findOne({ _id: id, createdBy: userId })
      .populate('subject', 'name');

    if (!chapter) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Chapter not found'
      });
    }

    // Get questions for this chapter
    const questions = await Question.find({
      chapter: id,
      createdBy: userId,
      status: 'active'
    }).select('question questionType difficulty marks');

    console.log('✅ Chapter found');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Chapter retrieved successfully',
      data: {
        ...chapter.toObject(),
        questions
      }
    });
  } catch (error) {
    console.error('❌ Get chapter error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch chapter'
    });
  }
};

/**
 * Create new chapter
 * @route POST /api/question-paper/chapters
 */
export const createChapter = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('📥 POST /api/question-paper/chapters');
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    const {
      chapterNumber,
      title,
      topics,
      description,
      subject
    } = req.body;

    // Validation
    if (!chapterNumber || !title || !topics || !subject) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Chapter number, title, topics, and subject are required'
      });
    }

    // Validate topics array
    if (!Array.isArray(topics) || topics.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'At least one topic is required'
      });
    }

    const validTopics = topics.filter(topic => topic && topic.trim().length > 0);
    if (validTopics.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'At least one non-empty topic is required'
      });
    }

    // Verify subject exists (remove createdBy check for now to debug)
    console.log('🔍 Looking for subject with ID:', subject);
    console.log('🔍 Subject ID type:', typeof subject);
    console.log('🔍 Subject ID is valid ObjectId:', mongoose.Types.ObjectId.isValid(subject));
    
    const subjectExists = await Subject.findOne({ _id: subject });
    console.log('🔍 Subject found:', !!subjectExists);
    
    if (!subjectExists) {
      console.log('❌ Subject not found for ID:', subject);
      
      // Let's also check what subjects exist in the database
      const allSubjects = await Subject.find({}).limit(5);
      console.log('🔍 Available subjects in database:', allSubjects.map(s => ({ _id: s._id, name: s.name })));
      
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Subject not found'
      });
    } else {
      console.log('✅ Subject found:', { _id: subjectExists._id, name: subjectExists.name });
    }

    // Check for duplicate chapter number for this subject
    const existingChapter = await Chapter.findOne({
      subject,
      chapterNumber: parseInt(chapterNumber),
      createdBy: userId
    });

    if (existingChapter) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: `Chapter ${chapterNumber} already exists for this subject`
      });
    }

    // Create chapter
    const chapterData = {
      chapterNumber: parseInt(chapterNumber),
      title: title.trim(),
      topics: validTopics, // Use the validated topics array
      subject,
      createdBy: userId
    };

    if (description) {
      chapterData.description = description.trim();
    }

    const chapter = await Chapter.create(chapterData);

    console.log('✅ Chapter created:', chapter._id);

    // Populate the response
    const populatedChapter = await Chapter.findById(chapter._id)
      .populate('subject', 'name');

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Chapter created successfully',
      data: populatedChapter
    });
  } catch (error) {
    console.error('❌ Create chapter error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: errors[0] || 'Validation failed',
        errors
      });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to create chapter'
    });
  }
};

/**
 * Update chapter
 * @route PUT /api/question-paper/chapters/:id
 */
export const updateChapter = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    console.log(`📥 PUT /api/question-paper/chapters/${id}`);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid chapter ID'
      });
    }

    const chapter = await Chapter.findOne({ _id: id, createdBy: userId });
    
    if (!chapter) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Chapter not found'
      });
    }

    const {
      chapterNumber,
      title,
      topics,
      description,
      subject,
      status
    } = req.body;

    // Check for duplicate chapter number if updating
    if (chapterNumber && parseInt(chapterNumber) !== chapter.chapterNumber) {
      const existingChapter = await Chapter.findOne({
        subject: subject || chapter.subject,
        chapterNumber: parseInt(chapterNumber),
        createdBy: userId,
        _id: { $ne: id }
      });

      if (existingChapter) {
        return res.status(StatusCodes.CONFLICT).json({
          success: false,
          message: `Chapter ${chapterNumber} already exists for this subject`
        });
      }
      chapter.chapterNumber = parseInt(chapterNumber);
    }

    // Update other fields
    if (title !== undefined) chapter.title = title.trim();
    if (topics !== undefined) {
      if (!Array.isArray(topics) || topics.length === 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'At least one topic is required'
        });
      }
      const validTopics = topics.filter(topic => topic && topic.trim().length > 0);
      if (validTopics.length === 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'At least one non-empty topic is required'
        });
      }
      chapter.topics = validTopics;
    }
    if (description !== undefined) chapter.description = description.trim();
    if (status !== undefined) chapter.status = status;

    // Update subject if provided
    if (subject) {
      const subjectExists = await Subject.findOne({ _id: subject });
      if (!subjectExists) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Subject not found'
        });
      }
      chapter.subject = subject;
    }

    await chapter.save();

    console.log('✅ Chapter updated:', chapter._id);

    // Populate the response
    const populatedChapter = await Chapter.findById(chapter._id)
      .populate('subject', 'name');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Chapter updated successfully',
      data: populatedChapter
    });
  } catch (error) {
    console.error('❌ Update chapter error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: errors[0] || 'Validation failed',
        errors
      });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to update chapter'
    });
  }
};

/**
 * Delete chapter
 * @route DELETE /api/question-paper/chapters/:id
 */
export const deleteChapter = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    console.log(`📥 DELETE /api/question-paper/chapters/${id}`);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid chapter ID'
      });
    }

    const chapter = await Chapter.findOne({ _id: id, createdBy: userId });
    
    if (!chapter) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Chapter not found'
      });
    }

    // Check if chapter has questions
    const questionCount = await Question.countDocuments({
      chapter: id,
      createdBy: userId
    });

    if (questionCount > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: `Cannot delete chapter with ${questionCount} questions. Delete questions first.`
      });
    }

    await Chapter.findByIdAndDelete(id);

    console.log('✅ Chapter deleted:', id);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Chapter deleted successfully',
      data: { id }
    });
  } catch (error) {
    console.error('❌ Delete chapter error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete chapter'
    });
  }
};

/**
 * Get chapter statistics
 * @route GET /api/question-paper/chapters/stats/summary
 */
export const getChapterStats = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(`📥 GET /api/question-paper/chapters/stats/summary for user: ${userId}`);

    // Get chapter statistics
    const stats = await Chapter.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalChapters: { $sum: 1 },
          totalTopics: { $sum: { $size: '$topics' } }, // Updated to handle array
          totalQuestions: { $sum: '$questionCount' },
          totalMarks: { $sum: '$totalMarks' }
        }
      }
    ]);

    // Get subject-wise chapter distribution
    const subjectDistribution = await Chapter.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: 'subjects',
          localField: 'subject',
          foreignField: '_id',
          as: 'subjectDetails'
        }
      },
      { $unwind: '$subjectDetails' },
      {
        $group: {
          _id: '$subject',
          subjectName: { $first: '$subjectDetails.name' },
          chapterCount: { $sum: 1 },
          topicCount: { $sum: { $size: '$topics' } }, // Updated to handle array
          questionCount: { $sum: '$questionCount' }
        }
      },
      { $sort: { chapterCount: -1 } }
    ]);

    console.log('✅ Chapter stats retrieved');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Chapter statistics retrieved successfully',
      data: {
        ...stats[0] || { totalChapters: 0, totalTopics: 0, totalQuestions: 0, totalMarks: 0 },
        subjectDistribution
      }
    });
  } catch (error) {
    console.error('❌ Get chapter stats error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch chapter statistics'
    });
  }
};

/**
 * Bulk update chapters
 * @route PUT /api/question-paper/chapters/bulk-update
 */
export const bulkUpdateChapters = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chapters } = req.body;

    console.log('📥 PUT /api/question-paper/chapters/bulk-update');

    if (!Array.isArray(chapters) || chapters.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Chapters array is required'
      });
    }

    const bulkOps = chapters.map(chapter => ({
      updateOne: {
        filter: { _id: chapter._id, createdBy: userId },
        update: { $set: chapter }
      }
    }));

    const result = await Chapter.bulkWrite(bulkOps);

    console.log(`✅ Updated ${result.modifiedCount} chapters`);

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Successfully updated ${result.modifiedCount} chapters`,
      data: { modifiedCount: result.modifiedCount }
    });
  } catch (error) {
    console.error('❌ Bulk update chapters error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to update chapters'
    });
  }
};