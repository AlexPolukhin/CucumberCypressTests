Feature: Validate assets app

Scenario Outline: Main(description) page

    When User see <main_page>
    Then Header is visible
    And Requirements are visible

    When User click on Add Asset tab
    Then User see New asset page 

    When User click on Existing assets tab
    Then User see Existing assets tab

    Examples:
        | main_page                  |
        | "http://localhost:3000/#/" |

Scenario Outline: User add add new assets

    When User see <new_asset_page>
    And User add new <new_asset>
    And User see successful message and close popup

    Examples:
        | new_asset_page                 | new_asset        |
        | "http://localhost:3000/#/add"  | "QWER0000000015" | 

Scenario Outline: User add existing assets

    When User see <new_asset_page>
    And User add existing <existing_asset>
    And User see message that asset exist
    
    When User add incorrect <incorrect_value> format
    Then User see red validation message for field <incorrect_value>

    When User add correct <correct_value> value
    Then User see green validation message for field <correct_value>
        
    Examples:
    |   new_asset_page                | existing_asset      | incorrect_value            | correct_value     |
    |   "http://localhost:3000/#/add" | "ISIN0000000045"    | "ABCYZ012345678"           | "ABYZ0123456789"  |

Scenario Outline: Existing assets page

    When User open <existing_asset_page>
    
    When User use <search>
    Then User see <search> result
    
    When User select 20 in Show entries
    Then User see more than 10 assets
    
    When User select 10 in Show entries
    Then User see only 10 assets

    When User click Next page
    Then User see second page table

    When User click on first page
    Then User see first page

    When User sort by Name
    Then User see sorted table

    Examples:
        | existing_asset_page               | search |
        | "http://localhost:3000/#/assets"  | "45"   |
