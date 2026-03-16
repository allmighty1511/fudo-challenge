/// <reference types="cypress" />
/// <reference path="./commands.d.ts" />

Cypress.Commands.add('stubConfirm', (accept: boolean) => {
  cy.window().then((win) => {
    cy.stub(win, 'confirm').returns(accept);
  });
});
