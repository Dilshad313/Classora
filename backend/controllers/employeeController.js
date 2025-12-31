import mongoose from 'mongoose';
import Employee from '../models/Employee.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js';
import { StatusCodes } from 'http-status-codes';

/**
 * Get all employees with filters
 * @route GET /api/employees
 */
export const getAllEmployees = async (req, res) => {
  try {
    const { role, status, search, page = 1, limit = 50 } = req.query;
    
    console.log('📥 GET /api/employees');
    
    const query = {};
    
    if (role) {
      query.employeeRole = { $regex: role, $options: 'i' };
    }
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { employeeName: { $regex: search, $options: 'i' } },
        { emailAddress: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [employees, total, activeCount, inactiveCount] = await Promise.all([
      Employee.find(query)
        .select('-password')
        .sort({ employeeName: 1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Employee.countDocuments(query),
      Employee.countDocuments({ status: 'active' }),
      Employee.countDocuments({ status: 'inactive' })
    ]);
    
    console.log(`✅ Found ${employees.length} employees`);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Employees retrieved successfully',
      count: employees.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: employees,
      stats: {
        total: total,
        active: activeCount,
        inactive: inactiveCount
      }
    });
  } catch (error) {
    console.error('❌ Get employees error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch employees'
    });
  }
};

/**
 * Get employee login credentials
 * @route GET /api/employees/login-credentials
 */
export const getEmployeeLoginCredentials = async (req, res) => {
  try {
    const { department, search } = req.query;
    console.log('📥 GET /api/employees/login-credentials');
    const query = {};
    if (department && department !== 'all') {
      query.department = department;
    }
    if (search) {
      query.$or = [
        { employeeName: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } }
      ];
    }

    const employees = await Employee.find(query).select('+username +password +originalPassword');
    console.log(`✅ Found ${employees.length} employee login credentials`);

    // Transform the data to return original password for display
    const transformedEmployees = employees.map(emp => ({
      ...emp.toObject(),
      password: emp.originalPassword || emp.password // Return original password if available, otherwise encrypted
    }));

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Employee login credentials retrieved successfully',
      data: transformedEmployees,
    });
  } catch (error) {
    console.error('❌ Get employee login credentials error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch employee login credentials',
    });
  }
};

/**
 * Update employee login credentials
 * @route PUT /api/employees/:id/login-credentials
 */
export const updateEmployeeLoginCredentials = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password } = req.body;
    console.log(`📥 PUT /api/employees/${id}/login-credentials`);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid employee ID',
      });
    }

    const employee = await Employee.findById(id).select('+password');
    if (!employee) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Employee not found',
      });
    }

    if (username !== undefined) employee.username = username;
    if (password !== undefined) employee.password = password;

    await employee.save();
    console.log('✅ Employee login credentials updated');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Employee login credentials updated successfully',
      data: employee,
    });
  } catch (error) {
    console.error('❌ Update employee login credentials error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to update employee login credentials',
    });
  }
};


/**
 * Get single employee by ID
 * @route GET /api/employees/:id
 */
export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`📥 GET /api/employees/${id}`);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid employee ID'
      });
    }
    
    const employee = await Employee.findById(id).select('-password');
    
    if (!employee) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Employee not found'
      });
    }
    
    console.log('✅ Employee found:', employee.employeeName);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Employee retrieved successfully',
      data: employee
    });
  } catch (error) {
    console.error('❌ Get employee error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch employee'
    });
  }
};

/**
 * Create new employee
 * @route POST /api/employees
 */
