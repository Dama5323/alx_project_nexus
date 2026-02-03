import { gql } from '@apollo/client';
import { POST_FRAGMENT, COMMENT_FRAGMENT, REACTION_FRAGMENT } from '../fragments';

export const GET_POST = gql`
  query GetPost($postId: ID!) {
    post(id: $postId) {
      ...PostFields
      comments {
        ...CommentFields
        replies {
          ...CommentFields
        }
      }
      reactions {
        ...ReactionFields
      }
      analytics {
        views
        uniqueViews
        impressions
        engagementRate
      }
    }
  }
  ${POST_FRAGMENT}
  ${COMMENT_FRAGMENT}
  ${REACTION_FRAGMENT}
`;

export const GET_USER_POSTS = gql`
  query GetUserPosts($userId: ID!, $first: Int!, $after: String) {
    userPosts(userId: $userId, first: $first, after: $after) {
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

export const GET_SAVED_POSTS = gql`
  query GetSavedPosts($first: Int!, $after: String) {
    savedPosts(first: $first, after: $after) {
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