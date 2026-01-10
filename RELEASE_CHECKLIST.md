# 🚀 Release Checklist for 3A Storefront Mobile App

Use this checklist before every release to ensure quality and compliance.

---

## 📋 Pre-Release Checklist

### Code Quality
- [ ] All tests pass (`npm test`)
- [ ] No TypeScript errors (`npm run typecheck`)
- [ ] No ESLint warnings (`npm run lint`)
- [ ] Code reviewed and approved
- [ ] All console.log statements removed (except error logging)

### Functionality Testing
- [ ] Test on Android physical device
- [ ] Test on iOS physical device (or simulator)
- [ ] Test all critical user flows:
  - [ ] User registration
  - [ ] User login/logout
  - [ ] Browse products
  - [ ] Search functionality
  - [ ] Add to cart
  - [ ] Checkout process
  - [ ] Order history
  - [ ] Profile management
- [ ] Test offline behavior
- [ ] Test deep links

### Performance
- [ ] App launches in < 3 seconds
- [ ] Smooth scrolling (60 FPS)
- [ ] No memory leaks detected
- [ ] Images are optimized
- [ ] Bundle size is acceptable

### Security
- [ ] No sensitive data in logs
- [ ] API keys are environment variables
- [ ] Authentication tokens stored securely
- [ ] SSL/TLS enabled for all API calls
- [ ] Input validation implemented

---

## 📱 App Store Requirements

### Both Platforms
- [ ] App icon (1024x1024 PNG)
- [ ] Splash screen configured
- [ ] Privacy Policy URL
- [ ] Terms of Service URL
- [ ] Support email/URL
- [ ] App description (short & long)
- [ ] Keywords/tags
- [ ] Screenshots for all required sizes

### Google Play Store
- [ ] Feature graphic (1024x500)
- [ ] Content rating questionnaire completed
- [ ] Data safety form completed
- [ ] Target API level meets requirements (API 33+)
- [ ] 64-bit support enabled

### Apple App Store
- [ ] App Preview video (optional)
- [ ] Screenshots for all device sizes:
  - [ ] iPhone 6.5" (1242 x 2688)
  - [ ] iPhone 5.5" (1242 x 2208)
  - [ ] iPad Pro 12.9" (2048 x 2732) if supporting tablets
- [ ] Age rating questionnaire
- [ ] App Privacy details configured
- [ ] Export compliance information

---

## 🔄 Version Management

### Before Release
- [ ] Update version in `app.json`
  ```json
  "version": "1.0.0"  // Semantic versioning
  ```
- [ ] Update version in `package.json`
- [ ] Create git tag: `git tag v1.0.0`
- [ ] Update CHANGELOG.md

### Version Guidelines
- **Major (X.0.0)**: Breaking changes, major features
- **Minor (0.X.0)**: New features, backward compatible
- **Patch (0.0.X)**: Bug fixes, small improvements

---

## 🏗️ Build Commands

```bash
# Development build (APK for testing)
eas build --platform android --profile development

# Preview build (internal testing)
eas build --platform android --profile preview
eas build --platform ios --profile preview

# Production build (app stores)
eas build --platform android --profile production
eas build --platform ios --profile production

# Build both platforms
eas build --platform all --profile production
```

---

## 📤 Submission Commands

```bash
# Submit to Google Play
eas submit --platform android --profile production

# Submit to Apple App Store
eas submit --platform ios --profile production
```

---

## 🔍 Post-Release

- [ ] Monitor crash reports (Sentry)
- [ ] Check analytics for issues
- [ ] Monitor app store reviews
- [ ] Prepare hotfix plan if needed
- [ ] Update documentation
- [ ] Announce release to team/users

---

## 📞 Emergency Contacts

| Role | Contact |
|------|---------|
| Lead Developer | [name@email.com] |
| Project Manager | [name@email.com] |
| DevOps | [name@email.com] |

---

## 📝 Release Notes Template

```markdown
## Version X.X.X (Date)

### New Features
- Feature 1
- Feature 2

### Improvements
- Improvement 1

### Bug Fixes
- Fixed issue with...

### Known Issues
- Issue 1 (workaround: ...)
```
