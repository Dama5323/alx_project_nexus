// src/graphql/mutations/repostMutations.ts - COMPLETE
import { gql } from '@apollo/client';
import { POST_FRAGMENT } from '../fragments';

export const REPOST = gql`
  mutation Repost($postId: ID!, $comment: String) {
    repost(postId: $postId, comment: $comment) {
      id
      reposts
      isReposted
    }
  }
`;

export const DELETE_REPOST = gql`
  mutation DeleteRepost($postId: ID!) {
    deleteRepost(postId: $postId) {
      success
      message
    }
  }
`;

export const QUOTE_POST = gql`
  mutation QuotePost($postId: ID!, $content: String!, $images: [String]) {
    quotePost(postId: $postId, content: $content, images: $images) {
      id
      content
      images
      createdAt
      author {
        id
        name
        username
        avatar
      }
    }
  }
`;