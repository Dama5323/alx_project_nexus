import { gql } from '@apollo/client';

export const ADD_REACTION = gql`
  mutation AddReaction($postId: ID!, $type: ReactionType!) {
    addReaction(postId: $postId, type: $type) {
      id
      type
      user {
        id
        name
        username
        avatar
      }
      createdAt
    }
  }
`;

export const REMOVE_REACTION = gql`
  mutation RemoveReaction($postId: ID!) {
    removeReaction(postId: $postId) {
      success
      postId
    }
  }
`;

export const UPDATE_REACTION = gql`
  mutation UpdateReaction($postId: ID!, $type: ReactionType!) {
    updateReaction(postId: $postId, type: $type) {
      id
      type
      createdAt
    }
  }
`;