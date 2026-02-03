import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns';

export const formatPostDate = (date: string | Date): string => {
  const postDate = new Date(date);
  
  if (isToday(postDate)) {
    return formatDistanceToNow(postDate, { addSuffix: true });
  }
  
  if (isYesterday(postDate)) {
    return 'Yesterday';
  }
  
  // If within last 7 days, show day name
  const daysDiff = Math.floor((Date.now() - postDate.getTime()) / (1000 * 60 * 60 * 24));
  if (daysDiff < 7) {
    return format(postDate, 'EEEE'); // Monday, Tuesday, etc.
  }
  
  // Otherwise show full date
  return format(postDate, 'MMM d, yyyy');
};

export const formatFullDate = (date: string | Date): string => {
  return format(new Date(date), 'MMMM d, yyyy · h:mm a');
};

export const formatRelativeTime = (date: string | Date): string => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};