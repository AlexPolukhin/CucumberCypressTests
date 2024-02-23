/// <reference types="cypress"/>

let FIXTURE

describe('Landing page', () => {

    beforeEach(() => {

        cy.visit('/')
        cy.fixture('example').then(
            (fixture) => (FIXTURE = fixture)
        )

    });

    context('Header', () => {

        it('Box display in correct color', () => {
            cy.get('.AppHeader')
                .should('be.visible')
                .and('have.css', 'background-color', 'rgb(27, 28, 29)')
        });

        it('Title text is correct', () => {

            // text
            cy.get('h1')
                .should('be.visible')
                .and('have.text', 'Frontend test-developer technical assignment')

            // font
            cy.get('h1')
                .should('be.visible')
                .and('have.css', 'color', 'rgb(231, 156, 125)')
                .and('have.css', 'font-size', '35px')
        });

        it('Links', () => {

            const names = ['Description', 'Add Asset', 'Existing Assets']
            const links = ['#/', '#/add', '#/assets']

            cy.get('.container > .ui')
                .find('a')
                // number of links 3
                .should('have.length', '3')
                .and('be.visible')
                .each(($el, index) =>{
                    // links have correct text
                    cy.wrap($el)
                        .should('have.text', names[index])
                    // links have correct href
                    cy.wrap($el)
                        .should('have.attr', 'href', links[index])
                        .and('have.css', 'color', 'rgba(255, 255, 255, 0.7)')
                })
                

        });
    
    });

    context('Body', () => {

        it('Box display in correct color', () => {

            cy.get('.App > :nth-child(2)')
                .should('be.visible')
                .and('have.css', 'background-color', 'rgba(0, 0, 0, 0)')

        });

        it('Title text is correct', () => {

            cy.get('h2')
                .should('have.text', 'System requirements')
                .and('have.css', 'color', 'rgb(231, 156, 125)')

        });

        it('Subtitle 1 text is correct', () => {

            cy.get('li')
                .eq(0)
                .should('have.css', 'list-style-type', 'disc')
                .and('have.text', FIXTURE.subtitle_one)
        });

        it('Subtitle 2 text is correct', () => {
            
            cy.get('li')
                .eq(3)
                .should('have.css', 'list-style-type', 'disc')
                .and('have.text', FIXTURE.subtitle_two)
        });

    });

});