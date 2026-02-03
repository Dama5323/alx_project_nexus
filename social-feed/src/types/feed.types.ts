import { Post } from './post.types';
import { User } from './user.types';

export interface FeedPost extends Post {
  isRepost?: boolean;
  repostUser?: User;
  repostComment?: string;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
}

export interface PostEdge {
  cursor: string;
  node: Post;
}

export interface PostConnection {
  edges: PostEdge[];
  pageInfo: PageInfo;
  totalCount: number;
}

export interface FeedFilters {
  following?: boolean;
  trending?: boolean;
  saved?: boolean;
  userId?: string;
}