export const createEmployee = async (req, res) => {
  try {
    console.log('📥 POST /api/employees');
    console.log('Body fields:', Object.keys(req.body));
    
    const {
      employeeName,
      mobileNo,
      dateOfJoining,
      employeeRole,
      monthlySalary,
      fatherHusbandName,
      nationalId,
      education,
      gender,
      religion,
      bloodGroup,
      experience,
      emailAddress,
      password,
      dateOfBirth,
      homeAddress,
      department
    } = req.body;

    // Validation
    if (!employeeName?.trim()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Employee name is required'
      });
    }

    if (!emailAddress?.trim()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Email address is required'
      });
    }

    // Check if email already exists (optimized with lean())
    const existingEmployee = await Employee.findOne({ emailAddress: emailAddress.trim() }).lean();
    if (existingEmployee) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: 'Email address already exists'
      });
    }

    if (!password || password.length < 6) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Password is required and must be at least 6 characters'
      });
    }

    if (!mobileNo?.trim()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Mobile number is required'
      });
    }

    if (!dateOfJoining) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Date of joining is required'
      });
    }

    if (!employeeRole?.trim()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Employee role is required'
      });
    }

    if (monthlySalary === undefined || monthlySalary === null) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Monthly salary is required'
      });
    }

    let pictureUrl = null;
    let picturePublicId = null;

    // Handle picture upload if provided
    if (req.file) {
      try {
        console.log('🖼️ Processing picture upload...');
        const uploadResult = await uploadToCloudinary(req.file.buffer, 'employee-pictures');
        pictureUrl = uploadResult.url;
        picturePublicId = uploadResult.publicId;
        console.log('✅ Picture uploaded successfully');
      } catch (uploadError) {
        console.error('❌ Picture upload error:', uploadError);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: `Failed to upload picture: ${uploadError.message}`
        });
      }
    }

    // Create employee data
    const employeeData = {
      employeeName: employeeName.trim(),
      mobileNo: mobileNo.trim(),
      dateOfJoining: new Date(dateOfJoining),
      employeeRole: employeeRole.trim(),
      monthlySalary: parseFloat(monthlySalary),
      fatherHusbandName: fatherHusbandName?.trim() || '',
      nationalId: nationalId?.trim() || '',
      education: education?.trim() || '',
      gender: gender || '',
      religion: religion?.trim() || '',
      bloodGroup: bloodGroup || '',
      experience: experience?.trim() || '',
      emailAddress: emailAddress?.trim(),
      password: password,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      homeAddress: homeAddress?.trim() || '',
      department: department?.trim() || ''
    };

    if (pictureUrl) {
      employeeData.picture = {
        url: pictureUrl,
        publicId: picturePublicId
      };
    }

    const employee = await Employee.create(employeeData);
    
    console.log('✅ Employee created:', employee._id);

    // Return without password (use lean for better performance)
    const employeeResponse = await Employee.findById(employee._id).select('-password').lean();

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Employee created successfully',
      data: employeeResponse
    });
  } catch (error) {
    console.error('❌ Create employee error:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: errors[0] || 'Validation failed',
        errors: errors
      });
    }

    if (error.code === 11000) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: 'Employee with this ID or email already exists'
      });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || 'Failed to create employee'
    });
  }
};

