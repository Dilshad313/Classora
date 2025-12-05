import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ChevronRight, Search, Copy, FileText, FileSpreadsheet, Printer, Download, Users } from 'lucide-react';

const StudentInfo = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const studentsData = [
    { id: 'STU001', name: 'Arun P', fatherName: 'Prakash Kumar', class: 'Grade 10-A', discount: '10%', admissionDate: '2023-04-15', dob: '2008-05-15', age: 16, gender: 'Male', birthFormId: 'BF2008001' },
    { id: 'STU002', name: 'Priya Sharma', fatherName: 'Rajesh Sharma', class: 'Grade 10-A', discount: '0%', admissionDate: '2023-04-16', dob: '2008-08-22', age: 16, gender: 'Female', birthFormId: 'BF2008002' },
    { id: 'STU003', name: 'Rahul Kumar', fatherName: 'Suresh Kumar', class: 'Grade 11-A', discount: '15%', admissionDate: '2022-04-10', dob: '2007-03-10', age: 17, gender: 'Male', birthFormId: 'BF2007001' },
    { id: 'STU004', name: 'Sneha Reddy', fatherName: 'Venkat Reddy', class: 'Grade 9-A', discount: '5%', admissionDate: '2024-04-12', dob: '2009-11-05', age: 15, gender: 'Female', birthFormId: 'BF2009001' },
    { id: 'STU005', name: 'Vikram Singh', fatherName: 'Amarjeet Singh', class: 'Grade 10-B', discount: '0%', admissionDate: '2023-04-18', dob: '2008-07-18', age: 16, gender: 'Male', birthFormId: 'BF2008003' },
    { id: 'STU006', name: 'Anjali Patel', fatherName: 'Ramesh Patel', class: 'Grade 11-B', discount: '20%', admissionDate: '2022-04-15', dob: '2007-01-25', age: 17, gender: 'Female', birthFormId: 'BF2007002' },
    { id: 'STU007', name: 'Karthik Rao', fatherName: 'Mohan Rao', class: 'Grade 9-B', discount: '0%', admissionDate: '2024-04-20', dob: '2009-09-30', age: 15, gender: 'Male', birthFormId: 'BF2009002' },
    { id: 'STU008', name: 'Divya Menon', fatherName: 'Krishnan Menon', class: 'Grade 10-A', discount: '10%', admissionDate: '2023-04-22', dob: '2008-12-12', age: 15, gender: 'Female', birthFormId: 'BF2008004' },
    { id: 'STU009', name: 'Arjun Nair', fatherName: 'Sunil Nair', class: 'Grade 11-A', discount: '5%', admissionDate: '2022-04-25', dob: '2007-06-08', age: 17, gender: 'Male', birthFormId: 'BF2007003' },
    { id: 'STU010', name: 'Meera Iyer', fatherName: 'Balaji Iyer', class: 'Grade 9-A', discount: '0%', admissionDate: '2024-04-28', dob: '2009-04-20', age: 15, gender: 'Female', birthFormId: 'BF2009003' },
    { id: 'STU011', name: 'Rohan Gupta', fatherName: 'Vijay Gupta', class: 'Grade 10-B', discount: '15%', admissionDate: '2023-05-01', dob: '2008-10-15', age: 16, gender: 'Male', birthFormId: 'BF2008005' },
    { id: 'STU012', name: 'Kavya Desai', fatherName: 'Anil Desai', class: 'Grade 11-B', discount: '0%', admissionDate: '2022-05-05', dob: '2007-02-28', age: 17, gender: 'Female', birthFormId: 'BF2007004' }
  ];

  const filteredData = studentsData.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.fatherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.class.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const copyToClipboard = () => {
    const text = studentsData.map(s => 
      `${s.id}\t${s.name}\t${s.fatherName}\t${s.class}\t${s.discount}\t${s.admissionDate}\t${s.dob}\t${s.age}\t${s.gender}\t${s.birthFormId}`
    ).join('\n');
    navigator.clipboard.writeText(text);
    alert('Data copied to clipboard!');
  };

  const exportToCSV = () => {
    const headers = ['Sr', 'ID', 'Student Name', 'Father Name', 'Class', 'Discount in Fee', 'Admission Date', 'Date of Birth', 'Age', 'Gender', 'Birth Form ID'];
    const rows = studentsData.map((s, idx) => [
      idx + 1, s.id, s.name, s.fatherName, s.class, s.discount, s.admissionDate, s.dob, s.age, s.gender, s.birthFormId
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_info.csv';
    a.click();
  };

  const exportToExcel = () => {
    const headers = ['Sr', 'ID', 'Student Name', 'Father Name', 'Class', 'Discount in Fee', 'Admission Date', 'Date of Birth', 'Age', 'Gender', 'Birth Form ID'];
    const rows = studentsData.map((s, idx) => [
      idx + 1, s.id, s.name, s.fatherName, s.class, s.discount, s.admissionDate, s.dob, s.age, s.gender, s.birthFormId
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
    a.download = 'student_info.xls';
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
          <span className="text-gray-900 dark:text-gray-100 font-semibold">Student Info</span>
        </div>

        {/* Header */}
        <div className="mb-8 print:hidden">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span>Student Information</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Complete student database with export options</p>
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
              <thead className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Sr</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Student Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Father Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Class</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Discount in Fee</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Admission Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Date of Birth</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Age</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Gender</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Birth Form ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {currentData.map((student, idx) => (
                  <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{startIndex + idx + 1}</td>
                    <td className="px-4 py-3 text-sm font-medium text-blue-600">{student.id}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">{student.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{student.fatherName}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{student.class}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{student.discount}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{student.admissionDate}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{student.dob}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{student.age}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        student.gender === 'Male' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
                      }`}>
                        {student.gender}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{student.birthFormId}</td>
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
                      ? 'bg-blue-600 text-white'
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

export default StudentInfo;
