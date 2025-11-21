const FeeReceipt = require('../models/FeeReceipt');
const Student = require('../models/Student')

exports.listReceiptsByStudent = async (req, res) => {
  try {
    const { studentId, studentRegNo } = req.query;

    let idToQuery = studentId;
    if (!idToQuery && studentRegNo) {
      const student = await Student.findOne({ regNo: studentRegNo }).lean();
      if (!student) return res.status(404).json({ message: 'Student not found' });
      idToQuery = student._id;
    }

    if (!idToQuery) return res.status(400).json({ message: 'studentId or studentRegNo required' });

    const receipts = await FeeReceipt.find({ student: idToQuery }).sort({ paymentDate: -1 }).lean();
    res.json(receipts);
  } catch (err) {
    console.error('List receipts error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createReceipt = async (req, res) => {
  try {
    const {
      studentId,
      receiptNumber,
      paymentDate,
      academicYear,
      term,
      totalAmount,
      paidAmount,
      status,
      paymentMethod,
      transactionId,
      dueDate,
      feeBreakdown,
    } = req.body;

    if (!studentId || !receiptNumber || !academicYear || !term || totalAmount == null || paidAmount == null || !status) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const receipt = await FeeReceipt.create({
      student: studentId,
      receiptNumber,
      paymentDate: paymentDate ? new Date(paymentDate) : null,
      academicYear,
      term,
      totalAmount,
      paidAmount,
      status,
      paymentMethod,
      transactionId,
      dueDate: dueDate ? new Date(dueDate) : null,
      feeBreakdown: Array.isArray(feeBreakdown) ? feeBreakdown : [],
    });

    res.status(201).json(receipt);
  } catch (err) {
    console.error('Create receipt error', err);
    if (err.code === 11000) return res.status(409).json({ message: 'Duplicate receiptNumber' });
    res.status(500).json({ message: 'Server error' });
  }
};