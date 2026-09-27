/**
 * @file script_includes.now.ts
 * @description Server-side script include definitions for On-Demand Admin Access.
 * Declares script includes that handle business logic, role checks, and catalog client interactions.
 * @module script_includes
 * @scope x_1297430_sncadmin
 * @sdk ServiceNow Now SDK 4.12.2
 */

import { ScriptInclude } from '@servicenow/sdk/core'

// ─── Script Include Definitions ───

/**
 * Client-callable GlideAjax script include (`snc_admin_access_catalog_client_callable`).
 * Provides asynchronous role verification functions consumed by catalog client scripts during request submission:
 * - `getFineGrainedAdminRoles`: Returns a list of granular *_admin roles currently assigned to the user.
 * - `doesUserHaveAdminOrSecurityAdmin`: Checks if the user already has platform admin or security_admin roles.
 *
 * Configured with `clientCallable: true` to allow invocation from browser scripts via GlideAjax.
 * Uses `protectionPolicy: 'read'` to permit other application scopes to view/read the script logic while preventing modification.
 */
export const sncAdminAccessCatalogClientCallable = ScriptInclude({
    $id: Now.ID['script-include-catalog-client-callable'],
    name: 'snc_admin_access_catalog_client_callable',
    script: Now.include('../server/snc_admin_access_catalog_client_callable.server.js'),
    apiName: 'x_1297430_sncadmin.snc_admin_access_catalog_client_callable',
    clientCallable: true,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
    protectionPolicy: 'read',
})
