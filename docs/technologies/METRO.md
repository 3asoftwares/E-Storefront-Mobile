# Metro Bundler

## Overview

**Version:** 0.80.9  
**Website:** [https://facebook.github.io/metro](https://facebook.github.io/metro)  
**Category:** JavaScript Bundler

Metro is the JavaScript bundler for React Native, handling module resolution and bundling.

---

## Why Metro?

### Benefits

| Benefit              | Description                          |
| -------------------- | ------------------------------------ |
| **Fast Reload**      | Instant updates during development   |
| **Caching**          | Aggressive caching for fast rebuilds |
| **Tree Shaking**     | Removes unused code                  |
| **Platform Support** | Bundles for iOS, Android, and Web    |

---

## Configuration

### metro.config.js

```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add custom file extensions
config.resolver.sourceExts.push('cjs');

// Asset extensions
config.resolver.assetExts.push('db', 'mp3', 'ttf', 'otf');

module.exports = config;
```

---

## Commands

```bash
# Start Metro bundler
npx expo start

# Clear cache and start
npx expo start -c

# Bundle for production (iOS)
npx react-native bundle --platform ios --dev false --entry-file index.js --bundle-output ios/main.jsbundle

# Bundle for production (Android)
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle
```

---

## Troubleshooting

### Clear All Caches

```bash
# Clear Metro cache
npx expo start -c

# Clear all node_modules and reinstall
rm -rf node_modules
rm package-lock.json
npm install

# Reset Metro bundler
npx react-native start --reset-cache
```

### Common Issues

| Issue                  | Solution                        |
| ---------------------- | ------------------------------- |
| Module not found       | Clear cache and restart         |
| Duplicate dependencies | Check package.json versions     |
| Slow bundling          | Exclude node_modules from watch |

---

## Related Documentation

- [Expo](EXPO.md) - Expo platform
- [EAS Build](EAS_BUILD.md) - Production builds
