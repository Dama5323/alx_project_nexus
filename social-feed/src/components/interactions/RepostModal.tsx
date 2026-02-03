import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { Post } from '../../types';
import { REPOST, QUOTE_POST } from '../../graphql/mutations/repostMutations';
import { useAuth } from '../../hooks/useAuth';
import './RepostModal.css';

export interface RepostModalProps {
  post: Post;
  onClose: () => void;
  onSuccess?: () => void;
}

export const RepostModal: React.FC<RepostModalProps> = ({ post, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'repost' | 'quote'>('repost');
  const [comment, setComment] = useState('');
  const { user } = useAuth();

  const [repostMutation, { loading: repostLoading }] = useMutation(REPOST);
  const [quotePostMutation, { loading: quoteLoading }] = useMutation(QUOTE_POST);

  const handleRepost = async () => {
    try {
      if (mode === 'repost') {
        await repostMutation({
          variables: { postId: post.id },
        });
      } else {
        await quotePostMutation({
          variables: {
            postId: post.id,
            content: comment,
          },
        });
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error reposting:', error);
    }
  };

  const loading = repostLoading || quoteLoading;

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={mode === 'repost' ? 'Repost' : 'Quote Post'}
      size="md"
    >
      <div className="repost-modal">
        <div className="repost-modal__mode-selector">
          <button
            className={`repost-modal__mode-button ${
              mode === 'repost' ? 'repost-modal__mode-button--active' : ''
            }`}
            onClick={() => setMode('repost')}
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path
                fill="currentColor"
                d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"
              />
            </svg>
            Repost
          </button>
          <button
            className={`repost-modal__mode-button ${
              mode === 'quote' ? 'repost-modal__mode-button--active' : ''
            }`}
            onClick={() => setMode('quote')}
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path
                fill="currentColor"
                d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z"
              />
            </svg>
            Quote
          </button>
        </div>

        {mode === 'quote' && user && (
          <div className="repost-modal__quote-input">
            <Avatar
              src={user.avatar}
              alt={user.name}
              size="md"
              fallback={user.name}
            />
            <textarea
              className="repost-modal__textarea"
              placeholder="Add your thoughts..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              autoFocus
            />
          </div>
        )}

        <div className="repost-modal__original-post">
          <div className="repost-modal__post-header">
            <Avatar
              src={post.author.avatar}
              alt={post.author.name}
              size="sm"
              verified={post.author.verified}
              fallback={post.author.name}
            />
            <div className="repost-modal__post-author">
              <span className="repost-modal__post-name">{post.author.name}</span>
              <span className="repost-modal__post-username">@{post.author.username}</span>
            </div>
          </div>
          <p className="repost-modal__post-content">{post.content}</p>
          {post.images && post.images.length > 0 && (
            <div className="repost-modal__post-images">
              <img
                src={post.images[0]}
                alt="Post"
                className="repost-modal__post-image"
              />
              {post.images.length > 1 && (
                <div className="repost-modal__post-more">+{post.images.length - 1}</div>
              )}
            </div>
          )}
        </div>

        <div className="repost-modal__actions">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleRepost}
            isLoading={loading}
            disabled={mode === 'quote' && !comment.trim()}
          >
            {mode === 'repost' ? 'Repost' : 'Quote Post'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};