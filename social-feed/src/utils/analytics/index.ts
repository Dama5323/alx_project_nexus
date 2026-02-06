// src/utils/analytics/index.ts
export const calculateEngagementRate = (
  likes: number,
  comments: number,
  shares: number,
  reach: number
): number => {
  if (reach === 0) return 0;
  return ((likes + comments + shares) / reach) * 100;
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const getTrendingScore = (
  likes: number,
  comments: number,
  shares: number,
  views: number,
  recencyHours: number
): number => {
  const engagementScore = (likes * 1) + (comments * 2) + (shares * 3);
  const recencyFactor = Math.max(0, 1 - (recencyHours / 48));
  return engagementScore * recencyFactor;
};