import { Post } from './post.types';
import { User } from './user.types';

export interface ShareOptions {
  platform?: 'twitter' | 'facebook' | 'linkedin' | 'whatsapp' | 'copy';
  message?: string;
  url?: string;
}

export interface Repost {
  id: string;
  originalPost: Post;
  user: User;
  comment?: string;
  createdAt: string;
}

export interface ShareAnalytics {
  postId: string;
  totalShares: number;
  platforms: Record<string, number>;
  topSharers: User[];
}