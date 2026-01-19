// Environment configuration
// Uses Expo's built-in environment variable support with EXPO_PUBLIC_ prefix

export const ENV = {
  // GraphQL API
  GRAPHQL_URL:
    process.env.EXPO_PUBLIC_GRAPHQL_URL || 'https://e-graphql-gateway.up.railway.app/graphql',
  GRAPHQL_URL_MOBILE:
    process.env.EXPO_PUBLIC_GRAPHQL_URL_MOBILE ||
    'https://e-graphql-gateway.up.railway.app/graphql',
} as const;

// Helper to check if we're in development
export const isDevelopment = __DEV__;

// Helper to check if we're in production
export const isProduction = !__DEV__;
