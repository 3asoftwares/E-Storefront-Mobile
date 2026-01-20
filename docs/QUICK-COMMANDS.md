# Quick Commands Reference

Essential commands for E-Storefront Mobile project.

---

## 🚀 Development

```bash
yarn install          # Install dependencies
yarn start            # Start Expo dev server
yarn android          # Run on Android
yarn ios              # Run on iOS
yarn web              # Run on web
yarn clean            # Clear cache and restart
```

---

## 🧪 Testing

```bash
yarn test             # Run unit tests
yarn test:coverage    # Run tests with coverage
yarn cy:run           # Run E2E tests
```

---

## ✅ Code Quality

```bash
yarn typecheck        # TypeScript check
yarn lint             # ESLint check
yarn lint:fix         # Auto-fix lint issues
yarn format           # Format with Prettier
```

---

## 🔨 Building

```bash
yarn web:build        # Build web app
yarn build:android    # Build Android APK (preview)
yarn build:ios        # Build iOS (preview)
yarn build:production # Build for production (both platforms)
```

---

## 🚢 Deployment

```bash
yarn update           # Push OTA update
yarn submit:android   # Submit to Google Play
yarn submit:ios       # Submit to App Store
```

---

## ☁️ EAS CLI

```bash
eas login                                         # Login to Expo
eas build --platform android --profile preview    # Preview APK
eas build --platform all --profile production     # Production build
eas update --branch production --message "msg"    # OTA update
eas submit --platform android                     # Submit to store
```

---

## 🔄 Git Workflow

```bash
git pull origin main                         # Pull latest
git checkout -b feature/name                 # Create branch
git add . && git commit -m "feat: message"   # Commit
git push -u origin feature/name              # Push branch
```

---

## 🦊 GitLab Push Commands

### Initial Setup

```bash
git remote add gitlab https://gitlab.com/username/repo.git   # Add GitLab remote
git remote -v                                                  # Verify remotes
```

### Push to GitLab

```bash
git push gitlab main                         # Push main to GitLab
git push gitlab --all                        # Push all branches
git push gitlab --tags                       # Push all tags
git push -u gitlab feature/name              # Push & track branch
git push gitlab main --force                 # Force push (use carefully)
```

### Mirror to GitLab

```bash
git push --mirror gitlab                     # Mirror entire repo
git remote set-url --push origin https://gitlab.com/username/repo.git  # Set push URL
```

### Push to Multiple Remotes

```bash
git remote set-url --add --push origin https://gitlab.com/username/repo.git  # Add GitLab as push target
git push origin --all                        # Push to all configured remotes
```

---

## 🦊 GitLab CLI (glab)

### Install

```bash
winget install --id GitLab.GLab    # Windows
brew install glab                   # macOS
glab auth login                     # Authenticate
```

### Merge Requests

```bash
glab mr create --fill              # Create MR
glab mr list                       # List MRs
glab mr checkout <mr-number>       # Checkout MR
glab mr merge <mr-number>          # Merge MR
```

### Pipelines

```bash
glab pipeline status               # View status
glab pipeline run                  # Trigger pipeline
glab ci trace                      # View job logs
```

---

## 🔧 Troubleshooting

```bash
yarn clean                         # Clear cache
rm -rf node_modules && yarn        # Reinstall deps
yarn start --reset-cache           # Reset Metro
npx expo-doctor                    # Check issues
```

---

## 📱 Device Testing

```bash
adb devices                        # List Android devices
adb install path/to/app.apk        # Install APK
```

---

## 🔗 Links

- **Expo Dashboard**: https://expo.dev/accounts/3asoftwares
- **EAS Builds**: https://expo.dev/accounts/3asoftwares/projects/3asoftwares/builds
