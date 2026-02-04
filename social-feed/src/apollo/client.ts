import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// 1. Create HTTP link to your REAL backend
const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql', // Your working backend
  credentials: 'include', // For cookies if needed
});

// 2. Optional: Add auth context
const authLink = setContext((_, { headers }) => {
  // Get token from localStorage
  const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

// 3. Create client with REAL connection
const client = new ApolloClient({
  link: authLink.concat(httpLink), // Connect auth + real HTTP
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          feed: {
            merge(existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network', // Real-time updates
    },
    query: {
      fetchPolicy: 'network-only', // Always fetch fresh
    },
  },
});

export default client;