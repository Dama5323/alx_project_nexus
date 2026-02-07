// src/pages/TrendingPage.tsx
import React from 'react';
import './TrendingPage.css';

const TrendingPage: React.FC = () => {
  const trendingTopics = [
    { tag: '#WebDevelopment', posts: '15.2K posts' },
    { tag: '#ReactJS', posts: '12.5K posts' },
    { tag: '#TypeScript', posts: '8.7K posts' },
    { tag: '#AI', posts: '25.3K posts' },
    { tag: '#Startup', posts: '7.1K posts' },
    { tag: '#JavaScript', posts: '18.5K posts' },
    { tag: '#DevOps', posts: '6.3K posts' },
    { tag: '#Cloud', posts: '9.8K posts' },
  ];

  const trendingPosts = [
    {
      title: 'The Future of Web Development',
      author: '@webdev',
      likes: '2.1K likes',
      description: 'Exploring new frameworks and tools for modern web development'
    },
    {
      title: 'AI Revolution in 2024',
      author: '@techguru',
      likes: '3.4K likes',
      description: 'How artificial intelligence is transforming industries'
    },
    {
      title: 'Building Scalable React Apps',
      author: '@reactmaster',
      likes: '1.8K likes',
      description: 'Best practices for React performance optimization'
    },
  ];

  return (
    <div className="trending-page">
      <header className="trending-header">
        <h1>🔥 Trending Now</h1>
        <p className="trending-subtitle">Discover what's popular right now</p>
      </header>

      <div className="trending-content">
        {/* Featured Trending Content */}
        <div className="trending-featured">
          <div className="featured-item">
            <h3>Latest Architecture Trends</h3>
            <img 
              src="https://res.cloudinary.com/dzyqof9it/image/upload/v1758450227/architecture_diagrams/qogwykhgjfvtndencg2l.png" 
              alt="System Architecture" 
              className="trending-image"
            />
            <p className="featured-description">
              Modern system architecture for scalable web applications. This diagram shows the latest patterns 
              for building resilient and performant systems.
            </p>
            <div className="featured-stats">
              <span className="stat">📊 45K views</span>
              <span className="stat">💬 1.2K comments</span>
              <span className="stat">🔖 890 saves</span>
            </div>
          </div>

          <div className="featured-item">
            <h3>New Projects Coming Soon</h3>
            <img 
              src="https://res.cloudinary.com/dzyqof9it/image/upload/v1758428111/profile/a9aie0pfuowrmmix3sc0.jpg" 
              alt="New Project Preview" 
              className="trending-image"
            />
            <p className="featured-description">
              Exciting new features launching next month! Stay tuned for major updates to our platform 
              including enhanced collaboration tools and AI-powered features.
            </p>
            <div className="featured-stats">
              <span className="stat">👀 32K views</span>
              <span className="stat">👍 4.5K likes</span>
              <span className="stat">↪️ 2.1K shares</span>
            </div>
          </div>
        </div>

        {/* Trending Topics Section */}
        <div className="trending-topics">
          <h2 className="section-title">Top Trending Topics</h2>
          <div className="topics-grid">
            {trendingTopics.map((topic, index) => (
              <div key={index} className="topic-card">
                <span className="topic-rank">#{index + 1}</span>
                <div className="topic-content">
                  <h4 className="topic-tag">{topic.tag}</h4>
                  <p className="topic-count">{topic.posts}</p>
                </div>
                <button className="btn-follow-topic">Follow</button>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Posts Section */}
        <div className="trending-posts">
          <h2 className="section-title">Popular Posts</h2>
          <div className="posts-list">
            {trendingPosts.map((post, index) => (
              <div key={index} className="post-item">
                <div className="post-rank">
                  <span className="rank-number">{index + 1}</span>
                  <div className="rank-trend">
                    <span className="trend-icon">📈</span>
                  </div>
                </div>
                <div className="post-content">
                  <h4 className="post-title">{post.title}</h4>
                  <p className="post-author">{post.author}</p>
                  <p className="post-description">{post.description}</p>
                  <div className="post-stats">
                    <span className="post-likes">{post.likes}</span>
                    <button className="btn-view-post">View Post →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Users Section */}
        <div className="trending-users">
          <h2 className="section-title">Who to Follow</h2>
          <div className="users-list">
            <div className="user-card">
              <img 
                src="https://res.cloudinary.com/dzyqof9it/image/upload/v1758428111/profile/a9aie0pfuowrmmix3sc0.jpg" 
                alt="Sarah Developer" 
                className="user-avatar"
              />
              <div className="user-info">
                <h4>Sarah Developer</h4>
                <p className="user-handle">@sarahdev</p>
                <p className="user-followers">Tik Tok followers</p>
              </div>
              <button className="btn-follow">Follow</button>
            </div>
            <div className="user-card">
              <div className="avatar-placeholder">AT</div>
              <div className="user-info">
                <h4>Alex Tech</h4>
                <p className="user-handle">@alextech</p>
                <p className="user-followers">Tik Tok followers</p>
              </div>
              <button className="btn-follow">Follow</button>
            </div>
            <div className="user-card">
              <div className="avatar-placeholder">CM</div>
              <div className="user-info">
                <h4>Code Master</h4>
                <p className="user-handle">@codemaster</p>
                <p className="user-followers">Tik Tok followers</p>
              </div>
              <button className="btn-follow">Follow</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingPage;