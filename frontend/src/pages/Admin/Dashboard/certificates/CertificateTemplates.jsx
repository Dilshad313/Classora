import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, ChevronRight, FileText, Plus, Edit, Trash2, Eye, X, Award, Building2, Check, Star,
  Loader, AlertCircle, RefreshCw
} from 'lucide-react';

// Import API functions
import { 
  getAllCertificateTemplates,
  getCertificateTemplateById,
  createCertificateTemplate,
  updateCertificateTemplate,
  deleteCertificateTemplate,
  getCertificateStats,
  initializeDefaultTemplates
} from '../../../../services/certificateApi';

const CertificateTemplates = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');
  const [formData, setFormData] = useState({
    name: '', 
    description: '', 
    category: 'Student', 
    design: {
      borderStyle: 'double',
      borderColor: 'blue',
      headerBg: 'gradient-blue',
      accentColor: 'blue'
    },
    content: {
      previewText: '',
      headerTitle: '',
      instituteName: '',
      instituteTagline: '',
      footerText: ''
    },
    isDefault: false
  });

  const categories = ['All', 'Student', 'Achievement', 'Event', 'Staff'];
  
  // Design options mapping for frontend display
  const borderColors = {
    blue: 'border-blue-600', 
    green: 'border-green-600', 
    purple: 'border-purple-600',
    indigo: 'border-indigo-600', 
    orange: 'border-orange-600', 
    pink: 'border-pink-600', 
    red: 'border-red-600'
  };
  
  const headerGradients = {
    'gradient-blue': 'from-blue-600 to-indigo-600', 
    'gradient-green': 'from-green-600 to-emerald-600',
    'gradient-purple': 'from-purple-600 to-pink-600', 
    'gradient-indigo': 'from-indigo-600 to-blue-600',
    'gradient-orange': 'from-orange-600 to-red-600', 
    'gradient-pink': 'from-pink-600 to-rose-600'
  };
  
  const accentColors = {
    blue: 'text-blue-600', 
    green: 'text-green-600', 
    purple: 'text-purple-600',
    indigo: 'text-indigo-600', 
    orange: 'text-orange-600', 
    pink: 'text-pink-600'
  };

  // Fetch templates on component mount
  useEffect(() => {
    fetchTemplates();
    fetchStats();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllCertificateTemplates({ 
        category: filterCategory === 'All' ? '' : filterCategory 
      });
      setTemplates(response.data || []);
    } catch (err) {
      console.error('Error fetching templates:', err);
      setError(err.message || 'Failed to load certificate templates');
      
      // If no templates exist, try to initialize defaults
      if (err.message.includes('not found') || err.message.includes('no data')) {
        try {
          await initializeDefaultTemplates();
          const response = await getAllCertificateTemplates();
          setTemplates(response.data || []);
        } catch (initErr) {
          console.error('Error initializing templates:', initErr);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await getCertificateStats();
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const filteredTemplates = filterCategory === 'All' 
    ? templates 
    : templates.filter(t => t.category === filterCategory);

  const handlePreview = (template) => { 
    setSelectedTemplate(template); 
    setShowPreviewModal(true); 
  };
  
  const handleUseTemplate = (template) => {
    navigate('/dashboard/certificates/generate', { 
      state: { selectedTemplate: template } 
    });
  };
  
  const handleAddNew = () => {
    setEditingTemplate(null);
    setFormData({
      name: '', 
      description: '', 
      category: 'Student',
      design: {
        borderStyle: 'double',
        borderColor: 'blue',
        headerBg: 'gradient-blue',
        accentColor: 'blue'
      },
      content: {
        previewText: '',
        headerTitle: '',
        instituteName: 'Classora Institute',
        instituteTagline: 'Excellence in Education',
        footerText: 'This is a computer-generated certificate and does not require a physical signature.'
      },
      isDefault: false
    });
    setShowAddEditModal(true);
  };
  
  const handleEdit = (template) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      description: template.description,
      category: template.category,
      design: template.design,
      content: template.content || {
        previewText: '',
        headerTitle: '',
        instituteName: 'Classora Institute',
        instituteTagline: 'Excellence in Education',
        footerText: 'This is a computer-generated certificate and does not require a physical signature.'
      },
      isDefault: template.isDefault
    });
    setShowAddEditModal(true);
  };
  
  const handleDelete = async (templateId) => {
    if (!window.confirm('Are you sure you want to delete this template?')) {
      return;
    }
    
    try {
      await deleteCertificateTemplate(templateId);
      setTemplates(templates.filter(t => t.id !== templateId));
      await fetchStats(); // Refresh stats
    } catch (err) {
      alert(`Failed to delete template: ${err.message}`);
    }
  };
  
  const handleSaveTemplate = async (e) => {
    e.preventDefault();
    
    try {
      if (editingTemplate) {
        // Update existing template
        const updatedTemplate = await updateCertificateTemplate(editingTemplate.id, formData);
        setTemplates(templates.map(t => 
          t.id === editingTemplate.id ? { ...t, ...updatedTemplate } : t
        ));
      } else {
        // Create new template
        const newTemplate = await createCertificateTemplate(formData);
        setTemplates([...templates, newTemplate]);
      }
      
      setShowAddEditModal(false);
      await fetchStats(); // Refresh stats
    } catch (err) {
      alert(`Failed to save template: ${err.message}`);
    }
  };

  const TemplateCard = ({ template }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 p-6 h-64 flex items-center justify-center">
        <div className={`w-full h-full border-4 ${template.design.borderStyle === 'double' ? 'border-double' : 'border-solid'} ${borderColors[template.design.borderColor]} p-4 bg-white flex flex-col items-center justify-center`}>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center mb-3">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            {template.content?.instituteName || 'Classora Institute'}
          </h3>
          <div className={`bg-gradient-to-r ${headerGradients[template.design.headerBg]} text-white px-4 py-1 rounded text-sm font-bold mb-3`}>
            {template.content?.headerTitle || template.name}
          </div>
          <p className="text-xs text-gray-600 text-center line-clamp-3 px-2">
            {template.content?.previewText || template.description}
          </p>
        </div>
        {template.isDefault && (
          <div className="absolute top-3 right-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
            <Star className="w-3 h-3" />Default
          </div>
        )}
        {template.usageCount > 0 && (
          <div className="absolute bottom-3 right-3 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded text-xs font-semibold">
            Used {template.usageCount} times
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
              {template.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {template.description}
            </p>
            <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold">
              {template.category}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <button 
            onClick={() => handlePreview(template)} 
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all font-medium"
          >
            <Eye className="w-4 h-4" />Preview
          </button>
          <button 
            onClick={() => handleUseTemplate(template)} 
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-lg"
          >
            <Check className="w-4 h-4" />Use This
          </button>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <button 
            onClick={() => handleEdit(template)} 
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-sm font-medium"
          >
            <Edit className="w-4 h-4" />Edit
          </button>
          {!template.isDefault && (
            <button 
              onClick={() => handleDelete(template.id)} 
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border-2 border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-sm font-medium"
            >
              <Trash2 className="w-4 h-4" />Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading certificate templates...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && templates.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-2">
              Error Loading Templates
            </h3>
            <p className="text-red-600 dark:text-red-300 mb-6">{error}</p>
            <button 
              onClick={fetchTemplates}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-semibold shadow-lg"
            >
              <RefreshCw className="w-5 h-5" />Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
          >
            <Home className="w-4 h-4" /><span>Dashboard</span>
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600" />
          <span className="text-blue-600 dark:text-blue-400 font-semibold">Certificates</span>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600" />
          <span className="text-gray-900 dark:text-gray-100 font-semibold">Certificate Templates</span>
        </div>

        {/* Header with Stats */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Certificate Templates</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage and customize certificate templates for your institution
              </p>
            </div>
            <div className="flex items-center gap-4">
              {stats && (
                <div className="hidden md:flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {stats.templates?.reduce((acc, curr) => acc + curr.count, 0) || 0}
                    </div>
                    <div className="text-xs text-gray-500">Templates</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {stats.certificates?.totalCertificates || 0}
                    </div>
                    <div className="text-xs text-gray-500">Generated</div>
                  </div>
                </div>
              )}
              <button 
                onClick={handleAddNew} 
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-lg"
              >
                <Plus className="w-5 h-5" />Add New Template
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto">
            {categories.map(category => (
              <button 
                key={category} 
                onClick={() => setFilterCategory(category)}
                className={`px-6 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  filterCategory === category 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredTemplates.map(template => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-12 h-12 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              No Templates Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto text-lg mb-6">
              {filterCategory === 'All' 
                ? 'No templates available. Add your first template to get started.'
                : `No templates available in the "${filterCategory}" category.`
              }
            </p>
            <button 
              onClick={handleAddNew} 
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-lg"
            >
              <Plus className="w-5 h-5" />Add New Template
            </button>
          </div>
        )}

        {/* Preview Modal */}
        {showPreviewModal && selectedTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 p-4 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between z-10">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Template Preview: {selectedTemplate.name}
                </h2>
                <button 
                  onClick={() => setShowPreviewModal(false)} 
                  className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-all"
                >
                  <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              <div className="p-8 md:p-12">
                <div className={`border-8 ${selectedTemplate.design.borderStyle === 'double' ? 'border-double' : 'border-solid'} ${borderColors[selectedTemplate.design.borderColor]} p-8 md:p-12 bg-white`}>
                  <div className="text-center mb-8 pb-6 border-b-2 border-gray-300">
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center shadow-lg">
                        <Building2 className="w-12 h-12 text-white" />
                      </div>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                      {selectedTemplate.content?.instituteName || 'Classora Institute'}
                    </h1>
                    <p className="text-sm text-gray-600 font-medium uppercase tracking-wider">
                      {selectedTemplate.content?.instituteTagline || 'Excellence in Education'}
                    </p>
                  </div>
                  <div className="text-center mb-8">
                    <div className={`inline-block bg-gradient-to-r ${headerGradients[selectedTemplate.design.headerBg]} text-white px-8 py-3 rounded-lg shadow-lg`}>
                      <h2 className="text-2xl font-bold uppercase tracking-wide">
                        {selectedTemplate.content?.headerTitle || selectedTemplate.name}
                      </h2>
                    </div>
                  </div>
                  <div className="text-center mb-8 space-y-4 text-gray-800 leading-relaxed">
                    <p className="text-base">{selectedTemplate.content?.previewText || selectedTemplate.description}</p>
                    <p className="text-base">
                      This is a preview of the <span className={`font-bold ${accentColors[selectedTemplate.design.accentColor]}`}>
                        {selectedTemplate.name}
                      </span> template.
                    </p>
                    <p className="text-base">
                      The actual certificate will contain personalized information based on the recipient's details.
                    </p>
                  </div>
                  <div className="mt-12 pt-8 border-t-2 border-gray-300">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Date:</p>
                        <p className="font-bold text-gray-900">__________</p>
                      </div>
                      <div className="text-center">
                        <div className="w-24 h-24 border-4 border-blue-600 rounded-full flex items-center justify-center bg-blue-50 mb-2">
                          <Award className="w-10 h-10 text-blue-600" />
                        </div>
                        <p className="text-xs font-bold text-gray-600">SCHOOL SEAL</p>
                      </div>
                      <div className="text-right">
                        <div className="border-t-2 border-gray-900 pt-2 px-8 mb-1">
                          <p className="font-bold text-gray-900">Signature</p>
                        </div>
                        <p className="text-sm text-gray-600">Authorized Signatory</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-700 p-4 border-t border-gray-200 dark:border-gray-600 flex items-center justify-end gap-3">
                <button 
                  onClick={() => setShowPreviewModal(false)} 
                  className="px-6 py-2.5 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all font-medium"
                >
                  Close
                </button>
                <button 
                  onClick={() => { 
                    setShowPreviewModal(false); 
                    handleUseTemplate(selectedTemplate); 
                  }} 
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-lg"
                >
                  <Check className="w-5 h-5" />Use This Template
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Template Modal */}
        {showAddEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 p-4 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between z-10">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {editingTemplate ? 'Edit Template' : 'Add New Template'}
                </h2>
                <button 
                  onClick={() => setShowAddEditModal(false)} 
                  className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-all"
                >
                  <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              <form onSubmit={handleSaveTemplate} className="p-6">
                <div className="space-y-4">
                  {/* Template Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Template Name <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})} 
                      required 
                      placeholder="e.g., Achievement Certificate"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all" 
                    />
                  </div>
                  
                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea 
                      value={formData.description} 
                      onChange={(e) => setFormData({...formData, description: e.target.value})} 
                      required 
                      rows="3" 
                      placeholder="Brief description of the template"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all" 
                    />
                  </div>
                  
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select 
                      value={formData.category} 
                      onChange={(e) => setFormData({...formData, category: e.target.value})} 
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all"
                    >
                      <option value="Student">Student</option>
                      <option value="Achievement">Achievement</option>
                      <option value="Event">Event</option>
                      <option value="Staff">Staff</option>
                    </select>
                  </div>
                  
                  {/* Default Template */}
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="isDefault" 
                      checked={formData.isDefault} 
                      onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                      className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor="isDefault" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Set as default template for this category
                    </label>
                  </div>
                  
                  {/* Design Options */}
                  <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-4 mt-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Design Options</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Border Style */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Border Style
                        </label>
                        <select 
                          value={formData.design.borderStyle} 
                          onChange={(e) => setFormData({
                            ...formData, 
                            design: {...formData.design, borderStyle: e.target.value}
                          })}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all"
                        >
                          <option value="solid">Solid</option>
                          <option value="double">Double</option>
                        </select>
                      </div>
                      
                      {/* Border Color */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Border Color
                        </label>
                        <select 
                          value={formData.design.borderColor} 
                          onChange={(e) => setFormData({
                            ...formData, 
                            design: {...formData.design, borderColor: e.target.value}
                          })}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all"
                        >
                          <option value="blue">Blue</option>
                          <option value="green">Green</option>
                          <option value="purple">Purple</option>
                          <option value="indigo">Indigo</option>
                          <option value="orange">Orange</option>
                          <option value="pink">Pink</option>
                          <option value="red">Red</option>
                        </select>
                      </div>
                      
                      {/* Header Style */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Header Style
                        </label>
                        <select 
                          value={formData.design.headerBg} 
                          onChange={(e) => setFormData({
                            ...formData, 
                            design: {...formData.design, headerBg: e.target.value}
                          })}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all"
                        >
                          <option value="gradient-blue">Blue Gradient</option>
                          <option value="gradient-green">Green Gradient</option>
                          <option value="gradient-purple">Purple Gradient</option>
                          <option value="gradient-indigo">Indigo Gradient</option>
                          <option value="gradient-orange">Orange Gradient</option>
                          <option value="gradient-pink">Pink Gradient</option>
                        </select>
                      </div>
                      
                      {/* Accent Color */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Accent Color
                        </label>
                        <select 
                          value={formData.design.accentColor} 
                          onChange={(e) => setFormData({
                            ...formData, 
                            design: {...formData.design, accentColor: e.target.value}
                          })}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all"
                        >
                          <option value="blue">Blue</option>
                          <option value="green">Green</option>
                          <option value="purple">Purple</option>
                          <option value="indigo">Indigo</option>
                          <option value="orange">Orange</option>
                          <option value="pink">Pink</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* Preview Text */}
                    <div className="mt-4">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Preview Text
                      </label>
                      <textarea 
                        value={formData.content.previewText} 
                        onChange={(e) => setFormData({
                          ...formData, 
                          content: {...formData.content, previewText: e.target.value}
                        })} 
                        rows="2" 
                        placeholder="Text shown in template preview"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all" 
                      />
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button 
                    type="button" 
                    onClick={() => setShowAddEditModal(false)} 
                    className="px-6 py-2.5 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all font-medium"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-lg"
                  >
                    <Check className="w-5 h-5" />
                    {editingTemplate ? 'Update Template' : 'Create Template'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateTemplates;