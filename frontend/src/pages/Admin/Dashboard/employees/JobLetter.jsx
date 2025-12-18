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
  Briefcase,
  Award,
  FileText,
  Download,
  Printer,
  Building2,
  Hash,
  DollarSign
} from 'lucide-react';
import { employeeApi } from '../../../../services/employeesApi';

const JobLetter = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchTerm) {
      searchEmployees();
    } else {
      setEmployees([]);
    }
  }, [searchTerm]);

  const searchEmployees = async () => {
    setLoading(true);
    try {
      const result = await employeeApi.getEmployees({
        search: searchTerm,
        status: 'active'
      });
     
      if (result.success) {
        setEmployees(result.data);
      }
    } catch (error) {
      console.error('Error searching employees:', error);
      alert('Error searching employees. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (employee) => {
    try {
      const result = await employeeApi.getJobLetter(employee._id);
     
      if (result.success) {
        setSelectedEmployee(result.data);
      } else {
        alert(result.message || 'Error fetching job letter');
      }
    } catch (error) {
      console.error('Error fetching job letter:', error);
      alert('Error fetching job letter. Please try again.');
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
    alert('Download functionality would be implemented here');
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
          <span className="text-gray-900 dark:text-white font-semibold">Job Letter</span>
        </div>
        {/* Header */}
        <div className="mb-8 print:hidden">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Job Letter</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Search and view employee job offer details</p>
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
                placeholder="Search Employee by Name, Employee ID, or Offer Number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3.5 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-base transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>
          {/* Loading State */}
          {loading && (
            <div className="mt-4 text-center py-4">
              <div className="w-6 h-6 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          )}
          {/* Search Results Dropdown */}
          {searchTerm && employees.length > 0 && !loading && (
            <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4 max-h-64 overflow-y-auto">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">Search Results ({employees.length})</p>
              <div className="space-y-2">
                {employees.map((employee) => (
                  <button
                    key={employee._id}
                    onClick={() => handleSearch(employee)}
                    className="w-full flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all text-left border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {getInitials(employee.employeeName)}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white">{employee.employeeName}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {employee.employeeId} • {employee.offerNumber} • {employee.employeeRole} - {employee.department}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          {searchTerm && employees.length === 0 && !loading && (
            <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4 text-center py-8">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">No employees found matching your search</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Try searching with a different term</p>
            </div>
          )}
        </div>
        {/* Job Letter Content */}
        {selectedEmployee && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Action Buttons */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between print:hidden">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Job Offer Details</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all font-medium"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-500 transition-all font-medium shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
            {/* Letter Content */}
            <div className="p-8 md:p-12">
              {/* Header */}
              <div className="text-center mb-8 pb-6 border-b-2 border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-500 dark:to-indigo-600 rounded-2xl flex items-center justify-center">
                    <Building2 className="w-9 h-9 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Classora Institute</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Excellence in Education</p>
                  </div>
                </div>
                <div className="inline-block px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white rounded-full font-bold text-lg shadow-lg mt-2">
                  JOB OFFER LETTER
                </div>
              </div>

              {/* Employee Photo and Basic Info */}
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                {/* Photo */}
                <div className="flex-shrink-0 self-start">
                  <div className="w-48 h-48 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 rounded-2xl flex items-center justify-center text-white font-bold text-6xl shadow-xl border-4 border-white ring-4 ring-blue-100 dark:ring-blue-900">
                    {getInitials(selectedEmployee.employee.name)}
                  </div>
                </div>
                {/* Basic Info */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-5 rounded-xl border-2 border-blue-100 dark:border-blue-800">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Employee Name</p>
                    </div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white ml-13">{selectedEmployee.employee.name}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-5 rounded-xl border-2 border-purple-100 dark:border-purple-800">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-purple-600 dark:bg-purple-500 rounded-lg flex items-center justify-center">
                        <Hash className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Offer Number</p>
                    </div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white ml-13">{selectedEmployee.employee.offerNumber}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-5 rounded-xl border-2 border-green-100 dark:border-green-800">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-green-600 dark:bg-green-500 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Employee ID</p>
                    </div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white ml-13">{selectedEmployee.employee.employeeId}</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-5 rounded-xl border-2 border-orange-100 dark:border-orange-800">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-orange-600 dark:bg-orange-500 rounded-lg flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Position</p>
                    </div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white ml-13">{selectedEmployee.employee.role}</p>
                  </div>
                </div>
              </div>

              {/* Detailed Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Date of Birth</p>
                      <p className="text-base font-bold text-gray-900 dark:text-white">
                        {selectedEmployee.employee.dateOfBirth ?
                          new Date(selectedEmployee.employee.dateOfBirth).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : 'Not provided'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Joining Date</p>
                      <p className="text-base font-bold text-gray-900 dark:text-white">
                        {new Date(selectedEmployee.employee.joiningDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Phone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Phone Number</p>
                      <p className="text-base font-bold text-gray-900 dark:text-white">{selectedEmployee.employee.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Mail className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Email Address</p>
                      <p className="text-base font-bold text-gray-900 dark:text-white break-all">{selectedEmployee.employee.email}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Award className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Blood Group</p>
                      <p className="text-base font-bold text-gray-900 dark:text-white">{selectedEmployee.employee.bloodGroup || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                    <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Building2 className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Department</p>
                      <p className="text-base font-bold text-gray-900 dark:text-white">{selectedEmployee.employee.department}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                    <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Award className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Qualification</p>
                      <p className="text-base font-bold text-gray-900 dark:text-white">{selectedEmployee.employee.qualification || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                    <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MapPin className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Address</p>
                      <p className="text-base font-bold text-gray-900 dark:text-white">{selectedEmployee.employee.address || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Salary and Experience */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-2xl border-2 border-green-200 dark:border-green-800">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                    Salary Details
                  </h3>
                  <div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Monthly Salary</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{selectedEmployee.salary}</p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-2xl border-2 border-blue-200 dark:border-blue-800">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    Experience
                  </h3>
                  <div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Total Experience</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedEmployee.employee.experience || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-6 rounded-2xl border-2 border-amber-200 dark:border-amber-800 mb-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <User className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  Emergency Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Contact Name</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedEmployee.emergencyContact?.name || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Contact Phone</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedEmployee.emergencyContact?.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-6 mt-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="text-center md:text-left">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Issued on:</p>
                    <p className="font-bold text-gray-900 dark:text-white">
                      {new Date(selectedEmployee.issuedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="border-t-2 border-gray-900 dark:border-gray-100 pt-2 px-8">
                      <p className="font-bold text-gray-900 dark:text-white">HR Manager's Signature</p>
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
        {!selectedEmployee && !loading && (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Search for an Employee</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto text-lg">
              Use the search bar above to find an employee and view their job offer letter details
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
        }
      `}</style>
    </div>
  );
};

export default JobLetter;