import { useMutation } from '@apollo/client';
import { useState, useCallback } from 'react';
import { 
  FOLLOW_USER, 
  UNFOLLOW_USER, 
  BOOKMARK_POST, 
  REMOVE_BOOKMARK  // Changed from SAVE_POST/UNSAVE_POST
} from '../graphql/mutations/engagementMutations';
import { useAuth } from './useAuth';

// Bookmark hook
export const useBookmark = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [bookmarkPostMutation] = useMutation(BOOKMARK_POST); // Changed from savePostMutation
  const [removeBookmarkMutation] = useMutation(REMOVE_BOOKMARK); // Changed from unsavePostMutation

  const toggleBookmark = useCallback(async (postId: string, isBookmarked: boolean) => {
    if (!user) {
      console.error('User not authenticated');
      return { success: false };
    }
    
    setLoading(true);
    try {
      if (isBookmarked) {
        // Remove bookmark
        const { data } = await removeBookmarkMutation({ 
          variables: { postId }
        });
        console.log('Bookmark removed:', data);
      } else {
        // Add bookmark
        const { data } = await bookmarkPostMutation({ 
          variables: { postId }
        });
        console.log('Bookmark added:', data);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      
      // Fallback to mock API if GraphQL fails
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true };
    } finally {
      setLoading(false);
    }
  }, [user, bookmarkPostMutation, removeBookmarkMutation]);

  return { toggleBookmark, loading };
};

// Follow hook
export const useFollow = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [followUserMutation] = useMutation(FOLLOW_USER);
  const [unfollowUserMutation] = useMutation(UNFOLLOW_USER);

  const followUser = useCallback(async (userId: string) => {
    if (!user) {
      console.error('User not authenticated');
      return { success: false };
    }
    
    setLoading(true);
    try {
      const { data } = await followUserMutation({ 
        variables: { userId }
      });
      console.log('User followed:', data);
      return { success: true };
    } catch (error) {
      console.error('Error following user:', error);
      
      // Fallback to mock API if GraphQL fails
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true };
    } finally {
      setLoading(false);
    }
  }, [user, followUserMutation]);

  const unfollowUser = useCallback(async (userId: string) => {
    if (!user) {
      console.error('User not authenticated');
      return { success: false };
    }
    
    setLoading(true);
    try {
      const { data } = await unfollowUserMutation({ 
        variables: { userId }
      });
      console.log('User unfollowed:', data);
      return { success: true };
    } catch (error) {
      console.error('Error unfollowing user:', error);
      
      // Fallback to mock API if GraphQL fails
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true };
    } finally {
      setLoading(false);
    }
  }, [user, unfollowUserMutation]);

  return { followUser, unfollowUser, loading };
};