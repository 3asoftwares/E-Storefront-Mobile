# 3A Storefront Mobile App

A production-ready, full-featured e-commerce mobile application built with **Expo SDK 51**, **React Native 0.74.5**, and **TypeScript**. This cross-platform app (iOS, Android, Web) provides a complete shopping experience with modern UI/UX patterns, robust state management, and enterprise-grade security.

## 📋 Application Summary

| Aspect | Details |
|--------|---------|
| **App Name** | 3A Storefront |
| **Bundle ID** | `com.3asoftwares.storefront` (iOS) / `com.a3softwares.storefront` (Android) |
| **Version** | 1.0.0 |
| **Expo SDK** | 51.0.28 |
| **React Native** | 0.74.5 |
| **React** | 18.2.0 |
| **Minimum Node** | 18+ |

## 🚀 Features

### Core E-Commerce Features

- **Product Catalog**: Browse products with search, filtering by category/price, sorting options
- **Product Details**: View detailed product info, images, ratings, reviews, and seller information
- **Shopping Cart**: Add items, update quantities, remove items with persistent storage
- **Wishlist**: Save products for later with toggle functionality
- **User Authentication**: Login, signup, password recovery with secure token management
- **Multi-Step Checkout**: Address selection, delivery options, payment methods, coupon codes
- **Order Management**: View order history, track orders with status updates
- **Address Management**: Add, edit, delete delivery addresses with default selection
- **User Profile**: View and edit profile information, manage account settings
- **Categories**: Browse products by category with icon-based navigation
- **Search**: Real-time search with recent search history

### Technical Highlights

- **GraphQL API Integration**: Apollo Client with secure authentication headers
- **State Management**: Zustand with AsyncStorage persistence for cart, wishlist, and user data
- **Navigation**: Expo Router v3.5 with file-based routing and typed routes
- **Offline Support**: Local caching with TTL-based expiration
- **Cross-Platform**: iOS, Android, and Web with platform-specific optimizations
- **Secure Storage**: expo-secure-store for tokens/credentials, AsyncStorage for non-sensitive data
- **Performance Monitoring**: Built-in metrics tracking, FPS monitoring, memory usage
- **Analytics Ready**: Event tracking system for user behavior analysis
- **Error Tracking**: Sentry integration for crash reporting and error monitoring
- **CI/CD Pipeline**: Jenkins pipeline with automated testing, builds, and deployments

### Security Features

- **Secure Token Storage**: Uses expo-secure-store with keychain access
- **Input Sanitization**: XSS prevention and input validation
- **Password Validation**: Strength checking with detailed feedback
- **Rate Limiting**: Client-side rate limiter for API calls
- **Request Tracing**: Unique request IDs for debugging
- **SSL/Authentication**: Bearer token authentication with auto-refresh

## 📱 Screenshots

| Home | Products | Cart | Profile |
| ---- | -------- | ---- | ------- |
| 🏠   | 📦       | 🛒   | 👤      |

## 🛠️ Tech Stack

### Core Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| Expo | 51.0.28 | Development framework |
| React Native | 0.74.5 | Cross-platform UI |
| TypeScript | 5.3.3 | Type safety |
| Expo Router | 3.5.23 | File-based navigation |

### Data & State Management
| Technology | Version | Purpose |
|------------|---------|---------|
| Apollo Client | 3.8.10 | GraphQL client |
| TanStack React Query | 5.28.0 | Server state management |
| Zustand | 4.5.2 | Client state management |
| AsyncStorage | 1.21.0 | Persistent storage |

### UI & Styling
| Technology | Purpose |
|------------|---------|
| React Native StyleSheet | Component styling |
| Expo Linear Gradient | Gradient backgrounds |
| Expo Blur | Blur effects |
| FontAwesome | Icon library |
| React Native SVG | SVG support |

### Security & Monitoring
| Technology | Purpose |
|------------|---------|
| expo-secure-store | Secure credential storage |
| Sentry | Error tracking & crash reporting |

### Testing
| Technology | Version | Purpose |
|------------|---------|---------|
| Jest | 29.7.0 | Test runner |
| Jest Expo | 51.0.0 | Expo testing preset |
| Testing Library | 12.4.3 | React Native testing |

### Build & CI/CD
| Technology | Purpose |
|------------|---------|
| EAS Build | Cloud builds for iOS/Android |
| Jenkins | CI/CD automation |
| ESLint | Code linting |

## 📦 Project Structure

