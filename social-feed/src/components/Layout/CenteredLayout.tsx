import React from 'react';
import Navigation from '../Navigation/Navigation'; // ← Add this import
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
      {/* LinkedIn-style Navigation Header */}
      <Navigation />
      
      {/* Main Content with Padding for Fixed Header */}
      <div className="layout-content">
        {/* LEFT SIDEBAR - Remove or keep minimal */}
        {showSidebars && (
          <aside className="left-sidebar">
            {/* Profile Summary */}
            <div className="profile-card">
              <img 
                src="https://via.placeholder.com/80" 
                alt="Your Name" 
                className="profile-avatar"
              />
              <h3 className="profile-name">Your Name</h3>
              <p className="profile-handle">@yourhandle</p>
              <div className="profile-stats">
                <div className="stat">
                  <span className="stat-number">245</span>
                  <span className="stat-label">Posts</span>
                </div>
                <div className="stat">
                  <span className="stat-number">1.2k</span>
                  <span className="stat-label">Followers</span>
                </div>
              </div>
            </div>
            
            {/* Trending Tags */}
            <div className="trending-tags">
              <h4>Trending Tags</h4>
              <div className="tag-list">
                <a href="/hashtag/technology" className="tag">#Technology</a>
                <a href="/hashtag/design" className="tag">#Design</a>
                <a href="/hashtag/reactjs" className="tag">#ReactJS</a>
                <a href="/hashtag/webdev" className="tag">#WebDev</a>
              </div>
            </div>
          </aside>
        )}
        
        {/* MAIN CONTENT */}
        <main className="centered-main-content">
          {children}
        </main>
        
        {/* RIGHT SIDEBAR */}
        {showSidebars && (
          <aside className="right-sidebar">
            {/* Search */}
            <div className="search-container">
              <input 
                type="text" 
                placeholder="Search for friends, posts..." 
                className="search-input"
              />
            </div>
            
            {/* Trending Topics */}
            <div className="trending-topics">
              <h3>Trending for you</h3>
              <div className="topics-list">
                <div className="topic">
                  <span className="topic-category">Technology</span>
                  <span className="topic-name">#Technology</span>
                  <span className="topic-count">12.5k posts</span>
                </div>
                <div className="topic">
                  <span className="topic-category">Design</span>
                  <span className="topic-name">#Design</span>
                  <span className="topic-count">8.2k posts</span>
                </div>
                <div className="topic">
                  <span className="topic-category">Development</span>
                  <span className="topic-name">#ReactJS</span>
                  <span className="topic-count">5.1k posts</span>
                </div>
                <a href="/trending" className="show-more">Show more →</a>
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
          </aside>
        )}
      </div>
    </div>
  );
};

export default CenteredLayout;