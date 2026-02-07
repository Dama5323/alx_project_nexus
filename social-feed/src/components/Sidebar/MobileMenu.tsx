import React, { useState } from 'react';
import { Menu, X, Home, User, TrendingUp, Bell, MessageSquare, Bookmark, Settings, Hash } from 'lucide-react';

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: <Home size={20} />, label: 'Home', path: '/' },
    { icon: <Hash size={20} />, label: 'Explore', path: '/explore' },
    { icon: <Bell size={20} />, label: 'Notifications', path: '/notifications' },
    { icon: <MessageSquare size={20} />, label: 'Messages', path: '/messages' },
    { icon: <Bookmark size={20} />, label: 'Bookmarks', path: '/bookmarks' },
    { icon: <User size={20} />, label: 'Profile', path: '/profile' },
    { icon: <TrendingUp size={20} />, label: 'Trending', path: '/trending' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-blue-500 text-white rounded-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 z-40 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6">Menu</h2>
          <nav className="space-y-4">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.path}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;