# Build Guide

Build configuration and commands for E-Storefront Mobile.

---

## 📑 Table of Contents

- [Overview](#overview)
- [Development Builds](#development-builds)
- [EAS Build](#eas-build)
- [Local Builds](#local-builds)
- [Build Profiles](#build-profiles)
- [Troubleshooting](#troubleshooting)

---

## 🌐 Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           BUILD PIPELINE                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Source Code                                                                 │
│       │                                                                      │
│       ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                       EAS BUILD                                      │   │
│  │                                                                      │   │
│  │  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐             │   │
│  │  │  Preview    │    │ Production  │    │   Web       │             │   │
│  │  │  (APK/IPA)  │    │ (AAB/IPA)   │    │  (Static)   │             │   │
│  │  └─────────────┘    └─────────────┘    └─────────────┘             │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│       │                      │                    │                         │
│       ▼                      ▼                    ▼                         │
│  Internal Testing      App Stores              Vercel                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Development Builds

### Start Development Server

```bash
# Start Expo development server
yarn start

# Platform-specific
yarn android    # Android emulator/device
yarn ios        # iOS simulator (macOS only)
yarn web        # Web browser
```

### Clear Cache

```bash
# Clear Metro bundler cache
yarn clean
# Runs: expo start --clear
```

### Expo Go (Quick Testing)

1. Install **Expo Go** app on your device
2. Run `yarn start`
3. Scan QR code with Expo Go

---

## ☁️ EAS Build

### Prerequisites

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Login to Expo account
eas login

# Configure project (first time)
eas build:configure
```

### Build Commands

```bash
# Preview build (for testing)
yarn build:android      # Android APK
yarn build:ios          # iOS Simulator/TestFlight
yarn build:all          # Both platforms

# Production build (for stores)
yarn build:production   # AAB (Android) + IPA (iOS)
```

### Build with Profile

```bash
# Use specific profile
eas build --platform android --profile preview
eas build --platform ios --profile production
eas build --platform all --profile production
```

---

## 📦 Local Builds

### Prebuild (Generate Native Projects)

```bash
# Generate android/ and ios/ folders
yarn prebuild
# Runs: expo prebuild

# Clean and regenerate
npx expo prebuild --clean
```

### Android Local Build

```bash
# Navigate to android folder
cd android

# Debug build
./gradlew assembleDebug

# Release build
./gradlew assembleRelease

# Output: android/app/build/outputs/apk/
```

### iOS Local Build (macOS only)

```bash
# Navigate to ios folder
cd ios

# Install CocoaPods
pod install

# Build with Xcode
xcodebuild -workspace MobileApp.xcworkspace \
  -scheme MobileApp \
  -configuration Release \
  -archivePath build/MobileApp.xcarchive archive
```

---

## ⚙️ Build Profiles

### EAS Configuration (`eas.json`)

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "simulator": true
      }
    },
    "production": {
      "distribution": "store",
      "android": {
        "buildType": "app-bundle"
      },
      "ios": {
        "resourceClass": "m-medium"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### Profile Comparison

| Profile       | Android Output | iOS Output | Distribution |
| ------------- | -------------- | ---------- | ------------ |
| `development` | APK            | IPA        | Internal     |
| `preview`     | APK            | Simulator  | Internal     |
| `production`  | AAB            | IPA        | Store        |

---

## 🌐 Web Build

### Export Static Web

```bash
# Build for web deployment
yarn web:build
# Runs: expo export --platform web

# Output: dist/ folder
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

---

## 🔐 Build Secrets

### Environment Variables

Set in EAS Dashboard or `.env`:

```bash
# API Configuration
EXPO_PUBLIC_GRAPHQL_API=https://api.example.com/graphql

# App Configuration
EXPO_PUBLIC_APP_NAME=E-Storefront
```

### EAS Secrets

```bash
# Set secret for builds
eas secret:create --name GOOGLE_SERVICES_JSON --value "$(cat google-services.json)"
eas secret:create --name GOOGLE_CLIENT_ID --value "your-client-id"

# List secrets
eas secret:list
```

---

## 📋 Build Checklist

### Before Building

- [ ] Update version in `app.json`
- [ ] Run tests: `yarn test`
- [ ] Run type check: `yarn typecheck`
- [ ] Run lint: `yarn lint`
- [ ] Test on development server

### For Production

- [ ] Increment version and build number
- [ ] Update changelog
- [ ] Configure signing credentials
- [ ] Set production environment variables
- [ ] Create git tag

---

## 🐛 Troubleshooting

### Common Issues

| Issue                  | Solution                                |
| ---------------------- | --------------------------------------- |
| Build fails with cache | `npx expo start --clear`                |
| Native modules error   | `npx expo prebuild --clean`             |
| EAS build timeout      | Upgrade EAS plan or reduce dependencies |
| iOS signing error      | Reconfigure in EAS Dashboard            |

### Debug Build

```bash
# Verbose build output
eas build --platform android --profile preview --verbose

# Check build logs
eas build:view
```

### Clean All Caches

```bash
# Clean everything
rm -rf node_modules
rm -rf android ios
yarn install
npx expo prebuild --clean
```

---

## Related Documentation

- [RELEASE.md](RELEASE.md) - Release and submission guide
- [CI-CD.md](CI-CD.md) - Automated builds
- [ENVIRONMENT.md](ENVIRONMENT.md) - Environment setup
