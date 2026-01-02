import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ChevronRight, Search, Copy, FileText, FileSpreadsheet, Printer, Download, UserCheck, Filter, ChevronDown, X } from 'lucide-react';
import { 
  getParentInfo, 
  exportParentInfoCSV, 
  exportParentInfoExcel 
} from '../../../../services/reportApi';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ParentInfo = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [parentsData, setParentsData] = useState([]);
  const [totalParents, setTotalParents] = useState(0);
  const [filters, setFilters] = useState({
    class: 'all',
    fatherOccupation: 'all',
    fatherProfession: 'all'
  });
  const [availableClasses, setAvailableClasses] = useState([]);
  const [availableOccupations, setAvailableOccupations] = useState([]);
  const [availableProfessions, setAvailableProfessions] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchParentInfo();
    // Extract unique values from data for filters
    if (parentsData.length > 0) {
      const classes = [...new Set(parentsData.map(p => p.class))].sort();
      const occupations = [...new Set(parentsData.map(p => p.fatherOccupation).filter(Boolean))].sort();
      const professions = [...new Set(parentsData.map(p => p.fatherProfession).filter(Boolean))].sort();
      setAvailableClasses(classes);
      setAvailableOccupations(occupations);
      setAvailableProfessions(professions);
    }
  }, [currentPage, entriesPerPage, filters]);

  const fetchParentInfo = async () => {
    try {
      setLoading(true);
      const result = await getParentInfo({
        search: searchQuery,
        class: filters.class,
        fatherOccupation: filters.occupation,
        fatherProfession: filters.profession,
        page: currentPage,
        limit: entriesPerPage
      });
      
      setParentsData(result.data);
      setTotalParents(result.total);
      setTotalPages(result.totalPages);
      
      // Update available filters
      if (result.stats?.classDistribution) {
        setAvailableClasses(result.stats.classDistribution.map(c => c._id).filter(Boolean).sort());
      }
      if (result.stats?.occupationDistribution) {
        setAvailableOccupations(result.stats.occupationDistribution.map(o => o._id).filter(Boolean).sort());
      }
    } catch (error) {
      console.error('Error fetching parent info:', error);
      alert(error.message || 'Failed to load parent information');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      setCurrentPage(1);
      fetchParentInfo();
    }
  };

  const handleExportCSV = async () => {
    try {
      await exportParentInfoCSV({
        search: searchQuery,
        class: filters.class
      });
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert(error.message || 'Failed to export CSV');
    }
  };

  const handleExportExcel = async () => {
    try {
      await exportParentInfoExcel({
        search: searchQuery,
        class: filters.class
      });
    } catch (error) {
      console.error('Error exporting Excel:', error);
      alert(error.message || 'Failed to export Excel');
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(18);
    doc.text('Parent Information Report', 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Table headers
    const headers = [['Sr', 'ID', 'Name', 'Class', 'Father Name', 'National ID', 'Education', 'Mobile', 'Occupation', 'Profession', 'Income', 'Mother Name']];
    
    // Table data
    const data = parentsData.map((parent, index) => [
      (currentPage - 1) * entriesPerPage + index + 1,
      parent.studentId,
      parent.studentName,
      parent.classDisplay,
      parent.fatherName,
      parent.fatherNationalId || '-',
      parent.fatherEducation || '-',
      parent.fatherMobile,
      parent.fatherOccupation || '-',
      parent.fatherProfession || '-',
      parent.fatherIncome ? `₹${parent.fatherIncome.toLocaleString()}` : '₹0',
      parent.motherName
    ]);
    
    // Generate table
    autoTable(doc, {
      head: headers,
      body: data,
      startY: 40,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [79, 129, 189] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { top: 40 }
    });
    
    // Save PDF
    doc.save('parent_info.pdf');
  };

  const copyToClipboard = () => {
    if (parentsData.length === 0) {
      alert('No data to copy');
      return;
    }

    const headers = ['Sr', 'ID', 'Name', 'Class', 'Father Name', 'Father National ID', 'Education', 'Mobile No', 'Occupation', 'Profession', 'Income', 'Mother Name'];
    const rows = parentsData.map((p, idx) => [
      (currentPage - 1) * entriesPerPage + idx + 1,
      p.studentId,
      p.studentName,
      p.classDisplay,
      p.fatherName,
      p.fatherNationalId || '',
      p.fatherEducation || '',
      p.fatherMobile,
      p.fatherOccupation || '',
      p.fatherProfession || '',
      p.fatherIncome ? `₹${p.fatherIncome.toLocaleString()}` : '₹0',
      p.motherName
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join('\t')).join('\n');
    navigator.clipboard.writeText(csvContent)
      .then(() => alert('Data copied to clipboard!'))
      .catch(err => console.error('Failed to copy:', err));
  };

  const handlePrint = () => {
    window.print();
  };

  const resetFilters = () => {
    setFilters({
      class: 'all',
      fatherOccupation: 'all',
      fatherProfession: 'all'
    });
    setSearchQuery('');
    setCurrentPage(1);
  };

  const filteredData = parentsData.filter(parent =>
    !searchQuery || 
    parent.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    parent.studentId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    parent.fatherName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    parent.class?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    parent.motherName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm print:hidden">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors font-medium">
            <Home className="w-4 h-4" /><span>Dashboard</span>
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-blue-600 font-semibold">Reports</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 dark:text-gray-100 font-semibold">Parent Info</span>
        </div>

        {/* Header */}
        <div className="mb-8 print:hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <UserCheck className="w-6 h-6 text-white" />
                </div>
                <span>Parent Information</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {loading ? 'Loading...' : `${totalParents} parent records found`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg"
              >
                <Filter className="w-4 h-4" />
                Filters
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              <button
                onClick={resetFilters}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all shadow-lg"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6 print:hidden">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Filter Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Class</label>
                <select
                  value={filters.class}
                  onChange={(e) => setFilters({...filters, class: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                >
                  <option value="all">All Classes</option>
                  {availableClasses.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Occupation</label>
                <select
                  value={filters.fatherOccupation}
                  onChange={(e) => setFilters({...filters, fatherOccupation: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                >
                  <option value="all">All Occupations</option>
                  {availableOccupations.map(occ => (
                    <option key={occ} value={occ}>{occ}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Profession</label>
                <select
                  value={filters.fatherProfession}
                  onChange={(e) => setFilters({...filters, fatherProfession: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                >
                  <option value="all">All Professions</option>
                  {availableProfessions.map(prof => (
                    <option key={prof} value={prof}>{prof}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  fetchParentInfo();
                  setShowFilters(false);
                }}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          {/* Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 print:hidden">
            {/* Export Buttons */}
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={copyToClipboard} 
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={parentsData.length === 0 || loading}
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
              <button 
                onClick={handleExportCSV} 
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={parentsData.length === 0 || loading}
              >
                <FileText className="w-4 h-4" />
                CSV
              </button>
              <button 
                onClick={handleExportExcel} 
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={parentsData.length === 0 || loading}
              >
                <FileSpreadsheet className="w-4 h-4" />
                Excel
              </button>
              <button 
                onClick={exportToPDF} 
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={parentsData.length === 0 || loading}
              >
                <Download className="w-4 h-4" />
                PDF
              </button>
              <button 
                onClick={handlePrint} 
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearch}
                className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setCurrentPage(1);
                    fetchParentInfo();
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Entries Selector */}
          <div className="flex items-center gap-2 mb-4 print:hidden">
            <span className="text-sm text-gray-600 dark:text-gray-400">Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => { 
                setEntriesPerPage(Number(e.target.value)); 
                setCurrentPage(1); 
              }}
              className="px-3 py-1 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500"
              disabled={loading}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-600 dark:text-gray-400">entries</span>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Sr</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Class</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Father Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Father National ID</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Education</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Mobile No</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Occupation</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Profession</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Income</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Mother Name</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {currentData.length > 0 ? (
                      currentData.map((parent, idx) => (
                        <tr key={parent._id || idx} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{startIndex + idx + 1}</td>
                          <td className="px-4 py-3 text-sm font-medium text-purple-600">{parent.studentId}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">{parent.studentName}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{parent.classDisplay}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{parent.fatherName}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{parent.fatherNationalId || '-'}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              {parent.fatherEducation || '-'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{parent.fatherMobile}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{parent.fatherOccupation || '-'}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              {parent.fatherProfession || '-'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-green-600">
                            {parent.fatherIncome ? `₹${parent.fatherIncome.toLocaleString()}` : '₹0'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{parent.motherName}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="12" className="px-4 py-12 text-center text-gray-500 dark:text-gray-400">
                          {searchQuery ? 'No matching parent records found' : 'No parent records available'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4 print:hidden">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} entries
                  {totalParents > filteredData.length && ` (Filtered from ${totalParents} total)`}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1 || loading}
                    className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = idx + 1;
                    } else if (currentPage <= 3) {
                      pageNum = idx + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + idx;
                    } else {
                      pageNum = currentPage - 2 + idx;
                    }

                    return pageNum <= totalPages && pageNum >= 1 ? (
                      <button
                        key={idx}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          currentPage === pageNum
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ) : null;
                  })}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages || loading}
                    className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print\\:hidden { display: none !important; }
          table, table * { visibility: visible; }
          table { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default ParentInfo;