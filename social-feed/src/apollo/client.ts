// src/apollo/client.ts
import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

// Use environment variable or fallback
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/graphql';
const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:4000/graphql';

console.log(`Connecting to GraphQL at: ${API_URL}`);

// 1. Create HTTP link
const httpLink = createHttpLink({
  uri: API_URL,
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

// 3. Create WebSocket link for subscriptions (optional)
let wsLink: GraphQLWsLink | null = null;
try {
  if (WS_URL && (process.env.NODE_ENV === 'development' || WS_URL.includes('wss://'))) {
    wsLink = new GraphQLWsLink(
      createClient({
        url: WS_URL,
        connectionParams: () => {
          const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
          return {
            authorization: token ? `Bearer ${token}` : '',
          };
        },
        // Reconnect options
        retryAttempts: 5,
        shouldRetry: () => true,
      })
    );
    console.log('WebSocket subscription enabled');
  }
} catch (error) {
  console.warn('WebSocket link creation failed, continuing without subscriptions:', error);
}

// 4. Create the combined link
const link = wsLink
  ? split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      wsLink,
      authLink.concat(httpLink)
    )
  : authLink.concat(httpLink);

// 5. Create the Apollo Client
export const client = new ApolloClient({
  link,
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

// Helper function to get main definition for split
function getMainDefinition(query: any) {
  const definition = query.definitions.find(
    (def: any) => def.kind === 'OperationDefinition'
  );
  return definition;
}

// If you also want a default export
export default client;