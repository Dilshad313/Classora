import mongoose from 'mongoose';
import Student from '../models/Student.js';
import Class from '../models/Class.js';
import Notification from '../models/Notification.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js';
import { StatusCodes } from 'http-status-codes';

const ownerClauses = (userId, userEmail) => {
  const clauses = [{ createdBy: userId }];
  // Legacy records without createdBy belong to first admin (soft@gmail.com)
  if (userEmail && userEmail.toLowerCase() === 'soft@gmail.com') {
    clauses.push({ createdBy: { $exists: false } });
  }
  return clauses;
};

/**
 * Get all students with filtering and pagination
 * @route GET /api/students
 */
export const getStudents = async (req, res) => {
  try {
    const { id: userId, role, email } = req.user;
    const {
      search,
      class: studentClass,
      status,
      page = 1,
      limit = 10
    } = req.query;

    let baseQuery;

    if (role === 'teacher') {
      // Find all classes taught by this teacher
      const teacherClasses = await Class.find({ teacherId: userId }).select('students');

      // Get a flat, unique list of student IDs from those classes
      const studentIds = teacherClasses.flatMap(cls => cls.students);
      const uniqueStudentIds = [...new Set(studentIds.map(id => id.toString()))];

      if (uniqueStudentIds.length === 0) {
        // If teacher has no students, return empty array
        return res.status(StatusCodes.OK).json({
          success: true,
          message: 'No students found for this teacher',
          data: [],
          pagination: { page: 1, limit: parseInt(limit), total: 0, totalPages: 0 }
        });
      }

      baseQuery = { _id: { $in: uniqueStudentIds } };
    } else {
      // Admin/Superadmin logic
      baseQuery = { $or: ownerClauses(userId, email) };
    }

    const andFilters = [baseQuery];

    if (search) {
      andFilters.push({
        $or: [
          { studentName: { $regex: search, $options: 'i' } },
          { registrationNo: { $regex: search, $options: 'i' } },
          { admissionNumber: { $regex: search, $options: 'i' } }
        ]
      });
    }

    if (studentClass && studentClass !== 'all') {
      andFilters.push({ selectClass: studentClass });
    }

    if (status && status !== 'all') {
      andFilters.push({ status });
    }

    const filter = andFilters.length > 1 ? { $and: andFilters } : baseQuery;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get students with pagination
    const students = await Student.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Student.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Students retrieved successfully',
      data: students,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch students'
    });
  }
};

/**
 * Get single student by ID
 * @route GET /api/students/:id
 */
export const getStudentById = async (req, res) => {
  try {
    const { id: userId, role, email } = req.user;
    const { id: studentId } = req.params;

    let student;

    if (role === 'teacher') {
      // Find classes for the teacher to check if the student is in any of them
      const teacherClasses = await Class.find({ teacherId: userId }).select('students');
      const studentIds = teacherClasses.flatMap(cls => cls.students.map(s => s.toString()));

      if (!studentIds.includes(studentId)) {
        return res.status(StatusCodes.FORBIDDEN).json({
          success: false,
          message: 'You are not authorized to view this student'
        });
      }

      student = await Student.findById(studentId).select('-password');
    } else {
      // Admin/Superadmin logic
      student = await Student.findOne({
        _id: studentId,
        $or: ownerClauses(userId, email)
      }).select('-password');
    }

    if (!student) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Student retrieved successfully',
      data: student
    });
  } catch (error) {
    console.error('Get student error:', error);
    
    if (error.name === 'CastError') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid student ID'
      });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch student'
    });
  }
};

/**
 * Create new student
 * @route POST /api/students
 */
/**
 * Create new student
 * @route POST /api/students
 */
