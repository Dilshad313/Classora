import mongoose from 'mongoose';
import SubjectAssignment from '../models/SubjectAssignment.js';
import Class from '../models/Class.js';
import Subject from '../models/Subject.js';
import Employee from '../models/Employee.js';
import { StatusCodes } from 'http-status-codes';

/**
 * Get all available classes for dropdown
 * @route GET /api/subjects/list-classes
 */
export const getAvailableClasses = async (req, res) => {
  try {
    console.log('📥 GET /api/subjects/list-classes');
    const userId = req.user.id;
    
    const classes = await Class.find({ 
      createdBy: userId,
      status: { $ne: 'cancelled' }
    })
    .select('className section teacher teacherId subject')
    .populate('teacherId', 'employeeName emailAddress mobileNo')
    .sort({ className: 1, section: 1 });
    
    console.log(`✅ Found ${classes.length} classes for user ${userId}`);

    const missingTeacherNames = Array.from(
      new Set(
        classes
          .filter(cls => !cls.teacherId && cls.teacher && cls.teacher !== 'Unassigned' && cls.teacher !== 'Not assigned')
          .map(cls => cls.teacher)
      )
    );

    const employeesByName = new Map();
    if (missingTeacherNames.length > 0) {
      const employees = await Employee.find({ employeeName: { $in: missingTeacherNames } })
        .select('_id employeeName emailAddress mobileNo');
      employees.forEach(emp => {
        employeesByName.set(emp.employeeName, emp);
      });
    }

    const transformedClasses = classes.map(cls => {
      const fallbackTeacher = (!cls.teacherId && cls.teacher && employeesByName.get(cls.teacher))
        ? employeesByName.get(cls.teacher)
        : null;

      return {
        _id: cls._id,
        name: cls.className,
        section: cls.section,
        teacher: cls.teacher || 'Unassigned',
        teacherId: (cls.teacherId?._id || cls.teacherId) || fallbackTeacher?._id || null,
        teacherDetails: cls.teacherId && typeof cls.teacherId === 'object' ? {
          _id: cls.teacherId._id,
          employeeName: cls.teacherId.employeeName,
          emailAddress: cls.teacherId.emailAddress,
          mobileNo: cls.teacherId.mobileNo
        } : (fallbackTeacher ? {
          _id: fallbackTeacher._id,
          employeeName: fallbackTeacher.employeeName,
          emailAddress: fallbackTeacher.emailAddress,
          mobileNo: fallbackTeacher.mobileNo
        } : null),
        subject: cls.subject || '',
        fullName: `${cls.className} - Section ${cls.section}`,
        studentCount: cls.studentCount || 0
      };
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Classes retrieved successfully',
      count: transformedClasses.length,
      data: transformedClasses
    });
  } catch (error) {
    console.error('❌ Get classes error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch classes: ' + error.message
    });
  }
};

/**
 * Assign subjects to a class with teacher
 * @route POST /api/subjects/assign
 */
