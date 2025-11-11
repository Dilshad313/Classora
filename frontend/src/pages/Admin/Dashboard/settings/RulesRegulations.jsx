import React, { useState } from 'react';
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
  AlertCircle
} from 'lucide-react';

export const RulesRegulations = () => {
  const navigate = useNavigate();
  const [rules, setRules] = useState([]);
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

  const handleAddRule = () => {
    if (!newRule.title.trim() || !newRule.content.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    const rule = {
      id: Date.now(),
      ...newRule,
      fontSize,
      textAlign,
      formatting: {
        bold: isBold,
        italic: isItalic,
        underline: isUnderline
      },
      createdAt: new Date().toISOString()
    };

    if (editingId) {
      setRules(prev => prev.map(r => r.id === editingId ? rule : r));
      setEditingId(null);
    } else {
      setRules(prev => [...prev, rule]);
    }

    setNewRule({
      title: '',
      content: '',
      isRequired: true,
      priority: prev => prev.length + 1
    });
    resetFormatting();
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
    setEditingId(rule.id);
  };

  const handleDeleteRule = (id) => {
    setRules(prev => prev.filter(rule => rule.id !== id));
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/40 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-6 md:p-8">
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              Create New Rule
            </h2>
          </div>

          {/* Editor Section */}
          <div className="p-8 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-gray-800">
            {/* Formatting Toolbar */}
            <div className="flex flex-wrap items-center gap-2 mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              {/* Font Size */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Font:</span>
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {[10, 12, 14, 16, 18, 20, 24, 28, 32].map(size => (
                    <option key={size} value={size}>{size}px</option>
                  ))}
                </select>
              </div>

              <div className="w-px h-6 bg-gray-300"></div>

              {/* Text Formatting */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleTextFormat('bold')}
                  className={`p-2 rounded ${isBold ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-200'}`}
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleTextFormat('italic')}
                  className={`p-2 rounded ${isItalic ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-200'}`}
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleTextFormat('underline')}
                  className={`p-2 rounded ${isUnderline ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-200'}`}
                >
                  <Underline className="w-4 h-4" />
                </button>
              </div>

              <div className="w-px h-6 bg-gray-300"></div>

              {/* Text Alignment */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleAlignment('left')}
                  className={`p-2 rounded ${textAlign === 'left' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-200'}`}
                >
                  <AlignLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleAlignment('center')}
                  className={`p-2 rounded ${textAlign === 'center' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-200'}`}
                >
                  <AlignCenter className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleAlignment('right')}
                  className={`p-2 rounded ${textAlign === 'right' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-200'}`}
                >
                  <AlignRight className="w-4 h-4" />
                </button>
              </div>

              <div className="w-px h-6 bg-gray-300"></div>

              {/* Lists */}
              <div className="flex items-center space-x-1">
                <button className="p-2 rounded text-gray-600 hover:bg-gray-200">
                  <List className="w-4 h-4" />
                </button>
                <button className="p-2 rounded text-gray-600 hover:bg-gray-200">
                  <ListOrdered className="w-4 h-4" />
                </button>
              </div>

              <div className="w-px h-6 bg-gray-300"></div>

              {/* Media */}
              <div className="flex items-center space-x-1">
                <button className="p-2 rounded text-gray-600 hover:bg-gray-200">
                  <Link className="w-4 h-4" />
                </button>
                <button className="p-2 rounded text-gray-600 hover:bg-gray-200">
                  <Image className="w-4 h-4" />
                </button>
                <button className="p-2 rounded text-gray-600 hover:bg-gray-200">
                  <Paperclip className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Rule Input Form */}
            <div className="space-y-4">
              {/* Required/Optional Toggle */}
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={newRule.isRequired}
                    onChange={() => setNewRule(prev => ({ ...prev, isRequired: true }))}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Required*</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={!newRule.isRequired}
                    onChange={() => setNewRule(prev => ({ ...prev, isRequired: false }))}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Optional</span>
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
                  placeholder="Enter rule title"
                  className="w-full px-4 py-3.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900/50 dark:text-white transition-all"
                />
              </div>

              {/* Content Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Rule Content {newRule.isRequired && <span className="text-red-500">*</span>}
                </label>
                <div className="border-2 border-gray-200 dark:border-gray-700 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white dark:bg-gray-900/50">
                  <textarea
                    value={newRule.content}
                    onChange={(e) => setNewRule(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Enter rule content and description..."
                    rows="6"
                    style={getTextStyle()}
                    className="w-full px-4 py-3 rounded-xl resize-none focus:outline-none dark:text-white"
                  />
                </div>
              </div>

              {/* Priority Input */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Priority:</label>
                  <input
                    type="number"
                    value={newRule.priority}
                    onChange={(e) => setNewRule(prev => ({ ...prev, priority: parseInt(e.target.value) || 1 }))}
                    min="1"
                    className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={resetFormatting}
                    className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all font-semibold hover:scale-105 active:scale-95"
                  >
                    Reset
                  </button>
                  <button
                    onClick={handleAddRule}
                    disabled={!newRule.title.trim() || !newRule.content.trim()}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-lg hover:shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95"
                  >
                    {editingId ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    <span>{editingId ? 'Update Rule' : 'Add Rule'}</span>
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
                    key={rule.id}
                    className="border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:border-blue-300 dark:hover:border-blue-600 transition-all hover:shadow-lg bg-white dark:bg-gray-800"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            #{rule.priority}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            rule.isRequired 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {rule.isRequired ? 'Required' : 'Optional'}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(rule.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{rule.title}</h4>
                        
                        <div 
                          style={{
                            fontSize: `${rule.fontSize}px`,
                            textAlign: rule.textAlign,
                            fontWeight: rule.formatting.bold ? 'bold' : 'normal',
                            fontStyle: rule.formatting.italic ? 'italic' : 'normal',
                            textDecoration: rule.formatting.underline ? 'underline' : 'none'
                          }}
                          className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed"
                        >
                          {rule.content}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleEditRule(rule)}
                          className="p-2.5 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-xl transition-all hover:scale-110"
                          title="Edit Rule"
                        >
                          <Edit3 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteRule(rule.id)}
                          className="p-2.5 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30 rounded-xl transition-all hover:scale-110"
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
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                  <Eye className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Rules Defined Yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Add your first rule using the form above.
                </p>
                <button
                  onClick={() => document.querySelector('input[placeholder="Enter rule title"]').focus()}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
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