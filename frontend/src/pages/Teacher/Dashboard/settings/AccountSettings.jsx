import { User, Mail, Phone, Lock, Save } from 'lucide-react';

const AccountSettings = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Account Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account information and preferences</p>
      </div>

      <div className="card">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Profile Information</h3>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
            {user.name?.charAt(0) || 'T'}
          </div>
          <button className="btn-secondary">Change Photo</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Full Name
            </label>
            <input type="text" defaultValue={user.name} className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email
            </label>
            <input type="email" defaultValue={user.email} className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Phone className="w-4 h-4 inline mr-2" />
              Phone Number
            </label>
            <input type="tel" placeholder="+1 234 567 8900" className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Employee ID
            </label>
            <input type="text" placeholder="EMP001" className="input" disabled />
          </div>
        </div>
        <button className="btn-primary mt-4 flex items-center gap-2">
          <Save className="w-5 h-5" />
          Save Changes
        </button>
      </div>

      <div className="card">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Change Password</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Lock className="w-4 h-4 inline mr-2" />
              Current Password
            </label>
            <input type="password" className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Lock className="w-4 h-4 inline mr-2" />
              New Password
            </label>
            <input type="password" className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Lock className="w-4 h-4 inline mr-2" />
              Confirm New Password
            </label>
            <input type="password" className="input" />
          </div>
        </div>
        <button className="btn-primary mt-4">Update Password</button>
      </div>

      <div className="card">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Notification Preferences</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 text-primary-600 rounded" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Email notifications for new messages</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 text-primary-600 rounded" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Email notifications for homework submissions</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 text-primary-600 rounded" />
            <span className="text-sm text-gray-700 dark:text-gray-300">SMS notifications</span>
          </label>
        </div>
        <button className="btn-primary mt-4">Save Preferences</button>
      </div>
    </div>
  );
};

export default AccountSettings;
