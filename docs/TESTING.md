# Mobile App Testing Guide

## 📑 Table of Contents

- [Overview](#overview)
- [Unit Testing](#unit-testing)
- [Component Testing](#component-testing)
- [E2E Testing](#e2e-testing)
- [Running Tests](#running-tests)

## 🌐 Overview

| Test Type | Framework                    | Purpose                  |
| --------- | ---------------------------- | ------------------------ |
| Unit      | Jest                         | Functions, hooks, stores |
| Component | React Native Testing Library | UI components            |
| E2E       | Cypress (Web)                | User flows               |

## 🧪 Unit Testing

### Testing Zustand Store

```typescript
// src/store/__tests__/cartStore.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useCartStore } from '../cartStore';

describe('cartStore', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it('adds item to cart', () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addItem({
        id: '1',
        name: 'Product',
        price: 99.99,
      });
    });

    expect(result.current.items).toHaveLength(1);
  });

  it('calculates total price', () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addItem({ id: '1', name: 'A', price: 100 });
      result.current.addItem({ id: '2', name: 'B', price: 50 });
    });

    expect(result.current.totalPrice()).toBe(150);
  });
});
```

### Testing Utilities

```typescript
// src/utils/__tests__/formatPrice.test.ts
import { formatPrice } from '../formatPrice';

describe('formatPrice', () => {
  it('formats USD correctly', () => {
    expect(formatPrice(99.99)).toBe('$99.99');
  });

  it('handles zero', () => {
    expect(formatPrice(0)).toBe('$0.00');
  });
});
```

## 🧩 Component Testing

### Basic Component Test

```typescript
// src/components/__tests__/ProductCard.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ProductCard } from '../ProductCard';

const mockProduct = {
  id: '1',
  name: 'Test Product',
  price: 99.99,
  image: 'https://example.com/image.jpg',
};

describe('ProductCard', () => {
  it('renders product name', () => {
    const { getByText } = render(<ProductCard product={mockProduct} />);
    expect(getByText('Test Product')).toBeTruthy();
  });

  it('renders price', () => {
    const { getByText } = render(<ProductCard product={mockProduct} />);
    expect(getByText('$99.99')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <ProductCard product={mockProduct} onPress={onPress} />
    );

    fireEvent.press(getByTestId('product-card'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

## 🌐 E2E Testing (Cypress - Web)

### Cypress Test

```typescript
// cypress/e2e/checkout.cy.ts
describe('Checkout Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('adds product to cart and checks out', () => {
    // Add product
    cy.get('[data-testid="product-card"]').first().click();
    cy.get('[data-testid="add-to-cart"]').click();

    // Go to cart
    cy.get('[data-testid="cart-tab"]').click();
    cy.get('[data-testid="cart-item"]').should('have.length', 1);

    // Checkout
    cy.get('[data-testid="checkout-button"]').click();
    cy.url().should('include', '/checkout');
  });
});
```

## 🏃 Running Tests

### Commands

```bash
# Unit & Component Tests
npm run test              # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage

# E2E Tests (Web)
npm run cy:open           # Open Cypress UI
npm run cy:run            # Run headless
npm run cy:web            # Run with dev server
```

### Coverage Requirements

| Metric     | Threshold |
| ---------- | --------- |
| Statements | 70%       |
| Branches   | 70%       |
| Functions  | 70%       |
| Lines      | 70%       |

---

See also:

- [ARCHITECTURE.md](./ARCHITECTURE.md) - App architecture
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Development workflow
