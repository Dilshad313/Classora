import { useState, useEffect } from 'react';
import { 
  Receipt, Download, Printer, Eye, Calendar, CreditCard, 
  CheckCircle, AlertCircle, Search, Filter, FileText,
  DollarSign, Building, User, Hash, Clock
} from 'lucide-react';

const FeeReceipt = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    setLoading(false);
  }, []);

  // Mock fee receipt data
  const feeReceipts = [
    {
      id: 1,
      receiptNumber: 'RCP2024001234',
      paymentDate: '2024-11-15',
      academicYear: '2024-2025',
      term: 'Term 1',
      totalAmount: 25000,
      paidAmount: 25000,
      status: 'paid',
      paymentMethod: 'Online Banking',
      transactionId: 'TXN123456789',
      dueDate: '2024-11-10',
      feeBreakdown: [
        { item: 'Tuition Fee', amount: 15000 },
        { item: 'Library Fee', amount: 2000 },
        { item: 'Laboratory Fee', amount: 3000 },
        { item: 'Sports Fee', amount: 1500 },
        { item: 'Development Fee', amount: 2000 },
        { item: 'Examination Fee', amount: 1500 }
      ]
    },
    {
      id: 2,
      receiptNumber: 'RCP2024001235',
      paymentDate: '2024-10-15',
      academicYear: '2024-2025',
      term: 'Admission Fee',
      totalAmount: 5000,
      paidAmount: 5000,
      status: 'paid',
      paymentMethod: 'Credit Card',
      transactionId: 'TXN123456790',
      dueDate: '2024-10-10',
      feeBreakdown: [
        { item: 'Admission Fee', amount: 3000 },
        { item: 'Registration Fee', amount: 1000 },
        { item: 'Prospectus Fee', amount: 500 },
        { item: 'ID Card Fee', amount: 500 }
      ]
    },
    {
      id: 3,
      receiptNumber: 'RCP2024001236',
      paymentDate: null,
      academicYear: '2024-2025',
      term: 'Term 2',
      totalAmount: 25000,
      paidAmount: 0,
      status: 'pending',
      paymentMethod: null,
      transactionId: null,
      dueDate: '2024-12-10',
      feeBreakdown: [
        { item: 'Tuition Fee', amount: 15000 },
        { item: 'Library Fee', amount: 2000 },
        { item: 'Laboratory Fee', amount: 3000 },
        { item: 'Sports Fee', amount: 1500 },
        { item: 'Development Fee', amount: 2000 },
        { item: 'Examination Fee', amount: 1500 }
      ]
    }
  ];

  const filteredReceipts = feeReceipts.filter(receipt => {
    const matchesSearch = receipt.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         receipt.term.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || receipt.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleDownload = (receipt) => {
    // In a real application, this would generate and download a PDF
    const element = document.createElement('a');
    const file = new Blob(['Fee Receipt Content'], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `fee-receipt-${receipt.receiptNumber}.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = (receipt) => {
    setSelectedReceipt(receipt);
    setTimeout(() => window.print(), 100);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'overdue': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'overdue': return <AlertCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="card">
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
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
            <Receipt className="w-7 h-7 text-green-600" />
            Fee Receipts
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View and download your fee payment receipts
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Paid</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(feeReceipts.filter(r => r.status === 'paid').reduce((sum, r) => sum + r.paidAmount, 0))}
              </p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {formatCurrency(feeReceipts.filter(r => r.status === 'pending').reduce((sum, r) => sum + (r.totalAmount - r.paidAmount), 0))}
              </p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Receipts</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{feeReceipts.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by receipt number or term..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="input-field md:w-48"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Receipts List */}
      <div className="space-y-4">
        {filteredReceipts.length === 0 ? (
          <div className="card text-center py-12">
            <Receipt className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No receipts found
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          filteredReceipts.map((receipt) => (
            <div key={receipt.id} className="card hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        Receipt #{receipt.receiptNumber}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">{receipt.term} - {receipt.academicYear}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(receipt.status)}`}>
                      {getStatusIcon(receipt.status)}
                      {receipt.status.charAt(0).toUpperCase() + receipt.status.slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Total Amount</p>
                      <p className="font-semibold text-gray-800 dark:text-gray-100">{formatCurrency(receipt.totalAmount)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Paid Amount</p>
                      <p className="font-semibold text-green-600 dark:text-green-400">{formatCurrency(receipt.paidAmount)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Due Date</p>
                      <p className="font-semibold text-gray-800 dark:text-gray-100">
                        {new Date(receipt.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Payment Date</p>
                      <p className="font-semibold text-gray-800 dark:text-gray-100">
                        {receipt.paymentDate ? new Date(receipt.paymentDate).toLocaleDateString() : 'Not Paid'}
                      </p>
                    </div>
                  </div>

                  {receipt.paymentMethod && (
                    <div className="mt-3 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <CreditCard className="w-4 h-4" />
                        {receipt.paymentMethod}
                      </span>
                      {receipt.transactionId && (
                        <span className="flex items-center gap-1">
                          <Hash className="w-4 h-4" />
                          {receipt.transactionId}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedReceipt(receipt);
                      setShowPreview(true);
                    }}
                    className="btn-secondary flex items-center gap-2"
                    disabled={receipt.status === 'pending'}
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={() => handlePrint(receipt)}
                    className="btn-secondary flex items-center gap-2"
                    disabled={receipt.status === 'pending'}
                  >
                    <Printer className="w-4 h-4" />
                    Print
                  </button>
                  <button
                    onClick={() => handleDownload(receipt)}
                    className="btn-primary flex items-center gap-2"
                    disabled={receipt.status === 'pending'}
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Receipt Preview Modal */}
      {showPreview && selectedReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Receipt Preview</h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Receipt Content */}
              <div className="bg-white dark:bg-gray-800 p-8 print:shadow-none">
                {/* Receipt Header */}
                <div className="text-center mb-8 border-b-2 border-gray-200 dark:border-gray-700 pb-6">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                      <Building className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Classora High School</h1>
                      <p className="text-gray-600 dark:text-gray-400">Fee Payment Receipt</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    123 Education Street, Academic City, State 12345 | Phone: (555) 123-4567
                  </p>
                </div>

                {/* Receipt Details */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Student Details</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-500 dark:text-gray-400">Name:</span> <span className="font-medium">{user.name || 'Student Name'}</span></p>
                      <p><span className="text-gray-500 dark:text-gray-400">Class:</span> <span className="font-medium">{user.class || '10-A'}</span></p>
                      <p><span className="text-gray-500 dark:text-gray-400">Roll No:</span> <span className="font-medium">{user.rollNumber || '15'}</span></p>
                      <p><span className="text-gray-500 dark:text-gray-400">Student ID:</span> <span className="font-medium">{user.studentId || 'STU001'}</span></p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Receipt Details</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-500 dark:text-gray-400">Receipt No:</span> <span className="font-medium">{selectedReceipt.receiptNumber}</span></p>
                      <p><span className="text-gray-500 dark:text-gray-400">Payment Date:</span> <span className="font-medium">{selectedReceipt.paymentDate ? new Date(selectedReceipt.paymentDate).toLocaleDateString() : 'N/A'}</span></p>
                      <p><span className="text-gray-500 dark:text-gray-400">Academic Year:</span> <span className="font-medium">{selectedReceipt.academicYear}</span></p>
                      <p><span className="text-gray-500 dark:text-gray-400">Term:</span> <span className="font-medium">{selectedReceipt.term}</span></p>
                    </div>
                  </div>
                </div>

                {/* Fee Breakdown */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Fee Breakdown</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 dark:border-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">Fee Item</th>
                          <th className="px-4 py-2 text-right text-sm font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedReceipt.feeBreakdown.map((item, index) => (
                          <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                            <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{item.item}</td>
                            <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 text-right">{formatCurrency(item.amount)}</td>
                          </tr>
                        ))}
                        <tr className="bg-gray-50 dark:bg-gray-700 font-semibold">
                          <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-100">Total Amount</td>
                          <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-100 text-right">{formatCurrency(selectedReceipt.totalAmount)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Payment Information */}
                {selectedReceipt.status === 'paid' && (
                  <div className="mb-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-2">Payment Confirmed</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <p><span className="text-green-600 dark:text-green-400">Payment Method:</span> <span className="font-medium">{selectedReceipt.paymentMethod}</span></p>
                      <p><span className="text-green-600 dark:text-green-400">Transaction ID:</span> <span className="font-medium">{selectedReceipt.transactionId}</span></p>
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <p>This is a computer-generated receipt and does not require a signature.</p>
                  <p className="mt-2">For any queries, please contact the accounts office.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeReceipt;
