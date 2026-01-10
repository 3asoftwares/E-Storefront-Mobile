// Modern E-commerce Theme Constants
// Inspired by top mobile shopping apps like Shopify, SHEIN, Amazon

export const Colors = {
    light: {
        // Primary - Rich Indigo/Purple gradient feel
        primary: '#6366F1',
        primaryLight: '#818CF8',
        primaryDark: '#4F46E5',

        // Accent - Vibrant coral for CTAs
        accent: '#FF6B6B',
        accentLight: '#FF8A8A',
        accentDark: '#E85555',

        // Secondary - Teal for secondary actions
        secondary: '#14B8A6',
        secondaryLight: '#2DD4BF',
        secondaryDark: '#0D9488',

        // Success - Fresh green
        success: '#22C55E',
        successLight: '#4ADE80',
        successDark: '#16A34A',

        // Warning - Warm amber
        warning: '#F59E0B',
        warningLight: '#FBBF24',
        warningDark: '#D97706',

        // Error / Danger - Soft red
        error: '#EF4444',
        errorLight: '#F87171',
        errorDark: '#DC2626',

        // Info - Sky blue
        info: '#0EA5E9',
        infoLight: '#38BDF8',
        infoDark: '#0284C7',

        // Neutrals - Softer, warmer grays
        background: '#FAFAFA',
        backgroundSecondary: '#F5F5F7',
        surface: '#FFFFFF',
        surfaceSecondary: '#F0F0F2',
        surfaceElevated: '#FFFFFF',

        // Text - Deeper contrast
        text: '#1A1A2E',
        textSecondary: '#6B7280',
        textTertiary: '#9CA3AF',
        textInverse: '#FFFFFF',
        textMuted: '#B8B8C7',

        // Borders - Subtle
        border: '#E5E7EB',
        borderLight: '#F3F4F6',
        borderDark: '#D1D5DB',

        // Special colors for e-commerce
        sale: '#FF4757',
        newTag: '#00D9A5',
        bestseller: '#FFB800',

        // Gradients (use with LinearGradient)
        gradientStart: '#6366F1',
        gradientEnd: '#8B5CF6',

        // Misc
        shadow: 'rgba(0, 0, 0, 0.08)',
        shadowMedium: 'rgba(0, 0, 0, 0.12)',
        overlay: 'rgba(0, 0, 0, 0.5)',
        tabIconDefault: '#9CA3AF',
        tabIconSelected: '#6366F1',

        // Skeleton loading
        skeleton: '#E5E7EB',
        skeletonHighlight: '#F3F4F6',
    },
    dark: {
        // Primary
        primary: '#818CF8',
        primaryLight: '#A5B4FC',
        primaryDark: '#6366F1',

        // Accent
        accent: '#FF8A8A',
        accentLight: '#FFA8A8',
        accentDark: '#FF6B6B',

        // Secondary
        secondary: '#2DD4BF',
        secondaryLight: '#5EEAD4',
        secondaryDark: '#14B8A6',

        // Success
        success: '#4ADE80',
        successLight: '#86EFAC',
        successDark: '#22C55E',

        // Warning
        warning: '#FBBF24',
        warningLight: '#FCD34D',
        warningDark: '#F59E0B',

        // Error / Danger
        error: '#F87171',
        errorLight: '#FCA5A5',
        errorDark: '#EF4444',

        // Info
        info: '#38BDF8',
        infoLight: '#7DD3FC',
        infoDark: '#0EA5E9',

        // Neutrals
        background: '#0F0F1A',
        backgroundSecondary: '#1A1A2E',
        surface: '#1E1E32',
        surfaceSecondary: '#2A2A42',
        surfaceElevated: '#2E2E48',

        // Text
        text: '#F8FAFC',
        textSecondary: '#CBD5E1',
        textTertiary: '#94A3B8',
        textInverse: '#0F0F1A',
        textMuted: '#6B7280',

        // Borders
        border: '#2A2A42',
        borderLight: '#3A3A55',
        borderDark: '#1E1E32',

        // Special colors
        sale: '#FF6B6B',
        newTag: '#00D9A5',
        bestseller: '#FFB800',

        // Gradients
        gradientStart: '#818CF8',
        gradientEnd: '#A78BFA',

        // Misc
        shadow: 'rgba(0, 0, 0, 0.4)',
        shadowMedium: 'rgba(0, 0, 0, 0.5)',
        overlay: 'rgba(0, 0, 0, 0.7)',
        tabIconDefault: '#6B7280',
        tabIconSelected: '#818CF8',

        // Skeleton
        skeleton: '#2A2A42',
        skeletonHighlight: '#3A3A55',
    },
};

export const Spacing = {
    'xs': 4,
    'sm': 8,
    'md': 12,
    'base': 16,
    'lg': 20,
    'xl': 24,
    '2xl': 32,
    '3xl': 40,
    '4xl': 48,
    '5xl': 64,
};

export const FontSizes = {
    'xs': 10,
    'sm': 12,
    'base': 14,
    'md': 16,
    'lg': 18,
    'xl': 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
};

export const FontWeights = {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
    black: '900' as const,
};

export const BorderRadius = {
    'none': 0,
    'xs': 4,
    'sm': 6,
    'base': 8,
    'md': 12,
    'lg': 16,
    'xl': 20,
    '2xl': 24,
    '3xl': 32,
    'full': 9999,
};

// Modern shadow system with blur and spread
export const Shadows = {
    xs: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 2,
        elevation: 1,
    },
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
        elevation: 2,
    },
    base: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 3,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 5,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 8,
    },
    xl: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.15,
        shadowRadius: 28,
        elevation: 12,
    },
    // Colored shadows for cards
    primary: {
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 6,
    },
    accent: {
        shadowColor: '#FF6B6B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 6,
    },
};

export const ZIndex = {
    base: 0,
    dropdown: 10,
    sticky: 20,
    modal: 30,
    popover: 40,
    tooltip: 50,
};

// Order status colors
export const OrderStatusColors = {
    pending: Colors.light.warning,
    confirmed: Colors.light.info,
    processing: Colors.light.primary,
    shipped: Colors.light.secondary,
    delivered: Colors.light.success,
    cancelled: Colors.light.error,
    refunded: Colors.light.textTertiary,
};

// Category emoji mapping (matching web app)
export const CategoryEmojis: Record<string, string> = {
    electronics: '📱',
    clothing: '👕',
    home: '🏠',
    beauty: '💄',
    sports: '⚽',
    books: '📚',
    toys: '🧸',
    food: '🍔',
    automotive: '🚗',
    garden: '🌱',
    health: '💊',
    jewelry: '💎',
    office: '📎',
    pets: '🐾',
    music: '🎵',
    default: '📦',
};

// API Configuration
export const API_CONFIG = {
    graphqlEndpoint: __DEV__
        ? 'http://192.168.1.100:4000/graphql' // Change to your local IP
        : 'https://api.your-domain.com/graphql',
    timeout: 30000,
    retryAttempts: 3,
};

// App Configuration
export const APP_CONFIG = {
    name: '3A Storefront',
    version: '1.0.0',
    currency: 'INR',
    currencySymbol: '₹',
    itemsPerPage: 20,
    maxCartItems: 99,
    freeShippingThreshold: 50,
    shippingCost: 5.99,
};

// Animation durations (ms)
export const Animations = {
    fast: 150,
    normal: 300,
    slow: 500,
};
