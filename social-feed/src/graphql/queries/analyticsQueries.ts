import { gql } from '@apollo/client';
import { USER_FRAGMENT } from '../fragments';


export const GET_USER_ANALYTICS = gql`
  query GetUserAnalytics($userId: ID!, $timeRange: String!) {
    userAnalytics(userId: $userId, timeRange: $timeRange) {
      totalPosts
      totalLikes
      totalComments
      totalShares
      totalViews
      followerGrowth
      engagementRate
      topPosts {
        id
        content
        likes
        comments
        views
      }
      peakTimes
    }
  }
`;

export const GET_POST_ANALYTICS = gql`
  query GetPostAnalytics($postId: ID!) {
    postAnalytics(postId: $postId) {
      postId
      views
      uniqueViews
      impressions
      engagement
      clickThroughRate
      reachPercentage
      viewers {
        ...UserFields
      }
      topLocations
      peakViewTime
    }
  }
  ${USER_FRAGMENT}
`;

export const GET_POST_INSIGHTS = gql`
  query GetPostInsights($postId: ID!) {
    postInsights(postId: $postId) {
      views
      likes
      comments
      shares
      saves
      engagementRate
      reachPercentage
    }
  }
`;

export const GET_VIEWERS_LIST = gql`
  query GetViewersList($postId: ID!, $first: Int!, $after: String) {
    postViewers(postId: $postId, first: $first, after: $after) {
      edges {
        node {
          user {
            ...UserFields
          }
          viewedAt
          duration
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
  ${USER_FRAGMENT}
`;