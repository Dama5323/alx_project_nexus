// src/hooks/useFeedManager.ts
import { useMemo } from 'react';
import { PostType, SimplePost } from '../types/post';

export const useFeedManager = (graphqlPosts: PostType[], localPosts: SimplePost[]): PostType[] => {
  return useMemo(() => {
    // If GraphQL is working, use those
    if (graphqlPosts && graphqlPosts.length > 0) return graphqlPosts;
    
    // Fallback: Map SimplePost to the standard PostType format
    return localPosts.map(sp => ({
      id: sp.id,
      content: sp.content,
      author: { 
        id: 'local-user', // Default ID for local posts
        name: sp.username, 
        avatar: sp.userAvatar,
        username: sp.handle
      },
      likes: sp.likes,
      comments: Array(sp.comments).fill({}), // Mock array based on count
      shares: 0,
      reposts: sp.retweets,
      views: 0,
      isLiked: false,
      isReposted: false,
      isSaved: false,
      images: sp.images || (sp.media ? [sp.media] : []),
      video: sp.video
    }));
  }, [graphqlPosts, localPosts]);
};