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
  AlertCircle,
  Loader
} from 'lucide-react';
import { accountApi } from '../../../../services/accountApi';
import toast from 'react-hot-toast';

const AddExpense = () => {
  const navigate = useNavigate();
  // Form state
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: '',
    category: 'other',
    paymentMethod: 'cash'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Expense categories
  const expenseCategories = [
    { value: 'salary', label: 'Salary Payment' },
    { value: 'office_supplies', label: 'Office Supplies' },
    { value: 'utility_bill', label: 'Utility Bill' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'other', label: 'Other Expense' }
  ];

  // Payment methods
  const paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'online', label: 'Online Payment' },
    { value: 'other', label: 'Other' }
  ];

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

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting.');
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await accountApi.addExpense(formData);
     
      if (result.success) {
        toast.success('Expense added successfully!');
        // Reset form
        setFormData({
          date: new Date().toISOString().split('T')[0],
          description: '',
          amount: '',
          category: 'other',
          paymentMethod: 'cash'
        });
        setErrors({});
       
        // Navigate back to account statement
        setTimeout(() => {
          navigate('/dashboard/account/statement');
        }, 1500);
      } else {
        toast.error(result.message || 'Failed to add expense');
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error(error.message || 'Error adding expense. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      description: '',
      amount: '',
      category: 'other',
      paymentMethod: 'cash'
    });
    setErrors({});
    toast.success('Form reset successfully!');
  };

  const handleCancel = () => {
    navigate('/dashboard/account/statement');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <button
            onClick={() => navigate('/dashboard/account/statement')}
            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
          >
            Account
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span className="text-gray-900 dark:text-white font-semibold">Add Expense</span>
        </div>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-rose-600 dark:from-red-500 dark:to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add Expense</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Record new expense entry</p>
            </div>
          </div>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-6">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <FileText className="w-6 h-6 text-red-600 dark:text-red-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Expense Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-red-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      errors.date ? 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600 focus:border-red-500 dark:focus:border-red-400 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                  />
                </div>
                {errors.date && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.date}
                  </p>
                )}
              </div>
              {/* Amount */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Amount (₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <DollarSign className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="Enter amount"
                    className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-red-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      errors.amount ? 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600 focus:border-red-500 dark:focus:border-red-400 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                  />
                </div>
                {errors.amount && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.amount}
                  </p>
                )}
              </div>
              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all appearance-none hover:border-gray-400 dark:hover:border-gray-500"
                >
                  {expenseCategories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              {/* Payment Method */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all appearance-none hover:border-gray-400 dark:hover:border-gray-500"
                >
                  {paymentMethods.map(method => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>
              {/* Expense Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Expense Description <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FileText className="w-5 h-5 absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter detailed expense description..."
                    rows="4"
                    className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-red-500 transition-all resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      errors.description ? 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600 focus:border-red-500 dark:focus:border-red-400 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                  />
                </div>
                {errors.description && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.description}
                  </p>
                )}
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                  Provide a clear description of the expense for better record keeping.
                </p>
              </div>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-all font-semibold"
              >
                <X className="w-5 h-5" />
                <span>Cancel</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-100 dark:bg-orange-900/30 hover:bg-orange-200 dark:hover:bg-orange-800 text-orange-700 dark:text-orange-300 rounded-xl transition-all font-semibold"
              >
                <X className="w-5 h-5" />
                <span>Reset Form</span>
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-all font-bold shadow-lg hover:shadow-xl ${
                  isSubmitting
                    ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed text-gray-200 dark:text-gray-300'
                    : 'bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-500 dark:to-rose-500 hover:from-red-700 hover:to-rose-700 dark:hover:from-red-600 dark:hover:to-rose-600 text-white'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Adding Expense...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Add Expense</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;