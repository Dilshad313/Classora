import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home,
  ChevronRight,
  FileText,
  Calendar,
  Download,
  Printer,
  Building2,
  Award
} from 'lucide-react';

const GenerateCertificate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    template: '',
    recipientType: '',
    selectedPerson: '',
    customText: '',
    date: ''
  });
  const [showPreview, setShowPreview] = useState(false);

  // Mock data for dropdowns
  const templates = [
    { id: 1, name: 'Leave Certificate' },
    { id: 2, name: 'Character Certificate' },
    { id: 3, name: 'Transfer Certificate' },
    { id: 4, name: 'Bonafide Certificate' },
    { id: 5, name: 'Achievement Certificate' }
  ];

  const recipientTypes = [
    { id: 1, name: 'Student' },
    { id: 2, name: 'Staff' }
  ];

  // Mock students list
  const students = [
    { id: 1, name: 'Anjali A', class: '10', admissionNumber: '2201237', rollNumber: '001' },
    { id: 2, name: 'Rahul Kumar', class: '10', admissionNumber: '2201238', rollNumber: '002' },
    { id: 3, name: 'Priya Sharma', class: '9', admissionNumber: '2201239', rollNumber: '003' },
    { id: 4, name: 'Arjun Patel', class: '11', admissionNumber: '2201240', rollNumber: '004' },
    { id: 5, name: 'Sneha Reddy', class: '10', admissionNumber: '2201241', rollNumber: '005' }
  ];

  // Mock staff list
  const staff = [
    { id: 1, name: 'Dr. Rajesh Kumar', designation: 'Principal', employeeId: 'EMP001', department: 'Administration' },
    { id: 2, name: 'Mrs. Sunita Verma', designation: 'Vice Principal', employeeId: 'EMP002', department: 'Administration' },
    { id: 3, name: 'Mr. Anil Sharma', designation: 'Mathematics Teacher', employeeId: 'EMP003', department: 'Teaching' },
    { id: 4, name: 'Ms. Kavita Singh', designation: 'English Teacher', employeeId: 'EMP004', department: 'Teaching' },
    { id: 5, name: 'Mr. Vikram Joshi', designation: 'Lab Assistant', employeeId: 'EMP005', department: 'Support Staff' }
  ];

  // Mock student data (in real app, this would come from API based on recipient type)
  const studentData = {
    name: 'Anjali A',
    parentName: 'Mr. Arun Kumar',
    admissionNumber: '2201237',
    class: '10',
    dateOfBirth: 'November 30, -0001',
    admissionDate: 'November 06, 2025',
    leavingDate: 'November 10, 2025',
    reason: 'Family Relocation',
    conduct: 'excellent'
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Reset selected person when recipient type changes
    if (name === 'recipientType') {
      setFormData(prev => ({
        ...prev,
        selectedPerson: ''
      }));
    }
  };

  const handleGenerateCertificate = (e) => {
    e.preventDefault();
    if (formData.template && formData.recipientType && formData.selectedPerson && formData.date) {
      setShowPreview(true);
    }
  };

  // Get selected person details
  const getSelectedPersonDetails = () => {
    if (formData.recipientType === 'Student') {
      const student = students.find(s => s.id === parseInt(formData.selectedPerson));
      if (student) {
        return {
          name: student.name,
          parentName: 'Mr./Mrs. [Parent Name]',
          admissionNumber: student.admissionNumber,
          class: student.class,
          dateOfBirth: 'November 30, -0001',
          admissionDate: 'November 06, 2025',
          leavingDate: 'November 10, 2025',
          reason: 'Family Relocation',
          conduct: 'excellent'
        };
      }
    } else if (formData.recipientType === 'Staff') {
      const staffMember = staff.find(s => s.id === parseInt(formData.selectedPerson));
      if (staffMember) {
        return {
          name: staffMember.name,
          designation: staffMember.designation,
          employeeId: staffMember.employeeId,
          department: staffMember.department,
          joiningDate: 'January 15, 2020',
          leavingDate: 'November 10, 2025',
          conduct: 'excellent'
        };
      }
    }
    return studentData; // fallback
  };

  const personDetails = getSelectedPersonDetails();

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert('Download functionality would be implemented here');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
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
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600" />
          <span className="text-blue-600 dark:text-blue-400 font-semibold">Certificates</span>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600" />
          <span className="text-gray-900 dark:text-gray-100 font-semibold">Generate Certificate</span>
        </div>

        {/* Header */}
        <div className="mb-8 print:hidden">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Generate Certificate</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Create and customize certificates for students and staff</p>
        </div>

        {/* Form Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8 print:hidden">
          <form onSubmit={handleGenerateCertificate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Select Template */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Select Template <span className="text-red-500">*</span>
                </label>
                <select
                  name="template"
                  value={formData.template}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all"
                >
                  <option value="">Select a Template</option>
                  {templates.map(template => (
                    <option key={template.id} value={template.name}>{template.name}</option>
                  ))}
                </select>
              </div>

              {/* Recipient Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Recipient Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="recipientType"
                  value={formData.recipientType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all"
                >
                  <option value="">Select Recipient Type</option>
                  {recipientTypes.map(type => (
                    <option key={type.id} value={type.name}>{type.name}</option>
                  ))}
                </select>
              </div>

              {/* Select Student or Staff - Conditional Dropdown */}
              {formData.recipientType && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Select {formData.recipientType} <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="selectedPerson"
                    value={formData.selectedPerson}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all"
                  >
                    <option value="">Select {formData.recipientType}</option>
                    {formData.recipientType === 'Student' && students.map(student => (
                      <option key={student.id} value={student.id}>
                        {student.name} - Class {student.class} (Roll: {student.rollNumber})
                      </option>
                    ))}
                    {formData.recipientType === 'Staff' && staff.map(staffMember => (
                      <option key={staffMember.id} value={staffMember.id}>
                        {staffMember.name} - {staffMember.designation}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Custom Text */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Custom Text <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="customText"
                  value={formData.customText}
                  onChange={handleInputChange}
                  placeholder="e.g., Outstanding Performance"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all"
                />
              </div>
            </div>

            {/* Generate Button */}
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-lg"
              >
                <FileText className="w-5 h-5" />
                Generate Certificate
              </button>
            </div>
          </form>
        </div>

        {/* Certificate Preview Section */}
        {showPreview && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Action Buttons */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 p-4 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between print:hidden">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Certificate Preview</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-400 transition-all font-medium"
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

            {/* Certificate Content */}
            <div className="p-12 md:p-16 bg-white">
              {/* Decorative Border */}
              <div className="border-8 border-double border-blue-600 p-8 md:p-12 relative">
                {/* Corner Decorations */}
                <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-gold-500"></div>
                <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-gold-500"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-gold-500"></div>
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-gold-500"></div>

                {/* School Logo and Header */}
                <div className="text-center mb-8 pb-6 border-b-2 border-gray-300">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center shadow-lg">
                      <Building2 className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">Classora Institute</h1>
                  <p className="text-sm text-gray-600 font-medium uppercase tracking-wider">Excellence in Education</p>
                  <p className="text-xs text-gray-500 mt-1">Affiliated to CBSE | School Code: 12345</p>
                </div>

                {/* Certificate Title */}
                <div className="text-center mb-8">
                  <div className="inline-block">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg shadow-lg">
                      <h2 className="text-2xl font-bold uppercase tracking-wide">{formData.template}</h2>
                    </div>
                    {formData.customText && (
                      <div className="mt-3 text-blue-600 font-semibold text-lg italic">
                        {formData.customText}
                      </div>
                    )}
                  </div>
                </div>

                {/* Certificate Body */}
                <div className="text-center mb-8 space-y-4 text-gray-800 leading-relaxed">
                  {formData.recipientType === 'Student' ? (
                    <>
                      <p className="text-base">
                        This is to certify that <span className="font-bold text-blue-600 text-lg">{personDetails.name}</span>, 
                        son/daughter of <span className="font-semibold">{personDetails.parentName}</span>, 
                        was a bonafide student of this institute.
                      </p>
                      
                      <p className="text-base">
                        The student, bearing admission number <span className="font-semibold">{personDetails.admissionNumber}</span>, 
                        was enrolled in class <span className="font-semibold">{personDetails.class}</span> at the time of leaving.
                      </p>
                      
                      <p className="text-base">
                        Born on <span className="font-semibold">{personDetails.dateOfBirth}</span>, 
                        the student was admitted to this institution on <span className="font-semibold">{personDetails.admissionDate}</span>, 
                        and left on <span className="font-semibold">{personDetails.leavingDate}</span>, 
                        due to <span className="font-semibold">{personDetails.reason}</span>.
                      </p>
                      
                      <p className="text-base">
                        During their tenure, <span className="font-bold text-blue-600">{personDetails.name}</span>'s 
                        conduct and behavior were found to be <span className="font-semibold text-green-600">{personDetails.conduct}</span>.
                      </p>
                      
                      <p className="text-base">
                        The student has cleared all dues and obligations to the school.
                      </p>
                      
                      <p className="text-base font-medium">
                        We wish <span className="font-bold text-blue-600">{personDetails.name}</span> success in all future endeavors.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-base">
                        This is to certify that <span className="font-bold text-blue-600 text-lg">{personDetails.name}</span>, 
                        serving as <span className="font-semibold">{personDetails.designation}</span>, 
                        has been a valued member of our institution.
                      </p>
                      
                      <p className="text-base">
                        The staff member, bearing employee ID <span className="font-semibold">{personDetails.employeeId}</span>, 
                        was associated with the <span className="font-semibold">{personDetails.department}</span> department.
                      </p>
                      
                      <p className="text-base">
                        {personDetails.name} joined this institution on <span className="font-semibold">{personDetails.joiningDate}</span>, 
                        and completed their tenure on <span className="font-semibold">{personDetails.leavingDate}</span>.
                      </p>
                      
                      <p className="text-base">
                        During their service, <span className="font-bold text-blue-600">{personDetails.name}</span>'s 
                        conduct and performance were found to be <span className="font-semibold text-green-600">{personDetails.conduct}</span>.
                      </p>
                      
                      <p className="text-base">
                        The staff member has cleared all dues and obligations to the institution.
                      </p>
                      
                      <p className="text-base font-medium">
                        We wish <span className="font-bold text-blue-600">{personDetails.name}</span> success in all future endeavors.
                      </p>
                    </>
                  )}
                </div>

                {/* Date and Signature Section */}
                <div className="mt-12 pt-8 border-t-2 border-gray-300">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                    {/* Date */}
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Date of Issue:</p>
                      <p className="font-bold text-gray-900 text-lg">
                        {formatDate(formData.date)}
                      </p>
                    </div>

                    {/* School Seal */}
                    <div className="text-center">
                      <div className="w-28 h-28 border-4 border-blue-600 rounded-full flex items-center justify-center bg-blue-50 mb-2 mx-auto">
                        <div className="text-center">
                          <Award className="w-8 h-8 text-blue-600 mx-auto mb-1" />
                          <p className="text-xs font-bold text-blue-600">SCHOOL</p>
                          <p className="text-xs font-bold text-blue-600">SEAL</p>
                        </div>
                      </div>
                    </div>

                    {/* Authorized Signature */}
                    <div className="text-center md:text-right">
                      <div className="mb-2">
                        <div className="w-48 border-t-2 border-gray-900 pt-2">
                          <p className="font-bold text-gray-900">Principal's Signature</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">Authorized Signatory</p>
                    </div>
                  </div>
                </div>

                {/* Footer Note */}
                <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                  <p className="text-xs text-gray-500 italic">
                    This is a computer-generated certificate and does not require a physical signature.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    For verification, please contact: admin@classora.edu | +91 1234567890
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!showPreview && (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700 print:hidden">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">Fill the Form Above</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto text-lg">
              Complete the form with required details to generate a certificate preview
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
            margin: 0.5cm;
          }
        }
      `}</style>
    </div>
  );
};

export default GenerateCertificate;
