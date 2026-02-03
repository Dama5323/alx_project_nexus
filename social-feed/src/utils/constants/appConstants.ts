export const APP_NAME = 'Social Feed';
export const APP_VERSION = '1.0.0';

export const API_CONFIG = {
  GRAPHQL_ENDPOINT: process.env.REACT_APP_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql',
  WS_ENDPOINT: process.env.REACT_APP_WS_ENDPOINT || 'ws://localhost:4000/graphql',
};

export const PAGINATION = {
  POSTS_PER_PAGE: 10,
  COMMENTS_PER_PAGE: 5,
  INFINITE_SCROLL_THRESHOLD: 0.8,
};

export const TIMEOUTS = {
  DEBOUNCE_SEARCH: 300,
  VIEW_TRACKING: 1000, // Track view after 1 second
  TOAST_DURATION: 3000,
};

export const LIMITS = {
  POST_MAX_LENGTH: 280,
  COMMENT_MAX_LENGTH: 500,
  MAX_IMAGES: 4,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
};

export const ROUTES = {
  HOME: '/',
  PROFILE: '/profile/:username',
  POST: '/post/:postId',
  NOTIFICATIONS: '/notifications',
  SETTINGS: '/settings',
};