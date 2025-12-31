import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ChevronRight, DollarSign, Search, User, Users, Calendar, FileText, Printer, CheckCircle, Wallet, Hash, GraduationCap, UserCircle, Loader, AlertCircle, CreditCard, Smartphone, Building } from 'lucide-react';
import * as feesApi from '../../../../services/feesApi';
import * as studentApi from '../../../../services/studentApi';
import * as classApi from '../../../../services/classApi';
import { getFeesParticulars } from '../../../../services/instituteApi';
import toast from 'react-hot-toast';

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
  const [classes, setClasses] = useState([]);
  const [feeStructures, setFeeStructures] = useState({});
  const [feesParticulars, setFeesParticulars] = useState(null);
  const [feeParticularsList, setFeeParticularsList] = useState([]);
  const [collectedBy, setCollectedBy] = useState('Admin');
  const [paymentStatus, setPaymentStatus] = useState('completed');
  const [remarks, setRemarks] = useState('');

  const depositTypes = [
    { value: 'cash', label: 'Cash' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'online', label: 'Online Transfer' },
    { value: 'card', label: 'Card Payment' },
    { value: 'upi', label: 'UPI' }
  ];

  // Load students and fee structures on component mount
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to access this page');
      navigate('/login');
      return;
    }
    
    // Restore form data if available
    const savedFormData = sessionStorage.getItem('feeFormData');
    if (savedFormData) {
      try {
        const formData = JSON.parse(savedFormData);
        // Restore form fields
        if (formData.feesMonth) setFeesMonth(formData.feesMonth);
        if (formData.feesDate) setFeesDate(formData.feesDate);
        if (formData.depositType) setDepositType(formData.depositType);
        if (formData.collectedBy) setCollectedBy(formData.collectedBy);
        if (formData.paymentStatus) setPaymentStatus(formData.paymentStatus);
        if (formData.remarks) setRemarks(formData.remarks);
        
        // Note: selectedEntity needs to be restored from students list
        // This will be handled after students are loaded
        
        toast.success('Form data restored from previous session');
        // Clear the saved data after restoring
        sessionStorage.removeItem('feeFormData');
      } catch (error) {
        console.error('Error restoring form data:', error);
      }
    }
    
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load students
      const studentsResponse = await studentApi.getStudents();
      const studentsList = Array.isArray(studentsResponse) ? studentsResponse : [];
      setStudents(studentsList);

      // Restore selected entity if available from saved data
      const savedFormData = sessionStorage.getItem('feeFormData');
      if (savedFormData) {
        try {
          const formData = JSON.parse(savedFormData);
          if (formData.selectedEntity) {
            // Find the student in the loaded students list
            const restoredStudent = studentsList.find(s => s._id === formData.selectedEntity._id);
            if (restoredStudent) {
              setSelectedEntity(restoredStudent);
              setSearchQuery(restoredStudent.studentName);
            }
          }
        } catch (error) {
          console.error('Error restoring selected entity:', error);
        }
      }

      // Load actual classes from the system
      try {
        const classesResponse = await classApi.getAllClasses();
        const classesList = Array.isArray(classesResponse.data) ? classesResponse.data : [];
        const classesArray = classesList.map(cls => ({ 
          id: cls._id || cls.id, 
          name: cls.className || cls.name || cls.class 
        }));
        setClasses(classesArray);
      } catch (error) {
        console.log('Failed to load classes, using student classes as fallback');
        const uniqueClasses = [...new Set(studentsList.map(s => s.selectClass || s.class).filter(Boolean))];
        const classesArray = uniqueClasses.map(cls => ({ id: cls, name: cls }));
        setClasses(classesArray);
      }

      // Load fee particulars from Settings
      const feesData = await getFeesParticulars();
      setFeesParticulars(feesData);
      console.log('📊 Loaded fees particulars:', feesData);

      // Load fee structures (if any)
      try {
        const feeStructuresResponse = await feesApi.getFeeStructures();
        const structuresMap = {};
        const structures = Array.isArray(feeStructuresResponse) ? feeStructuresResponse : [];
        structures.forEach(structure => {
          structuresMap[structure.className || structure.class] = structure;
        });
        setFeeStructures(structuresMap);
      } catch (error) {
        console.log('No fee structures found, using fees particulars instead');
      }

    } catch (error) {
      console.error('Error loading initial data:', error);
      toast.error('Failed to load initial data');
    } finally {
      setLoading(false);
    }
  };

  // Update fee particulars when entity is selected
  useEffect(() => {
    if (selectedEntity && feesParticulars) {
      const particulars = [];
      
      // Use fee particulars from Settings
      if (feesParticulars.monthlyTutorFee > 0) {
        particulars.push({ particular: 'Monthly Tuition Fee', amount: feesParticulars.monthlyTutorFee });
      }
      if (feesParticulars.admissionFee > 0) {
        particulars.push({ particular: 'Admission Fee', amount: feesParticulars.admissionFee });
      }
      if (feesParticulars.registrationFee > 0) {
        particulars.push({ particular: 'Registration Fee', amount: feesParticulars.registrationFee });
      }
      if (feesParticulars.artMaterial > 0) {
        particulars.push({ particular: 'Art Material', amount: feesParticulars.artMaterial });
      }
      if (feesParticulars.transport > 0) {
        particulars.push({ particular: 'Transport', amount: feesParticulars.transport });
      }
      if (feesParticulars.books > 0) {
        particulars.push({ particular: 'Books', amount: feesParticulars.books });
      }
      if (feesParticulars.uniform > 0) {
        particulars.push({ particular: 'Uniform', amount: feesParticulars.uniform });
      }
      if (feesParticulars.others > 0) {
        particulars.push({ particular: 'Others', amount: feesParticulars.others });
      }
      if (feesParticulars.previousBalance > 0) {
        particulars.push({ particular: 'Previous Balance', amount: feesParticulars.previousBalance });
      }
      if (feesParticulars.becomingFee > 0) {
        particulars.push({ particular: 'Becoming Fee', amount: feesParticulars.becomingFee });
      }
      if (feesParticulars.free > 0) {
        particulars.push({ particular: 'Free/Discount', amount: -feesParticulars.free });
      }
      
      // If no fee particulars configured, add default
      if (particulars.length === 0) {
        particulars.push({ particular: 'Tuition Fee', amount: 0 });
      }
      
      setFeeParticularsList(particulars);
    } else {
      setFeeParticularsList([]);
    }
  }, [selectedEntity, feesParticulars]);

  const getSuggestions = () => {
    const query = searchQuery.toLowerCase();
    if (!query) return [];

    if (collectionType === 'student') {
      return students.filter(s => 
        s.studentName.toLowerCase().includes(query) || 
        (s.registrationNo && s.registrationNo.toLowerCase().includes(query))
      ).slice(0, 10);
    } else if (collectionType === 'class') {
      return classes.filter(c => 
        c.name.toLowerCase().includes(query)
      ).slice(0, 10);
    }
    return [];
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setShowSuggestions(value.length > 0);
    setSelectedEntity(null);
  };

  const handleSelectEntity = (entity) => {
    setSelectedEntity(entity);
    setSearchQuery(entity.studentName || entity.name);
    setShowSuggestions(false);
    toast.success(`${collectionType === 'student' ? 'Student' : 'Class'} selected: ${entity.studentName || entity.name}`);
  };



  const [monthStats, setMonthStats] = useState({ totalDue: 0, paid: 0, balance: 0, status: 'pending' });
  const [payingAmount, setPayingAmount] = useState('');

  // Calculate month stats when dependencies change
  useEffect(() => {
    const fetchMonthDetails = async () => {
      if (!selectedEntity || !feesMonth) return;

      try {
        setLoading(true);
        // Calculate Total Due from current structure
        const currentTotalDue = feeParticularsList.reduce((sum, fee) => sum + fee.amount, 0);

        // Fetch previous payments for this month
        const paidResponse = await feesApi.getFeesPaidSlip(selectedEntity._id, feesMonth);
        const previousPayments = Array.isArray(paidResponse) ? paidResponse : [];
        
        const totalPaid = previousPayments.reduce((sum, record) => sum + record.amount, 0);
        const balance = Math.max(0, currentTotalDue - totalPaid);
        const status = balance <= 0 && currentTotalDue > 0 ? 'completed' : (totalPaid > 0 ? 'partial' : 'pending');

        setMonthStats({
          totalDue: currentTotalDue,
          paid: totalPaid,
          balance: balance,
          status: status
        });

        // Default paying amount to balance
        setPayingAmount(balance > 0 ? balance.toString() : '0');

      } catch (error) {
        console.error('Error fetching month details:', error);
        toast.error('Failed to fetch payment history');
      } finally {
        setLoading(false);
      }
    };

    fetchMonthDetails();
  }, [selectedEntity, feesMonth, feeParticularsList]);


  const handleSubmitFees = async () => {
    if (!selectedEntity || !feesMonth || !feesDate || !depositType) {
      toast.error('Please fill all required fields');
      return;
    }

    const amountToPay = parseFloat(payingAmount);
    if (!amountToPay || amountToPay <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (amountToPay > monthStats.balance) {
       toast.error(`Amount cannot exceed remaining balance of ₹${monthStats.balance}`);
       return;
    }

    try {
      setLoading(true);
      
      // If partial payment, adjust particulars description
      let finalParticulars = [...feeParticularsList];
      
      if (amountToPay < monthStats.balance || monthStats.paid > 0) {
        // For partial/subsequent payments, simpler breakdown or just "Partial Payment"
        // Determining exact breakdown for partial is complex, simplified to general collection
        finalParticulars = [{ 
          particular: `Fee Payment (${feesMonth})`, 
          amount: amountToPay 
        }];
      } else {
         // Full remaining payment - check if it matches total due exactly implies it's the ONLY payment
         // If it's a "final balancing payment", we might want to keep the original structure logic 
         // but strictly, the amount must sum up. 
         // If custom amount used, we override particulars to avoid mismatch.
         const sumParticulars = feeParticularsList.reduce((sum, p) => sum + p.amount, 0);
         if (amountToPay !== sumParticulars) {
            finalParticulars = [{ 
              particular: `Fee Payment (${feesMonth})`, 
              amount: amountToPay 
            }];
         }
      }

      const feeData = {
        studentId: selectedEntity._id,
        studentName: selectedEntity.studentName,
        registrationNo: selectedEntity.registrationNo,
        class: selectedEntity.selectClass || selectedEntity.class,
        guardianName: selectedEntity.guardianName || selectedEntity.fatherName || selectedEntity.motherName || 'N/A',
        amount: amountToPay,
        paymentDate: feesDate,
        feeMonth: feesMonth,
        depositType: depositType,
        particulars: finalParticulars,
        status: paymentStatus,
        collectedBy: collectedBy,
        remarks: remarks
      };

      const response = await feesApi.collectFees(feeData);
      
      // Clear any saved form data on success
      sessionStorage.removeItem('feeFormData');
      
      // Generate receipt data
      setReceiptData({
        receiptNo: response.receiptNo || response._id || 'RCP-' + Date.now(),
        date: new Date().toLocaleDateString(),
        entity: selectedEntity,
        feesMonth,
        feesDate,
        depositType,
        feeParticulars: finalParticulars,
        totalAmount: amountToPay,
        collectionType,
        collectedBy,
        status: paymentStatus,
        remarks
      });
      
      setReceiptGenerated(true);
      toast.success('Fees collected successfully!');
      
    } catch (error) {
      console.error('Error collecting fees:', error);
      toast.error(error.message || 'Failed to collect fees');
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
    setFeeParticularsList([]);
    setPaymentStatus('completed');
    setRemarks('');
  };

  const totalAmount = feeParticularsList.reduce((sum, fee) => sum + fee.amount, 0);

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
                      Reg No: {student.registrationNo} • {student.selectClass || student.class} • Due: ₹{student.dueBalance || student.feesDue || 0}
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
                <div className="font-bold text-gray-900 dark:text-white">
                  {selectedEntity.guardianName || selectedEntity.fatherName || selectedEntity.guardian || 'N/A'}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <GraduationCap className="w-4 h-4" />Class
                </div>
                <div className="font-bold text-gray-900 dark:text-white">
                  {selectedEntity.selectClass || selectedEntity.class || 'N/A'}
                </div>
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
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Payment Status for {new Date(feesMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Fee Required</div>
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">₹{monthStats.totalDue.toFixed(2)}</div>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Paid So Far</div>
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">₹{monthStats.paid.toFixed(2)}</div>
                </div>
                <div className={`p-4 border rounded-xl ${monthStats.balance > 0 ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'}`}>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Remaining Balance</div>
                  <div className={`text-2xl font-bold ${monthStats.balance > 0 ? 'text-red-700 dark:text-red-300' : 'text-gray-400'}`}>₹{monthStats.balance.toFixed(2)}</div>
                </div>
              </div>

              {monthStats.balance <= 0 && monthStats.totalDue > 0 && (
                <div className="p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-xl flex items-center justify-center gap-2 mb-6 font-bold">
                  <CheckCircle className="w-5 h-5" />
                  Fees for this month are fully paid!
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                   Paying Amount (₹) <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  value={payingAmount}
                  onChange={(e) => setPayingAmount(e.target.value)}
                  disabled={monthStats.balance <= 0}
                  placeholder="Enter amount to pay"
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-xl font-bold"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {payingAmount < monthStats.balance ? 'Partial payment details will be recorded.' : 'Full payment.'}
                </p>
              </div>

              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Fee Breakdown (Reference)</h3>
              <div className="overflow-x-auto rounded-xl border-2 border-gray-200 dark:border-gray-700 opacity-80">
                <table className="w-full">
                  <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                    <tr>
                      <th className="px-4 py-3 text-left font-bold">Particulars</th>
                      <th className="px-4 py-3 text-right font-bold">Standard Amount</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {feeParticularsList.map((fee, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-gray-900 dark:text-white">{fee.particular}</td>
                        <td className="px-4 py-3 text-right text-gray-900 dark:text-white">₹{fee.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                   <tfoot className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 font-semibold">
                    <tr>
                      <td className="px-4 py-3">Total Standard Fee</td>
                      <td className="px-4 py-3 text-right">₹{monthStats.totalDue.toFixed(2)}</td>
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
                  <AlertCircle className="w-4 h-4 inline mr-2" />Payment Status
                </label>
                <select 
                  value={paymentStatus} 
                  onChange={(e) => setPaymentStatus(e.target.value)} 
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                >
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <Building className="w-4 h-4 inline mr-2" />Collected By
                </label>
                <input 
                  type="text" 
                  value={collectedBy}
                  onChange={(e) => setCollectedBy(e.target.value)}
                  placeholder="Enter collector's name"
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <FileText className="w-4 h-4 inline mr-2" />Remarks
                </label>
                <input 
                  type="text" 
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Enter any remarks (optional)"
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                />
              </div>
            </div>
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <DollarSign className="w-4 h-4 inline mr-2" />Due Balance
              </label>
              <div className="px-4 py-3 bg-red-50 dark:bg-gray-900 border-2 border-red-200 dark:border-gray-700 rounded-xl">
                <span className="text-2xl font-bold text-red-600 dark:text-red-400">₹{selectedEntity.dueBalance?.toFixed(2) || '0.00'}</span>
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