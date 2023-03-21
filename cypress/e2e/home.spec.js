/* eslint-disable no-undef */
describe('PageHome', () => {
    it('should navigate to the home page', () => {
      cy.visit('/')
      cy.location('pathname').should('eq', '/')
    })

    it('renders the logo image', () => {
        cy.visit('/')
        cy.get('#app')
          .find('img[src="https://upload.wikimedia.org/wikipedia/commons/9/98/International_Pok%C3%A9mon_logo.svg"]')
          .should('exist')
      })
  })

  