import { gql } from '@apollo/client';

export const GET_TRENDING_HASHTAGS = gql`
  query GetTrendingHashtags($limit: Int!) {
    trendingHashtags(limit: $limit)
  }
`;

export const GET_HASHTAG_POSTS = gql`
  query GetHashtagPosts($hashtag: String!, $sortBy: String!) {
    hashtagPosts(hashtag: $hashtag, sortBy: $sortBy) {
      id
      content
      author {
        id
        name
        username
        avatar
      }
      likes
      comments
      shares
      images
      createdAt
    }
    hashtagStats(hashtag: $hashtag) {
      postCount
      trendScore
      growth
    }
  }
`;

export interface HashtagPost {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  likes: number;
  comments: number;
  shares: number;
  images: string[];
  createdAt: string;
}

export interface HashtagStats {
  postCount: number;
  trendScore: number;
  growth: number;
}

export interface HashtagPostsResponse {
  hashtagPosts: HashtagPost[];
  hashtagStats: HashtagStats;
}