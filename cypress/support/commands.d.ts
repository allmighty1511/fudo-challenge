/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    stubConfirm(accept: boolean): Chainable<void>;
  }
}
