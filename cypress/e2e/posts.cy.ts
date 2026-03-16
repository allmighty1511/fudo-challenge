import { interceptApi, mockPosts } from '../support/api-mocks';

describe('Posts - CRUD', () => {
  beforeEach(() => {
    interceptApi();
    cy.visit('/');
    cy.wait('@getPosts');
  });

  it('crea un nuevo post', () => {
    cy.contains('button', 'Nuevo post').click();
    cy.get('[role="dialog"]').should('be.visible');
    cy.contains('Nuevo post').should('be.visible');

    cy.get('input[placeholder="Título del post"]').type('Mi nuevo post');
    cy.get('textarea[placeholder="Escribe tu contenido..."]').type('Contenido del post');
    cy.get('input[placeholder="Nombre"]').type('Autor Test');

    cy.contains('button', 'Publicar').click();

    cy.wait('@createPost');
    cy.get('[role="dialog"]').should('not.exist');
    cy.wait('@getPosts');
  });

  it('cancela la creación de post', () => {
    cy.contains('button', 'Nuevo post').click();
    cy.get('[role="dialog"]').should('be.visible');
    cy.contains('button', 'Cancelar').click();
    cy.get('[role="dialog"]').should('not.exist');
  });

  it('edita un post existente', () => {
    cy.get('button[aria-label="Opciones"]').first().click();
    cy.contains('Editar').click();

    cy.get('[role="dialog"]').should('be.visible');
    cy.contains('Editar post').should('be.visible');

    cy.get('input[placeholder="Título del post"]').clear().type('Título editado');
    cy.get('textarea[placeholder="Escribe tu contenido..."]').clear().type('Contenido editado');
    cy.contains('button', 'Guardar').click();

    cy.wait('@updatePost');
    cy.get('[role="dialog"]').should('not.exist');
    cy.contains('Título editado').should('be.visible');
  });

  it('elimina un post con confirmación', () => {
    cy.window().then((win) => {
      cy.stub(win, 'confirm').returns(true);
    });

    cy.get('button[aria-label="Opciones"]').first().click();
    cy.contains('Eliminar').click();

    cy.wait('@deletePost');
    cy.wait('@getPosts');
    cy.contains(mockPosts[0].title).should('not.exist');
  });

  it('no elimina si el usuario cancela', () => {
    cy.window().then((win) => {
      cy.stub(win, 'confirm').returns(false);
    });

    cy.get('button[aria-label="Opciones"]').first().click();
    cy.contains('Eliminar').click();

    cy.contains(mockPosts[0].title).should('be.visible');
  });
});
