import FeePayment from '../models/Fees.js';
import Student from '../models/Student.js';
import { StatusCodes } from 'http-status-codes';

// Collect fees for a student
export const collectFees = async (req, res) => {
  try {
    const {
      studentId,
      studentName,
      registrationNo,
      class: studentClass,
      guardianName,
      amount,
      paymentDate,
      feeMonth,
      depositType,
      particulars
    } = req.body;

    // Validate required fields
    if (!studentId || !studentName || !registrationNo || !studentClass || 
        !guardianName || amount === undefined || amount === null || !paymentDate || !feeMonth || !depositType) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Generate receipt number
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const count = await FeePayment.countDocuments();
    const receiptNo = `REC${year}${month}${String(count + 1).padStart(4, '0')}`;

    // Create fee payment
    const feePayment = await FeePayment.create({
      studentId,
      studentName,
      registrationNo,
      class: studentClass,
      guardianName,
      amount,
      paymentDate,
      feeMonth,
      depositType,
      particulars: particulars || [],
      receiptNo
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Fees collected successfully',
      data: feePayment
    });
  } catch (error) {
    console.error('Collect fees error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to collect fees'
    });
  }
};

// Get all fee payments with filters
export const getFeePayments = async (req, res) => {
  try {
    const {
      search,
      class: studentClass,
      paymentMethod,
      month,
      page = 1,
      limit = 10
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (search) {
      filter.$or = [
        { studentName: { $regex: search, $options: 'i' } },
        { registrationNo: { $regex: search, $options: 'i' } },
        { receiptNo: { $regex: search, $options: 'i' } }
      ];
    }

    if (studentClass && studentClass !== 'all') {
      filter.class = studentClass;
    }

    if (paymentMethod && paymentMethod !== 'all') {
      filter.depositType = paymentMethod;
    }

    if (month) {
      const startDate = new Date(month);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
      
      filter.feeMonth = {
        $gte: startDate,
        $lt: endDate
      };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get payments with pagination
    const payments = await FeePayment.find(filter)
      .sort({ paymentDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await FeePayment.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    // Calculate statistics
    const totalAmount = await FeePayment.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Fee payments retrieved successfully',
      data: payments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages
      },
      stats: {
        totalRecords: total,
        totalCollected: totalAmount[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Get fee payments error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch fee payments'
    });
  }
};

// Get fees defaulters
export const getFeesDefaulters = async (req, res) => {
  try {
    const { month, search } = req.query;

    if (!month) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Month is required'
      });
    }

    const startDate = new Date(month);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    // Get all students
    const allStudents = await Student.find({ status: 'active' }).select('-password');
    
    // Get students who have paid for this month
    const paidStudents = await FeePayment.find({
      feeMonth: {
        $gte: startDate,
        $lt: endDate
      }
    }).distinct('studentId');

    // Find defaulters (students not in paidStudents list)
    let defaulters = allStudents.filter(student => 
      !paidStudents.some(id => id.toString() === student._id.toString())
    );

    // Apply search filter if provided
    if (search) {
      const query = search.toLowerCase();
      defaulters = defaulters.filter(defaulter => 
        defaulter.studentName.toLowerCase().includes(query) ||
        defaulter.registrationNo.toLowerCase().includes(query) ||
        defaulter.guardianName.toLowerCase().includes(query) ||
        defaulter.selectClass.toLowerCase().includes(query)
      );
    }

    // Get fee structure to calculate payable amount
    const defaultersWithPayable = defaulters.map(defaulter => ({
      ...defaulter.toObject(),
      payable: 3000 // Default amount, should be fetched from fee structure
    }));

    // Calculate statistics
    const totalPayable = defaultersWithPayable.reduce((sum, d) => sum + (d.payable || 0), 0);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Fees defaulters retrieved successfully',
      data: defaultersWithPayable,
      stats: {
        totalDefaulters: defaultersWithPayable.length,
        totalPayable
      }
    });
  } catch (error) {
    console.error('Get fees defaulters error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch fees defaulters'
    });
  }
};

// Get fees paid slip for a student
export const getFeesPaidSlip = async (req, res) => {
  try {
    const { studentId, month } = req.query;

    if (!studentId || !month) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Student ID and month are required'
      });
    }

    const startDate = new Date(month);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const feeRecords = await FeePayment.find({
      studentId,
      feeMonth: {
        $gte: startDate,
        $lt: endDate
      }
    }).sort({ paymentDate: -1 });

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Fee paid slip retrieved successfully',
      data: feeRecords
    });
  } catch (error) {
    console.error('Get fees paid slip error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch fee paid slip'
    });
  }
};