export const createStudent = async (req, res) => {
  try {
    const { id: userId, role } = req.user;

    if (role === 'teacher') {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Teachers are not authorized to create students'
      });
    }
    const {
      studentName,
      registrationNo,
      dateOfAdmission,
      selectClass,
      email,
      password,
      discountInFee,
      mobileNo,
      dateOfBirth,
      gender,
      bloodGroup,
      address,
      fatherName,
      fatherMobile,
      fatherOccupation,
      motherName,
      motherMobile,
      motherOccupation,
      orphanStudent,
      caste,
      osc,
      identificationMark,
      previousSchool,
      religion,
      previousIdBoardRollNo,
      selectFamily,
      disease,
      additionalNote,
      totalSiblings,
      section = 'A'
    } = req.body;

    // Validate required fields
    if (!studentName || !registrationNo || !dateOfAdmission || !selectClass || !email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Student name, registration number, date of admission, class, email, and password are required'
      });
    }

    // Normalize registration number
    const normalizedRegNo = registrationNo.trim().toUpperCase();
    
    // Validate registration number is not empty after normalization
    if (!normalizedRegNo) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Registration number cannot be empty'
      });
    }

    // Check if registration number already exists
    // Only check registrationNo field, not admissionNumber, as they serve different purposes
    const existingStudent = await Student.findOne({ 
      registrationNo: normalizedRegNo,
      $or: ownerClauses(userId, req.user?.email)
    });
    
    if (existingStudent) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: 'Registration number already exists'
      });
    }

    // Generate admission number (function handles uniqueness internally)
    const admissionNumber = await Student.generateAdmissionNumber();

    // Handle picture upload
    let pictureData = null;
    if (req.files && req.files.picture) {
      try {
        const uploadResult = await uploadToCloudinary(
          req.files.picture[0].buffer,
          'student-photos'
        );
        pictureData = {
          url: uploadResult.url,
          publicId: uploadResult.publicId
        };
      } catch (uploadError) {
        console.error('Picture upload error:', uploadError);
        // Continue without picture if upload fails
      }
    }

    // Handle documents upload
    const documents = [];
    if (req.files && req.files.documents) {
      for (const file of req.files.documents) {
        try {
          const uploadResult = await uploadToCloudinary(
            file.buffer,
            'student-documents'
          );
          documents.push({
            name: file.originalname,
            url: uploadResult.url,
            publicId: uploadResult.publicId
          });
        } catch (uploadError) {
          console.error('Document upload error:', uploadError);
          // Continue if single document upload fails
        }
      }
    }

    // Generate username
    const nameParts = studentName.toLowerCase().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1].charAt(0) : '';
    let username = `${firstName}${lastName}${normalizedRegNo.toLowerCase()}`.replace(/\s+/g, '');

    // Check if username already exists
    const existingUsername = await Student.findOne({ username, $or: ownerClauses(userId, req.user?.email) });
    if (existingUsername) {
      // If username exists, append random number
      const randomSuffix = Math.floor(Math.random() * 1000);
      username = `${firstName}${lastName}${normalizedRegNo.toLowerCase()}${randomSuffix}`.replace(/\s+/g, '');
    }

    // Create student
    const student = await Student.create({
      studentName: studentName.trim(),
      registrationNo: normalizedRegNo,
      admissionNumber,
      dateOfAdmission,
      selectClass,
      email: email.trim(),
      password: password,
      plainPassword: password,
      section,
      discountInFee: parseFloat(discountInFee) || 0,
      mobileNo: mobileNo || '',
      dateOfBirth: dateOfBirth || null,
      gender: gender || '',
      bloodGroup: bloodGroup || '',
      address: address || '',
      fatherName: fatherName || '',
      fatherMobile: fatherMobile || '',
      fatherOccupation: fatherOccupation || '',
      motherName: motherName || '',
      motherMobile: motherMobile || '',
      motherOccupation: motherOccupation || '',
      orphanStudent: orphanStudent || '',
      caste: caste || '',
      osc: osc || '',
      identificationMark: identificationMark || '',
      previousSchool: previousSchool || '',
      religion: religion || '',
      previousIdBoardRollNo: previousIdBoardRollNo || '',
      selectFamily: selectFamily || '',
      disease: disease || '',
      additionalNote: additionalNote || '',
      totalSiblings: parseInt(totalSiblings) || 0,
      picture: pictureData,
      documents,
      username,
      rollNumber: `${Math.floor(Math.random() * 300) + 1}/236`,
      createdBy: userId
    });

    // Create notification
    try {
      await Notification.create({
        title: 'Student added',
        message: `Student "${student.studentName}" was added successfully to class ${student.selectClass}${student.section ? ` - Section ${student.section}` : ''}.`,
        type: 'success',
        priority: 'medium',
        category: 'academic',
        targetType: 'all',
        sender: req.user.id,
        senderName: req.user.name || 'Admin',
        senderRole: 'Admin',
        createdBy: req.user.id,
        status: 'sent',
        isActive: true,
        totalRecipients: 0,
        deliveredCount: 0,
        readCount: 0
      });
    } catch (notifyErr) {
      console.error('❌ Failed to create notification for new student:', notifyErr);
    }

    // Return student without password
    const studentResponse = student.toObject();
    delete studentResponse.password;

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Student created successfully',
      data: studentResponse
    });
  } catch (error) {
    console.error('Create student error:', error);

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      let message = `${field} already exists`;
      
      // Customize error messages for specific fields
      if (field === 'registrationNo') {
        message = 'Registration number already exists';
      } else if (field === 'admissionNumber') {
        message = 'Admission number already exists';
      } else if (field === 'username') {
        message = 'Username already exists';
      }
      
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message
      });
    }

    // Handle validation errors
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
      message: 'Failed to create student'
    });
  }
};

