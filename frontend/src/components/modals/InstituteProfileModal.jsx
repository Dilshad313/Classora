import React, { useState } from "react";
import {
  Upload,
  Globe,
  Phone,
  MapPin,
  Building2,
  Type,
  Flag,
  Save,
} from "lucide-react";

export const InstituteProfileModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    instituteName: "",
    tagline: "",
    phone: "",
    address: "",
    country: "",
    website: "",
    logo: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile Updated Successfully!");
  };

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 overflow-hidden">
      {/* Left Form Section */}
      <div className="lg:w-2/3 w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-10 mx-auto flex flex-col justify-center">
        {/* Navigation Path */}
        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4 text-sm font-medium">
          <span className="text-blue-600 dark:text-blue-400 font-semibold">
            General Settings
          </span>
          <span className="mx-2 text-gray-400">›</span>
          <span className="text-blue-600 dark:text-blue-400 font-semibold">
            Institute Profile
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
          <Building2 className="w-7 h-7 text-blue-600 dark:text-blue-400" />
          Update Profile
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Logo Upload */}
          <div className="space-y-3">
            <label className="block font-medium text-gray-700 dark:text-gray-300 text-lg">
              Institute Logo
            </label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 shadow-sm transition-all hover:border-blue-400 dark:hover:border-blue-500">
                {formData.logo ? (
                  <img
                    src={URL.createObjectURL(formData.logo)}
                    alt="Logo Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Upload className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="logo"
                  className="flex items-center gap-2 border border-dashed border-gray-400 dark:border-gray-600 rounded-xl px-4 py-3 cursor-pointer bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20 transition shadow-sm text-blue-600 dark:text-blue-400 font-medium"
                >
                  <Upload className="w-5 h-5" />
                  <span>Upload Logo</span>
                </label>
                <input
                  type="file"
                  id="logo"
                  name="logo"
                  accept="image/*"
                  className="hidden"
                  onChange={handleChange}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Recommended size: 300x300px, Max 2MB (JPEG, PNG)
                </p>
              </div>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Institute Name */}
            <div>
              <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name of Institute <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-xl p-3 bg-white dark:bg-gray-700 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-blue-400">
                <Building2 className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                <input
                  type="text"
                  name="instituteName"
                  required
                  value={formData.instituteName}
                  onChange={handleChange}
                  placeholder="Enter institute name"
                  className="w-full outline-none bg-transparent text-gray-800 dark:text-gray-200"
                />
              </div>
            </div>

            {/* Tagline */}
            <div>
              <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tagline (Target Line) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-xl p-3 bg-white dark:bg-gray-700 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-blue-400">
                <Type className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                <input
                  type="text"
                  name="tagline"
                  required
                  value={formData.tagline}
                  onChange={handleChange}
                  placeholder="Enter tagline"
                  className="w-full outline-none bg-transparent text-gray-800 dark:text-gray-200"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-xl p-3 bg-white dark:bg-gray-700 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-blue-400">
                <Phone className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full outline-none bg-transparent text-gray-800 dark:text-gray-200"
                />
              </div>
            </div>

            {/* Website URL */}
            <div>
              <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">
                Website URL (optional)
              </label>
              <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-xl p-3 bg-white dark:bg-gray-700 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-blue-400">
                <Globe className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="w-full outline-none bg-transparent text-gray-800 dark:text-gray-200"
                />
              </div>
            </div>

            {/* Country */}
            <div>
              <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">
                Country <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-xl p-3 bg-white dark:bg-gray-700 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-blue-400">
                <Flag className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                <select
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full outline-none bg-transparent text-gray-800 dark:text-gray-200"
                >
                  <option value="">Select Country</option>
                  {[
                    "India",
                    "United States",
                    "United Kingdom",
                    "Canada",
                    "Australia",
                    "Germany",
                    "France",
                    "Italy",
                    "Japan",
                    "China",
                    "United Arab Emirates",
                    "Saudi Arabia",
                    "South Africa",
                    "Brazil",
                    "Singapore",
                  ].map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Address (Full Width) */}
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">
              Address <span className="text-red-500">*</span>
            </label>
            <div className="flex items-start border border-gray-300 dark:border-gray-700 rounded-xl p-3 bg-white dark:bg-gray-700 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-blue-400 h-20">
              <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3 mt-1" />
              <textarea
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
                className="w-full outline-none bg-transparent text-gray-800 dark:text-gray-200 resize-none"
                rows="2"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-semibold shadow-md text-base"
            >
              <Save className="w-4 h-4" /> Update Profile
            </button>
          </div>
        </form>
      </div>

      {/* Right Preview Section */}
      <div className="lg:w-1/3 w-full mt-6 lg:mt-0 lg:ml-6 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 flex flex-col items-center text-center h-96">
        <h2 className="text-2xl font-semibold mb-6 text-blue-700 dark:text-blue-400 flex items-center gap-2">
          <Building2 className="w-6 h-6" />
          Live Preview
        </h2>
        {formData.logo ? (
          <img
            src={URL.createObjectURL(formData.logo)}
            alt="Institute Logo"
            className="w-20 h-20 rounded-full mb-3 object-cover border-4 border-blue-100 dark:border-blue-900 shadow-lg"
          />
        ) : (
          <div className="w-20 h-20 rounded-full mb-3 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-600">
            No Logo
          </div>
        )}
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
          {formData.instituteName || "Institute Name"}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-base italic mb-6">
          {formData.tagline || "Tagline goes here"}
        </p>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          {formData.address || "Address will appear here"}
        </p>
      </div>
    </div>
  );
};

export default InstituteProfileModal;