export const assignSubjects = async (req, res) => {
  try {
    console.log('📥 POST /api/subjects/assign');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    const userId = req.user.id;
    const { classId, subjects, update } = req.body;

    // Validate required fields
    if (!classId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Class is required'
      });
    }

    if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'At least one subject is required'
      });
    }

    // Validate each subject
    const validationErrors = [];
    const incomingSubjectNames = new Set();
    
    subjects.forEach((subject, index) => {
      if (!subject.subjectName || !subject.subjectName.trim()) {
        validationErrors.push(`Subject ${index + 1}: Name is required`);
      } else {
        const name = subject.subjectName.trim().toLowerCase();
        if (incomingSubjectNames.has(name)) {
          validationErrors.push(`Subject ${index + 1}: Duplicate subject name in request`);
        }
        incomingSubjectNames.add(name);
      }
      
      if (subject.totalMarks === undefined || subject.totalMarks === null || Number.isNaN(Number(subject.totalMarks)) || Number(subject.totalMarks) <= 0) {
        validationErrors.push(`Subject ${index + 1}: Valid total marks are required`);
      }
    });

    if (validationErrors.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Verify class exists and belongs to admin
    const classExists = await Class.findOne({ 
      _id: classId, 
      createdBy: userId 
    });
    
    if (!classExists) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Class not found or you do not have permission'
      });
    }

    // Teacher must be derived from the selected class
    let derivedTeacherId = classExists.teacherId || null;
    if (derivedTeacherId && !mongoose.Types.ObjectId.isValid(derivedTeacherId)) {
      derivedTeacherId = null;
    }

    if (!derivedTeacherId && classExists.teacher && classExists.teacher !== 'Not assigned') {
      const resolvedTeacher = await Employee.findOne({ employeeName: classExists.teacher }).select('_id');
      if (resolvedTeacher) {
        derivedTeacherId = resolvedTeacher._id;
        classExists.teacherId = resolvedTeacher._id;
        await classExists.save();
      }
    }

    if (!derivedTeacherId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Teacher is not assigned to the selected class'
      });
    }

    // Check if assignment already exists for this class
    let assignment = await SubjectAssignment.findOne({ 
      classId, 
      createdBy: userId 
    });

    const formattedSubjects = subjects.map(s => ({
      subjectName: s.subjectName.trim(),
      totalMarks: Number(s.totalMarks),
      isRequired: s.isRequired !== undefined ? s.isRequired : true
    }));

    if (assignment) {
      if (update) {
        // Full update: Replace subjects
        assignment.subjects = formattedSubjects;
        console.log('✅ Subject assignment replaced (update mode)');
      } else {
        // Append mode: Check for subjects that already exist
        const existingNames = new Set(assignment.subjects.map(s => s.subjectName.toLowerCase()));
        const duplicates = formattedSubjects.filter(s => existingNames.has(s.subjectName.toLowerCase()));

        if (duplicates.length > 0) {
          return res.status(StatusCodes.CONFLICT).json({
            success: false,
            message: `Some subjects already exist for this class: ${duplicates.map(d => d.subjectName).join(', ')}`
          });
        }

        assignment.subjects.push(...formattedSubjects);
        console.log('✅ Subject assignment updated (append mode)');
      }
      assignment.teacher = derivedTeacherId;
      await assignment.save();
    } else {
      const assignmentData = {
        classId,
        subjects: formattedSubjects,
        createdBy: userId,
        teacher: derivedTeacherId
      };

      assignment = await SubjectAssignment.create(assignmentData);
      console.log('✅ Subject assignment created with multiple subjects');
    }

    // Populate references
    await assignment.populate([
      { path: 'classId', select: 'className section' },
      { path: 'teacher', select: 'employeeName emailAddress' }
    ]);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Subjects assigned successfully',
      data: assignment
    });
  } catch (error) {
    console.error('❌ Assign subjects error:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Validation failed',
        errors: errors
      });
    }

    if (error.name === 'CastError') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid ID format'
      });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to assign subjects: ' + error.message
    });
  }
};

/**
 * Get classes with their assigned subjects
 * @route GET /api/subjects/classes
 */
export const getClassesWithSubjects = async (req, res) => {
  try {
    console.log('📥 GET /api/subjects/classes');
    
    const { search } = req.query;
    const userId = req.user.id;

    const assignments = await SubjectAssignment.find({ createdBy: userId })
      .populate('classId', 'className section studentCount')
      .populate('teacher', 'employeeName')
      .sort({ updatedAt: -1 });

    let data = assignments
      .map(item => {
        if (!item.classId) return null;
        
        return {
          id: item._id,
          classId: item.classId._id,
          className: `${item.classId.className} - Section ${item.classId.section}`,
          teacher: item.teacher ? item.teacher.employeeName : 'Unassigned',
          studentCount: item.classId.studentCount || 0,
          subjectCount: item.subjects.length,
          totalMarks: item.totalExamMarks,
          subjects: item.subjects,
          academicYear: item.academicYear,
          schedule: 'Mon - Fri'
        };
      })
      .filter(item => item !== null);

    if (search) {
      const searchLower = search.toLowerCase();
      data = data.filter(item => 
        item.className.toLowerCase().includes(searchLower) ||
        item.teacher.toLowerCase().includes(searchLower)
      );
    }

    console.log(`✅ Found ${data.length} classes with subjects`);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Classes with subjects retrieved successfully',
      count: data.length,
      data: data
    });
  } catch (error) {
    console.error('❌ Get classes with subjects error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch classes with subjects'
    });
  }
};

/**
 * Get subjects for a specific class
 * @route GET /api/subjects/by-class/:classId
 */
export const getSubjectsByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const userId = req.user.id;
    
    console.log(`📥 GET /api/subjects/by-class/${classId}`);

    if (!mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid class ID'
      });
    }

    const assignment = await SubjectAssignment.findOne({ 
      classId, 
      createdBy: userId 
    })
    .populate('classId', 'className section')
    .populate('teacher', 'employeeName');

    if (!assignment) {
      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'No subjects assigned to this class yet',
        data: {
          subjects: [],
          classId: classId
        }
      });
    }

    console.log(`✅ Found ${assignment.subjects.length} subjects for class`);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Subjects retrieved successfully',
      data: {
        classId: assignment.classId._id,
        className: `${assignment.classId.className} - ${assignment.classId.section}`,
        teacher: assignment.teacher,
        subjects: assignment.subjects,
        totalMarks: assignment.totalExamMarks,
        academicYear: assignment.academicYear
      }
    });
  } catch (error) {
    console.error('❌ Get subjects by class error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch subjects'
    });
  }
};