/**
 * Update student
 * @route PUT /api/students/:id
 */
export const updateStudent = async (req, res) => {
  try {
    if (req.user.role === 'teacher') {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Teachers are not authorized to update students'
      });
    }

    const student = await Student.findOne({
      _id: req.params.id,
      $or: ownerClauses(req.user.id, req.user?.email)
    });
    
    if (!student) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Handle picture upload if new picture provided
    if (req.files && req.files.picture) {
      try {
        // Delete old picture if exists
        if (student.picture && student.picture.publicId) {
          await deleteFromCloudinary(student.picture.publicId);
        }

        // Upload new picture
        const uploadResult = await uploadToCloudinary(
          req.files.picture[0].buffer,
          'student-photos'
        );
        student.picture = {
          url: uploadResult.url,
          publicId: uploadResult.publicId
        };
      } catch (uploadError) {
        console.error('Picture upload error:', uploadError);
      }
    }

    // Handle additional documents upload
    if (req.files && req.files.documents) {
      for (const file of req.files.documents) {
        try {
          const uploadResult = await uploadToCloudinary(
            file.buffer,
            'student-documents'
          );
          student.documents.push({
            name: file.originalname,
            url: uploadResult.url,
            publicId: uploadResult.publicId
          });
        } catch (uploadError) {
          console.error('Document upload error:', uploadError);
        }
      }
    }

    // Update other fields
    const updateFields = [
      'studentName', 'mobileNo', 'dateOfBirth', 'gender', 'bloodGroup', 'address',
      'fatherName', 'fatherMobile', 'fatherOccupation', 'motherName', 'motherMobile',
      'motherOccupation', 'orphanStudent', 'caste', 'osc', 'identificationMark',
      'previousSchool', 'religion', 'previousIdBoardRollNo', 'selectFamily',
      'disease', 'additionalNote', 'totalSiblings', 'section', 'discountInFee', 'email'
    ];

    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'discountInFee' || field === 'totalSiblings') {
          student[field] = parseFloat(req.body[field]) || 0;
        } else {
          student[field] = req.body[field];
        }
      }
    });

    // Handle password update separately
    if (req.body.password) {
      // Don't hash here - the pre-save hook handles it
      // If we hash here, the pre-save hook will hash the hash!
      student.password = req.body.password;
      student.plainPassword = req.body.password;
    }

    await student.save();

    const studentResponse = student.toObject();
    delete studentResponse.password;

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Student updated successfully',
      data: studentResponse
    });
  } catch (error) {
    console.error('Update student error:', error);

    if (error.name === 'CastError') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid student ID'
      });
    }

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
      message: 'Failed to update student'
    });
  }
};

/**
 * Delete student
 * @route DELETE /api/students/:id
 */
export const deleteStudent = async (req, res) => {
  try {
    if (req.user.role === 'teacher') {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Teachers are not authorized to delete students'
      });
    }

    const student = await Student.findOne({ _id: req.params.id, createdBy: req.user.id });

    if (!student) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Delete picture from Cloudinary
    if (student.picture && student.picture.publicId) {
      await deleteFromCloudinary(student.picture.publicId);
    }

    // Delete documents from Cloudinary
    if (student.documents && student.documents.length > 0) {
      for (const doc of student.documents) {
        if (doc.publicId) {
          await deleteFromCloudinary(doc.publicId);
        }
      }
    }

    await Student.deleteOne({ _id: req.params.id, createdBy: req.user.id });

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error('Delete student error:', error);

    if (error.name === 'CastError') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid student ID'
      });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete student'
    });
  }
};

