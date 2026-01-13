import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import Class from '../models/Class.js';
import Student from '../models/Student.js';
import SkillRating from '../models/SkillRating.js';

const normalizeClassName = (value = '') => {
  const match = value.toString().match(/\d+/);
  return match ? match[0] : value.toString().trim();
};

const normalizeSection = (value = '') => {
  const sec = value.trim();
  if (!sec || sec.toUpperCase() === 'N/A') return 'A';
  return sec;
};

export const getTeacherClasses = async (req, res) => {
  try {
    const { role, id, employeeName } = req.user || {};
    if (role !== 'teacher') {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Only teachers can view assigned classes'
      });
    }

    const classes = await Class.find({
      $or: [
        { teacherId: id },
        { teacher: employeeName }
      ]
    }).select('className section subject');

    return res.status(StatusCodes.OK).json({
      success: true,
      data: classes
    });
  } catch (error) {
    console.error('skill getTeacherClasses error:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch classes'
    });
  }
};

export const getClassStudentsWithRatings = async (req, res) => {
  let teacherId;
  let employeeName;
  let classId;
  let role;
  try {
    ({ role, id: teacherId, employeeName } = req.user || {});
    ({ classId } = req.params || {});

    if (!mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid class id'
      });
    }

    if (role !== 'teacher') {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Only teachers can fetch skill ratings'
      });
    }

    const classDoc = await Class.findOne({
      _id: classId,
      $or: [
        { teacherId },
        { teacher: employeeName }
      ]
    });
    if (!classDoc) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'You are not assigned to this class'
      });
    }

    const normalizedSection = normalizeSection(classDoc.section || '');
    const validStudentIds = (classDoc.students || []).filter(id => mongoose.Types.ObjectId.isValid(id));

    let students = [];
    if (validStudentIds.length > 0) {
      students = await Student.find({
        _id: { $in: validStudentIds }
      }).select('studentName rollNumber selectClass section picture');
    }

    if (students.length === 0) {
      const normalizedClass = normalizeClassName(classDoc.className);
      students = await Student.find({
        selectClass: normalizedClass,
        section: { $regex: `^${normalizedSection}$`, $options: 'i' }
      }).select('studentName rollNumber selectClass section picture');
    }

    const ratingsDocs = await SkillRating.find({
      class: classId,
      teacher: teacherId,
      student: { $in: students.map(s => s._id) }
    }).lean();

    const ratingMap = {};
    ratingsDocs.forEach(doc => {
      ratingMap[doc.student.toString()] = Object.fromEntries(doc.ratings || []);
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      data: students.map(stu => ({
        _id: stu._id,
        studentName: stu.studentName,
        rollNumber: stu.rollNumber,
        selectClass: stu.selectClass,
        section: stu.section,
        picture: stu.picture,
        ratings: ratingMap[stu._id.toString()] || {}
      }))
    });
  } catch (error) {
    console.error('getClassStudentsWithSkillRatings error:', {
      classId,
      teacherId,
      employeeName,
      message: error?.message,
      stack: error?.stack
    });
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch students or ratings'
    });
  }
};

export const saveSkillRatings = async (req, res) => {
  let teacherId;
  let employeeName;
  let classId;
  let ratings;
  let role;
  try {
    ({ role, id: teacherId, employeeName } = req.user || {});
    ({ classId, ratings } = req.body || {});

    if (!mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid class id'
      });
    }

    if (role !== 'teacher') {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Only teachers can save skill ratings'
      });
    }

    if (!classId || !Array.isArray(ratings)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'classId and ratings are required'
      });
    }

    const classDoc = await Class.findOne({
      _id: classId,
      $or: [
        { teacherId },
        { teacher: employeeName }
      ]
    });
    if (!classDoc) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'You are not assigned to this class'
      });
    }

    const validStudentIds = (classDoc.students || []).filter(id => mongoose.Types.ObjectId.isValid(id));
    let studentIdsAllowed = new Set(validStudentIds.map(id => id.toString()));

    if (studentIdsAllowed.size === 0) {
      const normalizedClass = normalizeClassName(classDoc.className);
      const normalizedSection = normalizeSection(classDoc.section || '');
      const fallbackStudents = await Student.find({
        selectClass: normalizedClass,
        section: { $regex: `^${normalizedSection}$`, $options: 'i' }
      }).select('_id');
      studentIdsAllowed = new Set(fallbackStudents.map(s => s._id.toString()));
    }

    const bulkOps = ratings
      .filter(r => r.studentId && mongoose.Types.ObjectId.isValid(r.studentId))
      .map(entry => {
        const studentId = entry.studentId;
        if (studentIdsAllowed.size && !studentIdsAllowed.has(studentId)) {
          return null;
        }
        return {
          updateOne: {
            filter: { class: classId, student: studentId, teacher: teacherId },
            update: {
              $set: {
                ratings: entry.ratings || {},
                lastRatedAt: new Date()
              }
            },
            upsert: true
          }
        };
      })
      .filter(Boolean);

    if (bulkOps.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'No valid ratings to save'
      });
    }

    await SkillRating.bulkWrite(bulkOps);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Skill ratings saved successfully'
    });
  } catch (error) {
    console.error('saveSkillRatings error:', {
      classId,
      teacherId,
      employeeName,
      message: error?.message,
      stack: error?.stack
    });
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to save ratings'
    });
  }
};
