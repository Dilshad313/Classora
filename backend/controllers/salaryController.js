import Salary from '../models/Salary.js';
import Employee from '../models/Employee.js';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

// Pay salary to employee
export const paySalary = async (req, res) => {
  try {
    const { 
      employeeId, 
      month, 
      salaryDate, 
      fixedSalary, 
      bonus = 0, 
      deduction = 0,
      paymentMethod = 'bank_transfer',
      bankTransactionId,
      remarks 
    } = req.body;

    // Validate required fields
    if (!employeeId || !month || !salaryDate || !fixedSalary) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Employee ID, month, salary date, and fixed salary are required'
      });
    }

    // Check if employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Check if salary already paid for this month
    const existingSalary = await Salary.findOne({ 
      employee: employeeId, 
      month 
    });

    if (existingSalary) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: `Salary already paid for ${month}`
      });
    }

    // Generate receipt number
    const receiptNo = Salary.generateReceiptNo();

    // Calculate net salary
    const netSalary = Number(fixedSalary) + Number(bonus) - Number(deduction);

    // Create salary record
    const salary = await Salary.create({
      employee: employeeId,
      month,
      salaryDate: new Date(salaryDate),
      fixedSalary: Number(fixedSalary),
      bonus: Number(bonus),
      deduction: Number(deduction),
      netSalary,
      receiptNo,
      paymentMethod,
      bankTransactionId,
      remarks,
      paidBy: req.user.id,
      status: 'paid'
    });

    // Populate employee details
    await salary.populate({
      path: 'employee',
      select: 'employeeId employeeName employeeRole department picture emailAddress mobileNo dateOfJoining'
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Salary paid successfully',
      data: salary
    });

  } catch (error) {
    console.error('Pay salary error:', error);
    
    if (error.code === 11000) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: 'Receipt number already exists. Please try again.'
      });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to process salary payment'
    });
  }
};

// Get salary slip by ID
export const getSalarySlip = async (req, res) => {
  try {
    const salary = await Salary.findById(req.params.id)
      .populate({
        path: 'employee',
        select: 'employeeId employeeName employeeRole department picture emailAddress mobileNo dateOfJoining homeAddress'
      })
      .populate({
        path: 'paidBy',
        select: 'name email'
      });

    if (!salary) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Salary slip not found'
      });
    }

    // Format salary slip data
    const salarySlip = {
      receiptNo: salary.receiptNo,
      employee: {
        id: salary.employee._id,
        employeeId: salary.employee.employeeId,
        name: salary.employee.employeeName,
        role: salary.employee.employeeRole,
        department: salary.employee.department,
        email: salary.employee.emailAddress,
        phone: salary.employee.mobileNo,
        address: salary.employee.homeAddress,
        joiningDate: salary.employee.dateOfJoining,
        picture: salary.employee.picture?.url || null
      },
      month: salary.month,
      salaryDate: salary.salaryDate,
      fixedSalary: salary.fixedSalary,
      bonus: salary.bonus,
      deduction: salary.deduction,
      netSalary: salary.netSalary,
      paymentMethod: salary.paymentMethod,
      bankTransactionId: salary.bankTransactionId,
      status: salary.status,
      paidBy: salary.paidBy?.name || 'System',
      remarks: salary.remarks,
      paymentDate: salary.createdAt,
      issuedDate: salary.updatedAt
    };

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Salary slip retrieved successfully',
      data: salarySlip
    });

  } catch (error) {
    console.error('Get salary slip error:', error);
    
    if (error.name === 'CastError') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid salary slip ID'
      });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch salary slip'
    });
  }
};

// Get salary report with analytics
export const getSalaryReport = async (req, res) => {
  try {
    const { year, month, department } = req.query;
    
    // Build match stage for aggregation
    const matchStage = {};
    
    if (year) {
      matchStage.month = { $regex: `^${year}` };
    }
    
    if (month) {
      matchStage.month = month;
    }

    // Get total employees count first
    const totalEmployees = await Employee.countDocuments({ status: 'active' });

    // Get salary statistics
    const salaryStats = await Salary.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalPaid: { $sum: '$netSalary' },
          totalFixed: { $sum: '$fixedSalary' },
          totalBonus: { $sum: '$bonus' },
          totalDeduction: { $sum: '$deduction' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Get monthly trend
    const monthlyTrend = await Salary.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$month',
          paid: { $sum: '$netSalary' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get department-wise salary
    const departmentWise = await Salary.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: 'employees',
          localField: 'employee',
          foreignField: '_id',
          as: 'employee'
        }
      },
      { $unwind: '$employee' },
      {
        $group: {
          _id: '$employee.department',
          paid: { $sum: '$netSalary' },
          employees: { $sum: 1 },
          avgSalary: { $avg: '$netSalary' }
        }
      },
      {
        $project: {
          _id: 0,
          department: '$_id',
          paid: 1,
          employees: 1,
          avgSalary: 1,
          pending: {
            $multiply: [
              { $subtract: [totalEmployees, '$employees'] },
              30000
            ]
          },
          percentage: {
            $cond: [
              { $eq: ['$employees', 0] },
              0,
              {
                $min: [
                  100,
                  {
                    $multiply: [
                      { $divide: ['$paid', { $multiply: ['$employees', 30000] }] },
                      100
                    ]
                  }
                ]
              }
            ]
          }
        }
      },
      { $sort: { paid: -1 } }
    ]);

    // Get pending salaries (employees without salary for current month)
    const currentMonth = new Date().toISOString().slice(0, 7);
    const employees = await Employee.find({ status: 'active' });
    
    const pendingSalaries = [];
    for (const employee of employees) {
      const salaryPaid = await Salary.findOne({ 
        employee: employee._id, 
        month: currentMonth 
      });
      
      if (!salaryPaid) {
        pendingSalaries.push({
          id: employee._id,
          employeeId: employee.employeeId,
          name: employee.employeeName,
          role: employee.employeeRole,
          department: employee.department,
          monthlySalary: employee.monthlySalary,
          dueDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 10) // 10th of next month
        });
      }
    }

    // Get recent payments
    const recentPayments = await Salary.find(matchStage)
      .populate({
        path: 'employee',
        select: 'employeeName employeeRole'
      })
      .sort({ createdAt: -1 })
      .limit(5);

    const stats = salaryStats[0] || {
      totalPaid: 0,
      totalFixed: 0,
      totalBonus: 0,
      totalDeduction: 0,
      count: 0
    };

    const paidEmployees = stats.count;
    const pendingEmployees = totalEmployees - paidEmployees;
    const paymentRate = totalEmployees > 0 ? Math.round((paidEmployees / totalEmployees) * 100) : 0;
    const averageSalary = paidEmployees > 0 ? stats.totalPaid / paidEmployees : 0;

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Salary report retrieved successfully',
      data: {
        summary: {
          totalPaid: stats.totalPaid,
          totalPending: pendingEmployees * 30000, // Estimated pending
          totalEmployees,
          paidEmployees,
          pendingEmployees,
          averageSalary: Math.round(averageSalary),
          paymentRate
        },
        monthlyTrend,
        departmentWise,
        recentPayments,
        pendingSalaries
      }
    });

  } catch (error) {
    console.error('Get salary report error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to generate salary report'
    });
  }
};