```
E-Storefront-Mobile/
├── app/                              # Expo Router pages (screens)
│   ├── (tabs)/                       # Bottom tab navigation
│   │   ├── _layout.tsx               # Tab bar configuration with badges
│   │   ├── index.tsx                 # Home screen (featured products, categories)
│   │   ├── products.tsx              # Product listing with filters
│   │   ├── cart.tsx                  # Shopping cart
│   │   ├── wishlist.tsx              # Saved items
│   │   └── profile.tsx               # User profile & settings
│   ├── product/
│   │   └── [id].tsx                  # Product detail (dynamic route)
│   ├── orders/
│   │   ├── index.tsx                 # Order history list
│   │   └── [id].tsx                  # Order detail (dynamic route)
│   ├── login.tsx                     # Login (modal)
│   ├── signup.tsx                    # Registration (modal)
│   ├── forgot-password.tsx           # Password recovery (modal)
│   ├── edit-profile.tsx              # Profile editing
│   ├── checkout.tsx                  # Multi-step checkout flow
│   ├── search.tsx                    # Product search (modal)
│   ├── categories.tsx                # Category browsing
│   ├── settings.tsx                  # App settings
│   ├── addresses.tsx                 # Address management
│   ├── privacy-policy.tsx            # Privacy policy
│   ├── terms-of-service.tsx          # Terms of service
│   ├── help-center.tsx               # Help & support
│   ├── privacy-security.tsx          # Security settings
│   └── _layout.tsx                   # Root layout (providers)
│
├── src/
│   ├── components/
│   │   ├── ui/                       # Reusable UI components
│   │   │   ├── Button.tsx            # Multi-variant button (7 variants, 5 sizes)
│   │   │   ├── Input.tsx             # Form input component
│   │   │   ├── Card.tsx              # Card container
│   │   │   ├── Badge.tsx             # Badge/tag component
│   │   │   ├── Loading.tsx           # Loading indicators
│   │   │   ├── EmptyState.tsx        # Empty state placeholder
│   │   │   ├── Icon.tsx              # Icon wrapper
│   │   │   ├── AnimatedCard.tsx      # Animated card component
│   │   │   ├── GradientHeader.tsx    # Gradient header
│   │   │   ├── ModernProductCard.tsx # Enhanced product card
│   │   │   ├── OptimizedList.tsx     # Virtualized list
│   │   │   └── index.ts              # Barrel export
│   │   └── products/                 # Product-specific components
│   │       ├── ProductCard.tsx       # Product card with animations
│   │       ├── ProductGrid.tsx       # Product grid layout
│   │       └── index.ts              # Barrel export
│   │
│   ├── lib/
│   │   ├── apollo/
│   │   │   ├── client.ts             # Apollo Client setup with auth
│   │   │   ├── queries.ts            # GraphQL queries & mutations (575+ lines)
│   │   │   └── secureClient.ts       # Enhanced secure client with retry
│   │   └── hooks/
│   │       └── index.ts              # React Query hooks (770+ lines)
│   │                                 # - useProducts, useProduct
│   │                                 # - useCategories
│   │                                 # - useLogin, useRegister, useLogout
│   │                                 # - useOrders, useCreateOrder
│   │                                 # - useAddresses, useAddAddress
│   │                                 # - useValidateCoupon
│   │                                 # - useInfiniteProducts
│   │
│   ├── store/
│   │   └── cartStore.ts              # Zustand store (347 lines)
│   │                                 # - Cart management
│   │                                 # - Wishlist management
│   │                                 # - Recently viewed tracking
│   │                                 # - User profile & addresses
│   │                                 # - Recent searches
│   │
│   ├── config/
│   │   ├── env.ts                    # Environment configuration
│   │   ├── analytics.ts              # Analytics service (event tracking)
│   │   ├── performance.ts            # Performance monitoring
│   │   └── sentry.ts                 # Sentry error tracking setup
│   │
│   ├── constants/
│   │   └── theme.ts                  # Design system (333 lines)
│   │                                 # - Colors (light/dark mode)
│   │                                 # - Typography
│   │                                 # - Spacing
│   │                                 # - Border radius
│   │                                 # - Shadows
│   │
│   ├── utils/
│   │   ├── helpers.ts                # Utility functions
│   │   ├── cache.ts                  # Offline caching with TTL
│   │   ├── optimization.ts           # Performance utilities
│   │   │                             # - Image preloading
│   │   │                             # - useDebounce, useThrottle hooks
│   │   ├── security.ts               # Security utilities
│   │   │                             # - Input sanitization
│   │   │                             # - Password validation
│   │   │                             # - Rate limiting
│   │   ├── secureStorage.ts          # Secure storage service
│   │   └── index.ts                  # Barrel export
│   │
│   └── __tests__/                    # Test suites
│       ├── components/               # Component tests (8 files)
│       ├── config/                   # Config tests (3 files)
│       ├── constants/                # Theme tests
│       ├── integration/              # User flow tests
│       ├── lib/apollo/               # Apollo client tests
│       ├── store/                    # Store tests (3 files)
│       └── utils/                    # Utility tests (5 files)
│
├── assets/                           # App assets (icons, splash, images)
│
├── app.json                          # Expo configuration
├── eas.json                          # EAS Build configuration
├── Jenkinsfile                       # CI/CD pipeline (223 lines)
├── jest.config.js                    # Jest test configuration
├── jest.setup.js                     # Test setup
├── babel.config.js                   # Babel configuration
├── metro.config.js                   # Metro bundler config
├── tsconfig.json                     # TypeScript configuration
├── package.json                      # Dependencies & scripts
├── CHANGELOG.md                      # Version history
├── JENKINS_SETUP.md                  # CI/CD setup guide
└── README.md                         # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or 20+ (recommended: 18.18.0)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- EAS CLI (`npm install -g eas-cli`) for builds
- iOS Simulator (Mac) or Android Emulator
- Expo Go app (for physical device testing)

### Installation

1. **Clone and navigate to the project**:

   ```bash
   cd E-Storefront-Mobile
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure the GraphQL endpoint**:

   Create a `.env` file or update `src/config/env.ts`:

   ```typescript
   // Environment Variables (use EXPO_PUBLIC_ prefix)
   EXPO_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
   EXPO_PUBLIC_GRAPHQL_URL_MOBILE=http://192.168.1.100:4000/graphql
   EXPO_PUBLIC_APP_ENV=development
   ```

