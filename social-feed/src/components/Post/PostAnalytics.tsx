import React, { useState } from 'react';
import { usePostAnalytics } from '../../hooks/usePostAnalytics';
import { formatNumber } from '../../utils/helpers/formatNumbers';
import { Modal } from '../common/Modal';
import { ViewersModal } from '../interactions/ViewersModal';
import './PostAnalytics.css';

export interface PostAnalyticsProps {
  postId: string;
  isOwner: boolean;
}

export const PostAnalytics: React.FC<PostAnalyticsProps> = ({ postId, isOwner }) => {
  const { analytics, loading } = usePostAnalytics(postId);
  const [showViewers, setShowViewers] = useState(false);
  const [showDetailedAnalytics, setShowDetailedAnalytics] = useState(false);

  if (!isOwner || loading || !analytics) return null;

  return (
    <>
      <div className="post-analytics">
        <button
          className="post-analytics__trigger"
          onClick={() => setShowViewers(true)}
          title="View analytics"
        >
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path
              fill="currentColor"
              d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
            />
          </svg>
          <span className="post-analytics__views">{formatNumber(analytics.views || 0)} views</span>
        </button>

        <button
          className="post-analytics__details-link"
          onClick={() => setShowDetailedAnalytics(true)}
        >
          View detailed analytics
        </button>
      </div>

      {showViewers && (
        <ViewersModal postId={postId} onClose={() => setShowViewers(false)} />
      )}

      {showDetailedAnalytics && (
        <Modal
          isOpen={showDetailedAnalytics}
          onClose={() => setShowDetailedAnalytics(false)}
          title="Post Analytics"
          size="lg"
        >
          <div className="post-analytics__detailed">
            <div className="post-analytics__metric-grid">
              <div className="post-analytics__metric">
                <div className="post-analytics__metric-icon">👁️</div>
                <div className="post-analytics__metric-info">
                  <span className="post-analytics__metric-value">
                    {formatNumber(analytics.views || 0)}
                  </span>
                  <span className="post-analytics__metric-label">Total Views</span>
                </div>
              </div>

              <div className="post-analytics__metric">
                <div className="post-analytics__metric-icon">👤</div>
                <div className="post-analytics__metric-info">
                  <span className="post-analytics__metric-value">
                    {formatNumber(analytics.uniqueViews || 0)}
                  </span>
                  <span className="post-analytics__metric-label">Unique Views</span>
                </div>
              </div>

              <div className="post-analytics__metric">
                <div className="post-analytics__metric-icon">📊</div>
                <div className="post-analytics__metric-info">
                  <span className="post-analytics__metric-value">
                    {formatNumber(analytics.impressions || 0)}
                  </span>
                  <span className="post-analytics__metric-label">Impressions</span>
                </div>
              </div>

              <div className="post-analytics__metric">
                <div className="post-analytics__metric-icon">💬</div>
                <div className="post-analytics__metric-info">
                  <span className="post-analytics__metric-value">
                    {(analytics.engagementRate || 0).toFixed(2)}%
                  </span>
                  <span className="post-analytics__metric-label">Engagement Rate</span>
                </div>
              </div>

              <div className="post-analytics__metric">
                <div className="post-analytics__metric-icon">🎯</div>
                <div className="post-analytics__metric-info">
                  <span className="post-analytics__metric-value">
                    {(analytics.reachPercentage || 0).toFixed(2)}%
                  </span>
                  <span className="post-analytics__metric-label">Reach</span>
                </div>
              </div>

              <div className="post-analytics__metric">
                <div className="post-analytics__metric-icon">🔗</div>
                <div className="post-analytics__metric-info">
                  <span className="post-analytics__metric-value">
                    {(analytics.clickThroughRate || 0).toFixed(2)}%
                  </span>
                  <span className="post-analytics__metric-label">Click Rate</span>
                </div>
              </div>
            </div>

            {analytics.topLocations && analytics.topLocations.length > 0 && (
              <div className="post-analytics__section">
                <h3 className="post-analytics__section-title">Top Locations</h3>
                <ul className="post-analytics__list">
                  {analytics.topLocations.map((location, index) => (
                    <li key={index} className="post-analytics__list-item">
                      📍 {location}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {analytics.peakViewTime && (
              <div className="post-analytics__section">
                <h3 className="post-analytics__section-title">Peak View Time</h3>
                <p className="post-analytics__peak-time">
                  🕐 {new Date(analytics.peakViewTime).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </>
  );
};