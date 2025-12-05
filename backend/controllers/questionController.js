// controllers/questionController.js
import mongoose from 'mongoose';
import Question from '../models/QuestionPaper.js';
import Subject from '../models/Subject.js';
import Chapter from '../models/Chapter.js';
import SubjectAssignment from '../models/SubjectAssignment.js';
import { StatusCodes } from 'http-status-codes';

/**
 * Get all questions with filtering
 * @route GET /api/question-paper/questions
 */
export const getQuestions = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      subject,
      chapter,
      questionType,
      difficulty,
      search,
      status,
      page = 1,
      limit = 10
    } = req.query;

    console.log(`📥 GET /api/question-paper/questions for user: ${userId}`);

    // Build query
    const query = { createdBy: userId };

    if (subject && mongoose.Types.ObjectId.isValid(subject)) {
      query.subject = subject;
    }

    if (chapter && mongoose.Types.ObjectId.isValid(chapter)) {
      query.chapter = chapter;
    }

    if (questionType && questionType !== 'all') {
      query.questionType = questionType;
    }

    if (difficulty && difficulty !== 'all') {
      query.difficulty = difficulty;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { question: { $regex: search, $options: 'i' } },
        { solution: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [questions, total] = await Promise.all([
      Question.find(query)
        .populate('subject', 'name')
        .populate('chapter', 'title chapterNumber')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Question.countDocuments(query)
    ]);

    console.log(`✅ Found ${questions.length} questions`);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Questions retrieved successfully',
      count: questions.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: questions
    });
  } catch (error) {
    console.error('❌ Get questions error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch questions'
    });
  }
};

/**
 * Get single question by ID
 * @route GET /api/question-paper/questions/:id
 */
export const getQuestionById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    console.log(`📥 GET /api/question-paper/questions/${id}`);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid question ID'
      });
    }

    const question = await Question.findOne({ _id: id, createdBy: userId })
      .populate('subject', 'name')
      .populate('chapter', 'title chapterNumber');

    if (!question) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Question not found'
      });
    }

    console.log('✅ Question found');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Question retrieved successfully',
      data: question
    });
  } catch (error) {
    console.error('❌ Get question error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch question'
    });
  }
};

/**
 * Create new question
 * @route POST /api/question-paper/questions
 */
export const createQuestion = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('📥 POST /api/question-paper/questions');
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    const {
      question,
      questionType,
      difficulty,
      marks,
      subject,
      chapter,
      option1,
      option2,
      option3,
      option4,
      correctAnswer,
      solution,
      hint
    } = req.body;

    // Validation
    if (!question || !questionType || !difficulty || !marks || !subject || !chapter) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Question, type, difficulty, marks, subject, and chapter are required'
      });
    }

    // Verify subject exists and belongs to user
    const subjectExists = await Subject.findOne({ _id: subject, createdBy: userId });
    if (!subjectExists) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Subject not found'
      });
    }

    // Verify chapter exists and belongs to user
    const chapterExists = await Chapter.findOne({ _id: chapter, createdBy: userId });
    if (!chapterExists) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Chapter not found'
      });
    }

    // Validate MCQ questions
    if (questionType === 'MCQ') {
      if (!option1 || !option2 || !option3 || !option4 || !correctAnswer) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'All 4 options and correct answer are required for MCQ questions'
        });
      }
      if (!['1', '2', '3', '4'].includes(correctAnswer)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Correct answer must be 1, 2, 3, or 4 for MCQ questions'
        });
      }
    }

    // Create question data
    const questionData = {
      question: question.trim(),
      questionType,
      difficulty,
      marks: parseInt(marks),
      subject,
      chapter,
      createdBy: userId
    };

    // Add optional fields
    if (solution) questionData.solution = solution.trim();
    if (hint) questionData.hint = hint.trim();

    // Add MCQ options if applicable
    if (questionType === 'MCQ') {
      questionData.options = {
        option1: option1.trim(),
        option2: option2.trim(),
        option3: option3.trim(),
        option4: option4.trim()
      };
      questionData.correctAnswer = correctAnswer;
    }

    const newQuestion = await Question.create(questionData);

    // Update chapter statistics
    await Chapter.findByIdAndUpdate(chapter, {
      $inc: {
        questionCount: 1,
        totalMarks: parseInt(marks)
      }
    });

    console.log('✅ Question created:', newQuestion._id);

    // Populate the response
    const populatedQuestion = await Question.findById(newQuestion._id)
      .populate('subject', 'name')
      .populate('chapter', 'title');

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Question created successfully',
      data: populatedQuestion
    });
  } catch (error) {
    console.error('❌ Create question error:', error);
    
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
      message: 'Failed to create question'
    });
  }
};

