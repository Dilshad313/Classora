import { useState } from 'react';
import { MessageSquare, Send, Search, Users } from 'lucide-react';

const Messaging = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');

  const chats = [
    { id: 1, name: 'Parent - John Doe', lastMessage: 'Thank you for the update', time: '10:30 AM', unread: 2 },
    { id: 2, name: 'Parent - Jane Smith', lastMessage: 'When is the next test?', time: 'Yesterday', unread: 0 },
    { id: 3, name: 'Class 10-A Group', lastMessage: 'Homework submitted', time: '2 days ago', unread: 5 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Messaging</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Communicate with students and parents</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 card">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search messages..." className="input pl-10" />
          </div>
          <div className="space-y-2">
            {chats.map(chat => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`w-full p-3 rounded-lg text-left transition-colors ${
                  selectedChat?.id === chat.id
                    ? 'bg-primary-50 dark:bg-primary-900/20'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm text-gray-800 dark:text-gray-100">{chat.name}</span>
                  {chat.unread > 0 && (
                    <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-0.5">{chat.unread}</span>
                  )}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{chat.lastMessage}</p>
                <span className="text-xs text-gray-500 dark:text-gray-500">{chat.time}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 card">
          {selectedChat ? (
            <div className="flex flex-col h-[500px]">
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">{selectedChat.name}</h3>
              </div>
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 max-w-xs">
                    <p className="text-sm text-gray-800 dark:text-gray-100">Hello, how is my child performing?</p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">10:25 AM</span>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-primary-600 text-white rounded-lg p-3 max-w-xs">
                    <p className="text-sm">Your child is doing great! Keep up the good work.</p>
                    <span className="text-xs opacity-75">10:30 AM</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="input flex-1"
                />
                <button className="btn-primary">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[500px] text-gray-400 dark:text-gray-600">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 mx-auto mb-4" />
                <p>Select a chat to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messaging;
