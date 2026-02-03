import { useMutation } from '@apollo/client';
import { LIKE_POST, UNLIKE_POST, SAVE_POST, UNSAVE_POST } from '../graphql/mutations/postMutations';
//import { GET_FEED } from '../graphql/queries/feedQueries';

interface UsePostInteractionsResult {
  toggleLike: (postId: string, isLiked: boolean) => Promise<void>;
  toggleSave: (postId: string, isSaved: boolean) => Promise<void>;
  likeLoading: boolean;
  saveLoading: boolean;
}

export const usePostInteractions = (): UsePostInteractionsResult => {
  const [likePost, { loading: likeLoading }] = useMutation(LIKE_POST);
  const [unlikePost] = useMutation(UNLIKE_POST);
  const [savePost, { loading: saveLoading }] = useMutation(SAVE_POST);
  const [unsavePost] = useMutation(UNSAVE_POST);

  const toggleLike = async (postId: string, isLiked: boolean) => {
    try {
      const mutation = isLiked ? unlikePost : likePost;
      await mutation({
        variables: { postId },
        optimisticResponse: {
          [isLiked ? 'unlikePost' : 'likePost']: {
            __typename: 'Post',
            id: postId,
            likes: isLiked ? -1 : 1, // Relative change
            isLiked: !isLiked,
          },
        },
        update: (cache, { data }) => {
          const result = isLiked ? data?.unlikePost : data?.likePost;
          if (!result) return;

          cache.modify({
            id: cache.identify({ __typename: 'Post', id: postId }),
            fields: {
              likes: () => result.likes,
              isLiked: () => result.isLiked,
            },
          });
        },
      });
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const toggleSave = async (postId: string, isSaved: boolean) => {
    try {
      const mutation = isSaved ? unsavePost : savePost;
      await mutation({
        variables: { postId },
        optimisticResponse: {
          [isSaved ? 'unsavePost' : 'savePost']: {
            __typename: 'Post',
            id: postId,
            isSaved: !isSaved,
          },
        },
      });
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  };

  return {
    toggleLike,
    toggleSave,
    likeLoading,
    saveLoading,
  };
};