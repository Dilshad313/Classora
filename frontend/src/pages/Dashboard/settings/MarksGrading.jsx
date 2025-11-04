import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Save, 
  Plus, 
  Trash2, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit3,
  Home,
  ChevronRight,
  TrendingUp,
  Award,
  BarChart3
} from 'lucide-react';

export const MarksGrading = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('marksGrading');
  const [gradingSystem, setGradingSystem] = useState([
    { id: 1, grade: 'A+', minMarks: 80, maxMarks: 100, status: 'PASS', isEditing: false },
    { id: 2, grade: 'A', minMarks: 70, maxMarks: 79, status: 'PASS', isEditing: false },
    { id: 3, grade: 'B+', minMarks: 60, maxMarks: 69, status: 'PASS', isEditing: false },
    { id: 4, grade: 'B', minMarks: 50, maxMarks: 59, status: 'PASS', isEditing: false },
    { id: 5, grade: 'C', minMarks: 40, maxMarks: 49, status: 'PASS', isEditing: false },
    { id: 6, grade: 'D', minMarks: 33, maxMarks: 39, status: 'PASS', isEditing: false },
    { id: 7, grade: 'F', minMarks: 0, maxMarks: 32, status: 'FAIL', isEditing: false }
  ]);

  const [newGrade, setNewGrade] = useState({
    grade: '',
    minMarks: '',
    maxMarks: '',
    status: 'PASS'
  });

  const [errors, setErrors] = useState({});
  const [isModified, setIsModified] = useState(false);

  const handleGradeChange = (id, field, value) => {
    setGradingSystem(prev => 
      prev.map(grade => 
        grade.id === id 
          ? { ...grade, [field]: value }
          : grade
      )
    );
    setIsModified(true);
  };

  const handleAddGrade = () => {
    // Validation
    const newErrors = {};
    if (!newGrade.grade.trim()) newErrors.grade = 'Grade is required';
    if (!newGrade.minMarks) newErrors.minMarks = 'Minimum marks is required';
    if (!newGrade.maxMarks) newErrors.maxMarks = 'Maximum marks is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const minMarks = parseInt(newGrade.minMarks);
    const maxMarks = parseInt(newGrade.maxMarks);

    if (minMarks > maxMarks) {
      setErrors({ range: 'Minimum marks cannot be greater than maximum marks' });
      return;
    }

    // Check for overlapping ranges
    const hasOverlap = gradingSystem.some(grade => 
      (minMarks >= grade.minMarks && minMarks <= grade.maxMarks) ||
      (maxMarks >= grade.minMarks && maxMarks <= grade.maxMarks) ||
      (minMarks <= grade.minMarks && maxMarks >= grade.maxMarks)
    );

    if (hasOverlap) {
      setErrors({ range: 'Grade range overlaps with existing grades' });
      return;
    }

    const newGradeItem = {
      id: Date.now(),
      grade: newGrade.grade.toUpperCase(),
      minMarks: minMarks,
      maxMarks: maxMarks,
      status: newGrade.status,
      isEditing: false
    };

    setGradingSystem(prev => [...prev, newGradeItem]);
    setNewGrade({ grade: '', minMarks: '', maxMarks: '', status: 'PASS' });
    setErrors({});
    setIsModified(true);
  };

  const handleRemoveGrade = (id) => {
    if (gradingSystem.length <= 1) {
      alert('Cannot remove all grade entries');
      return;
    }
    setGradingSystem(prev => prev.filter(grade => grade.id !== id));
    setIsModified(true);
  };

  const handleSave = () => {
    // Validate all grades
    const validationErrors = [];
    
    // Check for gaps in grading system
    const sortedGrades = [...gradingSystem].sort((a, b) => a.minMarks - b.minMarks);
    
    for (let i = 0; i < sortedGrades.length - 1; i++) {
      const current = sortedGrades[i];
      const next = sortedGrades[i + 1];
      
      if (current.maxMarks + 1 !== next.minMarks) {
        validationErrors.push(`Gap between ${current.grade} (${current.maxMarks}) and ${next.grade} (${next.minMarks})`);
      }
    }

    // Check if starts from 0 and ends at 100
    if (sortedGrades[0].minMarks !== 0) {
      validationErrors.push('Grading system should start from 0');
    }
    
    if (sortedGrades[sortedGrades.length - 1].maxMarks !== 100) {
      validationErrors.push('Grading system should end at 100');
    }

    if (validationErrors.length > 0) {
      alert(`Please fix the following issues:\n${validationErrors.join('\n')}`);
      return;
    }

    // Save logic here
    console.log('Saving grading system:', gradingSystem);
    setIsModified(false);
    alert('Grading system saved successfully!');
  };

  const getStatusIcon = (status) => {
    return status === 'PASS' 
      ? <CheckCircle className="w-4 h-4 text-green-500" />
      : <XCircle className="w-4 h-4 text-red-500" />;
  };

  const getStatusColor = (status) => {
    return status === 'PASS' 
      ? 'text-green-600 bg-green-50 border-green-200'
      : 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-blue-50/40 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-blue-600 dark:text-blue-400 font-semibold">General Settings</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 dark:text-white font-semibold">Marks Grading</span>
        </div>

        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                  Marks Grading System
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Configure grade ranges and pass/fail criteria
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 px-4 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <span className="text-red-500 font-semibold text-sm">* Required</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600 dark:text-gray-400 text-sm">Optional</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 p-2">
            <nav className="flex gap-2">
              <button
                onClick={() => setActiveTab('marksGrading')}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                  activeTab === 'marksGrading'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Award className="w-4 h-4" />
                Marks Grading
              </button>
              <button
                onClick={() => setActiveTab('failCriteria')}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                  activeTab === 'failCriteria'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Fail Criteria
              </button>
            </nav>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
          {/* Content */}
          <div className="p-8">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <Award className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                Customize Grading
              </h2>
            </div>

            {/* Grading Table */}
            <div className="mb-8">
              <div className="overflow-hidden border-2 border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">
                        Grade
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">
                        Minimum Marks
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">
                        Maximum Marks
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">
                        Status
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-bold text-gray-900 dark:text-white">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {gradingSystem.map((gradeItem) => (
                      <tr key={gradeItem.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            value={gradeItem.grade}
                            onChange={(e) => handleGradeChange(gradeItem.id, 'grade', e.target.value)}
                            className="w-20 px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-sm font-bold text-center focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-900/50 dark:text-white transition-all"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            value={gradeItem.minMarks}
                            onChange={(e) => handleGradeChange(gradeItem.id, 'minMarks', parseInt(e.target.value) || 0)}
                            min="0"
                            max="100"
                            className="w-24 px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-900/50 dark:text-white transition-all"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            value={gradeItem.maxMarks}
                            onChange={(e) => handleGradeChange(gradeItem.id, 'maxMarks', parseInt(e.target.value) || 0)}
                            min="0"
                            max="100"
                            className="w-24 px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-900/50 dark:text-white transition-all"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={gradeItem.status}
                            onChange={(e) => handleGradeChange(gradeItem.id, 'status', e.target.value)}
                            className={`px-3 py-2 border-2 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all ${
                              getStatusColor(gradeItem.status)
                            }`}
                          >
                            <option value="PASS">PASS</option>
                            <option value="FAIL">FAIL</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => handleRemoveGrade(gradeItem.id)}
                            className="p-2.5 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30 rounded-xl transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={gradingSystem.length <= 1}
                            title="Delete Grade"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Error Display */}
              {errors.range && (
                <div className="mt-3 flex items-center space-x-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.range}</span>
                </div>
              )}
            </div>

            {/* Add New Grade Section */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-6 mb-8 border border-emerald-200 dark:border-emerald-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Add More Options
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Grade */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Grade <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newGrade.grade}
                    onChange={(e) => {
                      setNewGrade(prev => ({ ...prev, grade: e.target.value }));
                      setErrors(prev => ({ ...prev, grade: '' }));
                    }}
                    placeholder="e.g., A+"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-900/50 dark:text-white transition-all ${
                      errors.grade ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                    }`}
                  />
                  {errors.grade && (
                    <p className="mt-1 text-sm text-red-600">{errors.grade}</p>
                  )}
                </div>

                {/* Min Marks */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Min Marks <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={newGrade.minMarks}
                    onChange={(e) => {
                      setNewGrade(prev => ({ ...prev, minMarks: e.target.value }));
                      setErrors(prev => ({ ...prev, minMarks: '' }));
                    }}
                    min="0"
                    max="100"
                    placeholder="0"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-900/50 dark:text-white transition-all ${
                      errors.minMarks ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                    }`}
                  />
                  {errors.minMarks && (
                    <p className="mt-1 text-sm text-red-600">{errors.minMarks}</p>
                  )}
                </div>

                {/* Max Marks */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Max Marks <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={newGrade.maxMarks}
                    onChange={(e) => {
                      setNewGrade(prev => ({ ...prev, maxMarks: e.target.value }));
                      setErrors(prev => ({ ...prev, maxMarks: '' }));
                    }}
                    min="0"
                    max="100"
                    placeholder="100"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-900/50 dark:text-white transition-all ${
                      errors.maxMarks ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                    }`}
                  />
                  {errors.maxMarks && (
                    <p className="mt-1 text-sm text-red-600">{errors.maxMarks}</p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Status
                  </label>
                  <select
                    value={newGrade.status}
                    onChange={(e) => setNewGrade(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-900/50 dark:text-white transition-all font-semibold"
                  >
                    <option value="PASS">PASS</option>
                    <option value="FAIL">FAIL</option>
                  </select>
                </div>

                {/* Add Button */}
                <div className="flex items-end">
                  <button
                    onClick={handleAddGrade}
                    className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add Grade</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-6 border-t-2 border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 text-sm">
                {isModified && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-xl border border-orange-200 dark:border-orange-800 animate-pulse">
                    <AlertCircle className="w-4 h-4" />
                    <span className="font-semibold">Unsaved changes</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setGradingSystem([
                      { id: 1, grade: 'A+', minMarks: 80, maxMarks: 100, status: 'PASS', isEditing: false },
                      { id: 2, grade: 'A', minMarks: 70, maxMarks: 79, status: 'PASS', isEditing: false },
                      { id: 3, grade: 'B+', minMarks: 60, maxMarks: 69, status: 'PASS', isEditing: false },
                      { id: 4, grade: 'B', minMarks: 50, maxMarks: 59, status: 'PASS', isEditing: false },
                      { id: 5, grade: 'C', minMarks: 40, maxMarks: 49, status: 'PASS', isEditing: false },
                      { id: 6, grade: 'D', minMarks: 33, maxMarks: 39, status: 'PASS', isEditing: false },
                      { id: 7, grade: 'F', minMarks: 0, maxMarks: 32, status: 'FAIL', isEditing: false }
                    ]);
                    setIsModified(false);
                  }}
                  className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all font-semibold hover:scale-105 active:scale-95"
                >
                  Reset to Default
                </button>
                <button
                  onClick={handleSave}
                  disabled={!isModified}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
                    !isModified
                      ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500 dark:text-gray-500'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
                  }`}
                >
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarksGrading;