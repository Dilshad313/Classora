import { BarChart3, Download } from 'lucide-react';

const TestResult = () => {
  const results = [
    { id: 1, name: 'John Doe', rollNo: '001', marks: 18, maxMarks: 20, percentage: 90 },
    { id: 2, name: 'Jane Smith', rollNo: '002', marks: 20, maxMarks: 20, percentage: 100 },
    { id: 3, name: 'Mike Johnson', rollNo: '003', marks: 16, maxMarks: 20, percentage: 80 },
  ];

  const avgMarks = (results.reduce((sum, r) => sum + r.marks, 0) / results.length).toFixed(1);
  const avgPercentage = (results.reduce((sum, r) => sum + r.percentage, 0) / results.length).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Test Result</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">View class test results and analytics</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export Results
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
          <select className="input">
            <option>Select Test</option>
            <option>Weekly Test 1</option>
            <option>Weekly Test 2</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Students</p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{results.length}</p>
        </div>
        <div className="card bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">Average Marks</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{avgMarks}/20</p>
        </div>
        <div className="card bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">Average %</p>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{avgPercentage}%</p>
        </div>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Rank</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Roll No</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Student Name</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Marks</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Percentage</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Grade</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={result.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-3 px-4 text-sm font-bold text-gray-700 dark:text-gray-300">#{index + 1}</td>
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">{result.rollNo}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {result.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{result.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {result.marks}/{result.maxMarks}
                  </td>
                  <td className="py-3 px-4 text-center text-sm font-bold text-primary-600 dark:text-primary-400">
                    {result.percentage}%
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      result.percentage >= 90 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                      result.percentage >= 75 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                      result.percentage >= 60 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                      'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    }`}>
                      {result.percentage >= 90 ? 'A+' : result.percentage >= 75 ? 'A' : result.percentage >= 60 ? 'B' : 'C'}
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

export default TestResult;
