/**
 * @file acls.now.ts
 * @description Access Control Lists (ACLs) for the Temporary Access table (`x_1297430_sncadmin_temporary_access`).
 * Enforces role-based CRUD permissions, requiring the scoped user role for operations and restricting record deletion.
 * @module acls
 * @scope x_1297430_sncadmin
 * @sdk ServiceNow Now SDK 4.12.2
 */

import { Acl } from '@servicenow/sdk/core'
import { userRole } from './roles.now'

// ─── CRUD Access Control Definitions ───

// Requires userRole to create temporary access records
Acl({
    $id: Now.ID['acl-temporary-access-create'],
    type: 'record',
    operation: 'create',
    table: 'x_1297430_sncadmin_temporary_access',
    description: 'Default create access control on x_1297430_sncadmin_temporary_access',
    roles: [userRole],
})

// Requires userRole to view temporary access records
Acl({
    $id: Now.ID['acl-temporary-access-read'],
    type: 'record',
    operation: 'read',
    table: 'x_1297430_sncadmin_temporary_access',
    description: 'Default read access control on x_1297430_sncadmin_temporary_access',
    roles: [userRole],
})

// Requires userRole to update temporary access records
Acl({
    $id: Now.ID['acl-temporary-access-write'],
    type: 'record',
    operation: 'write',
    table: 'x_1297430_sncadmin_temporary_access',
    description: 'Default write access control on x_1297430_sncadmin_temporary_access',
    roles: [userRole],
})

// ─── Deletion Access Control ───

// Delete ACL is active: false by default to enforce an audit preservation policy (records must not be deleted)
Acl({
    $id: Now.ID['acl-temporary-access-delete'],
    type: 'record',
    operation: 'delete',
    table: 'x_1297430_sncadmin_temporary_access',
    description: 'Default delete access control on x_1297430_sncadmin_temporary_access',
    roles: [userRole],
    active: false,
})
