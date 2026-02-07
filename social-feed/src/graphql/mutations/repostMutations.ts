import { gql } from '@apollo/client';
import { POST_FRAGMENT } from '../../graphql/fragments'; 

export const REPOST_POST = gql`
  mutation RepostPost($postId: ID!) {
    repostPost(postId: $postId) {
      success
      message
      repost {
        id
        post {
          ...PostFields  # Using POST_FRAGMENT here
        }
        user {
          id
          username
          avatar
        }
        createdAt
      }
    }
  }
  ${POST_FRAGMENT}  # This is where you use the imported fragment
`;

export const REPOST = REPOST_POST;

export const UNDO_REPOST = gql`
  mutation UndoRepost($postId: ID!) {
    undoRepost(postId: $postId) {
      success
      message
    }
  }
`;

export const GET_REPOSTS = gql`
  query GetReposts($postId: ID!) {
    reposts(postId: $postId) {
      id
      user {
        id
        username
        avatar
        name
      }
      createdAt
    }
  }
`;