# 3A Storefront Mobile - Technology Stack

This document provides comprehensive information about all technologies used in the 3A Storefront Mobile application, explaining what each technology does, why we chose it, and how it benefits our application.

---

## 📋 Table of Contents

1. [Core Framework](#core-framework)
2. [Navigation](#navigation)
3. [State Management](#state-management)
4. [Data Fetching & API](#data-fetching--api)
5. [UI & Styling](#ui--styling)
6. [Storage & Persistence](#storage--persistence)
7. [Security](#security)
8. [Monitoring & Analytics](#monitoring--analytics)
9. [Testing](#testing)
10. [Build & Deployment](#build--deployment)
11. [Development Tools](#development-tools)
12. [Technology Comparison](#technology-comparison)

---

## Core Framework

### Expo SDK 51.0.28

| Aspect | Details |
|--------|---------|
| **What it is** | A platform built on top of React Native that provides tools, libraries, and services for building native apps |
| **Version** | 51.0.28 |
| **Website** | [expo.dev](https://expo.dev) |

**Why We Use It:**
- **Simplified Development**: No need to configure Xcode/Android Studio for most features
- **Over-the-Air Updates**: Push updates without app store review via EAS Update
- **Managed Workflow**: Handles native dependencies automatically
- **Cross-Platform**: Single codebase for iOS, Android, and Web
- **Rich Ecosystem**: Pre-built modules for camera, location, notifications, etc.

**How It Helps:**
```
✅ Faster development cycle (hot reload, instant preview)
✅ Reduced native code maintenance
✅ Easy team onboarding (no native setup required)
✅ Built-in TypeScript support
✅ Seamless OTA updates for bug fixes
```

---

### React Native 0.74.5

| Aspect | Details |
|--------|---------|
| **What it is** | Framework for building native mobile apps using React and JavaScript |
| **Version** | 0.74.5 |
| **Website** | [reactnative.dev](https://reactnative.dev) |

**Why We Use It:**
- **Native Performance**: Renders native UI components, not WebViews
- **Code Reusability**: Share ~95% code between iOS and Android
- **Large Community**: Extensive libraries and community support
- **React Foundation**: Familiar patterns for React developers

**How It Helps:**
```
✅ True native look and feel
✅ Single team can build for both platforms
✅ Access to native APIs when needed
✅ Strong ecosystem of third-party libraries
```

---

### React 18.2.0

| Aspect | Details |
|--------|---------|
| **What it is** | JavaScript library for building user interfaces |
| **Version** | 18.2.0 |
| **Website** | [react.dev](https://react.dev) |

**Key Features Used:**
- **Concurrent Rendering**: Better handling of UI updates
- **Automatic Batching**: Improved performance for state updates
- **Suspense**: Declarative loading states
- **Hooks**: Functional component state management

---

### TypeScript 5.3.3

| Aspect | Details |
|--------|---------|
| **What it is** | Typed superset of JavaScript that compiles to plain JavaScript |
| **Version** | 5.3.3 |
| **Website** | [typescriptlang.org](https://www.typescriptlang.org) |

**Why We Use It:**
- **Type Safety**: Catch errors at compile time, not runtime
- **Better IDE Support**: IntelliSense, auto-completion, refactoring
- **Self-Documenting Code**: Types serve as documentation
- **Easier Maintenance**: Refactoring with confidence

**How It Helps:**
```typescript
// Example: Typed props prevent runtime errors
interface ProductCardProps {
  id: string;
  name: string;
  price: number;  // TypeScript ensures this is always a number
  image?: string; // Optional property
}
```

---

## Navigation

### Expo Router 3.5.23

| Aspect | Details |
|--------|---------|
| **What it is** | File-based routing library for React Native (built on React Navigation) |
| **Version** | 3.5.23 |
| **Website** | [expo.github.io/router](https://expo.github.io/router) |

**Why We Use It:**
- **File-Based Routing**: Routes defined by file structure (like Next.js)
- **Type-Safe Navigation**: TypeScript support with typed routes
- **Deep Linking**: Automatic deep link handling
- **SEO Ready**: Web support with proper URLs

**How It Helps:**
```
app/
├── (tabs)/
│   ├── index.tsx        → /
│   ├── products.tsx     → /products
│   └── cart.tsx         → /cart
├── product/
│   └── [id].tsx         → /product/123 (dynamic)
└── login.tsx            → /login
```

**Key Benefits:**
```
✅ Intuitive navigation structure
✅ Automatic deep linking
✅ Shared layouts with _layout.tsx
✅ Modal presentations
✅ Tab and stack navigation combined
```

---

## State Management

### Zustand 4.5.2

| Aspect | Details |
|--------|---------|
| **What it is** | Lightweight state management library for React |
| **Version** | 4.5.2 |
| **Website** | [github.com/pmndrs/zustand](https://github.com/pmndrs/zustand) |

**Why We Use It:**
- **Minimal Boilerplate**: No reducers, actions, or providers
- **TypeScript First**: Excellent type inference
- **Persistence**: Easy AsyncStorage integration
- **Small Bundle Size**: ~1KB gzipped

**How It Helps:**
```typescript
// Simple store definition
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (item) => set((state) => ({
        items: [...state.items, item]
      })),
      getTotalPrice: () => get().items.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
      ),
    }),
    { name: 'cart-storage', storage: createJSONStorage(() => AsyncStorage) }
  )
);
```

**Comparison with Alternatives:**
| Feature | Zustand | Redux | Context API |
|---------|---------|-------|-------------|
| Boilerplate | Minimal | Heavy | Minimal |
| Learning Curve | Low | High | Low |
| DevTools | Yes | Yes | Limited |
| Persistence | Built-in | Middleware | Manual |
| Bundle Size | ~1KB | ~7KB | 0KB |

---

### TanStack React Query 5.28.0

| Aspect | Details |
|--------|---------|
| **What it is** | Server state management and data fetching library |
| **Version** | 5.28.0 |
| **Website** | [tanstack.com/query](https://tanstack.com/query) |

**Why We Use It:**
- **Server State Management**: Separates server state from UI state
- **Automatic Caching**: Intelligent cache with stale-while-revalidate
- **Background Refetching**: Keep data fresh automatically
- **Optimistic Updates**: Instant UI feedback

**How It Helps:**
```typescript
// Automatic caching, refetching, and loading states
const { data, isLoading, error, refetch } = useProducts(1, 20, {
  category: 'electronics',
  sortBy: 'price'
});

// Infinite scroll with automatic pagination
const { data, fetchNextPage, hasNextPage } = useInfiniteProducts(20);
```

**Key Benefits:**
```
✅ Reduces boilerplate for API calls
✅ Built-in loading/error states
✅ Automatic retry on failure
✅ Request deduplication
✅ Pagination support
✅ Offline support with persistence
```

---

## Data Fetching & API

### Apollo Client 3.8.10

| Aspect | Details |
|--------|---------|
| **What it is** | Comprehensive GraphQL client for JavaScript |
| **Version** | 3.8.10 |
| **Website** | [apollographql.com](https://www.apollographql.com/docs/react) |

**Why We Use It:**
- **GraphQL Native**: First-class GraphQL support
- **Normalized Cache**: Intelligent caching by entity
- **Real-time**: Subscriptions support
- **Developer Tools**: Apollo DevTools for debugging

**How It Helps:**
```typescript
// Declarative data fetching
const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
      price
      reviews { rating }
    }
  }
`;

// Cache automatically updates related queries
```

**Architecture:**
```
┌─────────────────────────────────────────────────────┐
│                    Apollo Client                     │
├─────────────┬─────────────┬─────────────────────────┤
│  Auth Link  │ Error Link  │      HTTP Link          │
│  (JWT Token)│ (Handling)  │  (GraphQL Endpoint)     │
├─────────────┴─────────────┴─────────────────────────┤
│              InMemoryCache (Normalized)              │
└─────────────────────────────────────────────────────┘
```

---

### GraphQL

| Aspect | Details |
|--------|---------|
| **What it is** | Query language for APIs and runtime for executing queries |
| **Version** | 15.8.0 |
| **Website** | [graphql.org](https://graphql.org) |

**Why We Use It:**
- **Flexible Queries**: Request exactly what you need
- **Single Endpoint**: One endpoint for all data
- **Strong Typing**: Schema-defined types
- **Efficient**: No over-fetching or under-fetching

**How It Helps:**
```graphql
# Mobile: Fetch only what's needed for product card
query ProductCard($id: ID!) {
  product(id: $id) {
    name
    price
    imageUrl
  }
}

# Detail page: Fetch more data
query ProductDetail($id: ID!) {
  product(id: $id) {
    name
    price
    description
    imageUrl
    reviews { rating, comment }
    seller { name }
  }
}
```

---

## UI & Styling

### React Native StyleSheet

| Aspect | Details |
|--------|---------|
| **What it is** | Built-in styling solution for React Native |
| **Why** | Native performance, type safety, no external dependencies |

**How It Helps:**
```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
    backgroundColor: Colors.light.background,
  },
  // Styles are optimized and validated at compile time
});
```

---

### Expo Linear Gradient 13.0.2

| Aspect | Details |
|--------|---------|
| **What it is** | Native gradient component for React Native |
| **Usage** | Backgrounds, buttons, headers, badges |

**How It Helps:**
```tsx
<LinearGradient
  colors={[Colors.light.primary, Colors.light.primaryDark]}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={styles.header}
>
  <Text>Beautiful gradient header</Text>
</LinearGradient>
```

---

### FontAwesome Icons

| Aspect | Details |
|--------|---------|
| **Packages** | @fortawesome/react-native-fontawesome, free-solid-svg-icons, free-regular-svg-icons, free-brands-svg-icons |
| **Version** | 7.1.0 |

**Why We Use It:**
- **Comprehensive**: 2000+ free icons
- **Consistent**: Unified design language
- **Performance**: SVG-based, tree-shakeable
- **Variants**: Solid, regular, and brand icons

---

### React Native SVG 15.15.1

| Aspect | Details |
|--------|---------|
| **What it is** | SVG support for React Native |
| **Usage** | Icons, illustrations, vector graphics |

---

### Expo Blur 13.0.3

| Aspect | Details |
|--------|---------|
| **What it is** | Native blur effect component |
| **Usage** | Overlays, modals, glassmorphism effects |

---

## Storage & Persistence

### AsyncStorage 1.21.0

| Aspect | Details |
|--------|---------|
| **What it is** | Asynchronous, unencrypted, persistent key-value storage |
| **Package** | @react-native-async-storage/async-storage |
| **Usage** | Cart data, preferences, cache, non-sensitive user data |

**How It Helps:**
```typescript
// Zustand persistence
persist(
  (set) => ({ /* store */ }),
  {
    name: 'cart-storage',
    storage: createJSONStorage(() => AsyncStorage),
  }
)
```

---

### Expo Secure Store 13.0.2

| Aspect | Details |
|--------|---------|
| **What it is** | Encrypted storage using device keychain (iOS) / keystore (Android) |
| **Usage** | Auth tokens, credentials, sensitive data |

**Why We Use It:**
- **Encryption**: Hardware-backed encryption
- **Security**: Protected by device authentication
- **Platform Native**: Uses iOS Keychain / Android Keystore

**How It Helps:**
```typescript
// Store tokens securely
await SecureStore.setItemAsync('auth_token', token, {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY
});
```

---

## Security

### Security Utilities (Custom)

**Features Implemented:**

| Feature | Purpose | Implementation |
|---------|---------|----------------|
| Input Sanitization | Prevent XSS | Remove `<>` characters, length limits |
| Email Validation | Validate format | Regex validation |
| Password Strength | Enforce security | Multi-rule validation with strength score |
| Rate Limiting | Prevent abuse | Client-side request throttling |
| Secure Headers | API security | Auth token, request ID, version headers |

---

## Monitoring & Analytics

### Sentry (React Native)

| Aspect | Details |
|--------|---------|
| **What it is** | Error tracking and performance monitoring platform |
| **Website** | [sentry.io](https://sentry.io) |

**Why We Use It:**
- **Crash Reporting**: Automatic crash detection with stack traces
- **Performance Monitoring**: Track app performance metrics
- **Release Tracking**: Associate errors with specific releases
- **User Context**: Track user sessions

**How It Helps:**
```typescript
// Automatic error capture
Sentry.init({
  dsn: ENV.SENTRY_DSN,
  environment: ENV.APP_ENV,
  tracesSampleRate: 0.2,
  attachScreenshot: true,
});

// Manual error capture with context
captureError(error, {
  operation: 'checkout',
  userId: user.id,
});
```

---

### Custom Analytics Service

**Events Tracked:**

| Event | Trigger |
|-------|---------|
| `app_open` | App launch |
| `screen_view` | Navigation |
| `product_view` | Product page visit |
| `add_to_cart` | Add item to cart |
| `begin_checkout` | Start checkout |
| `purchase` | Order complete |
| `search` | Search query |

---

### Performance Monitor (Custom)

**Metrics Tracked:**
- API call duration
- Screen render time
- Memory usage
- FPS monitoring

---

## Testing

### Jest 29.7.0

| Aspect | Details |
|--------|---------|
| **What it is** | JavaScript testing framework |
| **Preset** | jest-expo |
| **Website** | [jestjs.io](https://jestjs.io) |

**Configuration:**
```javascript
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', 'app/**/*.{ts,tsx}'],
  coverageThreshold: {
    global: { branches: 15, functions: 15, lines: 18, statements: 18 }
  },
};
```

---

### Testing Library (React Native) 12.4.3

| Aspect | Details |
|--------|---------|
| **What it is** | Testing utilities focused on user behavior |
| **Website** | [testing-library.com](https://testing-library.com/docs/react-native-testing-library/intro) |

**How It Helps:**
```typescript
// Test user interactions, not implementation
const { getByText, getByTestId } = render(<ProductCard product={mockProduct} />);

fireEvent.press(getByText('Add to Cart'));

expect(getByTestId('cart-badge')).toHaveTextContent('1');
```

---

## Build & Deployment

### EAS Build

| Aspect | Details |
|--------|---------|
| **What it is** | Expo Application Services - Cloud build service |
| **Website** | [expo.dev/eas](https://expo.dev/eas) |

**Build Profiles:**

| Profile | Purpose | Output |
|---------|---------|--------|
| `development` | Dev builds with debugging | APK / Simulator |
| `preview` | Internal testing | APK / Ad-hoc IPA |
| `production` | Store release | AAB / App Store |

---

### EAS Update

| Aspect | Details |
|--------|---------|
| **What it is** | Over-the-air JavaScript updates |
| **Benefit** | Push updates without app store review |

---

### Jenkins CI/CD

| Aspect | Details |
|--------|---------|
| **What it is** | Open-source automation server |
| **Website** | [jenkins.io](https://www.jenkins.io) |

**Pipeline Stages:**
1. Checkout → Setup → Code Quality → Test → Build → Deploy

See [JENKINS_CI_CD.md](./JENKINS_CI_CD.md) for detailed setup.

---

## Development Tools

### ESLint 8.57.0

| Aspect | Details |
|--------|---------|
| **What it is** | JavaScript/TypeScript linter |
| **Plugins** | @typescript-eslint, react, react-hooks |

---

### Babel

| Aspect | Details |
|--------|---------|
| **What it is** | JavaScript compiler |
| **Preset** | babel-preset-expo |

---

### Metro 0.80.9

| Aspect | Details |
|--------|---------|
| **What it is** | JavaScript bundler for React Native |
| **Features** | Fast refresh, asset handling, code splitting |

---

## Technology Comparison

### Why These Technologies?

| Need | Chosen | Alternatives Considered | Why Chosen |
|------|--------|------------------------|------------|
| Framework | Expo | Raw RN, Flutter | Faster dev, OTA updates, managed workflow |
| Navigation | Expo Router | React Navigation | File-based routing, type safety |
| State (Client) | Zustand | Redux, MobX, Context | Minimal boilerplate, TypeScript |
| State (Server) | React Query | SWR, RTK Query | Mature, feature-rich |
| API | Apollo + GraphQL | REST + Axios | Flexible queries, caching |
| Storage | AsyncStorage + SecureStore | MMKV, Realm | Expo native, simplicity |
| Testing | Jest + RTL | Detox, Appium | Fast, familiar, good DX |
| CI/CD | Jenkins + EAS | GitHub Actions, CircleCI | Self-hosted, EAS integration |

---

## Dependencies Summary

### Production Dependencies (24 packages)

```json
{
  "@apollo/client": "^3.8.10",
  "@expo/metro-runtime": "~3.1.3",
  "@fortawesome/fontawesome-svg-core": "^7.1.0",
  "@fortawesome/free-brands-svg-icons": "^7.1.0",
  "@fortawesome/free-regular-svg-icons": "^7.1.0",
  "@fortawesome/free-solid-svg-icons": "^7.1.0",
  "@fortawesome/react-native-fontawesome": "^0.3.2",
  "@react-native-async-storage/async-storage": "1.21.0",
  "@tanstack/react-query": "^5.28.0",
  "expo": "~51.0.28",
  "expo-blur": "~13.0.3",
  "expo-constants": "~16.0.2",
  "expo-linear-gradient": "~13.0.2",
  "expo-linking": "~6.3.1",
  "expo-router": "~3.5.23",
  "expo-secure-store": "~13.0.2",
  "expo-splash-screen": "^0.27.7",
  "expo-status-bar": "~1.12.1",
  "graphql": "^15.8.0",
  "react": "18.2.0",
  "react-native": "0.74.5",
  "react-native-gesture-handler": "~2.16.1",
  "react-native-safe-area-context": "4.10.5",
  "react-native-screens": "3.31.1",
  "react-native-svg": "^15.15.1",
  "zustand": "^4.5.2"
}
```

### Development Dependencies (14 packages)

```json
{
  "@babel/core": "^7.24.0",
  "@testing-library/jest-native": "^5.4.3",
  "@testing-library/react-native": "^12.4.3",
  "@types/jest": "^29.5.12",
  "@types/react": "~18.2.45",
  "@typescript-eslint/eslint-plugin": "^7.0.0",
  "@typescript-eslint/parser": "^7.0.0",
  "eslint": "^8.57.0",
  "eslint-plugin-react": "^7.33.2",
  "eslint-plugin-react-hooks": "^4.6.0",
  "jest": "^29.7.0",
  "jest-expo": "~51.0.0",
  "jest-junit": "^16.0.0",
  "typescript": "~5.3.3"
}
```

---

## Version Compatibility Matrix

| Package | Version | React Native | Expo SDK |
|---------|---------|--------------|----------|
| React | 18.2.0 | 0.74.x | 51.x |
| Expo Router | 3.5.x | 0.74.x | 51.x |
| Apollo Client | 3.8.x | 0.73+ | 50+ |
| Zustand | 4.5.x | 0.70+ | 48+ |
| React Query | 5.x | 0.73+ | 50+ |

---

*Last updated: January 2026*
