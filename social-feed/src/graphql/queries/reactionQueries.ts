import { gql } from '@apollo/client';
import { REACTION_FRAGMENT } from '../fragments';

export const GET_POST_REACTIONS = gql`
  query GetPostReactions($postId: ID!) {
    postReactions(postId: $postId) {
      type
      count
      users {
        id
        name
        username
        avatar
      }
      isUserReacted
    }
  }
`;

export const GET_REACTIONS_DETAIL = gql`
  query GetReactionsDetail($postId: ID!, $type: ReactionType, $first: Int!) {
    postReactionsDetail(postId: $postId, type: $type, first: $first) {
      edges {
        node {
          ...ReactionFields
        }
      }
      totalCount
    }
  }
  ${REACTION_FRAGMENT}
`;