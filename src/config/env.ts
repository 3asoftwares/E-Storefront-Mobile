// Environment configuration
// Uses Expo's built-in environment variable support with EXPO_PUBLIC_ prefix

export const ENV = {
  // GraphQL API
  GRAPHQL_URL: process.env.EXPO_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql',
  GRAPHQL_URL_MOBILE:
    process.env.EXPO_PUBLIC_GRAPHQL_URL_MOBILE || 'http://192.168.1.100:4000/graphql',
} as const;

// Helper to check if we're in development
export const isDevelopment = __DEV__;

// Helper to check if we're in production
export const isProduction = !__DEV__;
