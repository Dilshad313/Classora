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
  Home
} from 'lucide-react';

export const FeesParticulars = () => {
  const navigate = useNavigate();
  
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
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFeesParticulars();
        if (data) {
          setFeeParticulars(prev => ({
            ...prev,
            ...data,
          }));
        }
      } catch (err) {
        console.error('Failed to load fee particulars', err);
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

    const requiredFields = ['monthlyTutorFee', 'admissionFee', 'registrationFee'];
    requiredFields.forEach(field => {
      if (!feeParticulars[field] || feeParticulars[field].trim() === '') {
        newErrors[field] = 'This field is required';
      }
    });

    Object.keys(feeParticulars).forEach(field => {
      if (feeParticulars[field] && !/^\d*\.?\d*$/.test(feeParticulars[field])) {
        newErrors[field] = 'Please enter a valid number';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setApiError('');
    
    try {
      await updateFeesParticulars(feeParticulars);
      alert('Fee particulars saved successfully!');
      setIsModified(false);
    } catch (error) {
      console.error('Error saving fee particulars:', error);
      setApiError(error.message || 'Failed to save fee particulars');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTotal = () => {
    return Object.values(feeParticulars).reduce((total, value) => {
      const numValue = parseFloat(value) || 0;
      return total + numValue;
    }, 0);
  };

  const feeSections = [
    {
      title: "All Students",
      color: "from-purple-500 to-pink-500",
      items: [
        {
          key: 'monthlyTutorFee',
          label: 'MONTHLY TUTOR FEE',
          icon: Users,
          required: true
        }
      ]
    },
    {
      title: "ADMISSION FEE",
      color: "from-blue-500 to-cyan-500",
      items: [
        {
          key: 'admissionFee',
          label: 'ADMISSION FEE',
          icon: ClipboardList,
          required: true
        },
        {
          key: 'registrationFee',
          label: 'REGISTRATION FEE',
          icon: ClipboardList,
          required: true
        }
      ]
    },
    {
      title: "OTHER CHARGES",
      color: "from-orange-500 to-red-500",
      items: [
        {
          key: 'artMaterial',
          label: 'ART MATERIAL',
          icon: Palette
        },
        {
          key: 'transport',
          label: 'TRANSPORT',
          icon: Bus
        },
        {
          key: 'books',
          label: 'BOOKS',
          icon: BookOpen
        },
        {
          key: 'uniform',
          label: 'UNIFORM',
          icon: Shirt
        },
        {
          key: 'free',
          label: 'FREE',
          icon: Gift
        },
        {
          key: 'others',
          label: 'OTHERS',
          icon: Package
        }
      ]
    },
    {
      title: "BALANCE & FEES",
      color: "from-green-500 to-emerald-500",
      items: [
        {
          key: 'previousBalance',
          label: 'PREVIOUS BALANCE',
          icon: DollarSign
        },
        {
          key: 'becomingFee',
          label: 'BECOMING FEE',
          icon: DollarSign
        }
      ]
    }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/40 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-blue-600 dark:text-blue-400 font-semibold">General Settings</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 dark:text-white font-semibold">Fees Particulars</span>
        </div>

        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                  Fee Particulars
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Configure all fee components for your institute
                </p>
              </div>
            </div>
            
            {isModified && (
              <div className="flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-4 py-2 rounded-xl border border-orange-300 dark:border-orange-700">
                <AlertCircle className="w-5 h-5 animate-pulse" />
                <span className="font-semibold">Unsaved changes</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Fee Sections */}
          <div className="xl:col-span-2 space-y-6">
            {feeSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <span className={`bg-gradient-to-r ${section.color} text-white px-5 py-2 rounded-full text-sm font-bold shadow-md`}>
                    {section.title}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {section.items.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <div key={item.key} className="space-y-2.5">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                          <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <IconComponent className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <span>{item.label}</span>
                          {item.required && <span className="text-red-500 text-base">*</span>}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <DollarSign className="w-4 h-4 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            value={feeParticulars[item.key]}
                            onChange={(e) => handleInputChange(item.key, e.target.value)}
                            className={`w-full pl-10 pr-10 py-3.5 border-2 rounded-xl focus:ring-2 focus:outline-none transition-all duration-200 font-medium bg-gray-50 dark:bg-gray-900/50 ${
                              errors[item.key] 
                                ? 'border-red-500 focus:ring-red-200 focus:border-red-500' 
                                : 'border-gray-200 dark:border-gray-700 focus:ring-blue-200 focus:border-blue-500 dark:focus:border-blue-400'
                            }`}
                            placeholder="0.00"
                          />
                          {errors[item.key] && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                              <AlertCircle className="w-4 h-4 text-red-500" />
                            </div>
                          )}
                        </div>
                        {errors[item.key] && (
                          <p className="text-red-500 text-xs flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>{errors[item.key]}</span>
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-4">
                  <div className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Section Total:</span>
                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      ₹ {section.items.reduce((total, item) => {
                        const value = parseFloat(feeParticulars[item.key]) || 0;
                        return total + value;
                      }, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar - Total & Actions */}
          <div className="space-y-6">
            {/* Grand Total Card */}
            <div className="bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-2xl shadow-2xl p-6 text-white sticky top-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <DollarSign className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Grand Total</h3>
              </div>
              <div className="text-5xl font-extrabold mb-2 drop-shadow-lg">
                ₹ {calculateTotal().toLocaleString('en-US', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}
              </div>
              <p className="text-green-100 text-sm">Total fee amount for all components</p>
            </div>

            {/* Action Buttons */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 space-y-4">
              {apiError && (
                <p className="text-red-500 text-sm text-center">{apiError}</p>
              )}
              <button
                onClick={handleSave}
                disabled={isSubmitting || !isModified}
                className={`w-full py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                  isSubmitting || !isModified
                    ? 'bg-gray-400 cursor-not-allowed text-gray-200 dark:bg-gray-600 dark:text-gray-400'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95'
                }`}
              >
                <Save className="w-5 h-5" />
                <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
              </button>
              
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 font-semibold hover:scale-105 active:scale-95"
              >
                Back to Dashboard
              </button>
            </div>

            {/* Info Card */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800 p-5">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">Important Note</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-400 leading-relaxed">
                    Required fields are marked with an asterisk (*). Make sure to fill all mandatory fields before saving.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeesParticulars;
