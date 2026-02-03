import { ApolloClient, InMemoryCache, HttpLink, from, ApolloLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { Observable } from '@apollo/client/utilities';

// Mock data
const mockPosts = [
  {
    __typename: 'Post',
    id: '1',
    content: 'Welcome to the Social Feed! 🎉 This is running with mock data.',
    author: {
      __typename: 'User',
      id: 'user1',
      username: 'admin',
      name: 'System Admin',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      isVerified: true
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    likes: 42,
    comments: 5,
    shares: 3,
    views: 128,
    isLiked: false,
    isShared: false,
    images: [],
    hashtags: ['welcome', 'social'],
    mentions: [],
    privacy: 'public'
  },
  {
    __typename: 'Post',
    id: '2',
    content: 'Check out this amazing view from my hike yesterday! 🏔️',
    author: {
      __typename: 'User',
      id: 'user2',
      username: 'naturelover',
      name: 'Sarah Johnson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      isVerified: false
    },
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    likes: 156,
    comments: 24,
    shares: 12,
    views: 450,
    isLiked: true,
    isShared: false,
    images: ['https://picsum.photos/600/400?random=1'],
    hashtags: ['hiking', 'nature', 'photography'],
    mentions: ['friend1'],
    privacy: 'public'
  }
];

// Custom Apollo Link that provides mock data
const mockLink = new ApolloLink((operation, forward) => {
  const { operationName } = operation;
  
  // Return mock data for specific operations
  if (operationName === 'GetFeed') {
    return new Observable(observer => {
      console.log('📡 Mock: Returning feed data');
      setTimeout(() => {
        observer.next({
          data: {
            feed: mockPosts
          }
        });
        observer.complete();
      }, 300); // Simulate network delay
    });
  }
  
  if (operationName === 'GetPost') {
    const postId = operation.variables?.postId || '1';
    const post = mockPosts.find(p => p.id === postId) || mockPosts[0];
    
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({
          data: {
            post
          }
        });
        observer.complete();
      }, 200);
    });
  }
  
  if (operationName === 'GetUserPosts') {
    const userId = operation.variables?.userId || 'user1';
    const userPosts = mockPosts.filter(p => p.author.id === userId);
    
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({
          data: {
            userPosts
          }
        });
        observer.complete();
      }, 200);
    });
  }
  
  // For mutations
  if (operationName === 'CreatePost' || 
      operationName === 'UpdatePost' || 
      operationName === 'DeletePost') {
    console.log('Mock: Handling mutation', operationName);
    
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({
          data: {
            [operationName === 'CreatePost' ? 'createPost' : 
             operationName === 'UpdatePost' ? 'updatePost' : 'deletePost']: 
              operationName === 'DeletePost' ? true : mockPosts[0]
          }
        });
        observer.complete();
      }, 300);
    });
  }
  
  // Forward other operations (they will fail to network)
  return forward(operation);
});

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, path }) => {
      console.log(`[GraphQL error]: ${message}, Path: ${path}`);
    });
  }
  
  if (networkError) {
    console.log(`[Network error]: ${networkError.message}`);
  }
});

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql', // Non-existent backend
});

// Combine links - mockLink will intercept before httpLink
export const client = new ApolloClient({
  link: from([errorLink, mockLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});