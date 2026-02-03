import { client } from '../utils/api/graphqlClient';
import { TRACK_POST_VIEW, TRACK_IMPRESSION } from '../graphql/mutations/viewMutations';
import { GET_POST_ANALYTICS } from '../graphql/queries/analyticsQueries';

export const analyticsService = {
  async trackView(postId: string, duration?: number) {
    try {
      const { data } = await client.mutate({
        mutation: TRACK_POST_VIEW,
        variables: { postId, duration },
      });
      return data.trackPostView;
    } catch (error) {
      console.error('Error tracking view:', error);
      return null;
    }
  },

  async trackImpression(postId: string) {
    try {
      const { data } = await client.mutate({
        mutation: TRACK_IMPRESSION,
        variables: { postId },
      });
      return data.trackImpression;
    } catch (error) {
      console.error('Error tracking impression:', error);
      return null;
    }
  },

  async getPostAnalytics(postId: string) {
    const { data } = await client.query({
      query: GET_POST_ANALYTICS,
      variables: { postId },
    });
    return data.postAnalytics;
  },
};