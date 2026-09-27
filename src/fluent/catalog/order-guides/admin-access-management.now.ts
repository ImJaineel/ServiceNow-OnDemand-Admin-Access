/**
 * @file Order Guide — ServiceNow Admin Access Management
 * @description Unified order guide wizard combining all 3 catalog items (Request, Revoke, Extension)
 * into a single access management entry point. Routes users to the appropriate catalog item
 * based on their `request_type` selection.
 *
 * Uses Record() fallback throughout because the SDK has no first-class OrderGuide() DSL.
 * Manages: sc_cat_item_guide, item_option_new (variables), question_choice (dropdown options),
 * sc_cat_item_guide_items (child item mappings), sc_cat_item_catalog, sc_cat_item_category.
 *
 * @module catalog/order-guides/admin-access-management
 * @scope x_1297430_sncadmin
 * @sdk-version 4.12.2
 */

import { Record } from '@servicenow/sdk/core'
import { requestServicenowAdminAccess } from '../items/request-admin-access.now'
import { revokeServicenowAdminAccess } from '../items/revoke-admin-access.now'
import { requestTemporaryAccessExtension } from '../items/request-temporary-access-extension.now'

export const adminAccessOrderGuide = Record({
    $id: Now.ID['order-guide-admin-access-management'],
    table: 'sc_cat_item_guide',
    data: {
        name: 'ServiceNow Admin Access Management',
        short_description: 'ServiceNow Admin Access Management',
        meta: 'ServiceNow Admin Access Management',
        access_type: 'restricted',
        active: true,
        availability: 'on_both',
        billable: false,
        cascade: true,
        category: '22555319db0150104327198d1396195c',
        cost: 0,
        delivery_plan: '523da512c611228900811a37c97c2014',
        delivery_time: '1970-01-03 00:00:00',
        display_price_property: 'non_zero',
        fulfillment_automation_level: 'unspecified',
        hide_sp: false,
        ignore_price: true,
        include_items: true,
        make_item_non_conversational: false,
        mandatory_attachment: false,
        mobile_hide_price: false,
        mobile_picture_type: 'use_desktop_picture',
        no_attachment_v2: false,
        no_cart: false,
        no_cart_v2: true,
        no_delivery_time_v2: false,
        no_order: false,
        no_order_now: false,
        no_proceed_checkout: false,
        no_quantity: false,
        no_quantity_v2: false,
        no_save_as_draft: false,
        no_search: false,
        no_wishlist_v2: false,
        omit_price: false,
        order: 0,
        order_to_cart: false,
        owner: '6816f79cc0a8016401c5a33be04be441',
        price: '0',
        request_method: 'request',
        sc_catalogs: 'e0d08b13c3330100c8b837659bba8fb4',
        show_variable_help_on_load: false,
        start_closed: false,
        two_step: false,
        type: 'item',
        use_sc_layout: true,
        version: 15,
        visible_bundle: true,
        visible_guide: true,
        visible_standalone: true,
    },
})

export const orderGuideVarRequestFor = Record({
    $id: Now.ID['order-guide-var-request-for'],
    table: 'item_option_new',
    data: {
        cat_item: adminAccessOrderGuide,
        name: 'request_for',
        question_text: 'Request For',
        type: '31',
        order: '100',
        active: 'true',
        mandatory: 'true',
        read_only: 'false',
        reference: 'sys_user',
        reference_qual: 'active=true^EQ',
        reference_qual_condition: 'active=true^EQ',
        use_reference_qualifier: 'simple',
        layout: 'normal',
        visibility: '1',
        visible_bundle: 'true',
        visible_guide: 'true',
        visible_standalone: 'true',
        visible_summary: 'true',
        price_if_checked: '0',
        rec_price_if_checked: '0',
    },
})

export const orderGuideVarRequestType = Record({
    $id: Now.ID['order-guide-var-request-type'],
    table: 'item_option_new',
    data: {
        cat_item: adminAccessOrderGuide,
        name: 'request_type',
        question_text: 'Request Type',
        type: '5',
        order: '200',
        active: 'true',
        mandatory: 'true',
        include_none: 'true',
        choice_direction: 'down',
        layout: 'normal',
        visibility: '1',
        visible_bundle: 'true',
        visible_guide: 'true',
        visible_standalone: 'true',
        visible_summary: 'true',
        price_if_checked: '0',
        rec_price_if_checked: '0',
    },
})

export const choiceRequestAccess = Record({
    $id: Now.ID['choice-request-access'],
    table: 'question_choice',
    data: {
        question: orderGuideVarRequestType,
        text: 'Request Access',
        value: 'Request Access',
        order: '100',
        inactive: 'false',
        misc: '0',
        rec_misc: '0',
    },
})

export const choiceRequestExtension = Record({
    $id: Now.ID['choice-request-extension'],
    table: 'question_choice',
    data: {
        question: orderGuideVarRequestType,
        text: 'Request Temporary Access Extension',
        value: 'Request Temporary Access Extension',
        order: '200',
        inactive: 'true',
        misc: '0',
        rec_misc: '0',
    },
})

export const choiceRevokeAccess = Record({
    $id: Now.ID['choice-revoke-access'],
    table: 'question_choice',
    data: {
        question: orderGuideVarRequestType,
        text: 'Revoke Access',
        value: 'Revoke Access',
        order: '300',
        inactive: 'true',
        misc: '0',
        rec_misc: '0',
    },
})

export const guideItemRequestAccess = Record({
    $id: Now.ID['guide-item-request-access'],
    table: 'sc_cat_item_guide_items',
    data: {
        guide: adminAccessOrderGuide,
        item: requestServicenowAdminAccess,
        condition: 'IO:6a7b25be833f5690827999c0deaad346=Request Access^EQ',
        quantity: '1',
        show_quantity: 'false',
        use_sc_layout: 'true',
        ignore_mandatory_eval: 'false',
    },
})

export const guideItemRevokeAccess = Record({
    $id: Now.ID['guide-item-revoke-access'],
    table: 'sc_cat_item_guide_items',
    data: {
        guide: adminAccessOrderGuide,
        item: revokeServicenowAdminAccess,
        condition: 'IO:6a7b25be833f5690827999c0deaad346=Revoke Access^EQ',
        quantity: '1',
        show_quantity: 'false',
        use_sc_layout: 'true',
        ignore_mandatory_eval: 'false',
    },
})

export const guideItemRequestExtension = Record({
    $id: Now.ID['guide-item-request-extension'],
    table: 'sc_cat_item_guide_items',
    data: {
        guide: adminAccessOrderGuide,
        item: requestTemporaryAccessExtension,
        condition: 'IO:6a7b25be833f5690827999c0deaad346=Request Temporary Access Extension^EQ',
        quantity: '1',
        show_quantity: 'false',
        use_sc_layout: 'true',
        ignore_mandatory_eval: 'false',
    },
})

export const orderGuideCatalog = Record({
    $id: Now.ID['order-guide-catalog-link'],
    table: 'sc_cat_item_catalog',
    data: {
        sc_cat_item: adminAccessOrderGuide,
        sc_catalog: 'e0d08b13c3330100c8b837659bba8fb4',
    },
})

export const orderGuideCategory = Record({
    $id: Now.ID['order-guide-category-link'],
    table: 'sc_cat_item_category',
    data: {
        sc_cat_item: adminAccessOrderGuide,
        sc_category: '22555319db0150104327198d1396195c',
    },
})
