import Transaction from '../models/Transaction.js';
import { StatusCodes } from 'http-status-codes';

// Helper function to get user institute with fallback
const getUserInstitute = (req) => {
  return req.user?.institute || '65d8f1a1e4b0a0a0a0a0a0a0'; // Fallback institute ID
};

// Get all transactions with filtering
export const getTransactions = async (req, res) => {
  try {
    const {
      search,
      type,
      category,
      paymentMethod,
      status,
      startDate,
      endDate,
      page = 1,
      limit = 50
    } = req.query;

    // Build filter object
    const filter = {};
    
    // Only filter by institute if user has one
    const userInstitute = getUserInstitute(req);
    if (userInstitute) {
      filter.institute = userInstitute;
    }
    
    if (search) {
      filter.$or = [
        { description: { $regex: search, $options: 'i' } },
        { reference: { $regex: search, $options: 'i' } }
      ];
    }

    if (type && type !== 'all') {
      filter.type = type;
    }

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (paymentMethod && paymentMethod !== 'all') {
      filter.paymentMethod = paymentMethod;
    }

    if (status && status !== 'all') {
      filter.status = status;
    }

    // Date range filter
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get transactions with pagination
    const transactions = await Transaction.find(filter)
      .populate('createdBy', 'name email')
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Format transactions for frontend
    const formattedTransactions = transactions.map(transaction => ({
      id: transaction._id,
      date: transaction.date.toISOString().split('T')[0],
      description: transaction.description,
      reference: transaction.reference,
      debit: transaction.type === 'debit' ? transaction.amount : 0,
      credit: transaction.type === 'credit' ? transaction.amount : 0,
      type: transaction.type,
      category: transaction.category,
      paymentMethod: transaction.paymentMethod,
      status: transaction.status,
      createdAt: transaction.createdAt
    }));

    // Get total count for pagination
    const total = await Transaction.countDocuments(filter);

    // Get account summary
    const summary = await Transaction.getAccountSummary(userInstitute, startDate, endDate);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Transactions retrieved successfully',
      data: formattedTransactions,
      summary: {
        totalDebit: summary.totalDebit,
        totalCredit: summary.totalCredit,
        netBalance: summary.netBalance,
        transactionCount: summary.transactionCount
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch transactions'
    });
  }
};

// Get account statement with advanced filtering
export const getAccountStatement = async (req, res) => {
  try {
    const {
      filterType,
      startDate,
      endDate,
      search,
      showReferences = true
    } = req.query;

    // Build date filter based on filterType
    let dateFilter = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (filterType) {
      case 'today':
        dateFilter = {
          $gte: today,
          $lte: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        };
        break;
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        dateFilter = {
          $gte: yesterday,
          $lte: today
        };
        break;
      case 'last7days':
        const last7Days = new Date(today);
        last7Days.setDate(last7Days.getDate() - 7);
        dateFilter = {
          $gte: last7Days,
          $lte: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        };
        break;
      case 'last30days':
        const last30Days = new Date(today);
        last30Days.setDate(last30Days.getDate() - 30);
        dateFilter = {
          $gte: last30Days,
          $lte: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        };
        break;
      case 'thismonth':
        const firstDayThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDayThisMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        dateFilter = {
          $gte: firstDayThisMonth,
          $lte: lastDayThisMonth
        };
        break;
      case 'lastmonth':
        const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        dateFilter = {
          $gte: firstDayLastMonth,
          $lte: lastDayLastMonth
        };
        break;
      case 'custom':
        if (startDate && endDate) {
          dateFilter = {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          };
        }
        break;
      default:
        // No date filter for 'all'
        break;
    }

    // Build main filter
    const filter = {};
    
    // Only filter by institute if user has one
    const userInstitute = getUserInstitute(req);
    if (userInstitute) {
      filter.institute = userInstitute;
    }
    
    if (Object.keys(dateFilter).length > 0) {
      filter.date = dateFilter;
    }

    if (search) {
      filter.$or = [
        { description: { $regex: search, $options: 'i' } },
        { reference: { $regex: search, $options: 'i' } }
      ];
    }

    // Get transactions
    const transactions = await Transaction.find(filter)
      .sort({ date: -1, createdAt: -1 })
      .lean();

    // Format transactions for statement
    const statement = transactions.map(transaction => ({
      id: transaction._id,
      date: transaction.date.toISOString().split('T')[0],
      description: transaction.description,
      reference: transaction.reference,
      debit: transaction.type === 'debit' ? transaction.amount : 0,
      credit: transaction.type === 'credit' ? transaction.amount : 0,
      type: transaction.type,
      category: transaction.category
    }));

    // Calculate running balance
    let runningBalance = 0;
    const statementWithBalance = statement.map((transaction, index) => {
      runningBalance += transaction.credit - transaction.debit;
      return {
        ...transaction,
        netBalance: runningBalance
      };
    });

    // Calculate totals
    const totals = statement.reduce((acc, transaction) => ({
      debit: acc.debit + transaction.debit,
      credit: acc.credit + transaction.credit
    }), { debit: 0, credit: 0 });

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Account statement retrieved successfully',
      data: statementWithBalance,
      totals: {
        ...totals,
        netBalance: totals.credit - totals.debit
      },
      filter: {
        type: filterType,
        startDate,
        endDate,
        search,
        showReferences: showReferences === 'true'
      }
    });
  } catch (error) {
    console.error('Get account statement error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch account statement'
    });
  }
};

