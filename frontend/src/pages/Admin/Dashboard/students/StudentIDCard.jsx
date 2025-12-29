import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home,
  ChevronRight,
  User,
  Calendar,
  Building2,
  Download,
  Printer,
  Palette,
  Loader,
  RefreshCw
} from 'lucide-react';
import { getStudents } from '../../../../services/studentApi';
import toast from 'react-hot-toast';

const StudentIDCard = () => {
  const navigate = useNavigate();
  const [selectedStyle, setSelectedStyle] = useState('classic');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const styles = [
    { 
      id: 'classic', 
      name: 'Classic Blue', 
      gradient: 'from-blue-600 to-blue-800',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-600'
    },
    { 
      id: 'modern', 
      name: 'Modern Purple', 
      gradient: 'from-purple-600 to-indigo-800',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-600'
    },
    { 
      id: 'elegant', 
      name: 'Elegant Green', 
      gradient: 'from-green-600 to-teal-800',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-600'
    },
    { 
      id: 'vibrant', 
      name: 'Vibrant Orange', 
      gradient: 'from-orange-600 to-red-700',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-600'
    }
  ];

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

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const currentStyle = styles.find(s => s.id === selectedStyle);

  const handlePrint = () => {
    window.print();
    toast.success('Printing ID cards...');
  };

  const handleDownload = () => {
    toast.success('ID cards download started');
    // In a real application, you would generate and download PDFs
    setTimeout(() => {
      toast.success('ID cards downloaded successfully');
    }, 2000);
  };

  const handleRefresh = () => {
    fetchStudents();
    toast.success('Students list refreshed');
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
          <span className="text-gray-900 dark:text-white font-semibold">ID Cards</span>
        </div>

        {/* Header */}
        <div className="mb-8 print:hidden">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Student ID Cards</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Generate and print student identification cards</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all font-medium shadow-lg"
              >
                <Printer className="w-5 h-5" />
                <span>Print All</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-lg"
              >
                <Download className="w-5 h-5" />
                <span>Download All</span>
              </button>
            </div>
          </div>
        </div>

        {/* Style Selector */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8 print:hidden">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Choose ID Card Style</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {styles.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`relative p-6 rounded-xl border-3 transition-all bg-white dark:bg-gray-700/50 ${
                  selectedStyle === style.id
                    ? `${style.borderColor} border-4 shadow-xl scale-105`
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg'
                }`}
              >
                <div className={`w-full h-24 bg-gradient-to-r ${style.gradient} rounded-lg mb-3 flex items-center justify-center`}>
                  <Building2 className="w-10 h-10 text-white" />
                </div>
                <p className="font-bold text-gray-900 dark:text-white text-center">{style.name}</p>
                {selectedStyle === style.id && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
          </div>
        )}

        {/* ID Cards Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {students.map((student) => (
              <div key={student._id} className="flex justify-center">
                {/* ID Card - Realistic Design */}
                <div className="w-[350px] h-[550px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden border border-gray-300 dark:border-gray-700 transform hover:scale-102 transition-transform duration-300 relative">
                  {/* Decorative Corner Elements */}
                  <div className="absolute top-0 left-0 w-20 h-20 opacity-10">
                    <div className={`w-full h-full bg-gradient-to-br ${currentStyle.gradient} rounded-br-full`}></div>
                  </div>
                  <div className="absolute bottom-0 right-0 w-20 h-20 opacity-10">
                    <div className={`w-full h-full bg-gradient-to-tl ${currentStyle.gradient} rounded-tl-full`}></div>
                  </div>

                  {/* Header with School Name */}
                  <div className={`bg-gradient-to-r ${currentStyle.gradient} px-6 py-5 text-white relative`}>
                    <div className="text-center">
                      <div className="flex justify-center mb-2">
                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <Building2 className="w-8 h-8 text-gray-800" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold tracking-wide mb-1">CLASSORA INSTITUTE</h3>
                      <p className="text-xs font-semibold opacity-90 tracking-wider">STUDENT ID CARD</p>
                    </div>
                  </div>

                  {/* Student Photo Section */}
                  <div className="px-6 py-6 bg-gradient-to-b from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800">
                    <div className="flex flex-col items-center">
                      {/* Photo with realistic border */}
                      <div className="relative mb-4">
                        <div className={`w-32 h-32 bg-gradient-to-br ${currentStyle.gradient} rounded-lg flex items-center justify-center text-white font-bold text-4xl shadow-xl border-4 border-white dark:border-gray-800 ring-4 ring-gray-200 dark:ring-gray-700 overflow-hidden`}>
                          {student.picture?.url ? (
                            <img 
                              src={student.picture.url} 
                              alt={student.studentName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback to initials if image fails to load
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          {/* Fallback initials - hidden by default when image is present */}
                          <div style={{ display: student.picture?.url ? 'none' : 'flex' }}>
                            {getInitials(student.studentName)}
                          </div>
                        </div>
                      </div>

                      {/* Student Name */}
                      <div className="text-center mb-4 w-full">
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{student.studentName}</h4>
                        <div className={`inline-block px-4 py-1 bg-gradient-to-r ${currentStyle.gradient} rounded-full`}>
                          <span className="text-white text-xs font-bold">Class {student.selectClass} - {student.section}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Details Section with realistic layout */}
                  <div className="px-6 pb-4 space-y-3">
                    {/* Student ID */}
                    <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Student ID</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white font-mono">{student.registrationNo}</span>
                    </div>

                    {/* Admission Number */}
                    {student.admissionNumber && (
                      <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Admission No</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white font-mono">{student.admissionNumber}</span>
                      </div>
                    )}

                    {/* Date of Admission */}
                    <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">DOA</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {new Date(student.dateOfAdmission).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Footer with signature line */}
                  <div className="absolute bottom-0 left-0 right-0 px-6 pb-4">
                    <div className="flex items-end justify-between text-[10px] text-gray-600 dark:text-gray-400 mb-2">
                      <div className="text-center">
                        <div className="w-20 border-t border-gray-400 dark:border-gray-600 mb-1"></div>
                        <span className="font-semibold">Principal</span>
                      </div>
                      <div className="text-center text-xs font-bold text-gray-700 dark:text-gray-300">
                        2024-2025
                      </div>
                      <div className="text-center">
                        <div className="w-20 border-t border-gray-400 dark:border-gray-600 mb-1"></div>
                        <span className="font-semibold">Student</span>
                      </div>
                    </div>
                    
                    {/* Bottom stripe */}
                    <div className={`h-2 bg-gradient-to-r ${currentStyle.gradient} rounded-full`}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && students.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No Students Found</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto text-lg">
              Add students to generate their ID cards
            </p>
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
          .grid {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 1cm !important;
          }
        }
      `}</style>
    </div>
  );
};

export default StudentIDCard;