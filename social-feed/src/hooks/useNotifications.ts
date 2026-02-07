import { useState, useEffect, useCallback } from 'react';

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'share' | 'system';
  message: string;
  isRead: boolean;
  timestamp: string;
  userId?: string;
  postId?: string;
  commentId?: string;
}

export const useNotifications = (limit = 10) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'like',
          message: 'John Doe liked your post',
          isRead: false,
          timestamp: new Date(Date.now() - 60000).toISOString(),
          userId: 'user123',
          postId: 'post456',
        },
        {
          id: '2',
          type: 'comment',
          message: 'Jane Smith commented on your post: "Great content!"',
          isRead: true,
          timestamp: new Date(Date.now() - 120000).toISOString(),
          userId: 'user456',
          postId: 'post456',
        },
        {
          id: '3',
          type: 'follow',
          message: 'Alex Johnson started following you',
          isRead: false,
          timestamp: new Date(Date.now() - 300000).toISOString(),
          userId: 'user789',
        },
        {
          id: '4',
          type: 'mention',
          message: 'You were mentioned in a comment by Sarah Lee',
          isRead: false,
          timestamp: new Date(Date.now() - 600000).toISOString(),
          userId: 'user101',
          postId: 'post789',
        },
        {
          id: '5',
          type: 'share',
          message: 'Michael Brown shared your post',
          isRead: true,
          timestamp: new Date(Date.now() - 900000).toISOString(),
          userId: 'user202',
          postId: 'post456',
        },
      ];
      
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.isRead).length);
      setHasMore(mockNotifications.length >= limit);
    } catch (err) {
      setError('Failed to load notifications');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  const markAllNotificationsAsRead = useCallback(async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking notifications as read:', err);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 200));
      
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    
    try {
      setLoading(true);
      
      // Simulate API call for more notifications
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock additional data
      const moreNotifications: Notification[] = [
        {
          id: '6',
          type: 'like',
          message: 'David Wilson liked your comment',
          isRead: false,
          timestamp: new Date(Date.now() - 1200000).toISOString(),
          userId: 'user303',
          commentId: 'comment123',
        },
      ];
      
      setNotifications(prev => [...prev, ...moreNotifications]);
      setHasMore(false); // For demo, we only have one more page
    } catch (err) {
      setError('Failed to load more notifications');
      console.error('Error loading more notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore]);

  // Subscription for real-time updates
  const subscribeToNotifications = useCallback(() => {
    // In a real app, you would use WebSockets or GraphQL subscriptions
    // For now, we'll poll every 30 seconds
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    fetchNotifications();
    const cleanup = subscribeToNotifications();
    return cleanup;
  }, [fetchNotifications, subscribeToNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAllNotificationsAsRead,
    markAsRead,
    loadMore,
    hasMore,
    refresh: fetchNotifications,
  };
};