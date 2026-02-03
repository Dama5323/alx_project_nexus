import { LIMITS } from '../constants/appConstants';

export const validatePostContent = (content: string): { valid: boolean; error?: string } => {
  if (!content.trim()) {
    return { valid: false, error: 'Post cannot be empty' };
  }
  
  if (content.length > LIMITS.POST_MAX_LENGTH) {
    return { valid: false, error: `Post cannot exceed ${LIMITS.POST_MAX_LENGTH} characters` };
  }
  
  return { valid: true };
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUsername = (username: string): { valid: boolean; error?: string } => {
  if (username.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters' };
  }
  
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { valid: false, error: 'Username can only contain letters, numbers, and underscores' };
  }
  
  return { valid: true };
};

export const validateFileSize = (file: File): boolean => {
  return file.size <= LIMITS.MAX_FILE_SIZE;
};

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed' };
  }
  
  if (!validateFileSize(file)) {
    return { valid: false, error: `File size must not exceed ${LIMITS.MAX_FILE_SIZE / (1024 * 1024)}MB` };
  }
  
  return { valid: true };
};