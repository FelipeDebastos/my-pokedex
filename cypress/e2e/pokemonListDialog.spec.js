/* eslint-disable no-undef */
describe("Dialog component", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should create the dialog with the correct title and content", () => {
    cy.get(".pokemon-card").first().click();
    cy.get(".v-dialog--active")
      .should("be.visible")
      .within(() => {
        cy.get(".pokemon-title span").should("contain", "Charmander");
        cy.get(".chart-container svg").should("exist");
        cy.get(".stats-container .stat")
          .should("have.length", 6)
          .should("contain", "HP:")
          .should("contain", "Attack:")
          .should("contain", "Defense:")
          .should("contain", "Sp. Atk:")
          .should("contain", "Sp. Def:")
          .should("contain", "Speed:");
      });
  });
});
