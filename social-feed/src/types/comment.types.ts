import { User } from './user.types';

export interface Comment {
  id: string;
  postId: string;
  author: User;
  content: string;
  likes: number;
  replies?: Comment[];
  createdAt: string;
  updatedAt?: string;
  isLiked?: boolean;
}

export interface CreateCommentInput {
  postId: string;
  content: string;
  parentId?: string;
}