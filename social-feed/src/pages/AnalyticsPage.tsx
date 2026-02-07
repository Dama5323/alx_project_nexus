import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_ANALYTICS } from '../graphql/queries/analyticsQueries';
import { useAuth } from '../hooks/useAuth';
import { formatNumber } from '../utils/helpers/formatNumbers';
import './AnalyticsPage.css';

// Mock data for testing
const getMockAnalytics = () => ({
  totalPosts: 42,
  totalLikes: 1250,
  totalComments: 340,
  totalShares: 180,
  totalViews: 5600,
  followerGrowth: 12.5,
  engagementRate: 4.2,
  topPosts: [
    {
      id: '1',
      content: 'Just launched my new project! 🚀 #WebDevelopment #ReactJS',
      likes: 245,
      comments: 18,
      views: 1200
    },
    {
      id: '2',
      content: 'Working on something exciting! Stay tuned. #AI #Tech',
      likes: 45,
      comments: 3,
      views: 300
    },
    {
      id: '3',
      content: 'The future of web development is here! #JavaScript #Trending',
      likes: 89,
      comments: 12,
      views: 450
    }
  ],
  peakTimes: ['10:00 AM', '2:00 PM', '8:00 PM']
});

const AnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  
  // Use mock data for testing, or query if backend is ready
  const useMockData = true; // Set to false when backend is ready
  
  const { loading, error, data } = useQuery(GET_USER_ANALYTICS, {
    variables: { 
      userId: user?.id || "user-damachege", // Fallback ID
      timeRange 
    },
    skip: !user?.id || useMockData // Skip query if using mock data
  });

  // Use mock data if enabled or if there's an error
  const analytics = useMockData || error ? getMockAnalytics() : (data?.userAnalytics || getMockAnalytics());

  if (!user) {
    return (
      <div className="analytics-container">
        <div className="analytics-content">
          <div className="error">
            <h2>Please log in to view analytics</h2>
            <p>You need to be logged in to access your analytics dashboard.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading && !useMockData) {
    return (
      <div className="analytics-container">
        <div className="analytics-content">
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show mock data notice if using mock data
  const isMockData = useMockData || error;

  return (
    <div className="analytics-container">
      <div className="analytics-content">
        <div className="analytics-header">
          <h1>Analytics Dashboard</h1>
          {isMockData && (
            <p className="mock-notice">
              ⚠️ Displaying sample data. Connect to backend for real analytics.
            </p>
          )}
          
          <div className="time-range-selector">
            <button 
              className={`time-range-btn ${timeRange === '7d' ? 'active' : ''}`}
              onClick={() => setTimeRange('7d')}
            >
              7 Days
            </button>
            <button 
              className={`time-range-btn ${timeRange === '30d' ? 'active' : ''}`}
              onClick={() => setTimeRange('30d')}
            >
              30 Days
            </button>
            <button 
              className={`time-range-btn ${timeRange === '90d' ? 'active' : ''}`}
              onClick={() => setTimeRange('90d')}
            >
              90 Days
            </button>
          </div>
        </div>

        {error && !useMockData && (
          <div className="error">
            <h3>⚠️ Backend Connection Failed</h3>
            <p>Using sample data. Error: {error.message}</p>
          </div>
        )}

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Posts</h3>
            <div className="stat-value">{formatNumber(analytics.totalPosts)}</div>
            <div className="stat-change positive">
              <span>↗</span>
              <span>+12.5%</span>
            </div>
          </div>
          
          <div className="stat-card">
            <h3>Total Likes</h3>
            <div className="stat-value">{formatNumber(analytics.totalLikes)}</div>
            <div className="stat-change positive">
              <span>↗</span>
              <span>+8.3%</span>
            </div>
          </div>
          
          <div className="stat-card">
            <h3>Total Comments</h3>
            <div className="stat-value">{formatNumber(analytics.totalComments)}</div>
            <div className="stat-change positive">
              <span>↗</span>
              <span>+5.7%</span>
            </div>
          </div>
          
          <div className="stat-card">
            <h3>Total Views</h3>
            <div className="stat-value">{formatNumber(analytics.totalViews)}</div>
            <div className="stat-change positive">
              <span>↗</span>
              <span>+15.2%</span>
            </div>
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-header">
            <h2>Engagement Overview</h2>
            <span className="time-period">Last {timeRange === '7d' ? '7' : timeRange === '30d' ? '30' : '90'} days</span>
          </div>
          <div className="engagement-chart">
            <div className="chart-placeholder">
              <div className="chart-bars">
                {[65, 80, 45, 90, 75, 85, 60].map((height, index) => (
                  <div 
                    key={index}
                    className="chart-bar"
                    style={{ height: `${height}%` }}
                  ></div>
                ))}
              </div>
              <div className="chart-labels">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span>
                <span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>
            <div className="chart-summary">
              <div className="summary-item">
                <span className="summary-label">Engagement Rate</span>
                <span className="summary-value">{analytics.engagementRate.toFixed(1)}%</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Follower Growth</span>
                <span className="summary-value positive">+{analytics.followerGrowth.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>

        {analytics.topPosts.length > 0 && (
          <div className="top-posts-section">
            <h2>Top Performing Posts</h2>
            <div className="posts-list">
              {analytics.topPosts.map((post: any, index: number) => (
                <div key={post.id} className="post-item">
                  <div className="post-rank">#{index + 1}</div>
                  <div className="post-content">
                    <p className="post-text">{post.content.substring(0, 80)}{post.content.length > 80 ? '...' : ''}</p>
                    <div className="post-stats">
                      <span title="Likes">❤️ {formatNumber(post.likes)}</span>
                      <span title="Comments">💬 {formatNumber(post.comments)}</span>
                      <span title="Views">👁️ {formatNumber(post.views)}</span>
                    </div>
                  </div>
                  <button className="view-post-btn">View Post</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {analytics.peakTimes.length > 0 && (
          <div className="peak-times-section">
            <h2>Peak Engagement Times</h2>
            <div className="peak-times">
              {analytics.peakTimes.map((time: string, index: number) => (
                <div key={index} className="time-slot">
                  <span className="time">{time}</span>
                  <div className="time-bar">
                    <div 
                      className="time-fill" 
                      style={{ width: `${80 - (index * 10)}%` }}
                    ></div>
                  </div>
                  <span className="time-percentage">{80 - (index * 10)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;