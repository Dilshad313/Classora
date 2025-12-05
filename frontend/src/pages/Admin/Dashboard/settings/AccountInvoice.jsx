import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Upload, 
  Building, 
  User, 
  MapPin, 
  CreditCard,
  FileText,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Home,
  Landmark,
  Save,
  X,
  Loader,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { 
  getAllBankAccounts,
  createBankAccount,
  updateBankAccount,
  deleteBankAccount,
  deleteBankAccountLogo,
  getBankAccountStats
} from '../../../../services/bankAccountApi';

export const AccountInvoice = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');
  const [showAddBank, setShowAddBank] = useState(false);
  const [banks, setBanks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingBank, setEditingBank] = useState(null);
  const [stats, setStats] = useState(null);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  const [bankForm, setBankForm] = useState({
    bankName: '',
    emailManager: '',
    bankAddress: '',
    accountNumber: '',
    instructions: '',
    logo: null,
    loginRequired: false,
    status: 'active'
  });

  // Show notification
  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 5000);
  };

  // Fetch banks from API
  const fetchBanks = async () => {
    try {
      setLoading(true);
      const bankAccounts = await getAllBankAccounts();
      setBanks(bankAccounts);
      
      // Fetch stats
      const statsData = await getBankAccountStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching banks:', error);
      showNotification('error', `Failed to load banks: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch banks on component mount
  useEffect(() => {
    fetchBanks();
  }, []);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setBankForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showNotification('error', 'Please select an image file');
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        showNotification('error', 'File size must be less than 5MB');
        return;
      }

      setBankForm(prev => ({
        ...prev,
        logo: file
      }));
    }
  };

  // Reset form
  const resetForm = () => {
    setBankForm({
      bankName: '',
      emailManager: '',
      bankAddress: '',
      accountNumber: '',
      instructions: '',
      logo: null,
      loginRequired: false,
      status: 'active'
    });
    setEditingBank(null);
    setShowAddBank(false);
  };

  // Handle form submission (create or update)
  const handleSubmit = async () => {
    if (!bankForm.bankName.trim() || !bankForm.accountNumber.trim()) {
      showNotification('error', 'Bank name and account number are required');
      return;
    }

    try {
      setSubmitting(true);
      
      if (editingBank) {
        // Update existing bank
        await updateBankAccount(editingBank._id, bankForm);
        showNotification('success', 'Bank account updated successfully');
      } else {
        // Create new bank
        await createBankAccount(bankForm);
        showNotification('success', 'Bank account created successfully');
      }
      
      resetForm();
      fetchBanks(); // Refresh the list
    } catch (error) {
      console.error('Error saving bank account:', error);
      showNotification('error', `Failed to save: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit bank
  const handleEditBank = (bank) => {
    setEditingBank(bank);
    setBankForm({
      bankName: bank.bankName,
      emailManager: bank.emailManager || '',
      bankAddress: bank.bankAddress || '',
      accountNumber: bank.accountNumber,
      instructions: bank.instructions || '',
      logo: null, // Don't pre-fill file input
      loginRequired: bank.loginRequired,
      status: bank.status
    });
    setShowAddBank(true);
  };

  // Handle delete bank
  const handleDeleteBank = async (bank) => {
    if (!window.confirm(`Are you sure you want to delete ${bank.bankName}?`)) {
      return;
    }

    try {
      setLoading(true);
      await deleteBankAccount(bank._id);
      showNotification('success', 'Bank account deleted successfully');
      fetchBanks(); // Refresh the list
    } catch (error) {
      console.error('Error deleting bank:', error);
      showNotification('error', `Failed to delete: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete logo
  const handleDeleteLogo = async (bank) => {
    try {
      await deleteBankAccountLogo(bank._id);
      showNotification('success', 'Logo deleted successfully');
      fetchBanks(); // Refresh the list
    } catch (error) {
      console.error('Error deleting logo:', error);
      showNotification('error', `Failed to delete logo: ${error.message}`);
    }
  };

  // Filter and pagination logic
  const filteredBanks = banks.filter(bank =>
    bank.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bank.accountNumber.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredBanks.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedBanks = filteredBanks.slice(startIndex, startIndex + entriesPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/40 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-6 md:p-8">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg border-l-4 ${
          notification.type === 'success' 
            ? 'bg-green-50 border-green-500 text-green-800 dark:bg-green-900/20 dark:text-green-300' 
            : 'bg-red-50 border-red-500 text-red-800 dark:bg-red-900/20 dark:text-red-300'
        }`}>
          <div className="flex items-center gap-3">
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
            <span className="font-medium">{notification.message}</span>
            <button 
              onClick={() => setNotification({ show: false, type: '', message: '' })}
              className="ml-4 hover:opacity-70"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

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
          <span className="text-gray-900 dark:text-white font-semibold">Account Invoice</span>
        </div>

        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-6 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                <Landmark className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">Bank Settings</h1>
                <p className="text-gray-600 dark:text-gray-400">Manage your bank accounts and fee challan details</p>
              </div>
            </div>
            
            {/* Stats */}
            {stats && (
              <div className="flex gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-800">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.totalAccounts}</div>
                  <div className="text-sm text-green-700 dark:text-green-300">Total Banks</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.activeAccounts}</div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">Active</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 p-2">
            <nav className="flex gap-2">
              <button
                onClick={() => setActiveTab('general')}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  activeTab === 'general'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                General Settings
              </button>
              <button
                onClick={() => setActiveTab('fee')}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  activeTab === 'fee'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Fee Challan Details
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
          {/* Add/Edit Bank Section */}
          {showAddBank ? (
            <div className="p-8 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-indigo-50/30 dark:from-gray-900 dark:to-gray-800">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                    <Landmark className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  {editingBank ? 'Edit Bank Account' : 'Add New Bank'}
                </h2>
                <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <span className="text-red-500 font-semibold text-sm">* Required</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Optional</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Bank Logo */}
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
                      <Upload className="w-4 h-4" />
                      <span>Bank Logo</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="bank-logo"
                      />
                      <label
                        htmlFor="bank-logo"
                        className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Choose Logo</span>
                      </label>
                      {bankForm.logo && (
                        <p className="mt-2 text-sm text-gray-600">
                          Selected: {bankForm.logo.name}
                        </p>
                      )}
                      {editingBank?.logoUrl && !bankForm.logo && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-600 mb-2">Current logo:</p>
                          <div className="flex items-center gap-3">
                            <img
                              src={editingBank.logoUrl}
                              alt="Current logo"
                              className="w-16 h-16 object-contain rounded-lg border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => handleDeleteLogo(editingBank)}
                              className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
                            >
                              Remove Logo
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Login Required */}
                  <div>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={bankForm.loginRequired}
                        onChange={(e) => handleInputChange('loginRequired', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Login Required</span>
                    </label>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                      <span>Status</span>
                    </label>
                    <select
                      value={bankForm.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  {/* Bank Name */}
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                      <Building className="w-4 h-4" />
                      <span>Your Bank Name</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={bankForm.bankName}
                      onChange={(e) => handleInputChange('bankName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter bank name"
                    />
                  </div>

                  {/* Email/Service Manager */}
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4" />
                      <span>Email/Service Manager</span>
                    </label>
                    <input
                      type="email"
                      value={bankForm.emailManager}
                      onChange={(e) => handleInputChange('emailManager', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Bank Address */}
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>Bank Address</span>
                    </label>
                    <textarea
                      value={bankForm.bankAddress}
                      onChange={(e) => handleInputChange('bankAddress', e.target.value)}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter bank address"
                    />
                  </div>

                  {/* Account Number */}
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                      <CreditCard className="w-4 h-4" />
                      <span>Bank Account No</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={bankForm.accountNumber}
                      onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter account number"
                    />
                  </div>

                  {/* Instructions */}
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                      <FileText className="w-4 h-4" />
                      <span>Instructions</span>
                    </label>
                    <textarea
                      value={bankForm.instructions}
                      onChange={(e) => handleInputChange('instructions', e.target.value)}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Write instructions"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={resetForm}
                  disabled={submitting}
                  className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 font-semibold hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  <span>{editingBank ? 'Update Bank' : 'Add Bank'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowAddBank(true)}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95"
              >
                <Plus className="w-5 h-5" />
                <span>Add New Bank</span>
              </button>
            </div>
          )}

          {/* Banks Table Section */}
          <div className="p-8">
            {/* Table Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Show</span>
                <select
                  value={entriesPerPage}
                  onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-gray-700">entries</span>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by bank name or account number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                />
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-16">
                <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
                <span className="ml-3 text-gray-600">Loading banks...</span>
              </div>
            )}

            {/* Table */}
            {!loading && (
              <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">
                        Bank Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">
                        Logo
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">
                        Account No.
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">
                        Status
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-bold text-gray-900 dark:text-white">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {paginatedBanks.length > 0 ? (
                      paginatedBanks.map((bank) => (
                        <tr key={bank._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                <Landmark className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                              </div>
                              <div>
                                <span className="font-semibold text-gray-900 dark:text-white block">{bank.bankName}</span>
                                {bank.emailManager && (
                                  <span className="text-sm text-gray-500 dark:text-gray-400">{bank.emailManager}</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {bank.logoUrl ? (
                              <img
                                src={bank.logoUrl}
                                alt={`${bank.bankName} logo`}
                                className="w-12 h-12 object-contain rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-600">
                                <Building className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                            {bank.accountNumber}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              bank.status === 'active' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                            }`}>
                              {bank.status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={() => handleEditBank(bank)}
                                className="p-2 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-all hover:scale-110"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteBank(bank)}
                                className="p-2 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-all hover:scale-110"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center gap-4">
                            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full">
                              <AlertCircle className="w-12 h-12 text-gray-400" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No Banks Added</h3>
                              <p className="text-gray-500 dark:text-gray-400">Add your first bank account to get started</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Table Footer */}
            {!loading && (
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Showing <span className="font-bold text-gray-900 dark:text-white">{filteredBanks.length > 0 ? startIndex + 1 : 0}</span> to{' '}
                  <span className="font-bold text-gray-900 dark:text-white">{Math.min(startIndex + entriesPerPage, filteredBanks.length)}</span> of{' '}
                  <span className="font-bold text-gray-900 dark:text-white">{filteredBanks.length}</span> entries
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                  </button>
                  
                  <span className="px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-300 rounded-xl font-semibold text-sm border border-indigo-200 dark:border-indigo-800">
                    Page {currentPage} of {totalPages || 1}
                  </span>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="p-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountInvoice;