import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Star, Users, Save, Search, Award, TrendingUp, BarChart3, UserCheck, Loader2 } from 'lucide-react';
import { behaviourApi } from '../../../../services/behaviourApi';

const RateBehaviours = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [classes, setClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);

  const behaviourCriteria = [
    'Discipline', 'Punctuality', 'Respect', 'Cooperation', 'Leadership'
  ];

  // ratings state: { [studentId]: { [criteria]: number } }
  const [ratings, setRatings] = useState({});

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch =
        !searchTerm ||
        student.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [students, searchTerm]);

  useEffect(() => {
    const loadClasses = async () => {
      try {
        setLoadingClasses(true);
        const data = await behaviourApi.getTeacherClasses();
        setClasses(data || []);
      } catch (error) {
        console.error('Failed to load classes', error);
        toast.error(error.message || 'Failed to load classes');
      } finally {
        setLoadingClasses(false);
      }
    };

    loadClasses();
  }, []);

  const loadStudents = async (classId) => {
    if (!classId) {
      setStudents([]);
      setRatings({});
      return;
    }
    try {
      setLoadingStudents(true);
      const data = await behaviourApi.getClassStudentsWithRatings(classId);
      setStudents(data || []);

      const prefill = {};
      data.forEach(stu => {
        prefill[stu._id] = {};
        Object.entries(stu.ratings || {}).forEach(([criteria, value]) => {
          prefill[stu._id][criteria] = Number(value);
        });
      });
      setRatings(prefill);
    } catch (error) {
      console.error('Failed to load students', error);
      toast.error(error.message || 'Failed to load students');
      setStudents([]);
      setRatings({});
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleRating = (studentId, criteria, rating) => {
    setRatings(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [criteria]: rating
      }
    }));
  };

  const handleClassChange = (e) => {
    const value = e.target.value;
    setSelectedClass(value);
    loadStudents(value);
  };

  const handleSave = async () => {
    if (!selectedClass) {
      toast.error('Please select a class first');
      return;
    }
    const payload = {
      classId: selectedClass,
      ratings: students.map(stu => ({
        studentId: stu._id,
        ratings: ratings[stu._id] || {}
      }))
    };
    try {
      setSaving(true);
      await behaviourApi.saveBehaviourRatings(payload);
      toast.success('Ratings saved successfully');
      await loadStudents(selectedClass);
    } catch (error) {
      console.error('Save ratings failed', error);
      toast.error(error.message || 'Failed to save ratings');
    } finally {
      setSaving(false);
    }
  };

  const totalStudents = students.length;
  const ratedCount = Object.values(ratings).filter(r => Object.keys(r || {}).length > 0).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-800 dark:to-pink-800 rounded-2xl shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative px-8 py-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Rate Student Behaviours</h1>
                <p className="text-purple-100 text-lg">Evaluate student behaviour and conduct with precision</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-purple-100">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                <span>Comprehensive Assessment</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span>Progress Tracking</span>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving || loadingStudents || !selectedClass}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {saving ? 'Saving...' : 'Save Ratings'}
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Students</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{totalStudents}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <Award className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Rated Today</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{ratedCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {students.length
                    ? (students.reduce((sum, stu) => {
                        const vals = Object.values(ratings[stu._id] || {});
                        if (!vals.length) return sum;
                        return sum + vals.reduce((a, b) => a + b, 0) / vals.length;
                      }, 0) / students.length).toFixed(1)
                    : '0.0'}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Improvement</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">+15%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Filter Students</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Select class and search for specific students</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Users className="w-4 h-4 inline mr-2 text-purple-600 dark:text-purple-400" />
                  Select Class
                </label>
                {loadingClasses ? (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading classes...
                  </div>
                ) : (
                  <select 
                    value={selectedClass} 
                    onChange={handleClassChange} 
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                  >
                    <option value="">Select a class</option>
                    {classes.map(cls => (
                      <option key={cls._id} value={cls._id}>
                        {cls.className}{cls.section ? ` - ${cls.section}` : ''}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Search className="w-4 h-4 inline mr-2 text-blue-600 dark:text-blue-400" />
                  Search Student
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search by name or roll number..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Rating Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Behaviour Rating Matrix</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Rate each student on different behaviour criteria (1-5 stars)</p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50">
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700 dark:text-gray-300 min-w-[200px]">Student Information</th>
                  {behaviourCriteria.map(criteria => (
                    <th key={criteria} className="text-center py-4 px-4 text-sm font-bold text-gray-700 dark:text-gray-300 min-w-[140px]">
                      <div className="flex flex-col items-center gap-1">
                        <span>{criteria}</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star key={star} className="w-3 h-3 text-yellow-400" fill="currentColor" />
                          ))}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loadingStudents ? (
                  <tr>
                    <td colSpan={behaviourCriteria.length + 1} className="py-8 text-center text-gray-600 dark:text-gray-300">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" /> Loading students...
                      </div>
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={behaviourCriteria.length + 1} className="py-8 text-center text-gray-600 dark:text-gray-300">
                      {selectedClass ? 'No students found for this class' : 'Select a class to view students'}
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map(student => (
                  <tr key={student._id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {student.studentName?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{student.studentName}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Roll No: {student.rollNumber || 'N/A'}</p>
                          <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                            Class {student.selectClass}{student.section ? ` - ${student.section}` : ''}
                          </p>
                        </div>
                      </div>
                    </td>
                    {behaviourCriteria.map(criteria => (
                      <td key={criteria} className="py-4 px-4">
                        <div className="flex flex-col items-center gap-3">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(rating => (
                              <button
                                key={rating}
                                onClick={() => handleRating(student._id, criteria, rating)}
                                className={`w-7 h-7 rounded-full transition-all duration-200 transform hover:scale-110 ${
                                  (ratings[student._id]?.[criteria] || 0) >= rating
                                    ? 'bg-yellow-400 text-yellow-800 shadow-lg'
                                    : 'bg-gray-200 dark:bg-gray-600 text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-500'
                                }`}
                                title={`Rate ${rating} star${rating !== 1 ? 's' : ''}`}
                              >
                                <Star className="w-4 h-4 mx-auto" fill="currentColor" />
                              </button>
                            ))}
                          </div>
                          <div className="text-center">
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                              ratings[student._id]?.[criteria] 
                                ? ratings[student._id][criteria] >= 4 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                  : ratings[student._id][criteria] >= 3
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                            }`}>
                              {ratings[student._id]?.[criteria] 
                                ? `${ratings[student._id][criteria]} Star${ratings[student._id][criteria] !== 1 ? 's' : ''}`
                                : 'Not Rated'
                              }
                            </span>
                          </div>
                        </div>
                      </td>
                    ))}
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateBehaviours;
