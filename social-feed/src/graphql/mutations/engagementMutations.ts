import { gql } from '@apollo/client';

export const FOLLOW_USER = gql`
  mutation FollowUser($userId: ID!) {
    followUser(userId: $userId) {
      id
      isFollowing
      followers
      following
    }
  }
`;

export const UNFOLLOW_USER = gql`
  mutation UnfollowUser($userId: ID!) {
    unfollowUser(userId: $userId) {
      id
      isFollowing
      followers
      following
    }
  }
`;

export const BOOKMARK_POST = gql`
  mutation BookmarkPost($postId: ID!) {
    bookmarkPost(postId: $postId) {
      id
      isBookmarked
    }
  }
`;

export const REMOVE_BOOKMARK = gql`
  mutation RemoveBookmark($postId: ID!) {
    removeBookmark(postId: $postId) {
      id
      isBookmarked
    }
  }
`;

export const CREATE_POST = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      content
      author {
        id
        name
        username
        avatar
      }
      likes
      comments
      shares
      isLiked
      isBookmarked
      hashtags
      mentions
      createdAt
    }
  }
`;