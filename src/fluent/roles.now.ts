/**
 * @file roles.now.ts
 * @description Application role definitions for On-Demand Admin Access.
 * Defines scoped security roles and associates them with ServiceNow platform features.
 * @module roles
 * @scope x_1297430_sncadmin
 * @sdk ServiceNow Now SDK 4.12.2
 */

import { Role, Record } from '@servicenow/sdk/core'

// ─── Application Roles ───

/**
 * Primary application user role (`x_1297430_sncadmin.user`).
 * Serves as the security gate for all application ACLs, navigation menus, and modules.
 */
export const userRole = Role({
    $id: Now.ID['role-user'],
    name: 'x_1297430_sncadmin.user',
    description: 'On-Demand Admin Access User Role',
})

// ─── Embedded Help Role Mapping ───

/**
 * Maps the application user role to the ServiceNow embedded help system (`sys_embedded_help_role`).
 * Uses the generic Record() fallback because the Now SDK does not provide a dedicated DSL for sys_embedded_help_role.
 */
export const userEmbeddedHelpRole = Record({
    $id: Now.ID['embedded-help-role-user'],
    table: 'sys_embedded_help_role',
    data: {
        order: 10,
        role: userRole,
    },
})
