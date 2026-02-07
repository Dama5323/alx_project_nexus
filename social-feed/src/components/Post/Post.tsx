import React from 'react';
import { PostHeader } from './PostHeader';
import { PostContent } from './PostContent';
import { PostStats } from './PostStats';
import { PostActions } from './PostActions';
import { PostAnalytics } from './PostAnalytics';

export interface PostProps {
  post: {
    id: string;
    author: {
      id: string;
      name: string;
      username: string;
      avatar: string;
      email?: string;
      followers?: number;
      following?: number;
      createdAt?: string;
      verified?: boolean;
    };
    content: string;
    likes: number;
    comments: any[];
    shares: number;
    reposts: number;
    views: number;
    isLiked: boolean;
    isReposted: boolean;
    isSaved: boolean;
    images?: string[];
    video?: string;
    timestamp?: string;
  };
  onLike?: () => void;
  onComment?: () => void;
  onRepost?: () => void;
  onShare?: () => void;
  onSave?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onReport?: () => void;
}

const Post: React.FC<PostProps> = ({ 
  post, 
  onLike = () => {}, 
  onComment = () => {}, 
  onRepost = () => {}, 
  onShare = () => {}, 
  onSave = () => {},
  onEdit = () => {},
  onDelete = () => {},
  onReport = () => {}
}) => {
  // Create full author object for PostHeader
  const author = {
    id: post.author.id,
    name: post.author.name,
    username: post.author.username,
    avatar: post.author.avatar,
    email: post.author.email || '',
    followers: post.author.followers || 0,
    following: post.author.following || 0,
    createdAt: post.author.createdAt || new Date().toISOString(),
    verified: post.author.verified || false,
  };

  // Determine if current user is the post owner
  const isOwner = false; // You'll need to get this from your auth context
  
  // Use timestamp if available, otherwise use current date
  const createdAt = post.timestamp || new Date().toISOString();

  return (
    <div className="post-container bg-white dark:bg-gray-800 rounded-xl shadow p-4 mb-4">
      <div className="post-header mb-3">
        <PostHeader 
          author={author}
          createdAt={createdAt}
          isOwner={isOwner}
          onEdit={onEdit}
          onDelete={onDelete}
          onReport={onReport}
        />
      </div>
      
      <div className="post-content mb-3">
        <PostContent 
          content={post.content}
          images={post.images}
          video={post.video}
        />
      </div>
      
      <div className="post-stats mb-3">
        <PostStats 
          likes={post.likes}
          comments={post.comments?.length || 0}
          reposts={post.reposts}
          views={post.views}
          // Remove shares if PostStats doesn't support it
        />
      </div>
      
      <div className="post-actions mb-3">
        <PostActions
          postId={post.id}
          likes={post.likes}
          comments={post.comments?.length || 0}
          reposts={post.reposts}
          shares={post.shares}
          isLiked={post.isLiked}
          isReposted={post.isReposted}
          isSaved={post.isSaved}
          onLike={onLike}
          onComment={onComment}
          onRepost={onRepost}
          onShare={onShare}
          onSave={onSave}
        />
      </div>
      
      {/* Analytics for post owner */}
      {isOwner && (
        <div className="post-analytics mt-3">
          <PostAnalytics 
            postId={post.id}
            isOwner={true}
          />
        </div>
      )}
    </div>
  );
};

export default Post;