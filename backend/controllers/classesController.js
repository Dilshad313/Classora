const ClassModel = require('../models/Class');

exports.listClasses = async (req, res) => {
  try {
    const classes = await ClassModel.find().sort({ grade: 1, section: 1 }).lean();
    res.json(classes);
  } catch (err) {
    console.error('List classes error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createClass = async (req, res) => {
  try {
    const { name, section, grade } = req.body;
    if (!name || !section || !grade) {
      return res.status(400).json({ message: 'name, section, and grade are required' });
    }
    const cls = await ClassModel.create({ name, section, grade });
    res.status(201).json(cls);
  } catch (err) {
    console.error('Create class error', err);
    if (err.code === 11000) return res.status(409).json({ message: 'Class already exists' });
    res.status(500).json({ message: 'Server error' });
  }
};