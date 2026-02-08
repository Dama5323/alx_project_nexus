// src/components/Layout/CenteredLayout.tsx - UPDATED
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
      {/* LEFT SIDEBAR - Navigation */}
      {showSidebars && (
        <aside className="left-sidebar">
          {/* Add your navigation here */}
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
            
            {/* Create Post Button */}
            <a href="/compose" className="create-post-btn">
              <i className="fas fa-feather-alt"></i>
              <span>Create Post</span>
            </a>
            
            {/* Profile Section */}
            <div className="profile-section">
              <div className="user-profile">
                <img 
                  src="/path-to-your-avatar.jpg" 
                  alt="Your Name" 
                  className="user-avatar"
                />
                <div className="user-info">
                  <div className="user-name">Your Name</div>
                  <div className="user-handle">@yourhandle</div>
                </div>
              </div>
            </div>
          </nav>
        </aside>
      )}
      
      {/* MAIN CONTENT */}
      <main className="centered-main-content">
        {children}
      </main>
      
      {/* RIGHT SIDEBAR - Trending, Who to follow */}
      {showSidebars && (
        <aside className="right-sidebar">
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Search for friends, posts..." 
            />
          </div>
          
          {/* Trending Section */}
          <div className="trending-section">
            <h3>Trending for you</h3>
            <div className="trending-list">
              <div className="trending-item">
                <span className="trending-category">Technology · Trending</span>
                <span className="trending-tag">#Technology</span>
                <span className="trending-count">12.5k posts</span>
              </div>
              <div className="trending-item">
                <span className="trending-category">Design · Trending</span>
                <span className="trending-tag">#Design</span>
                <span className="trending-count">8.2k posts</span>
              </div>
              <div className="trending-item">
                <span className="trending-category">Development · Trending</span>
                <span className="trending-tag">#ReactJS</span>
                <span className="trending-count">5.1k posts</span>
              </div>
              <div className="trending-item">
                <span className="trending-category">Development · Trending</span>
                <span className="trending-tag">#WebDevelopment</span>
                <span className="trending-count">3.8k posts</span>
              </div>
              <a href="/trending" className="show-more">Show more</a>
            </div>
          </div>
          
          {/* Who to Follow */}
          <div className="who-to-follow">
            <h3>Who to follow</h3>
            <div className="follow-list">
              <div className="follow-item">
                <img src="https://via.placeholder.com/40" alt="User" />
                <div className="follow-info">
                  <div className="follow-name">Aditya</div>
                  <div className="follow-handle">@aditya</div>
                </div>
                <button className="follow-btn">Follow</button>
              </div>
            </div>
          </div>
          
          {/* Footer Links */}
          <div className="footer-links">
            <a href="/terms">Terms of Service</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/cookies">Cookie Policy</a>
            <div className="copyright">© 2026 SocialApp</div>
          </div>
        </aside>
      )}
    </div>
  );
};

export default CenteredLayout;