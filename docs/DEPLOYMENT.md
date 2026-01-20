# Mobile App Deployment Guide

## 📑 Table of Contents

- [Overview](#overview)
- [EAS Build](#eas-build)
- [App Store Submission](#app-store-submission)
- [OTA Updates](#ota-updates)
- [CI/CD Pipeline](#cicd-pipeline)

## 🌐 Overview

E-Storefront Mobile uses **EAS (Expo Application Services)** for building and deploying.

| Service    | Purpose                      |
| ---------- | ---------------------------- |
| EAS Build  | Cloud builds for iOS/Android |
| EAS Submit | App store submissions        |
| EAS Update | Over-the-air updates         |

## 🔨 EAS Build

### Build Profiles

```json
// eas.json
{
  "build": {
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
        "distribution": "store"
      }
    }
  }
}
```

### Build Commands

```bash
# Preview builds (internal testing)
npm run build:android     # Android APK
npm run build:ios         # iOS Simulator

# Production builds (store-ready)
npm run build:production  # Both platforms

# Manual EAS commands
eas build --platform android --profile preview
eas build --platform ios --profile production
```

### Build Status

Check build status at: https://expo.dev/accounts/3asoftwares/projects/mobile-app/builds

## 📱 App Store Submission

### Google Play Store

```bash
# Submit to Google Play
npm run submit:android
# or
eas submit --platform android
```

**Requirements:**

- Google Play Console account
- Service account JSON key
- App Bundle (.aab) from production build

### Apple App Store

```bash
# Submit to App Store
npm run submit:ios
# or
eas submit --platform ios
```

**Requirements:**

- Apple Developer account
- App Store Connect API key
- IPA from production build

## 📡 OTA Updates

Push updates without app store review:

```bash
# Push update to production
npm run update
# or
eas update --branch production --message "Bug fix"
```

### Update Branches

| Branch     | Purpose          |
| ---------- | ---------------- |
| production | Live app updates |
| staging    | Testing updates  |
| preview    | Internal testing |

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/build.yml
name: Build

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - run: npm ci
      - run: eas build --platform all --profile production --non-interactive
```

### Required Secrets

| Secret                       | Description                 |
| ---------------------------- | --------------------------- |
| `EXPO_TOKEN`                 | Expo access token           |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | Google Play service account |
| `APPLE_API_KEY`              | App Store Connect API key   |

---

See also:

- [ENVIRONMENT.md](./ENVIRONMENT.md) - Environment config
- [TESTING.md](./TESTING.md) - Testing guide
