import React, { useState, useRef } from 'react';
import { useMutation } from '@apollo/client';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { ADD_COMMENT } from '../../graphql/mutations/commentMutations';
import { useAuth } from '../../hooks/useAuth';
import { LIMITS } from '../../utils/constants/appConstants';
import './CommentInput.css';

export interface CommentInputProps {
  postId: string;
  parentId?: string;
  placeholder?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  autoFocus?: boolean;
}

export const CommentInput: React.FC<CommentInputProps> = ({
  postId,
  parentId,
  placeholder = 'Write a comment...',
  onSuccess,
  onCancel,
  autoFocus = false,
}) => {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useAuth();

  const [addComment, { loading }] = useMutation(ADD_COMMENT, {
    onCompleted: () => {
      setContent('');
      onSuccess?.();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || loading) return;

    try {
      await addComment({
        variables: {
          input: {
            postId,
            content: content.trim(),
            parentId,
          },
        },
      });
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  React.useEffect(() => {
    adjustTextareaHeight();
  }, [content]);

  if (!user) {
    return (
      <div className="comment-input__login-prompt">
        <p>Please log in to comment</p>
      </div>
    );
  }

  const remainingChars = LIMITS.COMMENT_MAX_LENGTH - content.length;
  const isOverLimit = remainingChars < 0;

  return (
    <form className="comment-input" onSubmit={handleSubmit}>
      <Avatar
        src={user.avatar}
        alt={user.name}
        size="sm"
        fallback={user.name}
      />

      <div className="comment-input__content">
        <textarea
          ref={textareaRef}
          className="comment-input__textarea"
          placeholder={placeholder}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus={autoFocus}
          rows={1}
          maxLength={LIMITS.COMMENT_MAX_LENGTH}
        />

        <div className="comment-input__footer">
          <div className="comment-input__info">
            <span
              className={`comment-input__char-count ${
                isOverLimit ? 'comment-input__char-count--over' : ''
              }`}
            >
              {remainingChars < 50 && `${remainingChars} characters left`}
            </span>
            <span className="comment-input__hint">Ctrl+Enter to send</span>
          </div>

          <div className="comment-input__actions">
            {onCancel && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onCancel}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!content.trim() || isOverLimit || loading}
              isLoading={loading}
            >
              Comment
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};