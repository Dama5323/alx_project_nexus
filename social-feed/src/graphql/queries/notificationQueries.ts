import { gql } from '@apollo/client';

export const GET_NOTIFICATIONS = gql`
  query GetNotifications($limit: Int = 20, $offset: Int = 0) {
    notifications(limit: $limit, offset: $offset) {
      id
      type
      sender {
        id
        name
        username
        avatar
      }
      recipient {
        id
        name
        username
      }
      post {
        id
        content
      }
      comment {
        id
        content
      }
      message
      isRead
      createdAt
    }
  }
`;

export const GET_UNREAD_NOTIFICATION_COUNT = gql`
  query GetUnreadNotificationCount {
    unreadNotificationCount
  }
`;

export const GET_NOTIFICATION_SETTINGS = gql`
  query GetNotificationSettings {
    notificationSettings {
      emailNotifications
      pushNotifications
      likeNotifications
      commentNotifications
      followNotifications
      mentionNotifications
    }
  }
`;