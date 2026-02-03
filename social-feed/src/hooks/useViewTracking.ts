import { useEffect, useRef } from 'react';
import { useMutation } from '@apollo/client';
import { TRACK_POST_VIEW } from '../graphql/mutations/viewMutations';
import { TIMEOUTS } from '../utils/constants/appConstants';

export const useViewTracking = (postId: string, enabled: boolean = true) => {
  const [trackView] = useMutation(TRACK_POST_VIEW);
  const startTimeRef = useRef<number>(Date.now());
  const hasTrackedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!enabled || hasTrackedRef.current) return;

    const timer = setTimeout(() => {
      const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
      
      trackView({
        variables: {
          postId,
          duration,
        },
      }).then(() => {
        hasTrackedRef.current = true;
      });
    }, TIMEOUTS.VIEW_TRACKING);

    return () => {
      clearTimeout(timer);
    };
  }, [postId, enabled, trackView]);

  return hasTrackedRef.current;
};