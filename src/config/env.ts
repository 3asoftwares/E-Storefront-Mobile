// Environment configuration
// Uses Expo's built-in environment variable support with EXPO_PUBLIC_ prefix

// App environment type
export type AppEnvironment = 'development' | 'staging' | 'production';

export const ENV = {
    // App Environment
    APP_ENV: (process.env.EXPO_PUBLIC_APP_ENV || 'development') as AppEnvironment,
    
    // GraphQL API
    GRAPHQL_URL: process.env.EXPO_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql',
    GRAPHQL_URL_MOBILE: process.env.EXPO_PUBLIC_GRAPHQL_URL_MOBILE || 'http://192.168.1.100:4000/graphql',
    API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000/graphql',

    // App Config
    APP_NAME: process.env.EXPO_PUBLIC_APP_NAME || 'E-Storefront',
    APP_VERSION: process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0',

    // Feature Flags
    ENABLE_ANALYTICS: process.env.EXPO_PUBLIC_ENABLE_ANALYTICS === 'true',
    ENABLE_PUSH_NOTIFICATIONS: process.env.EXPO_PUBLIC_ENABLE_PUSH_NOTIFICATIONS === 'true',
    ENABLE_CRASH_REPORTING: process.env.EXPO_PUBLIC_ENABLE_CRASH_REPORTING === 'true',

    // API Keys
    STRIPE_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
    GOOGLE_MAPS_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    
    // Monitoring & Analytics
    SENTRY_DSN: process.env.EXPO_PUBLIC_SENTRY_DSN || '',
    ANALYTICS_API_KEY: process.env.EXPO_PUBLIC_ANALYTICS_API_KEY || '',
    ANALYTICS_ENDPOINT: process.env.EXPO_PUBLIC_ANALYTICS_ENDPOINT || '',
} as const;

// Helper to check if we're in development
export const isDevelopment = __DEV__;

// Helper to check if we're in production
export const isProduction = !__DEV__;

// Helper to get current environment
export const getCurrentEnv = (): AppEnvironment => ENV.APP_ENV;