// Get salary sheet with filters
export const getSalarySheet = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      month, 
      department, 
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = {};
    
    if (month) {
      query.month = month;
    }
    
    if (status) {
      query.status = status;
    }

    // Handle search
    if (search) {
      // Find employees matching search
      const employees = await Employee.find({
        $or: [
          { employeeName: { $regex: search, $options: 'i' } },
          { employeeId: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');
      
      const employeeIds = employees.map(emp => emp._id);
      query.employee = { $in: employeeIds };
    }

    // Handle department filter
    if (department) {
      const employees = await Employee.find({ department }).select('_id');
      const employeeIds = employees.map(emp => emp._id);
      
      if (query.employee) {
        query.employee.$in = query.employee.$in.filter(id => 
          employeeIds.includes(id)
        );
      } else {
        query.employee = { $in: employeeIds };
      }
    }

    // Pagination options
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 },
      populate: {
        path: 'employee',
        select: 'employeeId employeeName employeeRole department monthlySalary'
      }
    };

    // Get paginated salaries
    const salaries = await Salary.paginate(query, options);

    // Calculate totals
    const totals = await Salary.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalFixed: { $sum: '$fixedSalary' },
          totalBonus: { $sum: '$bonus' },
          totalDeduction: { $sum: '$deduction' },
          totalNet: { $sum: '$netSalary' }
        }
      }
    ]);

    const totalStats = totals[0] || {
      totalFixed: 0,
      totalBonus: 0,
      totalDeduction: 0,
      totalNet: 0
    };

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Salary sheet retrieved successfully',
      data: {
        salaries: salaries.docs,
        pagination: {
          total: salaries.totalDocs,
          pages: salaries.totalPages,
          page: salaries.page,
          limit: salaries.limit,
          hasNext: salaries.hasNextPage,
          hasPrev: salaries.hasPrevPage
        },
        totals: totalStats
      }
    });

  } catch (error) {
    console.error('Get salary sheet error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch salary sheet'
    });
  }
};

// Get employees for salary payment (search)
export const getEmployeesForSalary = async (req, res) => {
  try {
    const { search } = req.query;

    let query = { status: 'active' };
    
    if (search) {
      query = {
        $and: [
          { status: 'active' },
          {
            $or: [
              { employeeName: { $regex: search, $options: 'i' } },
              { employeeId: { $regex: search, $options: 'i' } },
              { employeeRole: { $regex: search, $options: 'i' } }
            ]
          }
        ]
      };
    }

    const employees = await Employee.find(query)
      .select('employeeId employeeName employeeRole department monthlySalary picture emailAddress mobileNo')
      .limit(10);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Employees retrieved successfully',
      data: employees
    });

  } catch (error) {
    console.error('Get employees for salary error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch employees'
    });
  }
};

// Update salary status
export const updateSalaryStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;

    const salary = await Salary.findById(req.params.id);
    
    if (!salary) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Salary record not found'
      });
    }

    salary.status = status || salary.status;
    salary.remarks = remarks || salary.remarks;
    
    await salary.save();

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Salary status updated successfully',
      data: salary
    });

  } catch (error) {
    console.error('Update salary status error:', error);
    
    if (error.name === 'CastError') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid salary ID'
      });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to update salary status'
    });
  }
};

// Delete salary record
export const deleteSalary = async (req, res) => {
  try {
    const salary = await Salary.findById(req.params.id);
    
    if (!salary) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Salary record not found'
      });
    }

    await salary.deleteOne();

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Salary record deleted successfully'
    });

  } catch (error) {
    console.error('Delete salary error:', error);
    
    if (error.name === 'CastError') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid salary ID'
      });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete salary record'
    });
  }
};