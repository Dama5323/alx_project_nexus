// src/pages/ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USER_PROFILE, GET_USER_POSTS } from '../graphql/queries/profileQueries';
import { UPDATE_PROFILE } from '../graphql/mutations/profileMutations';
import { useAuth } from '../hooks/useAuth';
import FollowButton from '../components/engagement/FollowButton';
import './ProfilePage.css';

// Define a proper Profile type
interface Profile {
  id: string;
  name: string;
  username: string;
  email?: string;
  bio?: string;
  location?: string;
  website?: string;
  avatar?: string;
  profileImage?: string;
  followers?: number;
  following?: number;
  postsCount?: number;
  createdAt?: string;
  updatedAt?: string;
  isFollowing?: boolean;
  verified?: boolean;
}

interface EditFormData {
  name: string;
  username: string;
  bio: string;
  location: string;
  email: string;
  website: string;
}

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const auth = useAuth(); // Destructure properly
  
  // Destructure auth properties - adjust based on your actual useAuth return
  const currentUser = auth.user;
  const isAuthenticated = auth.isAuthenticated || !!auth.user;
  
  const [activeTab, setActiveTab] = useState<'posts' | 'likes' | 'media'>('posts');
  const [isEditing, setIsEditing] = useState(false);
  const [localProfile, setLocalProfile] = useState<Profile | null>(null);
  
  // Debug authentication - FIXED: removed duplicate closing brace
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      console.log('DEBUG: Current user:', currentUser);
      console.log('DEBUG: Is authenticated:', isAuthenticated);
      console.log('DEBUG: Token:', localStorage.getItem('token') || localStorage.getItem('authToken'));
      console.log('Fetching profile for:', currentUser.id);
    }
  }, [currentUser, isAuthenticated]); // ✅ Fixed: Added dependencies

  // Use UPDATE_PROFILE mutation with error handling
  const [updateProfile, { loading: updating, error: updateError }] = useMutation(UPDATE_PROFILE, {
    context: {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token') || localStorage.getItem('authToken')}`
      }
    },
    onError: (error) => {
      console.error('Mutation error details:', error);
      console.error('GraphQL errors:', error.graphQLErrors);
      console.error('Network error:', error.networkError);
    }
  });

  // Get the user ID - if no userId in params, use current user
  const profileUserId = userId || currentUser?.id;

  const { data: profileData, loading: profileLoading, refetch } = useQuery(GET_USER_PROFILE, {
    variables: { userId: profileUserId },
    skip: !profileUserId,
    context: {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token') || localStorage.getItem('authToken')}`
      }
    }
  });

  const { data: postsData, loading: postsLoading } = useQuery(GET_USER_POSTS, {
    variables: { userId: profileUserId, type: activeTab },
    skip: !profileUserId
  });

  // Initialize local profile state
  useEffect(() => {
    if (profileData?.user) {
      // Cast to Profile type since we know it has these properties
      const userData = profileData.user as any;
      setLocalProfile({
        id: userData.id || '1',
        name: userData.name || '',
        username: userData.username || '',
        bio: userData.bio || '',
        location: userData.location || '',
        email: userData.email || '',
        website: userData.website || '',
        avatar: userData.avatar || userData.profileImage || '',
        profileImage: userData.profileImage || userData.avatar || '',
        followers: userData.followers || 0,
        following: userData.following || 0,
        postsCount: userData.postsCount || 0,
        createdAt: userData.createdAt || '',
        isFollowing: userData.isFollowing || false,
        verified: userData.verified || false
      });
    } else if (currentUser) {
      // Create a default profile from currentUser
      const user = currentUser as any;
      setLocalProfile({
        id: user.id || '1',
        name: user.name || 'Damaris Chege',
        username: user.username || 'Damah',
        bio: user.bio || 'Software Developer $ AWS Solutions Architect| React Enthusiast',
        location: user.location || 'Nairobi, Kenya',
        email: user.email || 'deenyashke@gmail.com',
        website: user.website || 'https://dama5323.github.io/DamaChege_Portfolio/',
        followers: 245,
        following: 128,
        postsCount: 42,
        createdAt: user.createdAt || '2023-01-15T00:00:00.000Z',
        avatar: user.avatar || 'https://res.cloudinary.com/dzyqof9it/image/upload/v1758428111/profile/a9aie0pfuowrmmix3sc0.jpg',
        profileImage: user.profileImage || user.avatar || 'https://res.cloudinary.com/dzyqof9it/image/upload/v1758428111/profile/a9aie0pfuowrmmix3sc0.jpg',
        isFollowing: false,
        verified: false
      });
    }
  }, [profileData, currentUser]);

  if (profileLoading || !localProfile) {
    return (
      <div className="profile-page">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  const posts = postsData?.userPosts || [];
  const isOwnProfile = currentUser?.id === profileUserId || !userId;

  // Handle profile update with fallback to local saving
  const handleSaveProfile = async (updatedData: EditFormData) => {
    try {
      console.log('🚀 Attempting to update profile...');
      
      // Check authentication
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      console.log('🔑 Token found:', token ? 'Yes' : 'No');
      
      if (!token) {
        console.error('❌ No authentication token found');
        throw new Error('Not authenticated. Please log in again.');
      }

      // Prepare input
      const inputData = {
        name: updatedData.name,
        username: updatedData.username,
        bio: updatedData.bio || null,
        location: updatedData.location || null,
        email: updatedData.email || null,
        website: updatedData.website || null
      };

      console.log('📤 Sending input:', inputData);
      
      // Try the GraphQL mutation with explicit headers
      const { data } = await updateProfile({
        variables: { input: inputData },
        context: {
          headers: {
            authorization: `Bearer ${token}`
          }
        }
      });

      if (data?.updateProfile) {
        console.log('✅ Success! Updated profile:', data.updateProfile);
        alert('✅ Profile updated successfully on server!');
        
        // Update local state
        setLocalProfile(prev => ({
          ...prev!,
          ...data.updateProfile
        }));
        
        // Refetch from server
        await refetch();
        setIsEditing(false);
      }
      
    } catch (error: any) {
      console.error('❌ Server update failed:', error);
      
      // Check if it's an authentication error
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        alert('🔒 Authentication expired. Please log in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
        navigate('/login');
        return;
      }
      
      // Fallback: Save locally
      console.log('💾 Falling back to local save...');
      setLocalProfile(prev => ({
        ...prev!,
        ...updatedData,
        updatedAt: new Date().toISOString()
      }));
      
      // Save to localStorage
      localStorage.setItem('userProfile', JSON.stringify({
        ...localProfile,
        ...updatedData
      }));
      
      alert('💾 Profile saved locally!\n\nNote: Server update failed. Check browser console for details.');
      setIsEditing(false);
    }
  };

  return (
    <div className="profile-page">
      {/* Authentication warning */}
      {!isAuthenticated && isOwnProfile && (
        <div className="auth-warning">
          ⚠️ You are not authenticated. Profile changes will be saved locally only.
        </div>
      )}
      
      {/* Error banner */}
      {updateError && (
        <div className="error-banner">
          ❌ Server Error: {updateError.message}
          <br />
          <small>Changes saved locally instead.</small>
        </div>
      )}
      
      {/* Profile Header Section */}
      <div className="profile-header">
        <div className="profile-banner">
          <div className="profile-image-container">
            <img 
              src={localProfile.avatar || localProfile.profileImage || 'https://res.cloudinary.com/dzyqof9it/image/upload/v1758428111/profile/a9aie0pfuowrmmix3sc0.jpg'} 
              alt={`${localProfile.name}'s profile`} 
              className="profile-picture"
            />
            {isOwnProfile && (
              <button 
                className="edit-image-btn"
                onClick={() => alert('Feature coming soon: Upload new profile picture')}
                disabled={updating}
              >
                📷
              </button>
            )}
          </div>
        </div>
        
        <div className="profile-details">
          {isEditing ? (
            <EditProfileForm 
              profile={localProfile}
              onSave={handleSaveProfile}
              onCancel={() => setIsEditing(false)}
              updating={updating}
              error={updateError}
              isAuthenticated={isAuthenticated}
            />
          ) : (
            <>
              <div className="profile-info-main">
                <h1 className="profile-name">{localProfile.name}</h1>
                <p className="profile-username">@{localProfile.username}</p>
                <p className="profile-bio">{localProfile.bio || 'No bio yet'}</p>
              </div>
              
              <div className="profile-meta-info">
                {localProfile.location && (
                  <div className="meta-item">
                    <span className="meta-icon">📍</span>
                    <span className="meta-text">{localProfile.location}</span>
                  </div>
                )}
                {localProfile.email && isOwnProfile && (
                  <div className="meta-item">
                    <span className="meta-icon">📧</span>
                    <span className="meta-text">{localProfile.email}</span>
                  </div>
                )}
                {localProfile.website && (
                  <div className="meta-item">
                    <span className="meta-icon">🔗</span>
                    <a 
                      href={localProfile.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="meta-text link"
                    >
                      {localProfile.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
                {localProfile.createdAt && (
                  <div className="meta-item">
                    <span className="meta-icon">📅</span>
                    <span className="meta-text">
                      Joined {new Date(localProfile.createdAt).toLocaleDateString('en-US', { 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-value">{localProfile.postsCount || 0}</span>
                  <span className="stat-label">Posts</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{localProfile.followers || 0}</span>
                  <span className="stat-label">Followers</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{localProfile.following || 0}</span>
                  <span className="stat-label">Following</span>
                </div>
              </div>
              
              <div className="profile-actions">
                {isOwnProfile ? (
                  <>
                    <button 
                      className="btn btn-primary edit-profile-btn"
                      onClick={() => setIsEditing(true)}
                      disabled={updating}
                    >
                      {updating ? 'Updating...' : '✏️ Edit Profile'}
                    </button>
                    <button 
                      className="btn btn-secondary back-home-btn"
                      onClick={() => navigate('/')}
                      disabled={updating}
                    >
                      🏠 Back to Home
                    </button>
                  </>
                ) : (
                  <>
                    <FollowButton 
                      userId={profileUserId!}
                      isFollowing={localProfile.isFollowing || false}
                      variant="primary"
                      size="lg"
                    />
                    <button 
                      className="btn btn-outline message-button"
                      onClick={() => navigate(`/messages?user=${profileUserId}`)}
                    >
                      Message
                    </button>
                  </>
                )}
              </div>
              
              {isOwnProfile && !isAuthenticated && (
                <div className="auth-help">
                  <small>
                    🔒 <strong>Authentication required</strong> for server saving. 
                    <button 
                      className="login-link"
                      onClick={() => navigate('/login')}
                    >
                      Log in
                    </button>
                  </small>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
          disabled={updating}
        >
          Posts
        </button>
        <button 
          className={`tab-btn ${activeTab === 'likes' ? 'active' : ''}`}
          onClick={() => setActiveTab('likes')}
          disabled={updating}
        >
          Likes
        </button>
        <button 
          className={`tab-btn ${activeTab === 'media' ? 'active' : ''}`}
          onClick={() => setActiveTab('media')}
          disabled={updating}
        >
          Media
        </button>
      </div>

      {/* Recent Posts Section */}
      <div className="profile-content">
        <h3 className="section-title">Recent Posts</h3>
        
        {postsLoading ? (
          <div className="loading-posts">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="no-posts">
            {isOwnProfile ? (
              <>
                <p>You haven't posted anything yet.</p>
                <button 
                  className="btn btn-primary create-first-post"
                  onClick={() => navigate('/create')}
                  disabled={updating}
                >
                  Create your first post
                </button>
              </>
            ) : (
              <p>No posts yet</p>
            )}
          </div>
        ) : (
          <div className="user-posts">
            {posts.map((post: any, index: number) => (
              <div key={post.id || index} className="post-card">
                {post.images && post.images.length > 0 ? (
                  <img 
                    src={post.images[0]} 
                    alt="Post" 
                    className="post-image"
                  />
                ) : (
                  <div className="post-text">
                    <p>{post.content || 'Sample post content...'}</p>
                  </div>
                )}
                <div className="post-overlay">
                  <div className="post-stats">
                    <span className="stat-like">❤️ {post.likes || 0}</span>
                    <span className="stat-comment">💬 {post.comments || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Edit Profile Form Component
const EditProfileForm: React.FC<{
  profile: Profile;
  onSave: (data: EditFormData) => void;
  onCancel: () => void;
  updating: boolean;
  error: any;
  isAuthenticated: boolean;
}> = ({ profile, onSave, onCancel, updating, error, isAuthenticated }) => {
  const [formData, setFormData] = useState<EditFormData>({
    name: profile.name || '',
    username: profile.username || '',
    bio: profile.bio || '',
    location: profile.location || '',
    email: profile.email || '',
    website: profile.website || ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errors.username = 'Username can only contain letters, numbers, and underscores';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (formData.website && !/^https?:\/\/.+/.test(formData.website) && formData.website !== '') {
      errors.website = 'Website must start with http:// or https://';
    }
    
    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    onSave(formData);
  };

  return (
    <form className="edit-profile-form" onSubmit={handleSubmit}>
      {error && (
        <div className="form-error-banner">
          <strong>⚠️ Server Error:</strong> {error.message}
          <p>Changes will be saved locally instead.</p>
        </div>
      )}
      
      {!isAuthenticated && (
        <div className="auth-notice">
          <p>🔒 <strong>Note:</strong> You are not authenticated. Changes will be saved locally.</p>
          <p>To save to server, please log in first.</p>
        </div>
      )}
      
      <div className="form-group">
        <label htmlFor="name">Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`form-input ${formErrors.name ? 'error' : ''}`}
          placeholder="Your full name"
          disabled={updating}
          required
        />
        {formErrors.name && <div className="field-error">{formErrors.name}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="username">Username *</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className={`form-input ${formErrors.username ? 'error' : ''}`}
          placeholder="username"
          disabled={updating}
          required
        />
        {formErrors.username && <div className="field-error">{formErrors.username}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="bio">Bio</label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          className="form-textarea"
          rows={3}
          placeholder="Tell us about yourself..."
          disabled={updating}
          maxLength={160}
        />
        <div className="character-count">{formData.bio.length}/160</div>
      </div>

      <div className="form-group">
        <label htmlFor="location">Location</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="form-input"
          placeholder="City, Country"
          disabled={updating}
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`form-input ${formErrors.email ? 'error' : ''}`}
          placeholder="your.email@example.com"
          disabled={updating}
        />
        {formErrors.email && <div className="field-error">{formErrors.email}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="website">Website</label>
        <input
          type="url"
          id="website"
          name="website"
          value={formData.website}
          onChange={handleChange}
          className={`form-input ${formErrors.website ? 'error' : ''}`}
          placeholder="https://example.com"
          disabled={updating}
        />
        {formErrors.website && <div className="field-error">{formErrors.website}</div>}
      </div>

      <div className="save-info">
        <p>
          {isAuthenticated 
            ? '✅ Changes will be saved to server'
            : '💾 Changes will be saved locally (not authenticated)'
          }
        </p>
      </div>

      <div className="form-actions">
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={updating}
        >
          {updating ? '💾 Saving...' : '💾 Save Changes'}
        </button>
        <button 
          type="button" 
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={updating}
        >
          ❌ Cancel
        </button>
      </div>
    </form>
  );
};

export default ProfilePage;