import { User } from './user.types';

export interface ViewEvent {
  id: string;
  postId: string;
  userId: string;
  timestamp: string;
  duration?: number;
  source?: string;
}

export interface PostInsights {
  postId: string;
  views: number;
  uniqueViews: number;
  impressions: number;
  engagement: number;
  clickThroughRate: number;
  reachPercentage: number;
  engagementRate: number;
  viewers?: User[];
  topLocations?: string[];
  peakViewTime?: string;
}

export interface EngagementMetrics {
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  totalEngagement: number;
  engagementRate: number;
}