/**
 * Update question
 * @route PUT /api/question-paper/questions/:id
 */
export const updateQuestion = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    console.log(`📥 PUT /api/question-paper/questions/${id}`);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid question ID'
      });
    }

    const question = await Question.findOne({ _id: id, createdBy: userId });
    
    if (!question) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Question not found'
      });
    }

    const {
      question: questionText,
      questionType,
      difficulty,
      marks,
      subject,
      chapter,
      option1,
      option2,
      option3,
      option4,
      correctAnswer,
      solution,
      hint,
      status
    } = req.body;

    // Store old marks for chapter update
    const oldMarks = question.marks;
    const oldChapter = question.chapter;

    // Update fields
    if (questionText !== undefined) question.question = questionText.trim();
    if (questionType !== undefined) question.questionType = questionType;
    if (difficulty !== undefined) question.difficulty = difficulty;
    if (marks !== undefined) question.marks = parseInt(marks);
    if (subject !== undefined) {
      const subjectExists = await Subject.findOne({ _id: subject, createdBy: userId });
      if (!subjectExists) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Subject not found'
        });
      }
      question.subject = subject;
    }
    if (chapter !== undefined) {
      const chapterExists = await Chapter.findOne({ _id: chapter, createdBy: userId });
      if (!chapterExists) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Chapter not found'
        });
      }
      question.chapter = chapter;
    }
    if (solution !== undefined) question.solution = solution.trim();
    if (hint !== undefined) question.hint = hint.trim();
    if (status !== undefined) question.status = status;

    // Update MCQ options if applicable
    if (questionType === 'MCQ' || question.questionType === 'MCQ') {
      if (option1 !== undefined) question.options.option1 = option1.trim();
      if (option2 !== undefined) question.options.option2 = option2.trim();
      if (option3 !== undefined) question.options.option3 = option3.trim();
      if (option4 !== undefined) question.options.option4 = option4.trim();
      if (correctAnswer !== undefined) question.correctAnswer = correctAnswer;
    }

    await question.save();

    // Update chapter statistics if marks or chapter changed
    if (marks !== undefined || chapter !== undefined) {
      const newMarks = marks !== undefined ? parseInt(marks) : oldMarks;
      const newChapter = chapter !== undefined ? chapter : oldChapter;

      // Decrement from old chapter
      await Chapter.findByIdAndUpdate(oldChapter, {
        $inc: {
          totalMarks: -oldMarks
        }
      });

      // Increment to new chapter
      await Chapter.findByIdAndUpdate(newChapter, {
        $inc: {
          totalMarks: newMarks
        }
      });
    }

    console.log('✅ Question updated:', question._id);

    // Populate the response
    const populatedQuestion = await Question.findById(question._id)
      .populate('subject', 'name')
      .populate('chapter', 'title');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Question updated successfully',
      data: populatedQuestion
    });
  } catch (error) {
    console.error('❌ Update question error:', error);
    
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
      message: 'Failed to update question'
    });
  }
};

/**
 * Delete question
 * @route DELETE /api/question-paper/questions/:id
 */
export const deleteQuestion = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    console.log(`📥 DELETE /api/question-paper/questions/${id}`);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid question ID'
      });
    }

    const question = await Question.findOne({ _id: id, createdBy: userId });
    
    if (!question) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Update chapter statistics before deletion
    await Chapter.findByIdAndUpdate(question.chapter, {
      $inc: {
        questionCount: -1,
        totalMarks: -question.marks
      }
    });

    await Question.findByIdAndDelete(id);

    console.log('✅ Question deleted:', id);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Question deleted successfully',
      data: { id }
    });
  } catch (error) {
    console.error('❌ Delete question error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete question'
    });
  }
};

/**
 * Bulk delete questions
 * @route POST /api/question-paper/questions/bulk-delete
 */
