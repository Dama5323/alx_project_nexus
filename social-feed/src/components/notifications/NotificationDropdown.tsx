import React from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationItem from './NotificationItem';

interface NotificationDropdownProps {
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAllNotificationsAsRead,
    loadMore,
    hasMore
  } = useNotifications(10);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return '❤️';
      case 'comment':
        return '💬';
      case 'follow':
        return '👤';
      case 'mention':
        return '@';
      case 'share':
        return '🔄';
      default:
        return '📢';
    }
  };

  if (error) {
    return (
      <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
        <div className="p-4 text-red-600">
          Error loading notifications
        </div>
      </div>
    );
  }

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[80vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg">Notifications</h3>
          {unreadCount > 0 && (
            <button
              onClick={markAllNotificationsAsRead}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Notifications list */}
      <div className="flex-1 overflow-y-auto">
        {loading && notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-2">🔔</div>
            <p>No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification: any) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                formatDate={formatDate}
                getIcon={getNotificationIcon}
              />
            ))}
          </div>
        )}

        {/* Load more */}
        {hasMore && (
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={loadMore}
              disabled={loading}
              className="w-full py-2 text-center text-blue-600 hover:text-blue-800 disabled:text-gray-400"
            >
              {loading ? 'Loading...' : 'Load more notifications'}
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <a
          href="/notifications"
          className="block text-center text-blue-600 hover:text-blue-800 font-medium"
          onClick={onClose}
        >
          View all notifications
        </a>
      </div>
    </div>
  );
};

export default NotificationDropdown;