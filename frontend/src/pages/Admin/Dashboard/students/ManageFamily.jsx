import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter,
  Users,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Edit3,
  Trash2,
  Eye,
  Plus,
  Save,
  X,
  Shield,
  Heart,
  Loader
} from 'lucide-react';
import { getStudents, updateStudent } from '../../../../services/studentApi';
import toast from 'react-hot-toast';

const ManageFamily = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await getStudents();
      setStudents(data || []);
    } catch (error) {
      console.error('Failed to load students', error);
      toast.error('Failed to load students');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student =>
    student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.registrationNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.selectClass.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setEditData({
      fatherName: student.fatherName || '',
      fatherMobile: student.fatherMobile || '',
      fatherOccupation: student.fatherOccupation || '',
      motherName: student.motherName || '',
      motherMobile: student.motherMobile || '',
      motherOccupation: student.motherOccupation || '',
      address: student.address || ''
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!selectedStudent) return;

    try {
      setUpdating(true);
      await updateStudent(selectedStudent._id, editData);
      
      // Update local state
      setStudents(prev => 
        prev.map(student => 
          student._id === selectedStudent._id 
            ? { ...student, ...editData }
            : student
        )
      );
      
      setSelectedStudent(prev => ({ ...prev, ...editData }));
      setIsEditing(false);
      toast.success('Family information updated successfully');
    } catch (error) {
      console.error('Failed to update family information', error);
      toast.error(error.message || 'Failed to update family information');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({});
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Family Management</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Manage family information for students</p>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span>Total Students: {students.length}</span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Students Column */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Students</h2>
              {filteredStudents.map((student) => (
                <div
                  key={student._id}
                  className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedStudent?._id === student._id ? 'border-blue-500 ring-2 ring-blue-100 dark:ring-blue-900/50 dark:border-blue-500' : 'border-gray-200 dark:border-gray-700'
                  }`}
                  onClick={() => setSelectedStudent(student)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{student.studentName}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{student.registrationNo} • Grade {student.selectClass}</p>
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                          <Users className="w-3 h-3" />
                          <span>
                            {(student.fatherName ? 1 : 0) + (student.motherName ? 1 : 0)} family members
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                          <Phone className="w-3 h-3" />
                          <span>{student.mobileNo || 'No contact'}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(student);
                      }}
                      className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {filteredStudents.length === 0 && (
                <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <Users className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No students found</h3>
                  <p className="text-gray-500 dark:text-gray-400">Try adjusting your search terms</p>
                </div>
              )}
            </div>

            {/* Family Details Column */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedStudent ? `${selectedStudent.studentName}'s Family` : 'Family Details'}
              </h2>
              
              {!selectedStudent ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
                  <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Select a Student</h3>
                  <p className="text-gray-500 dark:text-gray-400">Choose a student from the list to view and manage their family information</p>
                </div>
              ) : isEditing ? (
                /* Edit Family Form */
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Family Information</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleCancel}
                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Father Information */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white flex items-center space-x-2 mb-4">
                        <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span>Father Information</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                          <input
                            type="text"
                            value={editData.fatherName}
                            onChange={(e) => handleInputChange('fatherName', e.target.value)}
                            placeholder="Father's Name"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Occupation</label>
                          <input
                            type="text"
                            value={editData.fatherOccupation}
                            onChange={(e) => handleInputChange('fatherOccupation', e.target.value)}
                            placeholder="Occupation"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mobile</label>
                          <input
                            type="tel"
                            value={editData.fatherMobile}
                            onChange={(e) => handleInputChange('fatherMobile', e.target.value)}
                            placeholder="Phone"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Mother Information */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white flex items-center space-x-2 mb-4">
                        <Heart className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                        <span>Mother Information</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                          <input
                            type="text"
                            value={editData.motherName}
                            onChange={(e) => handleInputChange('motherName', e.target.value)}
                            placeholder="Mother's Name"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Occupation</label>
                          <input
                            type="text"
                            value={editData.motherOccupation}
                            onChange={(e) => handleInputChange('motherOccupation', e.target.value)}
                            placeholder="Occupation"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mobile</label>
                          <input
                            type="tel"
                            value={editData.motherMobile}
                            onChange={(e) => handleInputChange('motherMobile', e.target.value)}
                            placeholder="Phone"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Address Information */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span>Address Information</span>
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Family Address</label>
                          <textarea
                            value={editData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            placeholder="Family Address"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={updating}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                    >
                      {updating ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      <span>{updating ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* View Family Details */
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Family Information</h3>
                    <button
                      onClick={() => handleEdit(selectedStudent)}
                      className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Father Information */}
                    {selectedStudent.fatherName && (
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white capitalize flex items-center space-x-2 mb-3">
                          <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <span>Father Information</span>
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Name:</span>
                            <p className="font-medium text-gray-900 dark:text-white">{selectedStudent.fatherName}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Occupation:</span>
                            <p className="font-medium text-gray-900 dark:text-white">{selectedStudent.fatherOccupation || 'Not specified'}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Mobile:</span>
                            <p className="font-medium text-gray-900 dark:text-white">{selectedStudent.fatherMobile || 'Not specified'}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Mother Information */}
                    {selectedStudent.motherName && (
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white capitalize flex items-center space-x-2 mb-3">
                          <Heart className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                          <span>Mother Information</span>
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Name:</span>
                            <p className="font-medium text-gray-900 dark:text-white">{selectedStudent.motherName}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Occupation:</span>
                            <p className="font-medium text-gray-900 dark:text-white">{selectedStudent.motherOccupation || 'Not specified'}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Mobile:</span>
                            <p className="font-medium text-gray-900 dark:text-white">{selectedStudent.motherMobile || 'Not specified'}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Address Information */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span>Address Information</span>
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Family Address:</span>
                          <p className="font-medium text-gray-900 dark:text-white mt-1">
                            {selectedStudent.address || 'Not specified'}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Student Contact:</span>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {selectedStudent.mobileNo || 'Not specified'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {!selectedStudent.fatherName && !selectedStudent.motherName && (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <Users className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                        <p>No family information available</p>
                        <button
                          onClick={() => handleEdit(selectedStudent)}
                          className="mt-3 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                        >
                          Add Family Information
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageFamily;