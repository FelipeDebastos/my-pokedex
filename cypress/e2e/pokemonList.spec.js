/* eslint-disable no-undef */
describe("Pokemon Search Page", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("displays a list of Pokemon cards", () => {
    cy.get(".pokemon-card").should("have.length.greaterThan", 0);
  });

 
  it("renders the pokemon types on the card", () => {
    cy.visit("/"); // acessa a página que queremos testar

    // encontra o elemento de card do primeiro pokemon
    cy.get(".pokemon-card").first().within(() => {
      // verifica se os tipos de pokemon estão sendo renderizados
      cy.get(".v-chip").should("have.length.gt", 0);
    });
  });

  it("Deve carregar mais pokemons quando o usuário chegar ao final da lista", () => {
    cy.visit("http://localhost:8080"); // Substitua a URL pela URL do seu projeto
    cy.get(".pokemon-card").should("have.length", 10); // Verifica se existem 10 cartões de pokemons na tela
    cy.scrollTo("bottom"); // Faz o scroll até o final da página
    cy.get(".pokemon-card").should("have.length", 20); // Verifica se existem 20 cartões de pokemons na tela
  });

  it("Exibe o loader quando o usuário desce a página", () => {
    cy.get(".text-center").should("not.exist");
    cy.scrollTo("bottom", { duration: 2000 });
    cy.get(".text-center").should("exist");
  });

  
});
