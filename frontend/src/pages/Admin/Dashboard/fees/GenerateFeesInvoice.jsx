import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home,
  ChevronRight,
  FileText,
  Search,
  Printer,
  Calendar,
  DollarSign,
  Building,
  Users,
  User,
  GraduationCap,
  AlertCircle,
  CheckCircle,
  Loader
} from 'lucide-react';
import * as feesApi from '../../../../services/feesApi'; 
import * as studentApi from '../../../../services/studentApi';

const GenerateFeesInvoice = () => {
  const navigate = useNavigate();

  // State management
  const [invoiceType, setInvoiceType] = useState('student');
  const [formData, setFormData] = useState({
    feeMonth: '',
    dueDate: '',
    fineAfterDueDate: '',
    selectedBank: '',
    searchQuery: ''
  });

  const [selectedEntity, setSelectedEntity] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [copyType, setCopyType] = useState('student');
  const [invoiceGenerated, setInvoiceGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [feeStructures, setFeeStructures] = useState({});

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load students
      const studentsResponse = await studentApi.getStudents();
      const studentsList = Array.isArray(studentsResponse) ? studentsResponse : [];
      setStudents(studentsList);

      // Extract unique classes from students
      const uniqueClasses = [...new Set(studentsList.map(s => s.selectClass || s.class))];
      setClasses(uniqueClasses.map(cls => ({ id: cls, name: cls })));

      // Load fee structures
      const feeStructuresResponse = await feesApi.getFeeStructures();
      const structuresMap = {};
      const structures = Array.isArray(feeStructuresResponse) ? feeStructuresResponse : [];
      structures.forEach(structure => {
        structuresMap[structure.className || structure.class] = structure;
      });
      setFeeStructures(structuresMap);

    } catch (error) {
      console.error('Error loading initial data:', error);
      alert('Failed to load initial data');
    } finally {
      setLoading(false);
    }
  };

  // Get filtered suggestions based on invoice type
  const getSuggestions = () => {
    const query = formData.searchQuery.toLowerCase();
    if (!query) return [];

    switch(invoiceType) {
      case 'student':
        return students.filter(s => 
          s.studentName.toLowerCase().includes(query) || 
          (s.registrationNo && s.registrationNo.toLowerCase().includes(query))
        ).slice(0, 10); // Limit to 10 results
      case 'class':
        return classes.filter(c => 
          c.name.toLowerCase().includes(query)
        ).slice(0, 10);
      default:
        return [];
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'searchQuery') {
      setShowSuggestions(value.length > 0);
      if (value.length === 0) {
        setSelectedEntity(null);
      }
    }
  };

  const handleSelectEntity = (entity) => {
    setSelectedEntity(entity);
    setFormData(prev => ({ 
      ...prev, 
      searchQuery: invoiceType === 'student' ? entity.studentName : entity.name 
    }));
    setShowSuggestions(false);
  };

  const handleGenerate = () => {
    if (!formData.feeMonth || !formData.dueDate || !selectedEntity) {
      alert('Please fill all required fields');
      return;
    }
    setInvoiceGenerated(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const getInvoiceTitle = () => {
    switch(invoiceType) {
      case 'student': return 'Student';
      case 'class': return 'Class';
      default: return '';
    }
  };

  const calculateTotalFee = (structure) => {
    if (!structure) return 0;
    return (structure.tuitionFee || 0) + (structure.admissionFee || 0) + (structure.examFee || 0) + 
           (structure.labFee || 0) + (structure.libraryFee || 0) + (structure.sportsFee || 0);
  };

  const getFeeAmount = () => {
    if (!selectedEntity) return 0;
    
    if (invoiceType === 'student') {
      const structure = feeStructures[selectedEntity.selectClass || selectedEntity.class];
      return calculateTotalFee(structure) || 5000;
    } else if (invoiceType === 'class') {
      const structure = feeStructures[selectedEntity.name];
      return calculateTotalFee(structure) || 5000;
    }
    
    return 0;
  };

  const feeAmount = getFeeAmount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 mb-6 text-sm no-print">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-blue-600 font-semibold">Fees</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-semibold">Generate Fees Invoice</span>
        </div>

        {/* Header */}
        <div className="mb-8 no-print">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Generate Fees Invoice</h1>
              <p className="text-gray-600 mt-1">Create and print fee invoices for students or classes</p>
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader className="w-8 h-8 animate-spin text-purple-600" />
            <span className="ml-2 text-gray-600">Loading data...</span>
          </div>
        )}

        {/* Invoice Type Selection */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6 no-print">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Select Invoice Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => {
                setInvoiceType('student');
                setFormData({ feeMonth: '', dueDate: '', fineAfterDueDate: '', selectedBank: '', searchQuery: '' });
                setSelectedEntity(null);
                setInvoiceGenerated(false);
              }}
              className={`p-6 rounded-xl border-2 transition-all ${
                invoiceType === 'student'
                  ? 'border-purple-600 bg-purple-50 shadow-md'
                  : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
              }`}
            >
              <User className={`w-8 h-8 mx-auto mb-3 ${invoiceType === 'student' ? 'text-purple-600' : 'text-gray-400'}`} />
              <h3 className={`font-bold text-lg ${invoiceType === 'student' ? 'text-purple-600' : 'text-gray-700'}`}>
                Student-wise
              </h3>
              <p className="text-sm text-gray-600 mt-1">Generate invoice for individual student</p>
            </button>

            <button
              onClick={() => {
                setInvoiceType('class');
                setFormData({ feeMonth: '', dueDate: '', fineAfterDueDate: '', selectedBank: '', searchQuery: '' });
                setSelectedEntity(null);
                setInvoiceGenerated(false);
              }}
              className={`p-6 rounded-xl border-2 transition-all ${
                invoiceType === 'class'
                  ? 'border-purple-600 bg-purple-50 shadow-md'
                  : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
              }`}
            >
              <GraduationCap className={`w-8 h-8 mx-auto mb-3 ${invoiceType === 'class' ? 'text-purple-600' : 'text-gray-400'}`} />
              <h3 className={`font-bold text-lg ${invoiceType === 'class' ? 'text-purple-600' : 'text-gray-700'}`}>
                Class-wise
              </h3>
              <p className="text-sm text-gray-600 mt-1">Generate invoice for entire class</p>
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-6 no-print">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FileText className="w-6 h-6 text-purple-600" />
            Fees Invoice for {getInvoiceTitle()}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fee Month */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Fee Month <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="month"
                  value={formData.feeMonth}
                  onChange={(e) => handleInputChange('feeMonth', e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Due Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            {/* Fine After Due Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Fine After Due Date
              </label>
              <div className="relative">
                <DollarSign className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  value={formData.fineAfterDueDate}
                  onChange={(e) => handleInputChange('fineAfterDueDate', e.target.value)}
                  placeholder="Enter fine amount"
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            {/* Search Student/Class */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search {getInvoiceTitle()} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400 z-10" />
                <input
                  type="text"
                  value={formData.searchQuery}
                  onChange={(e) => handleInputChange('searchQuery', e.target.value)}
                  placeholder={`Type to search ${invoiceType}...`}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                
                {/* Suggestions Dropdown */}
                {showSuggestions && getSuggestions().length > 0 && (
                  <div className="absolute z-20 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {getSuggestions().map(entity => (
                      <button
                        key={entity._id || entity.id}
                        onClick={() => handleSelectEntity(entity)}
                        className="w-full px-4 py-3 text-left hover:bg-purple-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-semibold text-gray-900">
                          {entity.studentName || entity.name}
                        </div>
                        {invoiceType === 'student' && (
                          <div className="text-sm text-gray-600">
                            {entity.selectClass || entity.class} • Reg No: {entity.registrationNo} • Fee: ₹{calculateTotalFee(feeStructures[entity.selectClass || entity.class]) || 'N/A'}
                          </div>
                        )}
                        {invoiceType === 'class' && (
                          <div className="text-sm text-gray-600">
                            Class: {entity.name} • Fee: ₹{calculateTotalFee(feeStructures[entity.name]) || 'N/A'}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {selectedEntity && (
                <div className="mt-3 p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-800 font-semibold">
                    Selected: {selectedEntity.studentName || selectedEntity.name}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Generate Button */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleGenerate}
              className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <FileText className="w-5 h-5" />
              Generate Invoice
            </button>
          </div>
        </div>

        {/* Invoice Preview */}
        {invoiceGenerated && selectedEntity && (
          <>
            {/* Copy Type Toggle */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6 no-print">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Select Copy Type</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setCopyType('student')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    copyType === 'student'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {invoiceType === 'student' ? 'Student' : 'Class'} Copy
                </button>
                <button
                  onClick={() => setCopyType('institute')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    copyType === 'institute'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Institute Copy
                </button>

                <div className="flex-1" />

                <button
                  onClick={handlePrint}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <Printer className="w-5 h-5" />
                  Print Invoice
                </button>
              </div>
            </div>

            {/* Invoice */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 print-section">
              {/* Copy Type Header */}
              <div className="text-center mb-6 pb-4 border-b-2 border-gray-300">
                <h2 className="text-2xl font-bold text-purple-600 uppercase tracking-wide">
                  {copyType === 'student' ? `${getInvoiceTitle().toUpperCase()} COPY` : 'INSTITUTE COPY'}
                </h2>
              </div>

              {/* Institute Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Classora Institute</h1>
                <p className="text-gray-600">123 Education Street, City, State - 123456</p>
                <p className="text-gray-600">Phone: +91 1234567890 | Email: info@classora.edu</p>
              </div>

              {/* Invoice Title */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 bg-purple-100 py-3 rounded-lg">
                  FEE INVOICE
                </h2>
              </div>

              {/* Invoice Details */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-sm text-gray-600">Invoice To:</p>
                  <p className="text-lg font-bold text-gray-900">
                    {selectedEntity.studentName || selectedEntity.name}
                  </p>
                  {invoiceType === 'student' && (
                    <>
                      <p className="text-gray-700">Class: {selectedEntity.selectClass || selectedEntity.class}</p>
                      <p className="text-gray-700">
                        Registration No: {selectedEntity.registrationNo}
                      </p>
                      <p className="text-gray-700">
                        Guardian: {selectedEntity.guardianName || selectedEntity.fatherName}
                      </p>
                    </>
                  )}
                  {invoiceType === 'class' && (
                    <p className="text-gray-700">Class: {selectedEntity.name}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Invoice Date:</p>
                  <p className="text-lg font-bold text-gray-900">
                    {new Date().toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Fee Month:</p>
                  <p className="text-lg font-bold text-gray-900">
                    {new Date(formData.feeMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Due Date:</p>
                  <p className="text-lg font-bold text-red-600">
                    {new Date(formData.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Fee Details Table */}
              <div className="mb-8">
                <table className="w-full border-2 border-gray-300">
                  <thead>
                    <tr className="bg-purple-600 text-white">
                      <th className="border border-gray-300 px-4 py-3 text-left">Description</th>
                      <th className="border border-gray-300 px-4 py-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3">
                        {invoiceType === 'student' ? 'Tuition Fee' : 'Class Fee'}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-right font-semibold">
                        ₹{feeAmount}
                      </td>
                    </tr>
                    {formData.fineAfterDueDate && (
                      <tr className="bg-red-50">
                        <td className="border border-gray-300 px-4 py-3 text-red-700">
                          Fine (After Due Date)
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-right font-semibold text-red-700">
                          ₹{formData.fineAfterDueDate}
                        </td>
                      </tr>
                    )}
                    <tr className="bg-purple-100">
                      <td className="border border-gray-300 px-4 py-3 font-bold text-lg">
                        Total Amount
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-right font-bold text-lg text-purple-600">
                        ₹{feeAmount + (parseFloat(formData.fineAfterDueDate) || 0)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Important Notes */}
              <div className="mb-8 p-4 bg-yellow-50 border-l-4 border-yellow-500">
                <h4 className="font-bold text-gray-900 mb-2">Important Notes:</h4>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  <li>Please pay the fee before the due date to avoid fine</li>
                  <li>Payment can be made via cash, cheque, or online transfer</li>
                  <li>Keep this invoice for your records</li>
                  {formData.fineAfterDueDate && (
                    <li className="text-red-600 font-semibold">
                      A fine of ₹{formData.fineAfterDueDate} will be charged after the due date
                    </li>
                  )}
                </ul>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-end pt-8 border-t-2 border-gray-300">
                <div>
                  <p className="text-sm text-gray-600 mb-8">
                    {invoiceType === 'student' ? 'Student/Parent Signature' : 'Class Representative Signature'}
                  </p>
                  <div className="border-t-2 border-gray-400 w-48"></div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-8">Authorized Signature</p>
                  <div className="border-t-2 border-gray-400 w-48"></div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .print-section {
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            padding: 20px !important;
          }
          body {
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
};

export default GenerateFeesInvoice;