import { IdCard, Download, Search } from 'lucide-react';

const StudentReportCard = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Students Report Card</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Generate comprehensive student report cards</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Download className="w-5 h-5" />
          Download All
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
            <option>Select Term</option>
            <option>First Term</option>
            <option>Second Term</option>
            <option>Final Term</option>
          </select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search student..." className="input pl-10" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map(i => (
          <div key={i} className="card">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  J
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">John Doe</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Roll No: 001 | Class: 10-A</p>
                </div>
              </div>
              <button className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50">
                <Download className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                <span className="text-sm text-gray-600 dark:text-gray-400">Mathematics</span>
                <span className="font-semibold text-gray-800 dark:text-gray-100">85/100</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                <span className="text-sm text-gray-600 dark:text-gray-400">English</span>
                <span className="font-semibold text-gray-800 dark:text-gray-100">90/100</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                <span className="text-sm text-gray-600 dark:text-gray-400">Science</span>
                <span className="font-semibold text-gray-800 dark:text-gray-100">88/100</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-lg font-bold text-gray-800 dark:text-gray-100">263/300</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Percentage</p>
                <p className="text-lg font-bold text-primary-600 dark:text-primary-400">87.7%</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Grade</p>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">A</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentReportCard;
