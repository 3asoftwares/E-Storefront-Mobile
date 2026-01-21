# Cypress

## Overview

**Version:** 13.6.0  
**Website:** [https://www.cypress.io](https://www.cypress.io)  
**Category:** E2E Testing

Cypress is a JavaScript end-to-end testing framework for web applications. Used for testing the web version of the mobile app.

---

## Why Cypress?

### Benefits

| Benefit              | Description                                   |
| -------------------- | --------------------------------------------- |
| **Visual Testing**   | See tests run in real browser                 |
| **Time Travel**      | Debug with DOM snapshots                      |
| **Auto Waiting**     | No manual waits needed                        |
| **Network Control**  | Stub API responses                            |
| **Screenshots**      | Automatic failure screenshots                 |

---

## Configuration

### cypress.config.ts

```typescript
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8081',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 375,
    viewportHeight: 812,
    video: false,
  },
});
```

---

## Writing Tests

### Basic Test

```typescript
// cypress/e2e/home.cy.ts
describe('Home Screen', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('displays featured products', () => {
    cy.contains('Featured Products').should('be.visible');
    cy.get('[data-testid="product-card"]').should('have.length.at.least', 1);
  });

  it('navigates to product detail', () => {
    cy.get('[data-testid="product-card"]').first().click();
    cy.url().should('include', '/product/');
  });
});
```

### Cart Flow

```typescript
// cypress/e2e/cart.cy.ts
describe('Cart', () => {
  it('adds product to cart', () => {
    cy.visit('/');
    cy.get('[data-testid="product-card"]').first().click();
    cy.contains('Add to Cart').click();
    cy.get('[data-testid="cart-badge"]').should('contain', '1');
  });

  it('updates quantity in cart', () => {
    cy.visit('/cart');
    cy.get('[data-testid="quantity-increase"]').click();
    cy.get('[data-testid="quantity"]').should('contain', '2');
  });
});
```

---

## Commands

```bash
# Open Cypress UI
npm run cypress:open

# Run headless
npm run cypress:run

# Run specific spec
npm run cypress:run -- --spec "cypress/e2e/cart.cy.ts"
```

---

## Related Documentation

- [Jest](JEST.md) - Unit testing
- [Testing Library](TESTING_LIBRARY.md) - Component testing
