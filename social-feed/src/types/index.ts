// src/types/index.ts

// User Types
export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  bio?: string;
  followers: number;
  following: number;
  isFollowing?: boolean;
  isVerified?: boolean;
  verified?: boolean; 
  createdAt: string;
}

// Post Types
export interface Post {
  id: string;
  content: string;
  author: User;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  isLiked: boolean;
  isBookmarked: boolean;
  isSaved?: boolean;
  isReposted?: boolean;
  reposts?: number;
  images?: string[];
  video?: string;
  media?: Media[];
  hashtags: string[];
  mentions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Media {
  id: string;
  url: string;
  type: 'image' | 'video' | 'gif';
  alt?: string;
}

// Comment Types
export interface Comment {
  id: string;
  content: string;
  author: User;
  post: Post;
  likes: number;
  replies: Comment[];
  mentions: string[];
  createdAt: string;
  isLiked?: boolean;
}

// Reaction Types
export enum ReactionType {
  LIKE = 'LIKE',
  LOVE = 'LOVE',
  HAHA = 'HAHA',
  WOW = 'WOW',
  SAD = 'SAD',
  ANGRY = 'ANGRY'
}

export interface Reaction {
  id: string;
  type: ReactionType;
  user: User;
  postId: string;
  commentId?: string;
  createdAt: string;
}

export interface ReactionSummary {
  type: ReactionType;
  count: number;
  users: User[];
  isUserReacted?: boolean;
}

// Analytics Types
export interface PostAnalytics {
  postId: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number;
  reach: number;
  impressions: number;
  period: 'day' | 'week' | 'month' | 'year';
  topLocations?: string[];
}

export interface PostInsights {
  postId: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  reach: number;
  impressions: number;
  engagementRate: number;
  topLocations: string[];
  uniqueViews?: number;
  clickThroughRate?: number;
  reachPercentage?: number;
  peakViewTime?: string;
  demographics?: {
    age: Record<string, number>;
    gender: Record<string, number>;
    location: Record<string, number>;
  };
}

export interface UserAnalytics {
  userId: string;
  followers: number;
  following: number;
  posts: number;
  engagement: number;
  topPosts: Post[];
  trendingHashtags: Hashtag[];
}

// Hashtag Types
export interface Hashtag {
  id: string;
  tag: string;
  postCount: number;
  trendingScore: number;
  lastUsed: string;
}

// Share Types
export interface ShareOptions {
  url?: string;
  title?: string;
  text?: string;
  message?: string;
  platform?: 'twitter' | 'facebook' | 'linkedin' | 'whatsapp' | 'telegram' | 'copy';
}

// Input Types for Mutations
export interface CreatePostInput {
  content: string;
  media?: string[];
  hashtags?: string[];
  mentions?: string[];
}

export interface UpdatePostInput {
  id: string;
  content?: string;
  media?: string[];
  hashtags?: string[];
  mentions?: string[];
}

export interface CreateCommentInput {
  postId: string;
  content: string;
  parentId?: string;
  mentions?: string[];
}

export interface UpdateCommentInput {
  id: string;
  content: string;
}

// Notification Types (add if not exists)
export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'share' | 'system';
  sender?: User;
  recipient: User;
  post?: Post;
  comment?: Comment;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// Trending Types
export interface TrendingItem {
  id: string;
  type: 'post' | 'hashtag' | 'user';
  item: Post | Hashtag | User;
  score: number;
  change: 'up' | 'down' | 'new';
}

// Input Types for Engagement
export interface FollowInput {
  userId: string;
}

export interface BookmarkInput {
  postId: string;
}

export interface AnalyticsInput {
  postId?: string;
  userId?: string;
  period: string;
}

export interface NotificationSettingsInput {
  emailNotifications: boolean;
  pushNotifications: boolean;
  likeNotifications: boolean;
  commentNotifications: boolean;
  followNotifications: boolean;
  mentionNotifications: boolean;
}