4. **Start the development server**:

   ```bash
   npx expo start
   ```

5. **Run on device/simulator**:
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Press `w` for Web browser
   - Scan QR code with Expo Go app for physical device

### Running the Backend

Ensure the GraphQL backend services are running:

```bash
# From the backend project root
docker-compose up -d

# Or run the GraphQL gateway directly
cd services/graphql-gateway && npm run dev
```

## 📱 Available Scripts

```bash
# Development
npm start                    # Start Expo development server
npm run clean               # Start with cache cleared
npm run android             # Run on Android
npm run ios                 # Run on iOS
npm run web                 # Run on Web

# Code Quality
npm run lint                # ESLint check
npm run lint:fix            # ESLint auto-fix
npm run typecheck           # TypeScript type checking

# Testing
npm test                    # Run all tests
npm run test:watch          # Watch mode
npm run test:coverage       # With coverage report

# Building (EAS)
npm run build:android       # Build Android preview APK
npm run build:ios           # Build iOS preview
npm run build:all           # Build both platforms (preview)
npm run build:production    # Production builds for stores

# Submission
npm run submit:android      # Submit to Google Play
npm run submit:ios          # Submit to App Store

# Updates
npm run update              # Push OTA update
npm run prebuild            # Generate native projects
```

## 🔧 Configuration

### Environment Variables

Configure in `.env` or as `EXPO_PUBLIC_*` variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `EXPO_PUBLIC_APP_ENV` | Environment (development/staging/production) | development |
| `EXPO_PUBLIC_GRAPHQL_URL` | GraphQL endpoint (web) | http://localhost:4000/graphql |
| `EXPO_PUBLIC_GRAPHQL_URL_MOBILE` | GraphQL endpoint (mobile) | http://192.168.1.100:4000/graphql |
| `EXPO_PUBLIC_APP_NAME` | Application name | E-Storefront |
| `EXPO_PUBLIC_ENABLE_ANALYTICS` | Enable analytics | false |
| `EXPO_PUBLIC_ENABLE_CRASH_REPORTING` | Enable Sentry | false |
| `EXPO_PUBLIC_SENTRY_DSN` | Sentry DSN | - |
| `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe key | - |

### Theme Customization

Colors, spacing, and typography in `src/constants/theme.ts`:

```typescript
export const Colors = {
  light: {
    primary: '#6366F1',      // Indigo
    accent: '#FF6B6B',       // Coral (CTAs)
    secondary: '#14B8A6',    // Teal
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    // ... 50+ color tokens
  },
  dark: {
    // Dark mode variants
  },
};

