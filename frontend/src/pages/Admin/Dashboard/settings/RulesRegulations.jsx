import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Save, 
  Plus, 
  Trash2, 
  Edit3, 
  Bold, 
  Underline, 
  Italic, 
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link,
  Image,
  Paperclip,
  Eye,
  Home,
  ChevronRight,
  Scale,
  X,
  FileText,
  AlertCircle,
  Loader2,
  CheckCircle
} from 'lucide-react';
import {
  getAllRules,
  createRule,
  updateRule,
  deleteRule,
  getRulesStats
} from '../../../../services/rulesRegulationsApi';

export const RulesRegulations = () => {
  const navigate = useNavigate();
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [newRule, setNewRule] = useState({
    title: '',
    content: '',
    isRequired: true,
    priority: 1
  });
  const [editingId, setEditingId] = useState(null);
  const [fontSize, setFontSize] = useState(14);
  const [textAlign, setTextAlign] = useState('left');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  // Fetch rules on component mount
  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllRules({ status: 'active' });
      setRules(data);
      console.log('✅ Rules loaded successfully:', data);
    } catch (err) {
      console.error('❌ Error fetching rules:', err);
      setError(err.message || 'Failed to load rules');
    } finally {
      setLoading(false);
    }
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const handleAddRule = async () => {
    // Validation
    if (!newRule.title.trim()) {
      setError('Please enter a rule title');
      return;
    }

    if (!newRule.content.trim()) {
      setError('Please enter rule content');
      return;
    }

    const ruleData = {
      title: newRule.title.trim(),
      content: newRule.content.trim(),
      isRequired: newRule.isRequired,
      priority: newRule.priority,
      fontSize,
      textAlign,
      formatting: {
        bold: isBold,
        italic: isItalic,
        underline: isUnderline
      },
      status: 'active'
    };

    try {
      setSaving(true);
      setError(null);

      if (editingId) {
        // Update existing rule
        console.log('📝 Updating rule:', editingId, ruleData);
        const updatedRule = await updateRule(editingId, ruleData);
        setRules(prev => prev.map(r => r._id === editingId ? updatedRule : r));
        showSuccessMessage('✅ Rule updated successfully!');
        setEditingId(null);
      } else {
        // Create new rule
        console.log('➕ Creating new rule:', ruleData);
        const createdRule = await createRule(ruleData);
        setRules(prev => [...prev, createdRule]);
        showSuccessMessage('✅ Rule created successfully!');
      }

      // Reset form
      setNewRule({
        title: '',
        content: '',
        isRequired: true,
        priority: rules.length + 1
      });
      resetFormatting();
    } catch (err) {
      console.error('❌ Error saving rule:', err);
      setError(err.message || 'Failed to save rule');
    } finally {
      setSaving(false);
    }
  };

  const handleEditRule = (rule) => {
    setNewRule({
      title: rule.title,
      content: rule.content,
      isRequired: rule.isRequired,
      priority: rule.priority
    });
    setFontSize(rule.fontSize || 14);
    setTextAlign(rule.textAlign || 'left');
    setIsBold(rule.formatting?.bold || false);
    setIsItalic(rule.formatting?.italic || false);
    setIsUnderline(rule.formatting?.underline || false);
    setEditingId(rule._id);
    
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteRule = async (id) => {
    if (!window.confirm('Are you sure you want to delete this rule? This action cannot be undone.')) {
      return;
    }

    try {
      setError(null);
      await deleteRule(id);
      setRules(prev => prev.filter(rule => rule._id !== id));
      showSuccessMessage('✅ Rule deleted successfully!');
    } catch (err) {
      console.error('❌ Error deleting rule:', err);
      setError(err.message || 'Failed to delete rule');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewRule({
      title: '',
      content: '',
      isRequired: true,
      priority: rules.length + 1
    });
    resetFormatting();
    setError(null);
  };

  const resetFormatting = () => {
    setFontSize(14);
    setTextAlign('left');
    setIsBold(false);
    setIsItalic(false);
    setIsUnderline(false);
  };

  const handleTextFormat = (format) => {
    switch (format) {
      case 'bold':
        setIsBold(!isBold);
        break;
      case 'italic':
        setIsItalic(!isItalic);
        break;
      case 'underline':
        setIsUnderline(!isUnderline);
        break;
      default:
        break;
    }
  };

  const handleAlignment = (alignment) => {
    setTextAlign(alignment);
  };

  const getTextStyle = () => {
    return {
      fontSize: `${fontSize}px`,
      textAlign,
      fontWeight: isBold ? 'bold' : 'normal',
      fontStyle: isItalic ? 'italic' : 'normal',
      textDecoration: isUnderline ? 'underline' : 'none'
    };
  };

  const sortedRules = [...rules].sort((a, b) => a.priority - b.priority);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/40 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading rules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/40 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-2xl p-4 flex items-center gap-3 animate-fade-in shadow-lg">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-green-800 dark:text-green-200 font-medium">{successMessage}</span>
            <button 
              onClick={() => setSuccessMessage('')}
              className="ml-auto text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-2xl p-4 flex items-center gap-3 shadow-lg">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
            <span className="text-red-800 dark:text-red-200 font-medium">{error}</span>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700 dark:hover:text-red-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

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
          <span className="text-gray-900 dark:text-white font-semibold">Rules & Regulations</span>
        </div>

        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <Scale className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                  Rules & Regulations
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Define and manage institute rules and regulations
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 px-4 py-2 rounded-xl border border-blue-200 dark:border-blue-800">
              <span className="text-red-500 font-semibold text-sm">* Required</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600 dark:text-gray-400 text-sm">Optional</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
          {/* Section Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                {editingId ? 'Edit Rule' : 'Create New Rule'}
              </h2>
              {editingId && (
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all flex items-center gap-2 font-medium"
                >
                  <X className="w-4 h-4" />
                  Cancel Edit
                </button>
              )}
            </div>
          </div>

          {/* Editor Section */}
          <div className="p-8 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-gray-800">
            {/* Formatting Toolbar */}
            <div className="flex flex-wrap items-center gap-2 mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              {/* Font Size */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Font:</span>
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                >
                  {[10, 12, 14, 16, 18, 20, 24, 28, 32].map(size => (
                    <option key={size} value={size}>{size}px</option>
                  ))}
                </select>
              </div>

              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>

              {/* Text Formatting */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleTextFormat('bold')}
                  className={`p-2 rounded-lg transition-all ${isBold ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                  title="Bold"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleTextFormat('italic')}
                  className={`p-2 rounded-lg transition-all ${isItalic ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                  title="Italic"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleTextFormat('underline')}
                  className={`p-2 rounded-lg transition-all ${isUnderline ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                  title="Underline"
                >
                  <Underline className="w-4 h-4" />
                </button>
              </div>

              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>

              {/* Text Alignment */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleAlignment('left')}
                  className={`p-2 rounded-lg transition-all ${textAlign === 'left' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                  title="Align Left"
                >
                  <AlignLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleAlignment('center')}
                  className={`p-2 rounded-lg transition-all ${textAlign === 'center' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                  title="Align Center"
                >
                  <AlignCenter className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleAlignment('right')}
                  className={`p-2 rounded-lg transition-all ${textAlign === 'right' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                  title="Align Right"
                >
                  <AlignRight className="w-4 h-4" />
                </button>
              </div>

              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>

              {/* Lists */}
              <div className="flex items-center space-x-1">
                <button 
                  className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all" 
                  title="Bullet List"
                >
                  <List className="w-4 h-4" />
                </button>
                <button 
                  className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all" 
                  title="Numbered List"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
              </div>

              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>

              {/* Media */}
              <div className="flex items-center space-x-1">
                <button 
                  className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all" 
                  title="Insert Link"
                >
                  <Link className="w-4 h-4" />
                </button>
                <button 
                  className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all" 
                  title="Insert Image"
                >
                  <Image className="w-4 h-4" />
                </button>
                <button 
                  className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all" 
                  title="Attach File"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Rule Input Form */}
            <div className="space-y-6">
              {/* Required/Optional Toggle */}
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input
                    type="radio"
                    checked={newRule.isRequired}
                    onChange={() => setNewRule(prev => ({ ...prev, isRequired: true }))}
                    className="text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Required*
                  </span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input
                    type="radio"
                    checked={!newRule.isRequired}
                    onChange={() => setNewRule(prev => ({ ...prev, isRequired: false }))}
                    className="text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Optional
                  </span>
                </label>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Rule Title {newRule.isRequired && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  value={newRule.title}
                  onChange={(e) => setNewRule(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter rule title (e.g., Attendance Policy, Dress Code)"
                  className="w-full px-4 py-3.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900/50 dark:text-white transition-all placeholder:text-gray-400"
                />
              </div>

              {/* Content Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Rule Content {newRule.isRequired && <span className="text-red-500">*</span>}
                </label>
                <div className="border-2 border-gray-200 dark:border-gray-700 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white dark:bg-gray-900/50 overflow-hidden">
                  <textarea
                    value={newRule.content}
                    onChange={(e) => setNewRule(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Enter detailed rule content and description..."
                    rows="6"
                    style={getTextStyle()}
                    className="w-full px-4 py-3 rounded-xl resize-none focus:outline-none dark:text-white bg-transparent placeholder:text-gray-400"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Characters: {newRule.content.length} | Use the formatting toolbar above to style your text
                </p>
              </div>

              {/* Priority Input */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-3">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Priority Order:
                  </label>
                  <input
                    type="number"
                    value={newRule.priority}
                    onChange={(e) => setNewRule(prev => ({ ...prev, priority: parseInt(e.target.value) || 1 }))}
                    min="1"
                    className="w-24 px-3 py-2 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    (Lower number = Higher priority)
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={resetFormatting}
                    className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all font-semibold hover:scale-105 active:scale-95"
                  >
                    Reset Format
                  </button>
                  <button
                    onClick={handleAddRule}
                    disabled={!newRule.title.trim() || !newRule.content.trim() || saving}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-lg hover:shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        {editingId ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                        <span>{editingId ? 'Update Rule' : 'Add Rule'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Rules List */}
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                Existing Rules
              </h3>
              <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 rounded-xl font-semibold text-sm border border-blue-200 dark:border-blue-800">
                {sortedRules.length} rule{sortedRules.length !== 1 ? 's' : ''}
              </span>
            </div>

            {sortedRules.length > 0 ? (
              <div className="space-y-4">
                {sortedRules.map((rule, index) => (
                  <div
                    key={rule._id}
                    className="border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:border-blue-300 dark:hover:border-blue-600 transition-all hover:shadow-lg bg-white dark:bg-gray-800"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center flex-wrap gap-3 mb-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            Priority #{rule.priority}
                          </span>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                            rule.isRequired 
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800' 
                              : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800'
                          }`}>
                            {rule.isRequired ? '⚠️ Required' : '✓ Optional'}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                            Created: {new Date(rule.createdAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                        
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                          {rule.title}
                        </h4>
                        
                        <div 
                          style={{
                            fontSize: `${rule.fontSize}px`,
                            textAlign: rule.textAlign,
                            fontWeight: rule.formatting?.bold ? 'bold' : 'normal',
                            fontStyle: rule.formatting?.italic ? 'italic' : 'normal',
                            textDecoration: rule.formatting?.underline ? 'underline' : 'none'
                          }}
                          className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed"
                        >
                          {rule.content}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleEditRule(rule)}
                          className="p-2.5 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-xl transition-all hover:scale-110 active:scale-95"
                          title="Edit Rule"
                        >
                          <Edit3 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteRule(rule._id)}
                          className="p-2.5 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30 rounded-xl transition-all hover:scale-110 active:scale-95"
                          title="Delete Rule"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full mb-4 shadow-inner">
                  <Eye className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No Rules Defined Yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Start creating rules and regulations for your institute to ensure smooth operations and compliance.
                </p>
                <button
                  onClick={() => {
                    const input = document.querySelector('input[placeholder*="Enter rule title"]');
                    if (input) {
                      input.focus();
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
                >
                  <Plus className="w-5 h-5" />
                  Create First Rule
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RulesRegulations;