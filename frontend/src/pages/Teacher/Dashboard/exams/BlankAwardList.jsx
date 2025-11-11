import { FileBadge, Download, Printer } from 'lucide-react';

const BlankAwardList = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Blank Award List</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Generate blank award certificates</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary flex items-center gap-2">
            <Printer className="w-5 h-5" />
            Print
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Download className="w-5 h-5" />
            Download
          </button>
        </div>
      </div>

      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select className="input">
            <option>Select Award Type</option>
            <option>Best Student</option>
            <option>Perfect Attendance</option>
            <option>Academic Excellence</option>
          </select>
          <select className="input">
            <option>Select Class</option>
            <option>Class 10-A</option>
            <option>Class 9-B</option>
          </select>
          <input type="number" placeholder="Number of certificates" className="input" />
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Preview</h3>
        <div className="border-4 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
          <FileBadge className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Select options above to preview certificate</p>
        </div>
      </div>
    </div>
  );
};

export default BlankAwardList;
