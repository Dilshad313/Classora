import { useState, useEffect } from 'react';
import { BookOpenCheck, Plus, Calendar, Users, FileText, Edit, Trash2, Search, User, GraduationCap, Clock, BookOpen } from 'lucide-react';
import { homeworkApi } from '../../../../services/homeworkApi';
import { classApi } from '../../../../services/classApi';
import toast from 'react-hot-toast';

const Homework = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const loggedInTeacher = user?.name || user?.fullName || user?.username || '';
  const [searchFilters, setSearchFilters] = useState({
    homeworkDate: '',
    class: '',
    teacher: loggedInTeacher,
  });
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [formData, setFormData] = useState({
    homeworkDate: '',
    class: '',
    subject: '',
    homeworkDetails: '',
    setBy: loggedInTeacher,
  });
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState(loggedInTeacher ? [loggedInTeacher] : []);
  const [allHomeworkData, setAllHomeworkData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        setLoadingDropdowns(true);
        try {
          const classNames = await classApi.getAllClassNames();
          // Normalize to strings to avoid rendering object values
          const normalizedClasses = (classNames || []).map(cls => {
            if (typeof cls === 'string') return cls;
            if (cls?.className && cls?.section) return `${cls.className}${cls.section ? ` - ${cls.section}` : ''}`;
            return cls?.className || cls?.name || cls?._id || '';
          }).filter(Boolean);
          setClasses(normalizedClasses);
        } catch (classError) {
          console.error('Error fetching classes:', classError);
          toast.error('Failed to load classes');
          setClasses([]);
        }
        // Assuming teacher is logged in, no need to fetch teachers
        // Fetch subjects based on the logged in teacher's classes
        // For simplicity, we will fetch all subjects for now
        // A more complex implementation would fetch subjects based on the selected class
        const dropdownData = await homeworkApi.getDropdownData();
        if (dropdownData.success) {
          setSubjects(dropdownData.data.subjects || []);
          setTeachers(dropdownData.data.teachers || (loggedInTeacher ? [loggedInTeacher] : []));
        }

        // Fetch homework for the logged-in teacher so the page has content
        try {
          const homeworkResponse = await homeworkApi.getHomeworks({
            teacher: loggedInTeacher || undefined
          });
          if (homeworkResponse?.success) {
            const homeworkList = homeworkResponse.data || [];
            setAllHomeworkData(homeworkList);
            setSearchResults(homeworkList);
            setHasSearched(true);
          }
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

  // Handle search filter changes
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
      return cls.className || cls.name || cls._id || '';
    }
    return cls || '';
  };

  // Handle search functionality
  const handleSearch = () => {
    const filtered = allHomeworkData.filter(homework => {
      const matchesDate = !searchFilters.homeworkDate || homework.assignedDate === searchFilters.homeworkDate;
      const matchesClass = !searchFilters.class || getClassName(homework) === searchFilters.class;
      const matchesTeacher = !searchFilters.teacher || homework.teacherName === searchFilters.teacher;
      
      return matchesDate && matchesClass && matchesTeacher;
    });
    
    setSearchResults(filtered);
    setHasSearched(true);
  };

  // Handle form data changes for add homework modal
  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle add homework
  const handleAddHomework = () => {
    // Here you would typically send data to backend
    console.log('Adding homework:', formData);
    setShowAddModal(false);
    setFormData({
      homeworkDate: '',
      setBy: loggedInTeacher,
      class: '',
      subject: '',
      homeworkDetails: ''
    });
  };

  // Handle edit homework
  const handleEdit = (homeworkId) => {
    console.log('Editing homework:', homeworkId);
  };

  // Handle delete homework
  const handleDelete = (homeworkId) => {
    console.log('Deleting homework:', homeworkId);
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
                    <option key={cls} value={cls}>{cls}</option>
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
                    <option key={teacher} value={teacher}>{teacher}</option>
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
                    {searchResults.length > 0 ? `Found ${searchResults.length} homework assignment${searchResults.length !== 1 ? 's' : ''}` : 'No results found'}
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
                    <div key={homework.id} className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        <div className="flex-1">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 mb-2">
                                <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Teacher Name</p>
                              </div>
                              <p className="text-lg font-bold text-gray-800 dark:text-gray-100 pl-6">{homework.teacherName}</p>
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
                                {new Date(homework.assignedDate).toLocaleDateString('en-US', { 
                                  weekday: 'long', 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 mb-2">
                                <BookOpen className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Subject</p>
                              </div>
                              <p className="text-lg font-bold text-gray-800 dark:text-gray-100 pl-6">{homework.subject}</p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                              <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Homework Details</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 shadow-inner">
                              <p className="text-gray-800 dark:text-gray-100 leading-relaxed">{homework.homeworkDetails}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex lg:flex-col gap-3">
                          <button
                            onClick={() => handleEdit(homework.id)}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                            title="Edit Homework"
                          >
                            <Edit className="w-5 h-5" />
                            <span className="hidden sm:inline">Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(homework.id)}
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
                    <h3 className="text-2xl font-bold text-white">Add Homework or Assignment</h3>
                    <p className="text-blue-100 mt-1">Create a new homework assignment for your students</p>
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
                          <option key={teacher} value={teacher}>{teacher}</option>
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
                          <option key={cls} value={cls}>{cls}</option>
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
                          <option key={subject} value={subject}>{subject}</option>
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
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-6 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all font-semibold transform hover:scale-105 duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddHomework}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    Add Homework
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
