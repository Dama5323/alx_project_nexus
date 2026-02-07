import React from 'react';
import MobileMenu from './MobileMenu';

const Sidebar = () => {
  return (
    <>
      {/* Mobile Menu */}
      <MobileMenu />
      
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden md:flex md:w-64 lg:w-80 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-col">
        {/* Your existing desktop sidebar content */}
        {/* ... */}
      </div>
    </>
  );
};