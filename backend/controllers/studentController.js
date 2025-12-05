import Student from '../models/Student.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js';
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcryptjs';

/**
 * Get all students with filtering and pagination
 * @route GET /api/students
 */
export const getStudents = async (req, res) => {
  try {
    const {
      search,
      class: studentClass,
      status,
      page = 1,
      limit = 10
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (search) {
      filter.$or = [
        { studentName: { $regex: search, $options: 'i' } },
        { registrationNo: { $regex: search, $options: 'i' } },
        { admissionNumber: { $regex: search, $options: 'i' } }
      ];
    }

    if (studentClass && studentClass !== 'all') {
      filter.selectClass = studentClass;
    }

    if (status && status !== 'all') {
      filter.status = status;
    }

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
    const student = await Student.findById(req.params.id).select('-password');

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
    const {
      studentName,
      registrationNo,
      dateOfAdmission,
      selectClass,
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
    if (!studentName || !registrationNo || !dateOfAdmission || !selectClass) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Student name, registration number, date of admission, and class are required'
      });
    }

    // Check if registration number already exists
    const existingStudent = await Student.findOne({ 
      $or: [
        { registrationNo: registrationNo.trim().toUpperCase() },
        { admissionNumber: registrationNo.trim().toUpperCase() }
      ]
    });
    
    if (existingStudent) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: 'Registration number already exists'
      });
    }

    // Generate admission number
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

    // Generate username and password
    const nameParts = studentName.toLowerCase().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1].charAt(0) : '';
    const username = `${firstName}${lastName}${registrationNo.toLowerCase()}`.replace(/\s+/g, '');
    
    // Check if username already exists
    const existingUsername = await Student.findOne({ username });
    if (existingUsername) {
      // If username exists, append random number
      const randomSuffix = Math.floor(Math.random() * 1000);
      username = `${firstName}${lastName}${registrationNo.toLowerCase()}${randomSuffix}`.replace(/\s+/g, '');
    }

    const password = `${studentName.split(' ')[0]}@${new Date().getFullYear()}`;

    // Create student
    const student = await Student.create({
      studentName: studentName.trim(),
      registrationNo: registrationNo.trim().toUpperCase(),
      admissionNumber,
      dateOfAdmission,
      selectClass,
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
      password,
      rollNumber: `${Math.floor(Math.random() * 300) + 1}/236`
    });

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
    const student = await Student.findById(req.params.id);
    
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
      'disease', 'additionalNote', 'totalSiblings', 'section', 'discountInFee'
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
    const student = await Student.findById(req.params.id);

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

    await Student.findByIdAndDelete(req.params.id);

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
    const { status } = req.body;

    if (!status || !['active', 'inactive'].includes(status)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Valid status (active/inactive) is required'
      });
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
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
    const student = await Student.findById(req.params.id).select('-password');

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
    const { class: studentClass, search } = req.query;

    const filter = {};
    if (studentClass && studentClass !== 'all') {
      filter.selectClass = studentClass;
    }

    if (search) {
      filter.$or = [
        { studentName: { $regex: search, $options: 'i' } },
        { registrationNo: { $regex: search, $options: 'i' } }
      ];
    }

    const students = await Student.find(filter)
      .select('studentName registrationNo selectClass section username password')
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
    const { username, password } = req.body;

    const updateData = {};
    if (username) updateData.username = username.trim().toLowerCase();
    if (password) updateData.password = password;

    const student = await Student.findByIdAndUpdate(
      req.params.id,
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

    // Validate class
    const validClasses = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    if (!validClasses.includes(promoteToClass)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid class for promotion'
      });
    }

    // Update students
    const result = await Student.updateMany(
      { _id: { $in: studentIds } },
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
    const { class: studentClass } = req.query;

    const filter = {};
    if (studentClass && studentClass !== 'all') {
      filter.selectClass = studentClass;
    }

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
    const total = await Student.countDocuments();
    const active = await Student.countDocuments({ status: 'active' });
    const inactive = await Student.countDocuments({ status: 'inactive' });
    
    // Calculate average attendance
    const avgAttendanceResult = await Student.aggregate([
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