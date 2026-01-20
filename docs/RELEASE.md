# Release Guide

Release process and app store submission for E-Storefront Mobile.

---

## 📑 Table of Contents

- [Overview](#overview)
- [Version Management](#version-management)
- [Release Checklist](#release-checklist)
- [App Store Submission](#app-store-submission)
- [OTA Updates](#ota-updates)
- [Rollback](#rollback)

---

## 🌐 Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           RELEASE PIPELINE                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Development ──▶ Testing ──▶ Build ──▶ Submit ──▶ Review ──▶ Release       │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         DISTRIBUTION                                 │   │
│  │                                                                      │   │
│  │  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐             │   │
│  │  │  Internal   │    │  TestFlight │    │  Production │             │   │
│  │  │  Testing    │    │  / Beta     │    │  Stores     │             │   │
│  │  └─────────────┘    └─────────────┘    └─────────────┘             │   │
│  │       APK                Beta              AAB/IPA                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  OTA Updates (Expo Updates) ─────────────────────────────────▶ Users       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔢 Version Management

### Semantic Versioning

```
MAJOR.MINOR.PATCH
  │     │     │
  │     │     └── Bug fixes (1.0.1)
  │     └──────── New features (1.1.0)
  └────────────── Breaking changes (2.0.0)
```

### Version Files

#### `app.json`

```json
{
  "expo": {
    "name": "E-Storefront",
    "slug": "e-storefront-mobile",
    "version": "1.0.1",
    "ios": {
      "buildNumber": "10"
    },
    "android": {
      "versionCode": 10
    }
  }
}
```

#### `package.json`

```json
{
  "version": "1.0.1"
}
```

### Update Version

```bash
# Update version in app.json and package.json
# For patch release (1.0.0 → 1.0.1)
npm version patch

# For minor release (1.0.0 → 1.1.0)
npm version minor

# For major release (1.0.0 → 2.0.0)
npm version major

# Remember to increment buildNumber/versionCode manually!
```

---

## ✅ Release Checklist

### Pre-Release

- [ ] All tests passing: `yarn test`
- [ ] Type check passing: `yarn typecheck`
- [ ] Lint passing: `yarn lint`
- [ ] E2E tests passing: `yarn cy:web`
- [ ] Manual QA on both platforms
- [ ] Version bumped in `app.json` and `package.json`
- [ ] Build number incremented
- [ ] CHANGELOG.md updated
- [ ] Screenshots updated (if UI changed)

### Build

- [ ] Production build successful
- [ ] App size within limits
- [ ] All assets bundled correctly
- [ ] Environment variables set correctly

### Submission

- [ ] App metadata updated
- [ ] Privacy policy URL valid
- [ ] App permissions documented
- [ ] Release notes written

---

## 📱 App Store Submission

### Google Play Store (Android)

#### Build AAB

```bash
# Build production AAB
eas build --platform android --profile production
```

#### Submit to Play Store

```bash
# Automatic submission
yarn submit:android
# Runs: eas submit --platform android

# Manual: Download AAB and upload via Play Console
```

#### Play Console Setup

1. Go to [Google Play Console](https://play.google.com/console)
2. Create new app or select existing
3. Complete app listing (description, screenshots, etc.)
4. Upload AAB to Internal/Closed/Open testing or Production
5. Submit for review

### Apple App Store (iOS)

#### Build IPA

```bash
# Build production IPA
eas build --platform ios --profile production
```

#### Submit to App Store

```bash
# Automatic submission
yarn submit:ios
# Runs: eas submit --platform ios

# This uploads to TestFlight automatically
```

#### App Store Connect Setup

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Create new app or select existing
3. Configure app information
4. TestFlight → Select build → Add testers
5. App Store → Submit for review

---

## 🔄 OTA Updates

### Expo Updates (Over-the-Air)

Push JavaScript updates without app store review.

#### Configure Updates

```json
// app.json
{
  "expo": {
    "updates": {
      "url": "https://u.expo.dev/your-project-id",
      "fallbackToCacheTimeout": 0
    },
    "runtimeVersion": {
      "policy": "sdkVersion"
    }
  }
}
```

#### Push Update

```bash
# Push OTA update to production branch
yarn update
# Runs: eas update --branch production

# Push to specific branch
eas update --branch staging --message "Fix checkout bug"
```

#### Update Branches

| Branch       | Purpose          |
| ------------ | ---------------- |
| `production` | Live app users   |
| `staging`    | QA testing       |
| `preview`    | Internal testing |

### OTA Limitations

**Can Update:**

- JavaScript code
- Assets (images, fonts)
- Styles

**Cannot Update (Requires Store Release):**

- Native modules
- SDK version changes
- App permissions
- App icons/splash screens

---

## 🔙 Rollback

### OTA Rollback

```bash
# List recent updates
eas update:list

# Rollback to previous update
eas update:republish --group <previous-update-group-id>
```

### Store Rollback

#### Android

1. Go to Play Console → Release → Production
2. Click "Manage" on current release
3. Select "Pause rollout" or create new release with previous version

#### iOS

1. Go to App Store Connect → App → App Store
2. Remove current version from sale
3. Submit previous version for expedited review

---

## 📊 Release Monitoring

### Analytics

- Monitor crash reports (Sentry/Crashlytics)
- Track user adoption rate
- Monitor performance metrics
- Watch for error spikes

### Post-Release Checklist

- [ ] Monitor crash reports for 24 hours
- [ ] Check user reviews
- [ ] Verify OTA updates working
- [ ] Confirm analytics tracking
- [ ] Update team on release status

---

## 📝 Release Notes Template

```markdown
## What's New in v1.1.0

### 🚀 New Features

- Added wishlist functionality
- New product recommendations

### 🐛 Bug Fixes

- Fixed checkout crash on older devices
- Resolved login issues with Google

### 🔧 Improvements

- Faster app loading time
- Improved image caching

### 📱 Platform Specific

- **iOS**: Fixed keyboard overlap in forms
- **Android**: Improved back button handling
```

---

## Related Documentation

- [BUILD.md](BUILD.md) - Build configuration
- [CI-CD.md](CI-CD.md) - Automated releases
- [CHANGELOG.md](CHANGELOG.md) - Version history