// Get fees report and analytics
export const getFeesReport = async (req, res) => {
  try {
    const { period, month, year, startDate, endDate } = req.query;

    let dateFilter = {};
    let groupByFormat = '%Y-%m';

    // Set date filter based on period
    if (period === 'month' && month) {
      const start = new Date(month);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      
      dateFilter = {
        paymentDate: { $gte: start, $lt: end }
      };
      groupByFormat = '%Y-%m-%d';
    } else if (period === 'year' && year) {
      const start = new Date(`${year}-01-01`);
      const end = new Date(`${year}-12-31`);
      
      dateFilter = {
        paymentDate: { $gte: start, $lt: end }
      };
    } else if (period === 'custom' && startDate && endDate) {
      dateFilter = {
        paymentDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
      };
    } else {
      // Default to current month
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      dateFilter = {
        paymentDate: { $gte: start, $lt: end }
      };
    }

    // Get overall statistics
    const overallStats = await FeePayment.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalCollected: { $sum: '$amount' },
          totalPayments: { $sum: 1 },
          avgAmount: { $avg: '$amount' }
        }
      }
    ]);

    const totalCollected = overallStats[0]?.totalCollected || 0;
    const totalPayments = overallStats[0]?.totalPayments || 0;

    // Get total students and paid students
    const totalStudents = await Student.countDocuments({ status: 'active' });
    const paidStudents = await FeePayment.distinct('studentId', dateFilter);
    const paidStudentsCount = paidStudents.length;

    // Calculate total pending (assuming 3000 per student per month)
    const totalPending = Math.max(0, (totalStudents - paidStudentsCount) * 3000);
    
    // Calculate collection rate
    const collectionRate = totalStudents > 0 ? Math.round((paidStudentsCount / totalStudents) * 100) : 0;
    
    // Calculate total defaulters
    const totalDefaulters = totalStudents - paidStudentsCount;

    // Get monthly data with proper target calculation
    const monthlyData = await FeePayment.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            $dateToString: { format: groupByFormat, date: '$paymentDate' }
          },
          collected: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Add target to monthly data (assuming 3000 per student per day/month)
    const monthlyDataWithTarget = monthlyData.map(data => ({
      month: data._id,
      collected: data.collected,
      target: data.count * 3000,
      count: data.count
    }));

    // Get class-wise data
    const classWiseData = await FeePayment.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$class',
          collected: { $sum: '$amount' },
          students: { $addToSet: '$studentId' },
          payments: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          class: '$_id',
          collected: 1,
          students: { $size: '$students' },
          payments: 1,
          pending: {
            $multiply: [
              { $subtract: [totalStudents, { $size: '$students' }] },
              3000
            ]
          },
          percentage: {
            $cond: [
              { $eq: [{ $size: '$students' }, 0] },
              0,
              {
                $min: [
                  100,
                  {
                    $multiply: [
                      { $divide: ['$collected', { $multiply: [{ $size: '$students' }, 3000] }] },
                      100
                    ]
                  }
                ]
              }
            ]
          }
        }
      }
    ]);

    // Get payment methods distribution
    const paymentMethods = await FeePayment.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$depositType',
          amount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 1,
          amount: 1,
          count: 1,
          percentage: {
            $cond: [
              { $eq: [totalCollected, 0] },
              0,
              {
                $multiply: [
                  { $divide: ['$amount', totalCollected] },
                  100
                ]
              }
            ]
          }
        }
      }
    ]);

    // Get fee categories breakdown
    const feeCategories = await FeePayment.aggregate([
      { $match: dateFilter },
      { $unwind: '$particulars' },
      {
        $group: {
          _id: '$particulars.particular',
          amount: { $sum: '$particulars.amount' }
        }
      },
      {
        $project: {
          _id: 1,
          amount: 1,
          percentage: {
            $cond: [
              { $eq: [totalCollected, 0] },
              0,
              {
                $multiply: [
                  { $divide: ['$amount', totalCollected] },
                  100
                ]
              }
            ]
          }
        }
      }
    ]);

    // Get recent transactions
    const recentTransactions = await FeePayment.find(dateFilter)
      .sort({ paymentDate: -1 })
      .limit(10)
      .populate('studentId', 'studentName registrationNo');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Fees report generated successfully',
      data: {
        overallStats: {
          totalCollected,
          totalPending,
          totalDefaulters,
          collectionRate,
          totalStudents,
          paidStudents: paidStudentsCount,
          averageFeePerStudent: totalPayments > 0 ? Math.round(totalCollected / totalPayments) : 0
        },
        monthlyData: monthlyDataWithTarget,
        classWiseData,
        paymentMethods,
        feeCategories,
        recentTransactions
      }
    });
  } catch (error) {
    console.error('Get fees report error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to generate fees report'
    });
  }
};

// Delete fee payment
export const deleteFeePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const feePayment = await FeePayment.findByIdAndDelete(id);

    if (!feePayment) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Fee payment not found'
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Fee payment deleted successfully'
    });
  } catch (error) {
    console.error('Delete fee payment error:', error);
    
    if (error.name === 'CastError') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid fee payment ID'
      });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete fee payment'
    });
  }
};

// Bulk delete fee payments
export const bulkDeleteFeePayments = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Payment IDs array is required'
      });
    }

    const result = await FeePayment.deleteMany({ _id: { $in: ids } });

    res.status(StatusCodes.OK).json({
      success: true,
      message: `${result.deletedCount} fee payments deleted successfully`
    });
  } catch (error) {
    console.error('Bulk delete fee payments error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete fee payments'
    });
  }
};