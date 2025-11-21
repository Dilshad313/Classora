const AccountStatement = require('../models/AccountStatement');

exports.listStatements = async (req, res) => {
  try {
    const { start, end, search } = req.query;
    const filter = {};
    if (start || end) {
      filter.date = {};
      if (start) filter.date.$gte = new Date(start);
      if (end) filter.date.$lte = new Date(end);
    }
    if (search) {
      filter.$or = [
        { description: { $regex: search, $options: 'i' } },
        { reference: { $regex: search, $options: 'i' } }
      ];
    }
    const statements = await AccountStatement.find(filter).sort({ date: -1 }).lean();
    res.json(statements);
  } catch (err) {
    console.error('List statements error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createStatement = async (req, res) => {
  try {
    const { date, description, reference, debit, credit } = req.body;
    if (!date || !description) {
      return res.status(400).json({ message: 'date and description required' });
    }
    const st = await AccountStatement.create({ date: new Date(date), description, reference, debit: debit || 0, credit: credit || 0 });
    res.status(201).json(st);
  } catch (err) {
    console.error('Create statement error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteStatement = async (req, res) => {
  try {
    const { id } = req.params;
    await AccountStatement.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    console.error('Delete statement error', err);
    res.status(500).json({ message: 'Server error' });
  }
};