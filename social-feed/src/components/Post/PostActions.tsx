import React, { useState } from 'react';
import { Tooltip } from '../common/Tooltip';
import { formatNumber } from '../../utils/helpers/formatNumbers';
import './PostActions.css';

export interface PostActionsProps {
  postId: string;
  likes: number;
  comments: number;
  reposts: number;
  shares: number;
  isLiked?: boolean;
  isReposted?: boolean;
  isSaved?: boolean;
  onLike: () => void;
  onComment: () => void;
  onRepost: () => void;
  onShare: () => void;
  onSave: () => void;
}

export const PostActions: React.FC<PostActionsProps> = ({
  likes,
  comments,
  reposts,
  shares,
  isLiked = false,
  isReposted = false,
  isSaved = false,
  onLike,
  onComment,
  onRepost,
  onShare,
  onSave,
}) => {
  const [isAnimating, setIsAnimating] = useState<string | null>(null);

  const handleAction = (action: () => void, type: string) => {
    setIsAnimating(type);
    action();
    setTimeout(() => setIsAnimating(null), 300);
  };

  return (
    <div className="post-actions">
      {/* COMMENT */}
      <Tooltip content="Reply">
        <button
          className="post-actions__button"
          onClick={() => handleAction(onComment, 'comment')}
          aria-label="Comment"
        >
          <div className={`post-actions__icon ${isAnimating === 'comment' ? 'animate' : ''}`}>
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path
                fill="currentColor"
                d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13
                   0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067
                   c-4.49.1-8.183-3.51-8.183-8.01z"
              />
            </svg>
          </div>
          {comments > 0 && (
            <span className="post-actions__count">
              {formatNumber(comments)}
            </span>
          )}
        </button>
      </Tooltip>

      {/* REPOST */}
      <Tooltip content={isReposted ? 'Undo repost' : 'Repost'}>
        <button
          className={`post-actions__button ${
            isReposted ? 'post-actions__button--active-repost' : ''
          }`}
          onClick={() => handleAction(onRepost, 'repost')}
          aria-label="Repost"
        >
          <div className={`post-actions__icon ${isAnimating === 'repost' ? 'animate' : ''}`}>
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path
                fill="currentColor"
                d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16
                   c0 1.1.896 2 2 2H13v2H7.5
                   c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88z"
              />
            </svg>
          </div>
          {reposts > 0 && (
            <span className="post-actions__count">
              {formatNumber(reposts)}
            </span>
          )}
        </button>
      </Tooltip>

      {/* LIKE */}
      <Tooltip content={isLiked ? 'Unlike' : 'Like'}>
        <button
          className={`post-actions__button ${
            isLiked ? 'post-actions__button--active-like' : ''
          }`}
          onClick={() => handleAction(onLike, 'like')}
          aria-label="Like"
        >
          <div className={`post-actions__icon ${isAnimating === 'like' ? 'animate-heart' : ''}`}>
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path
                fill={isLiked ? 'currentColor' : 'none'}
                stroke={isLiked ? 'none' : 'currentColor'}
                strokeWidth={isLiked ? 0 : 2}
                d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16
                   l-.805 1.09-.806-1.09
                   C9.984 6.01 8.526 5.44 7.304 5.5
                   c-1.243.07-2.349.78-2.91 1.91
                   -.552 1.12-.633 2.78.479 4.82
                   1.074 1.97 3.257 4.27 7.129 6.61
                   3.87-2.34 6.052-4.64 7.126-6.61z"
              />
            </svg>
          </div>
          {likes > 0 && (
            <span className="post-actions__count">
              {formatNumber(likes)}
            </span>
          )}
        </button>
      </Tooltip>

      {/* SHARE */}
      <Tooltip content="Share">
        <button
          className="post-actions__button"
          onClick={() => handleAction(onShare, 'share')}
          aria-label="Share"
        >
          <div className={`post-actions__icon ${isAnimating === 'share' ? 'animate' : ''}`}>
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path
                fill="currentColor"
                d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41
                   l-3.3 3.3-1.41-1.42L12 2.59z"
              />
            </svg>
          </div>
          {shares > 0 && (
            <span className="post-actions__count">
              {formatNumber(shares)}
            </span>
          )}
        </button>
      </Tooltip>

      {/* SAVE */}
      <Tooltip content={isSaved ? 'Remove from saved' : 'Save'}>
        <button
          className={`post-actions__button ${
            isSaved ? 'post-actions__button--active-save' : ''
          }`}
          onClick={() => handleAction(onSave, 'save')}
          aria-label="Save"
        >
          <div className={`post-actions__icon ${isAnimating === 'save' ? 'animate' : ''}`}>
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path
                fill={isSaved ? 'currentColor' : 'none'}
                stroke={isSaved ? 'none' : 'currentColor'}
                strokeWidth={isSaved ? 0 : 2}
                d="M4 4.5C4 3.12 5.119 2 6.5 2h11
                   C18.881 2 20 3.12 20 4.5v18.44
                   l-8-5.71-8 5.71V4.5z"
              />
            </svg>
          </div>
        </button>
      </Tooltip>
    </div>
  );
};
