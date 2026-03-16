describe('Feed', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('displays DevThread header', () => {
    cy.contains('DevThread').should('be.visible');
  });

  it('has Nuevo post button', () => {
    cy.contains('Nuevo post').should('be.visible');
  });

  it('shows feed or empty state', () => {
    cy.get('main').should('be.visible');
    cy.contains(/Feed|No hay posts/i).should('be.visible');
  });
});
