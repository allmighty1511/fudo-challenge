import { interceptApi, mockPosts } from '../support/api-mocks';

describe('Feed', () => {
  beforeEach(() => {
    interceptApi();
    cy.visit('/');
    cy.wait('@getPosts');
  });

  it('muestra el header DevThread', () => {
    cy.contains('DevThread').should('be.visible');
  });

  it('muestra el botón Nuevo post', () => {
    cy.contains('button', 'Nuevo post').should('be.visible');
  });

  it('muestra el título Feed', () => {
    cy.contains('h1', 'Feed').should('be.visible');
  });

  it('muestra los posts del API', () => {
    cy.contains(mockPosts[0].title).should('be.visible');
    cy.contains(mockPosts[1].title).should('be.visible');
    cy.contains(mockPosts[0].content).should('be.visible');
  });

  it('navega al detalle al hacer clic en un post', () => {
    cy.contains(mockPosts[0].title).click();
    cy.url().should('include', '/post/1');
    cy.contains(mockPosts[0].title).should('be.visible');
    cy.contains(mockPosts[0].content).should('be.visible');
  });

  it('muestra estado vacío cuando no hay posts', () => {
    cy.intercept('GET', '**/post', { statusCode: 200, body: [] });
    cy.visit('/');
    cy.contains(/No hay posts aún|¡Crea el primero!/i).should('be.visible');
  });
});
