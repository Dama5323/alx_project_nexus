import { gql } from '@apollo/client';
import { USER_FRAGMENT, POST_FRAGMENT } from '../fragments';

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
      ...UserFields
    }
  }
  ${USER_FRAGMENT}
`;

export const GET_USER_PROFILE = gql`
  query GetUserProfile($username: String!) {
    user(username: $username) {
      ...UserFields
      postsCount
      isFollowing
      isFollowedBy
    }
  }
  ${USER_FRAGMENT}
`;

export const SEARCH_USERS = gql`
  query SearchUsers($query: String!, $first: Int!) {
    searchUsers(query: $query, first: $first) {
      edges {
        node {
          ...UserFields
        }
      }
    }
  }
  ${USER_FRAGMENT}
`;

// 🆕 ADD THIS QUERY
export const GET_USER_POSTS = gql`
  query GetUserPosts($userId: ID!, $first: Int!, $after: String) {
    userPosts(userId: $userId, first: $first, after: $after) {
      edges {
        cursor
        node {
          ...PostFields
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
`;