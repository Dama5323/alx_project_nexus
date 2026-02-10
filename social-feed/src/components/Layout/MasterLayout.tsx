import React from 'react';
import Navigation from '../Navigation/Navigation';
import './MasterLayout.css';

// Added showSidebars to the interface
interface MasterLayoutProps {
  children: React.ReactNode;
  leftSidebar?: React.ReactNode;
  rightSidebar?: React.ReactNode;
  showSidebars?: boolean; 
}

const MasterLayout: React.FC<MasterLayoutProps> = ({ 
  children, 
  leftSidebar, 
  rightSidebar,
  showSidebars = true // Default to true
}) => {
  return (
    <div className="nexus-app-root">
      {/* Remove Navigation from here if it's already in LayoutWrapper in App.tsx */}
      <div className="nexus-main-grid">
        {showSidebars && (
          <aside className="nexus-column nexus-column--left">
            {leftSidebar || <div className="placeholder-sidebar">Left Sidebar</div>}
          </aside>
        )}

        <main className="nexus-column nexus-column--center">
          {children}
        </main>

        {showSidebars && (
          <aside className="nexus-column nexus-column--right">
            {rightSidebar || <div className="placeholder-sidebar">Right Sidebar</div>}
          </aside>
        )}
      </div>
    </div>
  );
};

export default MasterLayout;