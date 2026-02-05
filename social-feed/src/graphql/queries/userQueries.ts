// src/graphql/queries/userQueries.ts - UPDATED
import { gql } from '@apollo/client';

export const GET_USER_PROFILE = gql`
  query GetUserProfile($username: String!) {
    user(username: $username) {
      id
      name
      username
      email
      avatar
      bio
      website
      location
      followers
      following
      postsCount
      verified
      createdAt
      isFollowing
      isBlocked
    }
  }
`;

export const GET_USER_POSTS = gql`
  query GetUserPosts($userId: ID!, $first: Int!, $after: String) {
    userPosts(userId: $userId, first: $first, after: $after) {
      edges {
        node {
          id
          content
          images
          video
          likes
          comments {
            id
            content
            author {
              id
              name
              username
              avatar
            }
            likes
            createdAt
          }
          shares
          reposts
          views
          createdAt
          isLiked
          isReposted
          isSaved
          author {
            id
            name
            username
            avatar
            verified
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;

export const GET_FOLLOW_STATUS = gql`
  query GetFollowStatus($userId: ID!) {
    followStatus(userId: $userId) {
      isFollowing
      isFollowedBy
    }
  }
`;

export const GET_USER_FOLLOWERS = gql`
  query GetUserFollowers($username: String!) {
    user(username: $username) {
      id
      username
      followersList {
        id
        name
        username
        avatar
        bio
        isFollowing
      }
    }
  }
`;

export const GET_USER_FOLLOWING = gql`
  query GetUserFollowing($username: String!) {
    user(username: $username) {
      id
      username
      followingList {
        id
        name
        username
        avatar
        bio
        isFollowing
      }
    }
  }
`;

export const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      name
      username
      email
      avatar
      bio
      website
      location
    }
  }
`;

export const FOLLOW_USER = gql`
  mutation FollowUser($userId: ID!) {
    followUser(userId: $userId) {
      id
      followers
      isFollowing
    }
  }
`;

export const UNFOLLOW_USER = gql`
  mutation UnfollowUser($userId: ID!) {
    unfollowUser(userId: $userId) {
      id
      followers
      isFollowing
    }
  }
`;