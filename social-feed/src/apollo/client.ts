import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Check if we're in production
const isProduction = process.env.NODE_ENV === 'production';

// Use different URIs for development vs production
const graphqlUri = isProduction 
  ? '/graphql'  // Relative path when deployed
  : 'http://localhost:4000/graphql';  // Local development

console.log(`Connecting to GraphQL at: ${graphqlUri}`);

// 1. Create HTTP link
const httpLink = createHttpLink({
  uri: graphqlUri,
  credentials: 'include', // For cookies if needed
});

// 2. Add auth context
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

// 3. Create the Apollo Client
export const client = new ApolloClient({
  link: authLink.concat(httpLink),
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

// If you also want a default export
export default client;