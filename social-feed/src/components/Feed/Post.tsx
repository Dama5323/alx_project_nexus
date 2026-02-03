import React from 'react';
import { Post as PostType } from '../../types';
import { PostHeader } from '../Post/PostHeader';
import { PostContent } from '../Post/PostContent';
import { PostStats } from '../Post/PostStats';
import { PostActions } from '../Post/PostActions';
import { PostAnalytics } from '../Post/PostAnalytics';
import { PostReactions } from '../Post/PostReactions';
import { usePostInteractions } from '../../hooks/usePostInteractions';
import { useViewTracking } from '../../hooks/useViewTracking';
import { useAuth } from '../../hooks/useAuth';
import './Post.css';

export interface PostProps {
  post: PostType;
  onComment?: (postId: string) => void;
  onRepost?: (postId: string) => void;
  onShare?: (postId: string) => void;
}

export const Post: React.FC<PostProps> = ({ post, onComment, onRepost, onShare }) => {
  const { user } = useAuth();
  const { toggleLike, toggleSave } = usePostInteractions();
  const isOwner = user?.id === post.author.id;

  // Track view when post is visible
  useViewTracking(post.id, true);

  const handleLike = () => {
    toggleLike(post.id, post.isLiked || false);
  };

  const handleComment = () => {
    onComment?.(post.id);
  };

  const handleRepost = () => {
    onRepost?.(post.id);
  };

  const handleShare = () => {
    onShare?.(post.id);
  };

  const handleSave = () => {
    toggleSave(post.id, post.isSaved || false);
  };

  return (
    <article className="post">
      <PostHeader
        author={post.author}
        createdAt={post.createdAt}
        isOwner={isOwner}
      />

      <PostContent
        content={post.content}
        images={post.images}
        video={post.video}
      />

      <PostReactions postId={post.id} />

      <PostStats
        likes={post.likes}
        comments={post.comments.length}
        reposts={post.reposts}
        views={post.views}
      />

      <PostActions
        postId={post.id}
        likes={post.likes}
        comments={post.comments.length}
        reposts={post.reposts}
        shares={post.shares}
        isLiked={post.isLiked}
        isReposted={post.isReposted}
        isSaved={post.isSaved}
        onLike={handleLike}
        onComment={handleComment}
        onRepost={handleRepost}
        onShare={handleShare}
        onSave={handleSave}
      />

      {isOwner && <PostAnalytics postId={post.id} isOwner={isOwner} />}
    </article>
  );
};