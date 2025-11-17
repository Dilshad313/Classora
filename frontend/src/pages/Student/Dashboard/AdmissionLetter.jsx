import { useState, useEffect } from 'react';
import { 
  FileText, Download, Printer, Eye, Calendar, MapPin, 
  User, Mail, Phone, GraduationCap, CheckCircle, 
  Building, Award, Clock
} from 'lucide-react';

const AdmissionLetter = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    setLoading(false);
  }, []);

  // Mock admission data
  const admissionData = {
    applicationNumber: 'ADM2024001234',
    admissionDate: '2024-08-15',
    academicYear: '2024-2025',
    class: '10th Grade',
    section: 'A',
    rollNumber: '15',
    studentId: 'STU2024001234',
    admissionFee: '₹25,000',
    status: 'Confirmed',
    reportingDate: '2024-09-01',
    documents: [
      'Birth Certificate',
      'Previous School Transfer Certificate',
      'Academic Transcripts',
      'Medical Certificate',
      'Passport Size Photographs'
    ],
    subjects: [
      'Mathematics',
      'Physics',
      'Chemistry',
      'Biology',
      'English',
      'Hindi',
      'Computer Science'
    ]
  };

  const handleDownload = () => {
    // In a real application, this would generate and download a PDF
    const element = document.createElement('a');
    const file = new Blob(['Admission Letter Content'], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `admission-letter-${user.name || 'student'}.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="card">
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
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
            <FileText className="w-7 h-7 text-blue-600" />
            Admission Letter
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View and download your official admission letter
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="btn-secondary flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            {showPreview ? 'Hide Preview' : 'Preview'}
          </button>
          <button
            onClick={handlePrint}
            className="btn-secondary flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button
            onClick={handleDownload}
            className="btn-primary flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Status Card */}
      <div className="card bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-green-700 dark:text-green-300">
              Admission Confirmed
            </h2>
            <p className="text-green-600 dark:text-green-400 mt-1">
              Your admission to Class {admissionData.class} has been successfully confirmed for Academic Year {admissionData.academicYear}
            </p>
            <div className="flex items-center gap-4 mt-3 text-sm text-green-600 dark:text-green-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Admitted: {new Date(admissionData.admissionDate).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Reporting: {new Date(admissionData.reportingDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Admission Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Information */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Student Information
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {user.name?.charAt(0) || 'S'}
              </div>
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-100">{user.name || 'Student Name'}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Student ID: {admissionData.studentId}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">{user.email || 'student@example.com'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">{user.phone || '+1 234 567 8900'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">{user.address || 'Student Address'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Details */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-purple-600" />
            Academic Details
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400">Class</p>
                <p className="font-semibold text-purple-600 dark:text-purple-400">{admissionData.class}</p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400">Section</p>
                <p className="font-semibold text-purple-600 dark:text-purple-400">{admissionData.section}</p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400">Roll Number</p>
                <p className="font-semibold text-purple-600 dark:text-purple-400">{admissionData.rollNumber}</p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400">Academic Year</p>
                <p className="font-semibold text-purple-600 dark:text-purple-400">{admissionData.academicYear}</p>
              </div>
            </div>
            
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Application Number</p>
              <p className="font-mono text-sm font-semibold text-gray-800 dark:text-gray-100">{admissionData.applicationNumber}</p>
            </div>
          </div>
        </div>

        {/* Fee Information */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Building className="w-5 h-5 text-green-600" />
            Fee Information
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-200 dark:border-green-800">
              <p className="text-sm text-gray-600 dark:text-gray-400">Admission Fee</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{admissionData.admissionFee}</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">✓ Paid</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Payment Status</p>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600 dark:text-green-400">Payment Confirmed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subjects and Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrolled Subjects */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-orange-600" />
            Enrolled Subjects
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {admissionData.subjects.map((subject, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 dark:text-orange-400 font-semibold text-sm">{index + 1}</span>
                </div>
                <span className="text-gray-700 dark:text-gray-300">{subject}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Required Documents */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Submitted Documents
          </h3>
          <div className="space-y-3">
            {admissionData.documents.map((document, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">{document}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Letter Preview */}
      {showPreview && (
        <div className="card bg-white dark:bg-gray-800 print:shadow-none">
          <div className="max-w-4xl mx-auto p-8 print:p-0">
            {/* Letter Header */}
            <div className="text-center mb-8 border-b-2 border-gray-200 dark:border-gray-700 pb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Classora High School</h1>
                  <p className="text-gray-600 dark:text-gray-400">Excellence in Education</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                123 Education Street, Academic City, State 12345 | Phone: (555) 123-4567 | Email: info@classora.edu
              </p>
            </div>

            {/* Letter Content */}
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">ADMISSION CONFIRMATION LETTER</h2>
                <p className="text-gray-600 dark:text-gray-400">Academic Year {admissionData.academicYear}</p>
              </div>

              <div className="text-right">
                <p className="text-gray-600 dark:text-gray-400">Date: {new Date(admissionData.admissionDate).toLocaleDateString()}</p>
              </div>

              <div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">Dear {user.name || 'Student'},</p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We are pleased to inform you that your application for admission to <strong>Class {admissionData.class}, Section {admissionData.section}</strong> 
                  has been <strong>approved</strong> for the academic year {admissionData.academicYear}.
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Your admission details are as follows:
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Student Name:</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-100">{user.name || 'Student Name'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Application Number:</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-100">{admissionData.applicationNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Class & Section:</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-100">{admissionData.class} - {admissionData.section}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Roll Number:</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-100">{admissionData.rollNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Student ID:</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-100">{admissionData.studentId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Reporting Date:</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-100">{new Date(admissionData.reportingDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Please report to the school office on <strong>{new Date(admissionData.reportingDate).toLocaleDateString()}</strong> 
                  at 9:00 AM with this admission letter and all required documents.
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We look forward to welcoming you to our academic community and wish you success in your educational journey.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-100">Principal</p>
                    <p className="text-gray-600 dark:text-gray-400">Classora High School</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800 dark:text-gray-100">Admissions Office</p>
                    <p className="text-gray-600 dark:text-gray-400">Date: {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdmissionLetter;
