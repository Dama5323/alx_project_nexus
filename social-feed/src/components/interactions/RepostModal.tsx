// src/components/interactions/RepostModal.tsx - UPDATED
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { Post } from '../../types';
import { REPOST } from '../../graphql/mutations/repostMutations'; // Remove QUOTE_POST
import { useAuth } from '../../hooks/useAuth';
import './RepostModal.css';

export interface RepostModalProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const RepostModal: React.FC<RepostModalProps> = ({
  post,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [comment, setComment] = useState('');
  const [repost, { loading }] = useMutation(REPOST, {
    onCompleted: () => {
      onClose();
      setComment('');
      onSuccess?.();
    },
  });

  const { user } = useAuth();

  const handleRepost = () => {
    if (!user) return;
    
    repost({
      variables: {
        postId: post.id,
        comment: comment.trim() || null,
      },
    });
  };

  const handleQuote = () => {
    // If you need quote functionality, implement it separately
    console.log('Quote post functionality not implemented');
  };

  if (!isOpen) return null;

  return (
    <div className="repost-modal">
      <div className="repost-modal__content">
        <div className="repost-modal__header">
          <h3 className="repost-modal__title">Repost</h3>
          <button className="repost-modal__close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="repost-modal__post">
          <Avatar
            src={post.author.avatar}
            alt={post.author.name}
            size="sm"
          />
          <div className="repost-modal__post-content">
            <div className="repost-modal__post-header">
              <span className="repost-modal__post-author">{post.author.name}</span>
              <span className="repost-modal__post-username">@{post.author.username}</span>
            </div>
            <p className="repost-modal__post-text">{post.content}</p>
          </div>
        </div>

        <div className="repost-modal__input">
          <Avatar
            src={user?.avatar}
            alt={user?.name}
            size="sm"
          />
          <textarea
            className="repost-modal__textarea"
            placeholder="Add a comment (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />
        </div>

        <div className="repost-modal__actions">
          <Button
            variant="ghost"
            onClick={onClose}
          >
            Cancel
          </Button>
          <div className="repost-modal__action-buttons">
            <Button
              variant="outline"
              onClick={handleQuote}
              disabled={true} // Disabled until quote is implemented
            >
              Quote
            </Button>
            <Button
              variant="primary"
              onClick={handleRepost}
              disabled={loading}
              isLoading={loading}
            >
              Repost
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};