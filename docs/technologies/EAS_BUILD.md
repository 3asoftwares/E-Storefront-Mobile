# EAS Build

## Overview

**Website:** [https://expo.dev/eas](https://expo.dev/eas)  
**Category:** Cloud Build Service

EAS Build is a hosted service for building app binaries for Expo and React Native projects.

---

## Why EAS Build?

### Benefits

| Benefit              | Description                                   |
| -------------------- | --------------------------------------------- |
| **No Local Setup**   | Build iOS apps without Mac                    |
| **Fast Builds**      | Optimized build infrastructure                |
| **Credentials**      | Managed signing and certificates              |
| **CI/CD Ready**      | Easy integration with CI/CD pipelines         |

---

## Configuration

### eas.json

```json
{
  "cli": {
    "version": ">= 5.9.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "ios": {
        "resourceClass": "m-medium"
      },
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "developer@3asoftwares.com",
        "ascAppId": "123456789"
      },
      "android": {
        "serviceAccountKeyPath": "./google-services.json"
      }
    }
  }
}
```

---

## Build Commands

```bash
# Build for development
eas build --profile development --platform ios
eas build --profile development --platform android

# Build for internal testing
eas build --profile preview --platform all

# Build for production
eas build --profile production --platform all

# Build and submit to stores
eas build --profile production --platform all --auto-submit
```

---

## Build Profiles

| Profile       | Purpose                    | Distribution |
| ------------- | -------------------------- | ------------ |
| development   | Dev client testing         | Internal     |
| preview       | QA and stakeholder testing | Internal     |
| production    | App store submission       | Store        |

---

## EAS Update (OTA)

```bash
# Publish update
eas update --branch production --message "Bug fixes"

# Update specific platform
eas update --branch production --platform ios

# Rollback (publish previous update)
eas update:republish --group <update-group-id>
```

---

## Submit to Stores

```bash
# Submit iOS to App Store
eas submit --platform ios

# Submit Android to Play Store
eas submit --platform android

# Submit latest build
eas submit --platform all --latest
```

---

## Related Documentation

- [Expo](EXPO.md) - Expo platform
- [Metro](METRO.md) - JavaScript bundler
