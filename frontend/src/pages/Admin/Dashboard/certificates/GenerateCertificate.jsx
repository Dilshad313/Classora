import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home,
  ChevronRight,
  FileText,
  Calendar,
  Download,
  Printer,
  Building2,
  Award,
  Loader,
  AlertCircle,
  Search,
  Users,
  User
} from 'lucide-react';

// Import API functions
import {
  getCertificateDropdownData,
  generateCertificate,
  getGeneratedCertificate,
  updateCertificateStatus,
  exportCertificateToPDF
} from '../../../../services/certificateApi';

const GenerateCertificate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [dropdownLoading, setDropdownLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    templateId: '',
    recipientType: 'Student',
    recipientId: '',
    customText: '',
    issueDate: new Date().toISOString().split('T')[0],
    validUntil: '',
    issuedBy: 'Principal'
  });
  
  const [dropdownData, setDropdownData] = useState({
    templates: [],
    students: [],
    employees: [],
    recipientData: []
  });
  
  const [showPreview, setShowPreview] = useState(false);
  const [generatedCertificate, setGeneratedCertificate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Check for preselected template from navigation
  useEffect(() => {
    const state = location.state;
    if (state?.selectedTemplate) {
      setFormData(prev => ({
        ...prev,
        templateId: state.selectedTemplate.id
      }));
    }
    
    fetchDropdownData();
  }, []);
  
  const fetchDropdownData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCertificateDropdownData();
      setDropdownData(data);
      
      // If recipient type is already set, filter recipient data
      if (formData.recipientType) {
        setDropdownData(prev => ({
          ...prev,
          recipientData: formData.recipientType === 'Student' ? data.students : data.employees
        }));
      }
    } catch (err) {
      console.error('Error fetching dropdown data:', err);
      setError(err.message || 'Failed to load certificate data');
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // If recipient type changes, update recipient data
    if (name === 'recipientType') {
      setDropdownData(prev => ({
        ...prev,
        recipientData: value === 'Student' ? dropdownData.students : dropdownData.employees
      }));
      
      // Reset recipient selection
      setFormData(prev => ({
        ...prev,
        recipientId: ''
      }));
    }
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Filter recipient data based on search term
  const filteredRecipients = dropdownData.recipientData.filter(recipient => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    
    if (formData.recipientType === 'Student') {
      return (
        recipient.studentName?.toLowerCase().includes(searchLower) ||
        recipient.registrationNo?.toLowerCase().includes(searchLower) ||
        recipient.admissionNumber?.toLowerCase().includes(searchLower) ||
        recipient.selectClass?.toLowerCase().includes(searchLower)
      );
    } else {
      return (
        recipient.employeeName?.toLowerCase().includes(searchLower) ||
        recipient.employeeId?.toLowerCase().includes(searchLower) ||
        recipient.employeeRole?.toLowerCase().includes(searchLower) ||
        recipient.department?.toLowerCase().includes(searchLower)
      );
    }
  });
  
  const handleGenerateCertificate = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.templateId || !formData.recipientId || !formData.issueDate) {
      alert('Please fill all required fields');
      return;
    }
    
    try {
      setGenerating(true);
      setError(null);
      
      const certificate = await generateCertificate(formData);
      setGeneratedCertificate(certificate);
      setShowPreview(true);
      
      // Scroll to preview section
      setTimeout(() => {
        document.getElementById('certificate-preview')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      
    } catch (err) {
      console.error('Error generating certificate:', err);
      setError(err.message || 'Failed to generate certificate');
    } finally {
      setGenerating(false);
    }
  };
  
  const handlePrint = async () => {
    try {
      if (generatedCertificate) {
        await updateCertificateStatus(generatedCertificate._id, 'printed');
        window.print();
      }
    } catch (err) {
      console.error('Error updating print status:', err);
    }
  };
  
  const handleDownload = async () => {
    try {
      if (generatedCertificate) {
        const pdfData = await exportCertificateToPDF(generatedCertificate._id);
        
        // In a real implementation, this would download the PDF
        // For now, we'll show a success message
        alert('Certificate PDF prepared for download');
        
        // You can implement actual PDF download here
        // Example: window.open(pdfData.pdfUrl, '_blank');
      }
    } catch (err) {
      console.error('Error downloading certificate:', err);
      alert(`Failed to download certificate: ${err.message}`);
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const [year, month, day] = dateString.split('-');
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      return dateString;
    }
  };
  
  // Get selected template details
  const selectedTemplate = dropdownData.templates.find(t => t._id === formData.templateId);
  
  // Get selected recipient details
  const selectedRecipient = dropdownData.recipientData.find(r => r._id === formData.recipientId);
  
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading certificate data...</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error && !dropdownData.templates.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-2">
              Error Loading Data
            </h3>
            <p className="text-red-600 dark:text-red-300 mb-6">{error}</p>
            <button 
              onClick={fetchDropdownData}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-lg"
            >
              Retry
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
                  name="templateId"
                  value={formData.templateId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all"
                >
                  <option value="">Select a Template</option>
                  {dropdownData.templates.map(template => (
                    <option key={template._id} value={template._id}>
                      {template.name} - {template.category}
                    </option>
                  ))}
                </select>
                {selectedTemplate && (
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedTemplate.description}
                  </p>
                )}
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
                  <option value="Student">Student</option>
                  <option value="Staff">Staff</option>
                </select>
              </div>

              {/* Select Recipient with Search */}
              {formData.recipientType && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Select {formData.recipientType} <span className="text-red-500">*</span>
                  </label>
                  
                  {/* Search Input */}
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      placeholder={`Search ${formData.recipientType.toLowerCase()}s by name, ID, or class...`}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all"
                    />
                  </div>
                  
                  {/* Recipient List */}
                  <div className="max-h-60 overflow-y-auto border-2 border-gray-300 dark:border-gray-600 rounded-xl">
                    {filteredRecipients.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        <Users className="w-8 h-8 mx-auto mb-2" />
                        <p>No {formData.recipientType.toLowerCase()}s found</p>
                      </div>
                    ) : (
                      filteredRecipients.map(recipient => (
                        <div
                          key={recipient._id}
                          className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-all ${
                            formData.recipientId === recipient._id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                          }`}
                          onClick={() => setFormData(prev => ({ ...prev, recipientId: recipient._id }))}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                {formData.recipientType === 'Student' ? recipient.studentName : recipient.employeeName}
                              </h4>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {formData.recipientType === 'Student' ? (
                                  <>
                                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                                      Class: {recipient.selectClass} - {recipient.section || 'A'}
                                    </span>
                                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                                      ID: {recipient.registrationNo || recipient.admissionNumber}
                                    </span>
                                    {recipient.rollNumber && (
                                      <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                                        Roll: {recipient.rollNumber}
                                      </span>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                                      {recipient.employeeRole}
                                    </span>
                                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                                      {recipient.department}
                                    </span>
                                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                                      ID: {recipient.employeeId}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                            {formData.recipientId === recipient._id && (
                              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {/* Selected Recipient Info */}
                  {selectedRecipient && (
                    <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <h4 className="font-bold text-green-700 dark:text-green-300">
                          Selected: {formData.recipientType === 'Student' ? selectedRecipient.studentName : selectedRecipient.employeeName}
                        </h4>
                      </div>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        {formData.recipientType === 'Student' 
                          ? `Class ${selectedRecipient.selectClass}${selectedRecipient.section ? ` - ${selectedRecipient.section}` : ''} | ID: ${selectedRecipient.registrationNo || selectedRecipient.admissionNumber}`
                          : `${selectedRecipient.employeeRole} | ${selectedRecipient.department}`
                        }
                      </p>
                    </div>
                  )}
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
                  placeholder="e.g., Outstanding Performance, Certificate of Excellence"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all"
                />
              </div>

              {/* Issue Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Issue Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="issueDate"
                  value={formData.issueDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all"
                />
              </div>

              {/* Valid Until (Optional) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Valid Until <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  type="date"
                  name="validUntil"
                  value={formData.validUntil}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all"
                />
              </div>

              {/* Issued By */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Issued By
                </label>
                <select
                  name="issuedBy"
                  value={formData.issuedBy}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all"
                >
                  <option value="Principal">Principal</option>
                  <option value="Director">Director</option>
                  <option value="Head of Department">Head of Department</option>
                  <option value="Registrar">Registrar</option>
                </select>
              </div>
            </div>

            {/* Generate Button */}
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={generating}
                className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-lg ${
                  generating ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {generating ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    Generate Certificate
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 print:hidden">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Certificate Preview Section */}
        {showPreview && generatedCertificate && (
          <div id="certificate-preview" className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Action Buttons */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 p-4 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between print:hidden">
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Certificate Preview
                </p>
                <p className="text-xs text-gray-500">
                  Certificate #: {generatedCertificate.certificateNumber}
                </p>
              </div>
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
                  <span>Download PDF</span>
                </button>
              </div>
            </div>

            {/* Certificate Content */}
            <div className="p-8 md:p-12 bg-white">
              {/* Decorative Border */}
              <div className={`border-8 ${selectedTemplate?.design?.borderStyle === 'double' ? 'border-double' : 'border-solid'} ${
                selectedTemplate?.design?.borderColor === 'blue' ? 'border-blue-600' :
                selectedTemplate?.design?.borderColor === 'green' ? 'border-green-600' :
                selectedTemplate?.design?.borderColor === 'purple' ? 'border-purple-600' :
                selectedTemplate?.design?.borderColor === 'indigo' ? 'border-indigo-600' :
                selectedTemplate?.design?.borderColor === 'orange' ? 'border-orange-600' :
                selectedTemplate?.design?.borderColor === 'pink' ? 'border-pink-600' : 'border-blue-600'
              } p-8 md:p-12 relative`}>
                {/* Corner Decorations */}
                <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-yellow-500"></div>
                <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-yellow-500"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-yellow-500"></div>
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-yellow-500"></div>

                {/* School Logo and Header */}
                <div className="text-center mb-8 pb-6 border-b-2 border-gray-300">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center shadow-lg">
                      <Building2 className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {selectedTemplate?.content?.instituteName || 'Classora Institute'}
                  </h1>
                  <p className="text-sm text-gray-600 font-medium uppercase tracking-wider">
                    {selectedTemplate?.content?.instituteTagline || 'Excellence in Education'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Affiliated to CBSE | School Code: 12345</p>
                </div>

                {/* Certificate Title */}
                <div className="text-center mb-8">
                  <div className="inline-block">
                    <div className={`bg-gradient-to-r ${
                      selectedTemplate?.design?.headerBg === 'gradient-blue' ? 'from-blue-600 to-indigo-600' :
                      selectedTemplate?.design?.headerBg === 'gradient-green' ? 'from-green-600 to-emerald-600' :
                      selectedTemplate?.design?.headerBg === 'gradient-purple' ? 'from-purple-600 to-pink-600' :
                      selectedTemplate?.design?.headerBg === 'gradient-indigo' ? 'from-indigo-600 to-blue-600' :
                      selectedTemplate?.design?.headerBg === 'gradient-orange' ? 'from-orange-600 to-red-600' :
                      selectedTemplate?.design?.headerBg === 'gradient-pink' ? 'from-pink-600 to-rose-600' :
                      'from-blue-600 to-indigo-600'
                    } text-white px-8 py-3 rounded-lg shadow-lg`}>
                      <h2 className="text-2xl font-bold uppercase tracking-wide">
                        {selectedTemplate?.content?.headerTitle || generatedCertificate.title}
                      </h2>
                    </div>
                    {formData.customText && (
                      <div className={`mt-3 font-semibold text-lg italic ${
                        selectedTemplate?.design?.accentColor === 'blue' ? 'text-blue-600' :
                        selectedTemplate?.design?.accentColor === 'green' ? 'text-green-600' :
                        selectedTemplate?.design?.accentColor === 'purple' ? 'text-purple-600' :
                        selectedTemplate?.design?.accentColor === 'indigo' ? 'text-indigo-600' :
                        selectedTemplate?.design?.accentColor === 'orange' ? 'text-orange-600' :
                        selectedTemplate?.design?.accentColor === 'pink' ? 'text-pink-600' :
                        'text-blue-600'
                      }`}>
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
                        This is to certify that <span className={`font-bold text-lg ${
                          selectedTemplate?.design?.accentColor === 'blue' ? 'text-blue-600' :
                          selectedTemplate?.design?.accentColor === 'green' ? 'text-green-600' :
                          selectedTemplate?.design?.accentColor === 'purple' ? 'text-purple-600' :
                          selectedTemplate?.design?.accentColor === 'indigo' ? 'text-indigo-600' :
                          selectedTemplate?.design?.accentColor === 'orange' ? 'text-orange-600' :
                          selectedTemplate?.design?.accentColor === 'pink' ? 'text-pink-600' :
                          'text-blue-600'
                        }`}>{selectedRecipient?.studentName}</span>, 
                        son/daughter of <span className="font-semibold">{generatedCertificate.content?.fatherName || '[Parent Name]'}</span>, 
                        was a bonafide student of this institute.
                      </p>
                      
                      <p className="text-base">
                        The student, bearing admission number <span className="font-semibold">{selectedRecipient?.admissionNumber || selectedRecipient?.registrationNo}</span>, 
                        was enrolled in class <span className="font-semibold">{selectedRecipient?.selectClass}</span> at the time of leaving.
                      </p>
                      
                      <p className="text-base">
                        Born on <span className="font-semibold">{generatedCertificate.content?.dateOfBirth || '[Date of Birth]'}</span>, 
                        the student was admitted to this institution on <span className="font-semibold">{generatedCertificate.content?.admissionDate || '[Admission Date]'}</span>, 
                        and left on <span className="font-semibold">[Leaving Date]</span>, 
                        due to <span className="font-semibold">[Reason]</span>.
                      </p>
                      
                      <p className="text-base">
                        During their tenure, <span className={`font-bold ${
                          selectedTemplate?.design?.accentColor === 'blue' ? 'text-blue-600' :
                          selectedTemplate?.design?.accentColor === 'green' ? 'text-green-600' :
                          selectedTemplate?.design?.accentColor === 'purple' ? 'text-purple-600' :
                          selectedTemplate?.design?.accentColor === 'indigo' ? 'text-indigo-600' :
                          selectedTemplate?.design?.accentColor === 'orange' ? 'text-orange-600' :
                          selectedTemplate?.design?.accentColor === 'pink' ? 'text-pink-600' :
                          'text-blue-600'
                        }`}>{selectedRecipient?.studentName}</span>'s 
                        conduct and behavior were found to be <span className="font-semibold text-green-600">excellent</span>.
                      </p>
                      
                      <p className="text-base">
                        The student has cleared all dues and obligations to the school.
                      </p>
                      
                      <p className="text-base font-medium">
                        We wish <span className={`font-bold ${
                          selectedTemplate?.design?.accentColor === 'blue' ? 'text-blue-600' :
                          selectedTemplate?.design?.accentColor === 'green' ? 'text-green-600' :
                          selectedTemplate?.design?.accentColor === 'purple' ? 'text-purple-600' :
                          selectedTemplate?.design?.accentColor === 'indigo' ? 'text-indigo-600' :
                          selectedTemplate?.design?.accentColor === 'orange' ? 'text-orange-600' :
                          selectedTemplate?.design?.accentColor === 'pink' ? 'text-pink-600' :
                          'text-blue-600'
                        }`}>{selectedRecipient?.studentName}</span> success in all future endeavors.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-base">
                        This is to certify that <span className={`font-bold text-lg ${
                          selectedTemplate?.design?.accentColor === 'blue' ? 'text-blue-600' :
                          selectedTemplate?.design?.accentColor === 'green' ? 'text-green-600' :
                          selectedTemplate?.design?.accentColor === 'purple' ? 'text-purple-600' :
                          selectedTemplate?.design?.accentColor === 'indigo' ? 'text-indigo-600' :
                          selectedTemplate?.design?.accentColor === 'orange' ? 'text-orange-600' :
                          selectedTemplate?.design?.accentColor === 'pink' ? 'text-pink-600' :
                          'text-blue-600'
                        }`}>{selectedRecipient?.employeeName}</span>, 
                        serving as <span className="font-semibold">{selectedRecipient?.employeeRole}</span>, 
                        has been a valued member of our institution.
                      </p>
                      
                      <p className="text-base">
                        The staff member, bearing employee ID <span className="font-semibold">{selectedRecipient?.employeeId}</span>, 
                        was associated with the <span className="font-semibold">{selectedRecipient?.department}</span> department.
                      </p>
                      
                      <p className="text-base">
                        {selectedRecipient?.employeeName} joined this institution on <span className="font-semibold">{generatedCertificate.content?.dateOfJoining || '[Joining Date]'}</span>, 
                        and completed their tenure on <span className="font-semibold">[Leaving Date]</span>.
                      </p>
                      
                      <p className="text-base">
                        During their service, <span className={`font-bold ${
                          selectedTemplate?.design?.accentColor === 'blue' ? 'text-blue-600' :
                          selectedTemplate?.design?.accentColor === 'green' ? 'text-green-600' :
                          selectedTemplate?.design?.accentColor === 'purple' ? 'text-purple-600' :
                          selectedTemplate?.design?.accentColor === 'indigo' ? 'text-indigo-600' :
                          selectedTemplate?.design?.accentColor === 'orange' ? 'text-orange-600' :
                          selectedTemplate?.design?.accentColor === 'pink' ? 'text-pink-600' :
                          'text-blue-600'
                        }`}>{selectedRecipient?.employeeName}</span>'s 
                        conduct and performance were found to be <span className="font-semibold text-green-600">excellent</span>.
                      </p>
                      
                      <p className="text-base">
                        The staff member has cleared all dues and obligations to the institution.
                      </p>
                      
                      <p className="text-base font-medium">
                        We wish <span className={`font-bold ${
                          selectedTemplate?.design?.accentColor === 'blue' ? 'text-blue-600' :
                          selectedTemplate?.design?.accentColor === 'green' ? 'text-green-600' :
                          selectedTemplate?.design?.accentColor === 'purple' ? 'text-purple-600' :
                          selectedTemplate?.design?.accentColor === 'indigo' ? 'text-indigo-600' :
                          selectedTemplate?.design?.accentColor === 'orange' ? 'text-orange-600' :
                          selectedTemplate?.design?.accentColor === 'pink' ? 'text-pink-600' :
                          'text-blue-600'
                        }`}>{selectedRecipient?.employeeName}</span> success in all future endeavors.
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
                        {formatDate(formData.issueDate)}
                      </p>
                      {formData.validUntil && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 mb-1">Valid Until:</p>
                          <p className="font-bold text-gray-900 text-lg">
                            {formatDate(formData.validUntil)}
                          </p>
                        </div>
                      )}
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
                          <p className="font-bold text-gray-900">{formData.issuedBy}'s Signature</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">Authorized Signatory</p>
                    </div>
                  </div>
                </div>

                {/* Footer Note */}
                <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                  <p className="text-xs text-gray-500 italic">
                    {selectedTemplate?.content?.footerText || 'This is a computer-generated certificate and does not require a physical signature.'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    For verification, please contact: admin@classora.edu | +91 1234567890
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Certificate #: {generatedCertificate.certificateNumber}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!showPreview && !loading && (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700 print:hidden">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">Fill the Form Above</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto text-lg">
              Complete the form with required details to generate a certificate preview
            </p>
            <div className="mt-6 text-sm text-gray-500">
              <p>• Select a template and recipient</p>
              <p>• Customize the text if needed</p>
              <p>• Set the issue date and generate</p>
            </div>
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
            size: A4 landscape;
            margin: 1cm;
          }
          #certificate-preview {
            border: none !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default GenerateCertificate;