// Add expense (debit transaction)
export const addExpense = async (req, res) => {
  try {
    const {
      date,
      description,
      amount,
      category = 'other',
      paymentMethod = 'cash',
      reference
    } = req.body;

    // Validate required fields
    if (!date || !description || !amount) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Date, description, and amount are required'
      });
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Please enter a valid amount'
      });
    }

    // Get user institute with fallback
    const userInstitute = getUserInstitute(req);

    // Create expense transaction
    const expenseData = {
      date: new Date(date),
      description: description.trim(),
      amount: parseFloat(amount),
      type: 'debit',
      category,
      paymentMethod,
      reference
    };

    // Only add user ID and institute if available
    if (req.user?.userId) {
      expenseData.createdBy = req.user.userId;
    }
    
    if (userInstitute) {
      expenseData.institute = userInstitute;
    }

    console.log('Creating expense with data:', expenseData);

    const expense = await Transaction.create(expenseData);

    const expenseResponse = expense.toObject();
    
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Expense added successfully',
      data: {
        id: expenseResponse._id,
        date: expenseResponse.date.toISOString().split('T')[0],
        description: expenseResponse.description,
        reference: expenseResponse.reference,
        amount: expenseResponse.amount,
        type: expenseResponse.type,
        category: expenseResponse.category,
        paymentMethod: expenseResponse.paymentMethod
      }
    });

  } catch (error) {
    console.error('Add expense error:', error);

    if (error.code === 11000) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: 'Reference number already exists'
      });
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: errors[0] || 'Validation failed'
      });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to add expense: ' + error.message
    });
  }
};

// Add income (credit transaction)
export const addIncome = async (req, res) => {
  try {
    const {
      date,
      description,
      amount,
      category = 'other',
      paymentMethod = 'cash',
      reference
    } = req.body;

    // Validate required fields
    if (!date || !description || !amount) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Date, description, and amount are required'
      });
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Please enter a valid amount'
      });
    }

    // Get user institute with fallback
    const userInstitute = getUserInstitute(req);

    // Create income transaction
    const incomeData = {
      date: new Date(date),
      description: description.trim(),
      amount: parseFloat(amount),
      type: 'credit',
      category,
      paymentMethod,
      reference
    };

    // Only add user ID and institute if available
    if (req.user?.userId) {
      incomeData.createdBy = req.user.userId;
    }
    
    if (userInstitute) {
      incomeData.institute = userInstitute;
    }

    console.log('Creating income with data:', incomeData);

    const income = await Transaction.create(incomeData);

    const incomeResponse = income.toObject();
    
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Income added successfully',
      data: {
        id: incomeResponse._id,
        date: incomeResponse.date.toISOString().split('T')[0],
        description: incomeResponse.description,
        reference: incomeResponse.reference,
        amount: incomeResponse.amount,
        type: incomeResponse.type,
        category: incomeResponse.category,
        paymentMethod: incomeResponse.paymentMethod
      }
    });

  } catch (error) {
    console.error('Add income error:', error);

    if (error.code === 11000) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: 'Reference number already exists'
      });
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: errors[0] || 'Validation failed'
      });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to add income: ' + error.message
    });
  }
};

