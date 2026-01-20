# Mobile App Environment Configuration

## 📑 Table of Contents

- [Overview](#overview)
- [Environment Files](#environment-files)
- [Variable Reference](#variable-reference)
- [EAS Environment](#eas-environment)

## 🌐 Overview

Expo uses `EXPO_PUBLIC_` prefix for client-side environment variables.

## 📁 Environment Files

### File Structure

```
E-Storefront-Mobile/
├── .env.example        # Template
├── .env.local          # Local development (git ignored)
├── .env.production     # Production defaults
└── eas.json            # EAS Build config
```

### .env.example

```env
# =================================
# E-STOREFRONT MOBILE CONFIG
# =================================

# API Configuration
EXPO_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
EXPO_PUBLIC_API_URL=http://localhost:4000

# App Configuration
EXPO_PUBLIC_APP_NAME=3A Storefront
EXPO_PUBLIC_APP_VERSION=1.0.0

# Feature Flags
EXPO_PUBLIC_ENABLE_ANALYTICS=false
EXPO_PUBLIC_DEBUG_MODE=true
```

## 📋 Variable Reference

### Required Variables

| Variable                  | Description          | Example                               |
| ------------------------- | -------------------- | ------------------------------------- |
| `EXPO_PUBLIC_GRAPHQL_URL` | GraphQL API endpoint | `https://api.3asoftwares.com/graphql` |
| `EXPO_PUBLIC_APP_NAME`    | App display name     | `3A Storefront`                       |

### Optional Variables

| Variable                       | Description       | Default |
| ------------------------------ | ----------------- | ------- |
| `EXPO_PUBLIC_API_URL`          | REST API endpoint | -       |
| `EXPO_PUBLIC_ENABLE_ANALYTICS` | Enable analytics  | `false` |
| `EXPO_PUBLIC_DEBUG_MODE`       | Debug mode        | `false` |

## 🔧 EAS Environment

### EAS Build Variables

Set in `eas.json` or EAS dashboard:

```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_GRAPHQL_URL": "https://api.3asoftwares.com/graphql",
        "EXPO_PUBLIC_ENABLE_ANALYTICS": "true"
      }
    }
  }
}
```

### Accessing Variables

```typescript
// In code
const apiUrl = process.env.EXPO_PUBLIC_GRAPHQL_URL;
```

---

See also:

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [ARCHITECTURE.md](./ARCHITECTURE.md) - App architecture
