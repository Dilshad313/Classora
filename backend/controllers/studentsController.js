const Student = require('../models/Student');
const ClassModel = require('../models/Class');
const { cloudinary } = require('../config/cloudinary');

exports.listStudentsByClass = async (req, res) => {
  try {
    const { classId } = req.query;
    if (!classId) return res.status(400).json({ message: 'classId is required' });
    const students = await Student.find({ class: classId }).sort({ rollNo: 1 }).lean();
    res.json(students);
  } catch (err) {
    console.error('List students error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const { regNo, name, rollNo, classId } = req.body;
    if (!regNo || !name || !rollNo || !classId) {
      return res.status(400).json({ message: 'regNo, name, rollNo, classId required' });
    }
    const cls = await ClassModel.findById(classId);
    if (!cls) return res.status(404).json({ message: 'Class not found' });

    const photoUrl = req.file?.path;
    const photoPublicId = req.file?.filename;

    const student = await Student.create({ regNo, name, rollNo, class: classId, photoUrl, photoPublicId });
    res.status(201).json(student);
  } catch (err) {
    console.error('Create student error', err);
    if (err.code === 11000) return res.status(409).json({ message: 'Duplicate regNo or rollNo' });
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updatePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // delete old image if exists
    if (student.photoPublicId) {
      try { await cloudinary.uploader.destroy(student.photoPublicId); } catch {}
    }

    student.photoUrl = req.file?.path;
    student.photoPublicId = req.file?.filename;
    await student.save();
    res.json(student);
  } catch (err) {
    console.error('Update student photo error', err);
    res.status(500).json({ message: 'Server error' });
  }
};