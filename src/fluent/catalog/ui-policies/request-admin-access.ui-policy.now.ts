/**
 * @file Catalog UI Policies — Request Admin Access
 * @description Declarative field visibility and validation rules for the Request ServiceNow Admin
 * Access catalog item. Controls dynamic form behavior based on user selections:
 *
 * - policyStartDateMandatory: Shows/requires date fields when access_category = temporary
 * - policySecurityAdminRequired: Shows security_admin toggle when access_type = coarse_grained
 * - policyEndDateMandatory: Shows/requires end date once start date is filled (clears on change)
 * - policySecurityAdminWarning: Displays warning when security_admin = Yes (sensitive role alert)
 * - policyRequestForReadOnly: Locks request_for field after initial user selection
 * - policyAccessRequiredFineGrained: Shows role list picker when access_type = fine_grained
 *
 * @module catalog/ui-policies/request-admin-access
 * @scope x_1297430_sncadmin
 * @sdk-version 4.12.2
 */

import { CatalogUiPolicy } from '@servicenow/sdk/core'
import { requestServicenowAdminAccess } from '../items/request-admin-access.now'

export const policyStartDateMandatory = CatalogUiPolicy({
    $id: Now.ID['policy-request-start-date-mandatory'],
    catalogItem: requestServicenowAdminAccess,
    shortDescription: "Make 'start_date_and_time' mandatory & visible depending on 'access_category'",
    catalogCondition: '0707b43683771690827999c0deaad3ab=temporary^EQ',
    appliesOnTargetRecord: true,
    appliesOnCatalogTasks: true,
    appliesOnRequestedItems: true,
    actions: [
        {
            variableName: 'd20109f6833b1690827999c0deaad3dd',
            variable: 'start_date_and_time',
            visible: true,
            mandatory: true,
        },
    ],
})

export const policySecurityAdminRequired = CatalogUiPolicy({
    $id: Now.ID['policy-request-security-admin-required'],
    catalogItem: requestServicenowAdminAccess,
    shortDescription: "Make 'security_admin_required' mandatory & visible depending on 'access_type'",
    catalogCondition: 'a587f83a83771690827999c0deaad3bd=coarse_grained_access^EQ',
    appliesOnTargetRecord: true,
    appliesOnCatalogTasks: true,
    appliesOnRequestedItems: true,
    actions: [
        {
            variableName: '723281b2837b1690827999c0deaad37b',
            variable: 'security_admin_required',
            visible: true,
            mandatory: true,
        },
    ],
})

export const policyEndDateMandatory = CatalogUiPolicy({
    $id: Now.ID['policy-request-end-date-mandatory'],
    catalogItem: requestServicenowAdminAccess,
    shortDescription: "Make 'end_date_and_time' mandatory & visible depending on 'start_date_and_time'",
    catalogCondition: 'd20109f6833b1690827999c0deaad3ddISNOTEMPTY^EQ',
    appliesOnTargetRecord: true,
    appliesOnCatalogTasks: true,
    appliesOnRequestedItems: true,
    actions: [
        {
            variableName: '0e31817a833b1690827999c0deaad368',
            variable: 'end_date_and_time',
            visible: true,
            mandatory: true,
            valueAction: 'clearValue',
        },
    ],
})

export const policySecurityAdminWarning = CatalogUiPolicy({
    $id: Now.ID['policy-request-security-admin-warning'],
    catalogItem: requestServicenowAdminAccess,
    shortDescription: 'Request ServiceNow Admin Access UI Policy',
    catalogCondition: '723281b2837b1690827999c0deaad37b=Yes^EQ',
    appliesOnTargetRecord: true,
    appliesOnCatalogTasks: true,
    appliesOnRequestedItems: true,
    order: 200,
    actions: [
        {
            variableName: '723281b2837b1690827999c0deaad37b',
            variable: 'security_admin_required',
            variableMessageType: 'warning',
            variableMessage: 'Security_Admin is a sensitive role, is subject to scrutiny.',
        },
    ],
})

export const policyRequestForReadOnly = CatalogUiPolicy({
    $id: Now.ID['policy-request-for-read-only'],
    catalogItem: requestServicenowAdminAccess,
    shortDescription: "Make 'request_for' read-only depending on 'request_for'",
    catalogCondition: '1085383283371690827999c0deaad33eISNOTEMPTY^EQ',
    appliesOnTargetRecord: true,
    appliesOnCatalogTasks: true,
    appliesOnRequestedItems: true,
    actions: [
        {
            variableName: '1085383283371690827999c0deaad33e',
            variable: 'request_for',
            readOnly: true,
        },
    ],
})

export const policyAccessRequiredFineGrained = CatalogUiPolicy({
    $id: Now.ID['policy-request-access-required-fine-grained'],
    catalogItem: requestServicenowAdminAccess,
    shortDescription: "Make 'access_required' mandatory & visible depending on 'access_type'",
    catalogCondition: 'a587f83a83771690827999c0deaad3bd=fine_grained_access^EQ',
    appliesOnTargetRecord: true,
    appliesOnCatalogTasks: true,
    appliesOnRequestedItems: true,
    actions: [
        {
            variableName: '1148b4fe83771690827999c0deaad3f4',
            variable: 'access_required',
            visible: true,
            mandatory: true,
            valueAction: 'clearValue',
        },
    ],
})
