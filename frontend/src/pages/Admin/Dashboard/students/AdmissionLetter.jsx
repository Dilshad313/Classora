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
import { getStudents, getAdmissionLetter } from '../../../../services/studentApi';
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
      const admissionData = await getAdmissionLetter(student._id);
      setSelectedStudent({
        ...student,
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 mb-6 text-sm print:hidden">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-blue-600 font-semibold">Students</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-semibold">Admission Letter</span>
        </div>

        {/* Header */}
        <div className="mb-8 print:hidden">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admission Letter</h1>
              <p className="text-gray-600 mt-1">Search and view student admission details</p>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8 print:hidden">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search Student by Name, Student ID, or Admission Number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-base transition-all"
              />
            </div>
          </div>

          {/* Search Results Dropdown */}
          {searchTerm && (
            <div className="mt-4 border-t border-gray-200 pt-4 max-h-64 overflow-y-auto">
              <p className="text-sm font-semibold text-gray-600 mb-3">
                Search Results ({filteredStudents.length})
              </p>
              {searchLoading ? (
                <div className="flex justify-center py-4">
                  <Loader className="w-6 h-6 text-blue-600 animate-spin" />
                </div>
              ) : filteredStudents.length > 0 ? (
                <div className="space-y-2">
                  {filteredStudents.map((student) => (
                    <button
                      key={student._id}
                      onClick={() => handleSearch(student)}
                      className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-blue-50 rounded-xl transition-all text-left border-2 border-transparent hover:border-blue-200"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {getInitials(student.studentName)}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{student.studentName}</p>
                        <p className="text-sm text-gray-600">
                          {student.registrationNo} • {student.admissionNumber} • Grade {student.selectClass} - {student.section}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No students found matching your search
                </div>
              )}
            </div>
          )}

          {loading && (
            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="flex justify-center py-4">
                <Loader className="w-6 h-6 text-blue-600 animate-spin" />
              </div>
            </div>
          )}
        </div>

        {/* Admission Letter ID Card */}
        {selectedStudent && (
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-gray-200 overflow-hidden">
            {/* Action Buttons */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-200 flex items-center justify-between print:hidden">
              <p className="text-sm font-semibold text-gray-700">Admission Details</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-medium"
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
              <div className="text-center mb-8 pb-6 border-b-2 border-gray-200">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center">
                    <Building2 className="w-9 h-9 text-white" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-3xl font-bold text-gray-900">Classora Institute</h2>
                    <p className="text-sm text-gray-600 font-medium">Excellence in Education</p>
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
                  <div className="w-48 h-48 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-6xl shadow-xl border-4 border-white ring-4 ring-blue-100">
                    {getInitials(selectedStudent.studentName)}
                  </div>
                </div>

                {/* Basic Info Grid */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border-2 border-blue-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Student Name</p>
                    </div>
                    <p className="text-xl font-bold text-gray-900 ml-13">{selectedStudent.studentName}</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-xl border-2 border-purple-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                        <Hash className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Admission Number</p>
                    </div>
                    <p className="text-xl font-bold text-gray-900 ml-13">{selectedStudent.admissionNumber}</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border-2 border-green-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Student ID</p>
                    </div>
                    <p className="text-xl font-bold text-gray-900 ml-13">{selectedStudent.registrationNo}</p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-5 rounded-xl border-2 border-orange-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Class & Section</p>
                    </div>
                    <p className="text-xl font-bold text-gray-900 ml-13">Grade {selectedStudent.selectClass} - {selectedStudent.section}</p>
                  </div>
                </div>
              </div>

              {/* Detailed Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Date of Birth</p>
                      <p className="text-base font-bold text-gray-900">
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

                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Calendar className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Admission Date</p>
                      <p className="text-base font-bold text-gray-900">
                        {new Date(selectedStudent.dateOfAdmission).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Phone className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Phone Number</p>
                      <p className="text-base font-bold text-gray-900">
                        {selectedStudent.mobileNo || 'Not specified'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Mail className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Email Address</p>
                      <p className="text-base font-bold text-gray-900 break-all">
                        {selectedStudent.email || 'Not specified'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Award className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Blood Group</p>
                      <p className="text-base font-bold text-gray-900">
                        {selectedStudent.bloodGroup || 'Not specified'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Hash className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Roll Number</p>
                      <p className="text-base font-bold text-gray-900">
                        {selectedStudent.rollNumber || 'Not assigned'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Building2 className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Previous School</p>
                      <p className="text-base font-bold text-gray-900">
                        {selectedStudent.previousSchool || 'Not specified'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MapPin className="w-5 h-5 text-pink-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Address</p>
                      <p className="text-base font-bold text-gray-900">
                        {selectedStudent.address || 'Not specified'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guardian Information */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border-2 border-amber-200 mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-6 h-6 text-amber-600" />
                  Guardian Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Father's Name</p>
                    <p className="text-lg font-bold text-gray-900">
                      {selectedStudent.fatherName || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Father's Phone</p>
                    <p className="text-lg font-bold text-gray-900">
                      {selectedStudent.fatherMobile || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Mother's Name</p>
                    <p className="text-lg font-bold text-gray-900">
                      {selectedStudent.motherName || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Mother's Phone</p>
                    <p className="text-lg font-bold text-gray-900">
                      {selectedStudent.motherMobile || 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t-2 border-gray-200 pt-6 mt-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="text-center md:text-left">
                    <p className="text-sm text-gray-600 mb-1">Issued on:</p>
                    <p className="font-bold text-gray-900">
                      {new Date().toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="border-t-2 border-gray-900 pt-2 px-8">
                      <p className="font-bold text-gray-900">Principal's Signature</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-24 h-24 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                      <p className="text-xs text-gray-500 text-center px-2">School Seal</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!selectedStudent && !loading && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg border-2 border-gray-200">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Search for a Student</h3>
            <p className="text-gray-600 max-w-md mx-auto text-lg">
              Use the search bar above to find a student and view their admission letter details
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg border-2 border-gray-200">
            <div className="flex justify-center items-center">
              <Loader className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
            <p className="text-gray-600 mt-4 text-lg">Loading students...</p>
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