// Delete transactions
export const deleteTransactions = async (req, res) => {
  try {
    const { transactionIds } = req.body;

    if (!transactionIds || !Array.isArray(transactionIds) || transactionIds.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Transaction IDs are required'
      });
    }

    // Build filter
    const filter = {
      _id: { $in: transactionIds }
    };

    // Only filter by institute if user has one
    const userInstitute = getUserInstitute(req);
    if (userInstitute) {
      filter.institute = userInstitute;
    }

    // Delete transactions
    const result = await Transaction.deleteMany(filter);

    if (result.deletedCount === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'No transactions found to delete'
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: `${result.deletedCount} transaction(s) deleted successfully`,
      data: {
        deletedCount: result.deletedCount
      }
    });

  } catch (error) {
    console.error('Delete transactions error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete transactions'
    });
  }
};

// Get transaction by ID
export const getTransactionById = async (req, res) => {
  try {
    const filter = {
      _id: req.params.id
    };

    // Only filter by institute if user has one
    const userInstitute = getUserInstitute(req);
    if (userInstitute) {
      filter.institute = userInstitute;
    }

    const transaction = await Transaction.findOne(filter).populate('createdBy', 'name email');

    if (!transaction) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    const transactionResponse = transaction.toObject();
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Transaction retrieved successfully',
      data: {
        id: transactionResponse._id,
        date: transactionResponse.date.toISOString().split('T')[0],
        description: transactionResponse.description,
        reference: transactionResponse.reference,
        amount: transactionResponse.amount,
        type: transactionResponse.type,
        category: transactionResponse.category,
        paymentMethod: transactionResponse.paymentMethod,
        status: transactionResponse.status,
        createdBy: transactionResponse.createdBy,
        createdAt: transactionResponse.createdAt
      }
    });

  } catch (error) {
    console.error('Get transaction error:', error);
    
    if (error.name === 'CastError') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid transaction ID'
      });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch transaction'
    });
  }
};

// Update transaction
export const updateTransaction = async (req, res) => {
  try {
    const {
      date,
      description,
      amount,
      category,
      paymentMethod,
      status
    } = req.body;

    const filter = {
      _id: req.params.id
    };

    // Only filter by institute if user has one
    const userInstitute = getUserInstitute(req);
    if (userInstitute) {
      filter.institute = userInstitute;
    }

    const transaction = await Transaction.findOne(filter);

    if (!transaction) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Update fields
    if (date) transaction.date = new Date(date);
    if (description) transaction.description = description.trim();
    if (amount) transaction.amount = parseFloat(amount);
    if (category) transaction.category = category;
    if (paymentMethod) transaction.paymentMethod = paymentMethod;
    if (status) transaction.status = status;

    await transaction.save();

    const transactionResponse = transaction.toObject();
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Transaction updated successfully',
      data: {
        id: transactionResponse._id,
        date: transactionResponse.date.toISOString().split('T')[0],
        description: transactionResponse.description,
        reference: transactionResponse.reference,
        amount: transactionResponse.amount,
        type: transactionResponse.type,
        category: transactionResponse.category,
        paymentMethod: transactionResponse.paymentMethod,
        status: transactionResponse.status
      }
    });

  } catch (error) {
    console.error('Update transaction error:', error);

    if (error.name === 'CastError') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid transaction ID'
      });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to update transaction'
    });
  }
};

// Get account statistics
export const getAccountStats = async (req, res) => {
  try {
    const today = new Date();
    const firstDayThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    const userInstitute = getUserInstitute(req);

    // This month stats
    const thisMonthStats = await Transaction.getAccountSummary(
      userInstitute,
      firstDayThisMonth,
      today
    );

    // Last month stats
    const lastMonthStats = await Transaction.getAccountSummary(
      userInstitute,
      firstDayLastMonth,
      lastDayLastMonth
    );

    // Today's stats
    const todayStart = new Date(today);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
    const todayStats = await Transaction.getAccountSummary(
      userInstitute,
      todayStart,
      todayEnd
    );

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Account statistics retrieved successfully',
      data: {
        thisMonth: thisMonthStats,
        lastMonth: lastMonthStats,
        today: todayStats,
        overall: await Transaction.getAccountSummary(userInstitute)
      }
    });

  } catch (error) {
    console.error('Get account stats error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch account statistics'
    });
  }
};