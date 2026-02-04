import { gql } from '@apollo/client';
import { POST_FRAGMENT } from '../fragments';


export const CREATE_POST = gql`
  mutation CreatePost($content: String!, $images: [String!]) {
    createPost(content: $content, images: $images) {
      id
      content
      images
      likes
      shares
      createdAt
      isLiked
      isSaved
      author {
        id
        name
        username
        avatar
      }
    }
  }
`;

export const UPDATE_POST = gql`
  mutation UpdatePost($input: UpdatePostInput!) {
    updatePost(input: $input) {
      ...PostFields
    }
  }
  ${POST_FRAGMENT}
`;

export const DELETE_POST = gql`
  mutation DeletePost($postId: ID!) {
    deletePost(postId: $postId) {
      success
      message
    }
  }
`;

export const LIKE_POST = gql`
  mutation LikePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes
      isLiked
    }
  }
`;

export const UNLIKE_POST = gql`
  mutation UnlikePost($postId: ID!) {
    unlikePost(postId: $postId) {
      id
      likes
      isLiked
    }
  }
`;

export const SAVE_POST = gql`
  mutation SavePost($postId: ID!) {
    savePost(postId: $postId) {
      id
      isSaved
    }
  }
`;

export const UNSAVE_POST = gql`
  mutation UnsavePost($postId: ID!) {
    unsavePost(postId: $postId) {
      id
      isSaved
    }
  }
`;