# E-Storefront Mobile

[![React Native](https://img.shields.io/badge/React_Native-0.74.5-blue?logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK_51-000020?logo=expo)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Customer-facing mobile e-commerce application built with **React Native** and **Expo**, featuring cross-platform support for iOS, Android, and Web.

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Testing](#-testing)
- [Building & Deployment](#-building--deployment)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

| Feature               | Description                                       |
| --------------------- | ------------------------------------------------- |
| 🛒 **Shopping Cart**  | Add, update, remove items with persistent storage |
| ❤️ **Wishlist**       | Save favorite products                            |
| 🔍 **Product Search** | Search with filters and categories                |
| 📦 **Order Tracking** | Real-time order status updates                    |
| 👤 **User Profile**   | Account management and settings                   |
| 📍 **Addresses**      | Multiple shipping address management              |
| 🔐 **Authentication** | Secure login with JWT tokens                      |
| 📱 **Cross-Platform** | iOS, Android, and Web support                     |

## 🛠️ Tech Stack

### Core

| Technology   | Version | Purpose                         |
| ------------ | ------- | ------------------------------- |
| React Native | 0.74.5  | Cross-platform mobile framework |
| Expo         | SDK 51  | Development platform & tooling  |
| TypeScript   | 5.0+    | Type safety                     |
| Expo Router  | 3.5     | File-based routing              |

### State & Data

| Technology        | Purpose                  |
| ----------------- | ------------------------ |
| Zustand           | Client state management  |
| Apollo Client     | GraphQL data fetching    |
| TanStack Query    | Server state & caching   |
| Async Storage     | Persistent local storage |
| Expo Secure Store | Secure token storage     |

### UI & Styling

| Technology           | Purpose              |
| -------------------- | -------------------- |
| React Native         | Native components    |
| Expo Linear Gradient | Gradient backgrounds |
| FontAwesome          | Icon library         |
| React Native SVG     | SVG support          |

### Testing & Build

| Technology | Purpose                      |
| ---------- | ---------------------------- |
| Jest       | Unit testing                 |
| Cypress    | E2E testing (web)            |
| EAS Build  | Cloud builds for iOS/Android |
| EAS Update | Over-the-air updates         |

## 🎨 Technology Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   E-Storefront Mobile Technology Stack                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                        TARGET PLATFORMS                                │ │
│  ├────────────────────────────────────────────────────────────────────────┤ │
│  │      ┌──────────┐        ┌──────────┐        ┌──────────┐             │ │
│  │      │   iOS    │        │ Android  │        │   Web    │             │ │
│  │      │  iPhone  │        │  Phone   │        │ Browser  │             │ │
│  │      │   iPad   │        │  Tablet  │        │  PWA     │             │ │
│  │      └──────────┘        └──────────┘        └──────────┘             │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                      │                                       │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                         CORE FRAMEWORK                                 │ │
│  ├────────────────────────────────────────────────────────────────────────┤ │
│  │                                                                        │ │
│  │   ┌────────────────────────────────────────────────────────────────┐  │ │
│  │   │                   React Native 0.74.5                          │  │ │
│  │   │              Cross-Platform Native Components                  │  │ │
│  │   └────────────────────────────────────────────────────────────────┘  │ │
│  │                                                                        │ │
│  │   ┌─────────────────────┐  ┌─────────────────────────────────────┐   │ │
│  │   │     Expo SDK 51     │  │         TypeScript 5.x              │   │ │
│  │   │  Managed Workflow   │  │     Type Safety & Interfaces        │   │ │
│  │   └─────────────────────┘  └─────────────────────────────────────┘   │ │
│  │                                                                        │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                      │                                       │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                          NAVIGATION                                    │ │
│  ├────────────────────────────────────────────────────────────────────────┤ │
│  │   ┌────────────────────────────────────────────────────────────────┐  │ │
│  │   │                    Expo Router 3.5                             │  │ │
│  │   │       File-Based Routing │ Deep Linking │ Tab Navigation      │  │ │
│  │   └────────────────────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                      │                                       │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                     STATE & DATA MANAGEMENT                            │ │
│  ├────────────────────────────────────────────────────────────────────────┤ │
│  │                                                                        │ │
│  │   ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐   │ │
│  │   │   Zustand    │  │ React Query  │  │     Apollo Client        │   │ │
│  │   │ Client State │  │ Server State │  │    GraphQL Queries       │   │ │
│  │   └──────────────┘  └──────────────┘  └──────────────────────────┘   │ │
│  │                                                                        │ │
│  │   ┌──────────────────────────┐  ┌──────────────────────────────────┐ │ │
│  │   │   Expo Secure Store      │  │      Async Storage              │ │ │
│  │   │  Tokens & Secrets        │  │    Persistent Data              │ │ │
│  │   └──────────────────────────┘  └──────────────────────────────────┘ │ │
│  │                                                                        │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                      │                                       │
│                                      ▼                                       │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                           API LAYER                                    │ │
│  │                GraphQL Gateway (Apollo Federation)                     │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                      BUILD & DEPLOYMENT                                │ │
│  ├────────────────────────────────────────────────────────────────────────┤ │
│  │       EAS Build (Cloud) │ EAS Update (OTA) │ App Store │ Play Store   │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

For detailed technology documentation, see [E-Storefront/docs/technologies](../E-Storefront/docs/technologies/).

## 📱 Supported Platforms

| Platform | Status       |
| -------- | ------------ |
| iOS      | ✅ Supported |
| Android  | ✅ Supported |
| Web      | ✅ Supported |

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20+
- **npm** 10+ or **Yarn** 1.22+
- **Expo CLI**: `npm install -g expo-cli`
- **EAS CLI**: `npm install -g eas-cli`
- **iOS**: Xcode (Mac only)
- **Android**: Android Studio + SDK

### Installation

```bash
# Clone repository
git clone https://github.com/3asoftwares/E-Storefront-Mobile.git
cd E-Storefront-Mobile

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local

# Start development server
npm start
```

### Environment Setup

Create `.env.local`:

```env
EXPO_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
EXPO_PUBLIC_APP_NAME=3A Storefront
```

### Running the App

```bash
# Start Expo dev server
npm start

# Run on iOS Simulator
npm run ios

# Run on Android Emulator
npm run android

# Run on Web
npm run web
```

## 📁 Project Structure

```
E-Storefront-Mobile/
├── app/                          # Expo Router pages
│   ├── _layout.tsx              # Root layout
│   ├── (tabs)/                  # Tab navigation
│   │   ├── _layout.tsx          # Tab bar layout
│   │   ├── index.tsx            # Home tab
│   │   ├── categories.tsx       # Categories tab
│   │   ├── cart.tsx             # Cart tab
│   │   └── profile.tsx          # Profile tab
│   ├── product/                 # Product screens
│   │   └── [id].tsx             # Product detail
│   ├── orders/                  # Order screens
│   │   ├── index.tsx            # Order list
│   │   └── [id].tsx             # Order detail
│   ├── login.tsx                # Login screen
│   ├── signup.tsx               # Signup screen
│   ├── checkout.tsx             # Checkout flow
│   ├── search.tsx               # Search screen
│   └── settings.tsx             # Settings screen
├── src/                         # Source code
│   ├── components/              # Reusable components
│   ├── store/                   # Zustand stores
│   ├── lib/                     # Utilities & Apollo
│   ├── constants/               # App constants
│   └── config/                  # Configuration
├── assets/                      # Images, fonts
├── docs/                        # Documentation
├── app.json                     # Expo config
├── eas.json                     # EAS Build config
└── package.json
```

## 💻 Development

### Available Scripts

| Command             | Description             |
| ------------------- | ----------------------- |
| `npm start`         | Start Expo dev server   |
| `npm run ios`       | Run on iOS Simulator    |
| `npm run android`   | Run on Android Emulator |
| `npm run web`       | Run on Web browser      |
| `npm run clean`     | Clear cache and restart |
| `npm run lint`      | Run ESLint              |
| `npm run lint:fix`  | Fix lint issues         |
| `npm run typecheck` | TypeScript type check   |
| `npm run format`    | Format with Prettier    |

### Pre-PR Checklist

```bash
# Quick validation
npm run format && npm run lint:fix && npm run typecheck && npm run test
```

## 🧪 Testing

### Unit Tests (Jest)

```bash
# Run all tests
npm run test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

### E2E Tests (Cypress - Web)

```bash
# Open Cypress UI
npm run cy:open

# Run headless
npm run cy:run

# Run with web server
npm run cy:web
```

## 🚀 Building & Deployment

### Development Builds

```bash
# Android APK (preview)
npm run build:android

# iOS (preview)
npm run build:ios

# Both platforms
npm run build:all
```

### Production Builds

```bash
# Production builds for both platforms
npm run build:production
```

### App Store Submission

```bash
# Submit to Google Play
npm run submit:android

# Submit to App Store
npm run submit:ios
```

### Over-the-Air Updates

```bash
# Push OTA update
npm run update
```

## 📚 Documentation

All documentation is located in the [`docs/`](docs/) folder:

### Core Documentation

| Document                                | Description        |
| --------------------------------------- | ------------------ |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | App architecture   |
| [TESTING.md](docs/TESTING.md)           | Testing guide      |
| [DEPLOYMENT.md](docs/DEPLOYMENT.md)     | Build & deploy     |
| [ENVIRONMENT.md](docs/ENVIRONMENT.md)   | Environment config |
| [CI-CD.md](docs/CI-CD.md)               | CI/CD pipeline     |
| [SECURITY.md](docs/SECURITY.md)         | Security practices |

### Technology Guides

| Document                                             | Description         |
| ---------------------------------------------------- | ------------------- |
| [REACT_NATIVE.md](docs/technologies/REACT_NATIVE.md) | React Native 0.74.5 |
| [EXPO.md](docs/technologies/EXPO.md)                 | Expo SDK 51         |
| [EXPO_ROUTER.md](docs/technologies/EXPO_ROUTER.md)   | Expo Router 3.5     |

### Additional Documentation

| Document                                | Description             |
| --------------------------------------- | ----------------------- |
| [CONTRIBUTING.md](docs/CONTRIBUTING.md) | Contribution guidelines |
| [CHANGELOG.md](docs/CHANGELOG.md)       | Version history         |

## 🤝 Contributing

Please read [CONTRIBUTING.md](docs/CONTRIBUTING.md) for development workflow and PR process.

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">
  Made with ❤️ by <a href="https://3asoftwares.com">3A Softwares</a>
</p>
