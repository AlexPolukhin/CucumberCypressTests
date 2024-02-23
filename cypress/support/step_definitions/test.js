/// <reference types="cypress" />

import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps";

When(`User see {string}`, (main_page) => {
    cy.visit('main_page')
})

Then(`Header is visible`, () => {
    cy.contains('Frontend test-developer technical assignment')
    cy.get('a')
        .should('have.length', 3)
        .then(($els) => {
            return Cypress._.map(Cypress.$.makeArray($els), 'innerText')
        })
        .should('deep.equal', ['Description', 'Add Asset', 'Existing Assets'])
})

And(`Requirements are visible`, () => {
    cy.get("h2")
        .should("be.visible")
        .and("have.text", "System requirements")
    cy.get('li')
        .should( items => {
            expect(items[0]).to.contain.text('User has abbility to Add assetThe asset name should be uniqueThe asset name is a combination of 4 uppercase letters and 10 digitalis')
            expect(items[3]).to.contain.text('User has abbility to see Existing assetSearch by assert nameFilter by assert nameSort by assert name')
          }) // TODO: add ability instead .* after spelling fix
        .and("be.visible")
    cy.get('b').each((item) => {
        cy.wrap(item)
            .should("be.visible")
    })
}) 

When(`User click on Add Asset tab`, () => {
    cy.get('[testid=add-asset]')
        .click()
})

Then(`User see New asset page`, () => {
    cy.contains('New Asset')
    cy.get('input')
        .should('have.attr', 'placeholder', 'ISIN0000000045')
        .and('be.visible')
    cy.get('[data-test="button"]')
        .should('be.visible')
        .and('have.text', 'Send')
    cy.get('[data-test="fa"]')
        .should('be.visible')
})

And(`User add new {string}`, (new_asset) => {
    cy.intercept('POST', '**/addAsset/'+ new_asset).as('post')
    cy.get('input[id="defaultFormAddAsset"]')
        .type(new_asset)
    cy.get('[data-test="button"]')
        .click()
    cy.wait('@post').its('response.statusCode').should('eq', 201)
})

And(`User see successful message and close popup`, () => {
    cy.get('[data-test="modal-header"]').within(() => {
        cy.get('h4')
            .should('be.visible')
            .contains(/Suc.*/)   // TODO: Text should be success after spelling fix         
    })
    cy.get('[data-test="modal-body"]')
        .contains(/Asset .* was added to the list/)
        .should('be.visible')
    cy.get('[data-test="modal-footer"]').within(() => {
        cy.get('[data-test="button"]')
            .should('have.text', 'Close')
            .click()
    })
    cy.get('[class="modal-content"]')
        .should('not.exist')  

})

When(`User see {string}`, (new_asset_page) => {
    cy.visit(new_asset_page)
})

And(`User add existing {string}`, (existing_asset) => {
    cy.intercept('POST', '**/addAsset/'+ existing_asset).as('post')
    cy.get('input[id="defaultFormAddAsset"]')
        .clear()
        .type(existing_asset)
    cy.get('[data-test="button"]')
        .click()
    cy.wait('@post').its('response.statusCode').should('eq', 409)
})

And(`User see message that asset exist`, () => {
    cy.get('[data-test="modal-header"]').within(() => {
        cy.get('h4')
            .should('be.visible')
            .contains(/Asset .* exist/) // TODO: add already instead of .* after spelling fix
        cy.get('button')
            .click()
            
    })
    cy.get('[data-test="col"]').within(() => {
        cy.get('[data-test="button"]')
            .click()
    })
    cy.get('[data-test="modal-body"]')
        .should('be.visible')
        .and('have.text','Asset name should be unique. Assert with this name already exists')
    cy.get('[data-test="modal-footer"]').within(() => {
        cy.get('[data-test="button"]')
            .should('have.text', 'Close')
            .click()
    })   

})

When(`User add incorrect {string} format`, (incorrect_value) => {
    cy.get('input[id="defaultFormAddAsset"]')
        .clear()
        .type(incorrect_value)
})

Then(`User see red validation message for field {string}`, (incorrect_value) => {
    cy.get('[data-test="row"]').within(() => {
        cy.get('[id="defaultFormAddAsset"]')
            .should('have.attr', 'value', incorrect_value)
        cy.get('[class="invalid-feedback"]')
            .should('be.visible')
            .and('have.css', 'color', 'rgb(220, 53, 69)')
            .and('have.text', 'Incorrect format')
        cy.get('[id="defaultFormAddAsset"]')
            .should('have.css', 'border-color', 'rgb(220, 53, 69)')
    })
})

