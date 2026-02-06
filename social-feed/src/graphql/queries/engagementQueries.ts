import { gql } from '@apollo/client';

export const GET_TRENDING_POSTS = gql`
  query GetTrendingPosts($limit: Int = 10) {
    trendingPosts(limit: $limit) {
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
      views
      hashtags
      trendingScore
      createdAt
    }
  }
`;

export const GET_TRENDING_HASHTAGS = gql`
  query GetTrendingHashtags($limit: Int = 10) {
    trendingHashtags(limit: $limit) {
      id
      tag
      postCount
      trendingScore
      lastUsed
    }
  }
`;

export const GET_POST_ANALYTICS = gql`
  query GetPostAnalytics($postId: ID!, $period: AnalyticsPeriod!) {
    postAnalytics(postId: $postId, period: $period) {
      postId
      views
      likes
      comments
      shares
      engagementRate
      reach
      impressions
      period
    }
  }
`;

export const GET_USER_ANALYTICS = gql`
  query GetUserAnalytics($userId: ID!) {
    userAnalytics(userId: $userId) {
      userId
      followers
      following
      posts
      engagement
      topPosts {
        id
        content
        likes
        comments
        shares
      }
      trendingHashtags {
        id
        tag
        postCount
      }
    }
  }
`;

export const GET_BOOKMARKS = gql`
  query GetBookmarks($limit: Int = 20, $offset: Int = 0) {
    bookmarks(limit: $limit, offset: $offset) {
      id
      post {
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
        createdAt
      }
      createdAt
    }
  }
`;