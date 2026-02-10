import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navigation.css';

const Navigation: React.FC = () => {
  const navItems = [
    { path: '/', label: 'Home', icon: 'fas fa-home' },
    { path: '/explore', label: 'Explore', icon: 'fas fa-hashtag' },
    { path: '/notifications', label: 'Notifications', icon: 'fas fa-bell' },
    { path: '/messages', label: 'Messages', icon: 'fas fa-envelope' },
    { path: '/bookmarks', label: 'Bookmarks', icon: 'fas fa-bookmark' },
    { path: '/profile', label: 'Profile', icon: 'fas fa-user' },
    { path: '/analytics', label: 'Analytics', icon: 'fas fa-chart-line' },
  ];

  return (
    <>
      {/* DESKTOP NAVIGATION */}
      <header className="main-navigation desktop-only">
        <div className="nav-container">
          
          {/* LEFT: Logo & Search Group */}
          <div className="nav-left-group">
            <NavLink to="/" className="logo-link">
              <span className="logo-text">Nexus</span>
            </NavLink>

            <div className="nav-search-container">
              <i className="fas fa-search search-icon"></i>
              <input 
                type="text" 
                placeholder="Search Nexus..." 
                className="nav-search-input" 
              />
            </div>
          </div>

          {/* CENTER: Desktop Navigation Links */}
          <nav className="nav-menu desktop-only">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `nav-item ${isActive ? 'active' : ''}`
                }
              >
                <i className={item.icon}></i>
                <span className="nav-label">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* RIGHT: Actions & Profile Dropdown */}
          <div className="nav-right">
            <NavLink to="/compose" className="create-post-btn mobile-hide">
              Create Post
            </NavLink>
            
            <div className="user-dropdown">
              <button className="user-toggle">
                <img 
                  src="https://res.cloudinary.com/dzyqof9it/image/upload/v1758428111/profile/a9aie0pfuowrmmix3sc0.jpg" 
                  alt="Profile" 
                  className="user-avatar"
                />
                <span className="user-name">Damaris Chege</span>
                <i className="fas fa-chevron-down"></i>
              </button>
              
              <div className="dropdown-menu">
                <NavLink to="/profile" className="dropdown-item">
                  <i className="fas fa-user"></i> Your Profile
                </NavLink>
                <NavLink to="/settings" className="dropdown-item">
                  <i className="fas fa-cog"></i> Settings
                </NavLink>
                <NavLink to="/help" className="dropdown-item">
                  <i className="fas fa-question-circle"></i> Help & Support
                </NavLink>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item logout-btn">
                  <i className="fas fa-sign-out-alt"></i> Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE BOTTOM TAB BAR */}
      <nav className="mobile-bottom-nav mobile-only">
        {navItems.slice(0, 5).map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
          >
            <i className={item.icon}></i>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
};

export default Navigation;