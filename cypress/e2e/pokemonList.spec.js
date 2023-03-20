/* eslint-disable no-undef */
describe('Teste de listagem de pokemons', () => {
  it('Deve carregar a lista de pokemons', () => {
    cy.visit('/'); // aqui definimos a página que será carregada

    cy.get('.v-card').should('have.length.greaterThan', 0); // verificamos se a lista de pokemons foi carregada
  });

  it('Deve carregar a página de detalhes de um pokemon', () => {
    cy.visit('/'); // aqui definimos a página que será carregada

    cy.get('.v-btn').first().click(); // clicamos no botão para visualizar os detalhes do primeiro pokemon

    cy.url().should('include', '/details/'); // verificamos se a página de detalhes foi carregada
  });
});
