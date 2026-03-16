import { interceptApi, mockPosts, mockComments } from '../support/api-mocks';

describe('Detalle de post', () => {
  beforeEach(() => {
    interceptApi();
    cy.visit('/post/1');
    cy.wait('@getPost');
    cy.wait('@getComments');
  });

  it('muestra el contenido del post', () => {
    cy.contains(mockPosts[0].title).should('be.visible');
    cy.contains(mockPosts[0].content).should('be.visible');
    cy.contains(mockPosts[0].name).should('be.visible');
  });

  it('tiene enlace para volver al feed', () => {
    cy.contains('a', 'Volver al feed').should('be.visible').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('muestra la sección de comentarios', () => {
    cy.contains('Comentarios').should('be.visible');
  });

  it('muestra comentarios existentes', () => {
    cy.contains(mockComments[0].content).should('be.visible');
    cy.contains(mockComments[0].name).should('be.visible');
  });

  it('permite añadir un nuevo comentario', () => {
    cy.get('input[placeholder="Tu nombre"]').first().type('Nuevo Usuario');
    cy.get('textarea[placeholder="Escribe un comentario..."]').type('Mi comentario');
    cy.contains('button', 'Comentar').click();

    cy.wait('@createComment');
    cy.contains('Nuevo comentario').should('be.visible');
  });

  it('edita el post desde el detalle', () => {
    cy.get('button[aria-label="Opciones"]').first().click();
    cy.contains('Editar').click();

    cy.get('[role="dialog"]').within(() => {
      cy.get('input[placeholder="Título del post"]').clear().type('Post actualizado');
      cy.contains('button', 'Guardar').click();
    });

    cy.wait('@updatePost');
    cy.contains('Post actualizado').should('be.visible');
  });

  it('elimina el post y navega al feed', () => {
    cy.stubConfirm(true);

    cy.get('button[aria-label="Opciones"]').first().click();
    cy.contains('Eliminar').click();

    cy.wait('@deletePost');
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('muestra error cuando el post no existe', () => {
    cy.visit('/post/999');
    cy.wait('@getPost');
    cy.contains(/Post no encontrado|Error al cargar/i).should('be.visible');
    cy.contains('Volver al feed').should('be.visible');
  });
});