export const bulkDeleteQuestions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { ids } = req.body;

    console.log(`📥 POST /api/question-paper/questions/bulk-delete`);

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Please provide question IDs to delete'
      });
    }

    // Validate all IDs
    const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));
    
    if (validIds.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'No valid question IDs provided'
      });
    }

    // Get questions to update chapter statistics
    const questionsToDelete = await Question.find({
      _id: { $in: validIds },
      createdBy: userId
    });

    // Update chapter statistics for each question
    for (const question of questionsToDelete) {
      await Chapter.findByIdAndUpdate(question.chapter, {
        $inc: {
          questionCount: -1,
          totalMarks: -question.marks
        }
      });
    }

    // Delete questions
    const result = await Question.deleteMany({
      _id: { $in: validIds },
      createdBy: userId
    });

    console.log(`✅ Deleted ${result.deletedCount} questions`);

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} questions`,
      data: { deletedCount: result.deletedCount }
    });
  } catch (error) {
    console.error('❌ Bulk delete questions error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete questions'
    });
  }
};

/**
 * Get question statistics
 * @route GET /api/question-paper/questions/stats/summary
 */
export const getQuestionStats = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(`📥 GET /api/question-paper/questions/stats/summary for user: ${userId}`);

    const stats = await Question.getQuestionStats(userId);

    // Get recent questions (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentQuestions = await Question.countDocuments({
      createdBy: userId,
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Get subject-wise distribution
    const subjectDistribution = await Question.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$subject',
          count: { $sum: 1 },
          totalMarks: { $sum: '$marks' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Populate subject names
    const populatedDistribution = await Promise.all(
      subjectDistribution.map(async (item) => {
        const subject = await Subject.findById(item._id).select('name');
        return {
          subjectId: item._id,
          subjectName: subject ? subject.name : 'Unknown',
          count: item.count,
          totalMarks: item.totalMarks
        };
      })
    );

    console.log('✅ Question stats retrieved');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Question statistics retrieved successfully',
      data: {
        ...stats,
        recentQuestions,
        subjectDistribution: populatedDistribution
      }
    });
  } catch (error) {
    console.error('❌ Get question stats error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch question statistics'
    });
  }
};

/**
 * Get dropdown data for forms
 * @route GET /api/question-paper/dropdown-data
 */
export const getDropdownData = async (req, res) => {
  try {
    const userId = req.user.id;
    const { subjectId } = req.query;
    
    console.log(`📥 GET /api/question-paper/dropdown-data for user: ${userId}`);

    // Get all subjects
    let subjects = await Subject.find({ createdBy: userId })
      .select('name code')
      .sort({ name: 1 });

    // Sync subjects from SubjectAssignment if they don't exist in Subject collection
    const assignments = await SubjectAssignment.find({ createdBy: userId });
    let newSubjectsCreated = false;

    for (const assignment of assignments) {
      for (const sub of assignment.subjects) {
        const subjectName = sub.subjectName.trim();
        const existingSubject = subjects.find(s => s.name.toLowerCase() === subjectName.toLowerCase());

        if (!existingSubject) {
          // Generate code from name (first 3 chars or whole word if short)
          let code = subjectName.substring(0, 3).toUpperCase();
          if (code.length < 3) code = subjectName.toUpperCase();
          
          // Ensure code uniqueness
          let counter = 1;
          let uniqueCode = code;
          while (subjects.find(s => s.code === uniqueCode)) {
            uniqueCode = `${code}${counter}`;
            counter++;
          }

          try {
            const newSubject = await Subject.create({
              name: subjectName,
              code: uniqueCode,
              createdBy: userId
            });
            subjects.push(newSubject);
            newSubjectsCreated = true;
          } catch (err) {
            console.error(`Failed to auto-create subject ${subjectName}:`, err);
          }
        }
      }
    }

    // Re-sort if new subjects were added
    if (newSubjectsCreated) {
      subjects.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Get chapters (filtered by subject if provided)
    const chapterQuery = { createdBy: userId };
    if (subjectId && mongoose.Types.ObjectId.isValid(subjectId)) {
      chapterQuery.subject = subjectId;
    }
    
    const chapters = await Chapter.find(chapterQuery)
      .select('title chapterNumber subject')
      .populate('subject', 'name')
      .sort({ chapterNumber: 1 });

    // Question types
    const questionTypes = [
      'Very Short Answer',
      'Short Answer',
      'Long Answer',
      'MCQ',
      'True/False'
    ];

    // Difficulty levels
    const difficultyLevels = ['Easy', 'Medium', 'Hard'];

    console.log(`✅ Dropdown data retrieved: ${subjects.length} subjects, ${chapters.length} chapters`);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Dropdown data retrieved successfully',
      data: {
        subjects,
        chapters,
        questionTypes,
        difficultyLevels
      }
    });
  } catch (error) {
    console.error('❌ Get dropdown data error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch dropdown data'
    });
  }
};