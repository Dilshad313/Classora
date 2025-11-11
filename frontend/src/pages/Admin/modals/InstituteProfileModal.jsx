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
    <div className="flex flex-col xl:flex-row w-full min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-4 md:p-8 gap-6 overflow-auto">
      {/* Left Form Section */}
      <div className="flex-1 xl:max-w-3xl bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 md:p-10 mx-auto w-full">
        {/* Navigation Path */}
        <div className="flex items-center text-sm font-medium mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <span className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
            General Settings
          </span>
          <span className="mx-2 text-gray-400">›</span>
          <span className="text-gray-700 dark:text-gray-300 font-semibold">
            Institute Profile
          </span>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <Building2 className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            </div>
            Update Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm ml-14">
            Manage your institute information and branding
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-7">
          {/* Logo Upload */}
          <div className="space-y-3 pb-6 border-b border-gray-100 dark:border-gray-700">
            <label className="block font-semibold text-gray-800 dark:text-gray-200 text-base">
              Institute Logo
            </label>
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 shadow-md transition-all group-hover:border-blue-500 dark:group-hover:border-blue-400 group-hover:shadow-lg">
                  {formData.logo ? (
                    <img
                      src={URL.createObjectURL(formData.logo)}
                      alt="Logo Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Upload className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-3 flex-1">
                <label
                  htmlFor="logo"
                  className="flex items-center justify-center gap-2 border-2 border-blue-200 dark:border-blue-800 rounded-xl px-5 py-3 cursor-pointer bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:border-blue-300 dark:hover:border-blue-700 transition-all shadow-sm hover:shadow text-blue-700 dark:text-blue-300 font-semibold"
                >
                  <Upload className="w-5 h-5" />
                  <span>Choose Logo</span>
                </label>
                <input
                  type="file"
                  id="logo"
                  name="logo"
                  accept="image/*"
                  className="hidden"
                  onChange={handleChange}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  Recommended: 300x300px, Max 2MB • Formats: JPEG, PNG, SVG
                </p>
              </div>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Institute Name */}
            <div className="lg:col-span-2">
              <label className="block font-semibold text-gray-800 dark:text-gray-200 mb-2.5 text-sm">
                Institute Name <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3.5 bg-gray-50 dark:bg-gray-900/50 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 dark:focus-within:ring-blue-400 dark:focus-within:border-blue-400 transition-all">
                <Building2 className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3 flex-shrink-0" />
                <input
                  type="text"
                  name="instituteName"
                  required
                  value={formData.instituteName}
                  onChange={handleChange}
                  placeholder="e.g., Harvard University"
                  className="w-full outline-none bg-transparent text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 font-medium"
                />
              </div>
            </div>

            {/* Tagline */}
            <div className="lg:col-span-2">
              <label className="block font-semibold text-gray-800 dark:text-gray-200 mb-2.5 text-sm">
                Tagline <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3.5 bg-gray-50 dark:bg-gray-900/50 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 dark:focus-within:ring-blue-400 dark:focus-within:border-blue-400 transition-all">
                <Type className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3 flex-shrink-0" />
                <input
                  type="text"
                  name="tagline"
                  required
                  value={formData.tagline}
                  onChange={handleChange}
                  placeholder="e.g., Excellence in Education"
                  className="w-full outline-none bg-transparent text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block font-semibold text-gray-800 dark:text-gray-200 mb-2.5 text-sm">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3.5 bg-gray-50 dark:bg-gray-900/50 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 dark:focus-within:ring-blue-400 dark:focus-within:border-blue-400 transition-all">
                <Phone className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3 flex-shrink-0" />
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  className="w-full outline-none bg-transparent text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Country */}
            <div>
              <label className="block font-semibold text-gray-800 dark:text-gray-200 mb-2.5 text-sm">
                Country <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3.5 bg-gray-50 dark:bg-gray-900/50 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 dark:focus-within:ring-blue-400 dark:focus-within:border-blue-400 transition-all">
                <Flag className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3 flex-shrink-0" />
                <select
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full outline-none bg-transparent text-gray-900 dark:text-gray-100 cursor-pointer"
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

            {/* Website URL */}
            <div className="lg:col-span-2">
              <label className="block font-semibold text-gray-800 dark:text-gray-200 mb-2.5 text-sm">
                Website URL <span className="text-gray-400 text-xs font-normal">(optional)</span>
              </label>
              <div className="flex items-center border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3.5 bg-gray-50 dark:bg-gray-900/50 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 dark:focus-within:ring-blue-400 dark:focus-within:border-blue-400 transition-all">
                <Globe className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3 flex-shrink-0" />
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://www.example.com"
                  className="w-full outline-none bg-transparent text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Address (Full Width) */}
          <div>
            <label className="block font-semibold text-gray-800 dark:text-gray-200 mb-2.5 text-sm">
              Address <span className="text-red-500">*</span>
            </label>
            <div className="flex items-start border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3.5 bg-gray-50 dark:bg-gray-900/50 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 dark:focus-within:ring-blue-400 dark:focus-within:border-blue-400 transition-all min-h-[100px]">
              <MapPin className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
              <textarea
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter complete address with city, state, and postal code"
                className="w-full outline-none bg-transparent text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none"
                rows="3"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl text-base transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Save className="w-5 h-5" /> 
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Right Preview Section */}
      <div className="xl:w-96 w-full bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 flex flex-col sticky top-8 h-fit">
        <div className="flex items-center justify-center gap-2 mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg">
            <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Live Preview
          </h2>
        </div>
        
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Logo */}
          <div className="relative">
            {formData.logo ? (
              <img
                src={URL.createObjectURL(formData.logo)}
                alt="Institute Logo"
                className="w-28 h-28 rounded-2xl object-cover border-4 border-blue-100 dark:border-blue-900/50 shadow-xl ring-4 ring-blue-50 dark:ring-blue-900/20"
              />
            ) : (
              <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 border-2 border-dashed border-gray-300 dark:border-gray-600 shadow-inner">
                <Building2 className="w-10 h-10 mb-1" />
                <span className="text-xs font-medium">No Logo</span>
              </div>
            )}
          </div>

          {/* Institute Name */}
          <div className="space-y-2 w-full">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight px-4">
              {formData.instituteName || "Institute Name"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm italic leading-relaxed px-4">
              {formData.tagline || "Your tagline will appear here"}
            </p>
          </div>

          {/* Divider */}
          <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"></div>

          {/* Contact Info */}
          <div className="space-y-4 w-full bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5">
            {formData.phone && (
              <div className="flex items-center gap-3 text-left">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  {formData.phone}
                </span>
              </div>
            )}
            
            {formData.website && (
              <div className="flex items-center gap-3 text-left">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm text-blue-600 dark:text-blue-400 font-medium truncate">
                  {formData.website}
                </span>
              </div>
            )}
            
            {formData.country && (
              <div className="flex items-center gap-3 text-left">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Flag className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  {formData.country}
                </span>
              </div>
            )}
            
            {formData.address && (
              <div className="flex items-start gap-3 text-left pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mt-0.5">
                  <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-1">
                  {formData.address}
                </p>
              </div>
            )}
            
            {!formData.phone && !formData.website && !formData.country && !formData.address && (
              <p className="text-gray-400 dark:text-gray-500 text-sm py-4">
                Fill in the form to see your institute details here
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstituteProfileModal;
