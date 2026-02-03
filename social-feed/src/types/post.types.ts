import { User } from './user.types';
import { Comment } from './comment.types';
import { Reaction } from './reaction.types';

export interface Post {
  id: string;
  author: User;
  content: string;
  images?: string[];
  video?: string;
  likes: number;
  comments: Comment[];
  shares: number;
  reposts: number;
  views: number;
  createdAt: string;
  updatedAt?: string;
  isLiked?: boolean;
  isReposted?: boolean;
  isSaved?: boolean;
  reactions?: Reaction[];
  analytics?: PostAnalytics;
}

export interface PostAnalytics {
  views: number;
  uniqueViews: number;
  impressions: number;
  engagementRate: number;
  clickThroughRate: number;
}

export interface CreatePostInput {
  content: string;
  images?: File[];
  video?: File;
}

export interface UpdatePostInput {
  id: string;
  content?: string;
}