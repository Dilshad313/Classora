import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home,
  ChevronRight,
  DollarSign,
  Calendar,
  FileText,
  Save,
  X,
  AlertCircle
} from 'lucide-react';

const AddExpense = () => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    date: '',
    description: '',
    amount: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Expense description is required';
    }
    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Expense added:', formData);
      alert('Expense added successfully!');
      // Reset form
      setFormData({
        date: '',
        description: '',
        amount: ''
      });
      // Navigate back or to expense list page
      // navigate('/dashboard/employee/expense-list');
    }
  };

  const handleReset = () => {
    setFormData({
      date: '',
      description: '',
      amount: ''
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-blue-600 font-semibold">Employees</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-semibold">Add Expense</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-rose-600 rounded-xl flex items-center justify-center shadow-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add Expense</h1>
              <p className="text-gray-600 mt-1">Record new expense entry</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-6">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
              <FileText className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900">Expense Details</h2>
            </div>

            <div className="space-y-6">
              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-red-500 transition-all ${
                      errors.date ? 'border-red-500' : 'border-gray-300 focus:border-red-500'
                    }`}
                  />
                </div>
                {errors.date && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.date}
                  </p>
                )}
              </div>

              {/* Expense Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Expense Description <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FileText className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter expense description"
                    rows="4"
                    className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-red-500 transition-all resize-none ${
                      errors.description ? 'border-red-500' : 'border-gray-300 focus:border-red-500'
                    }`}
                  />
                </div>
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <DollarSign className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="Enter amount"
                    className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-red-500 transition-all ${
                      errors.amount ? 'border-red-500' : 'border-gray-300 focus:border-red-500'
                    }`}
                  />
                </div>
                {errors.amount && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.amount}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all font-semibold"
              >
                <X className="w-5 h-5" />
                <span>Reset Form</span>
              </button>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl transition-all font-bold shadow-lg hover:shadow-xl"
              >
                <Save className="w-5 h-5" />
                <span>Add Expense</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
