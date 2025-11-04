import React, { useState } from 'react';
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
  X
} from 'lucide-react';

export const AccountInvoice = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');
  const [showAddBank, setShowAddBank] = useState(false);
  const [banks, setBanks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const [newBank, setNewBank] = useState({
    bankName: '',
    emailManager: '',
    bankAddress: '',
    accountNumber: '',
    instructions: '',
    logo: null,
    loginRequired: false
  });

  const handleInputChange = (field, value) => {
    setNewBank(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewBank(prev => ({
        ...prev,
        logo: file
      }));
    }
  };

  const handleAddBank = () => {
    if (!newBank.bankName || !newBank.accountNumber) {
      alert('Please fill required fields');
      return;
    }

    const bank = {
      id: Date.now(),
      ...newBank,
      logoUrl: newBank.logo ? URL.createObjectURL(newBank.logo) : null
    };

    setBanks(prev => [...prev, bank]);
    setNewBank({
      bankName: '',
      emailManager: '',
      bankAddress: '',
      accountNumber: '',
      instructions: '',
      logo: null,
      loginRequired: false
    });
    setShowAddBank(false);
  };

  const handleDeleteBank = (id) => {
    setBanks(prev => prev.filter(bank => bank.id !== id));
  };

  const filteredBanks = banks.filter(bank =>
    bank.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bank.accountNumber.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredBanks.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedBanks = filteredBanks.slice(startIndex, startIndex + entriesPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/40 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-6 md:p-8">
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
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
              <Landmark className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">Bank Settings</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage your bank accounts and fee challan details</p>
            </div>
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
          {/* Add Bank Section */}
          {showAddBank ? (
            <div className="p-8 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-indigo-50/30 dark:from-gray-900 dark:to-gray-800">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                    <Landmark className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  Add New Bank
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
                      {newBank.logo && (
                        <p className="mt-2 text-sm text-gray-600">
                          Selected: {newBank.logo.name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Login Required */}
                  <div>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={newBank.loginRequired}
                        onChange={(e) => handleInputChange('loginRequired', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Login Required</span>
                    </label>
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
                      value={newBank.bankName}
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
                      value={newBank.emailManager}
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
                      value={newBank.bankAddress}
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
                      value={newBank.accountNumber}
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
                      value={newBank.instructions}
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
                  onClick={() => setShowAddBank(false)}
                  className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 font-semibold hover:scale-105 active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddBank}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95"
                >
                  <Save className="w-5 h-5" />
                  <span>Add Bank</span>
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
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                />
              </div>
            </div>

            {/* Table */}
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
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-900 dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedBanks.length > 0 ? (
                    paginatedBanks.map((bank) => (
                      <tr key={bank.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                              <Landmark className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <span className="font-semibold text-gray-900 dark:text-white">{bank.bankName}</span>
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
                          <div className="flex items-center justify-center gap-2">
                            <button className="p-2 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-all hover:scale-110">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteBank(bank.id)}
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
                      <td colSpan="4" className="px-6 py-16 text-center">
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

            {/* Table Footer */}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountInvoice;