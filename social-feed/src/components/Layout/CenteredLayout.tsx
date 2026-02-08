// src/components/Layout/CenteredLayout.tsx - UPDATED
import React from 'react';
import Navigation from '../Navigation/Navigation'; // Keep this
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
      {/* Only ONE Navigation header */}
      <Navigation />
      
      <div className="layout-content">
        {/* LEFT SIDEBAR - Only if showSidebars is true */}
        {showSidebars && (
          <aside className="left-sidebar">
            {/* Profile Card */}
            <div className="profile-card">
              <img 
                src="https://res.cloudinary.com/dzyqof9it/image/upload/v1758428111/profile/a9aie0pfuowrmmix3sc0.jpg" 
                alt="Damaris Chege" 
                className="profile-avatar"
              />
              <h3 className="profile-name">Damaris Chege</h3>
              <p className="profile-handle">@damarischege</p>
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
            
            {/* Trending Tags - MINIMAL */}
            <div className="trending-tags">
              <h4>Trending Tags</h4>
              <div className="tag-list">
                <a href="/hashtag/design" className="tag">#Design</a>
                <a href="/hashtag/reactjs" className="tag">#ReactJS</a>
                <a href="/hashtag/webdev" className="tag">#WebDev</a>
              </div>
            </div>
          </aside>
        )}
        
        {/* MAIN CONTENT - LinkedIn-style posts */}
        <main className="centered-main-content">
          {children}
        </main>
        
        {/* RIGHT SIDEBAR - Only if showSidebars is true */}
        {showSidebars && (
          <aside className="right-sidebar">
            {/* Search - REMOVED since Navigation has search */}
            
            {/* Trending Topics */}
            <div className="trending-topics">
              <h3>Trending for you</h3>
              <div className="topics-list">
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
                  <img src="https://res.cloudinary.com/dzyqof9it/image/upload/v1770481206/ava2_dvty1g.jpg" alt="Aditya" />
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