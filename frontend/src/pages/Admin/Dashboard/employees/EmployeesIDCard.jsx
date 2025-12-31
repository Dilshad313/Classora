import React, { useState, useEffect, useRef } from 'react';
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
  Briefcase
} from 'lucide-react';
import { employeeApi } from '../../../../services/employeesApi';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';

const EmployeesIDCard = () => {
  const navigate = useNavigate();
  const [selectedStyle, setSelectedStyle] = useState('classic');
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployeesForIDCards();
  }, []);

  const fetchEmployeesForIDCards = async () => {
    try {
      const result = await employeeApi.getEmployeesForIDCards();
     
      if (result.success) {
        setEmployees(result.data);
      }
    } catch (error) {
      console.error('Error fetching employees for ID cards:', error);
      toast.error('Error fetching employees for ID cards. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styles = [
    {
      id: 'classic',
      name: 'Classic Blue',
      gradient: 'from-blue-600 to-blue-800 dark:from-blue-500 dark:to-blue-700',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-600 dark:border-blue-500'
    },
    {
      id: 'modern',
      name: 'Modern Purple',
      gradient: 'from-purple-600 to-indigo-800 dark:from-purple-500 dark:to-indigo-700',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-600 dark:border-purple-500'
    },
    {
      id: 'elegant',
      name: 'Elegant Green',
      gradient: 'from-green-600 to-teal-800 dark:from-green-500 dark:to-teal-700',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-600 dark:border-green-500'
    },
    {
      id: 'vibrant',
      name: 'Vibrant Orange',
      gradient: 'from-orange-600 to-red-700 dark:from-orange-500 dark:to-red-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      borderColor: 'border-orange-600 dark:border-orange-500'
    }
  ];

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
  };

  const handleDownloadAll = async () => {
    if (employees.length === 0) {
      toast.error('No employee ID cards to download.');
      return;
    }

    const toastId = toast.loading('Generating PDF...');

    try {
      const pdf = new jsPDF('p', 'px');
      const cardElements = document.querySelectorAll('.employee-id-card');
      
      for (let i = 0; i < cardElements.length; i++) {
        const card = cardElements[i];
        const canvas = await html2canvas(card, { scale: 2 });
        const data = canvas.toDataURL('image/png');
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        if (i > 0) {
          pdf.addPage();
        }
        
        pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
      }
      
      pdf.save('All-Employee-ID-Cards.pdf');
      toast.success('PDF downloaded successfully!', { id: toastId });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF.', { id: toastId });
    }
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
          <span className="text-blue-600 dark:text-blue-400 font-semibold">Employees</span>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span className="text-gray-900 dark:text-white font-semibold">Staff ID Cards</span>
        </div>
        {/* Header */}
        <div className="mb-8 print:hidden">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Employee ID Cards</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Generate and print employee identification cards</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all font-medium shadow-lg"
              >
                <Printer className="w-5 h-5" />
                <span>Print All</span>
              </button>
              <button
                onClick={handleDownloadAll}
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-500 transition-all font-medium shadow-lg"
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
                className={`relative p-6 rounded-xl border-3 transition-all bg-white dark:bg-gray-800 ${
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
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading employee data...</p>
          </div>
        )}
        {/* ID Cards Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {employees.map((employee) => (
              <div key={employee._id} className="flex justify-center">
                {/* ID Card - Realistic Design */}
                <div id={`id-card-${employee._id}`} className="w-[350px] h-[550px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden border border-gray-300 dark:border-gray-600 transform hover:scale-102 transition-transform duration-300 relative employee-id-card">
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
                        <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center shadow-lg">
                          <Building2 className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold tracking-wide mb-1">CLASSORA INSTITUTE</h3>
                      <p className="text-xs font-semibold opacity-90 tracking-wider">EMPLOYEE ID CARD</p>
                    </div>
                  </div>
                  {/* Employee Photo Section */}
                  <div className="px-6 py-6 bg-gradient-to-b from-gray-50 dark:from-gray-800 to-white dark:to-gray-800">
                    <div className="flex flex-col items-center">
                      {/* Photo with realistic border */}
                      <div className="relative mb-4">
                        {employee.picture && employee.picture.url ? (
                          <img
                            src={employee.picture.url}
                            alt={employee.employeeName}
                            className="w-32 h-32 object-cover rounded-lg shadow-xl border-4 border-white ring-4 ring-gray-200 dark:ring-gray-600"
                          />
                        ) : (
                          <div className={`w-32 h-32 bg-gradient-to-br ${currentStyle.gradient} rounded-lg flex items-center justify-center text-white font-bold text-4xl shadow-xl border-4 border-white ring-4 ring-gray-200 dark:ring-gray-600`}>
                            {getInitials(employee.employeeName)}
                          </div>
                        )}
                        {/* Official stamp overlay */}
                        <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center border-2 border-white shadow-lg opacity-90">
                          <span className="text-white text-[8px] font-bold text-center leading-tight">STAFF</span>
                        </div>
                      </div>
                     
                      {/* Employee Name */}
                      <div className="text-center mb-4 w-full">
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{employee.employeeName}</h4>
                        <div className={`inline-block px-4 py-1 bg-gradient-to-r ${currentStyle.gradient} rounded-full`}>
                          <span className="text-white text-xs font-bold">{employee.employeeRole}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Details Section with realistic layout */}
                  <div className="px-6 pb-4 space-y-3">
                    {/* Employee ID */}
                    <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Employee ID</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white font-mono">{employee.employeeId}</span>
                    </div>
                    {/* Department */}
                    <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Department</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{employee.department}</span>
                    </div>
                    {/* Date of Joining */}
                    <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">DOJ</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {new Date(employee.dateOfJoining).toLocaleDateString('en-US', {
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
                        <div className="w-20 border-t border-gray-400 dark:border-gray-500 mb-1"></div>
                        <span className="font-semibold">Principal</span>
                      </div>
                      <div className="text-center text-xs font-bold text-gray-700 dark:text-gray-300">
                        2024-2025
                      </div>
                      <div className="text-center">
                        <div className="w-20 border-t border-gray-400 dark:border-gray-500 mb-1"></div>
                        <span className="font-semibold">Employee</span>
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
        {!loading && employees.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No Employees Found</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto text-lg">
              Add employees to generate their ID cards
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
        }
      `}</style>
    </div>
  );
};

export default EmployeesIDCard;