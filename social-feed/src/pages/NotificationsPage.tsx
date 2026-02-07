import React, { useState } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import NotificationSettings from '../components/notifications/NotificationSettings';
import './NotificationsPage.css';

// Define the notification type
interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'share' | 'system';
  message: string;
  userId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  postId: string | null;
  isRead: boolean;
  createdAt: string;
}

const NotificationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  
  // Use the hook for real notifications
  const {
    notifications: realNotifications,
    unreadCount: realUnreadCount,
    loading,
    error,
    markAllNotificationsAsRead,
    loadMore,
    hasMore
  } = useNotifications(20);

  // Mock data for testing (fallback)
  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'like',
      message: 'John Doe liked your post',
      userId: 'user1',
      senderId: 'user2',
      senderName: 'John Doe',
      senderAvatar: 'https://i.pravatar.cc/150?img=1',
      postId: 'post1',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    },
    {
      id: '2',
      type: 'comment',
      message: 'Jane Smith commented on your post: "Great content!"',
      userId: 'user1',
      senderId: 'user3',
      senderName: 'Jane Smith',
      senderAvatar: 'https://i.pravatar.cc/150?img=2',
      postId: 'post2',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    },
    {
      id: '3',
      type: 'follow',
      message: 'Alex Johnson started following you',
      userId: 'user1',
      senderId: 'user4',
      senderName: 'Alex Johnson',
      senderAvatar: 'https://i.pravatar.cc/150?img=3',
      postId: null,
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    },
    {
      id: '4',
      type: 'mention',
      message: 'You were mentioned in a comment by Sarah Lee',
      userId: 'user1',
      senderId: 'user5',
      senderName: 'Sarah Lee',
      senderAvatar: 'https://i.pravatar.cc/150?img=4',
      postId: 'post3',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    },
    {
      id: '5',
      type: 'share',
      message: 'Michael Brown shared your post',
      userId: 'user1',
      senderId: 'user6',
      senderName: 'Michael Brown',
      senderAvatar: 'https://i.pravatar.cc/150?img=5',
      postId: 'post4',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    },
  ];

  // Use real notifications if available, otherwise use mock data
  const displayNotifications: Notification[] = realNotifications && realNotifications.length > 0 
    ? realNotifications as unknown as Notification[] // Type assertion if needed
    : mockNotifications;

  const displayUnreadCount = realUnreadCount > 0 ? realUnreadCount : 
    displayNotifications.filter((n: Notification) => !n.isRead).length;

  // Filter notifications based on active tab
  const filteredNotifications: Notification[] = activeTab === 'unread'
    ? displayNotifications.filter((n: Notification) => !n.isRead)
    : displayNotifications;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, string> = {
      like: '❤️',
      comment: '💬',
      follow: '👤',
      mention: '@',
      share: '🔄',
      system: '📢'
    };
    return icons[type] || '📢';
  };

  const getNotificationColor = (type: string) => {
    const colors: Record<string, string> = {
      like: '#ff6b6b',
      comment: '#4ecdc4',
      follow: '#45b7d1',
      mention: '#96ceb4',
      share: '#feca57',
      system: '#ff9ff3'
    };
    return colors[type] || '#667eea';
  };

  const handleMarkAsRead = (notificationId: string) => {
    // In a real app, you would call an API to mark as read
    console.log('Marking notification as read:', notificationId);
  };

  const handleViewPost = (postId: string | null) => {
    if (postId) {
      // Navigate to post
      console.log('Navigating to post:', postId);
      // In a real app: navigate(`/post/${postId}`);
    }
  };

  if (error) {
    return (
      <div className="notifications-container">
        <div className="notifications-content">
          <div className="error-card">
            <h2>⚠️ Error loading notifications</h2>
            <p>Failed to load notifications. Please try again later.</p>
            <button 
              className="retry-btn"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-container">
      <div className="notifications-content">
        {/* Header */}
        <div className="notifications-header">
          <div className="header-title">
            <h1>
              <span className="header-icon">🔔</span>
              Notifications
            </h1>
            <p className="header-subtitle">
              {displayUnreadCount > 0 ? `${displayUnreadCount} unread notifications` : 'All caught up!'}
            </p>
          </div>
          
          {displayUnreadCount > 0 && (
            <button
              onClick={markAllNotificationsAsRead}
              className="mark-all-btn"
            >
              <span className="btn-icon">✓</span>
              Mark all as read
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="notifications-tabs">
          <button
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All
            <span className="tab-count">{displayNotifications.length}</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'unread' ? 'active' : ''}`}
            onClick={() => setActiveTab('unread')}
          >
            Unread
            <span className="tab-count">{displayUnreadCount}</span>
          </button>
        </div>

        {/* Notifications List */}
        <div className="notifications-list">
          {loading && filteredNotifications.length === 0 ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎉</div>
              <h3>All caught up!</h3>
              <p>No {activeTab === 'unread' ? 'unread ' : ''}notifications to show.</p>
            </div>
          ) : (
            <>
              {filteredNotifications.map((notification: Notification) => (
                <div 
                  key={notification.id} 
                  className={`notification-card ${notification.isRead ? 'read' : 'unread'}`}
                >
                  <div 
                    className="notification-icon"
                    style={{ 
                      backgroundColor: getNotificationColor(notification.type) + '20',
                      color: getNotificationColor(notification.type)
                    }}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="notification-content">
                    <div className="notification-message">
                      <strong className="sender-name">{notification.senderName}</strong>
                      {' '}
                      {notification.message}
                    </div>
                    <div className="notification-time">
                      {formatDate(notification.createdAt)}
                    </div>
                    
                    {/* Action buttons for unread notifications */}
                    {!notification.isRead && notification.postId && (
                      <div className="notification-actions">
                        <button 
                          className="action-btn view-btn"
                          onClick={() => handleViewPost(notification.postId)}
                        >
                          View Post
                        </button>
                        <button 
                          className="action-btn mark-read-btn"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          Mark as read
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Unread indicator */}
                  {!notification.isRead && (
                    <div className="unread-indicator"></div>
                  )}
                </div>
              ))}
              
              {/* Load More Button */}
              {hasMore && (
                <div className="load-more-section">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="load-more-btn"
                  >
                    {loading ? (
                      <>
                        <span className="loading-dots"></span>
                        Loading...
                      </>
                    ) : (
                      'Load more notifications'
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Notification Settings Section */}
        <div className="settings-section">
          <div className="section-header">
            <h2>
              <span className="header-icon">⚙️</span>
              Notification Settings
            </h2>
            <p className="section-subtitle">Customize how you receive notifications</p>
          </div>
          
          <NotificationSettings />
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;