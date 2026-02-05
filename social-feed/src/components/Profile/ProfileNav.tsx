import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

export const ProfileNav: React.FC = () => {
  const { user } = useAuthContext();

  if (!user) return null;

  // Create username from user data
  const getUsername = () => {
    if (user.name) {
      // Convert "John Doe" to "johndoe"
      return user.name.replace(/\s+/g, '').toLowerCase();
    }
    if (user.email) {
      // Convert "john@example.com" to "john"
      return user.email.split('@')[0];
    }
    return 'user';
  };

  const username = getUsername();

  return (
    <div className="profile-nav">
      <Link to={`/profile/${username}`} className="profile-nav__link">
        <div className="profile-nav__avatar">
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.name || 'Profile'} 
              className="profile-nav__avatar-img"
            />
          ) : (
            <div className="profile-nav__avatar-placeholder">
              {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
            </div>
          )}
        </div>
        <span className="profile-nav__text">Profile</span>
      </Link>
    </div>
  );
};