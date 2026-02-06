import { gql } from '@apollo/client';

export const NOTIFICATION_SUBSCRIPTION = gql`
  subscription OnNotificationCreated {
    newNotification {
      id
      type
      message
      isRead
      createdAt
    }
  }
`;