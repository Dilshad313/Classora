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
          <span className="text-blue-600 font-semibold">Employees</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-semibold">Job Letter</span>
        </div>

        {/* Header */}
        <div className="mb-8 print:hidden">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Job Letter</h1>
              <p className="text-gray-600 mt-1">Search and view employee job offer details</p>
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
                placeholder="Search Employee by Name, Employee ID, or Offer Number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-base transition-all"
              />
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="mt-4 text-center py-4">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          )}

          {/* Search Results Dropdown */}
          {searchTerm && employees.length > 0 && !loading && (
            <div className="mt-4 border-t border-gray-200 pt-4 max-h-64 overflow-y-auto">
              <p className="text-sm font-semibold text-gray-600 mb-3">Search Results ({employees.length})</p>
              <div className="space-y-2">
                {employees.map((employee) => (
                  <button
                    key={employee._id}
                    onClick={() => handleSearch(employee)}
                    className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-blue-50 rounded-xl transition-all text-left border-2 border-transparent hover:border-blue-200"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {getInitials(employee.employeeName)}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{employee.employeeName}</p>
                      <p className="text-sm text-gray-600">
                        {employee.employeeId} • {employee.offerNumber} • {employee.employeeRole} - {employee.department}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {searchTerm && employees.length === 0 && !loading && (
            <div className="mt-4 border-t border-gray-200 pt-4 text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">No employees found matching your search</p>
              <p className="text-sm text-gray-500 mt-1">Try searching with a different term</p>
            </div>
          )}
        </div>

        {/* Job Letter ID Card */}
        {selectedEmployee && (
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-gray-200 overflow-hidden">
            {/* Action Buttons */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-200 flex items-center justify-between print:hidden">
              <p className="text-sm font-semibold text-gray-700">Job Offer Details</p>
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
                  JOB OFFER LETTER
                </div>
              </div>

              {/* Employee Photo and Basic Info */}
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                {/* Photo Section */}
                <div className="flex-shrink-0">
                  <div className="w-48 h-48 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-6xl shadow-xl border-4 border-white ring-4 ring-blue-100">
                    {getInitials(selectedEmployee.employee.name)}
                  </div>
                </div>

                {/* Basic Info Grid */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border-2 border-blue-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Employee Name</p>
                    </div>
                    <p className="text-xl font-bold text-gray-900 ml-13">{selectedEmployee.employee.name}</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-xl border-2 border-purple-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                        <Hash className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Offer Number</p>
                    </div>
                    <p className="text-xl font-bold text-gray-900 ml-13">{selectedEmployee.employee.offerNumber}</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border-2 border-green-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Employee ID</p>
                    </div>
                    <p className="text-xl font-bold text-gray-900 ml-13">{selectedEmployee.employee.employeeId}</p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-5 rounded-xl border-2 border-orange-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Position</p>
                    </div>
                    <p className="text-xl font-bold text-gray-900 ml-13">{selectedEmployee.employee.role}</p>
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

                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Calendar className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Joining Date</p>
                      <p className="text-base font-bold text-gray-900">
                        {new Date(selectedEmployee.employee.joiningDate).toLocaleDateString('en-US', { 
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
                      <p className="text-base font-bold text-gray-900">{selectedEmployee.employee.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Mail className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Email Address</p>
                      <p className="text-base font-bold text-gray-900 break-all">{selectedEmployee.employee.email}</p>
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
                      <p className="text-base font-bold text-gray-900">{selectedEmployee.employee.bloodGroup || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Building2 className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Department</p>
                      <p className="text-base font-bold text-gray-900">{selectedEmployee.employee.department}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Award className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Qualification</p>
                      <p className="text-base font-bold text-gray-900">{selectedEmployee.employee.qualification || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MapPin className="w-5 h-5 text-pink-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Address</p>
                      <p className="text-base font-bold text-gray-900">{selectedEmployee.employee.address || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Salary and Experience Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <DollarSign className="w-6 h-6 text-green-600" />
                    Salary Details
                  </h3>
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Monthly Salary</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedEmployee.salary}</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border-2 border-blue-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                    Experience
                  </h3>
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Total Experience</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedEmployee.employee.experience || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Emergency Contact Information */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border-2 border-amber-200 mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-6 h-6 text-amber-600" />
                  Emergency Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Contact Name</p>
                    <p className="text-lg font-bold text-gray-900">{selectedEmployee.emergencyContact?.name || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Contact Phone</p>
                    <p className="text-lg font-bold text-gray-900">{selectedEmployee.emergencyContact?.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t-2 border-gray-200 pt-6 mt-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="text-center md:text-left">
                    <p className="text-sm text-gray-600 mb-1">Issued on:</p>
                    <p className="font-bold text-gray-900">
                      {new Date(selectedEmployee.issuedDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="border-t-2 border-gray-900 pt-2 px-8">
                      <p className="font-bold text-gray-900">HR Manager's Signature</p>
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
        {!selectedEmployee && !loading && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg border-2 border-gray-200">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Search for an Employee</h3>
            <p className="text-gray-600 max-w-md mx-auto text-lg">
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