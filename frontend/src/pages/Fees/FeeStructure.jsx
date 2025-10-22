import { useState } from 'react';
import { Plus, Edit, Trash2, DollarSign } from 'lucide-react';

const FeeStructure = () => {
  const [showModal, setShowModal] = useState(false);

  const feeStructures = [
    {
      id: 1,
      class: 'Grade 6',
      feeTypes: [
        { name: 'Tuition Fee', amount: 300, frequency: 'Quarterly' },
        { name: 'Lab Fee', amount: 50, frequency: 'Quarterly' },
        { name: 'Library Fee', amount: 25, frequency: 'Quarterly' },
        { name: 'Sports Fee', amount: 30, frequency: 'Quarterly' },
      ],
      total: 405
    },
    {
      id: 2,
      class: 'Grade 7',
      feeTypes: [
        { name: 'Tuition Fee', amount: 350, frequency: 'Quarterly' },
        { name: 'Lab Fee', amount: 60, frequency: 'Quarterly' },
        { name: 'Library Fee', amount: 25, frequency: 'Quarterly' },
        { name: 'Sports Fee', amount: 30, frequency: 'Quarterly' },
      ],
      total: 465
    },
    {
      id: 3,
      class: 'Grade 8',
      feeTypes: [
        { name: 'Tuition Fee', amount: 400, frequency: 'Quarterly' },
        { name: 'Lab Fee', amount: 75, frequency: 'Quarterly' },
        { name: 'Library Fee', amount: 25, frequency: 'Quarterly' },
        { name: 'Sports Fee', amount: 30, frequency: 'Quarterly' },
      ],
      total: 530
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Fee Structure</h1>
          <p className="text-gray-600 mt-1">Manage fee structure for different classes</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Fee Structure
        </button>
      </div>

      {/* Fee Structures */}
      <div className="grid gap-6">
        {feeStructures.map((structure) => (
          <div key={structure.id} className="card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{structure.class}</h3>
                  <p className="text-sm text-gray-600">Academic Year 2024-2025</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Fee Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Frequency
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {structure.feeTypes.map((fee, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-800">{fee.name}</td>
                      <td className="px-6 py-4 text-gray-700 font-semibold">${fee.amount}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                          {fee.frequency}
                        </span>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-green-50 font-bold">
                    <td className="px-6 py-4 text-gray-800">Total Quarterly Fee</td>
                    <td className="px-6 py-4 text-green-700 text-lg">${structure.total}</td>
                    <td className="px-6 py-4"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Add Fee Structure Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Add Fee Structure</h2>
            
            <form className="space-y-4">
              <div>
                <label className="label">Select Class</label>
                <select className="input-field" required>
                  <option value="">Choose a class</option>
                  <option value="Grade 6">Grade 6</option>
                  <option value="Grade 7">Grade 7</option>
                  <option value="Grade 8">Grade 8</option>
                </select>
              </div>

              <div>
                <label className="label">Academic Year</label>
                <input
                  type="text"
                  className="input-field"
                  value="2024-2025"
                  readOnly
                />
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-4">Fee Types</h3>
                
                <div className="space-y-3">
                  {['Tuition Fee', 'Lab Fee', 'Library Fee', 'Sports Fee'].map((feeType) => (
                    <div key={feeType} className="grid grid-cols-3 gap-3">
                      <input
                        type="text"
                        className="input-field"
                        value={feeType}
                        readOnly
                      />
                      <input
                        type="number"
                        className="input-field"
                        placeholder="Amount"
                      />
                      <select className="input-field">
                        <option>Quarterly</option>
                        <option>Monthly</option>
                        <option>Annually</option>
                        <option>One-time</option>
                      </select>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="mt-3 text-primary-600 text-sm font-medium hover:text-primary-700"
                >
                  + Add More Fee Type
                </button>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  Save Fee Structure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeStructure;
