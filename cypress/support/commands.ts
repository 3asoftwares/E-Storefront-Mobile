/// <reference types="cypress" />

// ***********************************************
// Custom Commands for E-Storefront-Mobile Web Testing
// ***********************************************

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login
       * @example cy.login('user@example.com', 'password123')
       */
      login(email: string, password: string): Chainable<void>;

      /**
       * Custom command to wait for app to be ready
       * @example cy.waitForApp()
       */
      waitForApp(): Chainable<void>;

      /**
       * Custom command to navigate using tabs
       * @example cy.tapTab('home')
       */
      tapTab(tabName: string): Chainable<void>;
    }
  }
}

// Login command
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="password-input"]').type(password);
  cy.get('[data-testid="login-button"]').click();
  cy.url().should('not.include', '/login');
});

// Wait for app to be ready
Cypress.Commands.add('waitForApp', () => {
  cy.document().its('readyState').should('eq', 'complete');
  cy.get('#root, #app, [data-testid="app-container"]', { timeout: 10000 }).should('be.visible');
});

// Tab navigation
Cypress.Commands.add('tapTab', (tabName: string) => {
  cy.get(`[data-testid="tab-${tabName}"]`).click();
});

// Prevent TypeScript from reading file as legacy script
export {};
