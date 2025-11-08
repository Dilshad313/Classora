import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  TrendingDown
} from 'lucide-react';

const SalaryPaidSlip = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [salaryDetails, setSalaryDetails] = useState(null);

  useEffect(() => {
    // Get salary details from navigation state
    if (location.state && location.state.salaryDetails) {
      setSalaryDetails(location.state.salaryDetails);
    } else {
      // If no data, redirect back to pay salary page
      navigate('/dashboard/salary/pay');
    }
  }, [location, navigate]);

  const handlePrint = () => {
    window.print();
  };

  const handleNewPayment = () => {
    navigate('/dashboard/salary/pay');
  };

  if (!salaryDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading salary slip...</p>
        </div>
      </div>
    );
  }

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
          <span className="text-blue-600 font-semibold">Salary</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-semibold">Salary Paid Slip</span>
        </div>

        {/* Header */}
        <div className="mb-8 no-print">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Salary Paid Slip</h1>
                <p className="text-gray-600 mt-1">Employee salary payment receipt</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mb-6 no-print">
          <button
            onClick={handleNewPayment}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <FileText className="w-5 h-5" />
            New Payment
          </button>
          <button
            onClick={handlePrint}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <Printer className="w-5 h-5" />
            Print Salary Slip
          </button>
        </div>

        {/* Salary Slip */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-300 p-12 print-section">
          {/* Header */}
          <div className="text-center mb-8 pb-6 border-b-2 border-gray-300">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Classora Institute</h1>
            <p className="text-gray-600">123 Education Street, City, State - 123456</p>
            <p className="text-gray-600">Phone: +91 1234567890 | Email: info@classora.edu</p>
            <div className="mt-4 inline-block px-6 py-2 bg-emerald-600 text-white rounded-full font-bold text-lg">
              SALARY SLIP
            </div>
          </div>

          {/* Receipt Info */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-sm text-gray-600">Receipt No:</p>
              <p className="text-lg font-bold text-gray-900">{salaryDetails.receiptNo}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Payment Date:</p>
              <p className="text-lg font-bold text-gray-900">{salaryDetails.paymentDate}</p>
            </div>
          </div>

          {/* Employee Information */}
          <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-600" />
              Employee Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Employee ID:</p>
                <p className="font-semibold text-gray-900">{salaryDetails.employee.employeeId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Employee Name:</p>
                <p className="font-semibold text-gray-900">{salaryDetails.employee.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Role:</p>
                <p className="font-semibold text-gray-900">{salaryDetails.employee.role}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Department:</p>
                <p className="font-semibold text-gray-900">{salaryDetails.employee.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email:</p>
                <p className="font-semibold text-gray-900">{salaryDetails.employee.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone:</p>
                <p className="font-semibold text-gray-900">{salaryDetails.employee.phone}</p>
              </div>
            </div>
          </div>

          {/* Payment Period */}
          <div className="mb-8 p-6 bg-emerald-50 rounded-xl border border-emerald-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-600" />
              Payment Period
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Salary Month:</p>
                <p className="font-semibold text-gray-900">
                  {new Date(salaryDetails.salaryMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Date:</p>
                <p className="font-semibold text-gray-900">
                  {new Date(salaryDetails.salaryDate).toLocaleDateString('en-GB')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Time:</p>
                <p className="font-semibold text-gray-900">{salaryDetails.paymentTime}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status:</p>
                <p className="font-semibold text-green-600 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Paid
                </p>
              </div>
            </div>
          </div>

          {/* Salary Breakdown */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Hash className="w-5 h-5 text-emerald-600" />
              Salary Breakdown
            </h3>
            <table className="w-full border-2 border-gray-300">
              <thead>
                <tr className="bg-emerald-600 text-white">
                  <th className="border border-gray-300 px-4 py-3 text-left">Description</th>
                  <th className="border border-gray-300 px-4 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-3 font-semibold">Fixed Salary</td>
                  <td className="border border-gray-300 px-4 py-3 text-right font-semibold">
                    ₹{salaryDetails.fixedSalary.toLocaleString()}
                  </td>
                </tr>
                {salaryDetails.bonus > 0 && (
                  <tr className="bg-green-50">
                    <td className="border border-gray-300 px-4 py-3 font-semibold flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-green-700">Bonus</span>
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-right font-semibold text-green-700">
                      + ₹{salaryDetails.bonus.toLocaleString()}
                    </td>
                  </tr>
                )}
                {salaryDetails.deduction > 0 && (
                  <tr className="bg-red-50">
                    <td className="border border-gray-300 px-4 py-3 font-semibold flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-red-600" />
                      <span className="text-red-700">Deduction</span>
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-right font-semibold text-red-700">
                      - ₹{salaryDetails.deduction.toLocaleString()}
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-emerald-100 border-t-2 border-emerald-300">
                <tr>
                  <td className="border border-gray-300 px-4 py-4 font-bold text-lg">
                    Net Salary Paid
                  </td>
                  <td className="border border-gray-300 px-4 py-4 text-right font-bold text-xl text-emerald-600">
                    ₹{salaryDetails.totalSalary.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Amount in Words */}
          <div className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm text-gray-600 mb-1">Amount in Words:</p>
            <p className="font-bold text-gray-900 text-lg">
              Rupees {salaryDetails.totalSalary.toLocaleString()} Only
            </p>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-end pt-8 border-t-2 border-gray-300">
            <div>
              <p className="text-sm text-gray-600 mb-8">Employee Signature</p>
              <div className="border-t-2 border-gray-400 w-48"></div>
              <p className="text-xs text-gray-500 mt-2">{salaryDetails.employee.name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-8">Authorized Signature</p>
              <div className="border-t-2 border-gray-400 w-48"></div>
              <p className="text-xs text-gray-500 mt-2">HR Department</p>
            </div>
          </div>

          {/* Note */}
          <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
            <p className="text-sm text-gray-700">
              <strong>Note:</strong> This is a computer-generated salary slip and does not require a physical signature. 
              Please verify all details and contact HR for any discrepancies. Keep this slip for your records.
            </p>
          </div>

          {/* Footer Info */}
          <div className="mt-6 text-center text-xs text-gray-500 border-t pt-4">
            <p>Generated on {salaryDetails.paymentDate} at {salaryDetails.paymentTime}</p>
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
