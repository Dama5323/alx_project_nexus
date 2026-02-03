export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'repost' | 'follow' | 'mention';
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

class NotificationService {
  private listeners: Set<(notification: Notification) => void> = new Set();

  subscribe(callback: (notification: Notification) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
    const fullNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };

    this.listeners.forEach((listener) => listener(fullNotification));

    // Show browser notification if permitted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Social Feed', {
        body: notification.message,
        icon: '/logo192.png',
      });
    }
  }

  async requestPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }
}

export const notificationService = new NotificationService();