/**
 * Update student status (active/inactive)
 * @route PATCH /api/students/:id/status
 */
export const updateStudentStatus = async (req, res) => {
  try {
    if (req.user.role === 'teacher') {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Teachers are not authorized to update student status'
      });
    }

    const { status } = req.body;
    const userId = req.user.id;

    if (!status || !['active', 'inactive'].includes(status)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Valid status (active/inactive) is required'
      });
    }

    const student = await Student.findOneAndUpdate(
      { _id: req.params.id, $or: ownerClauses(userId, req.user?.email) },
      { 
        status,
        lastActive: status === 'active' ? new Date() : undefined
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!student) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Student status updated to ${status}`,
      data: student
    });
  } catch (error) {
    console.error('Update student status error:', error);

    if (error.name === 'CastError') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid student ID'
      });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to update student status'
    });
  }
};

/**
 * Get student admission letter
 * @route GET /api/students/:id/admission-letter
 */
export const getAdmissionLetter = async (req, res) => {
  try {
    const student = await Student.findOne({
      _id: req.params.id,
      $or: ownerClauses(req.user.id, req.user?.email)
    }).select('-password');

    if (!student) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Format admission letter data
    const admissionLetter = {
      student: {
        name: student.studentName,
        studentId: student.registrationNo,
        admissionNumber: student.admissionNumber,
        class: student.classDisplay,
        rollNumber: student.rollNumber,
        dateOfBirth: student.dateOfBirth,
        admissionDate: student.dateOfAdmission,
        bloodGroup: student.bloodGroup,
        previousSchool: student.previousSchool,
        address: student.address
      },
      guardian: {
        fatherName: student.fatherName,
        fatherMobile: student.fatherMobile,
        motherName: student.motherName,
        motherMobile: student.motherMobile
      },
      issuedDate: new Date().toISOString()
    };

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Admission letter retrieved successfully',
      data: admissionLetter
    });
  } catch (error) {
    console.error('Get admission letter error:', error);

    if (error.name === 'CastError') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid student ID'
      });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to generate admission letter'
    });
  }
};

/**
 * Get student login credentials
 * @route GET /api/students/login-credentials
 */
export const getLoginCredentials = async (req, res) => {
  try {
    const userId = req.user.id;
    const { class: studentClass, search } = req.query;

    const ownerFilter = { $or: ownerClauses(userId, req.user?.email) };
    const andFilters = [ownerFilter];
    if (studentClass && studentClass !== 'all') {
      andFilters.push({ selectClass: studentClass });
    }

    if (search) {
      andFilters.push({
        $or: [
          { studentName: { $regex: search, $options: 'i' } },
          { registrationNo: { $regex: search, $options: 'i' } }
        ]
      });
    }

    const filter = andFilters.length > 1 ? { $and: andFilters } : ownerFilter;

    const students = await Student.find(filter)
      .select('studentName registrationNo selectClass section username password plainPassword email')
      .sort({ selectClass: 1, studentName: 1 });

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Login credentials retrieved successfully',
      data: students
    });
  } catch (error) {
    console.error('Get login credentials error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch login credentials'
    });
  }
};

/**
 * Update student login credentials
 * @route PUT /api/students/:id/login-credentials
 */
export const updateLoginCredentials = async (req, res) => {
  try {
    if (req.user.role === 'teacher') {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Teachers are not authorized to update login credentials'
      });
    }

    const userId = req.user.id;
    const { username, password } = req.body;

    const updateData = {};
    if (username) updateData.username = username.trim().toLowerCase();
    if (password) {
      // Hash the password before saving
      const salt = await bcrypt.genSalt(12);
      updateData.password = await bcrypt.hash(password, salt);
      updateData.plainPassword = password;
    }

    const student = await Student.findOneAndUpdate(
      { _id: req.params.id, $or: ownerClauses(userId, req.user?.email) },
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!student) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Login credentials updated successfully',
      data: student
    });
  } catch (error) {
    console.error('Update login credentials error:', error);

    if (error.name === 'CastError') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid student ID'
      });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to update login credentials'
    });
  }
};

/**
 * Promote students to next class
 * @route POST /api/students/promote
 */
export const promoteStudents = async (req, res) => {
  try {
    if (req.user.role === 'teacher') {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Teachers are not authorized to promote students'
      });
    }

    const userId = req.user.id;
    const { studentIds, promoteToClass } = req.body;

    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Student IDs array is required'
      });
    }

    if (!promoteToClass) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Promote to class is required'
      });
    }

    // Check if promoteToClass is provided (already checked above)
    if (!promoteToClass) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Promote to class is required'
        });
      }

    // Update students
    const result = await Student.updateMany(
      { _id: { $in: studentIds }, createdBy: userId },
      { 
        selectClass: promoteToClass,
        // Reset section to default when promoting
        section: 'A'
      }
    );

    res.status(StatusCodes.OK).json({
      success: true,
      message: `${result.modifiedCount} students promoted to ${promoteToClass} successfully`,
      data: {
        promotedCount: result.modifiedCount
      }
    });
  } catch (error) {
    console.error('Promote students error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to promote students'
    });
  }
};

/**
 * Get students basic list for printing
 * @route GET /api/students/print/basic-list
 */
export const getBasicList = async (req, res) => {
  try {
    const userId = req.user.id;
    const { class: studentClass } = req.query;

    const ownerFilter = { $or: ownerClauses(userId, req.user?.email) };
    const andFilters = [ownerFilter];
    if (studentClass && studentClass !== 'all') {
      andFilters.push({ selectClass: studentClass });
    }
    const filter = andFilters.length > 1 ? { $and: andFilters } : ownerFilter;

    const students = await Student.find(filter)
      .select('studentName registrationNo fatherName selectClass section feeRemaining mobileNo')
      .sort({ selectClass: 1, studentName: 1 });

    // Calculate totals
    const totalStudents = students.length;
    const totalFeeRemaining = students.reduce((sum, student) => sum + (student.feeRemaining || 0), 0);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Basic list retrieved successfully',
      data: {
        students,
        summary: {
          totalStudents,
          totalFeeRemaining
        }
      }
    });
  } catch (error) {
    console.error('Get basic list error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch basic list'
    });
  }
};

/**
 * Get student statistics
 * @route GET /api/students/stats
 */
export const getStudentStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const ownerMatch = { $or: ownerClauses(userId, req.user?.email) };
    const total = await Student.countDocuments(ownerMatch);
    const active = await Student.countDocuments({ status: 'active', ...ownerMatch });
    const inactive = await Student.countDocuments({ status: 'inactive', ...ownerMatch });
    
    // Calculate average attendance
    const avgAttendanceResult = await Student.aggregate([
      { $match: { ...ownerMatch, createdBy: { $exists: true } } },
      {
        $group: {
          _id: null,
          avgAttendance: { $avg: '$attendance' }
        }
      }
    ]);

    const avgAttendance = avgAttendanceResult.length > 0 
      ? Math.round(avgAttendanceResult[0].avgAttendance) 
      : 0;

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Student statistics retrieved successfully',
      data: {
        total,
        active,
        inactive,
        avgAttendance
      }
    });
  } catch (error) {
    console.error('Get student stats error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch student statistics'
    });
  }
};

/**
 * Bulk update student status
 * @route PATCH /api/students/bulk-status
 */
export const bulkUpdateStudentStatus = async (req, res) => {
  try {
    if (req.user.role === 'teacher') {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Teachers are not authorized to bulk update student status'
      });
    }

    const { studentIds, status } = req.body;
    const userId = req.user.id;

    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Student IDs array is required'
      });
    }

    if (!status || !['active', 'inactive'].includes(status)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Valid status (active/inactive) is required'
      });
    }

    // Update students
    const updateData = { status };
    if (status === 'active') {
      updateData.lastActive = new Date();
    }

    const result = await Student.updateMany(
      { _id: { $in: studentIds }, $or: ownerClauses(userId, req.user?.email) },
      updateData
    );

    res.status(StatusCodes.OK).json({
      success: true,
      message: `${result.modifiedCount} students status updated to ${status} successfully`,
      data: {
        updatedCount: result.modifiedCount
      }
    });
  } catch (error) {
    console.error('Bulk update student status error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to update student status'
    });
  }
};