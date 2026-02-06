import { gql } from '@apollo/client';

export const MARK_NOTIFICATION_READ = gql`
  mutation MarkNotificationRead($notificationId: ID!) {
    markNotificationRead(notificationId: $notificationId) {
      id
      isRead
    }
  }
`;

export const MARK_ALL_NOTIFICATIONS_READ = gql`
  mutation MarkAllNotificationsRead {
    markAllNotificationsRead {
      success
      count
    }
  }
`;

export const DELETE_NOTIFICATION = gql`
  mutation DeleteNotification($notificationId: ID!) {
    deleteNotification(notificationId: $notificationId) {
      success
    }
  }
`;

export const UPDATE_NOTIFICATION_SETTINGS = gql`
  mutation UpdateNotificationSettings($input: NotificationSettingsInput!) {
    updateNotificationSettings(input: $input) {
      emailNotifications
      pushNotifications
      likeNotifications
      commentNotifications
      followNotifications
      mentionNotifications
    }
  }
`;