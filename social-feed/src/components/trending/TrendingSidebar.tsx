import React from 'react';

export const TrendingSidebar: React.FC = () => {
  const trendingHashtags = [
    { tag: '#WebDevelopment', posts: '15.2K' },
    { tag: '#ReactJS', posts: '12.5K' },
    { tag: '#TypeScript', posts: '8.7K' },
    { tag: '#AI', posts: '25.3K' },
    { tag: '#Startup', posts: '7.1K' },
  ];

  const trendingPosts = [
    { title: 'The Future of Web Development', author: '@webdev', likes: '2.1K' },
    { title: 'AI Revolution in 2024', author: '@techguru', likes: '3.4K' },
    { title: 'Building Scalable React Apps', author: '@reactmaster', likes: '1.8K' },
  ];

  const suggestedUsers = [
    { name: 'Sarah Developer', username: '@sarahdev', followers: '12K' },
    { name: 'Alex Tech', username: '@alextech', followers: '8K' },
    { name: 'Code Master', username: '@codemaster', followers: '15K' },
  ];

  return (
    <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      {/* Trending Hashtags */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>Trending Hashtags</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {trendingHashtags.map((item, index) => (
            <div key={index} style={{
              padding: '10px',
              borderRadius: '8px',
              background: '#f7f9f9',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}>
              <div style={{ fontWeight: 'bold', color: '#1d9bf0' }}>{item.tag}</div>
              <div style={{ fontSize: '12px', color: '#536471' }}>{item.posts} posts</div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Posts */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>Trending Posts</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {trendingPosts.map((post, index) => (
            <div key={index} style={{
              padding: '12px',
              borderRadius: '8px',
              background: '#f7f9f9'
            }}>
              <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '5px' }}>
                {post.title}
              </div>
              <div style={{ fontSize: '12px', color: '#536471', marginBottom: '5px' }}>
                {post.author}
              </div>
              <div style={{ fontSize: '12px', color: '#536471' }}>
                {post.likes} likes
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Users */}
      <div>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>Who to Follow</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {suggestedUsers.map((user, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px',
              borderRadius: '8px',
              background: '#f7f9f9'
            }}>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{user.name}</div>
                <div style={{ fontSize: '12px', color: '#536471' }}>{user.username}</div>
                <div style={{ fontSize: '11px', color: '#536471' }}>{user.followers} followers</div>
              </div>
              <button style={{
                padding: '6px 12px',
                background: '#1d9bf0',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                fontSize: '12px',
                cursor: 'pointer'
              }}>
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingSidebar;