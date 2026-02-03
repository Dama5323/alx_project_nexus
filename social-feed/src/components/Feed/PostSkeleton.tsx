import React from 'react';
import './PostSkeleton.css';

export const PostSkeleton: React.FC = () => {
  return (
    <div className="post-skeleton">
      <div className="post-skeleton__header">
        <div className="post-skeleton__avatar" />
        <div className="post-skeleton__info">
          <div className="post-skeleton__line post-skeleton__line--name" />
          <div className="post-skeleton__line post-skeleton__line--meta" />
        </div>
      </div>
      <div className="post-skeleton__content">
        <div className="post-skeleton__line post-skeleton__line--full" />
        <div className="post-skeleton__line post-skeleton__line--full" />
        <div className="post-skeleton__line post-skeleton__line--half" />
      </div>
      <div className="post-skeleton__actions">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="post-skeleton__action" />
        ))}
      </div>
    </div>
  );
};