import { gql } from '@apollo/client';

export const TRACK_POST_VIEW = gql`
  mutation TrackPostView($postId: ID!, $duration: Int) {
    trackPostView(postId: $postId, duration: $duration) {
      postId
      viewCount
      uniqueViewCount
    }
  }
`;

export const TRACK_IMPRESSION = gql`
  mutation TrackImpression($postId: ID!) {
    trackImpression(postId: $postId) {
      postId
      impressionCount
    }
  }
`;