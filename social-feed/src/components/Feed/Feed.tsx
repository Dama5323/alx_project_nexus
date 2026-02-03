// src/components/Feed/Feed.tsx
import React, { useState } from 'react';
import { Post } from './Post'; 
import { Button } from '../common/Button';
import { useFeed } from '../../hooks/useFeed';
import './Feed.css';

// Add 'export' keyword here
export interface FeedProps {
  userId?: string;
  showCreatePost?: boolean;
}

export const Feed: React.FC<FeedProps> = ({ userId, showCreatePost = true }) => {
  const feedResult = useFeed();
  
  // Destructure with defaults
  const {
    posts = [],
    loading,
    error,
    fetchMore,
    refetch,
  } = feedResult;
  
  // Get pageInfo with safe access
  const pageInfo = (feedResult as any).pageInfo || { 
    hasNextPage: false, 
    endCursor: null 
  };

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      if (refetch) {
        await refetch();
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error('Error refreshing feed:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleLoadMore = async () => {
    if (fetchMore && pageInfo?.hasNextPage) {
      try {
        await fetchMore();
      } catch (err) {
        console.error('Error loading more posts:', err);
      }
    }
  };

  if (loading && !refreshing) {
    return (
      <div className="feed-container">
        <div className="feed-loading">
          <div className="loading-spinner"></div>
          <p>Loading posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="feed-container">
        <div className="feed-error">
          <h3>Unable to load feed</h3>
          <p>{typeof error === 'string' ? error : 'An error occurred'}</p>
          <Button onClick={handleRefresh} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const postsArray = Array.isArray(posts) ? posts : [];

  if (postsArray.length === 0) {
    return (
      <div className="feed-container">
        <div className="feed-empty">
          <h3>No posts yet</h3>
          <p>Follow some people to see their posts here!</p>
          <p className="feed-tip">
            Tip: Connect your GraphQL backend API to load posts
          </p>
          <Button onClick={handleRefresh} variant="primary">
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="feed-container">
      {showCreatePost && (
        <div className="create-post-card">
          <div className="create-post-header">
            <h3>Create a Post</h3>
          </div>
          <div className="create-post-content">
            <textarea
              placeholder="What's on your mind?"
              className="create-post-input"
              rows={3}
            />
            <div className="create-post-actions">
              <Button variant="primary" size="sm">
                Post
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="feed-posts">
        {postsArray.map((post: any) => (
          <Post
            key={post.id}
            post={post}
          />
        ))}
      </div>

      {pageInfo?.hasNextPage && (
        <div className="feed-load-more">
          <Button
            onClick={handleLoadMore}
            variant="outline"
            isLoading={loading}
            disabled={loading}
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};