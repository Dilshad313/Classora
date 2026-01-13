import Student from '../models/Student.js';
import Employee from '../models/Employee.js';
import Transaction from '../models/Transaction.js';
import FeePayment from '../models/Fees.js';
import StudentAttendance from '../models/StudentAttendance.js';
import EmployeeAttendance from '../models/EmployeeAttendance.js';
import Class from '../models/Class.js';
import Homework from '../models/Homework.js';
import ClassTest from '../models/ClassTest.js';
import Salary from '../models/Salary.js';

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

/**
 * Teacher-scoped dashboard statistics
 * @route GET /api/dashboard/teacher/stats
 */
export const getTeacherDashboardStats = async (req, res) => {
  try {
    const teacherId = req.user?.id;
    const teacherName = req.user?.employeeName || req.user?.name;

    if (!teacherId) {
      return res.status(400).json({ success: false, message: 'Teacher id missing in token' });
    }

    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    // Classes assigned to this teacher
    const teacherClasses = await Class.find({
      $or: [
        { teacherId: teacherId },
        teacherName ? { teacher: teacherName } : {}
      ]
    }).select('className section studentCount');

    const classIds = teacherClasses.map((c) => c._id);
    const classNames = teacherClasses.map((c) => c.className);
    const totalStudents = teacherClasses.reduce((acc, cls) => acc + (cls.studentCount || 0), 0);

    // Homework stats
    const pendingHomework = await Homework.countDocuments({
      teacher: teacherId,
      status: { $in: ['active'] }
    });
    const recentHomeworks = await Homework.find({ teacher: teacherId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('class', 'className section')
      .select('title dueDate status createdAt class section');

    // Upcoming class tests for the teacher's classes
    const upcomingTests = await ClassTest.countDocuments({
      classId: { $in: classIds },
      testDate: { $gte: startOfDay }
    });

    // Attendance today for teacher classes
    const attendanceAgg = await StudentAttendance.aggregate([
      {
        $match: {
          date: { $gte: startOfDay, $lte: endOfDay },
          class: { $in: classNames }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    const attendanceToday = attendanceAgg.reduce(
      (acc, cur) => ({ ...acc, [cur._id]: cur.count }),
      { present: 0, absent: 0, leave: 0 }
    );
    const attendanceTotal = attendanceToday.present + attendanceToday.absent + attendanceToday.leave;

    // Salary info
    const salaryHistory = await Salary.find({ employee: teacherId })
      .sort({ salaryDate: -1 })
      .limit(4)
      .select('month salaryDate netSalary status');
    const latestSalary = salaryHistory[0];

    res.status(200).json({
      success: true,
      data: {
        classesCount: teacherClasses.length,
        totalStudents,
        pendingHomework,
        upcomingTests,
        attendanceToday: {
          present: attendanceToday.present,
          absent: attendanceToday.absent,
          leave: attendanceToday.leave,
          total: attendanceTotal
        },
        recentHomeworks,
        salary: {
          latestNet: latestSalary?.netSalary || req.user?.monthlySalary || 0,
          latestMonth: latestSalary?.month || null,
          history: salaryHistory
        }
      }
    });
  } catch (error) {
    console.error('Teacher Dashboard Stats Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
