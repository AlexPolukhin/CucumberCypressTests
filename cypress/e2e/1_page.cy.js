/// <reference types="cypress"/>

let FIXTURE

describe('Landing page', () => {

    beforeEach(() => {

        cy.visit('/')
        cy.fixture('example').then(
            (fixture) => (FIXTURE = fixture)
        )

    });

    it('Header', () => {
        cy.get('h2')
    });

});