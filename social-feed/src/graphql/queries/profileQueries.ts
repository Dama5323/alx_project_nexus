import { gql } from '@apollo/client';

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

export const GET_USER_POSTS = gql`
  query GetUserPosts($userId: ID!, $type: String!) {
    userPosts(userId: $userId, type: $type) {
      id
      content
      images
      video
      likes
      comments
      shares
      views
      isLiked
      isSaved
      createdAt
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

export const FOLLOW_USER = gql`
  mutation FollowUser($userId: ID!) {
    followUser(userId: $userId) {
      id
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
      followers
      following
      isFollowing
    }
  }
`;