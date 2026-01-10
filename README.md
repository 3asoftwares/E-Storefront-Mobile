# 3A Storefront Mobile App

A production-ready, full-featured e-commerce mobile application built with **Expo SDK 51**, **React Native 0.74.5**, and **TypeScript**. This cross-platform app (iOS, Android, Web) provides a complete shopping experience with modern UI/UX patterns, robust state management, and enterprise-grade security.

---

## 📋 Quick Overview

| Aspect | Details |
|--------|---------|
| **App Name** | 3A Storefront |
| **Platform** | iOS, Android, Web |
| **Version** | 1.0.0 |
| **Tech Stack** | Expo 51 · React Native 0.74.5 · TypeScript 5.3 |
| **State** | Zustand + React Query |
| **API** | Apollo Client + GraphQL |

---

## 📚 Documentation

All detailed documentation is available in the [docs](./docs) folder:

| Document | Description |
|----------|-------------|
| [📖 Full README](./docs/README.md) | Complete application documentation with setup, features, API details |
| [🔧 Technology Stack](./docs/TECHNOLOGY_STACK.md) | Detailed breakdown of all technologies, why we use them, and how they help |
| [🏗️ Architecture](./docs/ARCHITECTURE.md) | Application architecture, data flow, component hierarchy, design patterns |
| [🚀 Jenkins CI/CD](./docs/JENKINS_CI_CD.md) | Complete Jenkins setup guide for automated builds and deployments |

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Run on platforms
# Press 'i' for iOS, 'a' for Android, 'w' for Web
```

---

## ✨ Key Features

### E-Commerce
- 🛍️ Product catalog with search & filters
- 🛒 Shopping cart with persistence
- ❤️ Wishlist functionality
- 📦 Order management
- 💳 Multi-step checkout
- 🏠 Address management

### Technical
- 📱 Cross-platform (iOS, Android, Web)
- 🔒 Secure authentication
- 📊 Analytics & monitoring
- 🧪 Comprehensive testing
- 🔄 CI/CD with Jenkins

---

## 🛠️ Tech Stack Highlights

| Category | Technologies |
|----------|--------------|
| **Framework** | Expo 51, React Native 0.74.5 |
| **Language** | TypeScript 5.3 |
| **Navigation** | Expo Router 3.5 |
| **State** | Zustand, TanStack React Query |
| **API** | Apollo Client, GraphQL |
| **UI** | StyleSheet, Linear Gradient, FontAwesome |
| **Storage** | AsyncStorage, Secure Store |
| **Testing** | Jest, Testing Library |
| **CI/CD** | Jenkins, EAS Build |

📖 See [Technology Stack](./docs/TECHNOLOGY_STACK.md) for detailed information.

---

## 📱 Available Commands

```bash
# Development
npm start           # Start Expo server
npm run android     # Run on Android
npm run ios         # Run on iOS
npm run web         # Run on Web

# Quality
npm run lint        # ESLint check
npm run typecheck   # TypeScript check
npm test            # Run tests

# Build
npm run build:android      # Build Android APK
npm run build:ios          # Build iOS IPA
npm run build:production   # Production builds
```

---

## 📁 Project Structure

```
E-Storefront-Mobile/
├── app/                    # Screens (Expo Router)
│   ├── (tabs)/             # Tab navigation
│   ├── product/            # Product screens
│   ├── orders/             # Order screens
│   └── *.tsx               # Other screens
├── src/
│   ├── components/         # UI components
│   ├── lib/                # API & hooks
│   ├── store/              # State management
│   ├── config/             # Configuration
│   ├── constants/          # Theme & constants
│   ├── utils/              # Utilities
│   └── __tests__/          # Tests
├── docs/                   # 📚 Documentation
│   ├── README.md           # Full documentation
│   ├── TECHNOLOGY_STACK.md # Technology details
│   ├── ARCHITECTURE.md     # Architecture guide
│   └── JENKINS_CI_CD.md    # CI/CD setup
├── assets/                 # Images & icons
├── Jenkinsfile             # CI/CD pipeline
└── [config files]          # Various configs
```

---

## 🔗 Links

- [Full Documentation](./docs/README.md)
- [Technology Stack](./docs/TECHNOLOGY_STACK.md)
- [Architecture Guide](./docs/ARCHITECTURE.md)
- [CI/CD Setup](./docs/JENKINS_CI_CD.md)

---

## 📄 License

MIT License - see [LICENSE](../../LICENSE) for details.

---

*Built with ❤️ using Expo & React Native*
