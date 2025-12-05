import { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, Lock, Save, Eye, EyeOff, CheckCircle, 
  XCircle, AlertCircle, Edit3, Camera, Shield, Key, Settings
} from 'lucide-react';

const AccountSettings = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    username: user.username || user.email?.split('@')[0] || '',
    email: user.email || '',
    fullName: user.name || '',
    phone: user.phone || '',
    employeeId: user.employeeId || 'TCH001'
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [notificationPreferences, setNotificationPreferences] = useState({
    emailMessages: true,
    emailHomework: true,
    emailReports: false,
    securityAlerts: true,
    smsNotifications: false
  });

  // Initialize form data when user changes
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    setFormData({
      username: userData.username || userData.email?.split('@')[0] || '',
      email: userData.email || '',
      fullName: userData.name || '',
      phone: userData.phone || '',
      employeeId: userData.employeeId || 'TCH001'
    });
  }, []);

  // Load notification preferences from localStorage
  useEffect(() => {
    const savedPreferences = localStorage.getItem('notificationPreferences');
    if (savedPreferences) {
      setNotificationPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  // Validation functions
  const validateUsername = (username) => {
    if (!username) return 'Username is required';
    if (username.length < 3) return 'Username must be at least 3 characters';
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Username can only contain letters, numbers, and underscores';
    return '';
  };

  const validateEmail = (email) => {
    if (!email) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    return '';
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 10;
    return Math.min(strength, 100);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'newPassword') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    newErrors.username = validateUsername(formData.username);
    newErrors.email = validateEmail(formData.email);
    newErrors.phone = validatePhone(formData.phone);
    
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    
    // Remove empty error messages
    Object.keys(newErrors).forEach(key => {
      if (!newErrors[key]) delete newErrors[key];
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    
    if (!passwordData.currentPassword) newErrors.currentPassword = 'Current password is required';
    newErrors.newPassword = validatePassword(passwordData.newPassword);
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update user data
      const updatedUser = { ...user, ...formData, name: formData.fullName };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setIsEditing(false);
      showNotification('Profile updated successfully!');
    } catch (error) {
      showNotification('Failed to update profile. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!validatePasswordForm()) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset password form
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordStrength(0);
      
      showNotification('Password updated successfully!');
    } catch (error) {
      showNotification('Failed to update password. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 30) return 'bg-red-500';
    if (passwordStrength < 60) return 'bg-yellow-500';
    if (passwordStrength < 80) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 30) return 'Weak';
    if (passwordStrength < 60) return 'Fair';
    if (passwordStrength < 80) return 'Good';
    return 'Strong';
  };

  const handleNotificationChange = (key, value) => {
    setNotificationPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveNotifications = () => {
    localStorage.setItem('notificationPreferences', JSON.stringify(notificationPreferences));
    showNotification('Notification preferences saved successfully!');
  };

  const handlePhotoUpload = () => {
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // In a real app, you would upload to a server
        // For now, we'll just show a success message
        showNotification('Profile photo updated successfully!');
      }
    };
    input.click();
  };

  const validatePhone = (phone) => {
    if (phone && !/^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/[\s\-\(\)]/g, ''))) {
      return 'Please enter a valid phone number';
    }
    return '';
  };

  const checkUsernameAvailability = async (username) => {
    // Simulate API call to check username availability
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock check - in real app, this would be an API call
    const unavailableUsernames = ['admin', 'teacher', 'student', 'test'];
    return !unavailableUsernames.includes(username.toLowerCase());
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Account Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account information and preferences</p>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg animate-slideIn ${
          notification.type === 'success' 
            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800' 
            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
        }`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Profile Information Card */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <User className="w-6 h-6" />
            Profile Information
          </h3>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="btn-secondary flex items-center gap-2"
          >
            <Edit3 className="w-4 h-4" />
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {/* Profile Photo Section */}
        <div className="flex items-center gap-6 mb-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-lg">
              {formData.fullName?.charAt(0) || user.name?.charAt(0) || 'T'}
            </div>
            <button 
              onClick={handlePhotoUpload}
              className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-600 hover:bg-primary-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
              title="Change profile photo"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {formData.fullName || user.name || 'Teacher'}
            </h4>
            <p className="text-gray-600 dark:text-gray-400">@{formData.username}</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">Employee ID: {formData.employeeId}</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Username Field */}
          <div>
            <label className="label flex items-center gap-2">
              <User className="w-4 h-4" />
              Username *
            </label>
            <input 
              type="text" 
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              disabled={!isEditing}
              className={`input-field ${errors.username ? 'border-red-500 focus:ring-red-500' : ''} ${!isEditing ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
              placeholder="Enter username"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.username}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="label flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address *
            </label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={!isEditing}
              className={`input-field ${errors.email ? 'border-red-500 focus:ring-red-500' : ''} ${!isEditing ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Full Name Field */}
          <div>
            <label className="label flex items-center gap-2">
              <User className="w-4 h-4" />
              Full Name *
            </label>
            <input 
              type="text" 
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              disabled={!isEditing}
              className={`input-field ${errors.fullName ? 'border-red-500 focus:ring-red-500' : ''} ${!isEditing ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
              placeholder="Enter full name"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label className="label flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone Number
            </label>
            <input 
              type="tel" 
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              disabled={!isEditing}
              className={`input-field ${errors.phone ? 'border-red-500 focus:ring-red-500' : ''} ${!isEditing ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
              placeholder="+1 234 567 8900"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.phone}
              </p>
            )}
          </div>

          {/* Employee ID Field */}
          <div className="md:col-span-2">
            <label className="label flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Employee ID
            </label>
            <input 
              type="text" 
              value={formData.employeeId}
              disabled
              className="input-field bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Employee ID cannot be changed. Contact administrator if needed.
            </p>
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button 
              onClick={handleSaveProfile}
              disabled={isLoading}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
            <button 
              onClick={() => {
                setIsEditing(false);
                setErrors({});
                // Reset form data
                setFormData({
                  username: user.username || user.email?.split('@')[0] || '',
                  email: user.email || '',
                  fullName: user.name || '',
                  phone: user.phone || '',
                  employeeId: user.employeeId || 'TCH001'
                });
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Password Management Card */}
      <div className="card">
        <div className="flex items-center gap-2 mb-6">
          <Key className="w-6 h-6 text-gray-800 dark:text-gray-100" />
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Password & Security</h3>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-800 dark:text-blue-300">Security Guidelines</h4>
              <ul className="text-sm text-blue-700 dark:text-blue-400 mt-2 space-y-1">
                <li>• Use at least 8 characters with a mix of letters, numbers, and symbols</li>
                <li>• Avoid using personal information or common words</li>
                <li>• Change your password regularly for better security</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Current Password */}
          <div>
            <label className="label flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Current Password *
            </label>
            <div className="relative">
              <input 
                type={showCurrentPassword ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                className={`input-field pr-12 ${errors.currentPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Enter your current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.currentPassword}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="label flex items-center gap-2">
              <Lock className="w-4 h-4" />
              New Password *
            </label>
            <div className="relative">
              <input 
                type={showNewPassword ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                className={`input-field pr-12 ${errors.newPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Enter your new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            {passwordData.newPassword && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Password Strength:</span>
                  <span className={`text-sm font-medium ${
                    passwordStrength < 30 ? 'text-red-600' :
                    passwordStrength < 60 ? 'text-yellow-600' :
                    passwordStrength < 80 ? 'text-blue-600' : 'text-green-600'
                  }`}>
                    {getPasswordStrengthText()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                    style={{ width: `${passwordStrength}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.newPassword}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="label flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Confirm New Password *
            </label>
            <div className="relative">
              <input 
                type={showConfirmPassword ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                className={`input-field pr-12 ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Confirm your new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.confirmPassword}
              </p>
            )}
            
            {/* Password Match Indicator */}
            {passwordData.confirmPassword && passwordData.newPassword && (
              <div className="mt-2">
                {passwordData.newPassword === passwordData.confirmPassword ? (
                  <p className="text-green-600 dark:text-green-400 text-sm flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Passwords match
                  </p>
                ) : (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <XCircle className="w-4 h-4" />
                    Passwords do not match
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Update Password Button */}
        <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button 
            onClick={handleChangePassword}
            disabled={isLoading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Key className="w-4 h-4" />
            {isLoading ? 'Updating...' : 'Update Password'}
          </button>
          <button 
            onClick={() => {
              setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
              setPasswordStrength(0);
              setErrors({});
            }}
            className="btn-secondary"
          >
            Clear Form
          </button>
        </div>
      </div>

      {/* Notification Preferences Card */}
      <div className="card">
        <div className="flex items-center gap-2 mb-6">
          <Settings className="w-6 h-6 text-gray-800 dark:text-gray-100" />
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Notification Preferences</h3>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">Email Notifications</h4>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={notificationPreferences.emailMessages}
                  onChange={(e) => handleNotificationChange('emailMessages', e.target.checked)}
                  className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" 
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                  New messages and announcements
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={notificationPreferences.emailHomework}
                  onChange={(e) => handleNotificationChange('emailHomework', e.target.checked)}
                  className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" 
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                  Homework submissions and updates
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={notificationPreferences.emailReports}
                  onChange={(e) => handleNotificationChange('emailReports', e.target.checked)}
                  className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" 
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                  Weekly performance reports
                </span>
              </label>
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">System Notifications</h4>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={notificationPreferences.securityAlerts}
                  onChange={(e) => handleNotificationChange('securityAlerts', e.target.checked)}
                  className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" 
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                  Security alerts and login notifications
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={notificationPreferences.smsNotifications}
                  onChange={(e) => handleNotificationChange('smsNotifications', e.target.checked)}
                  disabled={!formData.phone}
                  className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed" 
                />
                <span className={`text-sm group-hover:text-gray-900 dark:group-hover:text-gray-100 ${!formData.phone ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                  SMS notifications {!formData.phone && '(requires phone number)'}
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button 
            onClick={handleSaveNotifications}
            className="btn-primary flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Preferences
          </button>
        </div>
      </div>

      {/* Account Summary Card */}
      <div className="card bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-2 border-primary-200 dark:border-primary-800">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
            <Shield className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Account Security Status</h3>
            <p className="text-gray-600 dark:text-gray-400">Your account is secure and up to date</p>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Email Verified</span>
              </div>
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Strong Password</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
