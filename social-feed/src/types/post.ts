// src/types/post.ts
export interface PostType {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
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
}

export interface SimplePost {
  id: string;
  userAvatar: string;
  username: string;
  handle: string;
  time: string;
  content: string;
  media?: string;
  comments: number;
  retweets: number;
  likes: number;
  video?: string;
  images?: string[];
}