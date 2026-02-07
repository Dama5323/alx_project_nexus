// src/components/Layout/CenteredLayout.tsx
import React from 'react';
import './CenteredLayout.css';

interface CenteredLayoutProps {
  children: React.ReactNode;
  showSidebars?: boolean;
}

const CenteredLayout: React.FC<CenteredLayoutProps> = ({ 
  children, 
  showSidebars = true 
}) => {
  return (
    <div className="centered-app-container">
      {showSidebars && (
        <>
          {/* Left Sidebar */}
          <aside className="left-sidebar">
            <div className="sidebar-content">
              <div className="logo">Nexus</div>
              <nav className="main-nav">
                <a href="/" className="nav-item active">
                  <i className="fas fa-home"></i>
                  <span>Home</span>
                </a>
                <a href="/explore" className="nav-item">
                  <i className="fas fa-hashtag"></i>
                  <span>Explore</span>
                </a>
                <a href="/notifications" className="nav-item">
                  <i className="fas fa-bell"></i>
                  <span>Notifications</span>
                </a>
                <a href="/messages" className="nav-item">
                  <i className="fas fa-envelope"></i>
                  <span>Messages</span>
                </a>
                <a href="/bookmarks" className="nav-item">
                  <i className="fas fa-bookmark"></i>
                  <span>Bookmarks</span>
                </a>
                <a href="/profile" className="nav-item">
                  <i className="fas fa-user"></i>
                  <span>Profile</span>
                </a>
              </nav>
              
              <button className="create-post-btn">
                <i className="fas fa-plus"></i>
                <span>Create Post</span>
              </button>
            </div>
          </aside>
          
          {/* Right Sidebar */}
          <aside className="right-sidebar">
            <div className="trending-section">
              <h3>Trending Now</h3>
              <div className="trending-item">
                <span className="trend-tag">#ReactJS</span>
                <span className="trend-count">2.5K posts</span>
              </div>
              <div className="trending-item">
                <span className="trend-tag">#WebDev</span>
                <span className="trend-count">1.8K posts</span>
              </div>
            </div>
            
            <div className="posting-tips">
              <h3>Posting Tips</h3>
              <ul>
                <li>Use @username to mention users</li>
                <li>Use #hashtag for trends</li>
                <li>Share your thoughts or media</li>
                <li>Be respectful</li>
              </ul>
            </div>
          </aside>
        </>
      )}
      
      {/* Main Content - Centered */}
      <main className="centered-main-content">
        {children}
      </main>
    </div>
  );
};

export default CenteredLayout;