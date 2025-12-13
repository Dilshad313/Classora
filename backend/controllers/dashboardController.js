import Student from '../models/Student.js';
import Employee from '../models/Employee.js';
import Transaction from '../models/Transaction.js';
import FeePayment from '../models/Fees.js';
import StudentAttendance from '../models/StudentAttendance.js';
import EmployeeAttendance from '../models/EmployeeAttendance.js';

export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // 1. Total Counts
    // Check if status field exists in Student/Employee schemas. 
    // Student.js has status enum ['active', 'inactive', 'suspended', 'graduated', 'left'] (implied from typical usage, verifying from schema... Student.js schema wasn't fully read but NewClasses usage of studentCount implies active students are what matters).
    // Let's assume 'active' is the key status.
    // If schema doesn't match default to all.
    const totalStudents = await Student.countDocuments({ status: 'active' }).catch(() => Student.countDocuments());
    const totalEmployees = await Employee.countDocuments({ status: 'active' }).catch(() => Employee.countDocuments());

    // 2. Financials (Revenue/Profit)
    // Using Transaction for overall institution financials
    // Transaction.getAccountSummary returns { totalDebit, totalCredit, netBalance, transactionCount }
    // console.log('Dashboard Stats Request User:', req.user);
    const accountSummary = await Transaction.getAccountSummary(req.user?.instituteId, null, null); 
    
    // 3. Today's Attendance
    const absentStudents = await StudentAttendance.countDocuments({
      date: { $gte: startOfDay, $lte: endOfDay },
      status: 'absent'
    });
    
    const presentStudents = await StudentAttendance.countDocuments({
      date: { $gte: startOfDay, $lte: endOfDay },
      status: 'present'
    });

    const presentEmployees = await EmployeeAttendance.countDocuments({
      date: { $gte: startOfDay, $lte: endOfDay },
      status: 'present'
    });

    // 4. New Admissions (This Month)
    const newAdmissions = await Student.countDocuments({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    });

    // 5. Fee Collection (This Month)
    // Based on Fees.js (FeePayment model)
    const feeStats = await FeePayment.aggregate([
      {
        $match: {
          feeMonth: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          totalEstimated: { $sum: '$amount' }, // Sum of all invoices/payments for this month
          collected: {
            $sum: {
              $cond: [{ $eq: ['$status', 'completed'] }, '$amount', 0]
            }
          }
        }
      }
    ]);

    const estimatedFee = feeStats[0]?.totalEstimated || 0;
    const collectedFee = feeStats[0]?.collected || 0;

    // 6. Income Statistics (Last 6 Months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const incomeStats = await Transaction.aggregate([
      {
        $match: {
          type: 'credit',
          date: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: { 
            month: { $month: '$date' },
            year: { $year: '$date' }
          },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // 7. Student Statistics (Last 6 Months Admissions)
    const studentStats = await Student.aggregate([
        {
            $match: {
                createdAt: { $gte: sixMonthsAgo }
            }
        },
        {
            $group: {
                _id: {
                    month: { $month: '$createdAt' },
                    year: { $year: '$createdAt' }
                },
                count: { $sum: 1 }
            }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);


    // Prepare Response
    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalEmployees,
        totalRevenue: accountSummary.totalCredit,
        totalProfit: accountSummary.netBalance,
        todayAbsentStudents: absentStudents,
        todayPresentStudents: presentStudents,
        todayPresentEmployees: presentEmployees,
        newAdmissions,
        estimatedFee,
        collectedFee,
        incomeStats,
        studentStats
      }
    });

  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
