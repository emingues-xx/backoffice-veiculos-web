/// <reference types="cypress" />

// Custom commands for testing

Cypress.Commands.add('login', (email = 'admin@backoffice.com', password = 'Admin123!@#') => {
  cy.session([email, password], () => {
    cy.visit('/');
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });
});

Cypress.Commands.add('logout', () => {
  cy.get('[data-testid="user-menu"]').click();
  cy.contains('Sair').click();
  cy.url().should('include', '/');
});

Cypress.Commands.add('mockApiResponse', (endpoint: string, response: any) => {
  cy.intercept('GET', `**${endpoint}**`, {
    statusCode: 200,
    body: response
  }).as(`mock${endpoint.replace(/\//g, '')}`);
});
