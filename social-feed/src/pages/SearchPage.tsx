import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { SEARCH_CONTENT } from '../graphql/queries/searchQueries';
import { Link } from 'react-router-dom';
import './SearchPage.css';

const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'all' | 'users' | 'posts' | 'hashtags'>('all');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { loading, error, data } = useQuery(SEARCH_CONTENT, {
    variables: { 
      query: debouncedQuery,
      type: searchType,
      limit: 20 
    },
    skip: !debouncedQuery.trim()
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setDebouncedQuery(searchQuery);
    }
  };

  return (
    <div className="search-page">
      <div className="search-header">
        <h1>Search</h1>
        
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-container">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for users, posts, or hashtags..."
              className="search-input"
              autoFocus
            />
            <button type="submit" className="search-btn">
              🔍
            </button>
          </div>
        </form>

        <div className="search-filters">
          <button 
            className={`filter-btn ${searchType === 'all' ? 'active' : ''}`}
            onClick={() => setSearchType('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${searchType === 'users' ? 'active' : ''}`}
            onClick={() => setSearchType('users')}
          >
            Users
          </button>
          <button 
            className={`filter-btn ${searchType === 'posts' ? 'active' : ''}`}
            onClick={() => setSearchType('posts')}
          >
            Posts
          </button>
          <button 
            className={`filter-btn ${searchType === 'hashtags' ? 'active' : ''}`}
            onClick={() => setSearchType('hashtags')}
          >
            Hashtags
          </button>
        </div>
      </div>

      <div className="search-results">
        {!debouncedQuery ? (
          <div className="search-empty">
            <div className="empty-illustration">🔍</div>
            <h2>Start searching</h2>
            <p>Enter a query to find users, posts, or hashtags</p>
            
            <div className="trending-searches">
              <h3>Trending Searches</h3>
              <div className="trending-tags">
                <span className="trending-tag">#WebDevelopment</span>
                <span className="trending-tag">#ReactJS</span>
                <span className="trending-tag">#TypeScript</span>
                <span className="trending-tag">#AI</span>
                <span className="trending-tag">#Startup</span>
              </div>
            </div>
          </div>
        ) : loading ? (
          <div className="search-loading">
            <div className="loading-spinner"></div>
            <p>Searching for "{debouncedQuery}"...</p>
          </div>
        ) : error ? (
          <div className="search-error">
            <p>Error: {error.message}</p>
          </div>
        ) : (
          <>
            {/* Users results */}
            {data?.search.users.length > 0 && (
              <div className="results-section">
                <h3>Users</h3>
                <div className="users-grid">
                  {data.search.users.map((user: any) => (
                    <Link key={user.id} to={`/profile/${user.id}`} className="user-card">
                      <div className="user-avatar">
                        <img src={user.avatar} alt={user.name} />
                      </div>
                      <div className="user-info">
                        <h4>{user.name}</h4>
                        <p className="username">@{user.username}</p>
                        <p className="user-bio">{user.bio}</p>
                        <div className="user-stats">
                          <span>{user.followers} followers</span>
                          <span>•</span>
                          <span>{user.postsCount} posts</span>
                        </div>
                      </div>
                      <button className="follow-btn">Follow</button>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Posts results */}
            {data?.search.posts.length > 0 && (
              <div className="results-section">
                <h3>Posts</h3>
                <div className="posts-grid">
                  {data.search.posts.map((post: any) => (
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
                  ))}
                </div>
              </div>
            )}

            {/* Hashtags results */}
            {data?.search.hashtags.length > 0 && (
              <div className="results-section">
                <h3>Hashtags</h3>
                <div className="hashtags-grid">
                  {data.search.hashtags.map((hashtag: any) => (
                    <Link 
                      key={hashtag.name} 
                      to={`/hashtag/${hashtag.name}`}
                      className="hashtag-card"
                    >
                      <div className="hashtag-header">
                        <span className="hashtag-icon">#</span>
                        <h4>{hashtag.name}</h4>
                      </div>
                      <p className="hashtag-posts">{hashtag.postCount} posts</p>
                      <div className="hashtag-trend">
                        <span className={`trend-indicator ${hashtag.trend > 0 ? 'up' : 'down'}`}>
                          {hashtag.trend > 0 ? '↗' : '↘'} {Math.abs(hashtag.trend)}%
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* No results */}
            {data && 
              data.search.users.length === 0 && 
              data.search.posts.length === 0 && 
              data.search.hashtags.length === 0 && (
              <div className="no-results">
                <div className="no-results-illustration">😕</div>
                <h3>No results found for "{debouncedQuery}"</h3>
                <p>Try different keywords or check your spelling</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;