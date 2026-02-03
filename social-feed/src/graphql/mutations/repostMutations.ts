import { gql } from '@apollo/client';
import { POST_FRAGMENT } from '../fragments';

export const REPOST = gql`
  mutation Repost($postId: ID!, $comment: String) {
    repost(postId: $postId, comment: $comment) {
      id
      originalPost {
        ...PostFields
      }
      user {
        id
        name
        username
        avatar
      }
      comment
      createdAt
    }
  }
  ${POST_FRAGMENT}
`;

export const DELETE_REPOST = gql`
  mutation DeleteRepost($repostId: ID!) {
    deleteRepost(repostId: $repostId) {
      success
      message
    }
  }
`;

export const QUOTE_POST = gql`
  mutation QuotePost($postId: ID!, $content: String!, $images: [Upload]) {
    quotePost(postId: $postId, content: $content, images: $images) {
      ...PostFields
      quotedPost {
        ...PostFields
      }
    }
  }
  ${POST_FRAGMENT}
`;