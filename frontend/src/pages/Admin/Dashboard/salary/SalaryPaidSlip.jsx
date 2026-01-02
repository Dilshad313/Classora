import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Home,
  ChevronRight,
  Wallet,
  Printer,
  FileText,
  User,
  Briefcase,
  Hash,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Loader2
} from 'lucide-react';
import { salaryApi } from '../../../../services/salaryApi';
import toast from 'react-hot-toast';

const SalaryPaidSlip = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [salaryDetails, setSalaryDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalarySlip = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if salary details were passed via navigation state (from Pay Salary page)
        if (location.state?.salaryDetails) {
          const salaryData = location.state.salaryDetails;
          
          // Format the data for display
          const formattedData = {
            receiptNo: salaryData.receiptNo,
            employee: {
              employeeId: salaryData.employee?.employeeId,
              name: salaryData.employee?.name || salaryData.employee?.employeeName,
              role: salaryData.employee?.role || salaryData.employee?.employeeRole,
              department: salaryData.employee?.department,
              email: salaryData.employee?.email || salaryData.employee?.emailAddress,
              phone: salaryData.employee?.phone || salaryData.employee?.mobileNo,
              address: salaryData.employee?.address || salaryData.employee?.homeAddress || 'N/A',
              joiningDate: salaryData.employee?.joiningDate ? new Date(salaryData.employee.joiningDate).toLocaleDateString('en-GB') : 'N/A',
              picture: salaryData.employee?.picture?.url || salaryData.employee?.picture
            },
            month: salaryData.month,
            salaryDate: salaryData.salaryDate ? new Date(salaryData.salaryDate).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB'),
            fixedSalary: Number(salaryData.fixedSalary) || 0,
            bonus: Number(salaryData.bonus) || 0,
            deduction: Number(salaryData.deduction) || 0,
           netSalary: Number(salaryData.netSalary) || 0,
            paymentMethod: salaryData.paymentMethod || 'bank_transfer',
            status: salaryData.status || 'paid',
            paidBy: salaryData.paidBy || 'System',
            remarks: salaryData.remarks || '',
            paymentDate: salaryData.paymentDate || new Date().toLocaleDateString('en-GB'),
            paymentTime: salaryData.paymentTime || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            issuedDate: salaryData.issuedDate || new Date().toLocaleDateString('en-GB')
          };
          
          setSalaryDetails(formattedData);
          setLoading(false);
          return;
        }

        // If no state, check if ID is provided
        if (!id) {
          setError('No salary slip ID provided. Please navigate from Salary Sheet or Pay Salary page.');
          setLoading(false);
          return;
        }

        // Fetch from API using ID
        const result = await salaryApi.getSalarySlip(id);
       
        if (result.success && result.data) {
          const salaryData = result.data;
         
          // Format the data for display
          const formattedData = {
            receiptNo: salaryData.receiptNo,
            employee: {
              employeeId: salaryData.employee?.employeeId,
              name: salaryData.employee?.name || salaryData.employee?.employeeName,
              role: salaryData.employee?.role || salaryData.employee?.employeeRole,
              department: salaryData.employee?.department,
              email: salaryData.employee?.email || salaryData.employee?.emailAddress,
              phone: salaryData.employee?.phone || salaryData.employee?.mobileNo,
              address: salaryData.employee?.address || salaryData.employee?.homeAddress || 'N/A',
              joiningDate: salaryData.employee?.joiningDate ? new Date(salaryData.employee.joiningDate).toLocaleDateString('en-GB') : 'N/A',
              picture: salaryData.employee?.picture?.url || salaryData.employee?.picture
            },
            month: salaryData.month,
            salaryDate: salaryData.salaryDate ? new Date(salaryData.salaryDate).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB'),
            fixedSalary: Number(salaryData.fixedSalary) || 0,
            bonus: Number(salaryData.bonus) || 0,
            deduction: Number(salaryData.deduction) || 0,
            netSalary: Number(salaryData.netSalary) || 0,
            paymentMethod: salaryData.paymentMethod || 'bank_transfer',
            status: salaryData.status || 'paid',
            paidBy: salaryData.paidBy || 'System',
            remarks: salaryData.remarks || '',
            paymentDate: salaryData.paymentDate ? new Date(salaryData.paymentDate).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB'),
            paymentTime: salaryData.paymentDate ? new Date(salaryData.paymentDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            issuedDate: salaryData.issuedDate ? new Date(salaryData.issuedDate).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB')
          };
         
 setSalaryDetails(formattedData);
        } else {
          setError(result.message || 'Failed to load salary slip');
        }
      } catch (err) {
        console.error('Error fetching salary slip:', err);
        setError(err.message || 'Failed to fetch salary slip. Please try again.');
        toast.error(err.message || 'Failed to load salary slip');
      } finally {
        setLoading(false);
      }
    };

    fetchSalarySlip();
  }, [id, location.state]);

  const handlePrint = () => {
    window.print();
    toast.success('Print dialog opened');
  };

  const handleNewPayment = () => {
    navigate('/dashboard/salary/pay');
  };

  const handleBackToSheet = () => {
    navigate('/dashboard/salary/salary-sheet');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">Loading salary slip...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6 text-sm">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
            >
              <Home className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <span className="text-blue-600 dark:text-blue-400 font-semibold">Salary</span>
            <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <span className="text-gray-900 dark:text-white font-semibold">Salary Paid Slip</span>
          </div>
         
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Salary Slip</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-400 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
                >
                  Retry
                </button>
                <button
                  onClick={handleBackToSheet}
                  className="px-6 py-3 bg-gray-600 dark:bg-gray-500 hover:bg-gray-700 dark:hover:bg-gray-400 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
                >
                  Go to Salary Sheet
                </button>
                <button
                  onClick={handleNewPayment}
                  className="px-6 py-3 bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-400 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
                >
                  Pay New Salary
</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!salaryDetails) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 mb-6 text-sm no-print">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span className="text-blue-600 dark:text-blue-400 font-semibold">Salary</span>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span className="text-gray-900 dark:text-white font-semibold">Salary Paid Slip</span>
        </div>

        {/* Header */}
        <div className="mb-8 no-print">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-green-600 dark:from-emerald-500 dark:to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Salary Paid Slip</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Employee salary payment receipt</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Receipt No: {salaryDetails.receiptNo}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mb-6 no-print">
          <button
            onClick={handleBackToSheet}
            className="px-6 py-3 bg-gray-600 dark:bg-gray-500 hover:bg-gray-700 dark:hover:bg-gray-400 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <FileText className="w-5 h-5" />
            Back to Salary Sheet
          </button>
          <button
            onClick={handleNewPayment}
            className="px-6 py-3 bg-purple-600 dark:bg-purple-500 hover:bg-purple-700 dark:hover:bg-purple-400 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <Wallet className="w-5 h-5" />
            New Payment
          </button>
          <button
            onClick={handlePrint}
            className="px-6 py-3 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-400 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <Printer className="w-5 h-5" />
            Print
          </button>
        </div>

        {/* Salary Slip */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-gray-300 dark:border-gray-600 p-12 print-section">
          {/* Header */}
          <div className="text-center mb-8 pb-6 border-b-2 border-gray-300 dark:border-gray-600">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Classora Institute</h1>
            <p className="text-gray-600 dark:text-gray-400">123 Education Street, City, State - 123456</p>
            <p className="text-gray-600 dark:text-gray-400">Phone: +91 1234567890 | Email: info@classora.edu</p>
            <div className="mt-4 inline-block px-6 py-2 bg-emerald-600 dark:bg-emerald-500 text-white rounded-full font-bold text-lg">
              SALARY SLIP
            </div>
          </div>

          {/* Receipt Info */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Receipt No:</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{salaryDetails.receiptNo}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Payment Date:</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{salaryDetails.paymentDate}</p>
            </div>
          </div>

          {/* Employee Information */}
          <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Employee Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Employee ID:</p>
                <p className="font-semibold text-gray-900 dark:text-white">{salaryDetails.employee.employeeId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Employee Name:</p>
                <p className="font-semibold text-gray-900 dark:text-white">{salaryDetails.employee.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Role:</p>
                <p className="font-semibold text-gray-900 dark:text-white">{salaryDetails.employee.role}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Department:</p>
                <p className="font-semibold text-gray-900 dark:text-white">{salaryDetails.employee.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Email:</p>
                <p className="font-semibold text-gray-900 dark:text-white">{salaryDetails.employee.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Phone:</p>
                <p className="font-semibold text-gray-900 dark:text-white">{salaryDetails.employee.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Joining Date:</p>
                <p className="font-semibold text-gray-900 dark:text-white">{salaryDetails.employee.joiningDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Address:</p>
                <p className="font-semibold text-gray-900 dark:text-white">{salaryDetails.employee.address}</p>
              </div>
            </div>
          </div>

          {/* Payment Period */}
          <div className="mb-8 p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-500">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Payment Period
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Salary Month:</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {new Date(salaryDetails.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Payment Date:</p>
                <p className="font-semibold text-gray-900 dark:text-white">{salaryDetails.salaryDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Payment Time:</p>
                <p className="font-semibold text-gray-900 dark:text-white">{salaryDetails.paymentTime}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Status:</p>
                <p className="font-semibold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Paid
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Paid By:</p>
                <p className="font-semibold text-gray-900 dark:text-white">{salaryDetails.paidBy}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Payment Method:</p>
                <p className="font-semibold text-gray-900 dark:text-white capitalize">{salaryDetails.paymentMethod?.replace('_', ' ')}</p>
              </div>
            </div>
          </div>

          {/* Salary Breakdown */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Hash className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Salary Breakdown
            </h3>
            <table className="w-full border-2 border-gray-300 dark:border-gray-600">
              <thead>
                <tr className="bg-emerald-600 dark:bg-emerald-500 text-white">
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left">Description</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 font-semibold text-gray-900 dark:text-white">Fixed Salary</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                    ₹{salaryDetails.fixedSalary.toLocaleString()}
                  </td>
                </tr>
                {salaryDetails.bonus > 0 && (
                  <tr className="bg-green-50 dark:bg-green-900/20">
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 font-semibold flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-green-700 dark:text-green-300">Bonus</span>
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-right font-semibold text-green-700 dark:text-green-300">
                      + ₹{salaryDetails.bonus.toLocaleString()}
                    </td>
                  </tr>
                )}
                {salaryDetails.deduction > 0 && (
                  <tr className="bg-red-50 dark:bg-red-900/20">
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 font-semibold flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <span className="text-red-700 dark:text-red-300">Deduction</span>
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-right font-semibold text-red-700 dark:text-red-300">
                      - ₹{salaryDetails.deduction.toLocaleString()}
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-emerald-100 dark:bg-emerald-800 border-t-2 border-emerald-300 dark:border-emerald-500">
                <tr>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-4 font-bold text-lg text-gray-900 dark:text-white">
                    Net Salary Paid
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-4 text-right font-bold text-xl text-emerald-600 dark:text-emerald-400">
                    ₹{salaryDetails.netSalary.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Remarks */}
          {salaryDetails.remarks && (
            <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-500">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Remarks:</p>
              <p className="font-medium text-gray-900 dark:text-white">{salaryDetails.remarks}</p>
            </div>
          )}

          {/* Amount in Words */}
          <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-500">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Amount in Words:</p>
            <p className="font-bold text-gray-900 dark:text-white text-lg">
              Rupees {salaryDetails.netSalary.toLocaleString('en-IN')} Only
            </p>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-end pt-8 border-t-2 border-gray-300 dark:border-gray-600">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">Employee Signature</p>
              <div className="border-t-2 border-gray-400 dark:border-gray-500 w-48"></div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{salaryDetails.employee.name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">Authorized Signature</p>
              <div className="border-t-2 border-gray-400 dark:border-gray-500 w-48"></div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">HR Department</p>
            </div>
          </div>

          {/* Note */}
          <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 dark:border-yellow-400 rounded">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Note:</strong> This is a computer-generated salary slip and does not require a physical signature.
              Please verify all details and contact HR for any discrepancies. Keep this slip for your records.
            </p>
          </div>

          {/* Footer Info */}
          <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400 border-t pt-4">
            <p>Generated on {salaryDetails.issuedDate} at {salaryDetails.paymentTime}</p>
            <p className="mt-1">This is an official document from Classora Institute</p>
          </div>
        </div>
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

export default SalaryPaidSlip;