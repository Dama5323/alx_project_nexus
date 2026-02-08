import React from 'react';
import './LinkPost.css';

interface LinkPostProps {
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  timestamp: string;
  content: string;
  mediaUrl?: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked?: boolean;
}

const LinkPost: React.FC<LinkPostProps> = ({
  authorName,
  authorHandle,
  authorAvatar,
  timestamp,
  content,
  mediaUrl,
  likes,
  comments,
  shares,
  isLiked = false
}) => {
  return (
    <div className="linkedin-post">
      {/* Post Header - Author info */}
      <div className="post-header">
        <div className="post-author">
          <img 
            src={authorAvatar} 
            alt={authorName} 
            className="author-avatar"
          />
          <div className="author-info">
            <div className="author-name">{authorName}</div>
            <div className="author-details">
              <span className="author-handle">@{authorHandle}</span>
              <span className="post-timestamp"> · {timestamp}</span>
            </div>
          </div>
        </div>
        <button className="post-options">
          <i className="fas fa-ellipsis-h"></i>
        </button>
      </div>
      
      {/* Post Content - Text */}
      <div className="post-content">
        <p>{content}</p>
      </div>
      
      {/* Post Media - Image/Video */}
      {mediaUrl && (
        <div className="post-media">
          <img 
            src={mediaUrl} 
            alt="Post media" 
            className="post-image"
          />
        </div>
      )}
      
      {/* Post Stats */}
      <div className="post-stats">
        <span className="stat-item">
          <i className="fas fa-thumbs-up"></i> {likes.toLocaleString()}
        </span>
        <span className="stat-item">
          {comments.toLocaleString()} comments
        </span>
        <span className="stat-item">
          {shares.toLocaleString()} shares
        </span>
      </div>
      
      {/* Post Actions */}
      <div className="post-actions">
        <button className={`action-btn ${isLiked ? 'active' : ''}`}>
          <i className="fas fa-thumbs-up"></i>
          <span>Like</span>
        </button>
        <button className="action-btn">
          <i className="fas fa-comment"></i>
          <span>Comment</span>
        </button>
        <button className="action-btn">
          <i className="fas fa-share"></i>
          <span>Share</span>
        </button>
        <button className="action-btn">
          <i className="fas fa-paper-plane"></i>
          <span>Send</span>
        </button>
      </div>
      
      {/* Comments Section */}
      <div className="post-comments">
        <div className="add-comment">
          <img 
            src="https://via.placeholder.com/32" 
            alt="Your avatar" 
            className="comment-avatar"
          />
          <div className="comment-input-container">
            <input 
              type="text" 
              placeholder="Add a comment..." 
              className="comment-input"
            />
            <div className="comment-actions">
              <button className="comment-emoji">
                <i className="far fa-smile"></i>
              </button>
              <button className="comment-submit">
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
        
        {/* Sample Comment */}
        <div className="comment">
          <img 
            src="https://via.placeholder.com/32" 
            alt="React Dev" 
            className="comment-avatar"
          />
          <div className="comment-content">
            <div className="comment-author">
              <span className="comment-name">React Developer</span>
              <span className="comment-handle">@reactdev</span>
              <span className="comment-time"> · 1 hour ago</span>
            </div>
            <p className="comment-text">Great post! Love the new layout.</p>
            <div className="comment-actions">
              <button className="comment-like">
                <i className="far fa-thumbs-up"></i> Like
              </button>
              <button className="comment-reply">Reply</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkPost;