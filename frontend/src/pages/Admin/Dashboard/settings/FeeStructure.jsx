import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Save, 
  DollarSign, 
  GraduationCap,
  Calendar,
  Users,
  Plus,
  Trash2,
  Edit2,
  AlertCircle,
  ChevronRight,
  Home,
  BookOpen,
  Award,
  TrendingUp,
  CheckCircle,
  X,
  Loader2,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getAllFeeStructures,
  createFeeStructure,
  updateFeeStructure,
  deleteFeeStructure,
  getFeeStructureStats
} from '../../../../services/feeStructureApi';

export const FeeStructure = () => {
  const navigate = useNavigate();
  
  const [feeStructures, setFeeStructures] = useState([]);
  const [statistics, setStatistics] = useState({
    totalStructures: 0,
    activeStructures: 0,
    totalRevenue: 0,
    academicYears: []
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isModified, setIsModified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    className: '',
    academicYear: '2024-2025',
    tuitionFee: '',
    admissionFee: '',
    examFee: '',
    labFee: '',
    libraryFee: '',
    sportsFee: '',
    status: 'active'
  });

  const [errors, setErrors] = useState({});

  // Fetch fee structures on component mount
  useEffect(() => {
    fetchFeeStructures();
    fetchStatistics();
  }, []);

  const fetchFeeStructures = async () => {
    try {
      setIsLoading(true);
      console.log('🔍 Fetching fee structures...');
      
      const data = await getAllFeeStructures();
      console.log('📊 Fee structures received:', data);
      
      setFeeStructures(data);
    } catch (error) {
      console.error('❌ Failed to fetch fee structures:', error);
      toast.error(error.message || 'Failed to load fee structures');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const stats = await getFeeStructureStats();
      console.log('📊 Statistics received:', stats);
      setStatistics(stats);
    } catch (error) {
      console.error('❌ Failed to fetch statistics:', error);
    }
  };

  const handleInputChange = (field, value) => {
    if (['tuitionFee', 'admissionFee', 'examFee', 'labFee', 'libraryFee', 'sportsFee'].includes(field)) {
      if (value && !/^\d*\.?\d*$/.test(value)) {
        return;
      }
    }

    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setIsModified(true);

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.className.trim()) {
      newErrors.className = 'Class name is required';
    }
    if (!formData.academicYear.trim()) {
      newErrors.academicYear = 'Academic year is required';
    }
    if (!formData.tuitionFee.trim()) {
      newErrors.tuitionFee = 'Tuition fee is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotal = (structure) => {
    const fees = [
      structure.tuitionFee,
      structure.admissionFee,
      structure.examFee,
      structure.labFee,
      structure.libraryFee,
      structure.sportsFee
    ];
    return fees.reduce((total, fee) => total + (parseFloat(fee) || 0), 0);
  };

  const handleAddNew = () => {
    setFormData({
      className: '',
      academicYear: '2024-2025',
      tuitionFee: '',
      admissionFee: '',
      examFee: '',
      labFee: '',
      libraryFee: '',
      sportsFee: '',
      status: 'active'
    });
    setEditingId(null);
    setErrors({});
    setIsModified(false);
    setShowAddModal(true);
  };

  const handleEdit = (structure) => {
    setFormData({
      className: structure.className,
      academicYear: structure.academicYear,
      tuitionFee: structure.tuitionFee.toString(),
      admissionFee: structure.admissionFee.toString(),
      examFee: structure.examFee.toString(),
      labFee: structure.labFee.toString(),
      libraryFee: structure.libraryFee.toString(),
      sportsFee: structure.sportsFee.toString(),
      status: structure.status
    });
    setEditingId(structure._id);
    setErrors({});
    setIsModified(false);
    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this fee structure? This action cannot be undone.')) {
      return;
    }

    try {
      toast.loading('Deleting fee structure...', { id: 'deleteFee' });
      
      await deleteFeeStructure(id);
      
      // Refresh data
      await fetchFeeStructures();
      await fetchStatistics();
      
      toast.success('Fee structure deleted successfully!', { id: 'deleteFee' });
    } catch (error) {
      console.error('❌ Delete error:', error);
      toast.error(error.message || 'Failed to delete fee structure', { id: 'deleteFee' });
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors before saving');
      return;
    }

    try {
      setIsSaving(true);
      toast.loading(editingId ? 'Updating fee structure...' : 'Creating fee structure...', { id: 'saveFee' });

      const feeData = {
        className: formData.className.trim(),
        academicYear: formData.academicYear.trim(),
        tuitionFee: parseFloat(formData.tuitionFee) || 0,
        admissionFee: parseFloat(formData.admissionFee) || 0,
        examFee: parseFloat(formData.examFee) || 0,
        labFee: parseFloat(formData.labFee) || 0,
        libraryFee: parseFloat(formData.libraryFee) || 0,
        sportsFee: parseFloat(formData.sportsFee) || 0,
        status: formData.status
      };

      if (editingId) {
        await updateFeeStructure(editingId, feeData);
        toast.success('Fee structure updated successfully!', { id: 'saveFee' });
      } else {
        await createFeeStructure(feeData);
        toast.success('Fee structure created successfully!', { id: 'saveFee' });
      }

      // Refresh data
      await fetchFeeStructures();
      await fetchStatistics();
      
      setShowAddModal(false);
      setIsModified(false);
    } catch (error) {
      console.error('❌ Save error:', error);
      toast.error(error.message || 'Failed to save fee structure', { id: 'saveFee' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (isModified) {
      if (!window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        return;
      }
    }
    
    setShowAddModal(false);
    setFormData({
      className: '',
      academicYear: '2024-2025',
      tuitionFee: '',
      admissionFee: '',
      examFee: '',
      labFee: '',
      libraryFee: '',
      sportsFee: '',
      status: 'active'
    });
    setErrors({});
    setIsModified(false);
  };

  const feeFields = [
    { key: 'tuitionFee', label: 'Tuition Fee', icon: BookOpen, required: true },
    { key: 'admissionFee', label: 'Admission Fee', icon: GraduationCap, required: false },
    { key: 'examFee', label: 'Examination Fee', icon: Award, required: false },
    { key: 'labFee', label: 'Laboratory Fee', icon: TrendingUp, required: false },
    { key: 'libraryFee', label: 'Library Fee', icon: BookOpen, required: false },
    { key: 'sportsFee', label: 'Sports Fee', icon: Users, required: false }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/40 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="text-center">
          <Loader2 className="animate-spin h-16 w-16 text-purple-600 mx-auto" />
          <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">Loading fee structures...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/40 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-6 md:p-8">
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
          <span className="text-gray-900 dark:text-white font-semibold">Fee Structure</span>
        </div>

        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                  Fee Structure Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Configure class-wise fee structures for your institute
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  fetchFeeStructures();
                  fetchStatistics();
                  toast.success('Data refreshed!');
                }}
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-5 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                <RefreshCw className="w-5 h-5" />
                Refresh
              </button>
              <button
                onClick={handleAddNew}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                <Plus className="w-5 h-5" />
                Add New Structure
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-3xl font-bold">{statistics.totalStructures}</span>
            </div>
            <h3 className="text-lg font-semibold mb-1">Total Classes</h3>
            <p className="text-blue-100 text-sm">Active fee structures</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <DollarSign className="w-6 h-6" />
              </div>
              <span className="text-3xl font-bold">
                ₹{statistics.totalRevenue.toLocaleString('en-IN')}
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-1">Total Revenue</h3>
            <p className="text-emerald-100 text-sm">Expected annual collection</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Calendar className="w-6 h-6" />
              </div>
              <span className="text-3xl font-bold">
                {statistics.academicYears[0] || '2024-25'}
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-1">Academic Year</h3>
            <p className="text-orange-100 text-sm">Current session</p>
          </div>
        </div>

        {/* Fee Structures Table */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              Class-wise Fee Structures
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">Class</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">Academic Year</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-900 dark:text-white">Tuition Fee</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-900 dark:text-white">Other Fees</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-900 dark:text-white">Total</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-900 dark:text-white">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {feeStructures.map((structure) => {
                  const otherFees = calculateTotal(structure) - parseFloat(structure.tuitionFee || 0);
                  const total = calculateTotal(structure);
                  
                  return (
                    <tr key={structure._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <GraduationCap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-white">{structure.className}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400 font-medium">
                        {structure.academicYear}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-gray-900 dark:text-white">
                        ₹{parseFloat(structure.tuitionFee || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-gray-600 dark:text-gray-400">
                        ₹{otherFees.toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                          ₹{total.toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                          structure.status === 'active'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                        }`}>
                          <CheckCircle className="w-3 h-3" />
                          {structure.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(structure)}
                            className="p-2 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(structure._id)}
                            className="p-2 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {feeStructures.length === 0 && (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                <GraduationCap className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Fee Structures Found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Get started by adding your first fee structure</p>
              <button
                onClick={handleAddNew}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="w-5 h-5" />
                Add Fee Structure
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-slideUp">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    {editingId ? 'Edit Fee Structure' : 'Add New Fee Structure'}
                  </h2>
                  <p className="text-blue-100 text-sm">Configure class fee details</p>
                </div>
              </div>
              <button
                onClick={handleCancel}
                className="p-2.5 hover:bg-white/20 rounded-xl transition-all duration-200 hover:rotate-90"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6 bg-gradient-to-br from-gray-50 to-purple-50/30 dark:from-gray-900 dark:to-gray-800">
              {/* Basic Info */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 shadow-md border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-3">
                  <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-md">
                    Basic Information
                  </span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2.5">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                      <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span>Class Name</span>
                      <span className="text-red-500 text-base">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.className}
                      onChange={(e) => handleInputChange('className', e.target.value)}
                      className={`w-full px-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:outline-none transition-all duration-200 font-medium bg-gray-50 dark:bg-gray-900/50 ${
                        errors.className
                          ? 'border-red-500 focus:ring-red-200 focus:border-red-500'
                          : 'border-gray-200 dark:border-gray-700 focus:ring-purple-200 focus:border-purple-500'
                      }`}
                      placeholder="e.g., Class 1, Class 2"
                    />
                    {errors.className && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.className}</span>
                      </p>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                      <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span>Academic Year</span>
                      <span className="text-red-500 text-base">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.academicYear}
                      onChange={(e) => handleInputChange('academicYear', e.target.value)}
                      className={`w-full px-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:outline-none transition-all duration-200 font-medium bg-gray-50 dark:bg-gray-900/50 ${
                        errors.academicYear
                          ? 'border-red-500 focus:ring-red-200 focus:border-red-500'
                          : 'border-gray-200 dark:border-gray-700 focus:ring-purple-200 focus:border-purple-500'
                      }`}
                      placeholder="e.g., 2024-2025"
                    />
                    {errors.academicYear && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.academicYear}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Fee Details */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-3">
                  <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-md">
                    Fee Components
                  </span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {feeFields.map((field) => {
                    const IconComponent = field.icon;
                    return (
                      <div key={field.key} className="space-y-2.5">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                          <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <IconComponent className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <span>{field.label}</span>
                          {field.required && <span className="text-red-500 text-base">*</span>}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <DollarSign className="w-4 h-4 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            value={formData[field.key]}
                            onChange={(e) => handleInputChange(field.key, e.target.value)}
                            className={`w-full pl-10 pr-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:outline-none transition-all duration-200 font-medium bg-gray-50 dark:bg-gray-900/50 ${
                              errors[field.key]
                                ? 'border-red-500 focus:ring-red-200 focus:border-red-500'
                                : 'border-gray-200 dark:border-gray-700 focus:ring-blue-200 focus:border-blue-500'
                            }`}
                            placeholder="0.00"
                          />
                        </div>
                        {errors[field.key] && (
                          <p className="text-red-500 text-xs flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>{errors[field.key]}</span>
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Total Preview */}
                <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border-2 border-emerald-200 dark:border-emerald-800">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Total Fee Amount:</span>
                    <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      ₹{calculateTotal(formData).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-between items-center p-6 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
              <div className="flex items-center gap-2">
                {isModified && (
                  <div className="flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-3 py-1.5 rounded-lg border border-orange-300 dark:border-orange-700">
                    <AlertCircle className="w-4 h-4 animate-pulse" />
                    <span className="text-sm font-medium">Unsaved changes</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 font-semibold hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>{editingId ? 'Update Structure' : 'Add Structure'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeStructure;