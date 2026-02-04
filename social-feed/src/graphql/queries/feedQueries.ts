// src/graphql/queries/feedQueries.ts
import { gql } from '@apollo/client';

export const GET_FEED = gql`
  query GetFeed($first: Int!) {
    feed(first: $first) {
      edges {
        node {
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
            verified
          }
          comments {
            id
            content
            author {
              name
              username
              avatar
            }
            createdAt
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;