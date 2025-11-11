import { IdCard, Download, Search } from 'lucide-react';

const ResultCard = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Result Card</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Generate and view student result cards</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Download className="w-5 h-5" />
          Download All
        </button>
      </div>

      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search student..." className="input pl-10" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold">
                  J
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">John Doe</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Roll No: 001</p>
                </div>
              </div>
              <button className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50">
                <Download className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Marks:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-100">425/500</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Percentage:</span>
                <span className="font-semibold text-primary-600 dark:text-primary-400">85%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Grade:</span>
                <span className="font-semibold text-green-600 dark:text-green-400">A</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultCard;
