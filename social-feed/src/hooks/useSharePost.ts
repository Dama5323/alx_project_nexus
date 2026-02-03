import { useMutation } from '@apollo/client';
import { SHARE_POST, TRACK_SHARE } from '../graphql/mutations/shareMutations';
import { sharePost as sharePostHelper } from '../utils/helpers/shareHelpers';
import { ShareOptions } from '../types';

interface UseSharePostResult {
  sharePost: (postId: string, options?: ShareOptions) => Promise<boolean>;
  loading: boolean;
}

export const useSharePost = (): UseSharePostResult => {
  const [sharePostMutation, { loading }] = useMutation(SHARE_POST);
  const [trackShareMutation] = useMutation(TRACK_SHARE);

  const sharePost = async (postId: string, options: ShareOptions = {}): Promise<boolean> => {
    try {
      // Use helper to handle actual sharing
      const success = await sharePostHelper(postId, options);

      if (success) {
        // Track the share in backend
        await sharePostMutation({
          variables: {
            postId,
            platform: options.platform || 'copy',
            message: options.message,
          },
        });

        // Track analytics
        if (options.platform) {
          await trackShareMutation({
            variables: {
              postId,
              platform: options.platform,
            },
          });
        }
      }

      return success;
    } catch (error) {
      console.error('Error sharing post:', error);
      return false;
    }
  };

  return {
    sharePost,
    loading,
  };
};