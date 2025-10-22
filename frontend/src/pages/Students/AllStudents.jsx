import { useState } from 'react';
import { Search, Filter, Download, Plus, Edit, Trash2, Eye, Mail, Phone } from 'lucide-react';

const AllStudents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('all');

  const students = [
    {
      id: 1,
      rollNo: '001',
      name: 'Emma Johnson',
      class: 'Grade 6',
      section: 'A',
      gender: 'Female',
      dob: '2012-05-15',
      parent: 'Michael Johnson',
      phone: '+1 (555) 123-4567',
      email: 'emma.j@example.com',
      admission: '2024-04-01',
      status: 'Active'
    },
    {
      id: 2,
      rollNo: '002',
      name: 'Liam Smith',
      class: 'Grade 6',
      section: 'A',
      gender: 'Male',
      dob: '2012-08-22',
      parent: 'Sarah Smith',
      phone: '+1 (555) 234-5678',
      email: 'liam.s@example.com',
      admission: '2024-04-01',
      status: 'Active'
    },
    {
      id: 3,
      rollNo: '003',
      name: 'Olivia Brown',
      class: 'Grade 7',
      section: 'B',
      gender: 'Female',
      dob: '2011-03-10',
      parent: 'David Brown',
      phone: '+1 (555) 345-6789',
      email: 'olivia.b@example.com',
      admission: '2023-04-01',
      status: 'Active'
    },
    {
      id: 4,
      rollNo: '004',
      name: 'Noah Wilson',
      class: 'Grade 8',
      section: 'A',
      gender: 'Male',
      dob: '2010-11-30',
      parent: 'Jennifer Wilson',
      phone: '+1 (555) 456-7890',
      email: 'noah.w@example.com',
      admission: '2022-04-01',
      status: 'Active'
    },
    {
      id: 5,
      rollNo: '005',
      name: 'Ava Martinez',
      class: 'Grade 6',
      section: 'B',
      gender: 'Female',
      dob: '2012-07-18',
      parent: 'Carlos Martinez',
      phone: '+1 (555) 567-8901',
      email: 'ava.m@example.com',
      admission: '2024-04-01',
      status: 'Active'
    },
  ];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNo.includes(searchTerm);
    const matchesClass = filterClass === 'all' || student.class === filterClass;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">All Students</h1>
          <p className="text-gray-600 mt-1">Manage and view all student records</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add New Student
        </button>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or roll number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-11"
              />
            </div>
          </div>

          <div>
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="input-field"
            >
              <option value="all">All Classes</option>
              <option value="Grade 6">Grade 6</option>
              <option value="Grade 7">Grade 7</option>
              <option value="Grade 8">Grade 8</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button className="btn-secondary flex items-center gap-2 flex-1">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
            <button className="btn-secondary flex items-center gap-2">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Roll No
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Parent
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-semibold text-gray-800">{student.rollNo}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-gray-700">
                      {student.class} - {student.section}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-gray-700">{student.parent}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-gray-600 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {student.phone}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-green-50 rounded-lg text-green-600 transition-colors" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold">1</span> to <span className="font-semibold">{filteredStudents.length}</span> of{' '}
            <span className="font-semibold">{students.length}</span> students
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
              Previous
            </button>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium">
              1
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
              2
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllStudents;
