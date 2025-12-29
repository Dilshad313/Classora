import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home,
  ChevronRight,
  Copy,
  FileSpreadsheet,
  FileText,
  Printer,
  Download,
  Filter,
  Search,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  Users,
  Lock,
  Loader,
  RefreshCw,
  X,
  AlertTriangle,
  Save,
  XCircle
} from 'lucide-react';
import { getLoginCredentials, updateLoginCredentials, deleteStudent } from '../../../../services/studentApi';
import { classApi } from '../../../../services/classApi';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const ManageLogin = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [classes, setClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [editForm, setEditForm] = useState({ username: '', password: '' });

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    fetchCredentials();
  }, [selectedClass]);

  const fetchClasses = async () => {
    try {
      setLoadingClasses(true);
      const data = await classApi.getAllClassNames();
      setClasses(data || []);
    } catch (error) {
      console.error('Failed to load classes', error);
      toast.error('Failed to load classes');
      setClasses([]);
    } finally {
      setLoadingClasses(false);
    }
  };

  const fetchCredentials = async () => {
    try {
      setLoading(true);
      const filters = {
        class: selectedClass !== 'all' ? selectedClass : undefined,
        search: searchTerm || undefined
      };
      
      const data = await getLoginCredentials(filters);
      setCredentials(data || []);
    } catch (error) {
      console.error('Failed to load login credentials', error);
      toast.error('Failed to load login credentials');
      setCredentials([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchCredentials();
  };

  // Toggle password visibility
  const togglePasswordVisibility = (id) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Copy to clipboard
  const handleCopy = () => {
    const headers = ['ID', 'Student Name', 'Class', 'Username', 'Password'];
    const rows = credentials.map(s => [
      s.registrationNo,
      s.studentName,
      `Class ${s.selectClass} - ${s.section}`,
      s.username,
      s.plainPassword || '******'
    ]);
    
    const text = [headers, ...rows].map(row => row.join('\t')).join('\n');
    navigator.clipboard.writeText(text);
    toast.success('Login credentials copied to clipboard!');
  };

  // Export to CSV
  const handleCSV = () => {
    const headers = ['ID', 'Student Name', 'Class', 'Username', 'Password'];
    const rows = credentials.map(s => [
      s.registrationNo,
      s.studentName,
      `Class ${s.selectClass} - ${s.section}`,
      s.username,
      s.plainPassword || '******'
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `student_login_credentials_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success('CSV exported successfully!');
  };

  // Export to Excel
  const handleExcel = () => {
    const headers = ['ID', 'Student Name', 'Class', 'Username', 'Password'];
    const rows = credentials.map(s => [
      s.registrationNo,
      s.studentName,
      `Class ${s.selectClass} - ${s.section}`,
      s.username,
      s.plainPassword || '******'
    ]);
    
    let tableHTML = '<table border="1"><thead><tr>';
    headers.forEach(header => {
      tableHTML += `<th>${header}</th>`;
    });
    tableHTML += '</tr></thead><tbody>';
    
    rows.forEach(row => {
      tableHTML += '<tr>';
      row.forEach(cell => {
        tableHTML += `<td>${cell}</td>`;
      });
      tableHTML += '</tr>';
    });
    tableHTML += '</tbody></table>';
    
    const blob = new Blob([tableHTML], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `student_login_credentials_${new Date().toISOString().split('T')[0]}.xls`;
    link.click();
    toast.success('Excel file exported successfully!');
  };

  // Export to PDF
  // Export to PDF
  const handlePDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text('CLASSORA INSTITUTE', 105, 15, { align: 'center' });
    
    doc.setFontSize(14);
    doc.text('Student Login Credentials', 105, 25, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    const dateStr = new Date().toLocaleDateString();
    const classStr = selectedClass === 'all' ? 'All Classes' : `Class ${selectedClass}`;
    doc.text(`${classStr} - Generated on ${dateStr}`, 105, 32, { align: 'center' });
    
    // Table
    const headers = [['ID', 'Student Name', 'Class', 'Username', 'Password']];
    const data = credentials.map(s => [
      s.registrationNo,
      s.studentName,
      `Class ${s.selectClass} - ${s.section}`,
      s.username,
      s.plainPassword || '******'
    ]);

    autoTable(doc, {
      head: headers,
      body: data,
      startY: 40,
      headStyles: { fillColor: [66, 139, 202] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { top: 40 },
    });

    const fileName = `student_login_credentials_${classStr.replace(' ', '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    toast.success('PDF downloaded successfully!');
  };

  // Print
  const handlePrint = () => {
    window.print();
  };

  // Handle edit credentials - Open Modal
  const handleEdit = (student) => {
    setCurrentStudent(student);
    setEditForm({ 
      username: student.username || '', 
      password: '' // Don't show current password, only allow reset
    });
    setIsEditModalOpen(true);
  };

  // Submit Edit Form
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!currentStudent) return;

    try {
      setUpdating(true);
      const updates = {};
      
      if (editForm.username && editForm.username !== currentStudent.username) {
        updates.username = editForm.username;
      }
      
      if (editForm.password) {
        updates.password = editForm.password;
      }

      if (Object.keys(updates).length === 0) {
        toast('No changes made');
        setIsEditModalOpen(false);
        return;
      }

      await updateLoginCredentials(currentStudent._id, updates);
      toast.success('Credentials updated successfully');
      setIsEditModalOpen(false);
      await fetchCredentials(); // Refresh list
    } catch (error) {
      console.error('Failed to update credentials:', error);
      toast.error(error.message || 'Failed to update credentials');
    } finally {
      setUpdating(false);
    }
  };

  // Handle delete - Open Modal
  const handleDelete = (student) => {
    setCurrentStudent(student);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!currentStudent) return;

    try {
      await deleteStudent(currentStudent._id);
      toast.success('Student login credentials removed successfully');
      setIsDeleteModalOpen(false);
      fetchCredentials();
    } catch (error) {
      console.error('Failed to delete student', error);
      toast.error(error.message || 'Failed to delete student');
    }
  };

  const handleRefresh = () => {
    fetchCredentials();
    toast.success('Credentials refreshed');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 mb-6 text-sm print:hidden">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span className="text-blue-600 dark:text-blue-400 font-semibold">Students</span>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span className="text-gray-900 dark:text-gray-100 font-semibold">Manage Login</span>
        </div>

        {/* Header */}
        <div className="mb-8 print:hidden">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Student Login</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Manage student login credentials and access</p>
            </div>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-600 transition-all font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6 print:hidden transition-colors duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search by name, ID, or username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-sm transition-colors"
              />
            </div>

            {/* Class Filter */}
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                disabled={loadingClasses}
                className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium transition-colors disabled:opacity-50"
              >
                <option value="all" className="dark:bg-gray-800">All Classes</option>
                {classes.map((cls) => (
                  <option key={cls} value={cls} className="dark:bg-gray-800">Class {cls}</option>
                ))}
              </select>
              {loadingClasses && (
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>
          </div>

          {/* Export Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-xl transition-all font-medium shadow-lg hover:shadow-xl"
            >
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </button>
            <button
              onClick={handleCSV}
              className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white rounded-xl transition-all font-medium shadow-lg hover:shadow-xl"
            >
              <FileText className="w-4 h-4" />
              <span>CSV</span>
            </button>
            <button
              onClick={handleExcel}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-xl transition-all font-medium shadow-lg hover:shadow-xl"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Excel</span>
            </button>
            <button
              onClick={handlePDF}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white rounded-xl transition-all font-medium shadow-lg hover:shadow-xl"
            >
              <Download className="w-4 h-4" />
              <span>PDF</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-xl transition-all font-medium shadow-lg hover:shadow-xl"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
          </div>
        )}

        {/* Login Credentials Table */}
        {!loading && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300">
            {/* Table Header - Print Only */}
            <div className="hidden print:block p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">CLASSORA INSTITUTE</h2>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 text-center mb-1">Student Login Credentials</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                {selectedClass === 'all' ? 'All Classes' : `Class ${selectedClass}`} - Generated on {new Date().toLocaleDateString()}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Student Name</th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Class</th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Username</th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Password</th>
                    <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider print:hidden">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {credentials.length > 0 ? (
                    credentials.map((student, index) => (
                      <tr 
                        key={student._id} 
                        className={`hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors ${
                          index % 2 === 0 
                            ? 'bg-white dark:bg-gray-800' 
                            : 'bg-gray-50 dark:bg-gray-900'
                        }`}
                      >
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">{student.registrationNo}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{student.studentName}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">Class {student.selectClass} - {student.section}</td>
                        <td className="px-6 py-4 text-sm font-mono text-blue-600 dark:text-blue-400 font-semibold">{student.username}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-mono font-semibold ${!student.plainPassword && visiblePasswords[student._id] ? 'text-gray-400 text-xs italic' : 'text-gray-900 dark:text-white'}`}>
                              {visiblePasswords[student._id] 
                                ? (student.plainPassword || 'Original password not stored') 
                                : '••••••••'}
                            </span>
                            <button
                              onClick={() => togglePasswordVisibility(student._id)}
                              className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors print:hidden"
                              title={visiblePasswords[student._id] ? 'Hide password' : 'Show password'}
                            >
                              {visiblePasswords[student._id] ? (
                                <EyeOff className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                              ) : (
                                <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 print:hidden">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEdit(student)}
                              disabled={updating}
                              className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-all disabled:opacity-50"
                              title="Edit login"
                            >
                              {updating ? <Loader className="w-4 h-4 animate-spin" /> : <Edit2 className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => handleDelete(student)}
                              className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-all"
                              title="Delete login"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <Lock className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
                          <p className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No login credentials found</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Try adjusting your search or filters</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer with Summary */}
            {credentials.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Total Students: <span className="text-blue-600 dark:text-blue-400 text-lg">{credentials.length}</span>
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Lock className="w-4 h-4" />
                    <span className="font-medium">Login credentials are confidential</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:block {
            display: block !important;
          }
          @page {
            size: A4 landscape;
            margin: 1cm;
          }
          table {
            page-break-inside: auto;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
        }
      `}</style>
      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm print:hidden">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Edit Login Credentials</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveEdit}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Student Name
                  </label>
                  <input
                    type="text"
                    value={currentStudent?.studentName || ''}
                    disabled
                    className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter username"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    New Password (Optional)
                  </label>
                  <div className="relative">
                     <Lock className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={editForm.password}
                      onChange={(e) => setEditForm(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="Enter new password to change"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Leave empty to keep current password</p>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  {updating ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm print:hidden">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Confirm Delete</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to remove login credentials for <span className="font-semibold text-gray-900 dark:text-white">{currentStudent?.studentName}</span>? This action cannot be undone.
              </p>
              
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-lg hover:shadow-red-600/30"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Credentials
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageLogin;