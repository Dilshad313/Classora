import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Eye, 
  EyeOff, 
  Edit3, 
  Save, 
  X, 
  Upload, 
  Trash2,
  User,
  Mail,
  Lock,
  DollarSign,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Home,
  ChevronRight,
  UserCog,
  Shield,
  Bell
} from 'lucide-react';

export const AccountSettings = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('account');
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [accountData, setAccountData] = useState({
    username: 'dishod200678@gmail.com',
    password: '********',
    name: 'Dishoad',
    currency: 'Dollars (USD)',
    subscription: 'FREE',
    expiry: 'None',
    newPassword: '',
    confirmPassword: ''
  });

  const [tempData, setTempData] = useState({});
  const [errors, setErrors] = useState({});

  const handleEdit = () => {
    setTempData(accountData);
    setIsEditing(true);
  };

  const handleSave = () => {
    const newErrors = {};

    // Password validation
    if (tempData.newPassword && tempData.newPassword !== tempData.confirmPassword) {
      newErrors.password = "Passwords don't match";
    }

    if (tempData.newPassword && tempData.newPassword.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Update account data
    const updatedData = {
      ...accountData,
      ...tempData,
      password: tempData.newPassword ? '••••••••' : accountData.password
    };

    setAccountData(updatedData);
    setIsEditing(false);
    setTempData({});
    setErrors({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempData({});
    setErrors({});
  };

  const handleInputChange = (field, value) => {
    setTempData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleDeleteAccount = () => {
    // Add actual delete logic here
    console.log('Account deletion requested');
    setIsDeleting(false);
    alert('Account deletion process initiated');
  };

  const getSubscriptionColor = (subscription) => {
    switch (subscription) {
      case 'FREE':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'PREMIUM':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'PRO':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

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
          <span className="text-gray-900 dark:text-white font-semibold">Account Settings</span>
        </div>

        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
              <UserCog className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                Account Settings
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your account preferences and security settings
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-4">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveSection('account')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all font-semibold ${
                    activeSection === 'account'
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span>Account</span>
                </button>
                <button
                  onClick={() => setActiveSection('uploads')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all font-semibold ${
                    activeSection === 'uploads'
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Upload className="w-5 h-5" />
                  <span>Uploads</span>
                </button>
                <button
                  onClick={() => setActiveSection('billing')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all font-semibold ${
                    activeSection === 'billing'
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <DollarSign className="w-5 h-5" />
                  <span>Billing</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Account Section */}
            {activeSection === 'account' && (
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
                {/* Profile Header */}
                <div className="p-8 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-3xl font-bold">
                        {accountData.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{accountData.name}</h2>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">{accountData.username}</p>
                    </div>
                  </div>
                </div>

                {/* Account Details */}
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                        <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      Account Details
                    </h3>
                    {!isEditing ? (
                      <button
                        onClick={handleEdit}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105"
                      >
                        <Edit3 className="w-5 h-5" />
                        <span>Edit</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleCancel}
                          className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all font-semibold hover:scale-105"
                        >
                          <X className="w-5 h-5" />
                          <span>Cancel</span>
                        </button>
                        <button
                          onClick={handleSave}
                          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105"
                        >
                          <Save className="w-5 h-5" />
                          <span>Save</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    {/* Username */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                        <Mail className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        <span>Username:</span>
                      </label>
                      <div className="md:col-span-2">
                        {isEditing ? (
                          <input
                            type="email"
                            value={tempData.username || accountData.username}
                            onChange={(e) => handleInputChange('username', e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-900/50 dark:text-white transition-all"
                          />
                        ) : (
                          <span className="text-gray-900 dark:text-white font-medium">{accountData.username}</span>
                        )}
                      </div>
                    </div>

                    {/* Password */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                        <Lock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        <span>Password:</span>
                      </label>
                      <div className="md:col-span-2">
                        {isEditing ? (
                          <div className="space-y-4">
                            <div className="relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                value={tempData.newPassword || ''}
                                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                                placeholder="New password"
                                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-900/50 dark:text-white transition-all pr-12"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                            <div className="relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                value={tempData.confirmPassword || ''}
                                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                placeholder="Confirm new password"
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10 ${
                                  errors.password ? 'border-red-500' : 'border-gray-300'
                                }`}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                            {errors.password && (
                              <p className="text-red-600 text-sm flex items-center space-x-1">
                                <AlertTriangle className="w-4 h-4" />
                                <span>{errors.password}</span>
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-900">{accountData.password}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Name */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                        <User className="w-4 h-4" />
                        <span>Name:</span>
                      </label>
                      <div className="md:col-span-2">
                        {isEditing ? (
                          <input
                            type="text"
                            value={tempData.name || accountData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : (
                          <span className="text-gray-900">{accountData.name}</span>
                        )}
                      </div>
                    </div>

                    {/* Currency */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                        <DollarSign className="w-4 h-4" />
                        <span>Currency:</span>
                      </label>
                      <div className="md:col-span-2">
                        {isEditing ? (
                          <select
                            value={tempData.currency || accountData.currency}
                            onChange={(e) => handleInputChange('currency', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="Dollars (USD)">Dollars (USD)</option>
                            <option value="Euros (EUR)">Euros (EUR)</option>
                            <option value="Pounds (GBP)">Pounds (GBP)</option>
                            <option value="Yen (JPY)">Yen (JPY)</option>
                          </select>
                        ) : (
                          <span className="text-gray-900">{accountData.currency}</span>
                        )}
                      </div>
                    </div>

                    {/* Subscription */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                        <CheckCircle className="w-4 h-4" />
                        <span>Subscription:</span>
                      </label>
                      <div className="md:col-span-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getSubscriptionColor(accountData.subscription)}`}>
                          {accountData.subscription}
                        </span>
                      </div>
                    </div>

                    {/* Expiry */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                        <Calendar className="w-4 h-4" />
                        <span>Expiry:</span>
                      </label>
                      <div className="md:col-span-2">
                        <span className="text-gray-900">{accountData.expiry}</span>
                      </div>
                    </div>
                  </div>

                  {/* Delete Account Section */}
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">Delete Account</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Permanently delete your account and all associated data
                        </p>
                      </div>
                      <button
                        onClick={() => setIsDeleting(true)}
                        className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center space-x-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete Account</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Uploads Section */}
            {activeSection === 'uploads' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Uploads Settings</h2>
                <div className="text-center py-12">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Upload settings will be available soon</p>
                </div>
              </div>
            )}

            {/* Billing Section */}
            {activeSection === 'billing' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Billing Settings</h2>
                <div className="text-center py-12">
                  <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Billing settings will be available soon</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {isDeleting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Account</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete your account? All your data will be permanently removed.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsDeleting(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Account</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountSettings;