import { gql } from '@apollo/client';
import { POST_FRAGMENT, COMMENT_FRAGMENT } from '../fragments';

export const GET_FEED = gql`
  query GetFeed($first: Int!, $after: String, $filter: FeedFilter) {
    feed(first: $first, after: $after, filter: $filter) {
      edges {
        cursor
        node {
          ...PostFields
          comments {
            ...CommentFields
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
  ${POST_FRAGMENT}
  ${COMMENT_FRAGMENT}
`;

export const GET_TRENDING_POSTS = gql`
  query GetTrendingPosts($first: Int!, $timeRange: TimeRange) {
    trendingPosts(first: $first, timeRange: $timeRange) {
      edges {
        node {
          ...PostFields
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  ${POST_FRAGMENT}
`;