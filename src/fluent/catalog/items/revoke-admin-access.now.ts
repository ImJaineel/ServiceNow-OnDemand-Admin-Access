/**
 * @file Catalog Item — Revoke ServiceNow Admin Access
 * @description Catalog item allowing users or administrators to revoke previously granted
 * administrative privileges. Supports multiple revocation strategies including revoking
 * specific fine-grained roles, revoking full coarse-grained access, or revoking access
 * previously granted under a specific permanent-access Request Item (RITM).
 * @module catalog/items/revoke-admin-access
 * @scope x_1297430_sncadmin
 * @sdk @servicenow/sdk/core
 * @sdk-version 4.12.2
 */

import {
    CatalogItem,
    RequestedForVariable,
    SelectBoxVariable,
    ReferenceVariable,
    ListCollectorVariable,
} from '@servicenow/sdk/core'

/**
 * Catalog item definition for revoking ServiceNow administrative privileges.
 * Interacts with Flow Designer flow 'Revoke ServiceNow Admin Access' to automate
 * role de-provisioning from user accounts.
 */
export const revokeServicenowAdminAccess = CatalogItem({
    $id: Now.ID['catalog-item-revoke-admin-access'],
    name: 'Revoke ServiceNow Admin Access',
    availability: 'both',
    checkedOut: false,
    owner: '6816f79cc0a8016401c5a33be04be441',
    shortDescription: 'Revoke ServiceNow Admin Access',
    state: 'published',
    version: 19,
    hideAddToCart: true,
    hideQuantitySelector: true,
    pricingDetails: [
        {
            amount: 0,
            currencyType: 'USD',
            field: 'price',
        },
        {
            amount: 0,
            currencyType: 'USD',
            field: 'recurring_price',
        },
    ],
    // ─── Fulfillment & Catalog Configuration ───
    // Flow reference: Links to backend Flow Designer flow 'Revoke ServiceNow Admin Access' (sys_id) that orchestrates role removal
    flow: '1cdfc86883f466104cd2c900feaad30e',
    fulfillmentAutomationLevel: 'fullyAutomated',
    deliveryTime: {
        days: 2,
    },
    requestMethod: 'request',
    // Assigns this catalog item to the standard Service Catalog
    catalogs: ['e0d08b13c3330100c8b837659bba8fb4'],

    // ─── Form Variables ───
    variables: {
        // Target user whose administrative access is being revoked; restricted to active user records
        request_for: RequestedForVariable({
            question: 'Request For',
            order: 100,
            mandatory: true,
            referenceQualCondition: 'active=true^EQ',
        }),
        // what_is_request: determines revocation method (fine-grained, by RITM, coarse-grained)
        what_is_request: SelectBoxVariable({
            question: 'What Is Request ?',
            order: 200,
            mandatory: true,
            choices: {
                remove_fine_grained_access: {
                    label: 'Remove Fine-Grained Access',
                    inactive: false,
                    sequence: 200,
                    pricingDetails: [
                        {
                            amount: 0,
                            currencyType: 'USD',
                            field: 'misc',
                        },
                        {
                            amount: 0,
                            currencyType: 'USD',
                            field: 'rec_misc',
                        },
                    ],
                },
                'Remove Access based on requested request': {
                    label: 'Remove Access based on requested request',
                    inactive: false,
                    sequence: 100,
                },
                remove_coarse_grained_access: {
                    label: 'Remove Coarse-Grained Access',
                    inactive: false,
                    sequence: 300,
                },
            },
            includeNone: true,
        }),
        // access_requested_ritm_which_needs_to_be_revoked: reference qualifier filters to completed permanent access RITMs
        access_requested_ritm_which_needs_to_be_revoked: ReferenceVariable({
            question: 'Access Requested RITM which needs to be revoked',
            order: 300,
            referenceTable: 'sc_req_item',
            referenceQualCondition:
                'active=false^cat_item=b4a330b683f31690827999c0deaad3d1^variables.0707b43683771690827999c0deaad3ab=permanent',
        }),
        // revoke_which_type_of_access: inactive (deprecated—replaced by what_is_request logic)
        revoke_which_type_of_access: SelectBoxVariable({
            active: false,
            question: 'Revoke which type of access',
            order: 400,
            choices: {
                coarse_grained_access: {
                    label: 'Coarse-Grained Access',
                    inactive: false,
                    sequence: 200,
                    pricingDetails: [
                        {
                            amount: 0,
                            currencyType: 'USD',
                            field: 'misc',
                        },
                        {
                            amount: 0,
                            currencyType: 'USD',
                            field: 'rec_misc',
                        },
                    ],
                },
                fine_grained_access: {
                    label: 'Fine-Grained Access',
                    inactive: false,
                    sequence: 100,
                    pricingDetails: [
                        {
                            amount: 0,
                            currencyType: 'USD',
                            field: 'misc',
                        },
                        {
                            amount: 0,
                            currencyType: 'USD',
                            field: 'rec_misc',
                        },
                    ],
                },
            },
            includeNone: true,
        }),
        // remove_specific_admin_role: ListCollector displaying roles to remove when fine-grained revocation is selected
        remove_specific_admin_role: ListCollectorVariable({
            question: 'Remove Specific Admin Role',
            order: 400,
            listTable: 'sys_user_role',
        }),
    },
})
