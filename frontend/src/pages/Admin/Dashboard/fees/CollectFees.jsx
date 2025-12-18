import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ChevronRight, DollarSign, Search, User, Users, Calendar, FileText, Printer, CheckCircle, Wallet, Hash, GraduationCap, UserCircle, Loader } from 'lucide-react';
import * as feesApi from '../../../../services/feesApi';
import * as studentApi from '../../../../services/studentApi';

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
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [feeStructures, setFeeStructures] = useState({});
  const [feeParticulars, setFeeParticulars] = useState([]);

  const depositTypes = [
    { value: 'cash', label: 'Cash' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'online', label: 'Online Transfer' },
    { value: 'card', label: 'Card Payment' },
    { value: 'upi', label: 'UPI' }
  ];

  // Load students and fee structures on component mount
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      // Load students
      const studentsResponse = await studentApi.getStudents();
      setStudents(Array.isArray(studentsResponse) ? studentsResponse : []);

      // Load fee structures for all classes
      const feeStructuresResponse = await feesApi.getFeeStructures();
      const structuresMap = {};
      const structures = Array.isArray(feeStructuresResponse) ? feeStructuresResponse : [];
      structures.forEach(structure => {
        structuresMap[structure.className] = structure;
      });
      setFeeStructures(structuresMap);
    } catch (error) {
      console.error('Error loading initial data:', error);
      alert('Failed to load initial data');
    } finally {
      setLoading(false);
    }
  };

  // Update fee particulars when student is selected
  useEffect(() => {
    if (selectedEntity && collectionType === 'student') {
      const structure = feeStructures[selectedEntity.class];
      if (structure) {
        // Convert fee structure fields to particulars format
        const particulars = [];
        if (structure.tuitionFee) particulars.push({ particular: 'Tuition Fee', amount: structure.tuitionFee });
        if (structure.admissionFee) particulars.push({ particular: 'Admission Fee', amount: structure.admissionFee });
        if (structure.examFee) particulars.push({ particular: 'Examination Fee', amount: structure.examFee });
        if (structure.labFee) particulars.push({ particular: 'Laboratory Fee', amount: structure.labFee });
        if (structure.libraryFee) particulars.push({ particular: 'Library Fee', amount: structure.libraryFee });
        if (structure.sportsFee) particulars.push({ particular: 'Sports Fee', amount: structure.sportsFee });
        setFeeParticulars(particulars.length > 0 ? particulars : [
          { particular: 'Tuition Fee', amount: 0 }
        ]);
      } else {
        // Default fee particulars if no structure found
        setFeeParticulars([
          { particular: 'Tuition Fee', amount: 0 },
          { particular: 'Library Fee', amount: 0 },
          { particular: 'Sports Fee', amount: 0 }
        ]);
      }
    }
  }, [selectedEntity, collectionType, feeStructures]);

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
    setSelectedEntity(null);
  };

  const handleSelectEntity = (student) => {
    setSelectedEntity(student);
    setSearchQuery(student.studentName);
    setShowSuggestions(false);
  };

  const handleSubmitFees = async () => {
    if (!selectedEntity || !feesMonth || !feesDate || !depositType) {
      alert('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      
      const totalAmount = feeParticulars.reduce((sum, fee) => sum + fee.amount, 0);
      
      const feeData = {
        studentId: selectedEntity._id,
        studentName: selectedEntity.studentName,
        registrationNo: selectedEntity.registrationNo,
        class: selectedEntity.class,
        guardianName: selectedEntity.guardianName,
        amount: totalAmount,
        paymentDate: feesDate,
        feeMonth: feesMonth,
        depositType: depositType,
        particulars: feeParticulars
      };

      const response = await feesApi.collectFees(feeData);
      
      // Generate receipt data
      setReceiptData({
        receiptNo: response._id || response.receiptNo || 'RCP-' + Date.now(),
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
      alert('Fees collected successfully!');
      
    } catch (error) {
      console.error('Error collecting fees:', error);
      alert(error.message || 'Failed to collect fees');
    } finally {
      setLoading(false);
    }
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

  const totalAmount = feeParticulars.reduce((sum, fee) => sum + fee.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-6 text-sm no-print">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
            <Home className="w-4 h-4" /><span>Dashboard</span>
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span className="text-blue-600 dark:text-blue-400 font-semibold">Fees</span>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span className="text-gray-900 dark:text-gray-100 font-semibold">Collect Fees</span>
        </div>

        <div className="mb-8 no-print">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Collect Fees</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Collect and manage student fee payments</p>
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader className="w-8 h-8 animate-spin text-green-600 dark:text-green-400" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Processing...</span>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6 no-print transition-colors duration-300">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Select Collection Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['student', 'family'].map(type => (
              <button 
                key={type} 
                onClick={() => { setCollectionType(type); handleReset(); }}
                disabled={type === 'family'}
                className={`p-6 rounded-xl border-2 transition-all ${
                  collectionType === type 
                    ? 'border-green-600 dark:border-green-500 bg-green-50 dark:bg-green-900/30 shadow-md' 
                    : 'border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                } ${type === 'family' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {type === 'student' ? 
                  <User className={`w-8 h-8 mx-auto mb-3 ${collectionType === type ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`} /> : 
                  <Users className={`w-8 h-8 mx-auto mb-3 ${collectionType === type ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`} />
                }
                <h3 className={`font-bold text-lg ${collectionType === type ? 'text-green-600 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}>
                  {type === 'student' ? 'Student-wise' : 'Family-wise'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {type === 'student' ? 'Collect fees from individual student' : 'Family-wise collection (Coming Soon)'}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-6 no-print transition-colors duration-300">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Search className="w-6 h-6 text-green-600 dark:text-green-400" />
            Collect Fees of Student
          </h2>
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400 dark:text-gray-500 z-10" />
            <input 
              type="text" 
              value={searchQuery} 
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search student by name or registration number..."
              className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors" 
            />
            {showSuggestions && getSuggestions().length > 0 && (
              <div className="absolute z-20 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                {getSuggestions().map(student => (
                  <button 
                    key={student._id} 
                    onClick={() => handleSelectEntity(student)}
                    className="w-full px-4 py-3 text-left hover:bg-green-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                  >
                    <div className="font-semibold text-gray-900 dark:text-white">{student.studentName}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Reg No: {student.registrationNo} • {student.class} • Due: ₹{student.dueBalance || 0}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          {selectedEntity && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/30 border-2 border-green-200 dark:border-green-700 rounded-xl flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-green-800 dark:text-green-300 font-semibold">Selected: {selectedEntity.studentName}</span>
            </div>
          )}
        </div>

        {selectedEntity && !receiptGenerated && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-6 no-print transition-colors duration-300">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />Fees Collection
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-green-200 dark:border-gray-700">
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <Hash className="w-4 h-4" />Registration Number
                </div>
                <div className="font-bold text-gray-900 dark:text-white">{selectedEntity.registrationNo}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <User className="w-4 h-4" />Student Name
                </div>
                <div className="font-bold text-gray-900 dark:text-white">{selectedEntity.studentName}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <UserCircle className="w-4 h-4" />Guardian Name
                </div>
                <div className="font-bold text-gray-900 dark:text-white">{selectedEntity.guardianName}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <GraduationCap className="w-4 h-4" />Class
                </div>
                <div className="font-bold text-gray-900 dark:text-white">{selectedEntity.class}</div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />Fees Month <span className="text-red-500">*</span>
                </label>
                <input 
                  type="month" 
                  value={feesMonth} 
                  onChange={(e) => setFeesMonth(e.target.value)} 
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />Date <span className="text-red-500">*</span>
                </label>
                <input 
                  type="date" 
                  value={feesDate} 
                  onChange={(e) => setFeesDate(e.target.value)} 
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors" 
                />
              </div>
            </div>
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Fee Particulars</h3>
              <div className="overflow-x-auto rounded-xl border-2 border-gray-200 dark:border-gray-700">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left font-bold">S.No</th>
                      <th className="px-4 py-3 text-left font-bold">Particulars</th>
                      <th className="px-4 py-3 text-right font-bold">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {feeParticulars.map((fee, index) => (
                      <tr key={index} className="hover:bg-green-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300 font-medium">{index + 1}</td>
                        <td className="px-4 py-3 text-gray-900 dark:text-white font-semibold">{fee.particular}</td>
                        <td className="px-4 py-3 text-right text-gray-900 dark:text-white font-semibold">₹{fee.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-green-100 dark:bg-gray-900 border-t-2 border-green-300 dark:border-gray-700">
                    <tr>
                      <td colSpan="2" className="px-4 py-4 text-left font-bold text-gray-900 dark:text-white text-lg">Total Amount</td>
                      <td className="px-4 py-4 text-right font-bold text-green-600 dark:text-green-400 text-xl">₹{totalAmount.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <Wallet className="w-4 h-4 inline mr-2" />Deposit Type <span className="text-red-500">*</span>
                </label>
                <select 
                  value={depositType} 
                  onChange={(e) => setDepositType(e.target.value)} 
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                >
                  <option value="">Select deposit type</option>
                  {depositTypes.map(type => (
                    <option key={type.value} value={type.value} className="dark:bg-gray-800">{type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-2" />Due Balance
                </label>
                <div className="px-4 py-3 bg-red-50 dark:bg-gray-900 border-2 border-red-200 dark:border-gray-700 rounded-xl">
                  <span className="text-2xl font-bold text-red-600 dark:text-red-400">₹{selectedEntity.dueBalance?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button 
                onClick={handleSubmitFees}
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                {loading ? 'Processing...' : 'Submit Fees'}
              </button>
            </div>
          </div>
        )}

        {receiptGenerated && receiptData && (
          <>
            <div className="flex justify-end gap-4 mb-6 no-print">
              <button 
                onClick={handleReset} 
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <FileText className="w-5 h-5" />New Collection
              </button>
              <button 
                onClick={handlePrint} 
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <Printer className="w-5 h-5" />Print Receipt
              </button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-gray-300 dark:border-gray-700 p-12 print-section transition-colors duration-300">
              <div className="text-center mb-8 pb-6 border-b-2 border-gray-300 dark:border-gray-700">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Classora Institute</h1>
                <p className="text-gray-600 dark:text-gray-400">123 Education Street, City, State - 123456</p>
                <p className="text-gray-600 dark:text-gray-400">Phone: +91 1234567890 | Email: info@classora.edu</p>
                <div className="mt-4 inline-block px-6 py-2 bg-green-600 text-white rounded-full font-bold text-lg">FEE RECEIPT</div>
              </div>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Receipt No:</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{receiptData.receiptNo}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Date:</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{receiptData.date}</p>
                </div>
              </div>
              <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Student Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Registration No:</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{receiptData.entity.registrationNo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Student Name:</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{receiptData.entity.studentName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Guardian Name:</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{receiptData.entity.guardianName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Class:</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{receiptData.entity.class}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Fee Month:</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {new Date(receiptData.feesMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Payment Date:</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {new Date(receiptData.feesDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Fee Breakdown</h3>
                <table className="w-full border-2 border-gray-300 dark:border-gray-700">
                  <thead>
                    <tr className="bg-green-600 text-white">
                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-left">S.No</th>
                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-left">Particulars</th>
                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {receiptData.feeParticulars.map((fee, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-3 dark:text-white">{index + 1}</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-3 font-semibold dark:text-white">{fee.particular}</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-right font-semibold dark:text-white">₹{fee.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-green-100 dark:bg-gray-900">
                      <td colSpan="2" className="border border-gray-300 dark:border-gray-700 px-4 py-4 font-bold text-lg dark:text-white">Total Amount Paid</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-4 text-right font-bold text-xl text-green-600 dark:text-green-400">
                        ₹{receiptData.totalAmount.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <div className="mb-8 p-6 bg-blue-50 dark:bg-gray-900 rounded-xl border border-blue-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Payment Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Payment Method:</p>
                    <p className="font-semibold text-gray-900 dark:text-white capitalize">
                      {depositTypes.find(t => t.value === receiptData.depositType)?.label}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Remaining Balance:</p>
                    <p className="font-semibold text-red-600 dark:text-red-400 text-lg">
                      ₹{((receiptData.entity.dueBalance || 0) - receiptData.totalAmount).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-end pt-8 border-t-2 border-gray-300 dark:border-gray-700">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">Received By</p>
                  <div className="border-t-2 border-gray-400 w-48"></div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">Authorized Signature</p>
                  <div className="border-t-2 border-gray-400 w-48"></div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <style jsx>{`
        @media print { 
          .no-print { display: none !important; } 
          .print-section { box-shadow: none !important; border: none !important; border-radius: 0 !important; padding: 20px !important; } 
          body { background: white !important; } 
        }
      `}</style>
    </div>
  );
};

export default CollectFees;