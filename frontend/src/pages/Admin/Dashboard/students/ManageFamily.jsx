import React, { useState } from 'react';
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
  Heart
} from 'lucide-react';

const ManageFamily = () => {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'Arun P',
      studentId: 'STU001',
      class: 'Grade 10 - A',
      rollNumber: '220/236',
      family: {
        father: {
          name: 'Rajesh P',
          occupation: 'Software Engineer',
          email: 'rajesh.p@example.com',
          phone: '+1 234-567-8901',
          isPrimary: true
        },
        mother: {
          name: 'Priya P',
          occupation: 'Doctor',
          email: 'priya.p@example.com',
          phone: '+1 234-567-8902',
          isPrimary: false
        },
        guardian: {
          name: 'Mohan Kumar',
          occupation: 'Business',
          email: 'mohan.k@example.com',
          phone: '+1 234-567-8903',
          relationship: 'Uncle',
          isPrimary: false
        }
      },
      address: '123 Main Street, City, State 12345',
      emergencyContact: '+1 234-567-8910'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      studentId: 'STU002',
      class: 'Grade 10 - B',
      rollNumber: '221/236',
      family: {
        father: {
          name: 'Amit Sharma',
          occupation: 'Business Owner',
          email: 'amit.sharma@example.com',
          phone: '+1 234-567-8911',
          isPrimary: true
        },
        mother: {
          name: 'Neha Sharma',
          occupation: 'Teacher',
          email: 'neha.sharma@example.com',
          phone: '+1 234-567-8912',
          isPrimary: false
        }
      },
      address: '456 Oak Avenue, City, State 12345',
      emergencyContact: '+1 234-567-8913'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setEditData(JSON.parse(JSON.stringify(student.family)));
    setIsEditing(true);
  };

  const handleSave = () => {
    setStudents(prev => 
      prev.map(student => 
        student.id === selectedStudent.id 
          ? { ...student, family: editData }
          : student
      )
    );
    setIsEditing(false);
    setSelectedStudent(null);
    setEditData({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedStudent(null);
    setEditData({});
  };

  const handleFamilyMemberChange = (memberType, field, value) => {
    setEditData(prev => ({
      ...prev,
      [memberType]: {
        ...prev[memberType],
        [field]: value
      }
    }));
  };

  const handleAddFamilyMember = (memberType) => {
    setEditData(prev => ({
      ...prev,
      [memberType]: {
        name: '',
        occupation: '',
        email: '',
        phone: '',
        relationship: memberType === 'guardian' ? '' : undefined,
        isPrimary: false
      }
    }));
  };

  const handleRemoveFamilyMember = (memberType) => {
    setEditData(prev => {
      const newData = { ...prev };
      delete newData[memberType];
      return newData;
    });
  };

  const handleSetPrimary = (memberType) => {
    // Set all members to non-primary first
    const updatedData = { ...editData };
    Object.keys(updatedData).forEach(key => {
      if (updatedData[key]) {
        updatedData[key].isPrimary = false;
      }
    });
    // Set the selected member as primary
    updatedData[memberType].isPrimary = true;
    setEditData(updatedData);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Family Management</h1>
              <p className="text-gray-600 mt-1">Manage family information for students</p>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Total Students: {students.length}</span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                />
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Students List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Students Column */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Students</h2>
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className={`bg-white rounded-lg shadow-sm border p-4 cursor-pointer transition-all hover:shadow-md ${
                  selectedStudent?.id === student.id ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'
                }`}
                onClick={() => setSelectedStudent(student)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{student.name}</h3>
                        <p className="text-sm text-gray-500">{student.studentId} • {student.class}</p>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Users className="w-3 h-3" />
                        <span>{Object.keys(student.family).length} family members</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Phone className="w-3 h-3" />
                        <span>{student.emergencyContact}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(student);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {filteredStudents.length === 0 && (
              <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
                <p className="text-gray-500">Try adjusting your search terms</p>
              </div>
            )}
          </div>

          {/* Family Details Column */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {selectedStudent ? `${selectedStudent.name}'s Family` : 'Family Details'}
            </h2>
            
            {!selectedStudent ? (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Student</h3>
                <p className="text-gray-500">Choose a student from the list to view and manage their family information</p>
              </div>
            ) : isEditing ? (
              /* Edit Family Form */
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Edit Family Information</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleCancel}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Father Information */}
                  {editData.father && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                          <User className="w-4 h-4 text-blue-600" />
                          <span>Father Information</span>
                          {editData.father.isPrimary && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Primary Contact
                            </span>
                          )}
                        </h4>
                        <div className="flex items-center space-x-2">
                          {!editData.father.isPrimary && (
                            <button
                              onClick={() => handleSetPrimary('father')}
                              className="text-sm text-blue-600 hover:text-blue-700"
                            >
                              Set Primary
                            </button>
                          )}
                          <button
                            onClick={() => handleRemoveFamilyMember('father')}
                            className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={editData.father.name}
                          onChange={(e) => handleFamilyMemberChange('father', 'name', e.target.value)}
                          placeholder="Father's Name"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                          type="text"
                          value={editData.father.occupation}
                          onChange={(e) => handleFamilyMemberChange('father', 'occupation', e.target.value)}
                          placeholder="Occupation"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                          type="email"
                          value={editData.father.email}
                          onChange={(e) => handleFamilyMemberChange('father', 'email', e.target.value)}
                          placeholder="Email"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                          type="tel"
                          value={editData.father.phone}
                          onChange={(e) => handleFamilyMemberChange('father', 'phone', e.target.value)}
                          placeholder="Phone"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* Mother Information */}
                  {editData.mother && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                          <Heart className="w-4 h-4 text-pink-600" />
                          <span>Mother Information</span>
                          {editData.mother.isPrimary && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Primary Contact
                            </span>
                          )}
                        </h4>
                        <div className="flex items-center space-x-2">
                          {!editData.mother.isPrimary && (
                            <button
                              onClick={() => handleSetPrimary('mother')}
                              className="text-sm text-blue-600 hover:text-blue-700"
                            >
                              Set Primary
                            </button>
                          )}
                          <button
                            onClick={() => handleRemoveFamilyMember('mother')}
                            className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={editData.mother.name}
                          onChange={(e) => handleFamilyMemberChange('mother', 'name', e.target.value)}
                          placeholder="Mother's Name"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                          type="text"
                          value={editData.mother.occupation}
                          onChange={(e) => handleFamilyMemberChange('mother', 'occupation', e.target.value)}
                          placeholder="Occupation"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                          type="email"
                          value={editData.mother.email}
                          onChange={(e) => handleFamilyMemberChange('mother', 'email', e.target.value)}
                          placeholder="Email"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                          type="tel"
                          value={editData.mother.phone}
                          onChange={(e) => handleFamilyMemberChange('mother', 'phone', e.target.value)}
                          placeholder="Phone"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* Guardian Information */}
                  {editData.guardian && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                          <Shield className="w-4 h-4 text-purple-600" />
                          <span>Guardian Information</span>
                          {editData.guardian.isPrimary && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Primary Contact
                            </span>
                          )}
                        </h4>
                        <div className="flex items-center space-x-2">
                          {!editData.guardian.isPrimary && (
                            <button
                              onClick={() => handleSetPrimary('guardian')}
                              className="text-sm text-blue-600 hover:text-blue-700"
                            >
                              Set Primary
                            </button>
                          )}
                          <button
                            onClick={() => handleRemoveFamilyMember('guardian')}
                            className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={editData.guardian.name}
                          onChange={(e) => handleFamilyMemberChange('guardian', 'name', e.target.value)}
                          placeholder="Guardian's Name"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                          type="text"
                          value={editData.guardian.relationship}
                          onChange={(e) => handleFamilyMemberChange('guardian', 'relationship', e.target.value)}
                          placeholder="Relationship"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                          type="text"
                          value={editData.guardian.occupation}
                          onChange={(e) => handleFamilyMemberChange('guardian', 'occupation', e.target.value)}
                          placeholder="Occupation"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                          type="email"
                          value={editData.guardian.email}
                          onChange={(e) => handleFamilyMemberChange('guardian', 'email', e.target.value)}
                          placeholder="Email"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                          type="tel"
                          value={editData.guardian.phone}
                          onChange={(e) => handleFamilyMemberChange('guardian', 'phone', e.target.value)}
                          placeholder="Phone"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 md:col-span-2"
                        />
                      </div>
                    </div>
                  )}

                  {/* Add Family Member Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {!editData.father && (
                      <button
                        onClick={() => handleAddFamilyMember('father')}
                        className="flex items-center space-x-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Father</span>
                      </button>
                    )}
                    {!editData.mother && (
                      <button
                        onClick={() => handleAddFamilyMember('mother')}
                        className="flex items-center space-x-2 px-3 py-2 bg-pink-50 text-pink-700 rounded-lg hover:bg-pink-100 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Mother</span>
                      </button>
                    )}
                    {!editData.guardian && (
                      <button
                        onClick={() => handleAddFamilyMember('guardian')}
                        className="flex items-center space-x-2 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Guardian</span>
                      </button>
                    )}
                  </div>

                  {/* Address Information */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-green-600" />
                      <span>Address & Emergency Contact</span>
                    </h4>
                    <div className="space-y-4">
                      <textarea
                        value={selectedStudent.address}
                        readOnly
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                        placeholder="Family Address"
                      />
                      <input
                        type="tel"
                        value={selectedStudent.emergencyContact}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                        placeholder="Emergency Contact"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            ) : (
              /* View Family Details */
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Family Information</h3>
                  <button
                    onClick={() => handleEdit(selectedStudent)}
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Family Members */}
                  {Object.entries(selectedStudent.family).map(([memberType, member]) => (
                    <div key={memberType} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900 capitalize flex items-center space-x-2">
                          {memberType === 'father' && <User className="w-4 h-4 text-blue-600" />}
                          {memberType === 'mother' && <Heart className="w-4 h-4 text-pink-600" />}
                          {memberType === 'guardian' && <Shield className="w-4 h-4 text-purple-600" />}
                          <span>{memberType} Information</span>
                          {member.isPrimary && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Primary Contact
                            </span>
                          )}
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Name:</span>
                          <p className="font-medium text-gray-900">{member.name}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Occupation:</span>
                          <p className="font-medium text-gray-900">{member.occupation}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Email:</span>
                          <p className="font-medium text-gray-900">{member.email}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Phone:</span>
                          <p className="font-medium text-gray-900">{member.phone}</p>
                        </div>
                        {member.relationship && (
                          <div>
                            <span className="text-gray-500">Relationship:</span>
                            <p className="font-medium text-gray-900">{member.relationship}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Address Information */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-green-600" />
                      <span>Address & Emergency Contact</span>
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-gray-500">Family Address:</span>
                        <p className="font-medium text-gray-900 mt-1">{selectedStudent.address}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Emergency Contact:</span>
                        <p className="font-medium text-gray-900">{selectedStudent.emergencyContact}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageFamily;