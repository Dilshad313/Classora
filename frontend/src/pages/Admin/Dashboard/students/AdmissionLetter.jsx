import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Home,
  ChevronRight,
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  BookOpen,
  Award,
  FileText,
  Download,
  Printer,
  Building2,
  Hash,
  Loader
} from 'lucide-react';
import { getStudents, getAdmissionLetter, getStudentById } from '../../../../services/studentApi';
import toast from 'react-hot-toast';

const AdmissionLetter = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

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
    student.admissionNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = async (student) => {
    try {
      setSearchLoading(true);
      // Fetch full student data to ensure we have the correct admissionNumber
      const fullStudentData = await getStudentById(student._id);
      const admissionData = await getAdmissionLetter(student._id);
      
      // Use the full student data to ensure admissionNumber is correct
      setSelectedStudent({
        ...fullStudentData,
        admissionNumber: fullStudentData.admissionNumber || student.admissionNumber, // Ensure admission number is preserved
        admissionLetter: admissionData
      });
      toast.success('Admission letter loaded successfully');
    } catch (error) {
      console.error('Failed to load admission letter', error);
      toast.error('Failed to load admission letter');
    } finally {
      setSearchLoading(false);
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    toast.success('Admission letter download started');
    // In a real application, you would generate and download a PDF
    setTimeout(() => {
      toast.success('Admission letter downloaded successfully');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 mb-6 text-sm print:hidden">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span className="text-blue-600 dark:text-blue-400 font-semibold">Students</span>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span className="text-gray-900 dark:text-white font-semibold">Admission Letter</span>
        </div>

        {/* Header */}
        <div className="mb-8 print:hidden">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admission Letter</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Search and view student admission details</p>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8 print:hidden">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search Student by Name or Admission Number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3.5 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-base transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>

          {/* Search Results Dropdown */}
          {searchTerm && (
            <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4 max-h-64 overflow-y-auto">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
                Search Results ({filteredStudents.length})
              </p>
              {searchLoading ? (
                <div className="flex justify-center py-4">
                  <Loader className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-spin" />
                </div>
              ) : filteredStudents.length > 0 ? (
                <div className="space-y-2">
                  {filteredStudents.map((student) => (
                    <button
                      key={student._id}
                      onClick={() => handleSearch(student)}
                      className="w-full flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all text-left border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                    >
                      <div className="relative w-12 h-12 rounded-xl flex-shrink-0 overflow-hidden">
                        {student.picture?.url ? (
                          <img
                            src={student.picture.url}
                            alt={student.studentName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              const fallback = e.target.parentElement.querySelector('.avatar-fallback');
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className={`w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm avatar-fallback ${student.picture?.url ? 'hidden' : ''}`}>
                          {getInitials(student.studentName)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white">{student.studentName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Admission No: {student.admissionNumber || 'N/A'} • Grade {student.selectClass} - {student.section}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                  No students found matching your search
                </div>
              )}
            </div>
          )}

          {loading && (
            <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex justify-center py-4">
                <Loader className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-spin" />
              </div>
            </div>
          )}
        </div>

        {/* Admission Letter ID Card */}
        {selectedStudent && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Action Buttons */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700/50 dark:to-gray-800/50 p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between print:hidden">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Admission Details</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all font-medium"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* ID Card Layout */}
            <div className="p-8 md:p-12">
              {/* Header with School Info */}
              <div className="text-center mb-8 pb-6 border-b-2 border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center">
                    <Building2 className="w-9 h-9 text-white" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Classora Institute</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Excellence in Education</p>
                  </div>
                </div>
                <div className="inline-block px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-bold text-lg shadow-lg mt-2">
                  ADMISSION LETTER
                </div>
              </div>

              {/* Student Photo and Basic Info */}
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                {/* Photo Section */}
                <div className="flex-shrink-0">
                  <div className="relative w-48 h-48 rounded-2xl overflow-hidden shadow-xl border-4 border-white dark:border-gray-800 ring-4 ring-blue-100 dark:ring-blue-900/50">
                    {selectedStudent.picture?.url ? (
                      <img
                        src={selectedStudent.picture.url}
                        alt={selectedStudent.studentName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const fallback = e.target.parentElement.querySelector('.avatar-fallback');
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-6xl avatar-fallback ${selectedStudent.picture?.url ? 'hidden' : ''}`}>
                      {getInitials(selectedStudent.studentName)}
                    </div>
                  </div>
                </div>

                {/* Basic Info Grid */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700/50 dark:to-gray-800/50 p-5 rounded-xl border-2 border-blue-100 dark:border-blue-900">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Student Name</p>
                    </div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white ml-13">{selectedStudent.studentName}</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700/50 dark:to-gray-800/50 p-5 rounded-xl border-2 border-purple-100 dark:border-purple-900">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                        <Hash className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Admission Number</p>
                    </div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white ml-13">{selectedStudent.admissionNumber || 'N/A'}</p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-700/50 dark:to-gray-800/50 p-5 rounded-xl border-2 border-orange-100 dark:border-orange-900">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Class & Section</p>
                    </div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white ml-13">Grade {selectedStudent.selectClass} - {selectedStudent.section}</p>
                  </div>
                </div>
              </div>

              {/* Detailed Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Date of Birth</p>
                      <p className="text-base font-bold text-gray-900 dark:text-white">
                        {selectedStudent.dateOfBirth ? 
                          new Date(selectedStudent.dateOfBirth).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          }) : 'Not specified'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Admission Date</p>
                      <p className="text-base font-bold text-gray-900 dark:text-white">
                        {new Date(selectedStudent.dateOfAdmission).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Phone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Phone Number</p>
                      <p className="text-base font-bold text-gray-900 dark:text-white">
                        {selectedStudent.mobileNo || 'Not specified'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Mail className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Email Address</p>
                      <p className="text-base font-bold text-gray-900 dark:text-white break-all">
                        {selectedStudent.email || 'Not specified'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Award className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Blood Group</p>
                      <p className="text-base font-bold text-gray-900 dark:text-white">
                        {selectedStudent.bloodGroup || 'Not specified'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Hash className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Roll Number</p>
                      <p className="text-base font-bold text-gray-900 dark:text-white">
                        {selectedStudent.rollNumber || 'Not assigned'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Building2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Previous School</p>
                      <p className="text-base font-bold text-gray-900 dark:text-white">
                        {selectedStudent.previousSchool || 'Not specified'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MapPin className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Address</p>
                      <p className="text-base font-bold text-gray-900 dark:text-white">
                        {selectedStudent.address || 'Not specified'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guardian Information */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-700/50 dark:to-gray-800/50 p-6 rounded-2xl border-2 border-amber-200 dark:border-amber-900 mb-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <User className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  Guardian Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Father's Name</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {selectedStudent.fatherName || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Father's Phone</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {selectedStudent.fatherMobile || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Mother's Name</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {selectedStudent.motherName || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Mother's Phone</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {selectedStudent.motherMobile || 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-6 mt-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="text-center md:text-left">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Issued on:</p>
                    <p className="font-bold text-gray-900 dark:text-white">
                      {new Date().toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="border-t-2 border-gray-900 dark:border-gray-400 pt-2 px-8">
                      <p className="font-bold text-gray-900 dark:text-white">Principal's Signature</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-24 h-24 border-2 border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400 text-center px-2">School Seal</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!selectedStudent && !loading && (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Search for a Student</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto text-lg">
              Use the search bar above to find a student and view their admission letter details
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700">
            <div className="flex justify-center items-center">
              <Loader className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg">Loading students...</p>
          </div>
        )}
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
          @page {
            size: A4;
            margin: 1cm;
          }
        }
      `}</style>
    </div>
  );
};

export default AdmissionLetter;