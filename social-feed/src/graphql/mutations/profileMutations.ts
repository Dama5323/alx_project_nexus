// src/graphql/mutations/profileMutations.ts
import { gql } from '@apollo/client';

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
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

export const FOLLOW_USER = gql`
  mutation FollowUser($userId: ID!) {
    followUser(userId: $userId) {
      id
      name
      username
      followers
      following
      isFollowing
    }
  }
`;

export const UNFOLLOW_USER = gql`
  mutation UnfollowUser($userId: ID!) {
    unfollowUser(userId: $userId) {
      id
      name
      username
      followers
      following
      isFollowing
    }
  }
`;

export const GET_USER_BY_USERNAME = gql`
  query GetUserByUsername($username: String!) {
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

// Add this if you need it
export const GET_USER_PROFILE = gql`
  query GetUserProfile($userId: ID!) {
    user(id: $userId) {
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