export const Spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };
export const BorderRadius = { sm: 4, md: 8, lg: 12, xl: 16, full: 9999 };
export const FontSizes = { xs: 10, sm: 12, md: 14, lg: 16, xl: 20, xxl: 24, xxxl: 32 };
```

## 📝 API Integration

### GraphQL Queries

| Query | Description |
|-------|-------------|
| `GET_PRODUCTS_QUERY` | Fetch products with pagination, filters, sorting |
| `GET_PRODUCT_QUERY` | Get single product with seller info |
| `GET_CATEGORIES_QUERY` | Fetch active categories |
| `GET_ORDERS_BY_CUSTOMER_QUERY` | User's order history |
| `GET_ORDER_QUERY` | Single order details |
| `GET_ME_QUERY` | Current user profile |

### GraphQL Mutations

| Mutation | Description |
|----------|-------------|
| `LOGIN_MUTATION` | User authentication |
| `REGISTER_MUTATION` | New user registration |
| `LOGOUT_MUTATION` | Session logout |
| `CREATE_ORDER_MUTATION` | Create new order |
| `CREATE_REVIEW_MUTATION` | Add product review |
| `VALIDATE_COUPON_MUTATION` | Validate discount code |
| `ADD_ADDRESS_MUTATION` | Add shipping address |
| `UPDATE_ADDRESS_MUTATION` | Update address |
| `DELETE_ADDRESS_MUTATION` | Remove address |

### Custom Hooks

```typescript
// Products
useProducts(page, limit, filters)    // Paginated products
useInfiniteProducts(limit, filters)  // Infinite scroll
useProduct(id)                       // Single product

// Auth
useLogin()                           // Login mutation
useRegister()                        // Registration
useLogout()                          // Logout
useCurrentUser()                     // Current user

// Orders
useOrders()                          // Order history
useOrder(id)                         // Order details
useCreateOrder()                     // Place order

// Other
useCategories()                      // Category list
useAddresses()                       // User addresses
useValidateCoupon()                  // Coupon validation
```

## 🧪 Testing

### Test Structure

```
src/__tests__/
├── components/          # UI component tests
│   ├── Button.test.tsx
│   ├── Input.test.tsx
│   ├── ProductCard.test.tsx
│   └── ...
├── config/              # Configuration tests
│   ├── analytics.test.ts
│   ├── env.test.ts
│   └── performance.test.ts
├── store/               # State management tests
│   ├── cartStore.test.ts
│   ├── cartStore.extended.test.ts
│   └── cartStore.comprehensive.test.ts
├── utils/               # Utility function tests
│   ├── cache.test.ts
│   ├── security.test.ts
│   └── ...
├── lib/apollo/          # API client tests
└── integration/         # User flow tests
```

### Running Tests

```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# With coverage report
npm run test:coverage

# Specific test file
npm test -- Button.test.tsx

# Pattern matching
npm test -- --testPathPattern="store"
```

### Coverage Thresholds

| Metric | Threshold |
|--------|-----------|
| Branches | 15% |
| Functions | 15% |
| Lines | 18% |
| Statements | 18% |

## 📦 Building for Production

### EAS Build Profiles

| Profile | Purpose | Output |
|---------|---------|--------|
| `development` | Dev client with debugging | APK / Simulator build |
| `preview` | Internal testing | APK / Ad-hoc IPA |
| `production` | Store release | AAB / App Store build |

### Build Commands

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure project (first time)
eas build:configure

# Development builds
eas build --profile development --platform android
eas build --profile development --platform ios

# Preview builds (internal testing)
eas build --profile preview --platform all

# Production builds
eas build --profile production --platform all
```

### Local Builds

```bash
# Generate native projects
npx expo prebuild

# iOS Release (requires Xcode)
npx expo run:ios --configuration Release

# Android Release
npx expo run:android --variant release
```

## 🔄 CI/CD Pipeline

The project includes a comprehensive Jenkins pipeline (`Jenkinsfile`):

### Pipeline Stages

1. **Checkout** - Clone repository
2. **Setup** - Install dependencies, EAS CLI
3. **Code Quality** (parallel)
   - TypeScript check
   - ESLint
   - Security audit
4. **Test** - Run Jest with coverage
5. **Build** - EAS preview builds (conditional)
6. **Notify** - Slack/email notifications

### Jenkins Requirements

- Node.js 18 tool configured
- `expo-token` credentials
- Optional: Slack webhook for notifications

See [JENKINS_SETUP.md](JENKINS_SETUP.md) for detailed setup instructions.

## 🔐 Security Considerations

- **Secure Storage**: Tokens stored in device keychain (iOS) / keystore (Android)
- **Input Validation**: All user inputs sanitized before submission
- **Authentication**: JWT tokens with automatic refresh
- **API Security**: Authorization headers, request IDs, rate limiting
- **Error Masking**: Sensitive data masked in logs

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Run tests (`npm test`)
4. Run linting (`npm run lint:fix`)
5. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
6. Push to the branch (`git push origin feature/AmazingFeature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.

## 🙏 Acknowledgments

- [Expo](https://expo.dev/) - React Native framework & tooling
- [Apollo Client](https://www.apollographql.com/docs/react/) - GraphQL client
- [Zustand](https://github.com/pmndrs/zustand) - Lightweight state management
- [TanStack Query](https://tanstack.com/query) - Server state management
- [Sentry](https://sentry.io/) - Error tracking & monitoring
- [FontAwesome](https://fontawesome.com/) - Icon library
