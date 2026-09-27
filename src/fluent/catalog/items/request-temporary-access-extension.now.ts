/**
 * @file Catalog Item — Request Temporary Access Extension
 * @description Catalog item allowing users to request an extension of their currently active
 * temporary ServiceNow administrative access. Configures a streamlined, single-variable form
 * backed by a standard execution plan.
 * @module catalog/items/request-temporary-access-extension
 * @scope x_1297430_sncadmin
 * @sdk @servicenow/sdk/core
 * @sdk-version 4.12.2
 */

import { CatalogItem, RequestedForVariable } from '@servicenow/sdk/core'

/**
 * Catalog item definition for requesting temporary admin access extension.
 * Minimal catalog item that collects only the target user and relies on standard
 * execution plan fulfillment rather than a custom flow.
 */
export const requestTemporaryAccessExtension = CatalogItem({
    $id: Now.ID['catalog-item-request-extension'],
    name: 'Request Temporary Access Extension',
    availability: 'both',
    // hideSaveAsDraft: true since extension requests are immediate and should not be saved as drafts
    hideSaveAsDraft: true,
    owner: '6816f79cc0a8016401c5a33be04be441',
    shortDescription: 'Request Temporary Access Extension',
    version: 12,
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
    // Uses executionPlan (standard execution plan sys_id) rather than a custom flow
    executionPlan: '523da512c611228900811a37c97c2014',
    fulfillmentAutomationLevel: 'fullyAutomated',
    deliveryTime: {
        days: 2,
    },
    requestMethod: 'request',
    // Assigns this catalog item to the standard Service Catalog
    catalogs: ['e0d08b13c3330100c8b837659bba8fb4'],

    // ─── Form Variables ───
    // Minimal item—only collects request_for variable to identify the user needing extension
    variables: {
        request_for: RequestedForVariable({
            question: 'Request For',
            order: 100,
            mandatory: true,
            referenceQualCondition: 'active=true^EQ',
        }),
    },
})
