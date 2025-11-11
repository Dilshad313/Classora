import { FileSpreadsheet, Download } from 'lucide-react';

const ResultSheet = () => {
  const students = [
    { id: 1, name: 'John Doe', rollNo: '001', math: 85, english: 90, science: 88, total: 263, percentage: 87.7, grade: 'A' },
    { id: 2, name: 'Jane Smith', rollNo: '002', math: 92, english: 88, science: 95, total: 275, percentage: 91.7, grade: 'A+' },
    { id: 3, name: 'Mike Johnson', rollNo: '003', math: 78, english: 82, science: 80, total: 240, percentage: 80.0, grade: 'B+' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Result Sheet</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">View comprehensive result sheet</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export to Excel
        </button>
      </div>

      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select className="input">
            <option>Select Exam</option>
            <option>Mid-term Examination</option>
            <option>Final Examination</option>
          </select>
          <select className="input">
            <option>Select Class</option>
            <option>Class 10-A</option>
            <option>Class 9-B</option>
          </select>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Roll No</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Student Name</th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Math</th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">English</th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Science</th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Total</th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">%</th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Grade</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">{student.rollNo}</td>
                <td className="py-3 px-4 text-sm font-medium text-gray-800 dark:text-gray-100">{student.name}</td>
                <td className="py-3 px-4 text-center text-sm text-gray-700 dark:text-gray-300">{student.math}</td>
                <td className="py-3 px-4 text-center text-sm text-gray-700 dark:text-gray-300">{student.english}</td>
                <td className="py-3 px-4 text-center text-sm text-gray-700 dark:text-gray-300">{student.science}</td>
                <td className="py-3 px-4 text-center text-sm font-semibold text-gray-800 dark:text-gray-100">{student.total}</td>
                <td className="py-3 px-4 text-center text-sm font-bold text-primary-600 dark:text-primary-400">{student.percentage}%</td>
                <td className="py-3 px-4 text-center">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    student.grade === 'A+' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                    student.grade === 'A' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                    'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                  }`}>
                    {student.grade}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultSheet;
