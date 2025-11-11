import { FileEdit, Save } from 'lucide-react';

const CreateQuestion = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Create Question Paper</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Design and generate question papers</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Save className="w-5 h-5" />
          Save & Generate
        </button>
      </div>

      <div className="card">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Paper Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Paper Title</label>
            <input type="text" className="input" placeholder="e.g., Mid-term Examination" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
            <select className="input">
              <option>Select Subject</option>
              <option>Mathematics</option>
              <option>English</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Class</label>
            <select className="input">
              <option>Select Class</option>
              <option>10-A</option>
              <option>9-B</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Total Marks</label>
            <input type="number" className="input" placeholder="100" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Duration (minutes)</label>
            <input type="number" className="input" placeholder="180" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Exam Date</label>
            <input type="date" className="input" />
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Select Questions</h3>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">Section A: Multiple Choice Questions (20 marks)</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Select 20 questions of 1 mark each</p>
              </div>
              <button className="btn-secondary text-sm">Add Questions</button>
            </div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">Section B: Short Answer Questions (30 marks)</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Select 10 questions of 3 marks each</p>
              </div>
              <button className="btn-secondary text-sm">Add Questions</button>
            </div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">Section C: Long Answer Questions (50 marks)</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Select 10 questions of 5 marks each</p>
              </div>
              <button className="btn-secondary text-sm">Add Questions</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateQuestion;
