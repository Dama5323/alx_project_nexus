import { gql } from '@apollo/client';

export const SHARE_POST = gql`
  mutation SharePost($postId: ID!, $platform: String, $message: String) {
    sharePost(postId: $postId, platform: $platform, message: $message) {
      success
      postId
      shareUrl
    }
  }
`;

export const TRACK_SHARE = gql`
  mutation TrackShare($postId: ID!, $platform: String!) {
    trackShare(postId: $postId, platform: $platform) {
      postId
      totalShares
      platformShares
    }
  }
`;