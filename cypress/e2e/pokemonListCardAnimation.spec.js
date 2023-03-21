/* eslint-disable no-undef */
describe("Animation tests", () => {
  it("should animate cards and open modal", () => {
    cy.visit("/");

    cy.get(".pokemon-card").eq(0).click().should("have.class", "elevation-12");
    cy.wait(500);
    cy.get(".v-dialog").should("be.visible");
  });
});
