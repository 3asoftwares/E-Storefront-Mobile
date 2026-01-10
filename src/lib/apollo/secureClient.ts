import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import { secureStorage } from '../../utils/secureStorage';
import { ENV } from '../../config/env';
import { captureError } from '../../config/sentry';

// SSL Pinning configuration (requires additional native setup)
// For React Native, use react-native-ssl-pinning or similar

// HTTP Link with timeout
const httpLink = createHttpLink({
  uri: ENV.API_URL,
  credentials: 'include',
  fetchOptions: {
    timeout: 30000, // 30 second timeout
  },
});

// Auth Link - adds authorization header
const authLink = setContext(async (_, { headers }) => {
  const token = await secureStorage.getAuthToken();
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      'X-App-Platform': 'mobile',
      'X-App-Version': ENV.APP_VERSION || '1.0.0',
    },
  };
});

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      // Log to error tracking
      captureError(new Error(`GraphQL Error: ${message}`), {
        operation: operation.operationName,
        path,
        extensions,
      });

      // Handle specific error codes
      if (extensions?.code === 'UNAUTHENTICATED') {
        // Clear tokens and redirect to login
        secureStorage.clearAuthTokens();
        // Navigation to login should be handled by auth context
      }
    });
  }

  if (networkError) {
    captureError(networkError as Error, {
      operation: operation.operationName,
      type: 'NetworkError',
    });
  }
});

// Retry link for failed requests
const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: 3000,
    jitter: true,
  },
  attempts: {
    max: 3,
    retryIf: (error, _operation) => {
      // Retry on network errors, but not on auth errors
      return !!error && !error.message?.includes('UNAUTHENTICATED');
    },
  },
});

// Cache configuration with security considerations
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        // Don't cache sensitive user data for too long
        me: {
          read(existing, { readField }) {
            return existing;
          },
        },
      },
    },
    User: {
      fields: {
        // Mask email in cache if needed
        email: {
          read(email) {
            return email; // Could mask in non-dev environments
          },
        },
      },
    },
  },
});

// Create Apollo Client
export const apolloClient = new ApolloClient({
  link: from([retryLink, errorLink, authLink, httpLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
  // Disable Apollo DevTools in production
  connectToDevTools: __DEV__,
});

// Clear cache on logout
export const clearApolloCache = async () => {
  await apolloClient.clearStore();
};