When(`User add correct {string} value`, (correct_value) => {
    cy.get('input[id="defaultFormAddAsset"]')
        .clear()
        .type(correct_value)
})

Then(`User see green validation message for field {string}`, (correct_value) => {
    cy.get('[data-test="row"]').within(() => {
        cy.get('[id="defaultFormAddAsset"]')
            .should('have.attr', 'value', correct_value)
        cy.get('[class="valid-feedback"]')
            .should('be.visible')
            .and('have.css', 'color', 'rgb(40, 167, 69)')
            .and('have.text', 'Correct format')
        cy.get('[id="defaultFormAddAsset"]')
            .should('have.css', 'border-color', 'rgb(40, 167, 69)')
    })
})

When(`User click on Existing assets tab`, () => {
    cy.intercept('GET', '**/getAssets').as('get')
    cy.get('[class="ui inverted secondary stackable menu"]')
        .within(() =>{
            cy.contains('Existing Assets')
                .click()
        })
    cy.wait('@get').its('response.statusCode').should('eq', 200)
})

Then(`User see Existing assets tab`, () => {
    cy.get('[data-test="datatable"]')
        .within(() => {
            cy.get('[data-test="datatable-select"]')
                .should('be.visible')
                .and('have.text', 'Show entries102050100')
        })
    cy.get('[data-test="datatable-input"]')
        .should('be.visible')
        .find('input')
        .should('have.attr', 'placeholder', 'Search')
        .and('be.visible')
    cy.get('[data-test="table"]')
        .should('be.visible')
    cy.get('[data-test="datatable-info"]')
        .contains('Showing 1 to 10')
    cy.get('[data-test="pagination"]')
        .should('be.visible')
})

When(`User open {string}`, (existing_asset_page) => {
    cy.intercept('GET', '**/getAssets').as('get')
    cy.visit(existing_asset_page)
    cy.wait('@get').its('response.statusCode').should('eq', 200)
    cy.get('[data-test="datatable"]')
})

When(`User use {string}`, (search) => {
    cy.get('[data-test="datatable-input"]')
        .type(search)
})

Then(`User see {string} result`, (search) => {
    cy.get('[data-test="table-body"]')
        .find('tr')
        .should('have.length', 1)
        .and('contain', search)
    cy.get('[data-test="datatable-input"]')
        .clear()
    cy.get('[data-test="table-body"]')
        .find('tr')
        .should('have.length.greaterThan', 3)    
})

When(`User select 20 in Show entries`, () => {
    cy.get('[data-test="datatable-select"]')
        .within(() => {
            cy.get('select')
                .select('20')
        })
})
    
Then(`User see more than 10 assets`, () => {
    cy.get('[data-test="table-body"]')
        .find('tr')
        .should('have.length.greaterThan', 10)      
    }) 
    
When(`User select 10 in Show entries`, () => {
    cy.get('[data-test="datatable-select"]')
    .within(() => {
        cy.get('select')
        .select('10')
    })
})

Then(`User see only 10 assets`, () => {
    cy.get('[data-test="table-body"]')
        .find('tr')
        .should('have.length', 10)      
    })
    
When(`User click Next page`, () => {
    cy.get('[data-test="pagination"]')
        .within(() => {
            cy.contains('Next')
                .click()
        })
})

Then(`User see second page table`, () => {
    cy.get('[data-test="table-body"]')
        .find('tr')
        .should('have.length', 10)
        .and('contain', 'QWER0000000002')
    cy.contains('Showing 11 to')
    })

When(`User click on first page`, () => {
    cy.get('[data-test="pagination"]')
        .within(() => {
            cy.contains('1')
                .click()
        })
})

Then(`User see first page`, () => {
    cy.get('[data-test="table-body"]')
        .find('tr')
        .should('have.length', 10)
        .and('contain', 'ISIN0000000045')      
    })

When(`User sort by Name`, () => {
    cy.get('[data-test="datatable-head"]')
        .within(() => {
            cy.get('th')
                .should('have.class', 'sorting')
                .click()
        })
})  

Then(`User see sorted table`, () => {
    cy.get('[data-test="datatable-head"]')
        .within(() => {
            cy.get('th')
                .should('have.class', 'sorting_asc')
                .click()
                .and('have.class', 'sorting_desc')
        })
})