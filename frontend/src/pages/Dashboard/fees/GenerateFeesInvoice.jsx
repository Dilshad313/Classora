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
  CheckCircle
} from 'lucide-react';

const GenerateFeesInvoice = () => {
  const navigate = useNavigate();

  // Check if banks are available (simulated - replace with actual API call)
  const [banks, setBanks] = useState([
    { id: 1, bankName: 'State Bank', accountNumber: '1234567890' },
    { id: 2, bankName: 'HDFC Bank', accountNumber: '0987654321' }
  ]);

  // Redirect if no banks available
  useEffect(() => {
    if (banks.length === 0) {
      alert('No bank accounts found. Please add a bank account first.');
      navigate('/dashboard/settings/accounts');
    }
  }, [banks, navigate]);

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

  // Sample data - replace with actual API data
  const students = [
    { id: 1, name: 'John Doe', class: 'Class 10-A', rollNo: '101', feeAmount: 5000 },
    { id: 2, name: 'Jane Smith', class: 'Class 9-B', rollNo: '102', feeAmount: 4500 },
    { id: 3, name: 'Mike Johnson', class: 'Class 10-A', rollNo: '103', feeAmount: 5000 },
    { id: 4, name: 'Sarah Williams', class: 'Class 8-C', rollNo: '104', feeAmount: 4000 }
  ];

  const classes = [
    { id: 1, name: 'Class 10-A', students: 45, feeAmount: 5000 },
    { id: 2, name: 'Class 9-B', students: 40, feeAmount: 4500 },
    { id: 3, name: 'Class 8-C', students: 38, feeAmount: 4000 }
  ];

  const families = [
    { id: 1, name: 'Doe Family', students: ['John Doe', 'Emily Doe'], totalFee: 10000 },
    { id: 2, name: 'Smith Family', students: ['Jane Smith'], totalFee: 4500 },
    { id: 3, name: 'Johnson Family', students: ['Mike Johnson', 'Lisa Johnson'], totalFee: 9500 }
  ];

  // Get filtered suggestions based on invoice type
  const getSuggestions = () => {
    const query = formData.searchQuery.toLowerCase();
    if (!query) return [];

    switch(invoiceType) {
      case 'student':
        return students.filter(s => 
          s.name.toLowerCase().includes(query) || 
          s.rollNo.includes(query)
        );
      case 'class':
        return classes.filter(c => c.name.toLowerCase().includes(query));
      case 'family':
        return families.filter(f => f.name.toLowerCase().includes(query));
      default:
        return [];
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'searchQuery') {
      setShowSuggestions(value.length > 0);
      setSelectedEntity(null);
    }
  };

  const handleSelectEntity = (entity) => {
    setSelectedEntity(entity);
    setFormData(prev => ({ ...prev, searchQuery: entity.name }));
    setShowSuggestions(false);
  };

  const handleGenerate = () => {
    if (!formData.feeMonth || !formData.dueDate || !formData.selectedBank || !selectedEntity) {
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
      case 'family': return 'Family';
      default: return '';
    }
  };

  const selectedBank = banks.find(b => b.id === parseInt(formData.selectedBank));

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
              <p className="text-gray-600 mt-1">Create and print fee invoices for students, classes, or families</p>
            </div>
          </div>
        </div>

        {/* Invoice Type Selection */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6 no-print">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Select Invoice Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => {
                setInvoiceType('student');
                setFormData({ ...formData, searchQuery: '' });
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
                setFormData({ ...formData, searchQuery: '' });
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

            <button
              onClick={() => {
                setInvoiceType('family');
                setFormData({ ...formData, searchQuery: '' });
                setSelectedEntity(null);
                setInvoiceGenerated(false);
              }}
              className={`p-6 rounded-xl border-2 transition-all ${
                invoiceType === 'family'
                  ? 'border-purple-600 bg-purple-50 shadow-md'
                  : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
              }`}
            >
              <Users className={`w-8 h-8 mx-auto mb-3 ${invoiceType === 'family' ? 'text-purple-600' : 'text-gray-400'}`} />
              <h3 className={`font-bold text-lg ${invoiceType === 'family' ? 'text-purple-600' : 'text-gray-700'}`}>
                Family-wise
              </h3>
              <p className="text-sm text-gray-600 mt-1">Generate invoice for family</p>
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

            {/* Select Bank */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Bank <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={formData.selectedBank}
                  onChange={(e) => handleInputChange('selectedBank', e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Select a bank</option>
                  {banks.map(bank => (
                    <option key={bank.id} value={bank.id}>
                      {bank.bankName} - {bank.accountNumber}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Student/Class/Family */}
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
                        key={entity.id}
                        onClick={() => handleSelectEntity(entity)}
                        className="w-full px-4 py-3 text-left hover:bg-purple-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-semibold text-gray-900">{entity.name}</div>
                        {invoiceType === 'student' && (
                          <div className="text-sm text-gray-600">
                            {entity.class} • Roll No: {entity.rollNo} • Fee: ₹{entity.feeAmount}
                          </div>
                        )}
                        {invoiceType === 'class' && (
                          <div className="text-sm text-gray-600">
                            {entity.students} Students • Fee: ₹{entity.feeAmount}
                          </div>
                        )}
                        {invoiceType === 'family' && (
                          <div className="text-sm text-gray-600">
                            {entity.students.join(', ')} • Total: ₹{entity.totalFee}
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
                  <span className="text-green-800 font-semibold">Selected: {selectedEntity.name}</span>
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
                  onClick={() => setCopyType('bank')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    copyType === 'bank'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Bank Copy
                </button>
                <button
                  onClick={() => setCopyType('student')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    copyType === 'student'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {invoiceType === 'student' ? 'Student' : invoiceType === 'class' ? 'Class' : 'Family'} Copy
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
                  {copyType === 'bank' ? 'BANK COPY' : copyType === 'student' ? `${getInvoiceTitle().toUpperCase()} COPY` : 'INSTITUTE COPY'}
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
                  <p className="text-lg font-bold text-gray-900">{selectedEntity.name}</p>
                  {invoiceType === 'student' && (
                    <>
                      <p className="text-gray-700">Class: {selectedEntity.class}</p>
                      <p className="text-gray-700">Roll No: {selectedEntity.rollNo}</p>
                    </>
                  )}
                  {invoiceType === 'family' && (
                    <p className="text-gray-700">Students: {selectedEntity.students.join(', ')}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Invoice Date:</p>
                  <p className="text-lg font-bold text-gray-900">{new Date().toLocaleDateString()}</p>
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
                        {invoiceType === 'student' ? 'Tuition Fee' : invoiceType === 'class' ? 'Class Fee' : 'Family Fee'}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-right font-semibold">
                        ₹{invoiceType === 'student' ? selectedEntity.feeAmount : invoiceType === 'class' ? selectedEntity.feeAmount : selectedEntity.totalFee}
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
                        ₹{invoiceType === 'student' ? selectedEntity.feeAmount : invoiceType === 'class' ? selectedEntity.feeAmount : selectedEntity.totalFee}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Bank Details */}
              {selectedBank && (
                <div className="mb-8 p-6 bg-blue-50 border-2 border-blue-200 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Building className="w-5 h-5 text-blue-600" />
                    Bank Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Bank Name:</p>
                      <p className="font-semibold text-gray-900">{selectedBank.bankName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Account Number:</p>
                      <p className="font-semibold text-gray-900">{selectedBank.accountNumber}</p>
                    </div>
                  </div>
                </div>
              )}

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
                  <p className="text-sm text-gray-600 mb-8">Student/Parent Signature</p>
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
