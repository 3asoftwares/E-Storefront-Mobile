# Expo

## Overview

**Version:** SDK 51  
**Website:** [https://expo.dev](https://expo.dev)  
**Category:** React Native Development Platform

Expo is a platform for making universal React Native apps that run on Android, iOS, and the web.

---

## Why Expo?

### Benefits

| Benefit              | Description                             |
| -------------------- | --------------------------------------- |
| **Managed Workflow** | No need to manage native code           |
| **Easy Setup**       | Start coding in minutes                 |
| **OTA Updates**      | Push updates without app store review   |
| **Cloud Builds**     | Build iOS/Android apps in the cloud     |
| **Dev Tools**        | Expo Go, Dev Client, debugging tools    |
| **Universal Apps**   | Same code runs on iOS, Android, and Web |

### Why We Chose Expo

1. **Simplified Development** - No Xcode/Android Studio required
2. **EAS Build** - Cloud builds for production apps
3. **EAS Update** - Over-the-air updates
4. **Expo Router** - File-based routing
5. **Expo Modules** - Easy native module integration

---

## Configuration

### app.json

```json
{
  "expo": {
    "name": "E-Storefront",
    "slug": "e-storefront-mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "scheme": "estorefront",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#3b82f6"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.3asoftwares.estorefront"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#3b82f6"
      },
      "package": "com.a3softwares.estorefront"
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/favicon.png"
    },
    "plugins": ["expo-router", "expo-secure-store"],
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

### eas.json

```json
{
  "cli": {
    "version": ">= 5.9.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
```

---

## Expo SDK Modules

### Common Modules Used

| Module               | Purpose                   |
| -------------------- | ------------------------- |
| expo-router          | File-based navigation     |
| expo-secure-store    | Secure token storage      |
| expo-image           | Optimized image component |
| expo-linear-gradient | Gradient backgrounds      |
| expo-font            | Custom fonts              |
| expo-splash-screen   | Splash screen control     |
| expo-status-bar      | Status bar styling        |

### Secure Store

```tsx
import * as SecureStore from 'expo-secure-store';

// Store token securely
async function saveToken(token: string) {
  await SecureStore.setItemAsync('auth_token', token);
}

// Retrieve token
async function getToken() {
  return await SecureStore.getItemAsync('auth_token');
}

// Delete token (logout)
async function deleteToken() {
  await SecureStore.deleteItemAsync('auth_token');
}
```

### Linear Gradient

```tsx
import { LinearGradient } from 'expo-linear-gradient';

function GradientHeader() {
  return (
    <LinearGradient
      colors={['#3b82f6', '#6366f1']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}
    >
      <Text style={styles.title}>E-Storefront</Text>
    </LinearGradient>
  );
}
```

### Image

```tsx
import { Image } from 'expo-image';

function ProductImage({ uri }: { uri: string }) {
  return (
    <Image
      source={uri}
      style={styles.image}
      contentFit="cover"
      placeholder={blurhash}
      transition={200}
    />
  );
}
```

---

## Development Commands

```bash
# Start development server
npx expo start

# Start with cache clear
npx expo start -c

# Run on iOS simulator
npx expo run:ios

# Run on Android emulator
npx expo run:android

# Run on web
npx expo start --web

# Install Expo module
npx expo install expo-image

# Prebuild native code
npx expo prebuild

# Check for Expo SDK updates
npx expo-doctor
```

---

## EAS Services

### EAS Build

```bash
# Build for development
eas build --profile development --platform all

# Build for preview (internal testing)
eas build --profile preview --platform all

# Build for production
eas build --profile production --platform all
```

### EAS Update

```bash
# Publish update to all users
eas update --branch production

# Publish update with message
eas update --branch production --message "Bug fixes"
```

### EAS Submit

```bash
# Submit iOS build to App Store
eas submit --platform ios

# Submit Android build to Play Store
eas submit --platform android
```

---

## Related Documentation

- [React Native](REACT_NATIVE.md) - React Native basics
- [Expo Router](EXPO_ROUTER.md) - File-based routing
- [EAS Build](EAS_BUILD.md) - Cloud builds
- [TypeScript](TYPESCRIPT.md) - Type safety
