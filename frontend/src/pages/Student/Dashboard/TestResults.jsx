import { useState, useEffect } from 'react';
import { 
  ClipboardList, TrendingUp, Calendar, Filter, Search, 
  Download, Eye, BarChart3, Target, Award, Clock
} from 'lucide-react';

const TestResults = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [selectedTest, setSelectedTest] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    setLoading(false);
  }, []);

  // Mock test results data
  const testResults = [
    {
      id: 1,
      testName: 'Unit Test 1 - Algebra',
      subject: 'Mathematics',
      date: '2024-11-10',
      maxMarks: 50,
      obtainedMarks: 47,
      grade: 'A+',
      rank: 2,
      totalStudents: 45,
      duration: '2 hours',
      type: 'Unit Test',
      topics: ['Linear Equations', 'Quadratic Equations', 'Polynomials'],
      feedback: 'Excellent performance in problem-solving. Minor calculation errors in question 3.'
    },
    {
      id: 2,
      testName: 'Lab Test - Optics',
      subject: 'Physics',
      date: '2024-11-08',
      maxMarks: 30,
      obtainedMarks: 26,
      grade: 'A',
      rank: 5,
      totalStudents: 45,
      duration: '1.5 hours',
      type: 'Lab Test',
      topics: ['Reflection', 'Refraction', 'Lens Formula'],
      feedback: 'Good practical skills. Need to improve observation recording.'
    },
    {
      id: 3,
      testName: 'Weekly Quiz - Organic Chemistry',
      subject: 'Chemistry',
      date: '2024-11-05',
      maxMarks: 25,
      obtainedMarks: 23,
      grade: 'A+',
      rank: 1,
      totalStudents: 45,
      duration: '45 minutes',
      type: 'Quiz',
      topics: ['Hydrocarbons', 'Functional Groups', 'IUPAC Nomenclature'],
      feedback: 'Outstanding understanding of organic chemistry concepts.'
    },
    {
      id: 4,
      testName: 'Monthly Test - Cell Biology',
      subject: 'Biology',
      date: '2024-11-03',
      maxMarks: 40,
      obtainedMarks: 35,
      grade: 'A',
      rank: 4,
      totalStudents: 45,
      duration: '1.5 hours',
      type: 'Monthly Test',
      topics: ['Cell Structure', 'Cell Division', 'Photosynthesis'],
      feedback: 'Good grasp of concepts. Improve diagram labeling skills.'
    },
    {
      id: 5,
      testName: 'Literature Test - Poetry',
      subject: 'English',
      date: '2024-11-01',
      maxMarks: 35,
      obtainedMarks: 32,
      grade: 'A+',
      rank: 3,
      totalStudents: 45,
      duration: '2 hours',
      type: 'Literature Test',
      topics: ['Romantic Poetry', 'Literary Devices', 'Critical Analysis'],
      feedback: 'Excellent analytical skills and creative interpretation.'
    }
  ];

  const subjects = ['all', ...new Set(testResults.map(test => test.subject))];
  
  const filteredResults = testResults.filter(test => {
    const matchesSearch = test.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject === 'all' || test.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A+': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'A': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
      case 'B+': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'B': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getSubjectColor = (subject) => {
    const colors = {
      'Mathematics': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      'Physics': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
      'Chemistry': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      'Biology': 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
      'English': 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
    };
    return colors[subject] || 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
  };

  const averagePercentage = (filteredResults.reduce((sum, test) => sum + (test.obtainedMarks / test.maxMarks * 100), 0) / filteredResults.length).toFixed(1);
  const totalTests = filteredResults.length;
  const averageRank = (filteredResults.reduce((sum, test) => sum + test.rank, 0) / filteredResults.length).toFixed(1);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <ClipboardList className="w-7 h-7 text-blue-600" />
            Test Results
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View your test scores and performance analysis
          </p>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Average Score</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{averagePercentage}%</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Tests</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{totalTests}</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-2 border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Average Rank</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">#{averageRank}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tests..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="input-field md:w-48"
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
          >
            {subjects.map(subject => (
              <option key={subject} value={subject}>
                {subject === 'all' ? 'All Subjects' : subject}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Test Results List */}
      <div className="space-y-4">
        {filteredResults.length === 0 ? (
          <div className="card text-center py-12">
            <ClipboardList className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No test results found
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          filteredResults.map((test) => (
            <div key={test.id} className="card hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        {test.testName}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSubjectColor(test.subject)}`}>
                          {test.subject}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{test.type}</span>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(test.grade)}`}>
                      {test.grade}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Score</p>
                      <p className="font-semibold text-gray-800 dark:text-gray-100">
                        {test.obtainedMarks}/{test.maxMarks}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Percentage</p>
                      <p className="font-semibold text-green-600 dark:text-green-400">
                        {((test.obtainedMarks / test.maxMarks) * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Rank</p>
                      <p className="font-semibold text-purple-600 dark:text-purple-400">
                        #{test.rank}/{test.totalStudents}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Date</p>
                      <p className="font-semibold text-gray-800 dark:text-gray-100">
                        {new Date(test.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Duration</p>
                      <p className="font-semibold text-gray-800 dark:text-gray-100">{test.duration}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedTest(test)}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  <button
                    onClick={() => {
                      const element = document.createElement('a');
                      const file = new Blob(['Test Result Details'], { type: 'text/plain' });
                      element.href = URL.createObjectURL(file);
                      element.download = `${test.testName.replace(/\s+/g, '-')}-result.pdf`;
                      document.body.appendChild(element);
                      element.click();
                      document.body.removeChild(element);
                    }}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Test Detail Modal */}
      {selectedTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Test Details</h2>
                <button
                  onClick={() => setSelectedTest(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Test Info */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                    {selectedTest.testName}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Subject</p>
                      <p className="font-semibold text-gray-800 dark:text-gray-100">{selectedTest.subject}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Test Type</p>
                      <p className="font-semibold text-gray-800 dark:text-gray-100">{selectedTest.type}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Date</p>
                      <p className="font-semibold text-gray-800 dark:text-gray-100">
                        {new Date(selectedTest.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Duration</p>
                      <p className="font-semibold text-gray-800 dark:text-gray-100">{selectedTest.duration}</p>
                    </div>
                  </div>
                </div>

                {/* Performance */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Performance</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {selectedTest.obtainedMarks}/{selectedTest.maxMarks}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Marks Obtained</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {((selectedTest.obtainedMarks / selectedTest.maxMarks) * 100).toFixed(1)}%
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Percentage</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        #{selectedTest.rank}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Class Rank</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <span className={`inline-block px-3 py-1 rounded-full text-lg font-bold ${getGradeColor(selectedTest.grade)}`}>
                        {selectedTest.grade}
                      </span>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Grade</p>
                    </div>
                  </div>
                </div>

                {/* Topics Covered */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Topics Covered</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTest.topics.map((topic, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Teacher Feedback */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Teacher Feedback</h3>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                    <p className="text-gray-700 dark:text-gray-300 italic">
                      "{selectedTest.feedback}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestResults;