/**
 * Get subject statistics
 * @route GET /api/subjects/stats
 */
export const getSubjectStats = async (req, res) => {
  try {
    console.log('📥 GET /api/subjects/stats');
    const userId = req.user.id;
    
    const assignments = await SubjectAssignment.find({ createdBy: userId });
    
    const totalSubjects = assignments.reduce((acc, curr) => acc + curr.subjects.length, 0);
    const totalExamMarks = assignments.reduce((acc, curr) => acc + curr.totalExamMarks, 0);
    const avgMarks = totalSubjects > 0 
      ? Math.round(totalExamMarks / totalSubjects) 
      : 0;

    console.log('✅ Statistics calculated');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Statistics retrieved successfully',
      data: {
        totalClasses: assignments.length,
        totalSubjects,
        totalExamMarks,
        avgMarks
      }
    });
  } catch (error) {
    console.error('❌ Get statistics error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
};

/**
 * Delete a subject assignment
 * @route DELETE /api/subjects/:id
 */
export const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    console.log(`📥 DELETE /api/subjects/${id}`);
    
    const assignment = await SubjectAssignment.findOneAndDelete({ 
      _id: id, 
      createdBy: userId 
    });
    
    if (!assignment) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Subject assignment not found'
      });
    }

    console.log('✅ Subject assignment deleted');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Subject assignment deleted successfully',
      data: assignment
    });
  } catch (error) {
    console.error('❌ Delete assignment error:', error);
    
    if (error.name === 'CastError') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid assignment ID'
      });
    }
    
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete assignment'
    });
  }
};

/**
 * Get all subjects (from Subject model)
 * @route GET /api/subjects/all
 */
export const getAllSubjects = async (req, res) => {
  try {
    console.log('📥 GET /api/subjects/all');
    const userId = req.user.id;
    
    // Get all unique subjects from assignments
    const assignments = await SubjectAssignment.find({ createdBy: userId });
    
    const subjectsSet = new Set();
    const subjectsArray = [];
    
    assignments.forEach(assignment => {
      assignment.subjects.forEach(subject => {
        const subjectKey = subject.subjectName.toLowerCase();
        if (!subjectsSet.has(subjectKey)) {
          subjectsSet.add(subjectKey);
          subjectsArray.push({
            _id: subject._id,
            name: subject.subjectName,
            code: subject.subjectName.toUpperCase().replace(/\s+/g, ''),
            totalMarks: subject.totalMarks
          });
        }
      });
    });
    
    console.log(`✅ Found ${subjectsArray.length} unique subjects`);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Subjects retrieved successfully',
      count: subjectsArray.length,
      data: subjectsArray
    });
  } catch (error) {
    console.error('❌ Get all subjects error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch subjects: ' + error.message
    });
  }
};

/**
 * Create a new subject (standalone)
 * @route POST /api/subjects/create
 */
export const createSubject = async (req, res) => {
  try {
    console.log('📥 POST /api/subjects/create');
    const userId = req.user.id;
    const { name, code, description, department } = req.body;

    if (!name || !code) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Subject name and code are required'
      });
    }

    const subject = await Subject.create({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      description: description?.trim() || '',
      department: department?.trim() || '',
      createdBy: userId
    });

    console.log('✅ Subject created:', subject._id);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Subject created successfully',
      data: subject
    });
  } catch (error) {
    console.error('❌ Create subject error:', error);
    
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
      message: 'Failed to create subject: ' + error.message
    });
  }
};

/**
 * Update a subject
 * @route PUT /api/subjects/update/:id
 */
export const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    console.log(`📥 PUT /api/subjects/update/${id}`);

    const { name, code, description, department } = req.body;

    const subject = await Subject.findOneAndUpdate(
      { _id: id, createdBy: userId },
      {
        name: name?.trim(),
        code: code?.trim().toUpperCase(),
        description: description?.trim(),
        department: department?.trim()
      },
      { new: true, runValidators: true }
    );

    if (!subject) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Subject not found'
      });
    }

    console.log('✅ Subject updated:', subject._id);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Subject updated successfully',
      data: subject
    });
  } catch (error) {
    console.error('❌ Update subject error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to update subject: ' + error.message
    });
  }
};

/**
 * Delete a subject
 * @route DELETE /api/subjects/delete/:id
 */
export const deleteSubjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    console.log(`📥 DELETE /api/subjects/delete/${id}`);

    const subject = await Subject.findOneAndDelete({ _id: id, createdBy: userId });

    if (!subject) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Subject not found'
      });
    }

    console.log('✅ Subject deleted:', id);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Subject deleted successfully',
      data: subject
    });
  } catch (error) {
    console.error('❌ Delete subject error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete subject: ' + error.message
    });
  }
};
