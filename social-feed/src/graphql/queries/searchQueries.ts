import { gql } from '@apollo/client';

export const SEARCH_CONTENT = gql`
  query SearchContent($query: String!, $type: String!, $limit: Int!) {
    search(query: $query, type: $type, limit: $limit) {
      users {
        id
        name
        username
        avatar
        bio
        followers
        postsCount
        isFollowing
      }
      posts {
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
        images
        createdAt
      }
      hashtags {
        name
        postCount
        trend
      }
    }
  }
`;