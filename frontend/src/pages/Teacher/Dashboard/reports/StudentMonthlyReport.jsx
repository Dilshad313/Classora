import { FileText, Download, Calendar } from 'lucide-react';

const StudentMonthlyReport = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Student Monthly Report</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">View monthly performance reports</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export Report
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
            <option>Select Month</option>
            <option>January 2024</option>
            <option>December 2023</option>
          </select>
          <select className="input">
            <option>Select Student</option>
            <option>John Doe</option>
            <option>Jane Smith</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800">
          <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Attendance</p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">95%</p>
        </div>
        <div className="card bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800">
          <FileText className="w-8 h-8 text-green-600 dark:text-green-400 mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Homework Completion</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">90%</p>
        </div>
        <div className="card bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-800">
          <FileText className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Test Average</p>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">85%</p>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Subject-wise Performance</h3>
        <div className="space-y-4">
          {['Mathematics', 'English', 'Science'].map((subject, index) => (
            <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-800 dark:text-gray-100">{subject}</span>
                <span className="text-sm font-bold text-primary-600 dark:text-primary-400">85%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-gray-600 dark:text-gray-400">
                <div>Tests: 4/5</div>
                <div>Homework: 9/10</div>
                <div>Attendance: 20/22</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Teacher's Remarks</h3>
        <textarea
          className="input"
          rows="4"
          placeholder="Enter monthly remarks for the student..."
        ></textarea>
        <button className="btn-primary mt-4">Save Remarks</button>
      </div>
    </div>
  );
};

export default StudentMonthlyReport;
