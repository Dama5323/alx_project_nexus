import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Comment } from './Comment';
import { CommentInput } from './CommentInput';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Button } from '../common/Button';
import { GET_POST } from '../../graphql/queries/postQueries';
import { LIKE_COMMENT, DELETE_COMMENT } from '../../graphql/mutations/commentMutations';
import { useAuth } from '../../hooks/useAuth';
import './CommentList.css';

export interface CommentListProps {
  postId: string;
  initialCount?: number;
}

export const CommentList: React.FC<CommentListProps> = ({ postId, initialCount = 0 }) => {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');
  const { user } = useAuth();

  const { data, loading, error, refetch } = useQuery(GET_POST, {
    variables: { postId },
  });

  const [likeComment] = useMutation(LIKE_COMMENT);
  const [deleteComment] = useMutation(DELETE_COMMENT);

  const handleLike = async (commentId: string) => {
    try {
      await likeComment({
        variables: { commentId },
        refetchQueries: [{ query: GET_POST, variables: { postId } }],
      });
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleReply = (commentId: string) => {
    setReplyingTo(commentId);
  };

  const handleDelete = async (commentId: string) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await deleteComment({
        variables: { commentId },
        refetchQueries: [{ query: GET_POST, variables: { postId } }],
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleCommentSuccess = () => {
    setReplyingTo(null);
    refetch();
  };

  if (loading) {
    return (
      <div className="comment-list__loading">
        <LoadingSpinner size="md" text="Loading comments..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="comment-list__error">
        <p>Failed to load comments</p>
        <Button variant="primary" size="sm" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  const comments = data?.post?.comments || [];
  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === 'popular') {
      return b.likes - a.likes;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="comment-list">
      <div className="comment-list__header">
        <h3 className="comment-list__title">
          Comments ({comments.length})
        </h3>
        <div className="comment-list__sort">
          <button
            className={`comment-list__sort-btn ${
              sortBy === 'recent' ? 'comment-list__sort-btn--active' : ''
            }`}
            onClick={() => setSortBy('recent')}
          >
            Recent
          </button>
          <button
            className={`comment-list__sort-btn ${
              sortBy === 'popular' ? 'comment-list__sort-btn--active' : ''
            }`}
            onClick={() => setSortBy('popular')}
          >
            Popular
          </button>
        </div>
      </div>

      <CommentInput postId={postId} onSuccess={handleCommentSuccess} />

      {sortedComments.length === 0 ? (
        <div className="comment-list__empty">
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="comment-list__comments">
          {sortedComments.map((comment) => (
            <div key={comment.id} className="comment-list__item">
              <Comment
                comment={comment}
                onLike={handleLike}
                onReply={handleReply}
                onDelete={handleDelete}
                isOwner={user?.id === comment.author.id}
              />
              {replyingTo === comment.id && (
                <div className="comment-list__reply-input">
                  <CommentInput
                    postId={postId}
                    parentId={comment.id}
                    placeholder={`Reply to ${comment.author.name}...`}
                    onSuccess={handleCommentSuccess}
                    onCancel={() => setReplyingTo(null)}
                    autoFocus
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};