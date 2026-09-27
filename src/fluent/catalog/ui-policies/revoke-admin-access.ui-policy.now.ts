/**
 * @file Catalog UI Policies — Revoke Admin Access
 * @description Declarative field visibility and validation rules for the Revoke ServiceNow Admin
 * Access catalog item. Controls dynamic form behavior:
 *
 * - policyRemoveRoleFineGrained: Shows role picker when removing fine-grained access
 * - policyRevokeRequestForReadOnly: Locks request_for field after selection
 * - policyRevokeWhichType: Shows access type selector (for "Remove Specific Access" flow)
 * - policyRevokeRitmMandatory: Shows RITM reference when revoking by original request
 *
 * @module catalog/ui-policies/revoke-admin-access
 * @scope x_1297430_sncadmin
 * @sdk-version 4.12.2
 */

import { CatalogUiPolicy } from '@servicenow/sdk/core'
import { revokeServicenowAdminAccess } from '../items/revoke-admin-access.now'

export const policyRemoveRoleFineGrained = CatalogUiPolicy({
    $id: Now.ID['policy-revoke-remove-role-fine-grained'],
    catalogItem: revokeServicenowAdminAccess,
    shortDescription: "Make 'remove_specific_admin_role' mandatory & visible depending on 'what_is_request'",
    catalogCondition: '109ab97283b39690827999c0deaad329=remove_fine_grained_access^EQ',
    appliesOnTargetRecord: true,
    appliesOnCatalogTasks: true,
    appliesOnRequestedItems: true,
    actions: [
        {
            variableName: '8e6db53683f39690827999c0deaad3ec',
            variable: 'remove_specific_admin_role',
            visible: true,
            mandatory: true,
        },
    ],
})

export const policyRevokeRequestForReadOnly = CatalogUiPolicy({
    $id: Now.ID['policy-revoke-request-for-read-only'],
    catalogItem: revokeServicenowAdminAccess,
    shortDescription: "Make 'request_for' read-only depending on 'request_for'",
    catalogCondition: '4c2bad3e833f5690827999c0deaad3c7ISNOTEMPTY^EQ',
    appliesOnTargetRecord: true,
    appliesOnCatalogTasks: true,
    appliesOnRequestedItems: true,
    actions: [
        {
            variableName: '4c2bad3e833f5690827999c0deaad3c7',
            variable: 'request_for',
            readOnly: true,
        },
    ],
})

export const policyRevokeWhichType = CatalogUiPolicy({
    $id: Now.ID['policy-revoke-which-type-mandatory'],
    catalogItem: revokeServicenowAdminAccess,
    shortDescription: "Make 'revoke_which_type_of_access' mandatory & visible depending on 'what_is_request'",
    catalogCondition: '109ab97283b39690827999c0deaad329=Remove Specific Access^EQ',
    appliesOnTargetRecord: true,
    appliesOnCatalogTasks: true,
    appliesOnRequestedItems: true,
    actions: [
        {
            variableName: '0d5c31b283f39690827999c0deaad3b3',
            variable: 'revoke_which_type_of_access',
            visible: true,
            mandatory: true,
            valueAction: 'clearValue',
        },
    ],
})

export const policyRevokeRitmMandatory = CatalogUiPolicy({
    $id: Now.ID['policy-revoke-ritm-mandatory'],
    catalogItem: revokeServicenowAdminAccess,
    shortDescription:
        "Make 'access_requested_ritm_which_needs_to_be_revoked' mandatory & visible depending on 'what_is_request'",
    catalogCondition: '109ab97283b39690827999c0deaad329=Remove Access based on requested request^EQ',
    appliesOnTargetRecord: true,
    appliesOnCatalogTasks: true,
    appliesOnRequestedItems: true,
    actions: [
        {
            variableName: 'ad6b797283f39690827999c0deaad3cf',
            variable: 'access_requested_ritm_which_needs_to_be_revoked',
            visible: true,
            mandatory: true,
        },
    ],
})
