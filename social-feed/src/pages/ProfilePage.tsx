import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_USER_PROFILE, GET_USER_POSTS } from '../graphql/queries/userQueries';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';
import { Post } from '../components/Feed/Post';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { formatNumber } from '../utils/helpers/formatNumbers';
import './ProfilePage.css';

export const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();

  const { data: profileData, loading: profileLoading } = useQuery(GET_USER_PROFILE, {
    variables: { username },
  });

  const { data: postsData, loading: postsLoading } = useQuery(GET_USER_POSTS, {
    variables: { userId: profileData?.user?.id, first: 20 },
    skip: !profileData?.user?.id,
  });

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
      </div>
    );
  }

  const user = profileData.user;
  const posts = postsData?.userPosts?.edges || [];

  return (
    <ErrorBoundary>
      <div className="profile-page">
        <div className="profile-page__header">
          <div className="profile-page__cover" />
          
          <div className="profile-page__info">
            <Avatar
              src={user.avatar}
              alt={user.name}
              size="xl"
              verified={user.verified}
              fallback={user.name}
            />

            <div className="profile-page__details">
              <div className="profile-page__name-section">
                <h1 className="profile-page__name">{user.name}</h1>
                <span className="profile-page__username">@{user.username}</span>
              </div>

              {user.bio && <p className="profile-page__bio">{user.bio}</p>}

              <div className="profile-page__stats">
                <div className="profile-page__stat">
                  <span className="profile-page__stat-value">
                    {formatNumber(user.postsCount || 0)}
                  </span>
                  <span className="profile-page__stat-label">Posts</span>
                </div>
                <div className="profile-page__stat">
                  <span className="profile-page__stat-value">
                    {formatNumber(user.followers || 0)}
                  </span>
                  <span className="profile-page__stat-label">Followers</span>
                </div>
                <div className="profile-page__stat">
                  <span className="profile-page__stat-value">
                    {formatNumber(user.following || 0)}
                  </span>
                  <span className="profile-page__stat-label">Following</span>
                </div>
              </div>

              <Button
                variant={user.isFollowing ? 'secondary' : 'primary'}
                size="md"
              >
                {user.isFollowing ? 'Following' : 'Follow'}
              </Button>
            </div>
          </div>
        </div>

        <div className="profile-page__content">
          <div className="profile-page__tabs">
            <button className="profile-page__tab profile-page__tab--active">
              Posts
            </button>
            <button className="profile-page__tab">Replies</button>
            <button className="profile-page__tab">Media</button>
            <button className="profile-page__tab">Likes</button>
          </div>

          <div className="profile-page__posts">
            {postsLoading ? (
              <LoadingSpinner size="md" text="Loading posts..." />
            ) : posts.length === 0 ? (
              <div className="profile-page__empty">
                <p>No posts yet</p>
              </div>
            ) : (
              posts.map((edge: any) => (
                <Post key={edge.node.id} post={edge.node} />
              ))
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};