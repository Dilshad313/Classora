import { useState } from 'react';
import { Plus, Pin, Calendar, Eye, Edit, Trash2, Bell } from 'lucide-react';

const NoticeBoard = () => {
  const [showModal, setShowModal] = useState(false);

  const notices = [
    {
      id: 1,
      title: 'Parent-Teacher Meeting - Grade 6',
      content: 'Dear Parents, We are pleased to invite you to the Parent-Teacher Meeting scheduled for next week. This is an excellent opportunity to discuss your child\'s progress and address any concerns.',
      date: '2024-10-26',
      author: 'System Administrator',
      targetAudience: 'Parents - Grade 6',
      isPinned: true,
      views: 145
    },
    {
      id: 2,
      title: 'First Term Examination Schedule Released',
      content: 'The examination schedule for the First Term Examination 2024 has been published. Students are advised to check the schedule and prepare accordingly. The exams will commence from October 30, 2024.',
      date: '2024-10-25',
      author: 'Academic Coordinator',
      targetAudience: 'All Students',
      isPinned: true,
      views: 312
    },
    {
      id: 3,
      title: 'Sports Day Announcement',
      content: 'Future Leaders Academy is excited to announce the Annual Sports Day on November 5, 2024. All students are encouraged to participate in various sporting events. Registration forms are available at the sports office.',
      date: '2024-10-24',
      author: 'Sports Department',
      targetAudience: 'All Students',
      isPinned: false,
      views: 278
    },
    {
      id: 4,
      title: 'Library New Books Arrival',
      content: 'The school library has received a fresh collection of books covering various subjects and genres. Students are welcome to visit the library during break hours to explore the new additions.',
      date: '2024-10-22',
      author: 'Librarian',
      targetAudience: 'All Students & Staff',
      isPinned: false,
      views: 89
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Notice Board</h1>
          <p className="text-gray-600 mt-1">Publish and manage school notices</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Notice
        </button>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className={`card hover:shadow-lg transition-shadow ${
              notice.isPinned ? 'border-2 border-primary-300 bg-primary-50/30' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {notice.isPinned && (
                    <Pin className="w-5 h-5 text-primary-600 fill-primary-600" />
                  )}
                  <h3 className="text-xl font-bold text-gray-800">{notice.title}</h3>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">{notice.content}</p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {notice.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Bell className="w-4 h-4" />
                    {notice.author}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                    {notice.targetAudience}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {notice.views} views
                  </span>
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                <button className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors" title="Edit">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-200">
              <button className="btn-secondary text-sm flex items-center gap-2">
                <Eye className="w-4 h-4" />
                View Details
              </button>
              {!notice.isPinned && (
                <button className="btn-secondary text-sm flex items-center gap-2">
                  <Pin className="w-4 h-4" />
                  Pin Notice
                </button>
              )}
              <button className="btn-secondary text-sm">
                Send Email Notification
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Notice Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Create New Notice</h2>
            
            <form className="space-y-4">
              <div>
                <label className="label">Notice Title</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter notice title"
                  required
                />
              </div>

              <div>
                <label className="label">Content</label>
                <textarea
                  className="input-field"
                  rows="6"
                  placeholder="Write your notice content here..."
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Target Audience</label>
                  <select className="input-field" required>
                    <option value="">Select audience</option>
                    <option value="all">All Students & Staff</option>
                    <option value="students">All Students</option>
                    <option value="parents">All Parents</option>
                    <option value="staff">All Staff</option>
                    <option value="grade6">Grade 6 Students</option>
                    <option value="grade7">Grade 7 Students</option>
                    <option value="grade8">Grade 8 Students</option>
                  </select>
                </div>

                <div>
                  <label className="label">Publish Date</label>
                  <input
                    type="date"
                    className="input-field"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-primary-600 rounded" />
                  <span className="text-sm font-medium text-gray-700">Pin this notice</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-primary-600 rounded" />
                  <span className="text-sm font-medium text-gray-700">Send email notification</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-primary-600 rounded" />
                  <span className="text-sm font-medium text-gray-700">Send SMS notification</span>
                </label>
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
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticeBoard;
