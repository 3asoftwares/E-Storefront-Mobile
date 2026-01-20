# CI/CD Pipeline - E-Storefront Mobile

## 📑 Table of Contents

- [Overview](#overview)
- [Pipeline Architecture](#pipeline-architecture)
- [GitHub Actions Workflows](#github-actions-workflows)
- [EAS Build Integration](#eas-build-integration)
- [Secrets Configuration](#secrets-configuration)

## 🌐 Overview

E-Storefront Mobile uses **GitHub Actions** for CI and **EAS (Expo Application Services)** for builds and deployments.

| Workflow         | Trigger          | Purpose                |
| ---------------- | ---------------- | ---------------------- |
| `ci.yml`         | Push/PR to main  | Lint, type-check, test |
| `eas-build.yml`  | Tag push, manual | Build iOS/Android apps |
| `eas-update.yml` | Push to main     | OTA updates            |

## 🏗️ Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CI/CD PIPELINE                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                  │
│  │  PR Created  │    │   Install    │    │   Quality    │                  │
│  │  or Updated  │───▶│   & Cache    │───▶│   Checks     │                  │
│  └──────────────┘    └──────────────┘    └──────────────┘                  │
│                                                  │                          │
│                                  ┌───────────────┼───────────────┐          │
│                                  ▼               ▼               ▼          │
│                          ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│                          │  TypeCheck  │ │    Lint     │ │    Test     │   │
│                          └─────────────┘ └─────────────┘ └─────────────┘   │
│                                                  │                          │
│                                                  ▼                          │
│                                     ┌─────────────────────┐                 │
│                                     │   Merge to Main     │                 │
│                                     └──────────┬──────────┘                 │
│                                                │                            │
│              ┌─────────────────────────────────┼─────────────────────────┐  │
│              ▼                                 ▼                         ▼  │
│  ┌───────────────────┐           ┌───────────────────┐    ┌─────────────┐  │
│  │    EAS Update     │           │    EAS Build      │    │   Manual    │  │
│  │  (OTA Updates)    │           │  (Tag v*.*.*)     │    │   Trigger   │  │
│  └───────────────────┘           └───────────────────┘    └─────────────┘  │
│                                           │                                 │
│                              ┌────────────┼────────────┐                   │
│                              ▼                         ▼                   │
│                   ┌───────────────────┐     ┌───────────────────┐          │
│                   │   Android Build   │     │    iOS Build      │          │
│                   │   (.apk / .aab)   │     │   (.ipa)          │          │
│                   └─────────┬─────────┘     └─────────┬─────────┘          │
│                             │                         │                     │
│                             ▼                         ▼                     │
│                   ┌───────────────────┐     ┌───────────────────┐          │
│                   │   Google Play     │     │    App Store      │          │
│                   │   (EAS Submit)    │     │   (EAS Submit)    │          │
│                   └───────────────────┘     └───────────────────┘          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 🔄 GitHub Actions Workflows

### CI Pipeline (`ci.yml`)

Runs on every PR and push to main:

```yaml
name: CI/CD Pipeline

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]
    tags:
      - 'v*.*.*'

jobs:
  install:
    # Install and cache dependencies

  typecheck:
    needs: install
    # Run TypeScript type checking

  lint:
    needs: install
    # Run ESLint

  test:
    needs: [typecheck, lint]
    # Run Jest tests with coverage

  e2e:
    needs: [typecheck, lint]
    # Run Cypress E2E tests (web)
```

### EAS Build Workflow (`eas-build.yml`)

Triggers native builds:

```yaml
name: EAS Build

on:
  push:
    tags:
      - 'v*.*.*'
  workflow_dispatch:
    inputs:
      platform:
        type: choice
        options: [android, ios, all]
      profile:
        type: choice
        options: [preview, production]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - run: eas build --platform ${{ inputs.platform }} --profile ${{ inputs.profile }} --non-interactive
```

### EAS Update Workflow (`eas-update.yml`)

Pushes OTA updates:

```yaml
name: EAS Update

on:
  push:
    branches: [main]
    paths:
      - 'app/**'
      - 'src/**'
      - 'assets/**'

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - run: eas update --branch production --message "${{ github.event.head_commit.message }}"
```

## 📱 EAS Build Integration

### Build Profiles

```json
// eas.json
{
  "cli": {
    "version": ">= 10.0.0"
  },
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
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json"
      },
      "ios": {
        "ascApiKeyPath": "./asc-api-key.json"
      }
    }
  }
}
```

### Build Commands

| Command                                          | Description             |
| ------------------------------------------------ | ----------------------- |
| `eas build --platform android --profile preview` | Android APK for testing |
| `eas build --platform ios --profile preview`     | iOS simulator build     |
| `eas build --platform all --profile production`  | Store builds            |
| `eas submit --platform android`                  | Submit to Google Play   |
| `eas submit --platform ios`                      | Submit to App Store     |

## 🔐 Secrets Configuration

### GitHub Secrets

| Secret          | Description          |
| --------------- | -------------------- |
| `EXPO_TOKEN`    | Expo access token    |
| `CODECOV_TOKEN` | Codecov upload token |

### EAS Secrets (set via `eas secret`)

| Secret                       | Description               |
| ---------------------------- | ------------------------- |
| `GOOGLE_SERVICES_JSON`       | Firebase Android config   |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | Google Play API key       |
| `APPLE_API_KEY`              | App Store Connect API key |

### Setting Secrets

```bash
# Expo/EAS
eas secret:create --name GOOGLE_SERVICES_JSON --value "$(cat google-services.json)"

# GitHub (via CLI)
gh secret set EXPO_TOKEN --body "your-token"
```

## ✅ Pre-Merge Checklist

Before merging to main:

- [ ] All CI checks pass (typecheck, lint, test)
- [ ] Coverage requirements met
- [ ] No security vulnerabilities
- [ ] E2E tests pass (if applicable)
- [ ] Code reviewed

---

See also:

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [TESTING.md](./TESTING.md) - Testing guide
