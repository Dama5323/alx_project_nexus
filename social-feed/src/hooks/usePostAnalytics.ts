import { useQuery } from '@apollo/client';
import { GET_POST_ANALYTICS } from '../graphql/queries/analyticsQueries';
import { PostInsights } from '../types';

interface UsePostAnalyticsResult {
  analytics: PostInsights | null;
  loading: boolean;
  error: any;
  refetch: () => void;
}

export const usePostAnalytics = (postId: string): UsePostAnalyticsResult => {
  const { data, loading, error, refetch } = useQuery(GET_POST_ANALYTICS, {
    variables: { postId },
    skip: !postId,
  });

  return {
    analytics: data?.postAnalytics || null,
    loading,
    error,
    refetch,
  };
};