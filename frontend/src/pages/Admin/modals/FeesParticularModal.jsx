import React, { useState, useEffect } from 'react';
import { 
  X, 
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
  AlertCircle
} from 'lucide-react';

const FeesParticularModal = ({ isOpen, onClose, onSave }) => {
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

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen) {
      const initialData = {
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
      };
      setFeeParticulars(initialData);
      setErrors({});
      setIsModified(false);
    }
  }, [isOpen]);

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
    
    try {
      const formattedData = {
        ...feeParticulars,
        timestamp: new Date().toISOString()
      };

      await onSave(formattedData);
      onClose();
    } catch (error) {
      console.error('Error saving fee particulars:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isModified) {
      const confirmCancel = window.confirm(
        'You have unsaved changes. Are you sure you want to cancel?'
      );
      if (!confirmCancel) return;
    }
    onClose();
  };

  const calculateTotal = () => {
    return Object.values(feeParticulars).reduce((total, value) => {
      const numValue = parseFloat(value) || 0;
      return total + numValue;
    }, 0);
  };

  if (!isOpen) return null;

  const feeSections = [
    {
      title: "All Students",
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden transform transition-all animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Fee Particulars</h2>
              <p className="text-blue-100 text-sm">Configure all fee components</p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="p-2.5 hover:bg-white/20 rounded-xl transition-all duration-200 hover:rotate-90"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(92vh-180px)] p-8 bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-gray-800">
          {feeSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-8 last:mb-0 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-3">
                <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-md">
                  {section.title}
                </span>
              </h3>
              
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
                          className={`w-full pl-10 pr-10 py-3 border-2 rounded-xl focus:ring-2 focus:outline-none transition-all duration-200 font-medium bg-gray-50 dark:bg-gray-900/50 ${
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
                        <p className="text-red-500 text-xs flex items-center space-x-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors[item.key]}</span>
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-4">
                <div className="flex justify-between items-center bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Section Total:</span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    ₹ {section.items.reduce((total, item) => {
                      const value = parseFloat(feeParticulars[item.key]) || 0;
                      return total + value;
                    }, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Total Amount */}
          <div className="mt-6 p-6 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-2xl shadow-xl border-2 border-green-400">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Grand Total:</span>
              </div>
              <span className="text-3xl font-extrabold text-white drop-shadow-lg">
                ₹ {calculateTotal().toLocaleString('en-US', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
          <div className="flex items-center space-x-2 text-sm">
            {isModified && (
              <div className="flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-3 py-1.5 rounded-lg border border-orange-300 dark:border-orange-700">
                <AlertCircle className="w-4 h-4 animate-pulse" />
                <span className="font-medium">Unsaved changes</span>
              </div>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleCancel}
              className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 font-semibold hover:scale-105 active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSubmitting || !isModified}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
                isSubmitting || !isModified
                  ? 'bg-gray-400 cursor-not-allowed text-gray-200 dark:bg-gray-600 dark:text-gray-400'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95'
              }`}
            >
              <Save className="w-5 h-5" />
              <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { FeesParticularModal };
export default FeesParticularModal;