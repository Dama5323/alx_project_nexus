import { gql } from '@apollo/client';
import { USER_FRAGMENT } from '../fragments';

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      ...UserFields
    }
  }
  ${USER_FRAGMENT}
`;

export const FOLLOW_USER = gql`
  mutation FollowUser($userId: ID!) {
    followUser(userId: $userId) {
      id
      isFollowing
      followers
    }
  }
`;

export const UNFOLLOW_USER = gql`
  mutation UnfollowUser($userId: ID!) {
    unfollowUser(userId: $userId) {
      id
      isFollowing
      followers
    }
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        ...UserFields
      }
    }
  }
  ${USER_FRAGMENT}
`;

export const SIGNUP = gql`
  mutation Signup($input: SignupInput!) {
    signup(input: $input) {
      token
      user {
        ...UserFields
      }
    }
  }
  ${USER_FRAGMENT}
`;

export const LOGOUT = gql`
  mutation Logout {
    logout {
      success
    }
  }
`;