/**
 * @file privileges.now.ts
 * @description Cross-Scope Privileges (sys_scope_privilege) configuration.
 * Authorizes the scoped application (`x_1297430_sncadmin`) to perform operations
 * on global scope tables, records, and APIs necessary for role provisioning and session management.
 * @module privileges
 * @scope x_1297430_sncadmin
 * @sdk ServiceNow Now SDK 4.12.2
 */

import { CrossScopePrivilege } from '@servicenow/sdk/core'

// ─── Session Privileges ───
// Enables querying and invalidating active user sessions when terminating sessions upon access expiration or revocation.

/** Read permission on global sys_user_session table to inspect active sessions for targeted users. */
export const userSessionRead = CrossScopePrivilege({
    $id: Now.ID['privilege-sys-user-session-read'],
    operation: 'read',
    status: 'allowed',
    targetName: 'sys_user_session',
    targetScope: 'global',
    targetType: 'sys_db_object',
})

/** Delete permission on global sys_user_session table to terminate sessions when revoking elevated access. */
export const userSessionDelete = CrossScopePrivilege({
    $id: Now.ID['privilege-sys-user-session-delete'],
    operation: 'delete',
    status: 'allowed',
    targetName: 'sys_user_session',
    targetScope: 'global',
    targetType: 'sys_db_object',
})

// ─── Role Management Privileges ───
// Enables reading, creating, and deleting role assignments in sys_user_has_role to dynamically grant and revoke admin roles.

/** Read permission on global sys_user_has_role table to verify user role assignments. */
export const userHasRoleRead = CrossScopePrivilege({
    $id: Now.ID['privilege-sys-user-has-role-read'],
    operation: 'read',
    status: 'allowed',
    targetName: 'sys_user_has_role',
    targetScope: 'global',
    targetType: 'sys_db_object',
})

/** Create permission on global sys_user_has_role table to provision temporary admin roles. */
export const userHasRoleCreate = CrossScopePrivilege({
    $id: Now.ID['privilege-sys-user-has-role-create'],
    operation: 'create',
    status: 'allowed',
    targetName: 'sys_user_has_role',
    targetScope: 'global',
    targetType: 'sys_db_object',
})

/** Delete permission on global sys_user_has_role table to revoke temporary admin roles upon expiration. */
export const userHasRoleDelete = CrossScopePrivilege({
    $id: Now.ID['privilege-sys-user-has-role-delete'],
    operation: 'delete',
    status: 'allowed',
    targetName: 'sys_user_has_role',
    targetScope: 'global',
    targetType: 'sys_db_object',
})

// ─── Role Lookup Privileges ───
// Enables querying sys_user_role to resolve role definitions and validate requested roles.

/** Read permission on global sys_user_role table to inspect and validate role references. */
export const userRoleRead = CrossScopePrivilege({
    $id: Now.ID['privilege-sys-user-role-read'],
    operation: 'read',
    status: 'allowed',
    targetName: 'sys_user_role',
    targetScope: 'global',
    targetType: 'sys_db_object',
})

// ─── Catalog Request Item Privileges ───
// Enables updating requested items (RITM) in the global sc_req_item table during catalog fulfillment workflows.

/** Write permission on global sc_req_item table to update service catalog request items. */
export const reqItemWrite = CrossScopePrivilege({
    $id: Now.ID['privilege-sc-req-item-write'],
    operation: 'write',
    status: 'allowed',
    targetName: 'sc_req_item',
    targetScope: 'global',
    targetType: 'sys_db_object',
})

// ─── Scriptable API Privileges ───
// Enables invoking the Glide API properties API to retrieve application system properties from server scripts.

/** Execute permission on global 'Glide API: properties' to read system properties via gs.getProperty(). */
export const glideApiPropertiesExecute = CrossScopePrivilege({
    $id: Now.ID['privilege-glide-api-properties-execute'],
    operation: 'execute',
    status: 'allowed',
    targetName: 'Glide API: properties',
    targetScope: 'global',
    targetType: 'scriptable',
})
