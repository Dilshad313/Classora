import { useState } from 'react';
import { ClipboardCheck, Save } from 'lucide-react';

const ManageTestMarks = () => {
  const students = [
    { id: 1, name: 'John Doe', rollNo: '001', marks: 18 },
    { id: 2, name: 'Jane Smith', rollNo: '002', marks: 20 },
    { id: 3, name: 'Mike Johnson', rollNo: '003', marks: 16 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Manage Test Marks</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Enter and update class test marks</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Save className="w-5 h-5" />
          Save Marks
        </button>
      </div>

      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select className="input">
            <option>Select Class</option>
            <option>Class 10-A</option>
            <option>Class 9-B</option>
          </select>
          <select className="input">
            <option>Select Subject</option>
            <option>Mathematics</option>
            <option>English</option>
          </select>
          <input type="date" className="input" />
        </div>
      </div>

      <div className="card">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Test Details</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Test Name" className="input" />
            <input type="number" placeholder="Maximum Marks" defaultValue="20" className="input" />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Roll No</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Student Name</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Marks Obtained</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">{student.rollNo}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {student.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{student.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <input type="number" defaultValue={student.marks} max="20" className="input text-center w-20" />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      student.marks >= 16 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                      student.marks >= 12 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                      'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    }`}>
                      {student.marks >= 16 ? 'Excellent' : student.marks >= 12 ? 'Good' : 'Needs Improvement'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageTestMarks;
