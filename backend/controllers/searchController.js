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
    const userId = req.user.id; // Admin ID for createdBy checks

    // Parallel execution of search queries
    const [students, employees, classes, subjects] = await Promise.all([
      // Search Students
      Student.find({
        $or: [
          { studentName: regex },
          { registrationNo: regex },
          { admissionNumber: regex },
          { rollNumber: regex }
        ]
        // Note: Student model does not have instituteId or createdBy
      }).limit(5).select('studentName registrationNo selectClass section rollNumber picture admissionNumber'),

      // Search Employees
      Employee.find({
        $or: [
          { employeeName: regex },
          { employeeId: regex },
          { emailAddress: regex },
          { employeeRole: regex }
        ]
        // Note: Employee model does not have instituteId or createdBy
      }).limit(5).select('employeeName employeeId employeeRole picture designation'),

      // Search Classes
      ClassModel.find({
        className: regex,
        createdBy: userId
      }).limit(5).select('className section room'),

      // Search Subjects
      Subject.find({
        name: regex,
        createdBy: userId
      }).limit(5).select('name code department')
    ]);

    // Format results
    const results = {
      students: students.map(s => ({
        id: s._id,
        title: s.studentName,
        subtitle: `Class: ${s.selectClass || 'N/A'} - ${s.section || 'A'} | Roll: ${s.rollNumber || 'N/A'}`,
        type: 'student',
        image: s.picture?.url, // Use picture.url
        link: `/dashboard/students/all?search=${s.registrationNo || s.admissionNumber}`
      })),
      employees: employees.map(e => ({
        id: e._id,
        title: e.employeeName,
        subtitle: `${e.employeeRole} | ID: ${e.employeeId}`,
        type: 'employee',
        image: e.picture?.url,
        link: `/dashboard/employee/all?search=${e.employeeId}`
      })),
      classes: classes.map(c => ({
        id: c._id,
        title: `${c.className} ${c.section ? `- ${c.section}` : ''}`,
        subtitle: `Room: ${c.room || 'N/A'}`,
        type: 'class',
        link: '/dashboard/classes/all' 
      })),
      subjects: subjects.map(s => ({
        id: s._id,
        title: s.name,
        subtitle: `${s.code ? `Code: ${s.code}` : ''} | ${s.department || ''}`,
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