/**
 * Update employee
 * @route PUT /api/employees/:id
 */
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📥 PUT /api/employees/${id}`);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid employee ID'
      });
    }

    const employee = await Employee.findById(id);
    
    if (!employee) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Employee not found'
      });
    }

    const {
      employeeName,
      mobileNo,
      dateOfJoining,
      employeeRole,
      monthlySalary,
      fatherHusbandName,
      nationalId,
      education,
      gender,
      religion,
      bloodGroup,
      experience,
      emailAddress,
      password,
      dateOfBirth,
      homeAddress,
      department,
      status
    } = req.body;

    // Update fields
    if (employeeName) employee.employeeName = employeeName.trim();
    if (mobileNo) employee.mobileNo = mobileNo.trim();
    if (dateOfJoining) employee.dateOfJoining = new Date(dateOfJoining);
    if (employeeRole) employee.employeeRole = employeeRole.trim();
    if (monthlySalary !== undefined) employee.monthlySalary = parseFloat(monthlySalary);
    if (fatherHusbandName !== undefined) employee.fatherHusbandName = fatherHusbandName.trim();
    if (nationalId !== undefined) employee.nationalId = nationalId.trim();
    if (education !== undefined) employee.education = education.trim();
    if (gender !== undefined) employee.gender = gender;
    if (religion !== undefined) employee.religion = religion.trim();
    if (bloodGroup !== undefined) employee.bloodGroup = bloodGroup;
    if (experience !== undefined) employee.experience = experience.trim();
    if (emailAddress !== undefined) employee.emailAddress = emailAddress.trim();
    if (password && password.trim()) employee.password = password; // Will be hashed by pre-save
    if (dateOfBirth !== undefined) employee.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
    if (homeAddress !== undefined) employee.homeAddress = homeAddress.trim();
    if (department !== undefined) employee.department = department.trim();
    if (status) employee.status = status;

    // Handle picture upload if new picture provided
    if (req.file) {
      try {
        console.log('🖼️ Processing picture upload...');
        
        // Delete old picture if exists
        if (employee.picture?.publicId) {
          await deleteFromCloudinary(employee.picture.publicId);
        }

        const uploadResult = await uploadToCloudinary(req.file.buffer, 'employee-pictures');
        employee.picture = {
          url: uploadResult.url,
          publicId: uploadResult.publicId
        };
        
        console.log('✅ Picture uploaded successfully');
      } catch (uploadError) {
        console.error('❌ Picture upload error:', uploadError);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: `Failed to upload picture: ${uploadError.message}`
        });
      }
    }

    await employee.save();
    
    console.log('✅ Employee updated');

    const employeeResponse = await Employee.findById(id).select('-password').lean();

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Employee updated successfully',
      data: employeeResponse
    });
  } catch (error) {
    console.error('❌ Update employee error:', error);

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
      message: 'Failed to update employee'
    });
  }
};

/**
 * Delete employee
 * @route DELETE /api/employees/:id
 */
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`📥 DELETE /api/employees/${id}`);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid employee ID'
      });
    }

    const employee = await Employee.findById(id);
    
    if (!employee) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Delete picture from Cloudinary if exists
    if (employee.picture?.publicId) {
      await deleteFromCloudinary(employee.picture.publicId);
    }

    await Employee.findByIdAndDelete(id);
    
    console.log('✅ Employee deleted:', id);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Employee deleted successfully',
      data: { id }
    });
  } catch (error) {
    console.error('❌ Delete employee error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete employee'
    });
  }
};

/**
 * Bulk delete employees
 * @route POST /api/employees/bulk-delete
 */
export const bulkDeleteEmployees = async (req, res) => {
  try {
    const { ids } = req.body;
    
    console.log('📥 POST /api/employees/bulk-delete');
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Please provide employee IDs to delete'
      });
    }

    const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));
    
    if (validIds.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'No valid employee IDs provided'
      });
    }

    // Get employees to delete pictures
    const employees = await Employee.find({ _id: { $in: validIds } });

    // Delete pictures from Cloudinary
    for (const employee of employees) {
      if (employee.picture?.publicId) {
        await deleteFromCloudinary(employee.picture.publicId);
      }
    }

    const result = await Employee.deleteMany({ _id: { $in: validIds } });
    
    console.log(`✅ Deleted ${result.deletedCount} employees`);

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} employees`,
      data: { deletedCount: result.deletedCount }
    });
  } catch (error) {
    console.error('❌ Bulk delete error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete employees'
    });
  }
};

/**
 * Update employee status
 * @route PATCH /api/employees/:id/status
 */
export const updateEmployeeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    console.log(`📥 PATCH /api/employees/${id}/status`);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid employee ID'
      });
    }

    const validStatuses = ['active', 'inactive'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const employee = await Employee.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).select('-password');
    
    if (!employee) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Employee not found'
      });
    }
    
    console.log('✅ Employee status updated:', status);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Employee status updated successfully',
      data: employee
    });
  } catch (error) {
    console.error('❌ Update status error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to update employee status'
    });
  }
};

/**
 * Get employee statistics
 * @route GET /api/employees/stats/summary
 */
export const getEmployeeStats = async (req, res) => {
  try {
    console.log('📥 GET /api/employees/stats/summary');
    
    const totalEmployees = await Employee.countDocuments();
    const activeEmployees = await Employee.countDocuments({ status: 'active' });
    const teachers = await Employee.countDocuments({ 
      employeeRole: { $regex: /teacher/i } 
    });
    
    // Get role distribution
    const roleDistribution = await Employee.aggregate([
      {
        $group: {
          _id: '$employeeRole',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    console.log('✅ Employee stats retrieved');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Employee statistics retrieved successfully',
      data: {
        totalEmployees,
        activeEmployees,
        teachers,
        roleDistribution
      }
    });
  } catch (error) {
    console.error('❌ Get employee stats error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch employee statistics'
    });
  }
};
