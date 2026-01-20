# Contributing to E-Storefront Mobile

Thank you for your interest in contributing! This document provides guidelines for contributing to the E-Storefront Mobile application.

## 📑 Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pre-PR Checklist](#pre-pr-checklist)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- Expo CLI: `npm install -g expo-cli`
- EAS CLI: `npm install -g eas-cli`
- iOS: Xcode (Mac only)
- Android: Android Studio

### Setup

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/E-Storefront-Mobile.git
cd E-Storefront-Mobile

# 2. Add upstream
git remote add upstream https://github.com/3asoftwares/E-Storefront-Mobile.git

# 3. Install dependencies
npm install

# 4. Set up environment
cp .env.example .env.local

# 5. Start development
npm start
```

## 🔄 Development Workflow

### 1. Sync with Upstream

```bash
git fetch upstream
git checkout main
git merge upstream/main
```

### 2. Create Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 3. Make Changes

- Write clean code following standards
- Add tests for new features
- Update documentation if needed

### 4. Test on Multiple Platforms

```bash
# Test on iOS
npm run ios

# Test on Android
npm run android

# Test on Web
npm run web
```

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

## ✅ Pre-PR Checklist

Run these commands before creating a PR:

```bash
# Step 1: Format code
npm run format

# Step 2: Fix lint issues
npm run lint:fix

# Step 3: Verify no lint errors
npm run lint

# Step 4: Type check
npm run typecheck

# Step 5: Run tests
npm run test

# Step 6: Test on device/simulator
npm run ios  # or android
```

### Quick Validation

```bash
npm run format && npm run lint:fix && npm run lint && npm run typecheck && npm run test && echo "✅ Ready for PR!"
```

### Checklist

- [ ] Code formatted with Prettier
- [ ] No ESLint errors
- [ ] TypeScript compiles without errors
- [ ] All tests pass
- [ ] Tested on iOS/Android
- [ ] New features have tests
- [ ] Documentation updated

## 📝 Coding Standards

### File Naming

| Type       | Convention          | Example             |
| ---------- | ------------------- | ------------------- |
| Components | PascalCase          | `ProductCard.tsx`   |
| Screens    | PascalCase          | `ProductDetail.tsx` |
| Hooks      | camelCase + 'use'   | `useCart.ts`        |
| Stores     | camelCase + 'Store' | `cartStore.ts`      |
| Utils      | camelCase           | `formatPrice.ts`    |
| Types      | PascalCase          | `Product.types.ts`  |

### Component Structure

```tsx
// 1. Imports
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useCartStore } from '@/store/cartStore';

// 2. Types
interface ProductCardProps {
  product: Product;
  onPress?: () => void;
}

// 3. Component
export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  // Hooks
  const addToCart = useCartStore((state) => state.addItem);

  // Callbacks
  const handleAddToCart = useCallback(() => {
    addToCart(product);
  }, [product, addToCart]);

  // Render
  return (
    <View style={styles.container}>
      <Text>{product.name}</Text>
    </View>
  );
};

// 4. Styles
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
```

## 📋 Commit Guidelines

### Format

```
<type>(<scope>): <description>
```

### Types

| Type       | Description   |
| ---------- | ------------- |
| `feat`     | New feature   |
| `fix`      | Bug fix       |
| `docs`     | Documentation |
| `style`    | Code style    |
| `refactor` | Refactoring   |
| `test`     | Tests         |
| `chore`    | Build/tooling |

### Examples

```bash
git commit -m "feat(cart): add quantity selector"
git commit -m "fix(auth): resolve token refresh issue"
git commit -m "docs(readme): update installation steps"
```

## 🏷️ Branch Naming

```
<type>/<ticket-id>-<description>
```

Examples:

- `feature/ECOM-123-add-wishlist`
- `fix/ECOM-456-cart-sync-issue`

---

Thank you for contributing! 🎉
