import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ChevronRight, Search, Copy, FileText, FileSpreadsheet, Printer, Download, UserCheck } from 'lucide-react';

const ParentInfo = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const parentsData = [
    { id: 'PAR001', name: 'Arun P', class: 'Grade 10-A', fatherName: 'Prakash Kumar', fatherNationalId: 'IN1234567890', education: 'B.Tech', mobile: '+91 9876543210', occupation: 'Engineer', profession: 'Software', income: '₹80,000', motherName: 'Lakshmi Kumar' },
    { id: 'PAR002', name: 'Priya Sharma', class: 'Grade 10-A', fatherName: 'Rajesh Sharma', fatherNationalId: 'IN2345678901', education: 'MBA', mobile: '+91 9876543211', occupation: 'Manager', profession: 'Business', income: '₹1,20,000', motherName: 'Sunita Sharma' },
    { id: 'PAR003', name: 'Rahul Kumar', class: 'Grade 11-A', fatherName: 'Suresh Kumar', fatherNationalId: 'IN3456789012', education: 'M.Sc', mobile: '+91 9876543212', occupation: 'Scientist', profession: 'Research', income: '₹95,000', motherName: 'Radha Kumar' },
    { id: 'PAR004', name: 'Sneha Reddy', class: 'Grade 9-A', fatherName: 'Venkat Reddy', fatherNationalId: 'IN4567890123', education: 'B.Com', mobile: '+91 9876543213', occupation: 'Businessman', profession: 'Trading', income: '₹1,50,000', motherName: 'Kavita Reddy' },
    { id: 'PAR005', name: 'Vikram Singh', class: 'Grade 10-B', fatherName: 'Amarjeet Singh', fatherNationalId: 'IN5678901234', education: 'B.A', mobile: '+91 9876543214', occupation: 'Army Officer', profession: 'Defense', income: '₹75,000', motherName: 'Harpreet Kaur' },
    { id: 'PAR006', name: 'Anjali Patel', class: 'Grade 11-B', fatherName: 'Ramesh Patel', fatherNationalId: 'IN6789012345', education: 'CA', mobile: '+91 9876543215', occupation: 'Accountant', profession: 'Finance', income: '₹1,10,000', motherName: 'Meena Patel' },
    { id: 'PAR007', name: 'Karthik Rao', class: 'Grade 9-B', fatherName: 'Mohan Rao', fatherNationalId: 'IN7890123456', education: 'MBBS', mobile: '+91 9876543216', occupation: 'Doctor', profession: 'Medical', income: '₹2,00,000', motherName: 'Savitri Rao' },
    { id: 'PAR008', name: 'Divya Menon', class: 'Grade 10-A', fatherName: 'Krishnan Menon', fatherNationalId: 'IN8901234567', education: 'LLB', mobile: '+91 9876543217', occupation: 'Lawyer', profession: 'Legal', income: '₹1,30,000', motherName: 'Priya Menon' },
    { id: 'PAR009', name: 'Arjun Nair', class: 'Grade 11-A', fatherName: 'Sunil Nair', fatherNationalId: 'IN9012345678', education: 'B.Arch', mobile: '+91 9876543218', occupation: 'Architect', profession: 'Construction', income: '₹90,000', motherName: 'Anjana Nair' },
    { id: 'PAR010', name: 'Meera Iyer', class: 'Grade 9-A', fatherName: 'Balaji Iyer', fatherNationalId: 'IN0123456789', education: 'B.E', mobile: '+91 9876543219', occupation: 'Civil Engineer', profession: 'Engineering', income: '₹85,000', motherName: 'Lalitha Iyer' },
    { id: 'PAR011', name: 'Rohan Gupta', class: 'Grade 10-B', fatherName: 'Vijay Gupta', fatherNationalId: 'IN1122334455', education: 'BBA', mobile: '+91 9876543220', occupation: 'Sales Manager', profession: 'Marketing', income: '₹70,000', motherName: 'Neha Gupta' },
    { id: 'PAR012', name: 'Kavya Desai', class: 'Grade 11-B', fatherName: 'Anil Desai', fatherNationalId: 'IN2233445566', education: 'M.Tech', mobile: '+91 9876543221', occupation: 'Tech Lead', profession: 'IT', income: '₹1,40,000', motherName: 'Pooja Desai' }
  ];

  const filteredData = parentsData.filter(parent =>
    parent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    parent.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    parent.fatherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    parent.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
    parent.motherName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const copyToClipboard = () => {
    const text = parentsData.map(p => 
      `${p.id}\t${p.name}\t${p.class}\t${p.fatherName}\t${p.fatherNationalId}\t${p.education}\t${p.mobile}\t${p.occupation}\t${p.profession}\t${p.income}\t${p.motherName}`
    ).join('\n');
    navigator.clipboard.writeText(text);
    alert('Data copied to clipboard!');
  };

  const exportToCSV = () => {
    const headers = ['Sr', 'ID', 'Name', 'Class', 'Father Name', 'Father National ID', 'Education', 'Mobile No', 'Occupation', 'Profession', 'Income', 'Mother Name'];
    const rows = parentsData.map((p, idx) => [
      idx + 1, p.id, p.name, p.class, p.fatherName, p.fatherNationalId, p.education, p.mobile, p.occupation, p.profession, p.income, p.motherName
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'parent_info.csv';
    a.click();
  };

  const exportToExcel = () => {
    const headers = ['Sr', 'ID', 'Name', 'Class', 'Father Name', 'Father National ID', 'Education', 'Mobile No', 'Occupation', 'Profession', 'Income', 'Mother Name'];
    const rows = parentsData.map((p, idx) => [
      idx + 1, p.id, p.name, p.class, p.fatherName, p.fatherNationalId, p.education, p.mobile, p.occupation, p.profession, p.income, p.motherName
    ]);
    
    let excelContent = '<table><thead><tr>';
    headers.forEach(h => excelContent += `<th>${h}</th>`);
    excelContent += '</tr></thead><tbody>';
    rows.forEach(row => {
      excelContent += '<tr>';
      row.forEach(cell => excelContent += `<td>${cell}</td>`);
      excelContent += '</tr>';
    });
    excelContent += '</tbody></table>';
    
    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'parent_info.xls';
    a.click();
  };

  const exportToPDF = () => {
    alert('PDF export functionality requires a library like jsPDF. This is a placeholder.');
  };

  const handlePrint = () => {
    window.print();
  };

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <span>Parent Information</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Complete parent database with contact and professional details</p>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          {/* Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 print:hidden">
            {/* Export Buttons */}
            <div className="flex flex-wrap gap-2">
              <button onClick={copyToClipboard} className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
                <Copy className="w-4 h-4" />
                Copy
              </button>
              <button onClick={exportToCSV} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                <FileText className="w-4 h-4" />
                CSV
              </button>
              <button onClick={exportToExcel} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                <FileSpreadsheet className="w-4 h-4" />
                Excel
              </button>
              <button onClick={exportToPDF} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                <Download className="w-4 h-4" />
                PDF
              </button>
              <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
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
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>
          </div>

          {/* Entries Selector */}
          <div className="flex items-center gap-2 mb-4 print:hidden">
            <span className="text-sm text-gray-600 dark:text-gray-400">Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="px-3 py-1 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-600 dark:text-gray-400">entries</span>
          </div>

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
                {currentData.map((parent, idx) => (
                  <tr key={parent.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{startIndex + idx + 1}</td>
                    <td className="px-4 py-3 text-sm font-medium text-purple-600">{parent.id}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">{parent.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{parent.class}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{parent.fatherName}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{parent.fatherNationalId}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {parent.education}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{parent.mobile}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{parent.occupation}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        {parent.profession}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-green-600">{parent.income}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{parent.motherName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4 print:hidden">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} entries
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === idx + 1
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
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
