import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home,
  ChevronRight,
  FileText,
  Search,
  Calendar,
  User,
  Printer,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Hash,
  GraduationCap,
  UserCircle,
  Loader
} from 'lucide-react';
import * as feesApi from '../../../../services/feesApi';
import * as studentApi from '../../../../services/studentApi';

const FeesPaidSlip = () => {
  const navigate = useNavigate();

  // State management
  const [feesMonth, setFeesMonth] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchClicked, setSearchClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [feeRecords, setFeeRecords] = useState([]);

  // Load students on component mount
  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const response = await studentApi.getStudents();
      const studentsList = Array.isArray(response) ? response : [];
      setStudents(studentsList);
    } catch (error) {
      console.error('Error loading students:', error);
      alert('Failed to load students');
    }
  };

  // Get filtered suggestions
  const getSuggestions = () => {
    const query = searchQuery.toLowerCase();
    if (!query) return [];
    return students.filter(s => 
      s.studentName.toLowerCase().includes(query) || 
      s.registrationNo.toLowerCase().includes(query)
    );
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setShowSuggestions(value.length > 0);
    setSelectedStudent(null);
    setSearchClicked(false);
  };

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setSearchQuery(student.studentName);
    setShowSuggestions(false);
  };

  const handleSearch = async () => {
    if (!selectedStudent || !feesMonth) {
      alert('Please select both Fees Month and Student');
      return;
    }

    try {
      setLoading(true);
      setSearchClicked(true);
      
      const response = await feesApi.getFeesPaidSlip(selectedStudent._id, feesMonth);
      const feesList = Array.isArray(response) ? response : [];
      setFeeRecords(feesList);
      
    } catch (error) {
      console.error('Error fetching fee records:', error);
      alert(error.message || 'Failed to fetch fee records');
      setFeeRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = (recordId) => {
    const printRecord = feeRecords.find(r => r._id === recordId);
    if (printRecord) {
      const printWindow = window.open('', '_blank');
      const student = selectedStudent;
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Fee Paid Slip - ${student.studentName}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .header h1 { margin: 0; font-size: 32px; }
            .header p { margin: 5px 0; color: #666; }
            .badge { background: #10b981; color: white; padding: 8px 20px; border-radius: 20px; display: inline-block; margin-top: 10px; font-weight: bold; }
            .details { margin-bottom: 30px; }
            .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; background: #f9fafb; padding: 20px; border-radius: 10px; border: 1px solid #e5e7eb; }
            .detail-item { }
            .detail-label { font-size: 12px; color: #666; margin-bottom: 3px; }
            .detail-value { font-weight: bold; color: #111; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th, td { padding: 12px; text-align: left; border: 1px solid #333; }
            th { background: #10b981; color: white; font-weight: bold; }
            .total-row { background: #d1fae5; font-weight: bold; font-size: 18px; }
            .payment-info { background: #dbeafe; padding: 20px; border-radius: 10px; border: 1px solid #93c5fd; margin-bottom: 30px; }
            .payment-info h3 { margin-top: 0; }
            .signatures { display: flex; justify-content: space-between; margin-top: 60px; padding-top: 20px; border-top: 2px solid #333; }
            .signature-box { text-align: center; }
            .signature-line { border-top: 2px solid #666; width: 200px; margin-top: 60px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Classora Institute</h1>
            <p>123 Education Street, City, State - 123456</p>
            <p>Phone: +91 1234567890 | Email: info@classora.edu</p>
            <div class="badge">FEE PAID SLIP</div>
          </div>
          
          <div class="details">
            <div class="details-grid">
              <div class="detail-item">
                <div class="detail-label">Receipt No:</div>
                <div class="detail-value">${printRecord.receiptNo}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Date:</div>
                <div class="detail-value">${new Date(printRecord.paymentDate).toLocaleDateString()}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Registration No:</div>
                <div class="detail-value">${student.registrationNo}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Student Name:</div>
                <div class="detail-value">${student.studentName}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Guardian Name:</div>
                <div class="detail-value">${student.guardianName}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Class:</div>
                <div class="detail-value">${student.class}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Fee Month:</div>
                <div class="detail-value">${new Date(printRecord.feeMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Payment Date:</div>
                <div class="detail-value">${new Date(printRecord.paymentDate).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
          
          <h3>Fee Breakdown</h3>
          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Particulars</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${printRecord.particulars.map((item, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.particular}</td>
                  <td style="text-align: right;">₹${item.amount.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr class="total-row">
                <td colspan="2">Total Amount Paid</td>
                <td style="text-align: right; color: #10b981;">₹${printRecord.amount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
          
          <div class="payment-info">
            <h3>Payment Details</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div>
                <div class="detail-label">Payment Method:</div>
                <div class="detail-value">${printRecord.depositType}</div>
              </div>
            </div>
          </div>
          
          <div class="signatures">
            <div class="signature-box">
              <div>Received By</div>
              <div class="signature-line"></div>
            </div>
            <div class="signature-box">
              <div>Authorized Signature</div>
              <div class="signature-line"></div>
            </div>
          </div>
        </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 mb-6 text-sm">
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
          <span className="text-gray-900 font-semibold">Fees Paid Slip</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Fees Paid Slip</h1>
              <p className="text-gray-600 mt-1">View and print student fee payment records</p>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Search className="w-6 h-6 text-blue-600" />
            Search Fee Records
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Fees Month */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Fees Month <span className="text-red-500">*</span>
              </label>
              <input
                type="month"
                value={feesMonth}
                onChange={(e) => setFeesMonth(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Search Student */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Search Student <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400 z-10" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search by name or registration number..."
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                
                {/* Suggestions Dropdown */}
                {showSuggestions && getSuggestions().length > 0 && (
                  <div className="absolute z-20 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {getSuggestions().map(student => (
                      <button
                        key={student._id}
                        onClick={() => handleSelectStudent(student)}
                        className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-semibold text-gray-900">{student.studentName}</div>
                        <div className="text-sm text-gray-600">
                          Reg No: {student.registrationNo} • {student.class}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {selectedStudent && (
                <div className="mt-3 p-3 bg-blue-50 border-2 border-blue-200 rounded-xl flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-800 font-semibold">Selected: {selectedStudent.studentName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Search Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSearch}
              disabled={loading || !selectedStudent || !feesMonth}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              {loading ? 'Searching...' : 'Search Records'}
            </button>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Searching records...</span>
          </div>
        )}

        {/* Results Section */}
        {searchClicked && !loading && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              Fee Records
            </h2>

            {feeRecords.length === 0 ? (
              /* No Records Found */
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                  <AlertCircle className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Fees Record</h3>
                <p className="text-gray-600">
                  No fee payment records found for {selectedStudent?.studentName} in{' '}
                  {new Date(feesMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            ) : (
              /* Display Records */
              <div className="space-y-6">
                {feeRecords.map((record) => (
                  <div key={record._id} className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-all">
                    {/* Record Header */}
                    <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-200">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                        <div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                            <Hash className="w-4 h-4" />
                            Receipt No
                          </div>
                          <div className="font-bold text-gray-900 text-sm">{record.receiptNo}</div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                            <Calendar className="w-4 h-4" />
                            Payment Date
                          </div>
                          <div className="font-bold text-gray-900">
                            {new Date(record.paymentDate).toLocaleDateString()}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                            <DollarSign className="w-4 h-4" />
                            Amount Paid
                          </div>
                          <div className="font-bold text-green-600 text-lg">₹{record.amount.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                            <FileText className="w-4 h-4" />
                            Payment Method
                          </div>
                          <div className="font-bold text-gray-900 capitalize">{record.depositType}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handlePrint(record._id)}
                        className="ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                      >
                        <Printer className="w-4 h-4" />
                        Print
                      </button>
                    </div>

                    {/* Student Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-blue-50 rounded-xl">
                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <Hash className="w-4 h-4" />
                          Registration No
                        </div>
                        <div className="font-bold text-gray-900">{selectedStudent.registrationNo}</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <User className="w-4 h-4" />
                          Student Name
                        </div>
                        <div className="font-bold text-gray-900">{selectedStudent.studentName}</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <UserCircle className="w-4 h-4" />
                          Guardian Name
                        </div>
                        <div className="font-bold text-gray-900">{selectedStudent.guardianName}</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <GraduationCap className="w-4 h-4" />
                          Class
                        </div>
                        <div className="font-bold text-gray-900">{selectedStudent.class}</div>
                      </div>
                    </div>

                    {/* Fee Particulars */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">Fee Breakdown</h3>
                      <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="w-full">
                          <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                            <tr>
                              <th className="px-4 py-3 text-left font-bold">S.No</th>
                              <th className="px-4 py-3 text-left font-bold">Particulars</th>
                              <th className="px-4 py-3 text-right font-bold">Amount</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {record.particulars.map((item, index) => (
                              <tr key={index} className="hover:bg-blue-50 transition-colors">
                                <td className="px-4 py-3 text-gray-700 font-medium">{index + 1}</td>
                                <td className="px-4 py-3 text-gray-900 font-semibold">{item.particular}</td>
                                <td className="px-4 py-3 text-right text-gray-900 font-semibold">₹{item.amount.toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="bg-blue-100 border-t-2 border-blue-300">
                            <tr>
                              <td colSpan="2" className="px-4 py-4 text-left font-bold text-gray-900 text-lg">
                                Total Amount Paid
                              </td>
                              <td className="px-4 py-4 text-right font-bold text-blue-600 text-xl">
                                ₹{record.amount.toFixed(2)}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeesPaidSlip;