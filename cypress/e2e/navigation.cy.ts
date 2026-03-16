import { interceptApi } from '../support/api-mocks';

describe('Navegación', () => {
  beforeEach(() => {
    interceptApi();
  });

  it('redirige rutas desconocidas al feed', () => {
    cy.visit('/ruta-inexistente');
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('cambia entre tema claro y oscuro', () => {
    cy.visit('/');
    cy.get('button[aria-label*="Cambiar a modo"]').should('be.visible').click();
    cy.get('html').should('have.attr', 'data-theme', 'dark');
    cy.get('button[aria-label*="Cambiar a modo"]').click();
    cy.get('html').should('have.attr', 'data-theme', 'light');
  });
});
