import { useState, useEffect } from 'react';
import { BookOpenCheck, Plus, Calendar, Users, FileText, Edit, Trash2, Search, User, GraduationCap, Clock, BookOpen } from 'lucide-react';
import { homeworkApi } from '../../../../services/homeworkApi';
import { classApi } from '../../../../services/classApi';
import { fetchClassesWithSubjects } from '../../../../services/subjectApi';
import toast from 'react-hot-toast';

const Homework = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const loggedInTeacherName = user?.employeeName || user?.name || user?.fullName || user?.username || '';
  const loggedInTeacherId = user?._id || user?.id || user?.userId || '';
  const [searchFilters, setSearchFilters] = useState({
    homeworkDate: '',
    class: '',
    teacher: loggedInTeacherId,
  });
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [formData, setFormData] = useState({
    homeworkDate: '',
    class: '',
    subject: '',
    homeworkDetails: '',
    setBy: loggedInTeacherId,
  });
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState(
    loggedInTeacherId && loggedInTeacherName ? [{ id: loggedInTeacherId, label: loggedInTeacherName }] : []
  );
  const [allHomeworkData, setAllHomeworkData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingHomework, setEditingHomework] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const normalizeTeacherName = (teacher) => {
    if (!teacher) return '';
    if (typeof teacher === 'string') return teacher;
    return teacher.employeeName || teacher.name || teacher.fullName || teacher.username || teacher._id || '';
  };

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        setLoadingDropdowns(true);
        const dropdownData = await homeworkApi.getDropdownData();
        if (dropdownData.success) {
          const classOptions = (dropdownData.data.classes || []).map(cls => ({
            id: cls._id || cls.id || cls.classId,
            label: `${cls.className || cls.name || 'Class'}${cls.section ? ` - ${cls.section}` : ''}`.trim()
          })).filter(c => c.id && c.label);
          setClasses(classOptions);

          const subjectOptions = (dropdownData.data.subjects || []).map(sub => ({
            id: sub._id || sub.id,
            label: sub.name || sub.subjectName || sub.code || ''
          })).filter(sub => sub.id && sub.label);
          setSubjects(subjectOptions);

          const teacherOptions = (dropdownData.data.teachers || []).map(t => ({
            id: t._id,
            label: normalizeTeacherName(t)
          })).filter(t => t.id && t.label);

          const teacherSet = new Map();
          [...teacherOptions, ...(loggedInTeacherId ? [{ id: loggedInTeacherId, label: loggedInTeacherName || 'You' }] : [])]
            .forEach(t => {
              if (t.id && t.label && !teacherSet.has(t.id)) {
                teacherSet.set(t.id, t);
              }
            });
          setTeachers(Array.from(teacherSet.values()));
        }

        // Fallback for classes if dropdown did not return any
        if (!dropdownData.success || !(dropdownData.data.classes || []).length) {
          try {
            const classNames = await classApi.getAllClassNames();
            const normalizedClasses = (classNames || []).map(cls => {
              if (typeof cls === 'string') {
                return { id: cls, label: cls };
              }
              const label = `${cls.className || cls.name || 'Class'}${cls.section ? ` - ${cls.section}` : ''}`;
              return { id: cls._id || cls.className || cls.name, label };
            }).filter(cls => cls.id && cls.label);
            setClasses(normalizedClasses);
          } catch (classError) {
            console.error('Error fetching classes:', classError);
            toast.error('Failed to load classes');
            setClasses([]);
          }
        }

        // Fallback for subjects if still empty: use subject assignment listing
        if (!dropdownData.success || !(dropdownData.data.subjects || []).length) {
          try {
            const assigned = await fetchClassesWithSubjects();
            // Populate classes if still empty
            if (!classes.length) {
              const classOptions = (assigned || []).map(cls => ({
                id: cls._id || cls.classId || cls.id,
                label: `${cls.className || cls.name || 'Class'}${cls.section ? ` - ${cls.section}` : ''}`.trim()
              })).filter(c => c.id && c.label);
              if (classOptions.length) setClasses(classOptions);
            }
            // Flatten subjects
            const subjectMap = new Map();
            (assigned || []).forEach(cls => {
              (cls.subjects || []).forEach(sub => {
                const id = sub._id || sub.id;
                const label = sub.subjectName || sub.name || sub.code || '';
                if (id && label && !subjectMap.has(id)) {
                  subjectMap.set(id, { id, label });
                }
              });
            });
            if (subjectMap.size) {
              setSubjects(Array.from(subjectMap.values()));
            }
          } catch (err) {
            console.error('Fallback subject load failed', err);
          }
        }

        try {
          await fetchHomeworks({
            teacher: loggedInTeacherId || undefined
          });
        } catch (error) {
          console.error('Error fetching homework list:', error);
        }
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
        toast.error('Failed to load necessary data');
      } finally {
        setLoadingDropdowns(false);
      }
    };

    fetchDropdownData();
  }, []);

  const handleFilterChange = (field, value) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getClassName = (homework) => {
    if (!homework) return '';
    const cls = homework.class;
    if (cls && typeof cls === 'object') {
      return `${cls.className || cls.name || ''}${cls.section ? ` - ${cls.section}` : ''}`.trim();
    }
    return cls || '';
  };

  const getSubjectName = (homework) => {
    if (homework?.subjectDisplay) return homework.subjectDisplay;
    const sub = homework?.subject;
    if (homework?.subjectName) return homework.subjectName;
    if (!sub) return 'N/A';
    if (typeof sub === 'object') {
      // try direct fields
      const direct = sub.name || sub.subjectName || sub.code || sub.label || sub.title;
      if (direct) return direct;
      // try lookup by _id on loaded subjects
      const matchObj = subjects.find(s => s.id === sub._id || s._id === sub._id);
      if (matchObj?.label) return matchObj.label;
      return sub._id || 'N/A';
    }
    // fallback lookup from loaded subjects list
    const match = subjects.find(s => s.id === sub || s._id === sub);
    return match?.label || sub || 'N/A';
  };

  const computeSubjectDisplay = (homework) => {
    const sub = homework?.subject;
    if (homework?.subjectName) return homework.subjectName;
    if (!sub) return 'N/A';
    if (typeof sub === 'object') {
      const direct = sub.name || sub.subjectName || sub.code || sub.label || sub.title;
      if (direct) return direct;
      const matchObj = subjects.find(s => s.id === sub._id || s._id === sub._id);
      if (matchObj?.label) return matchObj.label;
      return sub._id || 'N/A';
    }
    const match = subjects.find(s => s.id === sub || s._id === sub);
    return match?.label || sub || 'N/A';
  };

  const handleSearch = async () => {
    await fetchHomeworks({
      date: searchFilters.homeworkDate || undefined,
      class: searchFilters.class || undefined,
      teacher: searchFilters.teacher || undefined
    });
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (field === 'class') {
      loadSubjectsForClass(value);
    }
  };

  const resetForm = () => {
    setFormData({
      homeworkDate: '',
      class: '',
      subject: '',
      homeworkDetails: '',
      setBy: loggedInTeacherId,
    });
    setEditingHomework(null);
  };

  const fetchHomeworks = async (filters = {}) => {
    try {
      setLoading(true);
      const response = await homeworkApi.getHomeworks(filters);
      if (response?.success) {
        const homeworkList = (response.data || []).map(hw => ({
          ...hw,
          subjectDisplay: computeSubjectDisplay(hw),
        }));
        setAllHomeworkData(homeworkList);
        setSearchResults(homeworkList);
        setHasSearched(true);
      }
    } catch (error) {
      console.error('Error fetching homework list:', error);
      toast.error(error.message || 'Failed to fetch homework');
    } finally {
      setLoading(false);
    }
  };

  const loadSubjectsForClass = async (classId) => {
    if (!classId) return;
    try {
      const dropdownData = await homeworkApi.getDropdownData({ classId });
      if (dropdownData.success) {
        const subjectOptions = (dropdownData.data.subjects || []).map(sub => ({
          id: sub._id || sub.id,
          label: sub.name || sub.subjectName || sub.code || ''
        })).filter(sub => sub.id && sub.label);
        setSubjects(subjectOptions);
      }
    } catch (error) {
      console.error('Failed to load subjects for class', error);
    }
  };

  const handleAddOrUpdateHomework = async () => {
    if (!formData.homeworkDate || !formData.class || !formData.subject || !formData.homeworkDetails || !formData.setBy) {
      toast.error('Please fill in all required fields');
      return;
    }

    const payload = {
      date: formData.homeworkDate,
      class: formData.class,
      subject: formData.subject,
      teacher: formData.setBy,
      details: formData.homeworkDetails,
    };

    try {
      setSaving(true);
      if (editingHomework) {
        const res = await homeworkApi.updateHomework(editingHomework._id, payload);
        if (res?.success) {
          toast.success('Homework updated');
          const updated = { ...res.data, subjectDisplay: computeSubjectDisplay(res.data) };
          setAllHomeworkData(prev => prev.map(hw => hw._id === updated._id ? updated : hw));
          setSearchResults(prev => prev.map(hw => hw._id === updated._id ? updated : hw));
        }
      } else {
        const res = await homeworkApi.createHomework(payload);
        if (res?.success) {
          toast.success('Homework added');
          const newHw = { ...res.data, subjectDisplay: computeSubjectDisplay(res.data) };
          setAllHomeworkData(prev => [newHw, ...prev]);
          setSearchResults(prev => [newHw, ...prev]);
          setHasSearched(true);
        }
      }
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('Failed to save homework', error);
      toast.error(error.message || 'Failed to save homework');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (homework) => {
    if (!homework) return;
    setEditingHomework(homework);
    setFormData({
      homeworkDate: homework.date ? homework.date.slice(0, 10) : '',
      class: homework.class?._id || homework.class || '',
      subject: homework.subject?._id || homework.subject || '',
      homeworkDetails: homework.details || '',
      setBy: homework.teacher?._id || loggedInTeacherId,
    });
    setShowAddModal(true);
    if (homework.class?._id || homework.class) {
      loadSubjectsForClass(homework.class?._id || homework.class);
    }
  };

  const handleDelete = (homework) => {
    setDeleteTarget(homework);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 rounded-2xl shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative px-8 py-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <BookOpenCheck className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Homework Management</h1>
                <p className="text-blue-100 text-lg">Search, manage, and assign homework with ease</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-blue-100">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                <span>Academic Excellence</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>Efficient Management</span>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        </div>

        {/* Enhanced Add Homework Button */}
        <div className="flex justify-end">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Homework
          </button>
        </div>

        {/* Enhanced Search Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Search Homework</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Filter homework by date, class, and teacher</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Calendar className="w-4 h-4 inline mr-2 text-blue-600 dark:text-blue-400" />
                  Homework Date
                </label>
                <input
                  type="date"
                  value={searchFilters.homeworkDate}
                  onChange={(e) => handleFilterChange('homeworkDate', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Users className="w-4 h-4 inline mr-2 text-green-600 dark:text-green-400" />
                  Class
                </label>
                <select
                  value={searchFilters.class}
                  onChange={(e) => handleFilterChange('class', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-500/20 dark:focus:ring-green-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                >
                  <option value="">Select Class</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <User className="w-4 h-4 inline mr-2 text-purple-600 dark:text-purple-400" />
                  Teacher
                </label>
                <select
                  value={searchFilters.teacher}
                  onChange={(e) => handleFilterChange('teacher', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                >
                  <option value="">Select Teacher</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>{teacher.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Search Results */}
        {hasSearched && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Homework Results</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {loading ? 'Loading...' : searchResults.length > 0 ? `Found ${searchResults.length} homework assignment${searchResults.length !== 1 ? 's' : ''}` : 'No results found'}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              {searchResults.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BookOpenCheck className="w-12 h-12 text-gray-400" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No data found!</h4>
                  <p className="text-gray-500 dark:text-gray-500 max-w-md mx-auto">
                    Try adjusting your search criteria to find homework assignments. Make sure the date, class, and teacher filters are set correctly.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {searchResults.map((homework) => (
                    <div key={homework._id} className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        <div className="flex-1">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 mb-2">
                                <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Teacher Name</p>
                              </div>
                              <p className="text-lg font-bold text-gray-800 dark:text-gray-100 pl-6">
                                {normalizeTeacherName(homework.teacher) || homework.teacherName || 'N/A'}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
                                <p className="text-sm font-medium text-green-600 dark:text-green-400">Class</p>
                              </div>
                              <p className="text-lg font-bold text-gray-800 dark:text-gray-100 pl-6">{getClassName(homework)}</p>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Date of Assignment</p>
                              </div>
                              <p className="text-lg font-bold text-gray-800 dark:text-gray-100 pl-6">
                                {homework.date ? new Date(homework.date).toLocaleDateString('en-US', { 
                                  weekday: 'long', 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                }) : 'N/A'}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 mb-2">
                                <BookOpen className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Subject</p>
                              </div>
                              <p className="text-lg font-bold text-gray-800 dark:text-gray-100 pl-6">
                                {getSubjectName(homework)}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                              <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Homework Details</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 shadow-inner">
                              <p className="text-gray-800 dark:text-gray-100 leading-relaxed">{homework.details || homework.homeworkDetails}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex lg:flex-col gap-3">
                          <button
                            onClick={() => handleEdit(homework)}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                            title="Edit Homework"
                          >
                            <Edit className="w-5 h-5" />
                            <span className="hidden sm:inline">Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(homework)}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                            title="Delete Homework"
                          >
                            <Trash2 className="w-5 h-5" />
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Enhanced Add Homework Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-3xl w-full border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 px-8 py-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{editingHomework ? 'Edit Homework' : 'Add Homework or Assignment'}</h3>
                    <p className="text-blue-100 mt-1">{editingHomework ? 'Update the homework details' : 'Create a new homework assignment for your students'}</p>
                  </div>
                </div>
              </div>
              
              {/* Modal Body */}
              <div className="p-8">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <Calendar className="w-4 h-4 inline mr-2 text-blue-600 dark:text-blue-400" />
                        Homework Date
                      </label>
                      <input
                        type="date"
                        value={formData.homeworkDate}
                        onChange={(e) => handleFormChange('homeworkDate', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <User className="w-4 h-4 inline mr-2 text-green-600 dark:text-green-400" />
                        Set By
                      </label>
                      <select
                        value={formData.setBy}
                        onChange={(e) => handleFormChange('setBy', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-500/20 dark:focus:ring-green-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                      >
                        <option value="">Select Teacher</option>
                        {teachers.map(teacher => (
                          <option key={teacher.id} value={teacher.id}>{teacher.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <Users className="w-4 h-4 inline mr-2 text-purple-600 dark:text-purple-400" />
                        Class
                      </label>
                      <select
                        value={formData.class}
                        onChange={(e) => handleFormChange('class', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                      >
                        <option value="">Select Class</option>
                        {classes.map(cls => (
                          <option key={cls.id} value={cls.id}>{cls.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <BookOpen className="w-4 h-4 inline mr-2 text-orange-600 dark:text-orange-400" />
                        Subject
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => handleFormChange('subject', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-orange-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                      >
                        <option value="">Select Subject</option>
                        {subjects.map(subject => (
                          <option key={subject.id} value={subject.id}>{subject.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <FileText className="w-4 h-4 inline mr-2 text-indigo-600 dark:text-indigo-400" />
                      Homework Details
                    </label>
                    <textarea
                      value={formData.homeworkDetails}
                      onChange={(e) => handleFormChange('homeworkDetails', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200 resize-none"
                      rows="5"
                      placeholder="Enter detailed homework description, instructions, and requirements..."
                    />
                  </div>
                </div>
                
                {/* Modal Footer */}
                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="flex-1 px-6 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all font-semibold transform hover:scale-105 duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddOrUpdateHomework}
                    disabled={saving}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Saving...' : editingHomework ? 'Save Changes' : 'Add Homework'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {deleteTarget && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-rose-600 px-6 py-4 flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Trash2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Delete Homework</h3>
                  <p className="text-red-50 text-sm">This action cannot be undone.</p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-gray-800 dark:text-gray-200">
                  Are you sure you want to delete this homework?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteTarget(null)}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        setSaving(true);
                        await homeworkApi.deleteHomework(deleteTarget._id);
                        toast.success('Homework deleted');
                        setAllHomeworkData(prev => prev.filter(hw => hw._id !== deleteTarget._id));
                        setSearchResults(prev => prev.filter(hw => hw._id !== deleteTarget._id));
                      } catch (error) {
                        console.error('Failed to delete homework', error);
                        toast.error(error.message || 'Failed to delete homework');
                      } finally {
                        setSaving(false);
                        setDeleteTarget(null);
                      }
                    }}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={saving}
                  >
                    {saving ? 'Deleting...' : 'Confirm Delete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Homework;
