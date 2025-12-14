import Student from '../models/Student.js';
import Employee from '../models/Employee.js';
import ClassModel from '../models/Class.js';
import Subject from '../models/Subject.js';

/**
 * @desc    Global search across multiple collections
 * @route   GET /api/search
 * @access  Private
 */
export const globalSearch = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ success: false, message: 'Search query is required' });
    }

    const regex = new RegExp(q, 'i'); // Case-insensitive regex

    // Parallel execution of search queries
    const [students, employees, classes, subjects] = await Promise.all([
      // Search Students
      Student.find({
        $or: [
          { firstName: regex },
          { lastName: regex },
          { admissionNo: regex },
          { rollNo: regex }
        ],
        instituteId: req.user.instituteId // Ensure institute isolation
      }).limit(5).select('firstName lastName admissionNo class section rollNo studentId photo'),

      // Search Employees
      Employee.find({
        $or: [
          { firstName: regex },
          { lastName: regex },
          { employeeId: regex },
          { designation: regex }
        ],
        instituteId: req.user.instituteId
      }).limit(5).select('firstName lastName employeeId designation photo'),

      // Search Classes
      ClassModel.find({
        className: regex,
        instituteId: req.user.instituteId
      }).limit(5).select('className section roomNo'),

      // Search Subjects
      Subject.find({
        subjectName: regex,
        instituteId: req.user.instituteId
      }).limit(5).select('subjectName subjectCode type')
    ]);

    // Format results
    const results = {
      students: students.map(s => ({
        id: s._id,
        title: `${s.firstName} ${s.lastName}`,
        subtitle: `Class: ${s.class?.className || 'N/A'} - ${s.section || ''} | Roll No: ${s.rollNo || 'N/A'}`,
        type: 'student',
        image: s.photo,
        link: `/dashboard/students/all?search=${s.admissionNo}` // Link to student details
      })),
      employees: employees.map(e => ({
        id: e._id,
        title: `${e.firstName} ${e.lastName}`,
        subtitle: `${e.designation} | ID: ${e.employeeId}`,
        type: 'employee',
        image: e.photo,
        link: `/dashboard/employee/all?search=${e.employeeId}`
      })),
      classes: classes.map(c => ({
        id: c._id,
        title: `${c.className} ${c.section ? `- ${c.section}` : ''}`,
        subtitle: `Room: ${c.roomNo || 'N/A'}`,
        type: 'class',
        link: '/dashboard/classes/all' 
      })),
      subjects: subjects.map(s => ({
        id: s._id,
        title: `${s.subjectName}`,
        subtitle: `${s.subjectCode ? `Code: ${s.subjectCode}` : ''} | ${s.type}`,
        type: 'subject',
        link: '/dashboard/subjects/classes'
      }))
    };

    res.status(200).json({
      success: true,
      data: results
    });

  } catch (error) {
    console.error('Search Error:', error);
    res.status(500).json({ success: false, message: 'Server occurred while searching' });
  }
};
