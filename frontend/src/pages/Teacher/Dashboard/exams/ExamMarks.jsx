import { useState } from 'react';
import { Award, Save, Search } from 'lucide-react';

const ExamMarks = () => {
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedClass, setSelectedClass] = useState('');

  const students = [
    { id: 1, name: 'John Doe', rollNo: '001', marks: 85, maxMarks: 100 },
    { id: 2, name: 'Jane Smith', rollNo: '002', marks: 92, maxMarks: 100 },
    { id: 3, name: 'Mike Johnson', rollNo: '003', marks: 78, maxMarks: 100 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Add / Update Exam Marks</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Enter and manage exam marks</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Save className="w-5 h-5" />
          Save Marks
        </button>
      </div>

      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Exam</label>
            <select value={selectedExam} onChange={(e) => setSelectedExam(e.target.value)} className="input">
              <option value="">Select an exam</option>
              <option value="mid-term">Mid-term Examination</option>
              <option value="final">Final Examination</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Class</label>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="input">
              <option value="">Select a class</option>
              <option value="10-A">Class 10-A</option>
              <option value="9-B">Class 9-B</option>
            </select>
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
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Max Marks</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Percentage</th>
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
                    <input type="number" defaultValue={student.marks} className="input text-center w-20" />
                  </td>
                  <td className="py-3 px-4 text-center text-sm text-gray-700 dark:text-gray-300">{student.maxMarks}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                      {((student.marks / student.maxMarks) * 100).toFixed(1)}%
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

export default ExamMarks;
