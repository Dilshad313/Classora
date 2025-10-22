import { useState } from 'react';
import { Save, Upload, Building2, Mail, Phone, MapPin, Globe, Calendar } from 'lucide-react';

const GeneralSettings = () => {
  const [settings, setSettings] = useState({
    schoolName: 'Future Leaders Academy',
    address: '123 Education Street, Knowledge City',
    phone: '+1 (555) 123-4567',
    email: 'info@futureleaders.edu',
    website: 'www.futureleaders.edu',
    timezone: 'America/New_York',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    academicYear: '2024-2025',
    sessionStart: '2024-04-01',
    sessionEnd: '2025-03-31',
  });

  const [logo, setLogo] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">General Settings</h1>
          <p className="text-gray-600 mt-1">Configure your school's basic information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* School Information */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary-600" />
            School Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="label">School Name</label>
              <input
                type="text"
                name="schoolName"
                value={settings.schoolName}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="label">Academic Year</label>
              <input
                type="text"
                name="academicYear"
                value={settings.academicYear}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">Address</label>
              <textarea
                name="address"
                value={settings.address}
                onChange={handleChange}
                className="input-field"
                rows="3"
                required
              />
            </div>

            <div>
              <label className="label">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={settings.phone}
                  onChange={handleChange}
                  className="input-field pl-11"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={settings.email}
                  onChange={handleChange}
                  className="input-field pl-11"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Website</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="website"
                  value={settings.website}
                  onChange={handleChange}
                  className="input-field pl-11"
                />
              </div>
            </div>

            <div>
              <label className="label">School Logo</label>
              <div className="flex items-center gap-4">
                {logo && (
                  <img src={logo} alt="School Logo" className="w-16 h-16 rounded-lg object-cover border-2 border-gray-200" />
                )}
                <label className="btn-secondary cursor-pointer flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Logo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-2">Recommended: PNG or JPG, max 2MB</p>
            </div>
          </div>
        </div>

        {/* System Configuration */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">System Configuration</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="label">Timezone</label>
              <select
                name="timezone"
                value={settings.timezone}
                onChange={handleChange}
                className="input-field"
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Asia/Kolkata">India Standard Time (IST)</option>
              </select>
            </div>

            <div>
              <label className="label">Currency</label>
              <select
                name="currency"
                value={settings.currency}
                onChange={handleChange}
                className="input-field"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="INR">INR - Indian Rupee</option>
              </select>
            </div>

            <div>
              <label className="label">Date Format</label>
              <select
                name="dateFormat"
                value={settings.dateFormat}
                onChange={handleChange}
                className="input-field"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Academic Session */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-600" />
            Academic Session
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="label">Session Start Date</label>
              <input
                type="date"
                name="sessionStart"
                value={settings.sessionStart}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="label">Session End Date</label>
              <input
                type="date"
                name="sessionEnd"
                value={settings.sessionEnd}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <button type="button" className="btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn-primary flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default GeneralSettings;
