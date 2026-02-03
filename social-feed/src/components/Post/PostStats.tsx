import React from 'react';
import { formatNumber } from '../../utils/helpers/formatNumbers';
import './PostStats.css';

export interface PostStatsProps {
  likes: number;
  comments: number;
  reposts: number;
  views: number;
  onViewDetails?: (type: 'likes' | 'reposts') => void;
}

export const PostStats: React.FC<PostStatsProps> = ({
  likes,
  comments,
  reposts,
  views,
  onViewDetails,
}) => {
  if (likes === 0 && comments === 0 && reposts === 0 && views === 0) {
    return null;
  }

  return (
    <div className="post-stats">
      {(likes > 0 || reposts > 0) && (
        <div className="post-stats__engagement">
          {reposts > 0 && (
            <button
              className="post-stats__item"
              onClick={() => onViewDetails?.('reposts')}
            >
              <span className="post-stats__count">{formatNumber(reposts)}</span>
              <span className="post-stats__label">
                {reposts === 1 ? 'Repost' : 'Reposts'}
              </span>
            </button>
          )}
          {likes > 0 && (
            <button
              className="post-stats__item"
              onClick={() => onViewDetails?.('likes')}
            >
              <span className="post-stats__count">{formatNumber(likes)}</span>
              <span className="post-stats__label">
                {likes === 1 ? 'Like' : 'Likes'}
              </span>
            </button>
          )}
        </div>
      )}
      
      {views > 0 && (
        <div className="post-stats__views">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path
              fill="currentColor"
              d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
            />
          </svg>
          <span>{formatNumber(views)}</span>
        </div>
      )}
    </div>
  );
};