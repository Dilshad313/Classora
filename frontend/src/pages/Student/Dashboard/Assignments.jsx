import { useState, useEffect } from 'react';
import { 
  BookMarked, Calendar, Clock, CheckCircle, AlertCircle, 
  Upload, Download, Eye, Filter, Search, Plus, FileText
} from 'lucide-react';

const Assignments = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    setLoading(false);
  }, []);

  // Mock assignments data
  const assignments = [
    {
      id: 1,
      title: 'Quadratic Equations Problem Set',
      subject: 'Mathematics',
      description: 'Solve the given quadratic equations using different methods including factoring, completing the square, and quadratic formula.',
      assignedDate: '2024-11-10',
      dueDate: '2024-11-20',
      status: 'pending',
      priority: 'high',
      maxMarks: 50,
      submittedMarks: null,
      teacher: 'Mr. Johnson',
      attachments: ['quadratic_problems.pdf', 'formula_sheet.pdf'],
      instructions: 'Show all working steps clearly. Submit handwritten solutions.',
      submissionType: 'file'
    },
    {
      id: 2,
      title: 'Physics Lab Report - Optics',
      subject: 'Physics',
      description: 'Write a comprehensive lab report on the refraction experiment conducted in class.',
      assignedDate: '2024-11-08',
      dueDate: '2024-11-18',
      status: 'submitted',
      priority: 'medium',
      maxMarks: 30,
      submittedMarks: 27,
      teacher: 'Dr. Smith',
      attachments: ['lab_format.docx', 'observation_sheet.pdf'],
      instructions: 'Include observations, calculations, and conclusions.',
      submissionType: 'file',
      submittedFile: 'optics_lab_report.pdf',
      submissionDate: '2024-11-17',
      feedback: 'Good analysis and observations. Improve the conclusion section.'
    },
    {
      id: 3,
      title: 'Essay on Environmental Conservation',
      subject: 'English',
      description: 'Write a 500-word essay on the importance of environmental conservation and sustainable practices.',
      assignedDate: '2024-11-05',
      dueDate: '2024-11-15',
      status: 'graded',
      priority: 'medium',
      maxMarks: 25,
      submittedMarks: 23,
      teacher: 'Ms. Davis',
      attachments: ['essay_guidelines.pdf'],
      instructions: 'Use proper grammar and cite sources if any.',
      submissionType: 'text',
      submittedFile: 'environmental_essay.docx',
      submissionDate: '2024-11-14',
      feedback: 'Excellent writing skills and good use of examples. Well structured essay.',
      grade: 'A'
    },
    {
      id: 4,
      title: 'Chemistry Practical - Acid-Base Titration',
      subject: 'Chemistry',
      description: 'Perform acid-base titration and submit the practical record with observations.',
      assignedDate: '2024-11-12',
      dueDate: '2024-11-25',
      status: 'pending',
      priority: 'low',
      maxMarks: 20,
      submittedMarks: null,
      teacher: 'Ms. Brown',
      attachments: ['titration_procedure.pdf', 'record_format.pdf'],
      instructions: 'Complete the practical in the lab and submit the record book.',
      submissionType: 'physical'
    },
    {
      id: 5,
      title: 'Computer Programming - Python Project',
      subject: 'Computer Science',
      description: 'Create a simple calculator application using Python with GUI interface.',
      assignedDate: '2024-11-01',
      dueDate: '2024-11-30',
      status: 'in_progress',
      priority: 'high',
      maxMarks: 40,
      submittedMarks: null,
      teacher: 'Ms. Tech',
      attachments: ['project_requirements.pdf', 'sample_code.py'],
      instructions: 'Include source code, documentation, and demo video.',
      submissionType: 'file'
    }
  ];

  const subjects = ['all', ...new Set(assignments.map(assignment => assignment.subject))];
  
  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus;
    const matchesSubject = filterSubject === 'all' || assignment.subject === filterSubject;
    return matchesSearch && matchesStatus && matchesSubject;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      case 'in_progress': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'submitted': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
      case 'graded': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      case 'submitted': return <Upload className="w-4 h-4" />;
      case 'graded': return <CheckCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const getDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleFileUpload = (assignmentId) => {
    // Mock file upload
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.txt';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // In a real app, you would upload the file to a server
        alert(`File "${file.name}" uploaded successfully!`);
      }
    };
    input.click();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="card">
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
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
            <BookMarked className="w-7 h-7 text-blue-600" />
            Home Assignments
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your homework and assignments
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-2 border-red-200 dark:border-red-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {assignments.filter(a => a.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {assignments.filter(a => a.status === 'in_progress').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Submitted</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {assignments.filter(a => a.status === 'submitted').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Graded</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {assignments.filter(a => a.status === 'graded').length}
              </p>
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
              placeholder="Search assignments..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="input-field md:w-48"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="submitted">Submitted</option>
            <option value="graded">Graded</option>
          </select>
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

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.length === 0 ? (
          <div className="card text-center py-12">
            <BookMarked className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No assignments found
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          filteredAssignments.map((assignment) => {
            const daysRemaining = getDaysRemaining(assignment.dueDate);
            return (
              <div key={assignment.id} className={`card hover:shadow-md transition-shadow border-l-4 ${getPriorityColor(assignment.priority)}`}>
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                          {assignment.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                          {assignment.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-500">
                          <span>{assignment.subject}</span>
                          <span>•</span>
                          <span>{assignment.teacher}</span>
                          <span>•</span>
                          <span>{assignment.maxMarks} marks</span>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(assignment.status)}`}>
                        {getStatusIcon(assignment.status)}
                        {assignment.status.replace('_', ' ').charAt(0).toUpperCase() + assignment.status.replace('_', ' ').slice(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Assigned</p>
                        <p className="font-semibold text-gray-800 dark:text-gray-100">
                          {new Date(assignment.assignedDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Due Date</p>
                        <p className={`font-semibold ${daysRemaining < 0 ? 'text-red-600 dark:text-red-400' : daysRemaining <= 3 ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-800 dark:text-gray-100'}`}>
                          {new Date(assignment.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Days Remaining</p>
                        <p className={`font-semibold ${daysRemaining < 0 ? 'text-red-600 dark:text-red-400' : daysRemaining <= 3 ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'}`}>
                          {daysRemaining < 0 ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days`}
                        </p>
                      </div>
                      {assignment.submittedMarks && (
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Score</p>
                          <p className="font-semibold text-green-600 dark:text-green-400">
                            {assignment.submittedMarks}/{assignment.maxMarks}
                          </p>
                        </div>
                      )}
                    </div>

                    {assignment.attachments && assignment.attachments.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Attachments:</p>
                        <div className="flex flex-wrap gap-2">
                          {assignment.attachments.map((file, index) => (
                            <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                              <FileText className="w-3 h-3" />
                              {file}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedAssignment(assignment)}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    {assignment.status === 'pending' || assignment.status === 'in_progress' ? (
                      <button
                        onClick={() => handleFileUpload(assignment.id)}
                        className="btn-primary flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Submit
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          const element = document.createElement('a');
                          const file = new Blob(['Assignment submission'], { type: 'text/plain' });
                          element.href = URL.createObjectURL(file);
                          element.download = `${assignment.submittedFile || 'submission.pdf'}`;
                          document.body.appendChild(element);
                          element.click();
                          document.body.removeChild(element);
                        }}
                        className="btn-primary flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Assignment Detail Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Assignment Details</h2>
                <button
                  onClick={() => setSelectedAssignment(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    {selectedAssignment.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{selectedAssignment.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Subject</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-100">{selectedAssignment.subject}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Teacher</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-100">{selectedAssignment.teacher}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Max Marks</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-100">{selectedAssignment.maxMarks}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Due Date</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-100">
                      {new Date(selectedAssignment.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Instructions</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{selectedAssignment.instructions}</p>
                </div>

                {selectedAssignment.feedback && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Teacher Feedback</h4>
                    <p className="text-blue-700 dark:text-blue-300 text-sm">{selectedAssignment.feedback}</p>
                    {selectedAssignment.grade && (
                      <p className="text-blue-600 dark:text-blue-400 font-semibold mt-2">
                        Grade: {selectedAssignment.grade}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignments;
