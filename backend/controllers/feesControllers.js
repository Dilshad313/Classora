import FeePayment from '../models/Fees.js';
import Student from '../models/Student.js';
import FeeStructure from '../models/FeeStructure.js';
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

    // Get all active students
    const allStudents = await Student.find({ status: 'active' }).select('-password');
    
    // Get all fee payments for this month
    const paymentsForMonth = await FeePayment.find({
      feeMonth: {
        $gte: startDate,
        $lt: endDate
      }
    });

    // Get fee structures for calculating payable amounts
    const feeStructures = await FeeStructure.find({ status: 'active' });
    const feeStructureMap = {};
    feeStructures.forEach(structure => {
      feeStructureMap[structure.className] = structure;
    });

    // Calculate total paid per student
    const paymentsByStudent = {};
    paymentsForMonth.forEach(payment => {
      const studentId = payment.studentId.toString();
      if (!paymentsByStudent[studentId]) {
        paymentsByStudent[studentId] = 0;
      }
      paymentsByStudent[studentId] += payment.amount;
    });

    // Calculate payable amount for each student and identify defaulters
    const defaultersWithPayable = [];
    
    for (const student of allStudents) {
      const studentClass = student.selectClass || student.class;
      const studentId = student._id.toString();
      
      // Calculate total fee required for this student
      let totalFeeRequired = 0;
      
      // Try to get fee from fee structure first
      const feeStructure = feeStructureMap[studentClass];
      if (feeStructure) {
        totalFeeRequired = feeStructure.totalFee;
      } else {
        // Fallback: use default fee calculation based on common fee particulars
        // This matches the logic used in CollectFees and GenerateFeesInvoice
        totalFeeRequired = 3000; // Default monthly fee - can be made configurable
      }

      // Get amount paid by this student
      const amountPaid = paymentsByStudent[studentId] || 0;
      
      // Calculate remaining balance
      const remainingBalance = totalFeeRequired - amountPaid;
      
      // Student is a defaulter if they haven't paid the full amount
      if (remainingBalance > 0) {
        defaultersWithPayable.push({
          ...student.toObject(),
          payable: remainingBalance,
          totalFeeRequired: totalFeeRequired,
          amountPaid: amountPaid,
          paymentStatus: amountPaid > 0 ? 'partial' : 'unpaid'
        });
      }
    }

    // Apply search filter if provided
    let filteredDefaulters = defaultersWithPayable;
    if (search) {
      const query = search.toLowerCase();
      filteredDefaulters = defaultersWithPayable.filter(defaulter => 
        defaulter.studentName.toLowerCase().includes(query) ||
        defaulter.registrationNo.toLowerCase().includes(query) ||
        (defaulter.fatherName && defaulter.fatherName.toLowerCase().includes(query)) ||
        (defaulter.motherName && defaulter.motherName.toLowerCase().includes(query)) ||
        (defaulter.guardianName && defaulter.guardianName.toLowerCase().includes(query)) ||
        (defaulter.selectClass && defaulter.selectClass.toLowerCase().includes(query)) ||
        (defaulter.class && defaulter.class.toLowerCase().includes(query)) ||
        (defaulter.mobileNo && defaulter.mobileNo.includes(query))
      );
    }

    // Calculate statistics
    const totalPayable = filteredDefaulters.reduce((sum, d) => sum + (d.payable || 0), 0);
    const totalRequired = filteredDefaulters.reduce((sum, d) => sum + (d.totalFeeRequired || 0), 0);
    const totalPaid = filteredDefaulters.reduce((sum, d) => sum + (d.amountPaid || 0), 0);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Fees defaulters retrieved successfully',
      data: filteredDefaulters,
      stats: {
        totalDefaulters: filteredDefaulters.length,
        totalPayable,
        totalRequired,
        totalPaid,
        month: month
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

// Export fees report as CSV
export const exportFeesReportCSV = async (req, res) => {
  try {
    const { period, month, year, startDate, endDate } = req.query;
    
    // Build date filter
    let dateFilter = {};
    if (period === 'month' && month) {
      const startDate = new Date(month);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
      dateFilter = { paymentDate: { $gte: startDate, $lt: endDate } };
    } else if (period === 'year' && year) {
      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${parseInt(year) + 1}-01-01`);
      dateFilter = { paymentDate: { $gte: startDate, $lt: endDate } };
    } else if (period === 'quarter' && month) {
      const date = new Date(month);
      const quarterStart = new Date(date.getFullYear(), Math.floor(date.getMonth() / 3) * 3, 1);
      const quarterEnd = new Date(quarterStart);
      quarterEnd.setMonth(quarterEnd.getMonth() + 3);
      dateFilter = { paymentDate: { $gte: quarterStart, $lt: quarterEnd } };
    } else if (period === 'custom' && startDate && endDate) {
      dateFilter = { paymentDate: { $gte: new Date(startDate), $lte: new Date(endDate) } };
    } else {
      dateFilter = { paymentDate: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } };
    }

    // Get all payments for CSV
    const payments = await FeePayment.find(dateFilter).sort({ paymentDate: -1 });

    // Format data for CSV
    const csvData = payments.map(payment => ({
      'Receipt No': payment.receiptNo,
      'Student Name': payment.studentName,
      'Registration No': payment.registrationNo,
      'Class': payment.class,
      'Amount': payment.amount,
      'Payment Date': new Date(payment.paymentDate).toLocaleDateString(),
      'Fee Month': new Date(payment.feeMonth).toLocaleDateString(),
      'Payment Method': payment.depositType,
      'Guardian Name': payment.guardianName
    }));

    // Generate CSV string
    const { Parser } = await import('json2csv');
    const parser = new Parser({ fields: ['Receipt No', 'Student Name', 'Registration No', 'Class', 'Amount', 'Payment Date', 'Fee Month', 'Payment Method', 'Guardian Name'] });
    const csv = parser.parse(csvData);

    // Set response headers
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="fees-report.csv"');
    res.send(csv);
  } catch (error) {
    console.error('Export CSV error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to export fees report as CSV'
    });
  }
};

// Export fees report as Excel
export const exportFeesReportExcel = async (req, res) => {
  try {
    const { period, month, year, startDate, endDate } = req.query;
    
    // Build date filter
    let dateFilter = {};
    if (period === 'month' && month) {
      const startDate = new Date(month);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
      dateFilter = { paymentDate: { $gte: startDate, $lt: endDate } };
    } else if (period === 'year' && year) {
      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${parseInt(year) + 1}-01-01`);
      dateFilter = { paymentDate: { $gte: startDate, $lt: endDate } };
    } else if (period === 'quarter' && month) {
      const date = new Date(month);
      const quarterStart = new Date(date.getFullYear(), Math.floor(date.getMonth() / 3) * 3, 1);
      const quarterEnd = new Date(quarterStart);
      quarterEnd.setMonth(quarterEnd.getMonth() + 3);
      dateFilter = { paymentDate: { $gte: quarterStart, $lt: quarterEnd } };
    } else if (period === 'custom' && startDate && endDate) {
      dateFilter = { paymentDate: { $gte: new Date(startDate), $lte: new Date(endDate) } };
    } else {
      dateFilter = { paymentDate: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } };
    }

    const ExcelJS = await import('exceljs');
    const Workbook = ExcelJS.default.Workbook;
    const workbook = new Workbook();

    // Get report data
    const payments = await FeePayment.find(dateFilter).sort({ paymentDate: -1 });
    
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

    // Create Transactions Sheet
    const wsTransactions = workbook.addWorksheet('Transactions');
    wsTransactions.columns = [
      { header: 'Receipt No', key: 'receiptNo', width: 15 },
      { header: 'Student Name', key: 'studentName', width: 25 },
      { header: 'Registration No', key: 'registrationNo', width: 18 },
      { header: 'Class', key: 'class', width: 10 },
      { header: 'Amount', key: 'amount', width: 12 },
      { header: 'Payment Date', key: 'paymentDate', width: 15 },
      { header: 'Fee Month', key: 'feeMonth', width: 15 },
      { header: 'Payment Method', key: 'depositType', width: 15 },
      { header: 'Guardian Name', key: 'guardianName', width: 20 }
    ];

    // Style header row
    wsTransactions.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    wsTransactions.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F46E5' } };

    // Add data
    payments.forEach(payment => {
      wsTransactions.addRow({
        receiptNo: payment.receiptNo,
        studentName: payment.studentName,
        registrationNo: payment.registrationNo,
        class: payment.class,
        amount: payment.amount,
        paymentDate: new Date(payment.paymentDate).toLocaleDateString(),
        feeMonth: new Date(payment.feeMonth).toLocaleDateString(),
        depositType: payment.depositType,
        guardianName: payment.guardianName
      });
    });

    // Format amount column
    wsTransactions.getColumn('amount').numFmt = '₹#,##0';

    // Create Summary Sheet
    const wsSummary = workbook.addWorksheet('Summary');
    
    const totalCollected = overallStats[0]?.totalCollected || 0;
    const totalPayments = overallStats[0]?.totalPayments || 0;
    const totalStudents = await Student.countDocuments({ status: 'active' });
    const paidStudents = await FeePayment.distinct('studentId', dateFilter);
    
    wsSummary.addRow(['Fees Report Summary']);
    wsSummary.getRow(1).font = { bold: true, size: 14 };
    
    wsSummary.addRow(['']);
    wsSummary.addRow(['Total Collected', totalCollected]);
    wsSummary.addRow(['Total Payments', totalPayments]);
    wsSummary.addRow(['Total Students', totalStudents]);
    wsSummary.addRow(['Students Paid', paidStudents.length]);
    wsSummary.addRow(['Collection Rate', `${totalStudents > 0 ? Math.round((paidStudents.length / totalStudents) * 100) : 0}%`]);
    wsSummary.addRow(['Average Fee/Student', overallStats[0]?.avgAmount?.toFixed(0) || 0]);

    wsSummary.getColumn('A').width = 25;
    wsSummary.getColumn('B').width = 20;

    // Send file
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="fees-report.xlsx"');
    
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Export Excel error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to export fees report as Excel'
    });
  }
};

