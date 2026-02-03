import { client } from '../utils/api/graphqlClient';
import { SHARE_POST, TRACK_SHARE } from '../graphql/mutations/shareMutations';
import { ShareOptions } from '../types';

export const shareService = {
  async sharePost(postId: string, options: ShareOptions = {}) {
    const { data } = await client.mutate({
      mutation: SHARE_POST,
      variables: {
        postId,
        platform: options.platform,
        message: options.message,
      },
    });
    return data.sharePost;
  },

  async trackShare(postId: string, platform: string) {
    const { data } = await client.mutate({
      mutation: TRACK_SHARE,
      variables: { postId, platform },
    });
    return data.trackShare;
  },
};