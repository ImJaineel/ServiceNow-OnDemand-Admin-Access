/**
 * @file Catalog Item — Request ServiceNow Admin Access
 * @description Catalog item enabling users to request elevated ServiceNow admin access,
 * either temporary (time-bounded) or permanent. Configures multi-column form layouts,
 * access categorization, role selectors, duration constraints, and links to the
 * fulfillment flow.
 * @module catalog/items/request-admin-access
 * @scope x_1297430_sncadmin
 * @sdk @servicenow/sdk/core
 * @sdk-version 4.12.2
 */

import {
    CatalogItem,
    RequestedForVariable,
    ContainerStartVariable,
    SelectBoxVariable,
    ContainerSplitVariable,
    ContainerEndVariable,
    YesNoVariable,
    ListCollectorVariable,
    DateTimeVariable,
    ReferenceVariable,
    MultiLineTextVariable,
} from '@servicenow/sdk/core'

/**
 * Catalog item definition for requesting ServiceNow administrative access.
 * Manages fine-grained vs. coarse-grained privileges, temporary duration windows,
 * and business justifications for auditing and approval routing.
 */
export const requestServicenowAdminAccess = CatalogItem({
    $id: Now.ID['catalog-item-request-admin-access'],
    name: 'Request ServiceNow Admin Access',
    availability: 'both',
    checkedOut: false,
    owner: '6816f79cc0a8016401c5a33be04be441',
    shortDescription: 'Request ServiceNow Admin Access',
    state: 'published',
    version: 70,
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
    // Links to the backend Flow Designer flow ('Request ServiceNow Admin Access' sys_id) handling approvals and automated provisioning
    flow: 'd2ecf87e83f71690827999c0deaad3f4',
    fulfillmentAutomationLevel: 'fullyAutomated',
    deliveryTime: {
        days: 2,
    },
    requestMethod: 'request',
    // Assigns this item to the standard Service Catalog
    catalogs: ['e0d08b13c3330100c8b837659bba8fb4'],

    // ─── Form Variables ───
    // Variables are organized in display order using container start/split/end pairs to create a two-column layout
    variables: {
        // Target recipient of administrative privileges; restricted to active user accounts
        request_for: RequestedForVariable({
            question: 'Request For',
            order: 100,
            mandatory: true,
            referenceQualCondition: 'active=true^EQ',
        }),
        // ─── Request Classification (Two-Column Layout) ───
        // Container start: pairs with split and end to create a side-by-side layout for category and access type
        request_type1: ContainerStartVariable({
            question: 'Request Type',
            order: 200,
        }),
        // access_category: Temporary vs Permanent—controls which duration fields appear via UI policies
        access_category: SelectBoxVariable({
            question: 'Access Category',
            order: 300,
            mandatory: true,
            choices: {
                temporary: {
                    label: 'Temporary Access',
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
                permanent: {
                    label: 'Permanent Access',
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
        formatter7: ContainerSplitVariable({
            order: 400,
        }),
        // access_type: Fine-Grained (pick specific roles) vs Coarse-Grained (admin/security_admin)
        access_type: SelectBoxVariable({
            question: 'Access Type',
            order: 500,
            mandatory: true,
            choices: {
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
            },
            includeNone: true,
        }),
        formatter8: ContainerEndVariable({
            order: 600,
        }),
        // ─── Role & Privilege Selection ───
        // security_admin_required: conditionally shown for coarse-grained access via UI policy
        security_admin_required: YesNoVariable({
            question: 'Security_Admin Required ?',
            order: 700,
            defaultValue: 'No',
        }),
        // access_required: ListCollector filtered to roles ending in _admin for fine-grained role picker
        access_required: ListCollectorVariable({
            question: 'Access Required',
            order: 800,
            listTable: 'sys_user_role',
            referenceQual: 'nameENDSWITH_admin',
        }),
        // ─── Temporary Access Duration (Two-Column Layout) ───
        // Duration section container: conditionally displayed when access_category is temporary
        temporary_access_duration: ContainerStartVariable({
            question: 'Temporary Access Duration',
            order: 900,
            displayTitle: true,
        }),
        // Duration section with start datetime validated by catalog client script (min 30-min lead time)
        start_date_and_time: DateTimeVariable({
            question: 'Start Date and Time',
            order: 1000,
        }),
        formatter5: ContainerSplitVariable({
            order: 1100,
        }),
        // Duration section with end datetime validated by catalog client script (end > start, min 30-min gap, max 5-day duration)
        end_date_and_time: DateTimeVariable({
            question: 'End Date and Time',
            order: 1200,
        }),
        formatter6: ContainerEndVariable({
            order: 1300,
        }),
        // ─── Audit Context & Business Justification (Two-Column Layout) ───
        request_for1: ContainerStartVariable({
            question: 'Request For',
            order: 1400,
        }),
        // need_access_for: optional task reference (Incident, Change, Story) for audit context
        need_access_for: ReferenceVariable({
            question: 'Need Access for',
            order: 1500,
            showHelp: true,
            instructions: '<p>If requesting for any specific task, please select it.</p>',
            referenceTable: 'task',
            referenceQualCondition: 'active=true',
        }),
        formatter3: ContainerSplitVariable({
            order: 1600,
        }),
        // business_justification: mandatory free-text field for approval evaluation
        business_justification: MultiLineTextVariable({
            question: 'Business Justification',
            order: 1700,
            showHelp: true,
            instructions: '<p>Please provide sensible justification for need for requested access.</p>',
            mandatory: true,
        }),
        formatter4: ContainerEndVariable({
            order: 1800,
        }),
    },
})
