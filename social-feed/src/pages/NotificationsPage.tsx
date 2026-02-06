import React, { useState } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import NotificationItem from '../components/notifications/NotificationItem';
import NotificationSettings from '../components/notifications/NotificationSettings';

const NotificationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAllNotificationsAsRead,
    loadMore,
    hasMore
  } = useNotifications(20);

  const filteredNotifications = activeTab === 'unread'
    ? notifications.filter((n: any) => !n.isRead)
    : notifications;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNotificationIcon = (type: string) => {
    const icons = {
      like: '❤️',
      comment: '💬',
      follow: '👤',
      mention: '@',
      share: '🔄',
      system: '📢'
    };
    return icons[type as keyof typeof icons] || '📢';
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading notifications. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
          </p>
        </div>
        
        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsAsRead}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'all'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => setActiveTab('all')}
        >
          All
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'unread'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => setActiveTab('unread')}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications */}
      <div className="space-y-4">
        {loading && notifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-6xl mb-4">🔔</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No {activeTab === 'unread' ? 'unread' : ''} notifications
            </h3>
            <p className="text-gray-600">
              {activeTab === 'unread' 
                ? 'You have read all your notifications'
                : "You don't have any notifications yet"}
            </p>
          </div>
        ) : (
          <>
            {filteredNotifications.map((notification: any) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                formatDate={formatDate}
                getIcon={getNotificationIcon}
                showFullContent={true}
              />
            ))}
            
            {hasMore && (
              <div className="text-center pt-6">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Load more notifications'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Notification Settings Section */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <NotificationSettings />
      </div>
    </div>
  );
};

export default NotificationsPage;