# E-Storefront Mobile Technology Stack

Comprehensive technology documentation for E-Storefront Mobile application.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   E-Storefront Mobile Technology Stack                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                        TARGET PLATFORMS                                │ │
│  ├────────────────────────────────────────────────────────────────────────┤ │
│  │       ┌────────────┐     ┌────────────┐     ┌────────────┐            │ │
│  │       │    iOS     │     │  Android   │     │    Web     │            │ │
│  │       │ iPhone/iPad│     │  Phones    │     │  Browser   │            │ │
│  │       └────────────┘     └────────────┘     └────────────┘            │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                      │                                       │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                       FRAMEWORK LAYER                                  │ │
│  ├────────────────────────────────────────────────────────────────────────┤ │
│  │   ┌─────────────────────────────────────────────────────────────────┐ │ │
│  │   │                    React Native 0.74.5                          │ │ │
│  │   │     Native Components │ Native Modules │ Bridge/JSI            │ │ │
│  │   └─────────────────────────────────────────────────────────────────┘ │ │
│  │   ┌──────────────────────┐  ┌──────────────────────────────────────┐  │ │
│  │   │   Expo SDK 51        │  │        TypeScript 5.3                │  │ │
│  │   │  Managed Workflow    │  │   Type Safety │ Interfaces          │  │ │
│  │   └──────────────────────┘  └──────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                      │                                       │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                         NAVIGATION                                     │ │
│  ├────────────────────────────────────────────────────────────────────────┤ │
│  │   ┌─────────────────────────────────────────────────────────────────┐ │ │
│  │   │              Expo Router 3.5.23 (File-Based Routing)            │ │ │
│  │   │     Tab Navigator │ Stack Navigator │ Deep Linking             │ │ │
│  │   └─────────────────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                      │                                       │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                       STATE MANAGEMENT                                 │ │
│  ├────────────────────────────────────────────────────────────────────────┤ │
│  │   ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐   │ │
│  │   │     Zustand      │  │   React Query    │  │   Apollo Client  │   │ │
│  │   │  Client State    │  │  Server State    │  │   GraphQL Data   │   │ │
│  │   └──────────────────┘  └──────────────────┘  └──────────────────┘   │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                      │                                       │
│                                      ▼                                       │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                           API LAYER                                    │ │
│  │                GraphQL Gateway (Apollo Federation)                     │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                       TESTING & QUALITY                                │ │
│  ├────────────────────────────────────────────────────────────────────────┤ │
│  │     Jest │ React Native Testing Library │ Cypress │ ESLint │ Prettier │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                         BUILD & DEPLOYMENT                             │ │
│  ├────────────────────────────────────────────────────────────────────────┤ │
│  │      EAS Build (iOS/Android) │ EAS Update (OTA) │ Expo Dev Client     │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Documentation Index

### Core Technologies

| Document                        | Version | Category   |
| ------------------------------- | ------- | ---------- |
| [React Native](REACT_NATIVE.md) | 0.74.5  | Framework  |
| [Expo](EXPO.md)                 | SDK 51  | Platform   |
| [TypeScript](TYPESCRIPT.md)     | 5.3     | Language   |
| [Expo Router](EXPO_ROUTER.md)   | 3.5.23  | Navigation |

### State Management

| Document                          | Version | Category       |
| --------------------------------- | ------- | -------------- |
| [Zustand](ZUSTAND.md)             | 4.5.2   | Client State   |
| [React Query](REACT_QUERY.md)     | 5.28.0  | Server State   |
| [Apollo Client](APOLLO_CLIENT.md) | 3.8.10  | GraphQL Client |
| [Async Storage](ASYNC_STORAGE.md) | 1.23.1  | Local Storage  |

### UI & Components

| Document                      | Version | Category   |
| ----------------------------- | ------- | ---------- |
| [Components](COMPONENTS.md)   | -       | UI Library |
| [FontAwesome](FONTAWESOME.md) | 7.1     | Icons      |
| [Styling](STYLING.md)         | -       | Styles     |

### Testing

| Document                                           | Version | Category     |
| -------------------------------------------------- | ------- | ------------ |
| [Jest](JEST.md)                                    | 29.7.0  | Unit Testing |
| [React Native Testing Library](TESTING_LIBRARY.md) | 12.4.3  | Component    |
| [Cypress](CYPRESS.md)                              | 13.6.0  | E2E (Web)    |

### Code Quality

| Document                                | Version | Category |
| --------------------------------------- | ------- | -------- |
| [ESLint & Prettier](ESLINT_PRETTIER.md) | 8.57    | Linting  |

### Build & Deployment

| Document                  | Category     |
| ------------------------- | ------------ |
| [EAS Build](EAS_BUILD.md) | Cloud Builds |
| [Metro](METRO.md)         | Bundler      |

---

## Quick Reference

### Package Versions

```json
{
  "dependencies": {
    "expo": "~51.0.28",
    "react": "18.2.0",
    "react-native": "0.74.5",
    "expo-router": "~3.5.23",
    "@apollo/client": "^3.8.10",
    "@tanstack/react-query": "^5.28.0",
    "zustand": "^4.5.2",
    "@react-native-async-storage/async-storage": "1.23.1",
    "@fortawesome/react-native-fontawesome": "^0.3.0"
  },
  "devDependencies": {
    "typescript": "~5.3.3",
    "jest": "^29.7.0",
    "@testing-library/react-native": "^12.4.3",
    "cypress": "^13.6.0",
    "eslint": "^8.57.0",
    "prettier": "^3.2.5"
  }
}
```

---

## Related Documentation

- [Main Documentation](../README.md)
- [Architecture](../ARCHITECTURE.md)
- [Testing Guide](../TESTING.md)
- [Deployment](../DEPLOYMENT.md)