// Export fees report as PDF
export const exportFeesReportPDF = async (req, res) => {
  try {
    const { period, month, year, startDate, endDate } = req.query;
    
    // Build date filter
    let dateFilter = {};
    if (period === 'month' && month) {
      const startDate = new Date(month);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
      dateFilter = { paymentDate: { $gte: startDate, $lt: endDate } };
    } else if (period === 'year' && year) {
      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${parseInt(year) + 1}-01-01`);
      dateFilter = { paymentDate: { $gte: startDate, $lt: endDate } };
    } else if (period === 'quarter' && month) {
      const date = new Date(month);
      const quarterStart = new Date(date.getFullYear(), Math.floor(date.getMonth() / 3) * 3, 1);
      const quarterEnd = new Date(quarterStart);
      quarterEnd.setMonth(quarterEnd.getMonth() + 3);
      dateFilter = { paymentDate: { $gte: quarterStart, $lt: quarterEnd } };
    } else if (period === 'custom' && startDate && endDate) {
      dateFilter = { paymentDate: { $gte: new Date(startDate), $lte: new Date(endDate) } };
    } else {
      dateFilter = { paymentDate: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } };
    }

    const jsPDF = await import('jspdf');
    const PDFDocument = jsPDF.jsPDF;
    
    // Get report data
    const payments = await FeePayment.find(dateFilter).sort({ paymentDate: -1 }).limit(100);
    
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

    const doc = new PDFDocument();
    
    // Add header
    doc.setFontSize(20);
    doc.text('Fees Report', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });
    
    // Add summary
    doc.setTextColor(0);
    doc.setFontSize(12);
    doc.text('Summary', 20, 45);
    
    doc.setFontSize(10);
    let yPos = 55;
    const totalCollected = overallStats[0]?.totalCollected || 0;
    const totalPayments = overallStats[0]?.totalPayments || 0;
    
    doc.text(`Total Collected: ₹${totalCollected.toLocaleString()}`, 20, yPos);
    yPos += 7;
    doc.text(`Total Payments: ${totalPayments}`, 20, yPos);
    yPos += 7;
    doc.text(`Average Fee: ₹${(overallStats[0]?.avgAmount || 0).toFixed(0)}`, 20, yPos);
    yPos += 15;
    
    // Add transactions table
    doc.setFontSize(12);
    doc.text('Recent Transactions', 20, yPos);
    yPos += 10;
    
    // Table header
    doc.setFontSize(9);
    doc.setFillColor(79, 70, 229);
    doc.setTextColor(255);
    doc.rect(20, yPos - 5, 170, 6, 'F');
    doc.text('Student', 22, yPos);
    doc.text('Class', 70, yPos);
    doc.text('Amount', 100, yPos);
    doc.text('Date', 135, yPos);
    
    // Table data
    doc.setTextColor(0);
    yPos += 8;
    
    payments.slice(0, 20).forEach((payment, index) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.text(payment.studentName.substring(0, 30), 22, yPos);
      doc.text(payment.class, 70, yPos);
      doc.text(`₹${payment.amount.toLocaleString()}`, 100, yPos);
      doc.text(new Date(payment.paymentDate).toLocaleDateString(), 135, yPos);
      yPos += 6;
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="fees-report.pdf"');
    
    doc.pipe(res);
    doc.end();
  } catch (error) {
    console.error('Export PDF error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to export fees report as PDF'
    });
  }
};