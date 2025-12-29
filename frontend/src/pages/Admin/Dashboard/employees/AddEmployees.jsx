import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Home,
  ChevronRight,
  UserPlus,
  Upload,
  Save,
  X,
  User,
  Phone,
  Calendar,
  Briefcase,
  DollarSign,
  Users,
  CreditCard,
  GraduationCap,
  Heart,
  Mail,
  MapPin,
  AlertCircle
} from 'lucide-react';
import { employeeApi, convertToFormData } from '../../../../services/employeesApi';

const AddEmployees = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const isEditMode = !!editId;
  
  const [activeSection, setActiveSection] = useState('required');
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // Form state
  const [formData, setFormData] = useState({
    // Basic Information (Required)
    employeeName: '',
    picture: null,
    mobileNo: '',
    dateOfJoining: '',
    employeeRole: '',
    monthlySalary: '',
   
    // Other Information (Optional)
    fatherHusbandName: '',
    nationalId: '',
    education: '',
    gender: '',
    religion: '',
    bloodGroup: '',
    experience: '',
    emailAddress: '',
    dateOfBirth: '',
    homeAddress: ''
  });
  const [errors, setErrors] = useState({});

  // Fetch employee data when in edit mode
  useEffect(() => {
    if (isEditMode && editId) {
      fetchEmployeeData(editId);
    }
  }, [isEditMode, editId]);

  const fetchEmployeeData = async (id) => {
    setIsLoading(true);
    try {
      const employee = await employeeApi.getEmployeeById(id);
      if (employee) {
        setFormData({
          employeeName: employee.employeeName || '',
          picture: null, // Keep as null, we'll show existing image separately
          mobileNo: employee.mobileNo || '',
          dateOfJoining: employee.dateOfJoining ? new Date(employee.dateOfJoining).toISOString().split('T')[0] : '',
          employeeRole: employee.employeeRole || '',
          monthlySalary: employee.monthlySalary?.toString() || '',
          fatherHusbandName: employee.fatherHusbandName || '',
          nationalId: employee.nationalId || '',
          education: employee.education || '',
          gender: employee.gender || '',
          religion: employee.religion || '',
          bloodGroup: employee.bloodGroup || '',
          experience: employee.experience || '',
          emailAddress: employee.emailAddress || '',
          dateOfBirth: employee.dateOfBirth ? new Date(employee.dateOfBirth).toISOString().split('T')[0] : '',
          homeAddress: employee.homeAddress || ''
        });
        
        // Set image preview if employee has a picture
        if (employee.picture?.url) {
          setImagePreview(employee.picture.url);
        }
      }
    } catch (error) {
      console.error('Error fetching employee:', error);
      alert('Error loading employee data. Please try again.');
      navigate('/dashboard/employee/all');
    } finally {
      setIsLoading(false);
    }
  };


  // Employee roles
  const employeeRoles = [
    'Teacher',
    'Principal',
    'Vice Principal',
    'Librarian',
    'Lab Assistant',
    'Sports Coach',
    'Administrative Staff',
    'Accountant',
    'Receptionist',
    'Security Guard',
    'Maintenance Staff',
    'IT Support'
  ];
  const genderOptions = ['Male', 'Female', 'Other'];
  const religionOptions = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Other'];
  const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        picture: file
      }));
     
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
     
      // Clear error
      setErrors(prev => ({
        ...prev,
        picture: ''
      }));
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      picture: null
    }));
    setImagePreview(null);
  };

  const validateForm = () => {
    const newErrors = {};
   
    // Required fields validation
    if (!formData.employeeName.trim()) {
      newErrors.employeeName = 'Employee name is required';
    }
    if (!formData.mobileNo.trim()) {
      newErrors.mobileNo = 'Mobile number is required';
    }
    if (!formData.dateOfJoining) {
      newErrors.dateOfJoining = 'Date of joining is required';
    }
    if (!formData.employeeRole) {
      newErrors.employeeRole = 'Employee role is required';
    }
    if (!formData.monthlySalary.trim()) {
      newErrors.monthlySalary = 'Monthly salary is required';
    }
   
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      const formDataToSend = convertToFormData(formData);
      
      let result;
      if (isEditMode) {
        result = await employeeApi.updateEmployee(editId, formDataToSend);
      } else {
        result = await employeeApi.createEmployee(formDataToSend);
      }
      
      if (result.success || result) {
        alert(`Employee ${isEditMode ? 'updated' : 'added'} successfully!`);
        navigate('/dashboard/employee/all');
      } else {
        alert(result.message || `Error ${isEditMode ? 'updating' : 'adding'} employee`);
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'adding'} employee:`, error);
      alert(`Error ${isEditMode ? 'updating' : 'adding'} employee. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      employeeName: '',
      picture: null,
      mobileNo: '',
      dateOfJoining: '',
      employeeRole: '',
      monthlySalary: '',
      fatherHusbandName: '',
      nationalId: '',
      education: '',
      gender: '',
      religion: '',
      bloodGroup: '',
      experience: '',
      emailAddress: '',
      dateOfBirth: '',
      homeAddress: ''
    });
    setImagePreview(null);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
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
          <span className="text-blue-600 dark:text-blue-400 font-semibold">Employees</span>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span className="text-gray-900 dark:text-white font-semibold">{isEditMode ? 'Edit Employee' : 'Add New Employee'}</span>
        </div>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{isEditMode ? 'Edit Employee' : 'Add New Employee'}</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{isEditMode ? 'Update the employee details below' : 'Fill in the employee details below'}</p>
            </div>
          </div>
        </div>
        {/* Section Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-6 overflow-hidden">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveSection('required')}
              className={`flex-1 px-6 py-4 font-semibold transition-all ${
                activeSection === 'required'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                  : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Required Information *
              </span>
            </button>
            <button
              onClick={() => setActiveSection('optional')}
              className={`flex-1 px-6 py-4 font-semibold transition-all ${
                activeSection === 'optional'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                  : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <Users className="w-5 h-5" />
                Optional Information
              </span>
            </button>
          </div>
        </div>
        {/* Form */}
        {isLoading ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading employee data...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
          {/* Required Section */}
          {activeSection === 'required' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-6">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Basic Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Employee Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Employee Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      name="employeeName"
                      value={formData.employeeName}
                      onChange={handleInputChange}
                      placeholder="Name of Employee"
                      className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                        errors.employeeName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                      }`}
                    />
                  </div>
                  {errors.employeeName && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.employeeName}
                    </p>
                  )}
                </div>
                {/* Picture Upload */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Picture <span className="text-gray-500 dark:text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <div className="flex items-start gap-4">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-xl border-2 border-gray-300 dark:border-gray-600"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="w-32 h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all bg-white dark:bg-gray-700">
                        <Upload className="w-8 h-8 text-gray-400 dark:text-gray-500 mb-2" />
                        <span className="text-xs text-gray-500 dark:text-gray-400 text-center px-2">Click to upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Upload employee photo</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">Accepted formats: JPG, PNG, GIF</p>
                    </div>
                  </div>
                  {errors.picture && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.picture}
                    </p>
                  )}
                </div>
                {/* Mobile Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Mobile No. for SMS/WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      name="mobileNo"
                      value={formData.mobileNo}
                      onChange={handleInputChange}
                      placeholder="+44xxxxxxxxxx"
                      className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                        errors.mobileNo ? 'border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                      }`}
                    />
                  </div>
                  {errors.mobileNo && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.mobileNo}
                    </p>
                  )}
                </div>
                {/* Date of Joining */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Date of Joining <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <input
                      type="date"
                      name="dateOfJoining"
                      value={formData.dateOfJoining}
                      onChange={handleInputChange}
                      className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                        errors.dateOfJoining ? 'border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                      }`}
                    />
                  </div>
                  {errors.dateOfJoining && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.dateOfJoining}
                    </p>
                  )}
                </div>
                {/* Employee Role */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Employee Role <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Briefcase className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <select
                      name="employeeRole"
                      value={formData.employeeRole}
                      onChange={handleInputChange}
                      className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all appearance-none ${
                        errors.employeeRole ? 'border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                      }`}
                    >
                      <option value="">Select*</option>
                      {employeeRoles.map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>
                  {errors.employeeRole && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.employeeRole}
                    </p>
                  )}
                </div>
                {/* Monthly Salary */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Monthly Salary <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      name="monthlySalary"
                      value={formData.monthlySalary}
                      onChange={handleInputChange}
                      placeholder="Monthly Salary"
                      className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                        errors.monthlySalary ? 'border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                      }`}
                    />
                  </div>
                  {errors.monthlySalary && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.monthlySalary}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* Optional Section */}
          {activeSection === 'optional' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-6">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Other Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Father/Husband Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Father / Husband Name
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      name="fatherHusbandName"
                      value={formData.fatherHusbandName}
                      onChange={handleInputChange}
                      placeholder="Father / Husband Name"
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                {/* National ID */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    National ID
                  </label>
                  <div className="relative">
                    <CreditCard className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      name="nationalId"
                      value={formData.nationalId}
                      onChange={handleInputChange}
                      placeholder="National ID"
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                {/* Education */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Education
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      name="education"
                      value={formData.education}
                      onChange={handleInputChange}
                      placeholder="Education"
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                {/* Gender */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Gender
                  </label>
                  <div className="relative">
                    <Users className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all appearance-none"
                    >
                      <option value="">Select</option>
                      {genderOptions.map((gender) => (
                        <option key={gender} value={gender}>{gender}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {/* Religion */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Religion
                  </label>
                  <div className="relative">
                    <Users className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <select
                      name="religion"
                      value={formData.religion}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all appearance-none"
                    >
                      <option value="">Select</option>
                      {religionOptions.map((religion) => (
                        <option key={religion} value={religion}>{religion}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {/* Blood Group */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Blood Group
                  </label>
                  <div className="relative">
                    <Heart className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all appearance-none"
                    >
                      <option value="">Select</option>
                      {bloodGroupOptions.map((group) => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {/* Experience */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Experience
                  </label>
                  <div className="relative">
                    <Briefcase className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      placeholder="Experience (e.g., 5 years)"
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                {/* Email Address */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <input
                      type="email"
                      name="emailAddress"
                      value={formData.emailAddress}
                      onChange={handleInputChange}
                      placeholder="Email Address"
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <Calendar className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      placeholder="dd-mm-yyyy"
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                {/* Home Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Home Address
                  </label>
                  <div className="relative">
                    <MapPin className="w-5 h-5 absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
                    <textarea
                      name="homeAddress"
                      value={formData.homeAddress}
                      onChange={handleInputChange}
                      placeholder="Home Address"
                      rows="4"
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Action Buttons */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-all font-semibold"
              >
                <X className="w-5 h-5" />
                <span>Reset Form</span>
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all font-bold shadow-lg hover:shadow-xl ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>{isEditMode ? 'Update Employee' : 'Save Employee'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
        )}
      </div>
    </div>
  );
};

export default AddEmployees;