const Employee = require('../models/Employee');
const { cloudinary } = require('../config/cloudinary');

exports.listEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ name: 1 }).lean();
    res.json(employees);
  } catch (err) {
    console.error('List employees error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createEmployee = async (req, res) => {
  try {
    const { employeeId, name, fatherName, role, department } = req.body;
    if (!employeeId || !name || !role || !department) {
      return res.status(400).json({ message: 'employeeId, name, role, department required' });
    }

    const photoUrl = req.file?.path;
    const photoPublicId = req.file?.filename;

    const employee = await Employee.create({ employeeId, name, fatherName, role, department, photoUrl, photoPublicId });
    res.status(201).json(employee);
  } catch (err) {
    console.error('Create employee error', err);
    if (err.code === 11000) return res.status(409).json({ message: 'Duplicate employeeId' });
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updatePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    if (employee.photoPublicId) {
      try { await cloudinary.uploader.destroy(employee.photoPublicId); } catch {}
    }
    employee.photoUrl = req.file?.path;
    employee.photoPublicId = req.file?.filename;
    await employee.save();
    res.json(employee);
  } catch (err) {
    console.error('Update employee photo error', err);
    res.status(500).json({ message: 'Server error' });
  }
};