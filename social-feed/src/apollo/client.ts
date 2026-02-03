// src/apollo/client.ts
import { ApolloClient, InMemoryCache, ApolloLink, Observable } from '@apollo/client';

// Your mock data
const mockPosts = [
  {
    id: '1',
    content: 'Just launched my new project! 🚀 So excited to share this with everyone. What do you think?',
    images: ['https://picsum.photos/seed/post1/800/600'],
    author: {
      id: 'user2',
      name: 'Sarah Johnson',
      username: 'sarahj',
      email: 'sarah.johnson@example.com',
      avatar: 'https://i.pravatar.cc/150?img=2',
      verified: true,
      createdAt: '2024-01-15T10:30:00Z',
    },
    likes: 245,
    comments: 42,
    shares: 18,
    createdAt: '2024-02-01T10:30:00Z',
    isLiked: true,
    isSaved: false,
  },
  {
    id: '2',
    content: 'Beautiful sunset today! Nature never fails to amaze me 🌅 #photography #nature',
    images: ['https://picsum.photos/seed/sunset/800/600'],
    author: {
      id: 'user3',
      name: 'Mike Chen',
      username: 'mikechen',
      email: 'mike.chen@example.com',
      avatar: 'https://i.pravatar.cc/150?img=3',
      verified: false,
      createdAt: '2024-01-20T14:45:00Z',
    },
    likes: 189,
    comments: 23,
    shares: 9,
    createdAt: '2024-01-31T18:45:00Z',
    isLiked: false,
    isSaved: true,
  },
  // Add more posts as needed
];

// Create a mock link that doesn't make network requests
const mockLink = new ApolloLink((operation) => {
  console.log('Mock Apollo Link called for:', operation.operationName);
  
  return new Observable((observer) => {
    // Simulate network delay
    setTimeout(() => {
      try {
        const { operationName } = operation;
        
        if (operationName === 'GetFeed') {
          observer.next({
            data: {
              feed: {
                edges: mockPosts.map((post, index) => ({
                  cursor: `cursor${index}`,
                  node: post,
                })),
                pageInfo: {
                  hasNextPage: false,
                  endCursor: null,
                },
              },
            },
          });
        } else {
          // For other queries, return empty successful response
          observer.next({ data: {} });
        }
        
        observer.complete();
      } catch (error) {
        observer.error(error);
      }
    }, 300);
  });
});

const client = new ApolloClient({
  link: mockLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-first',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'cache-first',
      errorPolicy: 'ignore',
    },
    mutate: {
      errorPolicy: 'ignore',
    },
  },
});

export default client;