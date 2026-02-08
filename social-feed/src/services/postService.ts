import { client } from '../utils/api/graphqlClient';
import { CREATE_POST, UPDATE_POST, DELETE_POST } from '../graphql/mutations/postMutations';
import { GET_POST, GET_USER_POSTS } from '../graphql/queries/postQueries';
import { CreatePostInput, UpdatePostInput } from '../types';

// Update the PostData interface to include images and video
export interface PostData {
  id?: string;
  content: string;
  timestamp: string;
  author?: {
    name: string;
    username: string;
    avatar: string;
  };
  likes?: number;
  comments?: number;
  shares?: number;
  isLiked?: boolean;
  images?: string[];
  video?: string;
}

export const generateSamplePosts = async (): Promise<PostData[]> => {
  const samplePosts: PostData[] = [
    {
      id: '1',
      author: {
        name: 'Damaris Chege',
        username: '@damarischege',
        avatar: 'https://res.cloudinary.com/dzyqof9it/image/upload/v1770481206/ava2_dvty1g.jpg',
      },
      content: 'Just deployed my first React app! So excited to see it live. 🚀 #React #WebDev',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      likes: 42,
      comments: 12,
      shares: 5,
      isLiked: false,
    },
    {
      id: '2',
      author: {
        name: 'Sarah Chen',
        username: '@sarahc',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      },
      content: 'TypeScript makes JavaScript so much more maintainable. Highly recommend it for any serious project! #TypeScript #Programming',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      likes: 89,
      comments: 24,
      shares: 8,
      isLiked: true,
    },
    {
      id: '3',
      author: {
        name: 'Mike Davis',
        username: '@miked',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
      },
      content: 'Working on a new social media analytics dashboard. The insights are fascinating! 📊 #Analytics #DataScience',
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      likes: 56,
      comments: 8,
      shares: 3,
      isLiked: false,
    },
  ];

  // Save to localStorage or your backend
  localStorage.setItem('samplePosts', JSON.stringify(samplePosts));
  return samplePosts;
};

// Use the postService object OR individual functions, not both
export const postService = {
  async createPost(input: CreatePostInput) {
    const { data } = await client.mutate({
      mutation: CREATE_POST,
      variables: { input },
      refetchQueries: ['GetFeed'],
    });
    return (data as any)?.createPost;
  },

  async updatePost(input: UpdatePostInput) {
    const { data } = await client.mutate({
      mutation: UPDATE_POST,
      variables: { input },
    });
    return (data as any)?.updatePost;
  },

  async deletePost(postId: string) {
    const { data } = await client.mutate({
      mutation: DELETE_POST,
      variables: { postId },
      refetchQueries: ['GetFeed'],
    });
    return (data as any)?.deletePost;
  },

  async getPost(postId: string) {
    const { data } = await client.query({
      query: GET_POST,
      variables: { postId },
    });
    return (data as any)?.post;
  },

  async getUserPosts(userId: string, first: number = 10) {
    const { data } = await client.query({
      query: GET_USER_POSTS,
      variables: { userId, first },
    });
    return (data as any)?.userPosts;
  },
};

// SINGLE createPost function (choose one approach)
export const createPost = async (postData: PostData): Promise<PostData> => {
  try {
    // Option 1: Use GraphQL mutation (recommended for real backend)
    const { data } = await client.mutate({
      mutation: CREATE_POST,
      variables: { 
        input: {
          content: postData.content,
          // Check your GraphQL schema for required fields
          images: postData.images || [],
          video: postData.video || null,
          timestamp: postData.timestamp || new Date().toISOString()
        }
      },
      refetchQueries: ['GetFeed'],
    });

    const graphQLPost = (data as any)?.createPost;
    
    if (graphQLPost) {
      // Save to localStorage for immediate UI
      const newPost: PostData = {
        id: graphQLPost.id || Date.now().toString(),
        ...postData,
        author: postData.author || {
          name: 'Current User',
          username: '@currentuser',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'
        },
        likes: 0,
        comments: 0,
        shares: 0,
        isLiked: false,
      };

      const existingPosts = JSON.parse(localStorage.getItem('posts') || '[]');
      const updatedPosts = [newPost, ...existingPosts];
      localStorage.setItem('posts', JSON.stringify(updatedPosts));
      
      return newPost;
    } else {
      throw new Error('Failed to create post via GraphQL');
    }
  } catch (error) {
    console.error('Error creating post via GraphQL:', error);
    
    // Fallback: Save to localStorage only
    const newPost: PostData = {
      id: Date.now().toString(),
      ...postData,
      author: postData.author || {
        name: 'Current User',
        username: '@currentuser',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'
      },
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
    };

    const existingPosts = JSON.parse(localStorage.getItem('posts') || '[]');
    const updatedPosts = [newPost, ...existingPosts];
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
    
    return newPost;
  }
};

export const getPosts = async (): Promise<PostData[]> => {
  try {
    // Check localStorage for posts
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    
    // If no posts, generate sample posts
    if (posts.length === 0) {
      const samplePosts = await generateSamplePosts();
      localStorage.setItem('posts', JSON.stringify(samplePosts));
      return samplePosts;
    }
    
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};