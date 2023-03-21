/* eslint-disable no-undef */

import PokemonList from "@/components/PokemonList.vue";
import { mount } from "@cypress/vue";

describe("PokemonList", () => {
  it("should render the component properly", () => {
    mount(PokemonList, {
      stubs: [
        "v-container",
        "v-row",
        "v-col",
        "v-card",
        "v-img",
        "v-card-title",
        "v-chip",
        "v-dialog",
        "v-progress-circular",
      ],
    });

    cy.get(".pokemon-card").should("have.length", 300);
  });

  it("should select the Pokemon and display modal properly", () => {
    mount(PokemonList, {
      stubs: [
        "v-container",
        "v-row",
        "v-col",
        "v-card",
        "v-img",
        "v-card-title",
        "v-chip",
        "v-dialog",
        "v-progress-circular",
      ],
    });

    cy.get(".pokemon-card").first().click();

    cy.get(".v-dialog--active")
      .should("be.visible")
      .within(() => {
        cy.get(".pokemon-title").should("contain", "bulbasaur");
        cy.get(".chart-container svg").should("exist");
        cy.get(".stats-container").should("have.length", 6);
      });

    cy.get(".v-dialog__content").click("topRight");
    cy.get(".v-dialog--active").should("not.exist");
  });

  it("should filter the list of Pokemons properly", () => {
    mount(PokemonList, {
      stubs: [
        "v-container",
        "v-row",
        "v-col",
        "v-card",
        "v-img",
        "v-card-title",
        "v-chip",
        "v-dialog",
        "v-progress-circular",
      ],
    });

    cy.get(".pokemon-card").should("have.length", 300);

    cy.get(".v-input").type("pikachu");

    cy.get(".pokemon-card").should("have.length", 1);
    cy.get(".pokemon-card h5").should("contain", "pikachu");

    cy.get(".v-input__icon--clear").click();
    cy.get(".pokemon-card").should("have.length", 300);
  });
});
