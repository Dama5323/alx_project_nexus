// src/components/notifications/NotificationItem.tsx
import React from 'react';

interface NotificationItemProps {
  notification: any;
  formatDate: (date: string) => string;
  getIcon: (type: string) => string;
  showFullContent?: boolean;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  formatDate,
  getIcon,
  showFullContent = false
}) => {
  return (
    <div className={`p-4 ${!notification.isRead ? 'notification-unread' : ''}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3 text-xl">
          {getIcon(notification.type)}
        </div>
        <div className="flex-1">
          <p className="text-gray-900">{notification.message}</p>
          <p className="text-sm text-gray-500 mt-1">
            {formatDate(notification.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;