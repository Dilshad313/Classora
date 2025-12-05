import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Save, 
  DollarSign, 
  BookOpen, 
  Shirt, 
  Bus, 
  Palette, 
  Users,
  ClipboardList,
  Package,
  Gift,
  AlertCircle,
  ChevronRight,
  Home,
  Loader2,
  TrendingUp,
  Calculator,
  FileText,
  RefreshCw,
  CheckCircle2,
  XCircle,
  IndianRupee,
  Wallet,
  CreditCard,
  Building,
  GraduationCap,
  Sparkles
} from 'lucide-react';
import { getFeesParticulars, updateFeesParticulars } from '../../../../services/instituteApi.js';
import toast from 'react-hot-toast';

export const FeesParticulars = () => {
  const navigate = useNavigate();
  
  const FEE_FIELDS = [
    'monthlyTutorFee',
    'admissionFee',
    'registrationFee',
    'artMaterial',
    'transport',
    'books',
    'uniform',
    'free',
    'others',
    'previousBalance',
    'becomingFee'
  ];

  const [feeParticulars, setFeeParticulars] = useState({
    monthlyTutorFee: '',
    admissionFee: '',
    registrationFee: '',
    artMaterial: '',
    transport: '',
    books: '',
    uniform: '',
    free: '',
    others: '',
    previousBalance: '',
    becomingFee: ''
  });

  const [errors, setErrors] = useState({});
  const [isModified, setIsModified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        console.log('🔍 Fetching fees particulars...');
        
        const data = await getFeesParticulars();
        console.log('📊 Fees data received:', data);
        
        if (data) {
          const feeData = {};
          FEE_FIELDS.forEach(field => {
            feeData[field] = data[field] !== undefined && data[field] !== null 
              ? data[field].toString() 
              : '';
          });
          
          console.log('🔄 Setting fee particulars:', feeData);
          setFeeParticulars(feeData);
        }
      } catch (err) {
        console.error('❌ Failed to load fee particulars:', err);
        toast.error(err.message || 'Failed to load fee particulars');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (field, value) => {
    if (value && !/^\d*\.?\d*$/.test(value)) {
      return;
    }

    setFeeParticulars(prev => ({
      ...prev,
      [field]: value
    }));
    
    setIsModified(true);
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    FEE_FIELDS.forEach(field => {
      const value = feeParticulars[field];
      if (value && value.trim() !== '' && !/^\d*\.?\d*$/.test(value)) {
        newErrors[field] = 'Please enter a valid number';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors before saving.');
      return;
    }

    setIsSubmitting(true);
    toast.loading('Saving fee particulars...', { id: 'saveFees' });
    
    try {
      const numericData = {};
      FEE_FIELDS.forEach(field => {
        const value = feeParticulars[field];
        numericData[field] = value && value !== '' ? parseFloat(value) : 0;
      });
      
      const updatedData = await updateFeesParticulars(numericData);
      
      const updatedFeeData = {};
      FEE_FIELDS.forEach(field => {
        updatedFeeData[field] = updatedData[field] !== undefined && updatedData[field] !== null 
          ? updatedData[field].toString() 
          : '';
      });
      
      setFeeParticulars(updatedFeeData);
      setIsModified(false);
      
      toast.success('Fee particulars saved successfully!', { id: 'saveFees' });
    } catch (error) {
      console.error('❌ Error saving fee particulars:', error);
      toast.error(error.message || 'Failed to save fee particulars', { id: 'saveFees' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all changes?')) {
      window.location.reload();
    }
  };

  const calculateTotal = () => {
    return FEE_FIELDS.reduce((total, field) => {
      const value = feeParticulars[field];
      const numValue = value && value.trim() !== '' ? parseFloat(value) : 0;
      return total + numValue;
    }, 0);
  };

  const calculateCategoryTotal = (fields) => {
    return fields.reduce((total, field) => {
      const value = feeParticulars[field];
      const numValue = value && value.trim() !== '' ? parseFloat(value) : 0;
      return total + numValue;
    }, 0);
  };

  const feeSections = [
    {
      id: 'monthly',
      title: "Monthly Tuition",
      description: "Regular monthly fees for all students",
      icon: Users,
      gradient: "from-purple-500 via-pink-500 to-rose-500",
      bgGradient: "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20",
      items: [
        {
          key: 'monthlyTutorFee',
          label: 'Monthly Tutor Fee',
          description: 'Regular monthly tuition fee',
          icon: GraduationCap,
          color: 'purple'
        }
      ]
    },
    {
      id: 'admission',
      title: "Admission Fees",
      description: "One-time fees during admission",
      icon: ClipboardList,
      gradient: "from-blue-500 via-cyan-500 to-teal-500",
      bgGradient: "from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20",
      items: [
        {
          key: 'admissionFee',
          label: 'Admission Fee',
          description: 'Initial admission charges',
          icon: FileText,
          color: 'blue'
        },
        {
          key: 'registrationFee',
          label: 'Registration Fee',
          description: 'Student registration charges',
          icon: ClipboardList,
          color: 'cyan'
        }
      ]
    },
    {
      id: 'services',
      title: "Additional Services",
      description: "Optional services and facilities",
      icon: Building,
      gradient: "from-orange-500 via-amber-500 to-yellow-500",
      bgGradient: "from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20",
      items: [
        {
          key: 'artMaterial',
          label: 'Art Material',
          description: 'Art and craft supplies',
          icon: Palette,
          color: 'orange'
        },
        {
          key: 'transport',
          label: 'Transport',
          description: 'Bus transportation fee',
          icon: Bus,
          color: 'amber'
        },
        {
          key: 'books',
          label: 'Books',
          description: 'Textbooks and study material',
          icon: BookOpen,
          color: 'yellow'
        },
        {
          key: 'uniform',
          label: 'Uniform',
          description: 'School uniform charges',
          icon: Shirt,
          color: 'orange'
        }
      ]
    },
    {
      id: 'miscellaneous',
      title: "Other Charges",
      description: "Discounts and miscellaneous fees",
      icon: Package,
      gradient: "from-green-500 via-emerald-500 to-teal-500",
      bgGradient: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
      items: [
        {
          key: 'free',
          label: 'Discount / Scholarship',
          description: 'Fee waiver or scholarship amount',
          icon: Gift,
          color: 'green'
        },
        {
          key: 'others',
          label: 'Other Charges',
          description: 'Miscellaneous charges',
          icon: Package,
          color: 'emerald'
        }
      ]
    },
    {
      id: 'balance',
      title: "Balance & Dues",
      description: "Previous balances and pending fees",
      icon: Wallet,
      gradient: "from-indigo-500 via-violet-500 to-purple-500",
      bgGradient: "from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20",
      items: [
        {
          key: 'previousBalance',
          label: 'Previous Balance',
          description: 'Outstanding from previous period',
          icon: CreditCard,
          color: 'indigo'
        },
        {
          key: 'becomingFee',
          label: 'Becoming Fee',
          description: 'Additional pending charges',
          icon: DollarSign,
          color: 'violet'
        }
      ]
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-900/20 dark:to-purple-900/20">
        <div className="text-center">
          <div className="relative">
            <Loader2 className="animate-spin h-16 w-16 text-indigo-600 dark:text-indigo-400 mx-auto" />
            <Sparkles className="absolute top-0 right-0 w-6 h-6 text-purple-500 animate-pulse" />
          </div>
          <p className="mt-6 text-lg font-semibold text-gray-700 dark:text-gray-300">Loading fees particulars...</p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Please wait a moment</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-900/20 dark:to-purple-900/20 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all font-medium"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="px-3 py-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-semibold">
            General Settings
          </span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="px-3 py-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold">
            Fees Particulars
          </span>
        </div>

        {/* Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-8 md:p-12 mb-8">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex items-start gap-5">
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg">
                  <Calculator className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 flex items-center gap-3">
                    Fee Particulars Management
                    <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
                  </h1>
                  <p className="text-indigo-100 text-lg max-w-2xl">
                    Configure and manage all fee components for your institute with ease
                  </p>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                      <CheckCircle2 className="w-4 h-4 text-green-300" />
                      <span className="text-sm text-white font-medium">Auto-save enabled</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                      <TrendingUp className="w-4 h-4 text-yellow-300" />
                      <span className="text-sm text-white font-medium">Real-time calculation</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {isModified && (
                <div className="flex items-center gap-3 px-5 py-3 bg-yellow-400/90 backdrop-blur-sm text-yellow-900 rounded-2xl shadow-lg animate-pulse">
                  <AlertCircle className="w-6 h-6" />
                  <div>
                    <p className="font-bold">Unsaved Changes</p>
                    <p className="text-sm">Don't forget to save!</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Fee Sections - Left Side */}
          <div className="xl:col-span-2 space-y-6">
            {feeSections.map((section, sectionIndex) => {
              const SectionIcon = section.icon;
              const categoryTotal = calculateCategoryTotal(section.items.map(item => item.key));
              
              return (
                <div 
                  key={sectionIndex} 
                  className="group bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
                >
                  {/* Section Header */}
                  <div className={`bg-gradient-to-r ${section.gradient} p-6`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                          <SectionIcon className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-1">
                            {section.title}
                          </h3>
                          <p className="text-white/80 text-sm">
                            {section.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white/80 text-sm font-medium mb-1">Category Total</p>
                        <p className="text-3xl font-bold text-white flex items-center gap-1">
                          <IndianRupee className="w-6 h-6" />
                          {categoryTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Section Content */}
                  <div className={`bg-gradient-to-br ${section.bgGradient} p-6`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {section.items.map((item) => {
                        const IconComponent = item.icon;
                        const value = feeParticulars[item.key] || '';
                        const numValue = value ? parseFloat(value) : 0;
                        
                        return (
                          <div key={item.key} className="group/item">
                            <label className="flex items-center gap-2 mb-3">
                              <div className={`p-2 bg-${item.color}-100 dark:bg-${item.color}-900/30 rounded-lg group-hover/item:scale-110 transition-transform`}>
                                <IconComponent className={`w-5 h-5 text-${item.color}-600 dark:text-${item.color}-400`} />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                                  {item.label}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {item.description}
                                </p>
                              </div>
                            </label>
                            
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <IndianRupee className="w-5 h-5 text-gray-400" />
                              </div>
                              <input
                                type="text"
                                value={value}
                                onChange={(e) => handleInputChange(item.key, e.target.value)}
                                className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-4 focus:outline-none transition-all duration-200 font-bold text-lg bg-white dark:bg-gray-900/50 ${
                                  errors[item.key] 
                                    ? 'border-red-500 focus:ring-red-200 focus:border-red-500 dark:focus:ring-red-900/50' 
                                    : 'border-gray-200 dark:border-gray-700 focus:ring-indigo-200 focus:border-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-900/50'
                                } ${numValue > 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-900 dark:text-gray-100'}`}
                                placeholder="0.00"
                              />
                              {numValue > 0 && (
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                                </div>
                              )}
                              {errors[item.key] && (
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                  <XCircle className="w-5 h-5 text-red-500" />
                                </div>
                              )}
                            </div>
                            
                            {errors[item.key] && (
                              <p className="mt-2 text-red-500 text-xs flex items-center gap-1 font-medium">
                                <AlertCircle className="w-3 h-3" />
                                <span>{errors[item.key]}</span>
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sidebar - Summary & Actions */}
          <div className="space-y-6">
            {/* Grand Total Card */}
            <div className="sticky top-6 space-y-6">
              <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-3xl shadow-2xl p-8">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full translate-x-1/2 -translate-y-1/2"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-1/2 translate-y-1/2"></div>
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                      <Calculator className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Grand Total</h3>
                      <p className="text-emerald-100 text-sm">Total fee amount</p>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 mb-4">
                    <div className="flex items-baseline gap-2 mb-2">
                      <IndianRupee className="w-8 h-8 text-white" />
                      <span className="text-5xl font-extrabold text-white">
                        {calculateTotal().toLocaleString('en-IN', { 
                          minimumFractionDigits: 2, 
                          maximumFractionDigits: 2 
                        })}
                      </span>
                    </div>
                    <p className="text-emerald-100 text-sm">
                      Sum of all fee components
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                      <p className="text-emerald-100 text-xs mb-1">Components</p>
                      <p className="text-2xl font-bold text-white">{FEE_FIELDS.length}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                      <p className="text-emerald-100 text-xs mb-1">Categories</p>
                      <p className="text-2xl font-bold text-white">{feeSections.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 space-y-4">
                <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  Quick Actions
                </h4>
                
                <button
                  onClick={handleSave}
                  disabled={isSubmitting || !isModified}
                  className={`w-full py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-3 text-lg shadow-lg ${
                    isSubmitting || !isModified
                      ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500 dark:text-gray-400'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white hover:shadow-2xl transform hover:scale-105 active:scale-95'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-6 h-6" />
                      <span>Save All Changes</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleReset}
                  disabled={isSubmitting}
                  className="w-full py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 font-bold flex items-center justify-center gap-3 hover:scale-105 active:scale-95"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Reset Changes</span>
                </button>
                
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-2xl transition-all duration-300 font-bold flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                >
                  <Home className="w-5 h-5" />
                  <span>Back to Dashboard</span>
                </button>
              </div>

              {/* Info Cards */}
              <div className="space-y-3">
                {/* Success Info */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border-2 border-green-200 dark:border-green-800 p-5">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-green-900 dark:text-green-300 mb-1">Auto-Save Feature</h4>
                      <p className="text-sm text-green-700 dark:text-green-400 leading-relaxed">
                        Your changes are automatically validated in real-time. Click save to update the database.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Info Alert */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800 p-5">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-1">Important Note</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-400 leading-relaxed">
                        Enter fee amounts in INR (₹). Leave fields empty or set to 0 if not applicable.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border-2 border-purple-200 dark:border-purple-800 p-5">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-purple-900 dark:text-purple-300 mb-1">Pro Tip</h4>
                      <p className="text-sm text-purple-700 dark:text-purple-400 leading-relaxed">
                        Use the category totals to verify your fee structure before saving changes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Monthly Fees', value: feeParticulars.monthlyTutorFee || 0, icon: Users, color: 'purple' },
            { label: 'Admission Total', value: (parseFloat(feeParticulars.admissionFee || 0) + parseFloat(feeParticulars.registrationFee || 0)), icon: ClipboardList, color: 'blue' },
            { label: 'Services Total', value: (parseFloat(feeParticulars.transport || 0) + parseFloat(feeParticulars.books || 0) + parseFloat(feeParticulars.uniform || 0) + parseFloat(feeParticulars.artMaterial || 0)), icon: Building, color: 'orange' },
            { label: 'Balance & Others', value: (parseFloat(feeParticulars.previousBalance || 0) + parseFloat(feeParticulars.becomingFee || 0) + parseFloat(feeParticulars.others || 0)), icon: Wallet, color: 'green' },
          ].map((stat, index) => {
            const StatIcon = stat.icon;
            return (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-5 hover:shadow-xl transition-all hover:scale-105">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 bg-${stat.color}-100 dark:bg-${stat.color}-900/30 rounded-xl`}>
                    <StatIcon className={`w-5 h-5 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                  </div>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">{stat.label}</p>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-1">
                  <IndianRupee className="w-5 h-5" />
                  {parseFloat(stat.value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeesParticulars;