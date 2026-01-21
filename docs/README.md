# E-Storefront Mobile Documentation

Comprehensive documentation for the E-Storefront Mobile application.

---

## 📑 Table of Contents

### Getting Started

| Document                            | Description                  |
| ----------------------------------- | ---------------------------- |
| [Quick Commands](QUICK-COMMANDS.md) | Common development commands  |
| [Environment](ENVIRONMENT.md)       | Environment variables config |
| [Build](BUILD.md)                   | Build instructions           |

### Architecture & API

| Document                        | Description                             |
| ------------------------------- | --------------------------------------- |
| [Architecture](ARCHITECTURE.md) | System architecture and design patterns |
| [API](API.md)                   | GraphQL API integration                 |

### Development

| Document                        | Description             |
| ------------------------------- | ----------------------- |
| [Testing](TESTING.md)           | Testing strategies      |
| [Contributing](CONTRIBUTING.md) | Contribution guidelines |

### Operations

| Document                    | Description              |
| --------------------------- | ------------------------ |
| [Deployment](DEPLOYMENT.md) | EAS Build & App Stores   |
| [CI-CD](CI-CD.md)           | GitHub Actions pipelines |
| [Security](SECURITY.md)     | Security policies        |
| [Release](RELEASE.md)       | Release process          |

### Reference

| Document                      | Description           |
| ----------------------------- | --------------------- |
| [Changelog](CHANGELOG.md)     | Version history       |
| [Technologies](technologies/) | Technology stack docs |

---

## 🔗 Production URLs

| Environment | URL                                 | Description      |
| ----------- | ----------------------------------- | ---------------- |
| API         | https://api.3asoftwares.com/graphql | GraphQL endpoint |
| Auth        | https://auth.3asoftwares.com        | Auth service     |
| Web         | https://shop.3asoftwares.com        | Web storefront   |

---

## 📁 Documentation Structure

```
docs/
├── README.md              # This file
├── ARCHITECTURE.md        # App architecture
├── API.md                 # API integration
├── BUILD.md               # Build instructions
├── CHANGELOG.md           # Version history
├── CI-CD.md               # CI/CD pipelines
├── CONTRIBUTING.md        # Contribution guide
├── DEPLOYMENT.md          # Deployment guide
├── ENVIRONMENT.md         # Environment config
├── QUICK-COMMANDS.md      # Common commands
├── RELEASE.md             # Release process
├── SECURITY.md            # Security policies
├── TESTING.md             # Testing guide
└── technologies/          # Technology documentation
    ├── README.md          # Tech stack overview
    ├── REACT_NATIVE.md    # React Native
    ├── EXPO.md            # Expo platform
    ├── EXPO_ROUTER.md     # Expo Router
    ├── TYPESCRIPT.md      # TypeScript
    ├── ZUSTAND.md         # State management
    ├── APOLLO_CLIENT.md   # GraphQL client
    ├── REACT_QUERY.md     # React Query
    ├── ASYNC_STORAGE.md   # Local storage
    ├── JEST.md            # Unit testing
    ├── TESTING_LIBRARY.md # Component testing
    ├── CYPRESS.md         # E2E testing
    ├── ESLINT_PRETTIER.md # Code quality
    ├── EAS_BUILD.md       # Cloud builds
    ├── METRO.md           # Bundler
    ├── FONTAWESOME.md     # Icons
    ├── STYLING.md         # Styling patterns
    └── COMPONENTS.md      # UI components
```

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Run on iOS simulator
npx expo run:ios

# Run on Android emulator
npx expo run:android

# Run tests
npm test
```

---

## 📱 App Distribution

| Platform | Store             | Status     |
| -------- | ----------------- | ---------- |
| iOS      | App Store         | Production |
| Android  | Google Play Store | Production |
| Web      | Expo Web          | Preview    |
