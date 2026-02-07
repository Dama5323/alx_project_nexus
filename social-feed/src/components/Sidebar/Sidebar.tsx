import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/', icon: '🏠', label: 'Home', exact: true },
    { path: '/profile', icon: '👤', label: 'Profile' },
    { path: '/explore', icon: '🔍', label: 'Explore' },
    { path: '/bookmarks', icon: '🔖', label: 'Bookmarks' },
    { path: '/notifications', icon: '🔔', label: 'Notifications', badge: 3 },
    { path: '/analytics', icon: '📊', label: 'Analytics' },
    { path: '/messages', icon: '💬', label: 'Messages', badge: 2 },
    { path: '/trending', icon: '🔥', label: 'Trending' },
    { path: '/search', icon: '🔎', label: 'Search' },
  ];

  const secondaryItems = [
    { path: '/settings', icon: '⚙️', label: 'Settings' },
    { path: '/help', icon: '❓', label: 'Help & Support' },
  ];

  const isActive = (path: string, exact: boolean = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="sidebar">
      {/* User Profile */}
      <div className="user-profile">
        <Link to={`/profile/${user?.id || 'me'}`}>
          <img 
            src={user?.avatar || 'https://res.cloudinary.com/dzyqof9it/image/upload/v1770419352/ava_ivuuzq.webp'}
            alt={user?.name || 'User'} 
            className="user-avatar"
          />
          <div className="user-info">
            <h3 className="user-name">{user?.name || 'User Name'}</h3>
            <p className="user-handle">@{user?.username || 'username'}</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <h3 className="nav-title">Menu</h3>
        <ul className="nav-list">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path} 
                className={`nav-link ${isActive(item.path, item.exact) ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {item.badge && (
                  <span className="nav-badge">{item.badge}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Create Post Button */}
      <div className="create-post-section">
        <Link to="/compose" className="create-post-btn">
          <span className="create-post-icon">✏️</span>
          <span className="create-post-text">Create Post</span>
        </Link>
      </div>

      {/* Trending Hashtags */}
      <div className="trending-section">
        <h3 className="section-title">
          <span className="section-icon">🔥</span>
          Trending Now
        </h3>
        <div className="hashtag-list">
          {['WebDevelopment', 'ReactJS', 'TypeScript', 'AWS', 'GraphQL'].map((tag) => (
            <Link key={tag} to={`/hashtag/${tag}`} className="hashtag-item">
              <span className="hashtag-icon">#</span>
              <span className="hashtag-name">{tag}</span>
              <span className="hashtag-count">1.2k</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Secondary Navigation */}
      <nav className="secondary-nav">
        <ul className="nav-list">
          {secondaryItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path} 
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="logout-section">
        <button onClick={logout} className="logout-btn">
          <span className="logout-icon">🚪</span>
          <span className="logout-text">Logout</span>
        </button>
      </div>

      {/* Copyright */}
    <div className="sidebar-footer">
    <p className="copyright">© 2026 Social Feed</p>

    <div className="footer-links">
        <a
        href="https://github.com/Dama5323"
        target="_blank"
        rel="noopener noreferrer"
        >
        GitHub
        </a>

        <a
        href="https://www.linkedin.com/in/dama5323"
        target="_blank"
        rel="noopener noreferrer"
        >
        LinkedIn
        </a>

        <a
        href="https://dama5323.github.io/DamaChege_Portfolio/"
        target="_blank"
        rel="noopener noreferrer"
        >
        Portfolio
        </a>
    </div>
    </div>
    </div>
  );
};

export default Sidebar;