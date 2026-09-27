/**
 * @file navigation.now.ts
 * @description Application menu and module navigation definitions for On-Demand Admin Access.
 * Configures the left navigation menu entry and modules for accessing temporary access records.
 * @module navigation
 * @scope x_1297430_sncadmin
 * @sdk ServiceNow Now SDK 4.12.2
 */

import { ApplicationMenu, Record } from '@servicenow/sdk/core'
import { userRole } from './roles.now'

// ─── Application Menu ───

/**
 * Top-level application menu in the ServiceNow navigation filter.
 * Displayed under the 'Custom Applications' category and restricted to users with userRole.
 */
export const onDemandAdminAccessMenu = ApplicationMenu({
    $id: Now.ID['menu-on-demand-admin-access'],
    title: 'On-Demand Admin Access',
    category: 'custom_applications',
    roles: [userRole],
    active: true,
})

// ─── Application Modules ───

/**
 * Navigation module linking to the Temporary Access list view.
 * Uses the generic Record() fallback against 'sys_app_module' because the Now SDK lacks a dedicated Module() DSL.
 */
export const temporaryAccessModule = Record({
    $id: Now.ID['module-temporary-access'],
    table: 'sys_app_module',
    data: {
        title: 'Temporary Access',
        application: onDemandAdminAccessMenu,
        link_type: 'LIST',
        name: 'x_1297430_sncadmin_temporary_access',
        roles: [userRole],
        order: 100,
        active: true,
    },
})
