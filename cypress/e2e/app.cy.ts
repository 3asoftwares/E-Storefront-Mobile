/// <reference types="cypress" />

describe('Mobile App - Home Screen (Web)', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.waitForApp();
  });

  it('should display the home screen', () => {
    cy.get('[data-testid="home-screen"]').should('be.visible');
  });

  it('should display bottom tab navigation', () => {
    cy.get('[data-testid="tab-bar"]').should('be.visible');
    cy.get('[data-testid="tab-home"]').should('be.visible');
    cy.get('[data-testid="tab-categories"]').should('be.visible');
    cy.get('[data-testid="tab-cart"]').should('be.visible');
    cy.get('[data-testid="tab-profile"]').should('be.visible');
  });

  it('should display featured products', () => {
    cy.get('[data-testid="featured-products"]').should('be.visible');
  });

  it('should navigate to categories tab', () => {
    cy.tapTab('categories');
    cy.get('[data-testid="categories-screen"]').should('be.visible');
  });

  it('should navigate to cart tab', () => {
    cy.tapTab('cart');
    cy.get('[data-testid="cart-screen"]').should('be.visible');
  });

  it('should navigate to profile tab', () => {
    cy.tapTab('profile');
    cy.get('[data-testid="profile-screen"]').should('be.visible');
  });
});

describe('Mobile App - Product Browsing (Web)', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.waitForApp();
  });

  it('should display product cards', () => {
    cy.get('[data-testid="product-card"]').should('have.length.at.least', 1);
  });

  it('should navigate to product detail when tapping product', () => {
    cy.get('[data-testid="product-card"]').first().click();
    cy.get('[data-testid="product-detail-screen"]').should('be.visible');
  });

  it('should display product information', () => {
    cy.get('[data-testid="product-card"]').first().click();
    cy.get('[data-testid="product-name"]').should('be.visible');
    cy.get('[data-testid="product-price"]').should('be.visible');
    cy.get('[data-testid="add-to-cart-button"]').should('be.visible');
  });
});

describe('Mobile App - Cart (Web)', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.waitForApp();
  });

  it('should add product to cart', () => {
    cy.get('[data-testid="product-card"]').first().click();
    cy.get('[data-testid="add-to-cart-button"]').click();
    cy.tapTab('cart');
    cy.get('[data-testid="cart-item"]').should('have.length.at.least', 1);
  });

  it('should display empty cart message when no items', () => {
    cy.tapTab('cart');
    cy.get('[data-testid="empty-cart"]').should('be.visible');
  });

  it('should update cart item quantity', () => {
    cy.get('[data-testid="product-card"]').first().click();
    cy.get('[data-testid="add-to-cart-button"]').click();
    cy.tapTab('cart');
    cy.get('[data-testid="increase-quantity"]').click();
    cy.get('[data-testid="item-quantity"]').should('contain', '2');
  });

  it('should remove item from cart', () => {
    cy.get('[data-testid="product-card"]').first().click();
    cy.get('[data-testid="add-to-cart-button"]').click();
    cy.tapTab('cart');
    cy.get('[data-testid="remove-item"]').click();
    cy.get('[data-testid="empty-cart"]').should('be.visible');
  });
});

describe('Mobile App - Authentication (Web)', () => {
  it('should display login screen', () => {
    cy.visit('/login');
    cy.waitForApp();
    cy.get('[data-testid="login-screen"]').should('be.visible');
    cy.get('[data-testid="email-input"]').should('be.visible');
    cy.get('[data-testid="password-input"]').should('be.visible');
  });

  it('should display signup screen', () => {
    cy.visit('/signup');
    cy.waitForApp();
    cy.get('[data-testid="signup-screen"]').should('be.visible');
  });

  it('should show validation errors', () => {
    cy.visit('/login');
    cy.waitForApp();
    cy.get('[data-testid="login-button"]').click();
    cy.get('[data-testid="error-message"]').should('be.visible');
  });
});

describe('Mobile App - Search (Web)', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.waitForApp();
  });

  it('should display search input', () => {
    cy.get('[data-testid="search-input"]').should('be.visible');
  });

  it('should search for products', () => {
    cy.get('[data-testid="search-input"]').type('headphones');
    cy.get('[data-testid="search-button"]').click();
    cy.get('[data-testid="search-results"]').should('be.visible');
  });

  it('should show no results message for invalid search', () => {
    cy.get('[data-testid="search-input"]').type('xyznonexistent123');
    cy.get('[data-testid="search-button"]').click();
    cy.get('[data-testid="no-results"]').should('be.visible');
  });
});
