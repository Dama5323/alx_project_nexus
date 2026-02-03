import { gql } from '@apollo/client';

export const USER_FRAGMENT = gql`
  fragment UserFields on User {
    id
    name
    username
    email
    avatar
    bio
    followers
    following
    verified
    createdAt
  }
`;

export const POST_FRAGMENT = gql`
  fragment PostFields on Post {
    id
    content
    images
    video
    likes
    shares
    reposts
    views
    createdAt
    updatedAt
    isLiked
    isReposted
    isSaved
    author {
      ...UserFields
    }
  }
  ${USER_FRAGMENT}
`;

export const COMMENT_FRAGMENT = gql`
  fragment CommentFields on Comment {
    id
    postId
    content
    likes
    createdAt
    updatedAt
    isLiked
    author {
      ...UserFields
    }
  }
  ${USER_FRAGMENT}
`;

export const REACTION_FRAGMENT = gql`
  fragment ReactionFields on Reaction {
    id
    type
    createdAt
    user {
      ...UserFields
    }
  }
  ${USER_FRAGMENT}
`;