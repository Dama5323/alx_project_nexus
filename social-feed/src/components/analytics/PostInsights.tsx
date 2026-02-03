import React from 'react';
import { usePostAnalytics } from '../../hooks/usePostAnalytics';
import { formatNumber, formatPercentage } from '../../utils/helpers/formatNumbers';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { EngagementChart } from './EngagementChart';
import './PostInsights.css';

export interface PostInsightsProps {
  postId: string;
}

export const PostInsights: React.FC<PostInsightsProps> = ({ postId }) => {
  const { analytics, loading, error } = usePostAnalytics(postId);

  if (loading) {
    return (
      <div className="post-insights__loading">
        <LoadingSpinner size="md" text="Loading insights..." />
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="post-insights__error">
        <p>Failed to load insights</p>
      </div>
    );
  }

  const metrics = [
    {
      label: 'Total Views',
      value: formatNumber(analytics.views),
      icon: '👁️',
      color: '#1DA1F2',
    },
    {
      label: 'Unique Viewers',
      value: formatNumber(analytics.uniqueViews),
      icon: '👤',
      color: '#17BF63',
    },
    {
      label: 'Impressions',
      value: formatNumber(analytics.impressions),
      icon: '📊',
      color: '#794BC4',
    },
    {
      label: 'Engagement Rate',
      value: `${analytics.engagementRate.toFixed(2)}%`,
      icon: '💬',
      color: '#F91880',
    },
    {
      label: 'Click Through Rate',
      value: `${analytics.clickThroughRate.toFixed(2)}%`,
      icon: '🔗',
      color: '#FFAD1F',
    },
    {
      label: 'Reach',
      value: `${analytics.reachPercentage.toFixed(2)}%`,
      icon: '🎯',
      color: '#E0245E',
    },
  ];

  return (
    <div className="post-insights">
      <h2 className="post-insights__title">Post Insights</h2>

      <div className="post-insights__metrics">
        {metrics.map((metric) => (
          <div key={metric.label} className="post-insights__metric">
            <div className="post-insights__metric-icon" style={{ color: metric.color }}>
              {metric.icon}
            </div>
            <div className="post-insights__metric-content">
              <span className="post-insights__metric-value">{metric.value}</span>
              <span className="post-insights__metric-label">{metric.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="post-insights__chart">
        <EngagementChart postId={postId} />
      </div>

      {analytics.topLocations && analytics.topLocations.length > 0 && (
        <div className="post-insights__section">
          <h3 className="post-insights__section-title">Top Locations</h3>
          <div className="post-insights__locations">
            {analytics.topLocations.map((location, index) => (
              <div key={index} className="post-insights__location">
                <span className="post-insights__location-icon">📍</span>
                <span className="post-insights__location-name">{location}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};