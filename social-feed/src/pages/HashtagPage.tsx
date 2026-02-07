import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_HASHTAG_POSTS } from '../graphql/queries/hashtagQueries';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './HashtagPage.css';

const HashtagPage: React.FC = () => {
  const { hashtag } = useParams<{ hashtag: string }>();
  const decodedHashtag = hashtag ? decodeURIComponent(hashtag) : '';
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');

  const { loading, error, data } = useQuery(GET_HASHTAG_POSTS, {
    variables: { hashtag: decodedHashtag, sortBy }
  });

  if (loading) {
    return (
      <div className="hashtag-page">
        <div className="loading">Loading posts for #{decodedHashtag}...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hashtag-page">
        <div className="error">Error loading posts: {error.message}</div>
      </div>
    );
  }

  const posts = data?.hashtagPosts || [];
  const trendingData = data?.hashtagStats || {
    postCount: 0,
    trendScore: 0,
    growth: 0
  };

  return (
    <div className="hashtag-page">
      <div className="hashtag-header">
        <h1>#{decodedHashtag}</h1>
        <div className="hashtag-stats">
          <div className="stat">
            <span className="stat-value">{trendingData.postCount}</span>
            <span className="stat-label">Posts</span>
          </div>
          <div className="stat">
            <span className="stat-value">{trendingData.trendScore}</span>
            <span className="stat-label">Trend Score</span>
          </div>
          <div className="stat">
            <span className="stat-value">{trendingData.growth > 0 ? '+' : ''}{trendingData.growth}%</span>
            <span className="stat-label">Growth</span>
          </div>
        </div>
        
        <div className="sort-options">
          <button 
            className={sortBy === 'recent' ? 'active' : ''}
            onClick={() => setSortBy('recent')}
          >
            Recent
          </button>
          <button 
            className={sortBy === 'popular' ? 'active' : ''}
            onClick={() => setSortBy('popular')}
          >
            Popular
          </button>
        </div>
      </div>

      <div className="hashtag-description">
        <p>Explore posts tagged with #{decodedHashtag}</p>
      </div>

      <div className="posts-grid">
        {posts.length === 0 ? (
          <div className="no-posts">
            <p>No posts yet with #{decodedHashtag}. Be the first to post!</p>
          </div>
        ) : (
          posts.map((post: any) => (
            <div key={post.id} className="post-card">
              <Link to={`/post/${post.id}`} className="post-link">
                <div className="post-author">
                  <img src={post.author.avatar} alt={post.author.name} />
                  <div>
                    <div className="author-name">{post.author.name}</div>
                    <div className="author-username">@{post.author.username}</div>
                  </div>
                </div>
                <div className="post-content">{post.content}</div>
                {post.images && post.images.length > 0 && (
                  <div className="post-images">
                    <img src={post.images[0]} alt="Post" />
                  </div>
                )}
                <div className="post-stats">
                  <span>❤️ {post.likes}</span>
                  <span>💬 {post.comments}</span>
                  <span>🔄 {post.shares}</span>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HashtagPage;