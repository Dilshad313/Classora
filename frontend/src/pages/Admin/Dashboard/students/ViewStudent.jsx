import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Home,
  ChevronRight,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  BookOpen,
  Hash,
  Users,
  Heart,
  Briefcase,
  School,
  FileText,
  Stethoscope,
  StickyNote,
  Edit3,
  Download
} from 'lucide-react';
import { getStudentById } from '../../../../services/studentApi';
import toast from 'react-hot-toast';

const ViewStudent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudent();
  }, [id]);

  const fetchStudent = async () => {
    try {
      setLoading(true);
      const data = await getStudentById(id);
      setStudent(data);
    } catch (error) {
      console.error('Failed to load student', error);
      toast.error('Failed to load student details');
      navigate('/dashboard/students/all');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-7xl mx-auto flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">Student not found</p>
            <button
              onClick={() => navigate('/dashboard/students/all')}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Back to Students
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
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
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <button
            onClick={() => navigate('/dashboard/students/all')}
            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
          >
            Students
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span className="text-gray-900 dark:text-white font-semibold">View Student</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard/students/all')}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Students
          </button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                {student.picture?.url ? (
                  <img
                    src={student.picture.url}
                    alt={student.studentName}
                    className="w-24 h-24 rounded-2xl object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const fallback = e.target.parentElement.querySelector('.avatar-fallback');
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg avatar-fallback ${student.picture?.url ? 'hidden' : ''}`}>
                  {getInitials(student.studentName)}
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{student.studentName}</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Registration No: {student.registrationNo}</p>
                <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">Admission: {student.registrationNo}</p>
              </div>
            </div>
            <button
              onClick={() => navigate(`/dashboard/students/edit/${id}`)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
            >
              <Edit3 className="w-5 h-5" />
              <span className="font-semibold">Edit Student</span>
            </button>
          </div>
        </div>

        {/* Student Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <User className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" />
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Full Name</label>
                  <p className="text-gray-900 dark:text-white font-medium">{student.studentName || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Registration Number</label>
                  <p className="text-gray-900 dark:text-white font-medium">{student.registrationNo || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Email</label>
                  <p className="text-gray-900 dark:text-white font-medium flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    {student.email || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Mobile Number</label>
                  <p className="text-gray-900 dark:text-white font-medium flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    {student.mobileNo || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Date of Birth</label>
                  <p className="text-gray-900 dark:text-white font-medium flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Gender</label>
                  <p className="text-gray-900 dark:text-white font-medium">{student.gender ? student.gender.charAt(0).toUpperCase() + student.gender.slice(1) : 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Blood Group</label>
                  <p className="text-gray-900 dark:text-white font-medium flex items-center">
                    <Heart className="w-4 h-4 mr-2 text-gray-400" />
                    {student.bloodGroup || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Date of Admission</label>
                  <p className="text-gray-900 dark:text-white font-medium flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    {student.dateOfAdmission ? new Date(student.dateOfAdmission).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Address</label>
                  <p className="text-gray-900 dark:text-white font-medium flex items-start">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-1 flex-shrink-0" />
                    {student.address || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <BookOpen className="w-6 h-6 mr-2 text-purple-600 dark:text-purple-400" />
                Academic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Class</label>
                  <p className="text-gray-900 dark:text-white font-medium">{student.selectClass || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Section</label>
                  <p className="text-gray-900 dark:text-white font-medium">{student.section || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Roll Number</label>
                  <p className="text-gray-900 dark:text-white font-medium">{student.rollNumber || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Fee Discount</label>
                  <p className="text-gray-900 dark:text-white font-medium">{student.discountInFee ? `${student.discountInFee}%` : '0%'}</p>
                </div>
              </div>
            </div>

            {/* Parent/Guardian Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Users className="w-6 h-6 mr-2 text-green-600 dark:text-green-400" />
                Parent/Guardian Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Father's Name</label>
                  <p className="text-gray-900 dark:text-white font-medium">{student.fatherName || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Father's Mobile</label>
                  <p className="text-gray-900 dark:text-white font-medium">{student.fatherMobile || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Father's Occupation</label>
                  <p className="text-gray-900 dark:text-white font-medium flex items-center">
                    <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                    {student.fatherOccupation || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Mother's Name</label>
                  <p className="text-gray-900 dark:text-white font-medium">{student.motherName || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Mother's Mobile</label>
                  <p className="text-gray-900 dark:text-white font-medium">{student.motherMobile || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Mother's Occupation</label>
                  <p className="text-gray-900 dark:text-white font-medium flex items-center">
                    <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                    {student.motherOccupation || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <FileText className="w-6 h-6 mr-2 text-orange-600 dark:text-orange-400" />
                Additional Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Caste</label>
                  <p className="text-gray-900 dark:text-white font-medium">{student.caste || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Religion</label>
                  <p className="text-gray-900 dark:text-white font-medium">{student.religion || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Previous School</label>
                  <p className="text-gray-900 dark:text-white font-medium flex items-center">
                    <School className="w-4 h-4 mr-2 text-gray-400" />
                    {student.previousSchool || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Previous ID/Board Roll No</label>
                  <p className="text-gray-900 dark:text-white font-medium">{student.previousIdBoardRollNo || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Orphan Student</label>
                  <p className="text-gray-900 dark:text-white font-medium">{student.orphanStudent ? student.orphanStudent.charAt(0).toUpperCase() + student.orphanStudent.slice(1) : 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">OSC (Other Special Category)</label>
                  <p className="text-gray-900 dark:text-white font-medium">{student.osc ? student.osc.charAt(0).toUpperCase() + student.osc.slice(1) : 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Identification Mark</label>
                  <p className="text-gray-900 dark:text-white font-medium">{student.identificationMark || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Disease (if any)</label>
                  <p className="text-gray-900 dark:text-white font-medium flex items-center">
                    <Stethoscope className="w-4 h-4 mr-2 text-gray-400" />
                    {student.disease || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Total Siblings</label>
                  <p className="text-gray-900 dark:text-white font-medium">{student.totalSiblings || 0}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Family</label>
                  <p className="text-gray-900 dark:text-white font-medium">{student.selectFamily || 'N/A'}</p>
                </div>
                {(student.additionalNote) && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Additional Notes</label>
                    <p className="text-gray-900 dark:text-white font-medium flex items-start">
                      <StickyNote className="w-4 h-4 mr-2 text-gray-400 mt-1 flex-shrink-0" />
                      {student.additionalNote}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Documents */}
            {student.documents && student.documents.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <FileText className="w-6 h-6 mr-2 text-indigo-600 dark:text-indigo-400" />
                  Documents
                </h2>
                <div className="space-y-3">
                  {student.documents.map((doc, index) => (
                    <a
                      key={index}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900 dark:text-white font-medium">{doc.name || `Document ${index + 1}`}</span>
                      </div>
                      <Download className="w-5 h-5 text-gray-400" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Status</h3>
              <span className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold border ${
                student.status === 'active'
                  ? 'text-green-700 bg-green-100 border-green-200 dark:text-green-400 dark:bg-green-900/30 dark:border-green-800'
                  : 'text-red-700 bg-red-100 border-red-200 dark:text-red-400 dark:bg-red-900/30 dark:border-red-800'
              }`}>
                {student.status === 'active' ? 'Active' : 'Inactive'}
              </span>
            </div>

            {/* Quick Info */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Info</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Username</p>
                  <p className="text-gray-900 dark:text-white font-medium">{student.username || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Attendance</p>
                  <p className="text-gray-900 dark:text-white font-medium">{student.attendance || 0}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Fee Remaining</p>
                  <p className="text-gray-900 dark:text-white font-medium">₹{student.feeRemaining || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewStudent;

