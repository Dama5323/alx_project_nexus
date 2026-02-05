// src/pages/ProfilePage.tsx - UPDATED
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { 
  GET_USER_PROFILE, 
  GET_USER_POSTS,
  GET_FOLLOW_STATUS,
  FOLLOW_USER,
  UNFOLLOW_USER 
} from '../graphql/queries/userQueries';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';
import { Post } from '../components/Feed/Post';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { EditProfileModal } from '../components/Profile/EditProfileModal';
import { useAuthContext } from '../context/AuthContext';
import { formatNumber } from '../utils/helpers/formatNumbers';
import './ProfilePage.css';

export const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthContext();
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');

  // Fetch profile data
  const { data: profileData, loading: profileLoading, refetch: refetchProfile } = useQuery(
    GET_USER_PROFILE, 
    { variables: { username } }
  );

  // Fetch follow status
  const { data: followData } = useQuery(
    GET_FOLLOW_STATUS,
    { 
      variables: { userId: profileData?.user?.id },
      skip: !profileData?.user?.id 
    }
  );

  // Fetch user posts
  const { data: postsData, loading: postsLoading } = useQuery(
    GET_USER_POSTS,
    { 
      variables: { 
        userId: profileData?.user?.id, 
        first: 20 
      },
      skip: !profileData?.user?.id 
    }
  );

  // Follow/Unfollow mutations
  const [followUser] = useMutation(FOLLOW_USER, {
    refetchQueries: [
      { query: GET_USER_PROFILE, variables: { username } },
      { query: GET_FOLLOW_STATUS, variables: { userId: profileData?.user?.id } }
    ]
  });

  const [unfollowUser] = useMutation(UNFOLLOW_USER, {
    refetchQueries: [
      { query: GET_USER_PROFILE, variables: { username } },
      { query: GET_FOLLOW_STATUS, variables: { userId: profileData?.user?.id } }
    ]
  });

  const handleFollowToggle = async () => {
    if (!profileData?.user) return;

    try {
      if (profileData.user.isFollowing) {
        await unfollowUser({ variables: { userId: profileData.user.id } });
      } else {
        await followUser({ variables: { userId: profileData.user.id } });
      }
    } catch (error) {
      console.error('Follow toggle failed:', error);
    }
  };

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const handleProfileUpdate = (updatedUser: any) => {
    refetchProfile();
    if (updatedUser.username !== username) {
      navigate(`/profile/${updatedUser.username}`);
    }
  };

  if (profileLoading) {
    return (
      <div className="profile-page__loading">
        <LoadingSpinner size="lg" text="Loading profile..." />
      </div>
    );
  }

  if (!profileData?.user) {
    return (
      <div className="profile-page__not-found">
        <h2>User not found</h2>
        <p>The profile @{username} doesn't exist.</p>
        <Button 
          variant="primary" 
          onClick={() => navigate('/')}
        >
          Go Home
        </Button>
      </div>
    );
  }

  const user = profileData.user;
  const isOwnProfile = currentUser?.id === user.id;
  const posts = postsData?.userPosts?.edges || [];

  return (
    <ErrorBoundary>
      <div className="profile-page">
        {/* Header */}
        <div className="profile-page__header">
          <div className="profile-page__cover" />
          
          <div className="profile-page__info">
            <div className="profile-page__avatar-container">
              <Avatar
                src={user.avatar}
                alt={user.name}
                size="xl"
                verified={user.verified}
                fallback={user.name}
              />
            </div>

            <div className="profile-page__details">
              <div className="profile-page__actions">
                {isOwnProfile ? (
                  <Button
                    variant="outline"
                    size="md"
                    onClick={handleEditProfile}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <div className="profile-page__action-buttons">
                    <Button
                      variant={user.isFollowing ? 'secondary' : 'primary'}
                      size="md"
                      onClick={handleFollowToggle}
                    >
                      {user.isFollowing ? 'Following' : 'Follow'}
                    </Button>
                    
                    {user.isFollowing && (
                      <Button
                        variant="outline"
                        size="md"
                        onClick={() => console.log('Message user')}
                      >
                        Message
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="md"
                      onClick={() => console.log('More options')}
                    >
                      ···
                    </Button>
                  </div>
                )}
              </div>

              <div className="profile-page__name-section">
                <h1 className="profile-page__name">{user.name}</h1>
                <span className="profile-page__username">@{user.username}</span>
              </div>

              {user.bio && <p className="profile-page__bio">{user.bio}</p>}

              <div className="profile-page__meta">
                {user.location && (
                  <span className="profile-page__meta-item">
                    📍 {user.location}
                  </span>
                )}
                {user.website && (
                  <a 
                    href={user.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="profile-page__meta-item profile-page__website"
                  >
                    🔗 {user.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
                <span className="profile-page__meta-item">
                  📅 Joined {new Date(user.createdAt).toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </span>
              </div>

              <div className="profile-page__stats">
                <div className="profile-page__stat">
                  <span className="profile-page__stat-value">
                    {formatNumber(user.postsCount || 0)}
                  </span>
                  <span className="profile-page__stat-label">Posts</span>
                </div>
                
                <button 
                  className="profile-page__stat profile-page__stat--clickable"
                  onClick={() => navigate(`/profile/${username}/followers`)}
                >
                  <span className="profile-page__stat-value">
                    {formatNumber(user.followers || 0)}
                  </span>
                  <span className="profile-page__stat-label">Followers</span>
                </button>
                
                <button 
                  className="profile-page__stat profile-page__stat--clickable"
                  onClick={() => navigate(`/profile/${username}/following`)}
                >
                  <span className="profile-page__stat-value">
                    {formatNumber(user.following || 0)}
                  </span>
                  <span className="profile-page__stat-label">Following</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="profile-page__content">
          <div className="profile-page__tabs">
            <button 
              className={`profile-page__tab ${activeTab === 'posts' ? 'profile-page__tab--active' : ''}`}
              onClick={() => setActiveTab('posts')}
            >
              Posts
            </button>
            <button 
              className={`profile-page__tab ${activeTab === 'replies' ? 'profile-page__tab--active' : ''}`}
              onClick={() => setActiveTab('replies')}
            >
              Replies
            </button>
            <button 
              className={`profile-page__tab ${activeTab === 'media' ? 'profile-page__tab--active' : ''}`}
              onClick={() => setActiveTab('media')}
            >
              Media
            </button>
            <button 
              className={`profile-page__tab ${activeTab === 'likes' ? 'profile-page__tab--active' : ''}`}
              onClick={() => setActiveTab('likes')}
            >
              Likes
            </button>
          </div>

          {/* Posts Content */}
          <div className="profile-page__posts">
            {postsLoading ? (
              <LoadingSpinner size="md" text="Loading posts..." />
            ) : posts.length === 0 ? (
              <div className="profile-page__empty">
                <p>{isOwnProfile ? 'You haven\'t posted anything yet.' : 'No posts yet'}</p>
                {isOwnProfile && (
                  <Button 
                    variant="primary" 
                    onClick={() => navigate('/')}
                  >
                    Create your first post
                  </Button>
                )}
              </div>
            ) : (
              posts.map((edge: any) => (
                <Post key={edge.node.id} post={edge.node} />
              ))
            )}
          </div>
        </div>

        {/* Edit Profile Modal */}
        <EditProfileModal
          user={user}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={handleProfileUpdate}
        />
      </div>
    </ErrorBoundary>
  );
};