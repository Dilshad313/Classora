import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ChevronRight, Trash2, Search, Calendar, DollarSign, User, GraduationCap, CreditCard, AlertTriangle, CheckCircle, Eye, FileText, Loader } from 'lucide-react';
import * as feesApi from '../../../../services/feesApi';

const DeleteFees = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterPaymentMethod, setFilterPaymentMethod] = useState('');
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPaymentDetails, setSelectedPaymentDetails] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ totalRecords: 0, totalAmount: 0 });

  // Load payments on component mount and when filters change
  useEffect(() => {
    loadPayments();
  }, [searchQuery, filterMonth, filterClass, filterPaymentMethod]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const filters = {
        search: searchQuery,
        class: filterClass,
        paymentMethod: filterPaymentMethod,
        month: filterMonth
      };

      const response = await feesApi.getFeePayments(filters);
      const paymentsList = Array.isArray(response) ? response : [];
      setPayments(paymentsList);
      const totalAmount = paymentsList.reduce((sum, p) => sum + (p.amount || 0), 0);
      setStats({
        totalRecords: paymentsList.length,
        totalAmount: totalAmount
      });
    } catch (error) {
      console.error('Error loading payments:', error);
      alert('Failed to load fee payments');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPayment = (id) => {
    setSelectedPayments(prev => 
      prev.includes(id) ? prev.filter(paymentId => paymentId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedPayments.length === payments.length) {
      setSelectedPayments([]);
    } else {
      setSelectedPayments(payments.map(p => p._id));
    }
  };

  const handleDeleteClick = (payment) => {
    setPaymentToDelete(payment);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (paymentToDelete) {
      try {
        await feesApi.deleteFeePayment(paymentToDelete._id);
        setPayments(prev => prev.filter(p => p._id !== paymentToDelete._id));
        setSelectedPayments(prev => prev.filter(id => id !== paymentToDelete._id));
        setShowDeleteModal(false);
        setPaymentToDelete(null);
        alert('Payment record deleted successfully');
        loadPayments(); // Reload to update stats
      } catch (error) {
        console.error('Error deleting payment:', error);
        alert(error.message || 'Failed to delete payment record');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPayments.length === 0) {
      alert('Please select at least one payment to delete');
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete ${selectedPayments.length} payment record(s)? This action cannot be undone.`)) {
      try {
        await feesApi.bulkDeleteFeePayments(selectedPayments);
        setPayments(prev => prev.filter(p => !selectedPayments.includes(p._id)));
        setSelectedPayments([]);
        alert('Payment records deleted successfully');
        loadPayments(); // Reload to update stats
      } catch (error) {
        console.error('Error bulk deleting payments:', error);
        alert(error.message || 'Failed to delete payment records');
      }
    }
  };

  const handleViewDetails = (payment) => {
    setSelectedPaymentDetails(payment);
    setShowDetailsModal(true);
  };

  const uniqueClasses = [...new Set(payments.map(p => p.class))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-6 text-sm">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-colors font-medium">
            <Home className="w-4 h-4" /><span>Dashboard</span>
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-blue-600 font-semibold">Fees</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-semibold">Delete Fees</span>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-rose-600 rounded-xl flex items-center justify-center shadow-lg">
              <Trash2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Delete Fee Records</h1>
              <p className="text-gray-600 mt-1">View and manage completed payment records</p>
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader className="w-8 h-8 animate-spin text-red-600" />
            <span className="ml-2 text-gray-600">Loading payments...</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalRecords}</div>
                <div className="text-sm text-gray-600">Total Records</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">₹{stats.totalAmount.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Amount</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{selectedPayments.length}</div>
                <div className="text-sm text-gray-600">Selected</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Search className="w-4 h-4 inline mr-2" />Search
              </label>
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  placeholder="Search by name, receipt no, registration no..." 
                  className="w-full pl-11 pr-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />Month
              </label>
              <input 
                type="month" 
                value={filterMonth} 
                onChange={(e) => setFilterMonth(e.target.value)} 
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <GraduationCap className="w-4 h-4 inline mr-2" />Class
              </label>
              <select 
                value={filterClass} 
                onChange={(e) => setFilterClass(e.target.value)} 
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">All Classes</option>
                {uniqueClasses.map(cls => <option key={cls} value={cls}>{cls}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <CreditCard className="w-4 h-4 inline mr-2" />Payment
              </label>
              <select 
                value={filterPaymentMethod} 
                onChange={(e) => setFilterPaymentMethod(e.target.value)} 
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">All Methods</option>
                <option value="cash">Cash</option>
                <option value="online">Online</option>
                <option value="cheque">Cheque</option>
                <option value="card">Card</option>
                <option value="upi">UPI</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200">
            <button 
              onClick={() => { setSearchQuery(''); setFilterMonth(''); setFilterClass(''); setFilterPaymentMethod(''); }} 
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all"
            >
              Clear Filters
            </button>
            <div className="flex-1"></div>
            <button 
              onClick={handleBulkDelete} 
              disabled={selectedPayments.length === 0}
              className={`px-5 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                selectedPayments.length > 0 
                  ? 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Trash2 className="w-4 h-4" />Delete Selected ({selectedPayments.length})
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-red-600 to-rose-600 text-white">
                <tr>
                  <th className="px-4 py-4 text-left">
                    <input 
                      type="checkbox" 
                      checked={selectedPayments.length === payments.length && payments.length > 0} 
                      onChange={handleSelectAll} 
                      className="w-4 h-4 rounded border-white" 
                    />
                  </th>
                  <th className="px-4 py-4 text-left font-bold">Receipt No</th>
                  <th className="px-4 py-4 text-left font-bold">Student Name</th>
                  <th className="px-4 py-4 text-left font-bold">Class</th>
                  <th className="px-4 py-4 text-left font-bold">Guardian</th>
                  <th className="px-4 py-4 text-right font-bold">Amount</th>
                  <th className="px-4 py-4 text-left font-bold">Payment Date</th>
                  <th className="px-4 py-4 text-left font-bold">Payment Method</th>
                  <th className="px-4 py-4 text-center font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-red-50 transition-colors">
                    <td className="px-4 py-4">
                      <input 
                        type="checkbox" 
                        checked={selectedPayments.includes(payment._id)} 
                        onChange={() => handleSelectPayment(payment._id)} 
                        className="w-4 h-4 rounded border-gray-300" 
                      />
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-semibold text-gray-900">{payment.receiptNo}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-gray-900">{payment.studentName}</div>
                      <div className="text-sm text-gray-600">{payment.registrationNo}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {payment.class}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-700">{payment.guardianName}</td>
                    <td className="px-4 py-4 text-right">
                      <span className="text-green-600 font-bold text-lg">₹{payment.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4" />
                        {new Date(payment.paymentDate).toLocaleDateString('en-GB')}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700 font-medium capitalize">{payment.depositType}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleViewDetails(payment)} 
                          className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-all" 
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(payment)} 
                          className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-all" 
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {payments.length === 0 && !loading && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-semibold">No payment records found</p>
              <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {showDeleteModal && paymentToDelete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slideUp">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Confirm Delete</h2>
              </div>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this payment record? This action cannot be undone.</p>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Receipt No:</span>
                    <div className="font-semibold text-gray-900">{paymentToDelete.receiptNo}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Amount:</span>
                    <div className="font-semibold text-red-600">₹{paymentToDelete.amount.toLocaleString()}</div>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-600">Student:</span>
                    <div className="font-semibold text-gray-900">{paymentToDelete.studentName}</div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => { setShowDeleteModal(false); setPaymentToDelete(null); }} 
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete} 
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {showDetailsModal && selectedPaymentDetails && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 animate-slideUp max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
                <button 
                  onClick={() => setShowDetailsModal(false)} 
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-all"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Receipt Number</span>
                      <div className="font-bold text-gray-900 text-lg">{selectedPaymentDetails.receiptNo}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Payment Date</span>
                      <div className="font-bold text-gray-900 text-lg">
                        {new Date(selectedPaymentDetails.paymentDate).toLocaleDateString('en-GB')}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />Student Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4">
                    <div>
                      <span className="text-sm text-gray-600">Student Name</span>
                      <div className="font-semibold text-gray-900">{selectedPaymentDetails.studentName}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Registration No</span>
                      <div className="font-semibold text-gray-900">{selectedPaymentDetails.registrationNo}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Class</span>
                      <div className="font-semibold text-gray-900">{selectedPaymentDetails.class}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Guardian Name</span>
                      <div className="font-semibold text-gray-900">{selectedPaymentDetails.guardianName}</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-green-600" />Fee Particulars
                  </h3>
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Particular</th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedPaymentDetails.particulars.map((particular, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 text-gray-900">{particular.particular}</td>
                            <td className="px-4 py-3 text-right font-semibold text-gray-900">
                              ₹{particular.amount.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-green-50 border-t-2 border-green-200">
                        <tr>
                          <td className="px-4 py-3 font-bold text-gray-900">Total Amount</td>
                          <td className="px-4 py-3 text-right font-bold text-green-600 text-lg">
                            ₹{selectedPaymentDetails.amount.toLocaleString()}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-purple-600" />Payment Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 bg-purple-50 rounded-xl p-4">
                    <div>
                      <span className="text-sm text-gray-600">Payment Method</span>
                      <div className="font-semibold text-gray-900 capitalize">{selectedPaymentDetails.depositType}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Fee Month</span>
                      <div className="font-semibold text-gray-900">
                        {new Date(selectedPaymentDetails.feeMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Status</span>
                      <div className="font-semibold text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />Completed
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteFees;