import React, { useState, useEffect } from 'react';
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
  Bell,
  Loader,
  FileText,
  Image,
  Video,
  Music,
  Folder,
  Download,
  CreditCard,
  Building,
  MapPin,
  Phone,
  Globe
} from 'lucide-react';
import { 
  getAccountSettings,
  updateAccountSettings,
  changePassword,
  deleteAccount
} from '../../../../services/accountSettingsApi';
import { 
  getAllUploads, 
  uploadFile, 
  deleteUpload, 
  getStorageStats 
} from '../../../../services/uploadApi';
import { 
  getBilling, 
  updateBilling, 
  updateSubscription, 
  cancelSubscription, 
  getInvoices 
} from '../../../../services/billingApi';

export const AccountSettings = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('account');
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  // Account data states
  const [accountData, setAccountData] = useState(null);
  const [tempData, setTempData] = useState({});
  const [errors, setErrors] = useState({});

  // Uploads states
  const [uploads, setUploads] = useState([]);
  const [storageStats, setStorageStats] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadCategory, setUploadCategory] = useState('all');

  // Billing states
  const [billingData, setBillingData] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [updatingSubscription, setUpdatingSubscription] = useState(false);

  // Show notification
  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 5000);
  };

  // Fetch all account data
  const fetchAccountData = async () => {
    try {
      setLoading(true);
      const data = await getAccountSettings();
      setAccountData(data);
      
      // Fetch uploads and storage stats
      const uploadsData = await getAllUploads();
      setUploads(uploadsData);
      
      const stats = await getStorageStats();
      setStorageStats(stats);
      
      // Fetch billing data
      const billing = await getBilling();
      setBillingData(billing);
      
      const invoicesData = await getInvoices();
      setInvoices(invoicesData);
      
    } catch (error) {
      console.error('Error fetching account data:', error);
      showNotification('error', `Failed to load data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchAccountData();
  }, []);

  // Handle edit
  const handleEdit = () => {
    if (!accountData) return;
    
    setTempData({
      fullName: accountData.user?.fullName || '',
      email: accountData.user?.email || '',
      currency: accountData.billing?.currency || 'USD'
    });
    setIsEditing(true);
  };

  // Handle save account settings
  const handleSave = async () => {
    const newErrors = {};

    // Validation
    if (!tempData.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!tempData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(tempData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setSubmitting(true);
      const updatedData = await updateAccountSettings({
        fullName: tempData.fullName,
        email: tempData.email,
        currency: tempData.currency
      });

      setAccountData(updatedData);
      setIsEditing(false);
      setTempData({});
      setErrors({});
      showNotification('success', 'Account settings updated successfully');
    } catch (error) {
      console.error('Error updating account:', error);
      showNotification('error', `Failed to update: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle cancel edit
  const handleCancel = () => {
    setIsEditing(false);
    setTempData({});
    setErrors({});
  };

  // Handle input change
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

  // Handle password change
  const handlePasswordChange = async (passwordData) => {
    try {
      setSubmitting(true);
      await changePassword(passwordData);
      showNotification('success', 'Password changed successfully');
    } catch (error) {
      console.error('Error changing password:', error);
      showNotification('error', `Failed to change password: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      await uploadFile(file, { category: 'profile' });
      showNotification('success', 'File uploaded successfully');
      // Refresh uploads and stats
      const uploadsData = await getAllUploads();
      setUploads(uploadsData);
      const stats = await getStorageStats();
      setStorageStats(stats);
    } catch (error) {
      console.error('Error uploading file:', error);
      showNotification('error', `Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
      event.target.value = ''; // Reset file input
    }
  };

  // Handle delete upload
  const handleDeleteUpload = async (uploadId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;

    try {
      await deleteUpload(uploadId);
      showNotification('success', 'File deleted successfully');
      // Refresh uploads and stats
      const uploadsData = await getAllUploads();
      setUploads(uploadsData);
      const stats = await getStorageStats();
      setStorageStats(stats);
    } catch (error) {
      console.error('Error deleting file:', error);
      showNotification('error', `Delete failed: ${error.message}`);
    }
  };

  // Handle subscription update
  const handleSubscriptionUpdate = async (plan) => {
    try {
      setUpdatingSubscription(true);
      const updatedBilling = await updateSubscription({ plan, duration: 12 });
      setBillingData(updatedBilling);
      showNotification('success', `Subscription updated to ${plan}`);
    } catch (error) {
      console.error('Error updating subscription:', error);
      showNotification('error', `Subscription update failed: ${error.message}`);
    } finally {
      setUpdatingSubscription(false);
    }
  };

  // Handle delete account
  const handleDeleteAccount = async (password) => {
    try {
      setSubmitting(true);
      await deleteAccount(password);
      showNotification('success', 'Account deleted successfully');
      // Redirect to login or home page
      navigate('/login');
    } catch (error) {
      console.error('Error deleting account:', error);
      showNotification('error', `Account deletion failed: ${error.message}`);
    } finally {
      setSubmitting(false);
      setIsDeleting(false);
    }
  };

  // Get file type icon
  const getFileTypeIcon = (fileType) => {
    switch (fileType) {
      case 'image': return <Image className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'audio': return <Music className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  // Get subscription color
  const getSubscriptionColor = (subscription) => {
    switch (subscription) {
      case 'FREE':
        return 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
      case 'BASIC':
        return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
      case 'PREMIUM':
        return 'text-purple-600 bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800';
      case 'ENTERPRISE':
        return 'text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800';
    }
  };

  // Filter uploads by category
  const filteredUploads = uploadCategory === 'all' 
    ? uploads 
    : uploads.filter(upload => upload.category === uploadCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/40 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading account settings...</p>
        </div>
      </div>
    );
  }

  if (!accountData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/40 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Failed to load account data</p>
        </div>
      </div>
    );
  }

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
                  {storageStats && (
                    <span className="ml-auto text-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 px-2 py-1 rounded-full">
                      {storageStats.fileCount}
                    </span>
                  )}
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
              <AccountSection 
                accountData={accountData}
                isEditing={isEditing}
                tempData={tempData}
                errors={errors}
                submitting={submitting}
                showPassword={showPassword}
                onEdit={handleEdit}
                onSave={handleSave}
                onCancel={handleCancel}
                onInputChange={handleInputChange}
                onPasswordChange={handlePasswordChange}
                onShowPasswordChange={setShowPassword}
                onDeleteAccount={setIsDeleting}
                getSubscriptionColor={getSubscriptionColor}
              />
            )}

            {/* Uploads Section */}
            {activeSection === 'uploads' && (
              <UploadsSection
                uploads={filteredUploads}
                storageStats={storageStats}
                uploading={uploading}
                uploadCategory={uploadCategory}
                onFileUpload={handleFileUpload}
                onDeleteUpload={handleDeleteUpload}
                onCategoryChange={setUploadCategory}
                getFileTypeIcon={getFileTypeIcon}
              />
            )}

            {/* Billing Section */}
            {activeSection === 'billing' && (
              <BillingSection
                billingData={billingData}
                invoices={invoices}
                updatingSubscription={updatingSubscription}
                onSubscriptionUpdate={handleSubscriptionUpdate}
                getSubscriptionColor={getSubscriptionColor}
              />
            )}
          </div>
        </div>

        {/* Delete Account Modal */}
        {isDeleting && (
          <DeleteAccountModal
            onClose={() => setIsDeleting(false)}
            onDelete={handleDeleteAccount}
            submitting={submitting}
          />
        )}
      </div>
    </div>
  );
};

// Account Section Component
const AccountSection = ({
  accountData,
  isEditing,
  tempData,
  errors,
  submitting,
  showPassword,
  onEdit,
  onSave,
  onCancel,
  onInputChange,
  onPasswordChange,
  onShowPasswordChange,
  onDeleteAccount,
  getSubscriptionColor
}) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setPasswordErrors(newErrors);
      return;
    }

    onPasswordChange(passwordData);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordErrors({});
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
      {/* Profile Header */}
      <div className="p-8 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white text-3xl font-bold">
              {accountData.user?.fullName?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {accountData.user?.fullName || 'User'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {accountData.user?.email || 'No email'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Member since {new Date(accountData.user?.createdAt).toLocaleDateString()}
            </p>
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
              onClick={onEdit}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Edit3 className="w-5 h-5" />
              <span>Edit</span>
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={onCancel}
                className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all font-semibold hover:scale-105"
              >
                <X className="w-5 h-5" />
                <span>Cancel</span>
              </button>
              <button
                onClick={onSave}
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50"
              >
                {submitting ? <Loader className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                <span>Save</span>
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Full Name */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
              <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Full Name:</span>
            </label>
            <div className="md:col-span-2">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={tempData.fullName || accountData.user?.fullName || ''}
                    onChange={(e) => onInputChange('fullName', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-900/50 dark:text-white transition-all"
                  />
                  {errors.fullName && (
                    <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>
                  )}
                </>
              ) : (
                <span className="text-gray-900 dark:text-white font-medium">
                  {accountData.user?.fullName || 'Not set'}
                </span>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
              <Mail className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Email:</span>
            </label>
            <div className="md:col-span-2">
              {isEditing ? (
                <>
                  <input
                    type="email"
                    value={tempData.email || accountData.user?.email || ''}
                    onChange={(e) => onInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-900/50 dark:text-white transition-all"
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                  )}
                </>
              ) : (
                <span className="text-gray-900 dark:text-white font-medium">
                  {accountData.user?.email || 'Not set'}
                </span>
              )}
            </div>
          </div>

          {/* Currency */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
              <DollarSign className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Currency:</span>
            </label>
            <div className="md:col-span-2">
              {isEditing ? (
                <select
                  value={tempData.currency || accountData.billing?.currency || 'USD'}
                  onChange={(e) => onInputChange('currency', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-900/50 dark:text-white transition-all"
                >
                  <option value="USD">US Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="GBP">British Pound (GBP)</option>
                  <option value="JPY">Japanese Yen (JPY)</option>
                  <option value="INR">Indian Rupee (INR)</option>
                </select>
              ) : (
                <span className="text-gray-900 dark:text-white font-medium">
                  {accountData.billing?.currency || 'USD'}
                </span>
              )}
            </div>
          </div>

          {/* Subscription */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
              <CheckCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Subscription:</span>
            </label>
            <div className="md:col-span-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getSubscriptionColor(accountData.billing?.subscription?.plan)}`}>
                {accountData.billing?.subscription?.plan || 'FREE'}
              </span>
              {accountData.billing?.subscription?.expiryDate && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Expires: {new Date(accountData.billing.subscription.expiryDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Change Password Section */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <Lock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Change Password
          </h4>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-900/50 dark:text-white transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => onShowPasswordChange(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordErrors.currentPassword && (
                <p className="text-red-600 text-sm mt-1">{passwordErrors.currentPassword}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-900/50 dark:text-white transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => onShowPasswordChange(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordErrors.newPassword && (
                <p className="text-red-600 text-sm mt-1">{passwordErrors.newPassword}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-900/50 dark:text-white transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => onShowPasswordChange(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordErrors.confirmPassword && (
                <p className="text-red-600 text-sm mt-1">{passwordErrors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50"
            >
              {submitting ? <Loader className="w-5 h-5 animate-spin" /> : 'Change Password'}
            </button>
          </form>
        </div>

        {/* Delete Account Section */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">Delete Account</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Permanently delete your account and all associated data
              </p>
            </div>
            <button
              onClick={() => onDeleteAccount(true)}
              className="px-6 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors flex items-center space-x-2 border border-red-200 dark:border-red-800"
            >
              <Trash2 className="w-5 h-5" />
              <span>Delete Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Uploads Section Component
const UploadsSection = ({
  uploads,
  storageStats,
  uploading,
  uploadCategory,
  onFileUpload,
  onDeleteUpload,
  onCategoryChange,
  getFileTypeIcon
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
      <div className="p-8 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <Upload className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            File Uploads
          </h3>
          
          {/* Storage Stats */}
          {storageStats && (
            <div className="flex items-center gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {storageStats.fileCount}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Files</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {storageStats.totalSizeMB} MB
                </div>
                <div className="text-gray-600 dark:text-gray-400">Used</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-8">
        {/* Upload Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="file"
              onChange={onFileUpload}
              disabled={uploading}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer disabled:opacity-50 w-full sm:w-auto justify-center"
            >
              {uploading ? <Loader className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
              <span>{uploading ? 'Uploading...' : 'Upload File'}</span>
            </label>
          </div>
          
          <select
            value={uploadCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-900/50 dark:text-white"
          >
            <option value="all">All Categories</option>
            <option value="profile">Profile</option>
            <option value="document">Documents</option>
            <option value="media">Media</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Uploads List */}
        {uploads.length > 0 ? (
          <div className="space-y-4">
            {uploads.map((upload) => (
              <div key={upload._id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    {getFileTypeIcon(upload.fileType)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {upload.fileName}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {(upload.fileSize / (1024 * 1024)).toFixed(2)} MB • {upload.category}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.open(upload.fileUrl, '_blank')}
                    className="p-2 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteUpload(upload._id)}
                    className="p-2 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No files uploaded yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Billing Section Component
const BillingSection = ({
  billingData,
  invoices,
  updatingSubscription,
  onSubscriptionUpdate,
  getSubscriptionColor
}) => {
  const plans = [
    { name: 'FREE', price: 0, features: ['Basic features', '1GB storage', 'Community support'] },
    { name: 'BASIC', price: 9.99, features: ['All free features', '10GB storage', 'Email support', 'Basic analytics'] },
    { name: 'PREMIUM', price: 29.99, features: ['All basic features', '100GB storage', 'Priority support', 'Advanced analytics', 'Custom branding'] },
    { name: 'ENTERPRISE', price: 99.99, features: ['All premium features', 'Unlimited storage', '24/7 phone support', 'Custom integrations', 'Dedicated account manager'] }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
      <div className="p-8 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
            <DollarSign className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          Billing & Subscription
        </h3>
      </div>

      <div className="p-8">
        {/* Current Subscription */}
        {billingData && (
          <div className="mb-8">
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Current Plan</h4>
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-xl border border-indigo-200 dark:border-indigo-800">
              <div className="flex items-center justify-between">
                <div>
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-bold border ${getSubscriptionColor(billingData.subscription?.plan)}`}>
                    {billingData.subscription?.plan} PLAN
                  </span>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Status: <span className="font-medium capitalize">{billingData.subscription?.status}</span>
                  </p>
                  {billingData.subscription?.expiryDate && (
                    <p className="text-gray-600 dark:text-gray-400">
                      Expires: {new Date(billingData.subscription.expiryDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    ${plans.find(p => p.name === billingData.subscription?.plan)?.price || 0}
                    <span className="text-lg text-gray-600 dark:text-gray-400">/month</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subscription Plans */}
        <div className="mb-8">
          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Available Plans</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div key={plan.name} className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors">
                <div className="text-center mb-4">
                  <h5 className="text-lg font-bold text-gray-900 dark:text-white">{plan.name}</h5>
                  <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">
                    ${plan.price}
                    <span className="text-sm text-gray-600 dark:text-gray-400">/month</span>
                  </div>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => onSubscriptionUpdate(plan.name)}
                  disabled={updatingSubscription || billingData?.subscription?.plan === plan.name}
                  className={`w-full py-2 rounded-lg font-semibold transition-all ${
                    billingData?.subscription?.plan === plan.name
                      ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-105'
                  }`}
                >
                  {updatingSubscription ? (
                    <Loader className="w-4 h-4 animate-spin mx-auto" />
                  ) : billingData?.subscription?.plan === plan.name ? (
                    'Current Plan'
                  ) : (
                    'Upgrade'
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Invoices */}
        <div>
          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Invoices</h4>
          {invoices.length > 0 ? (
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <div key={invoice.invoiceNumber} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      Invoice #{invoice.invoiceNumber}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(invoice.date).toLocaleDateString()} • {invoice.currency} {invoice.amount}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      invoice.status === 'paid' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                    }`}>
                      {invoice.status}
                    </span>
                    {invoice.pdfUrl && (
                      <button
                        onClick={() => window.open(invoice.pdfUrl, '_blank')}
                        className="p-2 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No invoices found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Delete Account Modal Component
const DeleteAccountModal = ({ onClose, onDelete, submitting }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password) return;
    onDelete(password);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Account</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">This action cannot be undone</p>
          </div>
        </div>
        
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Are you sure you want to delete your account? All your data will be permanently removed.
          Please enter your password to confirm.
        </p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-900/50 dark:text-white mb-4"
            required
          />
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !password}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              {submitting ? <Loader className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              <span>Delete Account</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountSettings;