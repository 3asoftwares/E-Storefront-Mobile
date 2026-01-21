# Jest

## Overview

**Version:** 29.7.0  
**Website:** [https://jestjs.io](https://jestjs.io)  
**Category:** Testing Framework

Jest is a delightful JavaScript Testing Framework with a focus on simplicity.

---

## Why Jest?

### Benefits

| Benefit              | Description                      |
| -------------------- | -------------------------------- |
| **Zero Config**      | Works out of the box with Expo   |
| **Snapshot Testing** | Easy UI snapshot testing         |
| **Code Coverage**    | Built-in coverage reporting      |
| **Mocking**          | Powerful mocking capabilities    |
| **Watch Mode**       | Fast feedback during development |

---

## Configuration

### jest.config.js

```javascript
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['./jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: ['src/**/*.{ts,tsx}', 'app/**/*.{ts,tsx}', '!**/*.d.ts'],
};
```

### jest.setup.js

```javascript
import '@testing-library/react-native/extend-expect';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock SecureStore
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  Link: 'Link',
}));
```

---

## Writing Tests

### Component Test

```typescript
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ProductCard } from '@/components/ProductCard';

const mockProduct = {
  id: '1',
  name: 'Test Product',
  price: 29.99,
  images: ['https://example.com/image.jpg'],
};

describe('ProductCard', () => {
  it('renders product name and price', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Test Product')).toBeTruthy();
    expect(screen.getByText('$29.99')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    render(<ProductCard product={mockProduct} onPress={onPress} />);

    fireEvent.press(screen.getByText('Test Product'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

### Hook Test

```typescript
import { renderHook, act } from '@testing-library/react-native';
import { useCartStore } from '@/store/cartStore';

describe('useCartStore', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it('adds item to cart', () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addItem({
        id: '1',
        name: 'Product',
        price: 10,
        quantity: 1,
        image: 'image.jpg',
      });
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.getTotalPrice()).toBe(10);
  });
});
```

---

## Commands

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch

# Run specific file
npm test -- ProductCard.test.tsx
```

---

## Related Documentation

- [Testing Library](TESTING_LIBRARY.md) - React Native Testing Library
- [Cypress](CYPRESS.md) - E2E testing
