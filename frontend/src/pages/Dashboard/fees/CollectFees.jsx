import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ChevronRight, DollarSign, Search, User, Users, Calendar, FileText, Printer, CheckCircle, Wallet, Hash, GraduationCap, UserCircle } from 'lucide-react';

const CollectFees = () => {
  const navigate = useNavigate();
  const [collectionType, setCollectionType] = useState('student');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [feesMonth, setFeesMonth] = useState('');
  const [feesDate, setFeesDate] = useState('');
  const [depositType, setDepositType] = useState('');
  const [receiptGenerated, setReceiptGenerated] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  const students = [
    { id: 1, registrationNo: 'REG001', name: 'John Doe', guardianName: 'Robert Doe', class: 'Class 10-A', dueBalance: 5000 },
    { id: 2, registrationNo: 'REG002', name: 'Jane Smith', guardianName: 'Michael Smith', class: 'Class 9-B', dueBalance: 3500 },
    { id: 3, registrationNo: 'REG003', name: 'Mike Johnson', guardianName: 'David Johnson', class: 'Class 10-A', dueBalance: 4500 },
    { id: 4, registrationNo: 'REG004', name: 'Sarah Williams', guardianName: 'James Williams', class: 'Class 8-C', dueBalance: 2000 }
  ];

  const families = [
    { id: 1, name: 'Doe Family', guardianName: 'Robert Doe', students: ['John Doe (Class 10-A)', 'Emily Doe (Class 8-B)'], dueBalance: 10000 },
    { id: 2, name: 'Smith Family', guardianName: 'Michael Smith', students: ['Jane Smith (Class 9-B)'], dueBalance: 3500 },
    { id: 3, name: 'Johnson Family', guardianName: 'David Johnson', students: ['Mike Johnson (Class 10-A)', 'Lisa Johnson (Class 7-C)'], dueBalance: 9000 }
  ];

  const feeParticulars = [
    { id: 1, particular: 'Tuition Fee', amount: 3000 },
    { id: 2, particular: 'Library Fee', amount: 500 },
    { id: 3, particular: 'Sports Fee', amount: 800 },
    { id: 4, particular: 'Lab Fee', amount: 700 },
    { id: 5, particular: 'Transport Fee', amount: 1000 }
  ];

  const depositTypes = [
    { value: 'cash', label: 'Cash' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'online', label: 'Online Transfer' },
    { value: 'card', label: 'Card Payment' },
    { value: 'upi', label: 'UPI' }
  ];

  const totalAmount = feeParticulars.reduce((sum, fee) => sum + fee.amount, 0);

  const getSuggestions = () => {
    const query = searchQuery.toLowerCase();
    if (!query) return [];
    return collectionType === 'student' 
      ? students.filter(s => s.name.toLowerCase().includes(query) || s.registrationNo.toLowerCase().includes(query))
      : families.filter(f => f.name.toLowerCase().includes(query) || f.guardianName.toLowerCase().includes(query));
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setShowSuggestions(value.length > 0);
    setSelectedEntity(null);
  };

  const handleSelectEntity = (entity) => {
    setSelectedEntity(entity);
    setSearchQuery(entity.name);
    setShowSuggestions(false);
  };

  const handleSubmitFees = () => {
    if (!selectedEntity || !feesMonth || !feesDate || !depositType) {
      alert('Please fill all required fields');
      return;
    }
    setReceiptData({
      receiptNo: `REC${Date.now()}`,
      date: new Date().toLocaleDateString(),
      entity: selectedEntity,
      feesMonth,
      feesDate,
      depositType,
      feeParticulars,
      totalAmount,
      collectionType
    });
    setReceiptGenerated(true);
  };

  const handlePrint = () => window.print();

  const handleReset = () => {
    setSearchQuery('');
    setSelectedEntity(null);
    setFeesMonth('');
    setFeesDate('');
    setDepositType('');
    setReceiptGenerated(false);
    setReceiptData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-6 text-sm no-print">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-colors font-medium">
            <Home className="w-4 h-4" /><span>Dashboard</span>
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-blue-600 font-semibold">Fees</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-semibold">Collect Fees</span>
        </div>

        <div className="mb-8 no-print">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Collect Fees</h1>
              <p className="text-gray-600 mt-1">Collect and manage student/family fee payments</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6 no-print">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Select Collection Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['student', 'family'].map(type => (
              <button key={type} onClick={() => { setCollectionType(type); handleReset(); }}
                className={`p-6 rounded-xl border-2 transition-all ${collectionType === type ? 'border-green-600 bg-green-50 shadow-md' : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'}`}>
                {type === 'student' ? <User className={`w-8 h-8 mx-auto mb-3 ${collectionType === type ? 'text-green-600' : 'text-gray-400'}`} /> : <Users className={`w-8 h-8 mx-auto mb-3 ${collectionType === type ? 'text-green-600' : 'text-gray-400'}`} />}
                <h3 className={`font-bold text-lg ${collectionType === type ? 'text-green-600' : 'text-gray-700'}`}>{type === 'student' ? 'Student-wise' : 'Family-wise'}</h3>
                <p className="text-sm text-gray-600 mt-1">Collect fees from {type === 'student' ? 'individual student' : 'family'}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-6 no-print">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Search className="w-6 h-6 text-green-600" />
            Collect Fees of {collectionType === 'student' ? 'Student' : 'Family'}
          </h2>
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400 z-10" />
            <input type="text" value={searchQuery} onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={`Search ${collectionType === 'student' ? 'student by name or registration number' : 'family by name or guardian'}...`}
              className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500" />
            {showSuggestions && getSuggestions().length > 0 && (
              <div className="absolute z-20 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                {getSuggestions().map(entity => (
                  <button key={entity.id} onClick={() => handleSelectEntity(entity)}
                    className="w-full px-4 py-3 text-left hover:bg-green-50 transition-colors border-b border-gray-100 last:border-b-0">
                    <div className="font-semibold text-gray-900">{entity.name}</div>
                    <div className="text-sm text-gray-600">
                      {collectionType === 'student' ? `Reg No: ${entity.registrationNo} • ${entity.class} • Due: ₹${entity.dueBalance}` : `Guardian: ${entity.guardianName} • Students: ${entity.students.length} • Due: ₹${entity.dueBalance}`}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          {selectedEntity && (
            <div className="mt-4 p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-semibold">Selected: {selectedEntity.name}</span>
            </div>
          )}
        </div>

        {selectedEntity && !receiptGenerated && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-6 no-print">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-green-600" />Fees Collection
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
              {collectionType === 'student' ? (
                <>
                  <div><div className="flex items-center gap-2 text-sm text-gray-600 mb-1"><Hash className="w-4 h-4" />Registration Number</div><div className="font-bold text-gray-900">{selectedEntity.registrationNo}</div></div>
                  <div><div className="flex items-center gap-2 text-sm text-gray-600 mb-1"><User className="w-4 h-4" />Student Name</div><div className="font-bold text-gray-900">{selectedEntity.name}</div></div>
                  <div><div className="flex items-center gap-2 text-sm text-gray-600 mb-1"><UserCircle className="w-4 h-4" />Guardian Name</div><div className="font-bold text-gray-900">{selectedEntity.guardianName}</div></div>
                  <div><div className="flex items-center gap-2 text-sm text-gray-600 mb-1"><GraduationCap className="w-4 h-4" />Class</div><div className="font-bold text-gray-900">{selectedEntity.class}</div></div>
                </>
              ) : (
                <>
                  <div><div className="flex items-center gap-2 text-sm text-gray-600 mb-1"><Users className="w-4 h-4" />Family Name</div><div className="font-bold text-gray-900">{selectedEntity.name}</div></div>
                  <div><div className="flex items-center gap-2 text-sm text-gray-600 mb-1"><UserCircle className="w-4 h-4" />Guardian Name</div><div className="font-bold text-gray-900">{selectedEntity.guardianName}</div></div>
                  <div className="md:col-span-2"><div className="flex items-center gap-2 text-sm text-gray-600 mb-1"><User className="w-4 h-4" />Students</div><div className="font-bold text-gray-900">{selectedEntity.students.join(', ')}</div></div>
                </>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div><label className="block text-sm font-semibold text-gray-700 mb-2"><Calendar className="w-4 h-4 inline mr-2" />Fees Month <span className="text-red-500">*</span></label>
                <input type="month" value={feesMonth} onChange={(e) => setFeesMonth(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500" /></div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-2"><Calendar className="w-4 h-4 inline mr-2" />Date <span className="text-red-500">*</span></label>
                <input type="date" value={feesDate} onChange={(e) => setFeesDate(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500" /></div>
            </div>
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Fee Particulars</h3>
              <div className="overflow-x-auto rounded-xl border-2 border-gray-200">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                    <tr><th className="px-4 py-3 text-left font-bold">S.No</th><th className="px-4 py-3 text-left font-bold">Particulars</th><th className="px-4 py-3 text-right font-bold">Amount</th></tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {feeParticulars.map((fee, index) => (
                      <tr key={fee.id} className="hover:bg-green-50 transition-colors">
                        <td className="px-4 py-3 text-gray-700 font-medium">{index + 1}</td>
                        <td className="px-4 py-3 text-gray-900 font-semibold">{fee.particular}</td>
                        <td className="px-4 py-3 text-right text-gray-900 font-semibold">₹{fee.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-green-100 border-t-2 border-green-300">
                    <tr><td colSpan="2" className="px-4 py-4 text-left font-bold text-gray-900 text-lg">Total Amount</td>
                      <td className="px-4 py-4 text-right font-bold text-green-600 text-xl">₹{totalAmount.toFixed(2)}</td></tr>
                  </tfoot>
                </table>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div><label className="block text-sm font-semibold text-gray-700 mb-2"><Wallet className="w-4 h-4 inline mr-2" />Deposit Type <span className="text-red-500">*</span></label>
                <select value={depositType} onChange={(e) => setDepositType(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500">
                  <option value="">Select deposit type</option>
                  {depositTypes.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
                </select></div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-2"><DollarSign className="w-4 h-4 inline mr-2" />Due Balance</label>
                <div className="px-4 py-3 bg-red-50 border-2 border-red-200 rounded-xl"><span className="text-2xl font-bold text-red-600">₹{selectedEntity.dueBalance.toFixed(2)}</span></div></div>
            </div>
            <div className="flex justify-end">
              <button onClick={handleSubmitFees} className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />Submit Fees
              </button>
            </div>
          </div>
        )}

        {receiptGenerated && receiptData && (
          <>
            <div className="flex justify-end gap-4 mb-6 no-print">
              <button onClick={handleReset} className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                <FileText className="w-5 h-5" />New Collection
              </button>
              <button onClick={handlePrint} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                <Printer className="w-5 h-5" />Print Receipt
              </button>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-300 p-12 print-section">
              <div className="text-center mb-8 pb-6 border-b-2 border-gray-300">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Classora Institute</h1>
                <p className="text-gray-600">123 Education Street, City, State - 123456</p>
                <p className="text-gray-600">Phone: +91 1234567890 | Email: info@classora.edu</p>
                <div className="mt-4 inline-block px-6 py-2 bg-green-600 text-white rounded-full font-bold text-lg">FEE RECEIPT</div>
              </div>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div><p className="text-sm text-gray-600">Receipt No:</p><p className="text-lg font-bold text-gray-900">{receiptData.receiptNo}</p></div>
                <div className="text-right"><p className="text-sm text-gray-600">Date:</p><p className="text-lg font-bold text-gray-900">{receiptData.date}</p></div>
              </div>
              <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">{collectionType === 'student' ? 'Student' : 'Family'} Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  {collectionType === 'student' ? (
                    <>
                      <div><p className="text-sm text-gray-600">Registration No:</p><p className="font-semibold text-gray-900">{receiptData.entity.registrationNo}</p></div>
                      <div><p className="text-sm text-gray-600">Student Name:</p><p className="font-semibold text-gray-900">{receiptData.entity.name}</p></div>
                      <div><p className="text-sm text-gray-600">Guardian Name:</p><p className="font-semibold text-gray-900">{receiptData.entity.guardianName}</p></div>
                      <div><p className="text-sm text-gray-600">Class:</p><p className="font-semibold text-gray-900">{receiptData.entity.class}</p></div>
                    </>
                  ) : (
                    <>
                      <div><p className="text-sm text-gray-600">Family Name:</p><p className="font-semibold text-gray-900">{receiptData.entity.name}</p></div>
                      <div><p className="text-sm text-gray-600">Guardian Name:</p><p className="font-semibold text-gray-900">{receiptData.entity.guardianName}</p></div>
                      <div className="col-span-2"><p className="text-sm text-gray-600">Students:</p><p className="font-semibold text-gray-900">{receiptData.entity.students.join(', ')}</p></div>
                    </>
                  )}
                  <div><p className="text-sm text-gray-600">Fee Month:</p><p className="font-semibold text-gray-900">{new Date(receiptData.feesMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p></div>
                  <div><p className="text-sm text-gray-600">Payment Date:</p><p className="font-semibold text-gray-900">{new Date(receiptData.feesDate).toLocaleDateString()}</p></div>
                </div>
              </div>
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Fee Breakdown</h3>
                <table className="w-full border-2 border-gray-300">
                  <thead><tr className="bg-green-600 text-white"><th className="border border-gray-300 px-4 py-3 text-left">S.No</th><th className="border border-gray-300 px-4 py-3 text-left">Particulars</th><th className="border border-gray-300 px-4 py-3 text-right">Amount</th></tr></thead>
                  <tbody>
                    {receiptData.feeParticulars.map((fee, index) => (
                      <tr key={fee.id}><td className="border border-gray-300 px-4 py-3">{index + 1}</td><td className="border border-gray-300 px-4 py-3 font-semibold">{fee.particular}</td><td className="border border-gray-300 px-4 py-3 text-right font-semibold">₹{fee.amount.toFixed(2)}</td></tr>
                    ))}
                  </tbody>
                  <tfoot><tr className="bg-green-100"><td colSpan="2" className="border border-gray-300 px-4 py-4 font-bold text-lg">Total Amount Paid</td><td className="border border-gray-300 px-4 py-4 text-right font-bold text-xl text-green-600">₹{receiptData.totalAmount.toFixed(2)}</td></tr></tfoot>
                </table>
              </div>
              <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Payment Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-sm text-gray-600">Payment Method:</p><p className="font-semibold text-gray-900 capitalize">{depositTypes.find(t => t.value === receiptData.depositType)?.label}</p></div>
                  <div><p className="text-sm text-gray-600">Remaining Balance:</p><p className="font-semibold text-red-600 text-lg">₹{(receiptData.entity.dueBalance - receiptData.totalAmount).toFixed(2)}</p></div>
                </div>
              </div>
              <div className="flex justify-between items-end pt-8 border-t-2 border-gray-300">
                <div><p className="text-sm text-gray-600 mb-8">Received By</p><div className="border-t-2 border-gray-400 w-48"></div></div>
                <div className="text-right"><p className="text-sm text-gray-600 mb-8">Authorized Signature</p><div className="border-t-2 border-gray-400 w-48"></div></div>
              </div>
            </div>
          </>
        )}
      </div>
      <style jsx>{`@media print { .no-print { display: none !important; } .print-section { box-shadow: none !important; border: none !important; border-radius: 0 !important; padding: 20px !important; } body { background: white !important; } }`}</style>
    </div>
  );
};

export default CollectFees;
